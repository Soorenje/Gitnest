"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowRight, Save, Plus, Trash2, Loader2, 
  Settings, HelpCircle, X 
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "../../../../../../utils/apiFetch"; 

export default function ExamEditorPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  // استیت‌های اطلاعات آزمون
  const [exam, setExam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingBasic, setIsSavingBasic] = useState(false);

  // استیت‌های مُدال سوال جدید
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    title: "",
    options: ["", "", "", ""], // ۴ گزینه پیش‌فرض
    correctAnswer: 0,
    points: 1
  });

  // ۱. تابع دریافت اطلاعات آزمون
  const fetchExamData = useCallback(async () => {
    try {
      const res = await apiFetch(`/exam/${examId}`);
      if (res.ok) {
        const data = await res.json();
        setExam(data.data || data);
      } else {
        toast.error("آزمون یافت نشد");
        router.push("/instructor/exams");
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات آزمون از سرور");
    } finally {
      setIsLoading(false);
    }
  }, [examId, router]);

  useEffect(() => {
    if (examId) fetchExamData();
  }, [fetchExamData, examId]);

  // ۲. هندل کردن ذخیره تنظیمات پایه آزمون
  const handleUpdateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBasic(true);
    try {
      const res = await apiFetch(`/exam/${examId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: exam.title,
          timeLimit: exam.timeLimit,
          isPublished: exam.isPublished
        }),
      });

      if (res.ok) {
        toast.success("تنظیمات آزمون با موفقیت ذخیره شد");
      } else {
        toast.error("خطا در ذخیره تنظیمات");
      }
    } catch (error) {
      toast.error("ارتباط با سرور قطع شد");
    } finally {
      setIsSavingBasic(false);
    }
  };

  // ۳. هندلر تغییر مقادیر گزینه‌ها
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  // ۴. هندلر ارسال سوال جدید
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی فرانت‌اند
    if (!questionForm.title.trim() || questionForm.options.some(opt => !opt.trim())) {
      toast.error("لطفا صورت سوال و تمام ۴ گزینه را پر کنید");
      return;
    }

    setIsAddingQuestion(true);
    try {
      const res = await apiFetch(`/exam/${examId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionForm), // 💡 ارسال مستقیم دیتای استیت
      });

      if (res.ok) {
        toast.success("سوال با موفقیت اضافه شد");
        setIsQuestionModalOpen(false);
        // ریست کردن فرم برای سوال بعدی
        setQuestionForm({ title: "", options: ["", "", "", ""], correctAnswer: 0, points: 1 });
        // آپدیت لیست سوالات از سرور
        fetchExamData();
      } else {
        const data = await res.json();
        toast.error(data.message || "خطا در ثبت سوال");
      }
    } catch (error: any) {
      toast.error("ارتباط با سرور قطع شد");
    } finally {
      setIsAddingQuestion(false);
    }
  };

  // ۵. هندلر حذف سوال
  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm("آیا از حذف این سوال مطمئن هستید؟")) return;
    
    try {
      const res = await apiFetch(`/exam/${examId}/questions/${questionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("سوال حذف شد");
        fetchExamData(); // رفرش لیست
      }
    } catch (error) {
      toast.error("خطا در حذف سوال");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white/[0.02] border border-white/5 rounded-3xl p-4 md:p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/instructor/exams" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowRight size={20} />
          </Link>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white mb-1">ویرایش: {exam?.title}</h2>
            <p className="text-xs text-zinc-400">مجموع بارم: {exam?.questions?.reduce((sum: number, q: any) => sum + q.points, 0) || 0} نمره</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ستون تنظیمات */}
        <div className="w-full lg:w-1/3 shrink-0">
          <form onSubmit={handleUpdateExam} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sticky top-28 space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
              <Settings size={20} className="text-blue-400" />
              <h3 className="text-base font-bold text-white">تنظیمات آزمون</h3>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">عنوان آزمون</label>
              <input type="text" value={exam?.title || ""} onChange={(e) => setExam({...exam, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:border-blue-500 transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">زمان (دقیقه - 0 برای نامحدود)</label>
              <input type="number" min="0" value={exam?.timeLimit || 0} onChange={(e) => setExam({...exam, timeLimit: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-medium focus:border-blue-500 transition-colors" />
            </div>

            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
              <div>
                <div className="text-sm font-medium text-white">وضعیت انتشار</div>
                <div className="text-xs text-zinc-500 mt-1">آیا دانشجوها آزمون را ببینند؟</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={exam?.isPublished || false} onChange={(e) => setExam({...exam, isPublished: e.target.checked})} />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>

            <button type="submit" disabled={isSavingBasic} className="w-full py-3 rounded-xl bg-blue-600/20 text-blue-400 text-sm font-bold hover:bg-blue-600/30 transition-all flex justify-center items-center gap-2 border border-blue-500/20">
              {isSavingBasic ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              ذخیره تغییرات
            </button>
          </form>
        </div>

        {/* ستون لیست سوالات */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><HelpCircle size={24} className="text-purple-400"/> سوالات آزمون</h3>
            <button onClick={() => setIsQuestionModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold hover:shadow-lg transition-all">
              <Plus size={16} /> سوال جدید
            </button>
          </div>

          {!exam?.questions || exam.questions.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
              <p className="text-zinc-500 font-medium">هنوز هیچ سوالی برای این آزمون طراحی نکرده‌اید.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exam.questions.map((question: any, index: number) => (
                <div key={question._id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 relative group hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-md bg-white/5 text-zinc-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{index + 1}</div>
                      <h4 className="text-white text-sm md:text-base leading-relaxed font-medium">{question.title}</h4>
                    </div>
                    <div className="shrink-0 ml-4 flex gap-2 items-center">
                      <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md border border-purple-500/20">{question.points} نمره</span>
                      <button onClick={() => handleDeleteQuestion(question._id)} className="text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors p-1.5 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
                    {question.options.map((opt: string, optIdx: number) => (
                      <div key={optIdx} className={`p-3 rounded-xl border text-sm font-medium flex items-center gap-3 transition-colors ${question.correctAnswer === optIdx ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-white/[0.02] border-white/5 text-zinc-400'}`}>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${question.correctAnswer === optIdx ? 'border-green-500' : 'border-zinc-600'}`}>
                          {question.correctAnswer === optIdx && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                        </div>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* مُدال ایجاد سوال یکپارچه شده */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a1024] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02] shrink-0">
              <h3 className="text-lg font-bold text-white">طراحی سوال جدید</h3>
              <button onClick={() => setIsQuestionModalOpen(false)} className="text-zinc-500 hover:text-white p-1.5 rounded-lg"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveQuestion} className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">صورت سوال *</label>
                <textarea required rows={3} value={questionForm.title} onChange={(e) => setQuestionForm({...questionForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 resize-none custom-scrollbar" placeholder="مثلاً: کاربرد هوک useEffect چیست؟"></textarea>
              </div>
              
              <div className="space-y-4 border-t border-white/5 pt-4">
                <label className="block text-xs font-medium text-zinc-400">گزینه‌ها (پاسخ صحیح را انتخاب کنید)</label>
                {questionForm.options.map((opt, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${questionForm.correctAnswer === idx ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 bg-white/5'}`}>
                    <input 
                      type="radio" 
                      name="correctAnswer" 
                      checked={questionForm.correctAnswer === idx} 
                      onChange={() => setQuestionForm({...questionForm, correctAnswer: idx})}
                      className="w-4 h-4 ml-2 accent-green-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-zinc-500 w-5">{idx + 1}.</span>
                    <input 
                      required 
                      type="text" 
                      value={opt} 
                      onChange={(e) => handleOptionChange(idx, e.target.value)} 
                      className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-white focus:ring-0" 
                      placeholder={`متن گزینه ${idx + 1}`} 
                    />
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4">
                <label className="block text-xs font-medium text-zinc-400 mb-2">بارم (نمره) سوال</label>
                <input type="number" min="0.5" step="0.5" value={questionForm.points} onChange={(e) => setQuestionForm({...questionForm, points: Number(e.target.value)})} className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 text-center" />
              </div>

              <div className="mt-4 flex gap-3 shrink-0">
                <button type="submit" disabled={isAddingQuestion} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold flex justify-center items-center">
                  {isAddingQuestion ? <Loader2 size={18} className="animate-spin" /> : "ذخیره سوال"}
                </button>
                <button type="button" onClick={() => setIsQuestionModalOpen(false)} className="px-6 py-3.5 rounded-xl bg-white/5 text-zinc-300 text-sm font-medium hover:bg-white/10 transition-colors">انصراف</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}