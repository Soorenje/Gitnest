"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, DollarSign, Users, BookOpen, Clock } from "lucide-react";
import { apiFetch } from "./../../../utils/apiFetch"; // 💡 مسیر apiFetch را در صورت نیاز اصلاح کنید

export default function AdminDashboardPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // دریافت اطلاعات دوره‌ها برای استخراج آمار
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

  // 💡 محاسبات آماری بر اساس دیتای دوره‌ها
  const totalCourses = courses.length;
  const pendingCourses = courses.filter((c) => c.status === "Pending").length;
  
  // محاسبه مجموع دانشجویان همه دوره‌ها
  const totalStudents = courses.reduce((acc, curr) => acc + (curr.studentsCount || 0), 0);
  
  // برآورد درآمد (تعداد دانشجو × قیمت دوره)
  const totalRevenue = courses.reduce((acc, curr) => {
    // اگر قیمت تخفیف خورده دارد از آن استفاده کن، در غیر این صورت قیمت اصلی
    const price = curr.discountedPrice !== undefined ? curr.discountedPrice : curr.price;
    return acc + (price * (curr.studentsCount || 0));
  }, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">پیشخوان مدیریت</h2>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] bg-white/[0.02] border border-white/5 rounded-3xl">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-zinc-400">در حال محاسبه آمار پلتفرم...</p>
        </div>
      ) : (
        <>
          {/* کارت‌های آماری */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            {/* کارت درآمد */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 text-sm font-medium">برآورد درآمد کل</h3>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  <DollarSign size={18} />
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {totalRevenue === 0 ? "۰" : totalRevenue.toLocaleString()} <span className="text-sm text-zinc-500 font-normal">تومان</span>
              </div>
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                بر اساس ثبت‌نام‌های موفق
              </p>
            </div>

            {/* کارت دانشجویان */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 text-sm font-medium">مجموع دانشجویان</h3>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Users size={18} />
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {totalStudents.toLocaleString()} <span className="text-sm text-zinc-500 font-normal">نفر</span>
              </div>
              <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
                در تمامی دوره‌ها
              </p>
            </div>

            {/* کارت کل دوره‌ها */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 text-sm font-medium">کل دوره‌ها</h3>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <BookOpen size={18} />
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {totalCourses} <span className="text-sm text-zinc-500 font-normal">دوره</span>
              </div>
              <p className="text-xs text-purple-400 mt-2 flex items-center gap-1">
                ثبت شده در پلتفرم
              </p>
            </div>

            {/* کارت دوره‌های در انتظار */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 text-sm font-medium">در انتظار بررسی</h3>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                  <Clock size={18} />
                </span>
              </div>
              <div className="text-2xl font-black text-white">
                {pendingCourses} <span className="text-sm text-zinc-500 font-normal">دوره</span>
              </div>
              <p className="text-xs text-orange-400 mt-2 flex items-center gap-1">
                نیاز به تایید ادمین دارند
              </p>
            </div>

          </div>

          {/* بخش نمودار (آینده) */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden group">
            {/* یک افکت گرادیانت ملایم برای زیبایی */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                <DollarSign className="w-8 h-8 text-zinc-500" />
              </div>
              <h4 className="text-lg font-medium text-zinc-300 mb-2">نمودار فروش و ثبت‌نام</h4>
              <p className="text-sm text-zinc-500 max-w-sm">
                این بخش در آینده برای نمایش نمودار خطی درآمد ماه‌انه و روند رشد دانشجویان پیاده‌سازی خواهد شد.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}