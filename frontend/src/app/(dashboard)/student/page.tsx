"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, Award, PlayCircle, ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "./../../../utils/apiFetch";

export default function StudentDashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiFetch("/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserData(data.data || data);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) return <div className="flex justify-center py-40"><Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-spin" /></div>;

  const purchasedCourses = Array.isArray(userData?.courses) ? userData.courses : [];
  const displayName = userData?.name || userData?.username || "دانشجو";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* بنر خوش‌آمدگویی */}
      <div className="mb-6 md:mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl md:rounded-3xl p-5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 relative overflow-hidden text-center md:text-right">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-blue-500/20 rounded-full blur-[60px] md:blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="z-10 w-full md:w-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1.5 md:mb-2 leading-snug">
            سلام {displayName} عزیز، خوش برگشتی! 👋
          </h2>
          <p className="text-xs md:text-sm text-zinc-300">امروز یک روز عالی برای یادگیری و پیشرفت است. از کجا شروع می‌کنیم؟</p>
        </div>
        
        {purchasedCourses.length > 0 && (
          <Link href="/student/courses" className="z-10 flex items-center justify-center w-full md:w-auto gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-base font-medium transition-all shadow-lg shadow-blue-500/25 shrink-0 mt-2 md:mt-0">
            <PlayCircle size={16} className="md:w-[18px] md:h-[18px]" />
            ادامه یادگیری
          </Link>
        )}
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-10">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-lg flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 md:mb-3">
            <span className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-blue-500/10 text-blue-400 shrink-0"><BookOpen size={16} className="md:w-5 md:h-5" /></span>
            <h3 className="text-zinc-400 text-xs md:text-sm font-medium">دوره‌های من</h3>
          </div>
          <div className="text-xl md:text-2xl font-black text-white mt-auto">{purchasedCourses.length} <span className="text-[10px] md:text-sm text-zinc-500 font-normal">دوره</span></div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-lg flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 md:mb-3">
            <span className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-purple-500/10 text-purple-400 shrink-0"><Clock size={16} className="md:w-5 md:h-5" /></span>
            <h3 className="text-zinc-400 text-xs md:text-sm font-medium">وضعیت یادگیری</h3>
          </div>
          <div className="text-lg md:text-2xl font-black text-white mt-auto">در جریان</div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-lg opacity-50 cursor-not-allowed flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 md:mb-3">
            <span className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-green-500/10 text-green-400 shrink-0"><CheckCircle2 size={16} className="md:w-5 md:h-5" /></span>
            <h3 className="text-zinc-400 text-xs md:text-sm font-medium line-clamp-1">جلسات تکمیل شده</h3>
          </div>
          <div className="text-xl md:text-2xl font-black text-white mt-auto">۰ <span className="text-[10px] md:text-sm text-zinc-500 font-normal">جلسه</span></div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-lg opacity-50 cursor-not-allowed flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 md:mb-3">
            <span className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-orange-500/10 text-orange-400 shrink-0"><Award size={16} className="md:w-5 md:h-5" /></span>
            <h3 className="text-zinc-400 text-xs md:text-sm font-medium line-clamp-1">مدارک دریافتی</h3>
          </div>
          <div className="text-xl md:text-2xl font-black text-white mt-auto">۰ <span className="text-[10px] md:text-sm text-zinc-500 font-normal">مدرک</span></div>
        </div>
      </div>

      {/* هدر بخش دوره‌ها */}
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-bold text-white">دوره‌های در حال یادگیری</h3>
        <Link href="/courses" className="text-xs md:text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          مشاهده جدید
          <ChevronLeft size={14} className="md:w-4 md:h-4" />
        </Link>
      </div>

      {/* لیست دوره‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {purchasedCourses.length > 0 ? (
          purchasedCourses.slice(0, 3).map((course: any, index: number) => (
            <div key={course?._id || course?.id || index} className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-5 hover:bg-white/[0.04] transition-all group flex flex-col h-full">
              <div className="flex gap-3 md:gap-4 mb-4 md:mb-5">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 overflow-hidden flex items-center justify-center shadow-lg shrink-0">
                  {course?.cover ? (
                    <img src={course.cover} alt={course?.name || "cover"} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="text-zinc-500 w-6 h-6 md:w-8 md:h-8" />
                  )}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm md:text-base mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {course?.name || "دوره بدون نام"}
                  </h4>
                </div>
              </div>

              <div className="mb-3 md:mb-4 flex-1">
                <div className="flex items-center justify-between text-[10px] md:text-xs mb-1.5 md:mb-2">
                  <span className="text-zinc-400">پیشرفت دوره</span>
                  <span className="text-white font-bold">۰٪</span>
                </div>
                <div className="w-full h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              <div className="pt-3 md:pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[10px] md:text-xs text-zinc-400 truncate flex-1 flex items-center justify-center sm:justify-start gap-1.5">
                  <PlayCircle size={14} className="text-blue-400 shrink-0 md:w-4 md:h-4" />
                  <span>شروع یادگیری</span>
                </div>
                <Link 
                  href={course?.href ? `/course/${course.href}` : "#"} 
                  className="w-full sm:w-auto text-center shrink-0 px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                >
                  مشاهده دوره
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 md:py-12 text-center bg-white/5 rounded-2xl md:rounded-3xl border border-dashed border-white/10 px-4">
            <p className="text-zinc-400 mb-3 md:mb-4 text-xs md:text-sm">شما هنوز هیچ دوره‌ای خریداری نکرده‌اید.</p>
            <Link href="/courses" className="px-5 md:px-6 py-2 md:py-2.5 bg-blue-600 text-white rounded-lg md:rounded-xl text-xs md:text-sm hover:bg-blue-500 transition-colors inline-block">
              شروع اولین دوره
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}