"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "./../../../../utils/apiFetch";
import { toast } from "sonner";
import { Plus, Percent, Loader2, Trash2, CalendarX2 } from "lucide-react";

// تعریف تایپ برای کدهای تخفیف
type Discount = {
  _id: string;
  code: string;
  percent: number;
  maxUsage: number;
  uses: number;
  expireAt: string;
};

export default function AdminDiscountsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  
  const [formData, setFormData] = useState({
    code: "",
    percent: "",
    maxUsage: "",
    expireAt: "",
  });

  // دریافت لیست تخفیف‌ها از سرور
  const fetchDiscounts = async () => {
    try {
      const response = await apiFetch("/discount");
      const data = await response.json();
      
      if (response.ok) {
        // چون در apiFetch شما parsedData.data برگردانده می‌شود
        setDiscounts(data.discounts || []);
      }
    } catch (error) {
      toast.error("خطا در دریافت لیست تخفیف‌ها");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // هندل کردن فرم ایجاد تخفیف
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.percent || !formData.maxUsage || !formData.expireAt) {
      toast.error("لطفاً تمامی فیلدها را پر کنید");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiFetch("/discount", {
        method: "POST",
        body: JSON.stringify({
          code: formData.code,
          percent: Number(formData.percent),
          maxUsage: Number(formData.maxUsage),
          expireAt: formData.expireAt,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "کد تخفیف با موفقیت ایجاد شد");
        setFormData({ code: "", percent: "", maxUsage: "", expireAt: "" });
        // آپدیت کردن لیست بعد از ایجاد موفق
        fetchDiscounts();
      } else {
        toast.error(data.message || "خطا در ایجاد کد تخفیف");
      }
    } catch (error) {
      toast.error("خطا در برقراری ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  // هندل کردن حذف کد تخفیف
  const handleDelete = async (id: string) => {
    if (!window.confirm("آیا از حذف این کد تخفیف مطمئن هستید؟")) return;

    try {
      const response = await apiFetch(`/discount/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("کد تخفیف با موفقیت حذف شد");
        // حذف مستقیم از استیت برای سرعت بیشتر UI (بدون نیاز به رفرش کل لیست)
        setDiscounts((prev) => prev.filter((d) => d._id !== id));
      } else {
        const data = await response.json();
        toast.error(data.message || "خطا در حذف کد تخفیف");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
          <Percent size={28} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">مدیریت کدهای تخفیف</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* فرم ایجاد کد تخفیف */}
        <div className="lg:col-span-1 bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg h-fit">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Plus size={20} className="text-blue-400" />
            ایجاد کد تخفیف جدید
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">کد تخفیف (متن)</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="مثلاً: YALDA1403"
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-left dir-ltr uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">درصد تخفیف</label>
                <input
                  type="number"
                  name="percent"
                  min="1"
                  max="100"
                  value={formData.percent}
                  onChange={handleChange}
                  placeholder="مثلاً: 25"
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-left dir-ltr"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">ظرفیت کل</label>
                <input
                  type="number"
                  name="maxUsage"
                  min="1"
                  value={formData.maxUsage}
                  onChange={handleChange}
                  placeholder="مثلاً: 100"
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-left dir-ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">تاریخ انقضا</label>
              <input
                type="date"
                name="expireAt"
                value={formData.expireAt}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                style={{ colorScheme: "dark" }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Plus size={20} />
                  ثبت کد تخفیف
                </>
              )}
            </button>
          </form>
        </div>

        {/* لیست کدهای تخفیف */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">کدهای تخفیف فعال</h3>
          
          {isFetching ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-zinc-500">
              <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
              <p>در حال دریافت اطلاعات...</p>
            </div>
          ) : discounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-zinc-500">
              <CalendarX2 size={48} className="mb-4 opacity-50" />
              <p>هیچ کد تخفیفی یافت نشد.</p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-sm text-right">
                <thead className="text-xs text-zinc-400 bg-white/5 rounded-xl">
                  <tr>
                    <th className="px-4 py-3 rounded-r-xl font-medium">کد تخفیف</th>
                    <th className="px-4 py-3 font-medium">درصد</th>
                    <th className="px-4 py-3 font-medium text-center">استفاده / ظرفیت</th>
                    <th className="px-4 py-3 font-medium">تاریخ انقضا</th>
                    <th className="px-4 py-3 rounded-l-xl font-medium text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {discounts.map((discount) => {
                    // بررسی انقضای کد تخفیف
                    const isExpired = new Date(discount.expireAt) < new Date();
                    const isFull = discount.uses >= discount.maxUsage;
                    
                    return (
                      <tr key={discount._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-4 font-bold text-blue-400 font-mono tracking-wider">
                          {discount.code}
                        </td>
                        <td className="px-4 py-4 text-white">
                          ٪{discount.percent}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`${isFull ? "text-red-400" : "text-zinc-300"}`}>
                            {discount.uses}
                          </span>
                          <span className="text-zinc-600 mx-1">/</span>
                          <span className="text-zinc-400">{discount.maxUsage}</span>
                        </td>
                        <td className="px-4 py-4 text-zinc-400" dir="ltr">
                          <span className={isExpired ? "text-red-400 line-through opacity-70" : ""}>
                            {new Date(discount.expireAt).toLocaleDateString('fa-IR')}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleDelete(discount._id)}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}