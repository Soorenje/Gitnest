"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/home/Navbar";
import Footer from "../../../components/home/footer";
import Link from "next/link";
import { Trash2, ShoppingCart, CreditCard, ArrowRight, Tag, ShieldCheck, Loader2 } from "lucide-react";
import { apiFetch } from "../../../utils/apiFetch";
import { toast } from "sonner";

// دیکشنری ترجمه ارورهای بک‌اند به فارسی
const translateError = (msg: string) => {
  if (!msg) return "خطایی رخ داده است";
  const translations: Record<string, string> = {
    "Your cart is empty": "سبد خرید شما خالی است",
    "Cart not found.": "سبد خریدی یافت نشد",
    "Invalid discount code": "کد تخفیف نامعتبر است",
    "This discount code has expired": "این کد تخفیف منقضی شده است",
    "This discount code has reached its usage limit": "ظرفیت این کد تخفیف تکمیل شده است",
    "You have already purchased this course": "شما قبلاً این دوره را خریداری کرده‌اید",
    "This course is already in your cart": "این دوره از قبل در سبد خرید شما وجود دارد",
    "Course not found": "دوره یافت نشد",
  };
  return translations[msg] || "خطایی در سیستم رخ داد، لطفاً دوباره تلاش کنید.";
};

export default function CartPage() {
  const router = useRouter();
  const [cartData, setCartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  const fetchCart = async () => {
    try {
      const res = await apiFetch("/cart");
      const data = await res.json();
      if (res.ok) {
        setCartData(data); 
      }
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات سبد خرید");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (courseId: string) => {
    try {
      const res = await apiFetch(`/cart/${courseId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("دوره از سبد خرید حذف شد");
        fetchCart(); 
      } else {
        toast.error(translateError(data?.message));
      }
    } catch (error) {
      toast.error("خطا در حذف دوره");
    }
  };

  const applyDiscount = async () => {
    if (!discountCode) return toast.error("لطفا کد تخفیف را وارد کنید");
    try {
      const res = await apiFetch("/cart/discount", {
        method: "POST",
        body: JSON.stringify({ code: discountCode }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("کد تخفیف اعمال شد");
        fetchCart();
      } else {
        toast.error(translateError(data?.message));
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await apiFetch("/order/checkout", { method: "GET" });
      const data = await res.json();
      if (res.ok && data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error(translateError(data?.message) || "خطا در ایجاد سفارش");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070b1a] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  const items = cartData?.items || [];
  const isEmpty = items.length === 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#070b1a] pt-24 md:pt-36 pb-16 md:pb-24 relative font-sans">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          
          {/* هدر سبد خرید */}
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-12">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShoppingCart size={24} className="md:w-[28px] md:h-[28px]" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white mb-0.5 md:mb-1">سبد خرید شما</h1>
              <p className="text-zinc-500 text-xs md:text-sm">
                {!isEmpty ? `${items.length} دوره در سبد خرید شما وجود دارد.` : "سبد خرید شما خالی است."}
              </p>
            </div>
          </div>

          {isEmpty ? (
            <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center flex flex-col items-center mt-4">
               <ShoppingCart size={48} className="text-zinc-700 mb-4 md:w-[64px] md:h-[64px]" />
               <h2 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">سبد خرید شما خالی است!</h2>
               <p className="text-zinc-500 text-xs md:text-sm mb-4 md:mb-6">شما هنوز هیچ دوره‌ای به سبد خرید خود اضافه نکرده‌اید.</p>
               <Link href="/courses" className="px-6 md:px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-base font-medium transition-colors shadow-lg shadow-blue-500/25">مشاهده دوره‌ها</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
              
              {/* لیست دوره‌های سبد */}
              <div className="lg:col-span-8 space-y-3 md:space-y-4">
                {items.map((item: any) => (
                  <div key={item._id} className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-3 md:p-4 flex flex-col sm:flex-row gap-4 md:gap-5 items-start sm:items-center group hover:bg-white/[0.04] transition-colors">
                    <div className="w-full sm:w-32 md:w-40 aspect-video rounded-xl md:rounded-2xl bg-[#0a1024] relative overflow-hidden shrink-0 border border-white/10">
                      <img src={item.cover || "/placeholder.jpg"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex-1 w-full flex flex-col justify-between">
                      <div>
                        <Link href={`/course/${item._id}`} className="text-sm md:text-lg font-bold text-white block mb-1.5 md:mb-2 hover:text-blue-400 transition-colors line-clamp-2">{item.name}</Link>
                        <div className="text-xs md:text-sm text-zinc-500 mb-3 md:mb-4">مدرس: {item.creator?.name || "نامشخص"}</div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-green-400 font-bold text-sm md:text-base">
                           {(item.discountedPrice || item.price).toLocaleString()} <span className="text-[10px] md:text-xs text-zinc-400 font-normal">تومان</span>
                        </div>
                        <button 
                          onClick={() => removeItem(item._id)} 
                          className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                          title="حذف از سبد خرید"
                        >
                          <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* سایدبار: فرم تخفیف و فاکتور نهایی */}
              <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-4 md:space-y-6">
                
                {/* کادر کد تخفیف */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6">
                  <label className="flex items-center gap-2 text-white font-medium mb-3 md:mb-4 text-sm md:text-base">
                    <Tag size={16} className="text-blue-500 md:w-[18px] md:h-[18px]" /> کد تخفیف دارید؟
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="کد تخفیف..." 
                      className="flex-1 bg-[#0a1024] border border-white/10 rounded-xl py-2.5 md:py-3 px-3 md:px-4 text-white text-xs md:text-sm text-left uppercase transition-colors focus:border-blue-500 outline-none" dir="ltr"
                    />
                    <button onClick={applyDiscount} className="px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs md:text-sm font-medium transition-colors">
                      اعمال
                    </button>
                  </div>
                </div>

                {/* فاکتور نهایی */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xl">
                  <h3 className="text-base md:text-lg font-bold text-white mb-4 md:mb-6 border-b border-white/5 pb-3 md:pb-4">فاکتور نهایی</h3>
                  
                  <div className="space-y-3 md:space-y-4 mb-5 md:mb-6">
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-zinc-400">مبلغ کل دوره‌ها</span>
                      <span className="text-white font-medium">{cartData?.totalPrice?.toLocaleString()} تومان</span>
                    </div>
                    {cartData?.cartDiscountAmount > 0 && (
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <span className="text-zinc-400">تخفیف اعمال شده</span>
                        <span className="text-red-400 font-medium">{cartData.cartDiscountAmount.toLocaleString()} تومان</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-white/5 pt-4 md:pt-5 mb-6 md:mb-8">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-sm md:text-base">مبلغ قابل پرداخت</span>
                      <div className="text-xl md:text-2xl font-black text-green-400">
                        {cartData?.finalPrice?.toLocaleString()} <span className="text-[10px] md:text-sm text-zinc-400 font-medium">تومان</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckoutLoading}
                    className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm md:text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isCheckoutLoading ? <Loader2 className="animate-spin md:w-5 md:h-5" /> : <><CreditCard size={18} className="md:w-[20px] md:h-[20px]" /> تکمیل خرید و پرداخت</>}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[10px] md:text-xs text-zinc-500">
                    <ShieldCheck size={14} className="text-green-500" />
                    پرداخت امن از طریق درگاه زرین‌پال
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}