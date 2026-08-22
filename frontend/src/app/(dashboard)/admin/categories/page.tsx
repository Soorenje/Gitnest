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
import { toast } from "sonner"; 

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    categoryId: string | null;
    categoryTitle: string;
  }>({ isOpen: false, categoryId: null, categoryTitle: "" });

  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch(`/category`);
        if (response.ok) {
          const data = await response.json();
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
      cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
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

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">مدیریت دسته‌بندی‌ها</h2>
          <p className="text-xs md:text-sm text-zinc-400">ساخت و مدیریت دسته‌بندی‌های آموزشی پلتفرم</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="جستجو..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 pr-10 pl-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all text-sm"
            />
          </div>

          <button 
            onClick={openAddModal} 
            className="w-full sm:w-auto px-5 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2"
          >
            <Layers size={18} /> افزودن دسته‌بندی
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg shadow-black/20 min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-zinc-400 gap-3">
             <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
             <span className="text-sm">در حال دریافت اطلاعات...</span>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-right border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-400 text-[10px] md:text-xs font-medium uppercase tracking-wider">
                  <th className="p-4 md:p-5 w-12 md:w-16 text-center">ردیف</th>
                  <th className="p-4 md:p-5">عنوان دسته‌بندی</th>
                  <th className="p-4 md:p-5">نامک (Slug)</th>
                  <th className="p-4 md:p-5">تاریخ ایجاد</th>
                  <th className="p-4 md:p-5 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs md:text-sm">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category, index) => {
                    const categoryId = category._id || category.id; 

                    return (
                      <tr key={categoryId} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-4 md:p-5 text-center text-zinc-500 font-medium">
                          {index + 1}
                        </td>
                        <td className="p-4 md:p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                              <Layers size={16} className="md:w-[18px] md:h-[18px]" />
                            </div>
                            <span className="font-bold text-white line-clamp-1">
                              {category.title || category.name || "بدون عنوان"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 md:p-5 text-zinc-300 font-mono text-[10px] md:text-xs">
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <LinkIcon size={12} className="text-zinc-500 md:w-3.5 md:h-3.5" />
                            <span className="truncate max-w-[100px] md:max-w-none">{category.slug || "بدون-نامک"}</span>
                          </div>
                        </td>
                        <td className="p-4 md:p-5 text-zinc-400 text-[10px] md:text-xs whitespace-nowrap">
                          {formatToShamsi(category.createdAt)}
                        </td>
                        <td className="p-4 md:p-5 text-left relative">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === categoryId ? null : categoryId)}
                            className="p-1.5 md:p-2 rounded-lg md:rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <MoreVertical size={16} className="md:w-[18px] md:h-[18px]" />
                          </button>

                          {openMenuId === categoryId && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                              <div className="absolute left-8 md:left-10 top-10 mt-1 w-40 md:w-44 bg-[#0a1024] border border-white/10 rounded-xl md:rounded-2xl p-2 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-100">
                                <button 
                                  onClick={() => openEditModal(category)} 
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg md:rounded-xl transition-colors"
                                >
                                  <Edit size={14} /> ویرایش 
                                </button>
                                <button 
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setConfirmText("");
                                    setConfirmModal({ isOpen: true, categoryId, categoryTitle: category.title || category.name });
                                  }} 
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg md:rounded-xl transition-colors mt-1 border-t border-white/5 pt-2 md:pt-3"
                                >
                                  <Trash2 size={14} /> حذف 
                                </button>
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 md:p-10 text-center">
                      <div className="flex flex-col items-center justify-center text-zinc-500">
                        <Search size={28} className="mb-2 md:mb-3 opacity-50" />
                        <p className="text-xs md:text-sm">دسته‌بندی با این مشخصات یافت نشد.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-base md:text-lg font-bold text-white">
                {formMode === "add" ? "افزودن دسته‌بندی جدید" : "ویرایش دسته‌بندی"}
              </h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg">
                <X size={18} className="md:w-5 md:h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 md:p-6 flex flex-col gap-4 md:gap-5">
              <div>
                <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">عنوان دسته‌بندی (فارسی)</label>
                <input 
                  required 
                  name="title" 
                  defaultValue={editingCategory?.title || editingCategory?.name || ""} 
                  type="text" 
                  placeholder="مثال: برنامه‌نویسی وب"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-xs md:text-sm focus:outline-none focus:border-blue-500 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5">نامک / Slug (انگلیسی)</label>
                <input 
                  required 
                  name="slug" 
                  defaultValue={editingCategory?.slug || ""} 
                  type="text" 
                  dir="ltr" 
                  placeholder="مثال: web-development"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-white text-xs md:text-sm focus:outline-none focus:border-blue-500 transition-colors font-mono" 
                />
                <p className="text-[9px] md:text-[10px] text-zinc-500 mt-1.5 leading-relaxed">
                  نامک در آدرس URL استفاده می‌شود. فقط از حروف انگلیسی، اعداد و خط تیره (-) استفاده کنید.
                </p>
              </div>

              <div className="mt-2 flex gap-2 md:gap-3">
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs md:text-sm font-medium hover:shadow-lg transition-all flex justify-center items-center"
                >
                  {isSubmitting ? <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (formMode === "add" ? "ثبت دسته‌بندی" : "ذخیره تغییرات")}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsFormModalOpen(false)} 
                  className="px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-white/5 text-zinc-300 text-xs md:text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-sm shadow-2xl p-5 md:p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 md:mb-4 bg-red-500/10 text-red-500">
              <AlertTriangle size={24} className="md:w-7 md:h-7" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-white mb-2">حذف دائمی دسته‌بندی</h3>
            <p className="text-xs md:text-sm text-zinc-400 mb-5 md:mb-6 leading-relaxed px-2">
              آیا از حذف دسته‌بندی <span className="text-white font-bold">{confirmModal.categoryTitle}</span> مطمئن هستید؟ دوره‌های متصل به این دسته ممکن است دچار مشکل شوند.
            </p>

            <div className="w-full bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl mb-5 md:mb-6">
              <label className="block text-[10px] md:text-xs font-medium text-zinc-400 mb-2">برای تایید، کلمه <span className="text-white font-bold tracking-widest">CONFIRM</span> را تایپ کنید:</label>
              <input 
                type="text" 
                dir="ltr"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="CONFIRM"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 md:py-2.5 text-white text-center tracking-widest text-xs md:text-sm focus:outline-none focus:border-red-500 transition-colors" 
              />
            </div>

            <div className="flex gap-2 md:gap-3 w-full">
              <button 
                onClick={handleConfirmDelete}
                disabled={confirmText !== "CONFIRM" || isSubmitting}
                className={`flex-1 py-2.5 md:py-3 rounded-xl text-white text-xs md:text-sm font-medium transition-all flex justify-center items-center ${
                  confirmText !== "CONFIRM" 
                    ? "bg-white/5 text-zinc-500 cursor-not-allowed" 
                    : "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/25"
                }`}
              >
                {isSubmitting ? <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "حذف دسته‌بندی"}
              </button>
              <button 
                onClick={() => { setConfirmModal({ isOpen: false, categoryId: null, categoryTitle: "" }); setConfirmText(""); }}
                className="px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-transparent border border-white/10 text-zinc-300 text-xs md:text-sm font-medium hover:bg-white/5 transition-colors"
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