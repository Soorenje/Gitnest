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

  if (isLoading) return <div className="flex justify-center py-40"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>;

  const purchasedCourses = Array.isArray(userData?.courses) ? userData.courses : [];
  const displayName = userData?.name || userData?.username || "دانشجو";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="z-10 text-right w-full md:w-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">سلام {displayName} عزیز، خوش برگشتی! 👋</h2>
          <p className="text-zinc-300">امروز یک روز عالی برای یادگیری و پیشرفت است. از کجا شروع می‌کنیم؟</p>
        </div>
        
        {purchasedCourses.length > 0 && (
          <Link href="/student/courses" className="z-10 flex items-center justify-center w-full md:w-auto gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-lg shadow-blue-500/25 shrink-0">
            <PlayCircle size={18} />
            ادامه یادگیری
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400"><BookOpen size={20} /></span>
            <h3 className="text-zinc-400 text-sm font-medium">دوره‌های من</h3>
          </div>
          <div className="text-2xl font-black text-white">{purchasedCourses.length} <span className="text-sm text-zinc-500 font-normal">دوره</span></div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400"><Clock size={20} /></span>
            <h3 className="text-zinc-400 text-sm font-medium">وضعیت یادگیری</h3>
          </div>
          <div className="text-2xl font-black text-white">در جریان</div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 shadow-lg opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400"><CheckCircle2 size={20} /></span>
            <h3 className="text-zinc-400 text-sm font-medium">جلسات تکمیل شده</h3>
          </div>
          <div className="text-2xl font-black text-white">۰ <span className="text-sm text-zinc-500 font-normal">جلسه</span></div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 shadow-lg opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400"><Award size={20} /></span>
            <h3 className="text-zinc-400 text-sm font-medium">مدارک دریافتی</h3>
          </div>
          <div className="text-2xl font-black text-white">۰ <span className="text-sm text-zinc-500 font-normal">مدرک</span></div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">دوره‌های در حال یادگیری</h3>
        <Link href="/courses" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
          مشاهده دوره‌های جدید
          <ChevronLeft size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {purchasedCourses.length > 0 ? (
          purchasedCourses.slice(0, 3).map((course: any, index: number) => (
            <div key={course?._id || course?.id || index} className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 hover:bg-white/[0.04] transition-all group flex flex-col h-full">
              <div className="flex gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden flex items-center justify-center shadow-lg shrink-0">
                  {course?.cover ? (
                    <img src={course.cover} alt={course?.name || "cover"} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="text-zinc-500" />
                  )}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm md:text-base mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {course?.name || "دوره بدون نام"}
                  </h4>
                </div>
              </div>

              <div className="mb-4 flex-1">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-zinc-400">پیشرفت دوره</span>
                  <span className="text-white font-bold">۰٪</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                <div className="text-xs text-zinc-400 truncate flex-1 flex items-center gap-1.5">
                  <PlayCircle size={14} className="text-blue-400 shrink-0" />
                  <span>شروع یادگیری</span>
                </div>
                <Link 
                  href={course?.href ? `/course/${course.href}` : "#"} 
                  className="shrink-0 px-4 py-2 rounded-xl text-xs font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                >
                  مشاهده دوره
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-zinc-400 mb-4">شما هنوز هیچ دوره‌ای خریداری نکرده‌اید.</p>
            <Link href="/courses" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-500 transition-colors inline-block">
              شروع اولین دوره
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}