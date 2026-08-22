"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  MoreVertical, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Ban, 
  Edit, 
  Trash2,
  Filter,
  Eye,
  Plus,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "../../../../utils/apiFetch"; 

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiFetch("/course/admin/courses");
        if (res.ok) {
          const data = await res.json();
          const actualCourses = data.data || data; 
          setCourses(Array.isArray(actualCourses) ? actualCourses : []);
        } else {
          toast.error("خطا در دریافت لیست دوره‌ها");
        }
      } catch (error) {
        toast.error("خطای ارتباط با سرور");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const instructorName = course.creator?.name || course.creator?.username || "";
    const matchesSearch = course.name?.includes(searchTerm) || instructorName.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    setOpenMenuId(null);
    try {
      const res = await apiFetch(`/course/admin/courses/${id}/status?status=${newStatus}`, {
        method: "PATCH",
      });

      if (res.ok) {
        toast.success(`وضعیت دوره به ${newStatus === "Approved" ? "تایید شده" : "رد شده"} تغییر یافت.`);
        setCourses(courses.map(c => c._id === id ? { ...c, status: newStatus } : c));
      } else {
        const data = await res.json();
        toast.error(data?.message || "خطا در تغییر وضعیت دوره");
      }
    } catch (error) {
      toast.error("خطای ارتباط با سرور");
    }
  };

  const handleDeleteClick = () => {
    setOpenMenuId(null);
    toast.error("ارور: حذف دوره فعلاً پیاده‌سازی نشده است.");
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Approved": return { text: "منتشر شده", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" };
      case "Pending": return { text: "در انتظار بررسی", icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
      case "Rejected": return { text: "رد شده", icon: Ban, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
      default: return { text: "نامشخص", icon: BookOpen, color: "text-zinc-400", bg: "bg-white/5", border: "border-white/10" };
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">مدیریت دوره‌ها</h2>
          <p className="text-xs md:text-sm text-zinc-400">بررسی، تایید و مدیریت دوره‌های آموزشی پلتفرم</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="جستجو (دوره یا مدرس)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 pr-10 pl-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all text-sm"
            />
          </div>

          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition-all duration-300">
            <Plus size={18} className="md:w-[20px] md:h-[20px]" /> افزودن دوره جدید
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2 mb-6 bg-white/[0.02] border border-white/5 p-1 rounded-xl w-max overflow-x-auto max-w-full scrollbar-hide">
        <div className="px-2 md:px-3 text-zinc-500 flex items-center gap-2 border-l border-white/10">
          <Filter size={14} className="md:w-4 md:h-4" />
        </div>
        {[
          { id: "All", title: "همه دوره‌ها" },
          { id: "Approved", title: "منتشر شده" },
          { id: "Pending", title: "در انتظار بررسی" },
          { id: "Rejected", title: "رد شده" },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 md:gap-2 ${
              statusFilter === tab.id ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.title}
            {tab.id === "Pending" && courses.filter(c => c.status === "Pending").length > 0 && (
              <span className="flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-md bg-orange-500/20 text-[9px] md:text-[10px] text-orange-400">
                {courses.filter(c => c.status === "Pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg shadow-black/20 relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a1024]/50 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-spin mb-2" />
            <span className="text-zinc-400 text-xs md:text-sm">در حال دریافت دوره‌ها...</span>
          </div>
        )}

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-right border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-400 text-[10px] md:text-xs font-medium uppercase tracking-wider">
                <th className="p-4 md:p-5 w-16 text-center">شناسه</th>
                <th className="p-4 md:p-5">عنوان دوره</th>
                <th className="p-4 md:p-5">مدرس</th>
                <th className="p-4 md:p-5">قیمت (تومان)</th>
                <th className="p-4 md:p-5">وضعیت</th>
                <th className="p-4 md:p-5 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs md:text-sm">
              {!isLoading && filteredCourses.length > 0 ? (
                filteredCourses.map((course) => {
                  const status = getStatusInfo(course.status);
                  return (
                    <tr key={course._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 md:p-5 text-center text-zinc-500 text-[10px] md:text-xs font-mono">
                        {course._id.slice(-6)}
                      </td>

                      <td className="p-4 md:p-5">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 overflow-hidden">
                            {course.cover ? (
                              <img src={course.cover} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <BookOpen size={16} className="md:w-[18px] md:h-[18px]" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white mb-0.5 line-clamp-1 text-xs md:text-sm">{course.name}</div>
                            <div className="text-[9px] md:text-[10px] text-zinc-500">
                              ثبت: {new Date(course.createdAt).toLocaleDateString('fa-IR')}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 md:p-5 text-zinc-300 whitespace-nowrap">
                        {course.creator?.name || course.creator?.username || "نامشخص"}
                      </td>

                      <td className="p-4 md:p-5">
                        <span className="font-medium text-white">
                          {course.price === 0 ? "رایگان" : course.price.toLocaleString()}
                        </span>
                      </td>

                      <td className="p-4 md:p-5">
                        <span className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 rounded-lg border ${status.border} ${status.bg} ${status.color} text-[10px] md:text-xs font-medium whitespace-nowrap`}>
                          <status.icon size={12} className="md:w-3.5 md:h-3.5" />
                          {status.text}
                        </span>
                      </td>

                      <td className="p-4 md:p-5 text-left relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === course._id ? null : course._id)}
                          className="p-1.5 md:p-2 rounded-lg md:rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <MoreVertical size={16} className="md:w-[18px] md:h-[18px]" />
                        </button>

                        {openMenuId === course._id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                            <div className="absolute left-8 md:left-10 top-8 md:top-10 mt-1 w-44 md:w-48 bg-[#0a1024] border border-white/10 rounded-xl md:rounded-2xl p-2 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-100">
                              <Link href={`/course/${course._id}`} className="w-full flex items-center gap-2 px-3 py-2 md:py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg md:rounded-xl transition-colors">
                                <Eye size={14} /> مشاهده در سایت
                              </Link>

                              {course.status === "Pending" && (
                                <>
                                  <button onClick={() => handleStatusChange(course._id, "Approved")} className="w-full flex items-center gap-2 px-3 py-2 md:py-2.5 text-xs font-medium text-green-400 hover:bg-green-500/10 rounded-lg md:rounded-xl transition-colors mt-1">
                                    <CheckCircle2 size={14} /> تایید و انتشار
                                  </button>
                                  <button onClick={() => handleStatusChange(course._id, "Rejected")} className="w-full flex items-center gap-2 px-3 py-2 md:py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg md:rounded-xl transition-colors mt-1">
                                    <Ban size={14} /> رد کردن دوره
                                  </button>
                                </>
                              )}

                              {course.status === "Approved" && (
                                <button onClick={() => handleStatusChange(course._id, "Rejected")} className="w-full flex items-center gap-2 px-3 py-2 md:py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg md:rounded-xl transition-colors mt-1">
                                  <Ban size={14} /> لغو انتشار
                                </button>
                              )}

                              <button className="w-full flex items-center gap-2 px-3 py-2 md:py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg md:rounded-xl transition-colors mt-1 border-t border-white/5 pt-2 md:pt-3">
                                <Edit size={14} /> ویرایش اطلاعات
                              </button>

                              <button onClick={handleDeleteClick} className="w-full flex items-center gap-2 px-3 py-2 md:py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg md:rounded-xl transition-colors mt-1">
                                <Trash2 size={14} /> حذف دوره
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : !isLoading && (
                <tr>
                  <td colSpan={6} className="p-8 md:p-10 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <Search size={28} className="mb-2 md:mb-3 opacity-50" />
                      <p className="text-xs md:text-sm">دوره‌ای با این مشخصات یافت نشد.</p>
                    </div>
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