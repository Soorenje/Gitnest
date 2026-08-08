"use client";

import { useState, useEffect } from "react";
import { Search, PlayCircle, Filter, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "../../../../utils/apiFetch";

export default function StudentCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const res = await apiFetch("/auth/me");
        if (res.ok) {
          const data = await res.json();
          const userData = data.data || data;
          setCourses(Array.isArray(userData.courses) ? userData.courses : []);
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const courseName = course?.name || "";
    return courseName.includes(searchTerm);
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">کتابخانه دوره‌های من</h2>
          <p className="text-sm text-zinc-400">آرشیو تمام آموزش‌هایی که تا به امروز تهیه کرده‌اید.</p>
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="جستجو در دوره‌های من..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8 bg-white/[0.02] border border-white/5 p-1 rounded-xl w-max overflow-x-auto max-w-full">
        <div className="px-3 text-zinc-500 flex items-center gap-2 border-l border-white/10">
          <Filter size={16} />
        </div>
        <button className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 text-white whitespace-nowrap">
          همه دوره‌ها ({courses.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#070b1a]/50">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        {!isLoading && filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <div key={course?._id || course?.id || index} className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 flex flex-col h-full hover:bg-white/[0.04] transition-all group">
              <div className="flex gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
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
                  <p className="text-xs text-zinc-500 mb-2">وضعیت: در جریان</p>
                </div>
              </div>

              <div className="mb-6 flex-1">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-zinc-400">پیشرفت شما</span>
                  <span className="font-bold text-blue-400">۰٪</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 grid gap-3 mt-auto">
                <Link 
                  href={course?.href ? `/course/${course.href}` : "#"} 
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/20"
                >
                  <PlayCircle size={16} />
                  ورود به دوره
                </Link>
              </div>
            </div>
          ))
        ) : !isLoading && (
          <div className="col-span-full py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center">
            <BookOpen size={48} className="text-zinc-700 mb-4" />
            <h3 className="text-white font-medium mb-2">دوره‌ای یافت نشد</h3>
            <p className="text-zinc-500 text-sm">موردی با این مشخصات وجود ندارد.</p>
          </div>
        )}
      </div>

    </div>
  );
}