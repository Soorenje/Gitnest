"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "./../../../../utils/apiFetch";
import { toast } from "sonner";
import { Plus, Percent, Loader2, Trash2, CalendarX2 } from "lucide-react";

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

  const fetchDiscounts = async () => {
    try {
      const response = await apiFetch("/discount");
      const data = await response.json();
      if (response.ok) {
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
        fetchDiscounts();
      } else {
        toast.error(data.message || "خطا در ایجاد کد تخفیف");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("آیا از حذف این کد تخفیف مطمئن هستید؟")) return;

    try {
      const response = await apiFetch(`/discount/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("کد تخفیف با موفقیت حذف شد");
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="p-2.5 md:p-3 bg-blue-500/10 text-blue-400 rounded-xl md:rounded-2xl shrink-0">
          <Percent size={24} className="md:w-7 md:h-7" />
        </div>
        <h2 className="text-xl md:text-3xl font-bold text-white">مدیریت کدهای تخفیف</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        {/* فرم ایجاد کد تخفیف */}
        <div className="lg:col-span-1 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg h-fit">
          <h3 className="text-base md:text-lg font-bold text-white mb-5 md:mb-6 flex items-center gap-2">
            <Plus size={18} className="text-blue-400 md:w-5 md:h-5" />
            ایجاد کد تخفیف جدید
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">کد (متن)</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="مثلاً: YALDA"
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 md:py-3 text-white text-sm focus:border-blue-500/50 transition-all text-left dir-ltr uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">درصد تخفیف</label>
                <input
                  type="number"
                  name="percent"
                  min="1"
                  max="100"
                  value={formData.percent}
                  onChange={handleChange}
                  placeholder="٪"
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 md:py-3 text-white text-sm focus:border-blue-500/50 transition-all text-left dir-ltr"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">ظرفیت کل</label>
                <input
                  type="number"
                  name="maxUsage"
                  min="1"
                  value={formData.maxUsage}
                  onChange={handleChange}
                  placeholder="تعداد"
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 md:py-3 text-white text-sm focus:border-blue-500/50 transition-all text-left dir-ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">تاریخ انقضا</label>
              <input
                type="date"
                name="expireAt"
                value={formData.expireAt}
                onChange={handleChange}
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 md:py-3 text-zinc-300 text-sm focus:border-blue-500/50 transition-all"
                style={{ colorScheme: "dark" }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 text-sm md:text-base"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> ثبت کد تخفیف</>}
            </button>
          </form>
        </div>

        {/* لیست کدهای تخفیف */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg">
          <h3 className="text-base md:text-lg font-bold text-white mb-5 md:mb-6">کدهای تخفیف فعال</h3>

          {isFetching ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-zinc-500">
              <Loader2 size={28} className="animate-spin mb-3 text-blue-500 md:w-8 md:h-8" />
              <p className="text-xs md:text-sm">در حال دریافت اطلاعات...</p>
            </div>
          ) : discounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-zinc-500">
              <CalendarX2 size={40} className="mb-3 opacity-50 md:w-12 md:h-12" />
              <p className="text-xs md:text-sm">هیچ کد تخفیفی یافت نشد.</p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-[10px] md:text-sm text-right min-w-[500px]">
                <thead className="text-[10px] md:text-xs text-zinc-400 bg-white/5 rounded-xl">
                  <tr>
                    <th className="px-3 md:px-4 py-2.5 md:py-3 rounded-r-xl font-medium">کد تخفیف</th>
                    <th className="px-3 md:px-4 py-2.5 md:py-3 font-medium">درصد</th>
                    <th className="px-3 md:px-4 py-2.5 md:py-3 font-medium text-center">استفاده / ظرفیت</th>
                    <th className="px-3 md:px-4 py-2.5 md:py-3 font-medium">تاریخ انقضا</th>
                    <th className="px-3 md:px-4 py-2.5 md:py-3 rounded-l-xl font-medium text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {discounts.map((discount) => {
                    const isExpired = new Date(discount.expireAt) < new Date();
                    const isFull = discount.uses >= discount.maxUsage;

                    return (
                      <tr key={discount._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-3 md:px-4 py-3 md:py-4 font-bold text-blue-400 font-mono tracking-wider">
                          {discount.code}
                        </td>
                        <td className="px-3 md:px-4 py-3 md:py-4 text-white">
                          ٪{discount.percent}
                        </td>
                        <td className="px-3 md:px-4 py-3 md:py-4 text-center">
                          <span className={`${isFull ? "text-red-400" : "text-zinc-300"}`}>
                            {discount.uses}
                          </span>
                          <span className="text-zinc-600 mx-1">/</span>
                          <span className="text-zinc-400">{discount.maxUsage}</span>
                        </td>
                        <td className="px-3 md:px-4 py-3 md:py-4 text-zinc-400" dir="ltr">
                          <span className={isExpired ? "text-red-400 line-through opacity-70" : ""}>
                            {new Date(discount.expireAt).toLocaleDateString('fa-IR')}
                          </span>
                        </td>
                        <td className="px-3 md:px-4 py-3 md:py-4 text-center">
                          <button
                            onClick={() => handleDelete(discount._id)}
                            className="p-1.5 md:p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
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