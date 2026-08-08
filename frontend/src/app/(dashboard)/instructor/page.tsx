"use client";

import { useState, useEffect } from "react";
import { Users, BookOpen, DollarSign, TrendingUp, ArrowUpRight, Loader2, Clock } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "./../../../utils/apiFetch"; // 💡 مسیر را در صورت نیاز اصلاح کنید

export default function InstructorDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalStudents: 0,
    totalCourses: 0,
    pendingCourses: 0,
    recentStudents: [] as any[]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesRes, studentsRes] = await Promise.all([
          apiFetch("/course/instructor/courses"),
          apiFetch("/user/instructor/student")
        ]);

        let courses = [];
        let students = [];

        if (coursesRes.ok) {
          const courseData = await coursesRes.json();
          courses = Array.isArray(courseData.data) ? courseData.data : (Array.isArray(courseData) ? courseData : []);
        }
        
        if (studentsRes.ok) {
          const studentData = await studentsRes.json();
          students = Array.isArray(studentData.data) ? studentData.data : (Array.isArray(studentData) ? studentData : []);
        }

        // 💡 محاسبه دقیق درآمد بر اساس تعداد دانشجویان و قیمت دوره
        let totalRev = 0;
        students.forEach((student: any) => {
          if (Array.isArray(student.courses)) {
            student.courses.forEach((course: any) => {
              totalRev += course.discountedPrice !== undefined ? course.discountedPrice : (course.price || 0);
            });
          }
        });

        const pendingCount = courses.filter((c: any) => c.status === "Pending").length;

        setStats({
          totalRevenue: totalRev,
          totalStudents: students.length,
          totalCourses: courses.length,
          pendingCourses: pendingCount,
          recentStudents: students.slice(0, 4) // ۴ دانشجوی آخر
        });

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return <div className="flex justify-center py-40"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">پنل اساتید</h2>
          <p className="text-sm text-zinc-400">خلاصه وضعیت دوره‌ها، فروش و عملکرد آموزشی شما</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 text-sm font-medium">برآورد کل درآمد</h3>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500/10 text-green-400"><DollarSign size={16} /></span>
          </div>
          <div className="text-2xl font-black text-white">{stats.totalRevenue.toLocaleString()} <span className="text-sm text-zinc-500 font-normal">تومان</span></div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 text-sm font-medium">کل دانشجویان شما</h3>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400"><Users size={16} /></span>
          </div>
          <div className="text-2xl font-black text-white">{stats.totalStudents} <span className="text-sm text-zinc-500 font-normal">نفر</span></div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 text-sm font-medium">کل دوره‌های شما</h3>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400"><BookOpen size={16} /></span>
          </div>
          <div className="text-2xl font-black text-white">{stats.totalCourses} <span className="text-sm text-zinc-500 font-normal">دوره</span></div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 text-sm font-medium">دوره‌های در انتظار</h3>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400"><Clock size={16} /></span>
          </div>
          <div className="text-2xl font-black text-white">{stats.pendingCourses} <span className="text-sm text-zinc-500 font-normal">دوره</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-6 min-h-[350px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <h3 className="text-white font-bold text-base">نمودار فروش و درآمد</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 text-sm gap-2">
            <TrendingUp size={32} className="opacity-50" />
            نمودار در آپدیت‌های بعدی اضافه خواهد شد.
          </div>
        </div>

        <div className="lg:col-span-1 bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col">
          <h3 className="text-white font-bold text-base border-b border-white/5 pb-4 mb-4">آخرین دانشجویان</h3>
          <div className="space-y-4 flex-1">
            {stats.recentStudents.length > 0 ? stats.recentStudents.map((item: any) => (
              <div key={item._id} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.01] border border-white/5">
                <div>
                  <h4 className="text-sm font-medium text-white mb-0.5">{item.name || item.username}</h4>
                  <p className="text-[11px] text-zinc-500 truncate w-32">{item.courses?.[0]?.name || "دوره"}</p>
                </div>
                <div className="text-[10px] text-zinc-600 mt-0.5">{new Date(item.createdAt).toLocaleDateString('fa-IR')}</div>
              </div>
            )) : <div className="text-center text-zinc-500 text-sm mt-10">هنوز دانشجویی ندارید.</div>}
          </div>
          <Link href="/instructor/users" className="w-full mt-4 py-3 rounded-xl bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 text-center transition-all text-xs font-medium flex items-center justify-center gap-1">مشاهده همه دانشجویان <ArrowUpRight size={14} /></Link>
        </div>
      </div>
    </div>
  );
}