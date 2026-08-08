"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, User, Loader2 } from "lucide-react";
import { apiFetch } from "./../../../../utils/apiFetch"; // 💡 مسیر را در صورت نیاز اصلاح کنید
import { toast } from "sonner";

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await apiFetch("/user/instructor/student");
        if (res.ok) {
          const data = await res.json();
          // 💡 اگر سرور دیتا را داخل data گذاشته بود، آن را بگیر، وگرنه خود دیتای اصلی
          const actualStudents = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
          setStudents(actualStudents);
        } else {
          toast.error("خطا در دریافت لیست دانشجویان");
        }
      } catch (error) {
        toast.error("خطای ارتباط با سرور");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const courseNames = Array.isArray(student.courses) ? student.courses.map((c: any) => c.name).join(" ") : "";
    return (
      (student.name || "").includes(searchTerm) || 
      (student.email || "").includes(searchTerm) || 
      courseNames.includes(searchTerm)
    );
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">دانشجویان من</h2>
          <p className="text-sm text-zinc-400">لیست خریداران دوره‌های شما</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="جستجو (نام، ایمیل یا دوره)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-lg shadow-black/20 relative min-h-[300px]">
        
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a1024]/50 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-400 text-xs font-medium uppercase">
                <th className="p-5">اطلاعات دانشجو</th>
                <th className="p-5">دوره‌های خریداری شده (از شما)</th>
                <th className="p-5">تاریخ ثبت‌نام در سایت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {!isLoading && filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                          {student.avatar ? <img src={student.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={18} />}
                        </div>
                        <div>
                          <div className="font-bold text-white mb-0.5">{student.name || student.username}</div>
                          <div className="text-xs text-zinc-500 font-sans">{student.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-zinc-300">
                      <div className="flex flex-col gap-2">
                        {Array.isArray(student.courses) && student.courses.length > 0 ? (
                           student.courses.map((course: any) => (
                            <div key={course._id} className="flex items-center gap-2 text-xs bg-white/5 px-2 py-1 rounded-md w-max">
                              <BookOpen size={12} className="text-blue-400" />
                              {course.name}
                            </div>
                           ))
                        ) : (
                          <span className="text-zinc-500">موردی یافت نشد</span>
                        )}
                      </div>
                    </td>

                    <td className="p-5 text-zinc-400 text-xs">
                      {new Date(student.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                  </tr>
                ))
              ) : !isLoading && (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-zinc-500">
                    دانشجویی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}