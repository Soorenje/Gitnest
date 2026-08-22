"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Clock, BookOpen, Loader2, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "./../../../../utils/apiFetch"; 
import { useRouter } from "next/navigation";

export default function InstructorExamsPage() {
  const router = useRouter();
  
  // استیت‌های لیست
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // استیت‌های مُدال ایجاد آزمون
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    course: "", 
    timeLimit: 0,
    description: ""
  });

  // ۱. دریافت دوره‌های مدرس
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiFetch("/course/instructor/courses"); 
        if (res.ok) {
          const data = await res.json();
          
          // 💡 دریافت ایمن لیست دوره‌ها (پشتیبانی از هر دو حالت آرایه یا آبجکت)
          const coursesList = Array.isArray(data) ? data : (data.data || []);
          
          setCourses(coursesList);
          
          if (coursesList.length > 0) {
            setSelectedCourseId(coursesList[0]._id);
            setFormData(prev => ({ ...prev, course: coursesList[0]._id }));
          }
        } else {
          toast.error("خطا در دریافت اطلاعات دوره‌ها از سرور");
        }
      } catch (error) {
        toast.error("ارتباط با سرور برقرار نشد");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // ۲. دریافت آزمون‌های یک دوره
  useEffect(() => {
    if (!selectedCourseId) return;

    const fetchExams = async () => {
      setIsLoading(true);
      try {
        const res = await apiFetch(`/exam/course/${selectedCourseId}`);
        if (res.ok) {
          const data = await res.json();
          const examsList = Array.isArray(data) ? data : (data.data || []);
          setExams(examsList);
        } else {
          setExams([]);
        }
      } catch (error) {
        toast.error("خطا در دریافت آزمون‌ها");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, [selectedCourseId]);

  // ۳. هندل کردن فرم ساخت آزمون
  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.course) {
      toast.error("لطفا فیلدهای ضروری را پر کنید");
      return;
    }

    setIsCreating(true);
    try {
      const res = await apiFetch("/exam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("آزمون با موفقیت ایجاد شد!");
        setIsModalOpen(false);
        const examId = result._id || result.data?._id;
        router.push(`/instructor/exams/${examId}/edit`);
      } else {
        toast.error(result.message || "خطا در ساخت آزمون");
      }
    } catch (error) {
      toast.error("مشکل در ارتباط با سرور");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20 font-sans">
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">مدیریت آزمون‌ها</h2>
          <p className="text-sm text-zinc-400">آزمون‌های دوره‌های خود را بسازید و سوالات را مدیریت کنید.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
        >
          <Plus size={18} /> ساخت آزمون جدید
        </button>
      </div>

      {/* فیلتر دوره */}
      <div className="mb-6 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
        <label className="text-sm text-zinc-300 font-medium whitespace-nowrap">نمایش آزمون‌های دوره:</label>
        {/* 💡 استایل‌های Select آپدیت شد */}
        <select 
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="flex-1 max-w-xs bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:outline-none focus:border-blue-500 cursor-pointer appearance-none custom-select-icon"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left 12px center', backgroundSize: '16px' }}
        >
          {courses.map(course => (
            <option key={course._id} value={course._id} className="bg-[#0f1631] text-zinc-200 py-2">{course.name || course.title}</option>
          ))}
        </select>
      </div>

      {/* لیست آزمون‌ها */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40}/></div>
      ) : exams.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
          <BookOpen size={48} className="mx-auto text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">هیچ آزمونی برای این دوره یافت نشد</h3>
          <p className="text-sm text-zinc-500">برای شروع، اولین آزمون خود را ایجاد کنید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam._id} className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white line-clamp-1">{exam.title}</h3>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${exam.isPublished ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                  {exam.isPublished ? "منتشر شده" : "پیش‌نویس"}
                </span>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-zinc-400"><Clock size={16} /> زمان: {exam.timeLimit > 0 ? `${exam.timeLimit} دقیقه` : "بدون محدودیت"}</div>
                <div className="flex items-center gap-2 text-sm text-zinc-400"><BookOpen size={16} /> سوالات: {exam.questions?.length || 0} سوال</div>
              </div>
              <div className="flex gap-2 mt-auto">
                <Link href={`/instructor/exams/${exam._id}/edit`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors">
                  <Edit2 size={16} /> ویرایش سوالات
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* مُدال ایجاد آزمون */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a1024] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white">ساخت آزمون جدید</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white p-1.5 rounded-lg"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleCreateExam} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">عنوان آزمون *</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-blue-500 transition-colors" placeholder="مثال: آزمون میان‌ترم ریکت" />
              </div>
              
              <div className="flex gap-4">
                <div className="flex-[2]">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">نامک (Slug) *</label>
                  <input required type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-blue-500 transition-colors" placeholder="react-midterm" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">زمان (دقیقه)</label>
                  <input type="number" min="0" value={formData.timeLimit} onChange={(e) => setFormData({...formData, timeLimit: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-blue-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">دوره مربوطه *</label>
                {/* 💡 استایل‌های Select آپدیت شد */}
                <select 
                  required 
                  value={formData.course} 
                  onChange={(e) => setFormData({...formData, course: e.target.value})} 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left 16px center', backgroundSize: '16px' }}
                >
                  <option value="" disabled className="bg-[#0f1631] text-zinc-500">انتخاب کنید...</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id} className="bg-[#0f1631] text-zinc-200">{course.name || course.title}</option>
                  ))}
                </select>
              </div>

              <div className="mt-2 flex gap-3">
                <button type="submit" disabled={isCreating} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold flex justify-center items-center">
                  {isCreating ? <Loader2 size={18} className="animate-spin" /> : "ایجاد و افزودن سوالات"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-3 rounded-xl bg-white/5 text-zinc-300 text-sm font-medium hover:bg-white/10 transition-colors">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}