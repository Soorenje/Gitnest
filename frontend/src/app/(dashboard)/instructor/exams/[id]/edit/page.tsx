"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowRight, Save, Plus, Trash2, Loader2, 
  Settings, CheckCircle2, X, HelpCircle, GripVertical
} from "lucide-react";
import QuestionModal from "../../../../../../components/exams/QuestionModal";
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
    options: ["", "", "", ""], // 4 گزینه پیش‌فرض
    correctAnswer: 0, // ایندکس گزینه درست (0 تا 3)
    points: 1
  });

  // ۱. دریافت اطلاعات آزمون و سوالات در زمان لود صفحه
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const res = await apiFetch(`/exam/${examId}`);
        const data = await res.json();
        
        if (res.ok) {
          setExam(data.data);
        } else {
          toast.error(data.message || "آزمون یافت نشد");
          router.push("/instructor/exams");
        }
      } catch (error) {
        toast.error("خطا در برقراری ارتباط با سرور");
      } finally {
        setIsLoading(false);
      }
    };
    if (examId) fetchExamData();
  }, [examId, router]);

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
        const data = await res.json();
        toast.error(data.message || "خطا در ذخیره تنظیمات");
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

  // ۴. هندلر ارسال سوال جدید به بک‌اند
  const handleSaveQuestion = async (e: React.FormEvent) => {    

    setIsAddingQuestion(true);
    try {
      const res = await apiFetch(`/exam/${examId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionForm),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("سوال با موفقیت اضافه شد");
        // آپدیت کردن استیت آزمون برای نمایش فوری سوال جدید در لیست
        setExam({
          ...exam,
          questions: [...(exam.questions || []), data.data]
        });
        
        // ریست کردن فرم
        setIsQuestionModalOpen(false);
        setQuestionForm({ title: "", options: ["", "", "", ""], correctAnswer: 0, points: 1 });
      } else {
        toast.error(data.message || "خطا در ثبت سوال");
      }
    } catch (error) {
      toast.error("ارتباط با سرور قطع شد");
    } finally {
      setIsAddingQuestion(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="animate-spin text-blue-500" size={40}/></div>;
  }

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Topbar */}
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
        {/* ستون راست: تنظیمات آزمون */}
        <div className="w-full lg:w-1/3 shrink-0">
          <form onSubmit={handleUpdateExam} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 sticky top-28 space-y-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
              <Settings size={20} className="text-blue-400" />
              <h3 className="text-base font-bold text-white">تنظیمات آزمون</h3>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">عنوان آزمون</label>
              <input type="text" value={exam?.title || ""} onChange={(e) => setExam({...exam, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">زمان (دقیقه - 0 برای نامحدود)</label>
              <input type="number" min="0" value={exam?.timeLimit || 0} onChange={(e) => setExam({...exam, timeLimit: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500" />
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

            <button type="submit" disabled={isSavingBasic} className="w-full py-3 rounded-xl bg-blue-600/20 text-blue-400 text-sm font-medium hover:bg-blue-600/30 transition-all flex justify-center items-center gap-2 border border-blue-500/20">
              {isSavingBasic ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              ذخیره تغییرات
            </button>
          </form>
        </div>

        {/* ستون چپ: لیست سوالات */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><HelpCircle size={24} className="text-purple-400"/> سوالات آزمون</h3>
            <button onClick={() => setIsQuestionModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition-all">
              <Plus size={16} /> سوال جدید
            </button>
          </div>

          {!exam?.questions || exam.questions.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
              <p className="text-zinc-500">هنوز هیچ سوالی برای این آزمون طراحی نکرده‌اید.</p>
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
                      <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">{question.points} نمره</span>
                      <button className="text-red-400/50 hover:text-red-400 transition-colors p-1"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
                    {question.options.map((opt: string, optIdx: number) => (
                      <div key={optIdx} className={`p-3 rounded-xl border text-sm flex items-center gap-3 transition-colors ${question.correctAnswer === optIdx ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-white/[0.02] border-white/5 text-zinc-400'}`}>
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

      {/* مُدال افزودن سوال */}
      <QuestionModal 
        isOpen={isQuestionModalOpen} 
        onClose={() => setIsQuestionModalOpen(false)} 
        onSave={handleSaveQuestion} 
        isSaving={isAddingQuestion} 
      />
    </div>
  );
}