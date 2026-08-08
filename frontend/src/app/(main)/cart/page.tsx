'use client';

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
        // اصلاح مشکل لود نشدن دیتای سبد خرید
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
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  const items = cartData?.items || [];
  const isEmpty = items.length === 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#070b1a] pt-28 md:pt-36 pb-24 relative">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingCart size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white mb-1">سبد خرید شما</h1>
              <p className="text-zinc-500 text-sm">
                {!isEmpty ? `${items.length} دوره در سبد خرید شما وجود دارد.` : "سبد خرید شما خالی است."}
              </p>
            </div>
          </div>

          {isEmpty ? (
            <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-12 text-center flex flex-col items-center">
               <h2 className="text-xl font-bold text-white mb-3">سبد خرید شما خالی است!</h2>
               <Link href="/courses" className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white mt-4">مشاهده دوره‌ها</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-8 space-y-4">
                {items.map((item: any) => (
                  <div key={item._id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 flex gap-5 items-center">
                    <div className="w-40 aspect-video rounded-2xl bg-[#0a1024] relative overflow-hidden shrink-0 border border-white/10">
                      <img src={item.cover || "/placeholder.jpg"} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <Link href={`/course/${item._id}`} className="text-lg font-bold text-white block mb-2">{item.name}</Link>
                      <div className="text-sm text-zinc-500 mb-4">مدرس: {item.creator?.name || "نامشخص"}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-green-400 font-bold">
                           {(item.discountedPrice || item.price).toLocaleString()} <span className="text-xs text-zinc-400 font-normal">تومان</span>
                        </div>
                        <button onClick={() => removeItem(item._id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-4 sticky top-28 space-y-6">
                
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
                  <label className="flex items-center gap-2 text-white font-medium mb-4">
                    <Tag size={18} className="text-blue-500" /> کد تخفیف دارید؟
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="کد تخفیف..." 
                      className="flex-1 bg-[#0a1024] border border-white/10 rounded-xl py-3 px-4 text-white text-left" dir="ltr"
                    />
                    <button onClick={applyDiscount} className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium">
                      اعمال
                    </button>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">فاکتور نهایی</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">مبلغ کل دوره‌ها</span>
                      <span className="text-white font-medium">{cartData?.totalPrice?.toLocaleString()} تومان</span>
                    </div>
                    {cartData?.cartDiscountAmount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">تخفیف اعمال شده</span>
                        <span className="text-red-400 font-medium">{cartData.cartDiscountAmount.toLocaleString()} تومان</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-white/5 pt-5 mb-8">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">مبلغ قابل پرداخت</span>
                      <div className="text-2xl font-black text-green-400">
                        {cartData?.finalPrice?.toLocaleString()} <span className="text-sm text-zinc-400">تومان</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckoutLoading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    {isCheckoutLoading ? <Loader2 className="animate-spin" /> : <><CreditCard size={20} /> تکمیل خرید و پرداخت</>}
                  </button>
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