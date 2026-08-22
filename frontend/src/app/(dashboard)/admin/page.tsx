"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, DollarSign, Users, BookOpen, Clock } from "lucide-react";
import { apiFetch } from "./../../../utils/apiFetch"; 

export default function AdminDashboardPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiFetch("/course/admin/courses");
        if (res.ok) {
          const data = await res.json();
          const actualCourses = data.data || data;
          setCourses(Array.isArray(actualCourses) ? actualCourses : []);
        } else {
          toast.error("خطا در دریافت اطلاعات پیشخوان");
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalCourses = courses.length;
  const pendingCourses = courses.filter((c) => c.status === "Pending").length;
  const totalStudents = courses.reduce((acc, curr) => acc + (curr.studentsCount || 0), 0);
  
  const totalRevenue = courses.reduce((acc, curr) => {
    const price = curr.discountedPrice !== undefined ? curr.discountedPrice : curr.price;
    return acc + (price * (curr.studentsCount || 0));
  }, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-white mb-1">پیشخوان مدیریت</h2>
        <p className="text-xs md:text-sm text-zinc-400">آمار کلی و وضعیت پلتفرم در یک نگاه</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3 md:mb-4" />
          <p className="text-xs md:text-sm text-zinc-400">در حال محاسبه آمار پلتفرم...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-zinc-400 text-xs md:text-sm font-medium">برآورد درآمد کل</h3>
                <span className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg md:rounded-xl bg-green-500/10 text-green-400">
                  <DollarSign size={16} className="md:w-[18px] md:h-[18px]" />
                </span>
              </div>
              <div className="text-xl md:text-2xl font-black text-white">
                {totalRevenue === 0 ? "۰" : totalRevenue.toLocaleString()} <span className="text-[10px] md:text-sm text-zinc-500 font-normal">تومان</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-zinc-400 text-xs md:text-sm font-medium">مجموع دانشجویان</h3>
                <span className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg md:rounded-xl bg-blue-500/10 text-blue-400">
                  <Users size={16} className="md:w-[18px] md:h-[18px]" />
                </span>
              </div>
              <div className="text-xl md:text-2xl font-black text-white">
                {totalStudents.toLocaleString()} <span className="text-[10px] md:text-sm text-zinc-500 font-normal">نفر</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-zinc-400 text-xs md:text-sm font-medium">کل دوره‌ها</h3>
                <span className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg md:rounded-xl bg-purple-500/10 text-purple-400">
                  <BookOpen size={16} className="md:w-[18px] md:h-[18px]" />
                </span>
              </div>
              <div className="text-xl md:text-2xl font-black text-white">
                {totalCourses} <span className="text-[10px] md:text-sm text-zinc-500 font-normal">دوره</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-zinc-400 text-xs md:text-sm font-medium">در انتظار بررسی</h3>
                <span className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg md:rounded-xl bg-orange-500/10 text-orange-400">
                  <Clock size={16} className="md:w-[18px] md:h-[18px]" />
                </span>
              </div>
              <div className="text-xl md:text-2xl font-black text-white">
                {pendingCourses} <span className="text-[10px] md:text-sm text-zinc-500 font-normal">دوره</span>
              </div>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 min-h-[250px] md:min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 border border-white/10">
                <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-zinc-500" />
              </div>
              <h4 className="text-base md:text-lg font-medium text-zinc-300 mb-1.5 md:mb-2">نمودار فروش و ثبت‌نام</h4>
              <p className="text-xs md:text-sm text-zinc-500 max-w-sm px-4">
                این بخش در آینده برای نمایش نمودار خطی درآمد و روند رشد پیاده‌سازی خواهد شد.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}