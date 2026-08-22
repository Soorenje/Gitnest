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

  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [chapterTitleInput, setChapterTitleInput] = useState("");
  const [isSubmittingChapter, setIsSubmittingChapter] = useState(false);
  const [chapterApiMessage, setChapterApiMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: "", time: "", isFree: false });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [lessonApiError, setLessonApiError] = useState<string | null>(null);

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
        const courseRes = await axios.get(`https://gitnest-backend-l3tu.onrender.com/v1/course/${courseId}`, { withCredentials: true });
        const courseData = courseRes.data.data || courseRes.data;
        setCourseTitle(courseData.name || courseData.title || "بدون عنوان");

        const curRes = await axios.get(`https://gitnest-backend-l3tu.onrender.com/v1/course/${courseId}/curriculum`, { withCredentials: true });
        const chaptersArray = curRes.data.data || [];

        const formattedChapters = chaptersArray
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          .map((chap: any) => ({
            ...chap,
            isExpanded: true,
            lessons: (chap.lessons || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          }));
        
        setChapters(formattedChapters);
      } catch (error: any) {
        setCourseTitle(`خطا: ${error.message}`);
        toast.error("خطا در دریافت اطلاعات دوره");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  const onDragEnd = async (result: any) => {
    const { source, destination, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === "chapter") {
      const newChapters = Array.from(chapters);
      const [movedChapter] = newChapters.splice(source.index, 1);
      newChapters.splice(destination.index, 0, movedChapter);
      setChapters(newChapters);

      const list = newChapters.map((chap, index) => ({ _id: chap._id, order: index + 1 }));
      try {
        const res = await apiFetch(`/chapter/course/${courseId}/reorder`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ list })
        });
        if (res.ok) toast.success("ترتیب فصل‌ها ذخیره شد");
        else toast.error("خطا در تغییر ترتیب فصل‌ها");
      } catch {
        toast.error("ارتباط با سرور برای ذخیره ترتیب قطع شد");
      }
    } 
    else if (type === "lesson") {
      if (source.droppableId !== destination.droppableId) return;

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
        const res = await apiFetch(`/lesson/chapter/${chapter._id}/reorder`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ list })
        });
        if (res.ok) toast.success("ترتیب جلسات ذخیره شد");
        else toast.error("خطا در تغییر ترتیب جلسات");
      } catch {
        toast.error("ارتباط با سرور برای ذخیره ترتیب قطع شد");
      }
    }
  };

  const toggleChapter = (chapterId: string) => {
    setChapters(chapters.map(chap => chap._id === chapterId ? { ...chap, isExpanded: !chap.isExpanded } : chap));
  };

  const openChapterModal = () => { setChapterTitleInput(""); setChapterApiMessage(null); setIsChapterModalOpen(true); };

  const handleSubmitChapter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chapterTitleInput.trim()) return;
    setIsSubmittingChapter(true); setChapterApiMessage(null);

    try {
      const res = await apiFetch(`/chapter/course/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: chapterTitleInput }),
      });
      const responseData = await res.json();
      if (res.ok) {
        toast.success("فصل جدید اضافه شد.");
        setChapters([...chapters, { ...responseData, isExpanded: true, lessons: [] }]);
        setIsChapterModalOpen(false);
      } else {
        setChapterApiMessage({ text: responseData.message || "خطایی رخ داد.", type: "error" });
      }
    } catch {
      setChapterApiMessage({ text: "خطا در ارتباط با سرور.", type: "error" });
    } finally {
      setIsSubmittingChapter(false);
    }
  };

  const openDeleteChapterModal = (chapterId: string, title: string) => {
    setConfirmText("");
    setConfirmModal({ isOpen: true, type: "deleteChapter", targetId: chapterId, targetTitle: title });
  };

  const openLessonModal = (chapterId: string) => {
    setActiveChapterId(chapterId); setLessonForm({ title: "", time: "", isFree: false });
    setSelectedFile(null); setUploadProgress(0); setLessonApiError(null); setShowLessonModal(true);
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
        let timeString = hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
      setLessonApiError("لطفاً فیلدها و فایل را وارد کنید."); return;
    }
    
    setIsSavingLesson(true); setLessonApiError(null);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await axios.post("https://gitnest-backend-l3tu.onrender.com/v1/lesson/upload/file", formData, {
        withCredentials: true, 
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      });

      const { fileUrl, type } = uploadRes.data;

      const finalLessonData = { title: lessonForm.title, time: lessonForm.time, isFree: lessonForm.isFree, type: type, fileUrl: fileUrl };

      const res = await apiFetch(`/lesson/chapter/${activeChapterId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalLessonData),
      });

      if (res.ok) {
        toast.success("جلسه آپلود و ذخیره شد."); 
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
          toast.success("فصل حذف شد."); 
        } else toast.error("مشکلی پیش آمد!"); 
      } else if (confirmModal.type === "deleteLesson") {
        const res = await apiFetch(`/lesson/${confirmModal.targetId}`, { method: "DELETE" });
        if (res.ok) {
          setChapters(chapters.map(chap => ({ ...chap, lessons: chap.lessons.filter((l: any) => l._id !== confirmModal.targetId) })));
          setConfirmModal({ isOpen: false, type: null, targetId: null, targetTitle: "" });
          toast.success("جلسه حذف شد."); 
        } else toast.error("مشکلی پیش آمد!"); 
      }
    } catch {
      toast.error("ارتباط با سرور برقرار نشد!"); 
    } finally {
      setIsDeleting(false); setConfirmText("");
    }
  };

  if (!isMounted || isLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg">
        <div className="flex items-center gap-3 md:gap-4">
          <Link href="/instructor/courses" className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowRight size={18} className="md:w-5 md:h-5" />
          </Link>
          <h2 className="text-base md:text-xl font-bold text-white line-clamp-1">ویرایش: {courseTitle}</h2>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-2 md:p-3 flex flex-row lg:flex-col gap-2 overflow-x-auto scrollbar-hide lg:sticky lg:top-28">
            <button onClick={() => setActiveTab("basics")} className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium whitespace-nowrap transition-all ${activeTab === "basics" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
              <Edit2 size={16} className="md:w-[18px] md:h-[18px]" /> اطلاعات پایه
            </button>
            <button onClick={() => setActiveTab("curriculum")} className={`flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium whitespace-nowrap transition-all ${activeTab === "curriculum" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
              <div className="flex items-center gap-2 md:gap-3"><Video size={16} className="md:w-[18px] md:h-[18px]" /> سرفصل‌ها و جلسات</div>
              <CheckCircle2 size={14} className="text-green-500 hidden lg:block" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6 w-full max-w-full overflow-hidden">
          {activeTab === "curriculum" && (
            <div className="animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-lg md:text-xl font-bold text-white">مدیریت سرفصل‌ها</h3>
                <button onClick={openChapterModal} className="flex items-center justify-center gap-2 px-4 md:px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs md:text-sm font-medium hover:shadow-lg transition-all w-full sm:w-auto">
                  <Plus size={16} /> فصل جدید
                </button>
              </div>

              {chapters.length === 0 && (
                <div className="text-center py-10 text-xs md:text-sm text-zinc-500 bg-white/[0.01] rounded-2xl border border-white/5 mb-4">هنوز فصلی ثبت نشده است.</div>
              )}

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="chapters-list" type="chapter">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {chapters.map((chapter, index) => (
                        <Draggable key={chapter._id} draggableId={chapter._id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} className={`bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${snapshot.isDragging ? "shadow-2xl shadow-blue-500/20 border-blue-500/50" : ""}`}>
                              
                              <div className="p-3 md:p-4 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors border-b border-transparent data-[expanded=true]:border-white/10" data-expanded={chapter.isExpanded}>
                                <div className="flex items-center gap-2 md:gap-3">
                                  <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-white p-1">
                                    <GripVertical size={16} className="md:w-[18px] md:h-[18px]" />
                                  </div>
                                  <h4 className="text-white font-bold text-xs md:text-base cursor-pointer line-clamp-1" onClick={() => toggleChapter(chapter._id)}>
                                    فصل {index + 1}: {chapter.title}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2 md:gap-3">
                                  <span className="text-[10px] md:text-xs text-zinc-500 hidden sm:block">{(chapter.lessons || []).length} جلسه</span>
                                  <button onClick={(e) => { e.stopPropagation(); openDeleteChapterModal(chapter._id, chapter.title); }} className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} className="md:w-4 md:h-4" /></button>
                                  <div onClick={() => toggleChapter(chapter._id)} className="cursor-pointer w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                                    {chapter.isExpanded ? <ChevronUp size={14} className="md:w-4 md:h-4" /> : <ChevronDown size={14} className="md:w-4 md:h-4" />}
                                  </div>
                                </div>
                              </div>

                              {chapter.isExpanded && (
                                <Droppable droppableId={chapter._id} type="lesson">
                                  {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="p-3 md:p-4 bg-[#0a1024]/50 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                      {(chapter.lessons || []).map((lesson: any, idx: number) => (
                                        <Draggable key={lesson._id} draggableId={lesson._id} index={idx}>
                                          {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} className={`group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-white/[0.02] border transition-colors gap-3 ${snapshot.isDragging ? "border-blue-500/50 bg-blue-500/10" : "border-white/5 hover:border-white/10"}`}>
                                              <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto overflow-hidden">
                                                <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 p-1 shrink-0"><GripVertical size={14} className="md:w-4 md:h-4" /></div>
                                                <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 ${lesson.type === 'video' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                                  {lesson.type === 'video' ? <Video size={12} className="md:w-3.5 md:h-3.5" /> : <FileText size={12} className="md:w-3.5 md:h-3.5" />}
                                                </div>
                                                <div className="overflow-hidden">
                                                  <div className="text-xs md:text-sm font-medium text-zinc-200 line-clamp-1">{idx + 1}. {lesson.title}</div>
                                                  <div className="text-[9px] md:text-[10px] text-zinc-500">{lesson.type === 'video' ? 'ویدیو' : 'فایل'} • {lesson.time}</div>
                                                </div>
                                              </div>
                                              <div className="flex items-center justify-end sm:justify-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openDeleteLessonModal(lesson._id, lesson.title)} className="p-1.5 md:p-2 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={12} className="md:w-3.5 md:h-3.5" /></button>
                                              </div>
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                      <button onClick={() => openLessonModal(chapter._id)} className="w-full mt-2 py-2.5 md:py-3 rounded-xl border border-dashed border-white/10 text-zinc-400 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-xs md:text-sm font-medium flex items-center justify-center gap-2">
                                        <Plus size={14} className="md:w-4 md:h-4" /> افزودن جلسه جدید
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
          {activeTab === "basics" && (
            <div className="text-center py-20 text-zinc-500 text-sm">بخش ویرایش اطلاعات پایه به زودی فعال می‌شود.</div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isChapterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-base md:text-lg font-bold text-white">افزودن فصل جدید</h3>
              <button onClick={() => setIsChapterModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmitChapter} className="p-5 md:p-6 flex flex-col gap-4">
              {chapterApiMessage && <div className={`p-3 rounded-xl text-xs md:text-sm text-center border ${chapterApiMessage.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{chapterApiMessage.text}</div>}
              <div>
                <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">عنوان فصل</label>
                <input type="text" value={chapterTitleInput} onChange={(e) => setChapterTitleInput(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs md:text-sm focus:border-blue-500" placeholder="مثال: فصل اول: مقدمات" required />
              </div>
              <div className="mt-2 flex gap-2 md:gap-3">
                <button type="submit" disabled={isSubmittingChapter} className="flex-1 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs md:text-sm">{isSubmittingChapter ? <Loader2 className="w-4 h-4 animate-spin mx-auto"/> : "ایجاد فصل"}</button>
                <button type="button" onClick={() => setIsChapterModalOpen(false)} className="px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-white/5 text-zinc-300 text-xs md:text-sm">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLessonModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-base md:text-lg font-bold text-white">افزودن محتوای جدید</h3>
              <button onClick={() => setShowLessonModal(false)} disabled={isSavingLesson} className="text-zinc-500 hover:text-white bg-white/5 p-1.5 rounded-lg disabled:opacity-50"><X size={18} /></button>
            </div>
            <div className="p-5 md:p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              {lessonApiError && <div className="p-3 rounded-xl text-xs md:text-sm text-center border bg-red-500/10 border-red-500/20 text-red-400">{lessonApiError}</div>}
              <div>
                <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">فایل جلسه (ویدیو یا فایل فشرده)</label>
                <div className={`relative w-full border-2 border-dashed rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center transition-all ${selectedFile ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-white/20 bg-white/5'}`}>
                  <input type="file" disabled={isSavingLesson} onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" accept="video/*,.pdf,.zip,.rar" />
                  {selectedFile ? (
                    <><div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 md:mb-3"><File size={20} className="md:w-6 md:h-6" /></div><span className="text-xs md:text-sm font-medium text-white break-all">{selectedFile.name}</span></>
                  ) : (
                    <><div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center mb-2 md:mb-3"><UploadCloud size={20} className="md:w-6 md:h-6" /></div><span className="text-xs md:text-sm text-zinc-300">برای انتخاب فایل کلیک کنید</span></>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">عنوان جلسه</label>
                  <input type="text" disabled={isSavingLesson} value={lessonForm.title} onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 text-white text-xs md:text-sm focus:border-blue-500 disabled:opacity-50" placeholder="مثال: آموزش نصب ریکت" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">مدت زمان</label>
                  <input type="text" disabled={isSavingLesson || (selectedFile !== null && !selectedFile.type.startsWith("video/"))} value={lessonForm.time} onChange={(e) => setLessonForm({...lessonForm, time: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 text-white text-xs md:text-sm focus:border-blue-500 disabled:opacity-50" dir="ltr" placeholder="12:30" />
                </div>
              </div>
              {isSavingLesson && (
                <div className="w-full mt-2"><div className="flex justify-between text-[10px] md:text-xs mb-1 md:mb-2"><span className="text-zinc-400">آپلود و ذخیره...</span><span className="text-blue-400">{uploadProgress}%</span></div><div className="w-full h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div></div></div>
              )}
              <div className="mt-2 flex gap-2 md:gap-3">
                <button onClick={handleSaveLesson} disabled={isSavingLesson || !selectedFile} className="flex-1 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs md:text-sm hover:shadow-lg flex justify-center items-center disabled:opacity-50"><Loader2 size={16} className={`animate-spin ${isSavingLesson ? "block" : "hidden"} mx-auto`} />{!isSavingLesson && "ذخیره جلسه"}</button>
                <button onClick={() => setShowLessonModal(false)} disabled={isSavingLesson} className="px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-white/5 text-zinc-300 text-xs md:text-sm disabled:opacity-50">انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0a1024] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-sm shadow-2xl p-5 md:p-6 text-center">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 bg-red-500/10 text-red-500"><AlertTriangle size={24} /></div>
            <h3 className="text-base md:text-lg font-bold text-white mb-2">{confirmModal.type === "deleteChapter" ? "حذف فصل" : "حذف جلسه"}</h3>
            <div className="w-full bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl mb-4 md:mb-6 mt-4">
              <label className="block text-[10px] md:text-xs text-zinc-400 mb-2">تایپ کنید <span className="text-white font-bold">CONFIRM</span>:</label>
              <input type="text" dir="ltr" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 md:py-2.5 text-white text-center text-xs md:text-sm focus:border-red-500" />
            </div>
            <div className="flex gap-2 md:gap-3 w-full">
              <button onClick={handleConfirmDelete} disabled={confirmText !== "CONFIRM" || isDeleting} className={`flex-1 py-2.5 md:py-3 rounded-xl text-white text-xs md:text-sm flex justify-center items-center ${confirmText === "CONFIRM" ? "bg-red-600" : "bg-white/5 text-zinc-500"}`}>{isDeleting ? <Loader2 className="w-4 h-4 animate-spin"/> : "تایید"}</button>
              <button onClick={() => { setConfirmModal({ isOpen: false, type: null, targetId: null, targetTitle: "" }); setConfirmText(""); }} disabled={isDeleting} className="px-4 md:px-5 py-2.5 md:py-3 rounded-xl border border-white/10 text-zinc-300 text-xs md:text-sm">لغو</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}