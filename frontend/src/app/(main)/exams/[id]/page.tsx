"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  AlertCircle, CheckCircle2, XCircle, 
  ArrowRight, Award, Loader2, AlertTriangle 
} from "lucide-react";
import QuizTimer from "../../../../components/exams/QuizTimer"; 
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "../../../../utils/apiFetch";

export default function StudentExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  // استیت‌های اصلی
  const [exam, setExam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [debugError, setDebugError] = useState<string | null>(null); // 💡 استیت دیباگر

  // استیت‌های جریان آزمون
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({}); 
  const [score, setScore] = useState(0);

  // ۱. دریافت اطلاعات آزمون
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await apiFetch(`/exam/start/${examId}`);
        const text = await res.text();
        
        let data: any = {};
        try { data = text ? JSON.parse(text) : {}; } catch (e) {}

        if (res.ok) {
          if (!data.data) {
             setDebugError(`سرور پیام موفقیت داد اما دیتایی نفرستاد! دیتای دریافتی: ${text}`);
          }
          setExam(data.data || data);
        } else {
          setErrorMsg(data.message || "شما اجازه دسترسی به این آزمون را ندارید.");
        }
      } catch (error: any) {
        setDebugError(`ارتباط با سرور برقرار نشد: ${error.message || error}`);
      } finally {
        setIsLoading(false);
      }
    };
    if (examId) fetchExam();
  }, [examId]);

  // ۲. انتخاب گزینه
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return; 
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  // ۳. پایان و تصحیح آزمون
  const handleFinishExam = () => {
    let currentScore = 0;
    exam?.questions?.forEach((q: any) => {
      if (answers[q._id] === q.correctAnswer) {
        currentScore += q.points;
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen bg-[#070b1a]"><Loader2 className="animate-spin text-blue-500" size={50}/></div>;
  }

  // 💡 نمایش ارور دیباگر
  if (debugError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#070b1a] p-4 font-sans">
        <div className="max-w-2xl w-full p-6 bg-red-500/10 border-2 border-red-500/50 rounded-2xl animate-pulse">
          <div className="flex items-center gap-3 text-red-500 font-bold mb-3">
            <AlertTriangle size={24} />
            <h3 className="text-lg">دیباگر سیستم</h3>
          </div>
          <p className="text-red-200 text-sm font-mono leading-relaxed bg-black/50 p-4 rounded-xl border border-red-500/30">
            {debugError}
          </p>
          <button onClick={() => router.back()} className="mt-6 px-6 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20">بازگشت</button>
        </div>
      </div>
    );
  }

  // نمایش ارور منطقی (مثلاً کاربر دوره را نخریده است)
  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#070b1a] p-4 animate-in fade-in font-sans">
        <div className="bg-red-500/10 border border-red-500/20 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-red-500">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">دسترسی غیرمجاز</h2>
        <p className="text-zinc-400 mb-8 text-center">{errorMsg}</p>
        <Link href="/courses" className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
          بازگشت به دوره‌ها
        </Link>
      </div>
    );
  }

  // 💡 جایگزین return null برای جلوگیری از صفحه سیاه
  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#070b1a] p-4 text-white font-sans">
        <AlertTriangle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">دیتا یافت نشد!</h2>
        <p className="text-zinc-400">آزمون مورد نظر در دیتابیس وجود ندارد یا به درستی لود نشد.</p>
        <button onClick={() => router.back()} className="mt-6 px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20">بازگشت</button>
      </div>
    );
  }

  const totalPoints = (exam.questions || []).reduce((sum: number, q: any) => sum + (q.points || 0), 0);

  return (
    <div className="min-h-screen bg-[#070b1a] font-sans">
      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
        
        {/* هدر صفحه */}
        <div className="flex items-center gap-4 mb-8 pt-8">
          <button onClick={() => router.back()} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <ArrowRight size={20} />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-white">آزمون: {exam?.title}</h1>
        </div>

        {/* حالت اول: قبل از شروع آزمون */}
        {!hasStarted && !isSubmitted && (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-center animate-in zoom-in-95">
            <Award size={64} className="mx-auto text-blue-400 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">آماده‌اید؟</h2>
            <p className="text-zinc-400 mb-8">لطفاً قبل از شروع به نکات زیر توجه کنید.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-zinc-400 text-sm mb-1">تعداد سوالات</div>
                <div className="text-xl font-bold text-white">{exam?.questions?.length || 0} سوال</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="text-zinc-400 text-sm mb-1">بارم کل</div>
                <div className="text-xl font-bold text-purple-400">{totalPoints} نمره</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 col-span-2 md:col-span-1">
                <div className="text-zinc-400 text-sm mb-1">زمان آزمون</div>
                <div className="text-xl font-bold text-blue-400">{exam?.timeLimit > 0 ? `${exam.timeLimit} دقیقه` : "نامحدود"}</div>
              </div>
            </div>

            <button 
              onClick={() => setHasStarted(true)} 
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              شروع آزمون
            </button>
          </div>
        )}

        {/* حالت دوم و سوم: حین آزمون یا بعد از پایان */}
        {(hasStarted || isSubmitted) && (
          <div className="animate-in fade-in duration-500">
            
            {/* نوار چسبان بالا (تایمر یا نتیجه) */}
            <div className="sticky top-4 z-50 bg-[#0a1024]/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-8 shadow-2xl">
              <div className="text-white font-medium">
                پاسخ داده شده: <span className="text-blue-400">{Object.keys(answers).length}</span> از {exam?.questions?.length || 0}
              </div>
              
              {!isSubmitted ? (
                exam?.timeLimit > 0 ? (
                  <QuizTimer 
                    timeLimitMinutes={exam.timeLimit}
                    onTimeUp={() => {
                      handleFinishExam();
                      toast.error("زمان شما به پایان رسید!");
                    }}
                    isPaused={isSubmitted}
                  />
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-white/5 text-zinc-400 text-sm">بدون محدودیت زمانی</div>
                )
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 font-bold">
                  نمره شما: {score} از {totalPoints}
                </div>
              )}
            </div>

            {/* لیست سوالات */}
            <div className="space-y-6">
              {(exam?.questions || []).map((q: any, index: number) => {
                const isCorrectAnswer = isSubmitted && answers[q._id] === q.correctAnswer;
                const isWrongAnswer = isSubmitted && answers[q._id] !== undefined && answers[q._id] !== q.correctAnswer;
                
                return (
                  <div key={q._id} className={`bg-white/[0.02] border rounded-3xl p-5 md:p-8 transition-colors ${
                    isSubmitted 
                      ? (isCorrectAnswer ? 'border-green-500/30 bg-green-500/5' : isWrongAnswer ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 opacity-60')
                      : 'border-white/5'
                  }`}>
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-white text-lg md:text-xl font-medium leading-relaxed">
                        <span className="text-blue-400 font-bold ml-2">{index + 1}.</span> 
                        {q.title}
                      </h3>
                      <span className="shrink-0 text-xs text-zinc-500 bg-white/5 px-3 py-1.5 rounded-lg">{q.points} نمره</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(q.options || []).map((opt: string, optIdx: number) => {
                        const isSelected = answers[q._id] === optIdx;
                        
                        let optionClass = "bg-white/5 border-white/10 text-zinc-300 hover:border-blue-500/50"; 
                        
                        if (isSubmitted) {
                          if (optIdx === q.correctAnswer) {
                            optionClass = "bg-green-500/20 border-green-500 text-green-300"; 
                          } else if (isSelected && optIdx !== q.correctAnswer) {
                            optionClass = "bg-red-500/20 border-red-500 text-red-300"; 
                          } else {
                            optionClass = "bg-white/5 border-white/5 text-zinc-500 opacity-50"; 
                          }
                        } else if (isSelected) {
                          optionClass = "bg-blue-600/20 border-blue-500 text-blue-300"; 
                        }

                        return (
                          <div 
                            key={optIdx}
                            onClick={() => handleSelectOption(q._id, optIdx)}
                            className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${optionClass} ${isSubmitted ? 'cursor-default' : ''}`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected || (isSubmitted && optIdx === q.correctAnswer) ? 'border-current' : 'border-zinc-500'}`}>
                              {isSelected && !isSubmitted && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                              {isSubmitted && optIdx === q.correctAnswer && <CheckCircle2 size={14} />}
                              {isSubmitted && isSelected && optIdx !== q.correctAnswer && <XCircle size={14} />}
                            </div>
                            <span className="text-sm md:text-base font-medium">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {!isSubmitted && (
              <div className="mt-10 flex justify-end">
                <button 
                  onClick={handleFinishExam}
                  className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                  <CheckCircle2 size={20} /> ثبت نهایی پاسخ‌ها
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}