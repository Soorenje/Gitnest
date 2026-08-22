"use client";

import { useState, useEffect } from "react";
import { 
  Search, Plus, Filter, Users, DollarSign, Star, 
  Clock, CheckCircle2, FileEdit, Edit3, BarChart2, 
  MoreVertical, X, ChevronDown, UploadCloud, Loader2 
} from "lucide-react";
import Link from "next/link";
import { apiFetch } from "./../../../../utils/apiFetch"; 

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // --- Modal & Form States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "", 
    description: "",
    cover: "", 
    support: "",
    href: "",
    price: "",
    categoryID: "",
  });

  const fetchInstructorCourses = async () => {
    try {
      const res = await apiFetch("/course/instructor/courses");
      const contentType = res.headers.get("content-type");
      
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("خطا در دریافت دوره‌های مدرس:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiFetch("/category");
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.data || []);
      }
    } catch (error) {
      console.error("خطا در دریافت دسته‌بندی‌ها:", error);
    }
  };

  useEffect(() => {
    fetchInstructorCourses();
    fetchCategories(); 
  }, []);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    setApiMessage(null);

    const fd = new FormData();
    fd.append("cover", file);

    try {
      const res = await fetch("https://gitnest-backend-l3tu.onrender.com/v1/course/upload/cover", {
        method: "POST",
        body: fd,
        credentials: "include", 
      });

      const data = await res.json();

      if (res.ok) {
        setFormData({ ...formData, cover: data.coverUrl });
        setApiMessage({ text: "تصویر کاور با موفقیت آپلود شد.", type: "success" });
      } else {
        setApiMessage({ text: data.message || "خطا در آپلود تصویر.", type: "error" });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setApiMessage({ text: "خطا در ارتباط با سرور برای آپلود تصویر.", type: "error" });
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiMessage(null);

    if (!formData.categoryID) {
      setApiMessage({ text: "لطفاً یک دسته‌بندی برای دوره انتخاب کنید.", type: "error" });
      setIsSubmitting(false);
      return;
    }

    if (!formData.cover) {
      setApiMessage({ text: "لطفاً تصویر کاور دوره را آپلود کنید.", type: "error" });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await apiFetch("/course/instructor/courses", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) 
        }),
      });

      const contentType = res.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();

        if (res.ok) {
          setApiMessage({ text: "دوره با موفقیت ایجاد شد.", type: "success" });
          setTimeout(() => {
            setIsModalOpen(false);
            setFormData({ name: "", shortDescription: "", description: "", cover: "", support: "", href: "", price: "", categoryID: "" });
            fetchInstructorCourses(); 
            setApiMessage(null);
          }, 1500);
        } else {
          setApiMessage({ text: data.message || "خطایی در ثبت دوره رخ داد.", type: "error" });
        }
      } else {
        setApiMessage({ text: "خطای سرور: پاسخ نامعتبر از سمت بک‌اند.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setApiMessage({ text: "خطا در ارتباط با شبکه یا سرور.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name?.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || course.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return { text: "منتشر شده", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" };
      case "pending":
        return { text: "در انتظار بررسی", icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
      case "rejected":
        return { text: "رد شده", icon: FileEdit, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
      default:
        return { text: "نامشخص", icon: FileEdit, color: "text-zinc-400", bg: "bg-white/5", border: "border-white/10" };
    }
  };

  const getSelectedCategoryName = () => {
    if (!formData.categoryID) return "انتخاب دسته‌بندی...";
    const category = categories.find(c => (c._id || c.id) === formData.categoryID);
    return category ? (category.title || category.name) : "دسته‌بندی نامشخص";
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">دوره‌های من</h2>
          <p className="text-xs md:text-sm text-zinc-400">ساخت دوره جدید، ویرایش سرفصل‌ها و مشاهده آمار فروش</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="جستجو در دوره‌ها..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 pr-10 pl-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all text-xs md:text-sm"
            />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 whitespace-nowrap"
          >
            + ایجاد دوره جدید
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2 mb-6 bg-white/[0.02] border border-white/5 p-1 rounded-xl w-max overflow-x-auto max-w-full scrollbar-hide">
        <div className="px-2 md:px-3 text-zinc-500 flex items-center gap-2 border-l border-white/10">
          <Filter size={14} className="md:w-4 md:h-4" />
        </div>
        {[
          { id: "all", title: "همه دوره‌ها" },
          { id: "approved", title: "منتشر شده" },
          { id: "pending", title: "در انتظار بررسی" },
          { id: "rejected", title: "رد شده" },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
              statusFilter === tab.id ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[300px] text-zinc-400 gap-3">
           <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
           <span className="text-xs md:text-sm">در حال دریافت اطلاعات...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {
              const status = getStatusInfo(course.status);
              return (
                <div key={course._id} className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-4 md:p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all group relative">
                  <Link href={`/instructor/courses/${course._id}/edit`} className="absolute inset-0 z-10 rounded-2xl md:rounded-3xl"></Link>
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-zinc-800 overflow-hidden shrink-0 relative z-0">
                      <img src={course.cover || "/placeholder.jpg"} alt={course.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="relative z-20">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === course._id ? null : course._id);
                        }}
                        className="p-1.5 md:p-2 rounded-lg md:rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <MoreVertical size={16} className="md:w-[18px] md:h-[18px]" />
                      </button>
                      
                      {openMenuId === course._id && (
                        <div className="absolute left-0 top-8 md:top-10 mt-1 w-40 md:w-44 bg-[#0a1024] border border-white/10 rounded-xl md:rounded-2xl p-2 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-100">
                          <Link href={`/instructor/courses/${course._id}/edit`} className="w-full flex items-center gap-2 px-3 py-2 md:py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg md:rounded-xl transition-colors relative z-40">
                            <Edit3 size={14} /> ویرایش سرفصل‌ها
                          </Link>
                          <Link href={`/instructor/courses/${course._id}/analytics`} className="w-full flex items-center gap-2 px-3 py-2 md:py-2.5 text-xs font-medium text-blue-400 hover:bg-blue-500/10 rounded-lg md:rounded-xl transition-colors mt-1 relative z-40">
                            <BarChart2 size={14} /> آمار و گزارش
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 md:mb-5 relative z-0 pointer-events-none">
                    <span className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-2.5 py-0.5 md:py-1 mb-2 md:mb-3 rounded-md md:rounded-lg border ${status.border} ${status.bg} ${status.color} text-[9px] md:text-[10px] font-bold tracking-wide`}>
                      <status.icon size={10} className="md:w-3 md:h-3" />
                      {status.text}
                    </span>
                    <h4 className="text-white font-bold text-sm md:text-base mb-1 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                      {course.name}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-3 md:pt-4 border-t border-white/5 relative z-0 pointer-events-none">
                     <div className="flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white/[0.02]">
                       <DollarSign size={12} className="text-green-400 md:w-3.5 md:h-3.5" />
                       <span className="text-white font-medium text-xs md:text-sm">{Number(course.price).toLocaleString()} تومان</span>
                     </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 md:py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-2xl md:rounded-3xl flex flex-col items-center justify-center text-center">
              <FileEdit size={40} className="text-zinc-700 mb-3 md:mb-4 md:w-12 md:h-12" />
              <h3 className="text-white font-medium mb-2 text-sm md:text-base">دوره‌ای یافت نشد</h3>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs md:text-sm font-medium transition-all mt-3 md:mt-4">
                <Plus size={16} className="md:w-[18px] md:h-[18px]" /> ایجاد اولین دوره
              </button>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* پاپ‌آپ افزودن دوره */}
      {/* ------------------------------------------------ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5 bg-white/[0.02] shrink-0">
              <h3 className="text-base md:text-lg font-bold text-white">ایجاد دوره جدید</h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setApiMessage(null);
                }} 
                className="text-zinc-500 hover:text-white transition-colors bg-white/5 p-1.5 md:p-2 rounded-lg"
              >
                <X size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-5 md:p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              
              {apiMessage && (
                <div className={`p-3 rounded-xl text-xs md:text-sm text-center border ${apiMessage.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                  {apiMessage.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">نام دوره</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-xs md:text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">شناسه URL (Href)</label>
                  <input required value={formData.href} onChange={(e) => setFormData({...formData, href: e.target.value})} type="text" dir="ltr" placeholder="مثال: nextjs-course" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-xs md:text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">توضیح کوتاه دوره</label>
                  <textarea required value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} rows={2} placeholder="یک توضیح مختصر و جذاب..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-xs md:text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">توضیحات کامل دوره</label>
                  <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-xs md:text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">قیمت (تومان)</label>
                  <input required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} type="number" min="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-xs md:text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">وضعیت پشتیبانی</label>
                  <input required value={formData.support} onChange={(e) => setFormData({...formData, support: e.target.value})} type="text" placeholder="مثال: تلگرام" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-xs md:text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>

                <div className="relative">
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">دسته‌بندی دوره</label>
                  <button 
                    type="button" 
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm focus:outline-none focus:border-blue-500 transition-colors flex justify-between items-center"
                  >
                    <span className={formData.categoryID ? "text-white font-medium truncate" : "text-zinc-500"}>
                      {getSelectedCategoryName()}
                    </span>
                    <ChevronDown size={14} className={`text-zinc-500 shrink-0 transition-transform duration-200 md:w-4 md:h-4 ${isCategoryDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsCategoryDropdownOpen(false)}></div>
                      <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto custom-scrollbar bg-[#0f1631] border border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                        {categories.length > 0 ? (
                          categories.map((cat) => {
                            const catId = cat._id || cat.id;
                            return (
                              <div 
                                key={catId} 
                                onClick={() => { 
                                  setFormData({...formData, categoryID: catId}); 
                                  setIsCategoryDropdownOpen(false); 
                                }} 
                                className={`px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm cursor-pointer transition-colors flex items-center gap-2 ${formData.categoryID === catId ? "bg-blue-600/20 text-blue-400" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${formData.categoryID === catId ? "bg-blue-500" : "bg-transparent"}`}></div>
                                <span className="truncate">{cat.title || cat.name}</span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-4 py-3 text-xs md:text-sm text-zinc-500 text-center">دسته‌بندی یافت نشد</div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">کاور دوره</label>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative flex-1">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCoverUpload} 
                        disabled={isUploadingCover}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed" 
                      />
                      <div className={`w-full border-2 border-dashed rounded-xl px-3 md:px-4 py-2.5 flex items-center justify-center gap-1.5 md:gap-2 transition-colors ${formData.cover ? 'border-green-500/30 bg-green-500/5 text-green-400' : 'border-white/10 bg-white/5 text-zinc-400 hover:border-blue-500 hover:text-blue-400'}`}>
                        {isUploadingCover ? (
                          <><Loader2 size={14} className="animate-spin text-blue-500 md:w-4 md:h-4"/> <span className="text-[10px] md:text-xs font-medium">آپلود...</span></>
                        ) : formData.cover ? (
                          <><CheckCircle2 size={14} className="md:w-4 md:h-4"/> <span className="text-[10px] md:text-xs font-medium">آپلود شد</span></>
                        ) : (
                          <><UploadCloud size={14} className="md:w-4 md:h-4"/> <span className="text-[10px] md:text-xs font-medium">انتخاب کاور</span></>
                        )}
                      </div>
                    </div>

                    {formData.cover && (
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 relative bg-zinc-800">
                        <img src={formData.cover} alt="Cover Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

              </div>

              <div className="mt-2 md:mt-4 flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 border-t border-white/5 shrink-0">
                <button type="submit" disabled={isSubmitting || isUploadingCover} className="w-full sm:flex-1 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs md:text-sm font-medium hover:shadow-lg transition-all flex justify-center items-center">
                  {isSubmitting ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : "ثبت و ارسال برای بررسی"}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsModalOpen(false);
                    setApiMessage(null);
                  }} 
                  className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 rounded-xl bg-white/5 text-zinc-300 text-xs md:text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  انصراف
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}