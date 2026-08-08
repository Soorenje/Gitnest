'use client';

import { useSearchParams } from "next/navigation";
import { ShieldCheck, XCircle, CheckCircle2, CreditCard, Clock, Building2, KeyRound } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

function MockPaymentContent() {
  const searchParams = useSearchParams();
  const authority = searchParams.get("authority") || "0000000000000000";
  const amount = searchParams.get("amount") || "0";

  // تایمر 15 دقیقه‌ای برای ظاهر واقعی
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handlePayment = (status: "success" | "failed") => {
    window.location.href = `/cart/verify?authority=${authority}&status=${status}`;
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col items-center justify-center p-4 md:p-8 dir-rtl font-sans text-right">
      
      {/* هدر درگاه */}
      <div className="w-full max-w-4xl bg-white rounded-t-2xl shadow-sm border-b border-zinc-200 p-4 md:p-5 flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-bold text-zinc-800 md:text-lg">درگاه پرداخت اینترنتی</h1>
            <p className="text-xs text-zinc-500">پرداخت الکترونیک سامان (محیط شبیه‌ساز)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 md:px-4 py-2 rounded-xl font-mono font-bold text-sm md:text-base">
          <Clock size={18} className="hidden md:block" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* اطلاعات پذیرنده */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-zinc-200 space-y-6">
            <div className="text-center pb-6 border-b border-zinc-100">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl mx-auto mb-4 flex items-center justify-center text-zinc-400">
                <Building2 size={32} />
              </div>
              <h2 className="font-bold text-zinc-800">آکادمی برنامه‌نویسی سورن</h2>
              <p className="text-sm text-zinc-500 mt-1">خرید دوره‌های آموزشی</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">مبلغ قابل پرداخت</span>
                <span className="font-black text-blue-600 text-lg">
                  {Number(amount).toLocaleString()} <span className="text-xs font-normal">تومان</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">شماره پذیرنده</span>
                <span className="font-mono text-sm text-zinc-700">14920384</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500">شماره تراکنش</span>
                <span className="font-mono text-xs text-zinc-700 w-32 truncate text-left">{authority}</span>
              </div>
            </div>
          </div>
        </div>

        {/* فرم پرداخت */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-zinc-200 h-full">
            <div className="mb-6 pb-6 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-800 mb-1">اطلاعات کارت بانکی</h3>
              <p className="text-sm text-zinc-500">لطفا اطلاعات کارت خود را با دقت وارد کنید (فرم غیرفعال است و صرفاً جنبه نمایشی دارد)</p>
            </div>

            <div className="space-y-5 opacity-70 pointer-events-none select-none">
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">شماره کارت</label>
                <div className="relative">
                  <input type="text" disabled placeholder="xxxx - xxxx - xxxx - xxxx" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-left font-mono focus:outline-none" dir="ltr" />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">شماره شناسایی دوم (CVV2)</label>
                  <input type="text" disabled placeholder="xxx" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-left font-mono focus:outline-none" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">تاریخ انقضا</label>
                  <div className="flex items-center gap-3">
                    <input type="text" disabled placeholder="ماه" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-center font-mono focus:outline-none" />
                    <span className="text-zinc-400">/</span>
                    <input type="text" disabled placeholder="سال" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-center font-mono focus:outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">رمز اینترنتی (پویا)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input type="text" disabled placeholder="xxxxxx" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-left font-mono focus:outline-none" dir="ltr" />
                    <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                  </div>
                  <button disabled className="bg-zinc-200 text-zinc-500 px-6 rounded-xl text-sm font-medium">
                    دریافت رمز
                  </button>
                </div>
              </div>

            </div>

            {/* دکمه‌های عملیاتی (این بخش فعال است) */}
            <div className="pt-8 mt-8 border-t border-zinc-100 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handlePayment("success")}
                className="flex-1 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20 hover:-translate-y-0.5"
              >
                <CheckCircle2 size={22} />
                پرداخت (شبیه‌ساز)
              </button>
              
              <button 
                onClick={() => handlePayment("failed")}
                className="flex-1 py-4 bg-white border-2 border-red-100 hover:border-red-200 hover:bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <XCircle size={22} />
                انصراف از پرداخت
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f1f5f9]"></div>}>
      <MockPaymentContent />
    </Suspense>
  );
}