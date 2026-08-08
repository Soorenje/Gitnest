"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2,
  X,
  AlertTriangle,
  Layers,
  Link as LinkIcon
} from "lucide-react";
import { apiFetch } from "../../../../utils/apiFetch";
import { toast } from "sonner"; // با توجه به اینکه در کدهای قبلی از sonner استفاده کردید

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // استیت‌های مودالِ فرم (افزودن و ویرایش)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // استیت‌های مودال تاییدیه (حذف)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    categoryId: string | null;
    categoryTitle: string;
  }>({ isOpen: false, categoryId: null, categoryTitle: "" });
  
  const [confirmText, setConfirmText] = useState("");

  // 💡 نکته: آدرس API ها را بر اساس روت‌های بک‌اند خود تنظیم کنید
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch(`/category`);
        if (response.ok) {
          const data = await response.json();
          // اگر دیتای شما داخل کلید خاصی مثل data است، آن را تغییر دهید
          setCategories(Array.isArray(data) ? data : data.data || []);
        }
      } catch (error) {
        console.error("خطا در دریافت لیست دسته‌بندی‌ها:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [refreshKey]);

  const filteredCategories = categories.filter((cat) => {
    return (
      cat.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) || // اگر از name به جای title استفاده می‌کنید
      cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatToShamsi = (dateString: string) => {
    if (!dateString) return "نامشخص";
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  const openAddModal = () => {
    setFormMode("add");
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setFormMode("edit");
    setEditingCategory(category);
    setOpenMenuId(null);
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // 💡 آدرس‌های مربوط به اضافه کردن و ویرایش دسته‌بندی را چک کنید
    const url = formMode === "add" ? "/category" : `/category/${editingCategory._id || editingCategory.id}`;
    const method = formMode === "add" ? "POST" : "PATCH";

    try {
      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(formMode === "add" ? "دسته‌بندی با موفقیت اضافه شد." : "دسته‌بندی با موفقیت بروز شد.");
        setIsFormModalOpen(false);
        setRefreshKey(prev => prev + 1); 
      } else {
        toast.error(result.message || "خطایی رخ داد.");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmText !== "CONFIRM" || !confirmModal.categoryId) return;
    setIsSubmitting(true);
    
    try {
      const res = await apiFetch(`/category/${confirmModal.categoryId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("دسته‌بندی با موفقیت حذف شد.");
        setConfirmModal({ isOpen: false, categoryId: null, categoryTitle: "" });
        setConfirmText("");
        setRefreshKey(prev => prev + 1);
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.message || "خطا در حذف دسته‌بندی.");
      }
    } catch (error) {
      toast.error("ارتباط با سرور برای حذف قطع شد.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      
      {/* هدر صفحه */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">مدیریت دسته‌بندی‌ها</h2>
          <p className="text-sm text-zinc-400">ساخت و مدیریت دسته‌بندی‌های آموزشی پلتفرم</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="جستجو (عنوان یا نامک)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all text-sm"
            />
          </div>

          <button 
            onClick={openAddModal} 
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2"
          >
            <Layers size={18} /> افزودن دسته‌بندی
          </button>
        </div>
      </div>

      {/* جدول دسته‌بندی‌ها */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-lg shadow-black/20 min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-zinc-400 gap-3">
             <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
             <span>در حال دریافت اطلاعات...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                  <th className="p-5 w-16 text-center">ردیف</th>
                  <th className="p-5">عنوان دسته‌بندی</th>
                  <th className="p-5">نامک (Slug)</th>
                  <th className="p-5">تاریخ ایجاد</th>
                  <th className="p-5 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category, index) => {
                    const categoryId = category._id || category.id; 
                    
                    return (
                      <tr key={categoryId} className="hover:bg-white/[0.02] transition-colors group">
                        
                        <td className="p-5 text-center text-zinc-500 font-medium">
                          {index + 1}
                        </td>
                        
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                              <Layers size={18} />
                            </div>
                            <span className="font-bold text-white">
                              {category.title || category.name || "بدون عنوان"}
                            </span>
                          </div>
                        </td>

                        <td className="p-5 text-zinc-300 font-mono text-xs">
                          <div className="flex items-center gap-2">
                            <LinkIcon size={14} className="text-zinc-500" />
                            {category.slug || "بدون-نامک"}
                          </div>
                        </td>

                        <td className="p-5 text-zinc-400 text-xs">
                          {formatToShamsi(category.createdAt)}
                        </td>

                        <td className="p-5 text-left relative">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === categoryId ? null : categoryId)}
                            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openMenuId === categoryId && (
                            <div className="absolute left-8 top-10 mt-1 w-44 bg-[#0a1024] border border-white/10 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-20 animate-in fade-in zoom-in-95 duration-100">
                              <button 
                                onClick={() => openEditModal(category)} 
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                              >
                                <Edit size={14} /> ویرایش دسته‌بندی
                              </button>
                              
                              <button 
                                onClick={() => {
                                  setOpenMenuId(null);
                                  setConfirmText("");
                                  setConfirmModal({ isOpen: true, categoryId, categoryTitle: category.title || category.name });
                                }} 
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1 border-t border-white/5 pt-3"
                              >
                                <Trash2 size={14} /> حذف دسته‌بندی
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center">
                      <div className="flex flex-col items-center justify-center text-zinc-500">
                        <Search size={32} className="mb-3 opacity-50" />
                        <p>دسته‌بندی با این مشخصات یافت نشد.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* پاپ‌آپ افزودن / ویرایش دسته‌بندی */}
      {/* ------------------------------------------------ */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white">
                {formMode === "add" ? "افزودن دسته‌بندی جدید" : "ویرایش دسته‌بندی"}
              </h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 flex flex-col gap-5">
              
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">عنوان دسته‌بندی (فارسی)</label>
                {/* 💡 اگر بک‌اند شما از کلید name به جای title استفاده می‌کند، ویژگی name در input را تغییر دهید */}
                <input 
                  required 
                  name="title" 
                  defaultValue={editingCategory?.title || editingCategory?.name || ""} 
                  type="text" 
                  placeholder="مثال: برنامه‌نویسی وب"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">نامک / Slug (انگلیسی)</label>
                <input 
                  required 
                  name="slug" 
                  defaultValue={editingCategory?.slug || ""} 
                  type="text" 
                  dir="ltr" 
                  placeholder="مثال: web-development"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono" 
                />
                <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">
                  نامک در آدرس URL استفاده می‌شود. فقط از حروف انگلیسی، اعداد و خط تیره (-) استفاده کنید.
                </p>
              </div>

              <div className="mt-2 flex gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all flex justify-center items-center"
                >
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (formMode === "add" ? "ثبت دسته‌بندی" : "ذخیره تغییرات")}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsFormModalOpen(false)} 
                  className="px-5 py-3 rounded-xl bg-white/5 text-zinc-300 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  انصراف
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* پاپ‌آپ تاییدیه حذف */}
      {/* ------------------------------------------------ */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-red-500/10 text-red-500">
              <AlertTriangle size={28} />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              حذف دائمی دسته‌بندی
            </h3>
            
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              آیا از حذف دسته‌بندی <span className="text-white font-bold">{confirmModal.categoryTitle}</span> مطمئن هستید؟ توجه داشته باشید که دوره‌های متصل به این دسته ممکن است با مشکل مواجه شوند.
            </p>

            <div className="w-full bg-white/5 border border-white/10 p-4 rounded-xl mb-6">
              <label className="block text-xs font-medium text-zinc-400 mb-2">برای تایید، کلمه <span className="text-white font-bold tracking-widest">CONFIRM</span> را تایپ کنید:</label>
              <input 
                type="text" 
                dir="ltr"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="CONFIRM"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white text-center tracking-widest text-sm focus:outline-none focus:border-red-500 transition-colors" 
              />
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={handleConfirmDelete}
                disabled={confirmText !== "CONFIRM" || isSubmitting}
                className={`flex-1 py-3 rounded-xl text-white text-sm font-medium transition-all flex justify-center items-center ${
                  confirmText !== "CONFIRM" 
                    ? "bg-white/5 text-zinc-500 cursor-not-allowed" 
                    : "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/25"
                }`}
              >
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "حذف دسته‌بندی"}
              </button>
              <button 
                onClick={() => { setConfirmModal({ isOpen: false, categoryId: null, categoryTitle: "" }); setConfirmText(""); }}
                className="px-5 py-3 rounded-xl bg-transparent border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white/5 transition-colors"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}