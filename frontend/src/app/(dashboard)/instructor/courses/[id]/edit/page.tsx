"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Save, Plus, GripVertical, Video, FileText, 
  ChevronDown, ChevronUp, Trash2, Edit2, 
  CheckCircle2, ArrowRight, Loader2, X, UploadCloud, File, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner"; 
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; 
import { apiFetch } from "./../../../../../../utils/apiFetch"; 

export default function CourseEditorPage() {
  const params = useParams();
  const courseId = params.id as string;

  const [isMounted, setIsMounted] = useState(false); 
  const [activeTab, setActiveTab] = useState("curriculum");
  const [chapters, setChapters] = useState<any[]>([]);
  const [courseTitle, setCourseTitle] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);

  // استیت‌های مُدال فصل
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [chapterTitleInput, setChapterTitleInput] = useState("");
  const [isSubmittingChapter, setIsSubmittingChapter] = useState(false);
  const [chapterApiMessage, setChapterApiMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // استیت‌های مُدال جلسه و آپلود فایل
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: "", time: "", isFree: false });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [lessonApiError, setLessonApiError] = useState<string | null>(null);

  // استیت‌های مُدال تاییدیه حذف
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "deleteChapter" | "deleteLesson" | null;
    targetId: string | null;
    targetTitle: string;
  }>({ isOpen: false, type: null, targetId: null, targetTitle: "" });
  
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setIsMounted(true); 
    
    const fetchCourseData = async () => {
      if (!courseId) return;
      
      try {
        setIsLoading(true);

        const courseRes = await axios.get(`http://localhost:8000/v1/course/${courseId}`, {
          withCredentials: true 
        });
        const courseData = courseRes.data.data || courseRes.data;
        setCourseTitle(courseData.name || courseData.title || "بدون عنوان");

        const curRes = await axios.get(`http://localhost:8000/v1/course/${courseId}/curriculum`, {
          withCredentials: true
        });
        
        const chaptersArray = curRes.data.data || [];

        // مرتب‌سازی اولیه بر اساس فیلد order
        const formattedChapters = chaptersArray
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          .map((chap: any) => ({
            ...chap,
            isExpanded: true,
            lessons: (chap.lessons || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          }));
        
        setChapters(formattedChapters);

      } catch (error: any) {
        console.error("خطای ارتباط با بک‌اند:", error);
        setCourseTitle(`خطا: ${error.message}`);
        toast.error("خطا در دریافت اطلاعات دوره");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // ------------------------------------------------
  // 🚀 تابع هندل کردن اتمام جابجایی (Drag End)
  // ------------------------------------------------
  const onDragEnd = async (result: any) => {
    const { source, destination, type } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === "chapter") {
      // آپدیت سریع State فصل‌ها
      const newChapters = Array.from(chapters);
      const [movedChapter] = newChapters.splice(source.index, 1);
      newChapters.splice(destination.index, 0, movedChapter);
      setChapters(newChapters);

      const list = newChapters.map((chap, index) => ({ _id: chap._id, order: index + 1 }));
      try {
        // 💡 آدرس جدید شما برای مرتب‌سازی فصل‌ها: /chapter/course/:courseId/reorder
        const res = await apiFetch(`/chapter/course/${courseId}/reorder`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify({ list })
        });
        
        if (res.ok) {
          toast.success("ترتیب فصل‌ها ذخیره شد");
        } else {
          const errorData = await res.json().catch(() => ({}));
          toast.error(`ارور سرور: ${errorData.message || "خطا در تغییر ترتیب فصل‌ها"}`);
        }
      } catch (error) {
        toast.error("ارتباط با سرور برای ذخیره ترتیب قطع شد");
      }
    } 
    else if (type === "lesson") {
      // جلوگیری از جابجایی جلسه به یک فصل دیگر
      if (source.droppableId !== destination.droppableId) return;

      // آپدیت سریع State جلسات در همان فصل
      const chapterIndex = chapters.findIndex(c => c._id === source.droppableId);
      const chapter = chapters[chapterIndex];
      const newLessons = Array.from(chapter.lessons || []);
      
      const [movedLesson] = newLessons.splice(source.index, 1);
      newLessons.splice(destination.index, 0, movedLesson);

      const newChapters = [...chapters];
      newChapters[chapterIndex] = { ...chapter, lessons: newLessons };
      setChapters(newChapters);

      const list = newLessons.map((les: any, index) => ({ _id: les._id, order: index + 1 }));
      try {
        // 💡 آدرس مرتب‌سازی جلسات: /lesson/chapter/:chapterId/reorder
        const res = await apiFetch(`/lesson/chapter/${chapter._id}/reorder`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ list })
        });
        
        if (res.ok) {
          toast.success("ترتیب جلسات ذخیره شد");
        } else {
          const errorData = await res.json().catch(() => ({}));
          toast.error(`ارور سرور: ${errorData.message || "خطا در تغییر ترتیب جلسات"}`);
        }
      } catch (error) {
        toast.error("ارتباط با سرور برای ذخیره ترتیب قطع شد");
      }
    }
  };

  const toggleChapter = (chapterId: string) => {
    setChapters(chapters.map(chap => 
      chap._id === chapterId ? { ...chap, isExpanded: !chap.isExpanded } : chap
    ));
  };

  // ------------------------------------------------
  // توابع مدیریت ایجاد و حذف
  // ------------------------------------------------
  const openChapterModal = () => {
    setChapterTitleInput("");
    setChapterApiMessage(null);
    setIsChapterModalOpen(true);
  };

  const handleSubmitChapter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chapterTitleInput.trim()) return;
    
    setIsSubmittingChapter(true);
    setChapterApiMessage(null);

    try {
      const res = await apiFetch(`/chapter/course/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: chapterTitleInput }),
      });
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        setChapterApiMessage({ text: "خطا: سرور پاسخ نامعتبر برگرداند.", type: "error" });
        return;
      }

      const responseData = await res.json();
      
      if (res.ok) {
        toast.success("فصل جدید با موفقیت اضافه شد.");
        setChapters([...chapters, { ...responseData, isExpanded: true, lessons: [] }]);
        setIsChapterModalOpen(false);
      } else {
        setChapterApiMessage({ text: responseData.message || "خطایی رخ داد.", type: "error" });
      }
    } catch (error) {
      setChapterApiMessage({ text: "خطا در برقراری ارتباط با سرور.", type: "error" });
    } finally {
      setIsSubmittingChapter(false);
    }
  };

  const openDeleteChapterModal = (chapterId: string, title: string) => {
    setConfirmText("");
    setConfirmModal({ isOpen: true, type: "deleteChapter", targetId: chapterId, targetTitle: title });
  };

  const openLessonModal = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setLessonForm({ title: "", time: "", isFree: false });
    setSelectedFile(null);
    setUploadProgress(0);
    setLessonApiError(null);
    setShowLessonModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration; 
        
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        
        let timeString = hours > 0 
          ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        setLessonForm(prev => ({ ...prev, time: timeString }));
      };
      
      video.src = URL.createObjectURL(file);
    } else {
      setLessonForm(prev => ({ ...prev, time: "-" }));
    }
  };

  const handleSaveLesson = async () => {
    const isVideo = selectedFile?.type.startsWith("video/");
    
    if (!lessonForm.title || !selectedFile || !activeChapterId || (isVideo && !lessonForm.time)) {
      setLessonApiError("لطفاً تمام فیلدهای مورد نیاز و فایل جلسه را وارد کنید.");
      return;
    }
    
    setIsSavingLesson(true);
    setLessonApiError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await axios.post("http://localhost:8000/v1/lesson/upload/file", formData, {
        withCredentials: true, 
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        }
      });

      const { fileUrl, type } = uploadRes.data;

      const finalLessonData = {
        title: lessonForm.title,
        time: lessonForm.time,
        isFree: lessonForm.isFree,
        type: type, 
        fileUrl: fileUrl,
      };

      const res = await apiFetch(`/lesson/chapter/${activeChapterId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalLessonData),
      });

      if (res.ok) {
        toast.success("جلسه با موفقیت آپلود و ذخیره شد."); 
        setTimeout(() => window.location.reload(), 1000); 
      } else {
        const errorData = await res.json();
        setLessonApiError(errorData.message || "خطا در ثبت جلسه");
      }
    } catch (error: any) {
      setLessonApiError(error.response?.data?.message || "خطا در آپلود فایل.");
      setUploadProgress(0);
    } finally {
      setIsSavingLesson(false);
    }
  };

  const openDeleteLessonModal = (lessonId: string, title: string) => {
    setConfirmText("");
    setConfirmModal({ isOpen: true, type: "deleteLesson", targetId: lessonId, targetTitle: title });
  };

  const handleConfirmDelete = async () => {
    if (confirmText !== "CONFIRM" || !confirmModal.targetId) return;
    setIsDeleting(true);
    
    try {
      if (confirmModal.type === "deleteChapter") {
        const res = await apiFetch(`/chapter/${confirmModal.targetId}`, { method: "DELETE" });
        if (res.ok) {
          setChapters(chapters.filter(chap => chap._id !== confirmModal.targetId));
          setConfirmModal({ isOpen: false, type: null, targetId: null, targetTitle: "" });
          toast.success("فصل مورد نظر با موفقیت حذف شد."); 
        } else {
          const err = await res.json().catch(()=>({}));
          toast.error(err.message || "مشکلی در حذف فصل پیش آمد!"); 
        }
      } else if (confirmModal.type === "deleteLesson") {
        const res = await apiFetch(`/lesson/${confirmModal.targetId}`, { method: "DELETE" });
        if (res.ok) {
          setChapters(chapters.map(chap => ({
            ...chap,
            lessons: chap.lessons.filter((l: any) => l._id !== confirmModal.targetId)
          })));
          setConfirmModal({ isOpen: false, type: null, targetId: null, targetTitle: "" });
          toast.success("جلسه با موفقیت حذف شد."); 
        } else {
          const err = await res.json().catch(()=>({}));
          toast.error(err.message || "مشکلی در حذف جلسه پیش آمد!"); 
        }
      }
    } catch (error) {
      toast.error("ارتباط با سرور برقرار نشد!"); 
    } finally {
      setIsDeleting(false);
      setConfirmText("");
    }
  };

  if (!isMounted || isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white/[0.02] border border-white/5 rounded-3xl p-4 md:p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/instructor/courses" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowRight size={20} />
          </Link>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white mb-1">ویرایش: {courseTitle || "در حال بارگذاری..."}</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-3 flex flex-row lg:flex-col gap-2 overflow-x-auto scrollbar-hide sticky top-28">
            <button 
              onClick={() => setActiveTab("basics")}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === "basics" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Edit2 size={18} /> اطلاعات پایه
            </button>
            <button 
              onClick={() => setActiveTab("curriculum")}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === "curriculum" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3"><Video size={18} /> سرفصل‌ها و جلسات</div>
              <CheckCircle2 size={14} className="text-green-500" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "curriculum" && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">مدیریت سرفصل‌ها</h3>
                <button onClick={openChapterModal} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                  <Plus size={16} /> فصل جدید
                </button>
              </div>

              {chapters.length === 0 && (
                <div className="text-center py-10 text-zinc-500 bg-white/[0.01] rounded-2xl border border-white/5 mb-4">
                  هنوز فصلی برای این دوره ثبت نشده است.
                </div>
              )}

              {/* ------------------------------------------------ */}
              {/* کانتکست اصلی Drag and Drop */}
              {/* ------------------------------------------------ */}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="chapters-list" type="chapter">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {chapters.map((chapter, index) => (
                        <Draggable key={chapter._id} draggableId={chapter._id} index={index}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef} 
                              {...provided.draggableProps} 
                              className={`bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${snapshot.isDragging ? "shadow-2xl shadow-blue-500/20 border-blue-500/50" : ""}`}
                            >
                              
                              {/* Chapter Header */}
                              <div 
                                className="p-4 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors border-b border-transparent data-[expanded=true]:border-white/10"
                                data-expanded={chapter.isExpanded}
                              >
                                <div className="flex items-center gap-3">
                                  <div 
                                    {...provided.dragHandleProps} 
                                    className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-white p-1"
                                  >
                                    <GripVertical size={18} />
                                  </div>
                                  <h4 
                                    className="text-white font-bold text-sm md:text-base cursor-pointer"
                                    onClick={() => toggleChapter(chapter._id)}
                                  >
                                    فصل {index + 1}: {chapter.title}
                                  </h4>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-zinc-500 hidden sm:block">{(chapter.lessons || []).length} جلسه</span>
                                  
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); openDeleteChapterModal(chapter._id, chapter.title); }}
                                    className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>

                                  <div onClick={() => toggleChapter(chapter._id)} className="cursor-pointer w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                                    {chapter.isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                  </div>
                                </div>
                              </div>

                              {/* Lessons List */}
                              {chapter.isExpanded && (
                                <Droppable droppableId={chapter._id} type="lesson">
                                  {(provided) => (
                                    <div 
                                      {...provided.droppableProps} 
                                      ref={provided.innerRef} 
                                      className="p-4 bg-[#0a1024]/50 space-y-2 animate-in slide-in-from-top-2 duration-200"
                                    >
                                      {(chapter.lessons || []).map((lesson: any, idx: number) => (
                                        <Draggable key={lesson._id} draggableId={lesson._id} index={idx}>
                                          {(provided, snapshot) => (
                                            <div 
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              className={`group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border transition-colors ${snapshot.isDragging ? "border-blue-500/50 bg-blue-500/10" : "border-white/5 hover:border-white/10"}`}
                                            >
                                              <div className="flex items-center gap-3">
                                                <div 
                                                  {...provided.dragHandleProps} 
                                                  className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 p-1"
                                                >
                                                  <GripVertical size={16} />
                                                </div>
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${lesson.type === 'video' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                                  {lesson.type === 'video' ? <Video size={14} /> : <FileText size={14} />}
                                                </div>
                                                <div>
                                                  <div className="text-sm font-medium text-zinc-200">{idx + 1}. {lesson.title}</div>
                                                  <div className="text-[10px] text-zinc-500">{lesson.type === 'video' ? 'ویدیو' : 'فایل ضمیمه'} • {lesson.time}</div>
                                                </div>
                                              </div>
                                              
                                              <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                <button 
                                                  onClick={() => openDeleteLessonModal(lesson._id, lesson.title)}
                                                  className="p-2 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                                >
                                                  <Trash2 size={14} />
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}

                                      <button 
                                        onClick={() => openLessonModal(chapter._id)}
                                        className="w-full mt-2 py-3 rounded-xl border border-dashed border-white/10 text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-sm font-medium flex items-center justify-center gap-2"
                                      >
                                        <Plus size={16} /> افزودن جلسه جدید
                                      </button>
                                    </div>
                                  )}
                                </Droppable>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* مُدال‌ها */}
      {/* ------------------------------------------------ */}
      
      {isChapterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white">افزودن فصل جدید</h3>
              <button onClick={() => setIsChapterModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmitChapter} className="p-6 flex flex-col gap-4">
              {chapterApiMessage && (
                <div className={`p-3 rounded-xl text-sm text-center border ${chapterApiMessage.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                  {chapterApiMessage.text}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">عنوان فصل</label>
                <input 
                  type="text" 
                  value={chapterTitleInput}
                  onChange={(e) => setChapterTitleInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                  placeholder="مثال: فصل اول: مقدمات"
                  required
                />
              </div>
              <div className="mt-4 flex gap-3">
                <button type="submit" disabled={isSubmittingChapter} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all flex justify-center items-center">
                  {isSubmittingChapter ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "ایجاد فصل"}
                </button>
                <button type="button" onClick={() => setIsChapterModalOpen(false)} className="px-5 py-3 rounded-xl bg-white/5 text-zinc-300 text-sm font-medium hover:bg-white/10 transition-colors">
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLessonModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white">افزودن محتوای جدید</h3>
              <button onClick={() => setShowLessonModal(false)} disabled={isSavingLesson} className="text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg disabled:opacity-50"><X size={20} /></button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              {lessonApiError && (
                <div className="p-3 rounded-xl text-sm text-center border bg-red-500/10 border-red-500/20 text-red-400">
                  {lessonApiError}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">فایل جلسه (ویدیو یا فایل فشرده/PDF)</label>
                <div className={`relative w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all ${selectedFile ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}>
                  <input type="file" disabled={isSavingLesson} onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" accept="video/*,.pdf,.zip,.rar" />
                  {selectedFile ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3"><File size={24} /></div>
                      <span className="text-sm font-medium text-white text-center break-all">{selectedFile.name}</span>
                      <span className="text-xs text-zinc-500 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center mb-3"><UploadCloud size={24} /></div>
                      <span className="text-sm font-medium text-zinc-300">برای انتخاب فایل کلیک کنید</span>
                      <span className="text-xs text-zinc-500 mt-1">MP4, MKV, PDF, ZIP (حداکثر 500MB)</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-[2]">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">عنوان جلسه</label>
                  <input type="text" disabled={isSavingLesson} value={lessonForm.title} onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50" placeholder="مثال: آموزش نصب ریکت" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">مدت زمان</label>
                  <input type="text" disabled={isSavingLesson || (selectedFile !== null && !selectedFile.type.startsWith("video/"))} value={lessonForm.time} onChange={(e) => setLessonForm({...lessonForm, time: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" placeholder="12:30" />
                </div>
              </div>

              {isSavingLesson && (
                <div className="w-full">
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-zinc-400">در حال آپلود فایل و ذخیره...</span>
                    <span className="text-blue-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
              <div className="mt-2 flex gap-3">
                <button onClick={handleSaveLesson} disabled={isSavingLesson || !selectedFile} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSavingLesson ? <Loader2 size={18} className="animate-spin" /> : "آپلود و ذخیره جلسه"}
                </button>
                <button onClick={() => setShowLessonModal(false)} disabled={isSavingLesson} className="px-5 py-3 rounded-xl bg-white/5 text-zinc-300 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50">انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-red-500/10 text-red-500"><AlertTriangle size={28} /></div>
            <h3 className="text-lg font-bold text-white mb-2">{confirmModal.type === "deleteChapter" ? "حذف دائمی فصل" : "حذف دائمی جلسه"}</h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              آیا از حذف کامل {confirmModal.type === "deleteChapter" ? "فصل" : "جلسه"} <span className="text-white font-bold">{confirmModal.targetTitle}</span> {confirmModal.type === "deleteChapter" && "و تمام جلسات آن "} مطمئن هستید؟ این عملیات غیرقابل بازگشت است.
            </p>
            <div className="w-full bg-white/5 border border-white/10 p-4 rounded-xl mb-6">
              <label className="block text-xs font-medium text-zinc-400 mb-2">برای تایید، کلمه <span className="text-white font-bold tracking-widest">CONFIRM</span> را تایپ کنید:</label>
              <input type="text" dir="ltr" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="CONFIRM" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white text-center tracking-widest text-sm focus:outline-none focus:border-red-500 transition-colors" />
            </div>
            <div className="flex gap-3 w-full">
              <button onClick={handleConfirmDelete} disabled={confirmText !== "CONFIRM" || isDeleting} className={`flex-1 py-3 rounded-xl text-white text-sm font-medium transition-all flex justify-center items-center ${confirmText !== "CONFIRM" ? "bg-white/5 text-zinc-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/25"}`}>
                {isDeleting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "تایید عملیات"}
              </button>
              <button onClick={() => { setConfirmModal({ isOpen: false, type: null, targetId: null, targetTitle: "" }); setConfirmText(""); }} disabled={isDeleting} className="px-5 py-3 rounded-xl bg-transparent border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50">لغو</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}