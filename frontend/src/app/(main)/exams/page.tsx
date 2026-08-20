"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Clock, ArrowLeft, Loader2, Award } from "lucide-react";
import Navbar from "../../../components/home/Navbar"; // آدرس‌ها را با ساختار پوشه خود چک کنید
import Footer from "../../../components/home/footer"; // آدرس‌ها را با ساختار پوشه خود چک کنید
import { apiFetch } from "../../../utils/apiFetch"; 

export default function ExamsListPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // گرفتن لیست تمام آزمون‌های منتشر شده از بک‌اند
    const fetchExams = async () => {
      try {
        const res = await apiFetch("/exam"); // این آدرس به کنترلر getExams وصل می‌شود
        if (res.ok) {
          const data = await res.json();
          setExams(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#070b1a] pt-28 md:pt-36 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* هدر صفحه */}
          <div className="flex flex-col items-center text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
              <Award size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              آزمون‌های <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">آنلاین</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl text-sm md:text-base leading-relaxed">
              با شرکت در آزمون‌های دوره‌های مختلف، مهارت‌های خود را بسنجید و برای چالش‌های برنامه‌نویسی آماده شوید.
            </p>
          </div>

          {/* لیست آزمون‌ها */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl animate-in fade-in duration-500">
              <BookOpen size={48} className="mx-auto text-zinc-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">هنوز آزمونی منتشر نشده است</h3>
              <p className="text-sm text-zinc-500">به زودی آزمون‌های دوره‌های مختلف به این بخش اضافه خواهد شد.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in duration-500">
              {exams.map((exam) => (
                <div key={exam._id} className="group relative bg-[#0a1024]/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-xl">
                  {/* خط رنگی تزیینی بالای کارت */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="p-6 md:p-8 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-6">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {exam.title}
                      </h3>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-300">
                          <Clock size={16} />
                        </div>
                        <span>زمان: {exam.timeLimit > 0 ? `${exam.timeLimit} دقیقه` : "بدون محدودیت"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-zinc-400">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-300">
                          <BookOpen size={16} />
                        </div>
                        <span>وضعیت: آماده شرکت</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5">
                      {/* لینک به صفحه مخصوص همان آزمون */}
                      <Link 
                        href={`/exams/${exam._id}`}
                        className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 text-white font-medium hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 transition-all group/btn"
                      >
                        <span>مشاهده و شرکت در آزمون</span>
                        <ArrowLeft size={18} className="transform group-hover/btn:-translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}