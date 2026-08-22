"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Clock, BookOpen, Loader2, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "./../../../../utils/apiFetch"; 
import { useRouter } from "next/navigation";

export default function InstructorExamsPage() {
  const router = useRouter();
  
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isMainSelectOpen, setIsMainSelectOpen] = useState(false);
  const [isModalSelectOpen, setIsModalSelectOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: "", slug: "", course: "", timeLimit: 0, description: "" });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiFetch("/course/instructor/courses"); 
        if (res.ok) {
          const data = await res.json();
          const coursesList = Array.isArray(data) ? data : (data.data || []);
          setCourses(coursesList);
          if (coursesList.length > 0) {
            setSelectedCourseId(coursesList[0]._id);
            setFormData(prev => ({ ...prev, course: coursesList[0]._id }));
          }
        }
      } catch (error) {
        toast.error("ارتباط با سرور برقرار نشد");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch(`/exam/instructor/course/${selectedCourseId}`);
        if (res.ok) {
          const data = await res.json();
          setExams(Array.isArray(data) ? data : (data.data || []));
        } else setExams([]);
      } catch (error) {
        toast.error("خطا در دریافت آزمون‌ها");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, [selectedCourseId]);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.course) return toast.error("لطفا فیلدهای ضروری را پر کنید");

    setIsCreating(true);
    try {
      const res = await apiFetch("/exam", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("آزمون با موفقیت ایجاد شد!");
        setIsModalOpen(false);
        router.push(`/instructor/exams/${result._id || result.data?._id}/edit`);
      } else toast.error(result.message || "خطا در ساخت آزمون");
    } catch {
      toast.error("مشکل در ارتباط با سرور");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">مدیریت آزمون‌ها</h2>
          <p className="text-xs md:text-sm text-zinc-400">آزمون‌های دوره‌های خود را بسازید و سوالات را مدیریت کنید.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs md:text-sm font-medium hover:shadow-lg transition-all w-full sm:w-auto">
          <Plus size={16} className="md:w-[18px] md:h-[18px]" /> ساخت آزمون جدید
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10">
        <label className="text-xs md:text-sm text-zinc-300 font-medium whitespace-nowrap">نمایش آزمون‌های دوره:</label>
        <div className="relative flex-1 w-full sm:max-w-xs">
          <div onClick={() => setIsMainSelectOpen(!isMainSelectOpen)} className="flex items-center justify-between w-full bg-black/40 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 text-white text-xs md:text-sm cursor-pointer hover:border-white/20 transition-colors">
            <span className="truncate">{courses.find(c => c._id === selectedCourseId)?.name || "انتخاب کنید..."}</span>
            <ChevronDown size={14} className={`text-zinc-400 transition-transform md:w-4 md:h-4 ${isMainSelectOpen ? 'rotate-180' : ''}`} />
          </div>
          {isMainSelectOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsMainSelectOpen(false)}></div>
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#0a1024] border border-white/10 rounded-xl shadow-2xl overflow-y-auto max-h-48 custom-scrollbar">
                {courses.map(c => (
                  <div key={c._id} onClick={() => { setSelectedCourseId(c._id); setIsMainSelectOpen(false); }} className={`px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm cursor-pointer transition-colors ${selectedCourseId === c._id ? 'bg-blue-600/20 text-blue-400' : 'text-zinc-300 hover:bg-white/5'}`}>{c.name || c.title}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500 w-8 h-8 md:w-10 md:h-10"/></div>
      ) : exams.length === 0 ? (
        <div className="text-center py-16 md:py-20 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl">
          <BookOpen size={36} className="mx-auto text-zinc-600 mb-3 md:mb-4 md:w-12 md:h-12" />
          <h3 className="text-base md:text-lg font-medium text-white mb-1.5 md:mb-2">هیچ آزمونی برای این دوره یافت نشد</h3>
          <p className="text-xs md:text-sm text-zinc-500">برای شروع، اولین آزمون خود را ایجاد کنید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {exams.map((exam) => (
            <div key={exam._id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 md:p-5 hover:border-white/20 transition-all group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-base md:text-lg font-bold text-white line-clamp-1">{exam.title}</h3>
                <span className={`px-2 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg text-[10px] md:text-xs font-medium ${exam.isPublished ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                  {exam.isPublished ? "منتشر شده" : "پیش‌نویس"}
                </span>
              </div>
              <div className="space-y-2 mb-5 md:mb-6">
                <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-400"><Clock size={14} className="md:w-4 md:h-4" /> زمان: {exam.timeLimit > 0 ? `${exam.timeLimit} دقیقه` : "بدون محدودیت"}</div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-400"><BookOpen size={14} className="md:w-4 md:h-4" /> سوالات: {exam.questions?.length || 0} سوال</div>
              </div>
              <div className="mt-auto">
                <Link href={`/instructor/exams/${exam._id}/edit`} className="w-full flex items-center justify-center gap-2 py-2 md:py-2.5 rounded-xl bg-blue-500/10 text-blue-400 text-xs md:text-sm font-medium hover:bg-blue-500/20 transition-colors">
                  <Edit2 size={14} className="md:w-4 md:h-4" /> ویرایش سوالات
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a1024] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-lg shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-base md:text-lg font-bold text-white">ساخت آزمون جدید</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white p-1 md:p-1.5 rounded-lg bg-white/5"><X size={18} className="md:w-5 md:h-5" /></button>
            </div>
            
            <form onSubmit={handleCreateExam} className="p-5 md:p-6 flex flex-col gap-4 md:gap-5 overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">عنوان آزمون *</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-xs md:text-sm focus:border-blue-500" placeholder="مثال: آزمون میان‌ترم ریکت" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">نامک (Slug) *</label>
                  <input required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-xs md:text-sm focus:border-blue-500" dir="ltr" placeholder="react-midterm" />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">زمان (دقیقه)</label>
                  <input type="number" min="0" value={formData.timeLimit} onChange={(e) => setFormData({...formData, timeLimit: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-xs md:text-sm focus:border-blue-500" />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">دوره مربوطه *</label>
                <div onClick={() => setIsModalSelectOpen(!isModalSelectOpen)} className={`flex items-center justify-between w-full bg-white/5 border rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm cursor-pointer transition-colors ${isModalSelectOpen ? 'border-blue-500' : 'border-white/10'}`}>
                  <span className={formData.course ? "text-white line-clamp-1" : "text-zinc-500"}>{formData.course ? (courses.find(c => c._id === formData.course)?.name) : "انتخاب کنید..."}</span>
                  <ChevronDown size={14} className="text-zinc-400 shrink-0 md:w-4 md:h-4" />
                </div>
                {isModalSelectOpen && (
                  <><div className="fixed inset-0 z-[110]" onClick={() => setIsModalSelectOpen(false)}></div><div className="absolute top-full left-0 right-0 mt-1 z-[120] bg-[#0f1631] border border-white/10 rounded-xl shadow-2xl overflow-y-auto max-h-48 custom-scrollbar">{courses.map(c => (<div key={c._id} onClick={() => { setFormData({...formData, course: c._id}); setIsModalSelectOpen(false); }} className={`px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm cursor-pointer transition-colors ${formData.course === c._id ? 'bg-blue-600/20 text-blue-400' : 'text-zinc-300 hover:bg-white/5'}`}>{c.name || c.title}</div>))}</div></>
                )}
              </div>

              <div className="mt-2 md:mt-3 flex gap-2 md:gap-3">
                <button type="submit" disabled={isCreating} className="flex-1 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs md:text-sm font-bold flex justify-center items-center">
                  {isCreating ? <Loader2 size={16} className="animate-spin md:w-[18px] md:h-[18px]" /> : "ایجاد و افزودن سوالات"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-white/5 text-zinc-300 text-xs md:text-sm font-medium">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}