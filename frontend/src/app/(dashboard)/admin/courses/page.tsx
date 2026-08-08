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
import { apiFetch } from "../../../../utils/apiFetch"; // 💡 مسیر apiFetch را در صورت نیاز اصلاح کنید

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // All, Approved, Pending, Rejected
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // 💡 دریافت لیست دوره‌ها از بک‌اند
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await apiFetch("/course/admin/courses");
        if (res.ok) {
          const data = await res.json();
          // 💡 اصلاح: اگر دیتا مستقیماً خود آرایه بود همان را بگیر، در غیر این صورت داخل data بگرد
          const actualCourses = data.data || data; 
          setCourses(Array.isArray(actualCourses) ? actualCourses : []);
        } else {
          toast.error("خطا در دریافت لیست دوره‌ها");
        }
      } catch (error) {
        toast.error("خطای ارتباط با سرور");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  // 💡 فیلتر کردن دوره‌ها بر اساس سرچ و وضعیت
  const filteredCourses = courses.filter((course) => {
    const instructorName = course.creator?.name || course.creator?.username || "";
    const matchesSearch = course.name?.includes(searchTerm) || instructorName.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 💡 تابع تغییر وضعیت دوره (ارسال درخواست به بک‌اند)
  const handleStatusChange = async (id: string, newStatus: string) => {
    setOpenMenuId(null);
    try {
      // ارسال درخواست PATCH به همراه کوئری status
      const res = await apiFetch(`/course/admin/courses/${id}/status?status=${newStatus}`, {
        method: "PATCH",
      });
      
      if (res.ok) {
        toast.success(`وضعیت دوره با موفقیت به ${newStatus === "Approved" ? "تایید شده" : "رد شده"} تغییر یافت.`);
        // آپدیت کردن استیت لوکال برای رندر مجدد بدون نیاز به رفرش صفحه
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
    toast.error("روت مربوط به حذف دوره در بک‌اند هنوز پیاده‌سازی نشده است.");
  };

  // کمکی برای نمایش وضعیت‌ها بر اساس مقادیر واقعی دیتابیس
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Approved":
        return { text: "منتشر شده", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" };
      case "Pending":
        return { text: "در انتظار بررسی", icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
      case "Rejected":
        return { text: "رد شده", icon: Ban, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
      default:
        return { text: "نامشخص", icon: BookOpen, color: "text-zinc-400", bg: "bg-white/5", border: "border-white/10" };
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* هدر صفحه */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">مدیریت دوره‌ها</h2>
          <p className="text-sm text-zinc-400">بررسی، تایید و مدیریت دوره‌های آموزشی پلتفرم</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="جستجو (نام دوره یا مدرس)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all text-sm"
            />
          </div>

          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300">
            <Plus size={18} />
            افزودن دوره جدید
          </button>
        </div>
      </div>

      {/* فیلتر وضعیت */}
      <div className="flex items-center gap-2 mb-6 bg-white/[0.02] border border-white/5 p-1 rounded-xl w-max overflow-x-auto max-w-full scrollbar-hide">
        <div className="px-3 text-zinc-500 flex items-center gap-2 border-l border-white/10">
          <Filter size={16} />
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
              statusFilter === tab.id ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.title}
            {tab.id === "Pending" && courses.filter(c => c.status === "Pending").length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-500/20 text-[10px] text-orange-400">
                {courses.filter(c => c.status === "Pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* جدول دوره‌ها */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-lg shadow-black/20 relative min-h-[300px]">
        
        {/* لودینگ */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a1024]/50 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <span className="text-zinc-400 text-sm">در حال دریافت دوره‌ها...</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                <th className="p-5 w-16 text-center">شناسه</th>
                <th className="p-5">عنوان دوره</th>
                <th className="p-5">مدرس</th>
                <th className="p-5">قیمت (تومان)</th>
                <th className="p-5">وضعیت</th>
                <th className="p-5 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {!isLoading && filteredCourses.length > 0 ? (
                filteredCourses.map((course) => {
                  const status = getStatusInfo(course.status);
                  return (
                    <tr key={course._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-5 text-center text-zinc-500 text-xs font-mono">
                        {course._id.slice(-6)}
                      </td>
                      
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 overflow-hidden">
                            {course.cover ? (
                              <img src={course.cover} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <BookOpen size={18} />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white mb-0.5 line-clamp-1">{course.name}</div>
                            <div className="text-xs text-zinc-500">
                              ثبت شده در: {new Date(course.createdAt).toLocaleDateString('fa-IR')}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-5 text-zinc-300">
                        {course.creator?.name || course.creator?.username || "نامشخص"}
                      </td>

                      <td className="p-5">
                        <span className="font-medium text-white">
                          {course.price === 0 ? "رایگان" : course.price.toLocaleString()}
                        </span>
                      </td>

                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border ${status.border} ${status.bg} ${status.color} text-xs font-medium whitespace-nowrap`}>
                          <status.icon size={14} />
                          {status.text}
                        </span>
                      </td>

                      <td className="p-5 text-left relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === course._id ? null : course._id)}
                          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* منوی دراپ‌داون */}
                        {openMenuId === course._id && (
                          <div className="absolute left-8 top-10 mt-1 w-44 bg-[#0a1024] border border-white/10 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-20 animate-in fade-in zoom-in-95 duration-100">
                            <Link href={`/course/${course._id}`} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                              <Eye size={14} />
                              مشاهده دوره در سایت
                            </Link>
                            
                            {course.status === "Pending" && (
                              <>
                                <button onClick={() => handleStatusChange(course._id, "Approved")} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-green-400 hover:bg-green-500/10 rounded-xl transition-colors mt-1">
                                  <CheckCircle2 size={14} />
                                  تایید و انتشار
                                </button>
                                <button onClick={() => handleStatusChange(course._id, "Rejected")} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1">
                                  <Ban size={14} />
                                  رد کردن دوره
                                </button>
                              </>
                            )}
                            
                            {course.status === "Approved" && (
                               <button onClick={() => handleStatusChange(course._id, "Rejected")} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1">
                                <Ban size={14} />
                                لغو انتشار (رد کردن)
                              </button>
                            )}

                            <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors mt-1 border-t border-white/5 pt-3">
                              <Edit size={14} />
                              ویرایش اطلاعات
                            </button>
                            
                            <button onClick={handleDeleteClick} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1">
                              <Trash2 size={14} />
                              حذف دوره
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : !isLoading && (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <Search size={32} className="mb-3 opacity-50" />
                      <p>دوره‌ای با این مشخصات یافت نشد.</p>
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