"use client";

import { useState } from "react";
import { 
  Wallet, 
  CreditCard, 
  ArrowDownToLine, 
  Clock, 
  CheckCircle2, 
  Building2,
  AlertCircle,
  TrendingUp
} from "lucide-react";

// دیتای تستی تاریخچه تسویه‌حساب‌ها
const payoutHistory = [
  {
    id: "PAY-84729",
    amount: "۵,۰۰۰,۰۰۰",
    date: "۱۴۰۲/۱۲/۱۵",
    status: "completed", // completed, pending, rejected
    iban: "IR120123456789000000000000",
    bank: "بانک ملت"
  },
  {
    id: "PAY-85102",
    amount: "۳,۲۰۰,۰۰۰",
    date: "۱۴۰۳/۰۱/۱۰",
    status: "pending",
    iban: "IR120123456789000000000000",
    bank: "بانک ملت"
  },
  {
    id: "PAY-81220",
    amount: "۸,۵۰۰,۰۰۰",
    date: "۱۴۰۲/۰۹/۲۰",
    status: "completed",
    iban: "IR120123456789000000000000",
    bank: "بانک ملت"
  }
];

export default function InstructorWalletPage() {
  const [payoutAmount, setPayoutAmount] = useState("");

  // تابع کمکی برای استایل وضعیت تراکنش‌ها
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return { text: "موفق (واریز شده)", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" };
      case "pending":
        return { text: "در حال بررسی", icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
      case "rejected":
        return { text: "رد شده / خطا", icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
      default:
        return { text: "نامشخص", icon: Wallet, color: "text-zinc-400", bg: "bg-white/5", border: "border-white/10" };
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* هدر صفحه */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">کیف پول و تسویه‌حساب</h2>
        <p className="text-sm text-zinc-400">مدیریت درآمدها، درخواست واریز وجه و تاریخچه تراکنش‌ها</p>
      </div>

      {/* کارت‌های خلاصه مالی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* موجودی قابل برداشت (کارت اصلی) */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-6 shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="p-2 bg-white/20 rounded-xl text-white backdrop-blur-md">
              <Wallet size={20} />
            </div>
            <h3 className="text-blue-100 font-medium">موجودی قابل برداشت</h3>
          </div>
          <div className="text-3xl font-black text-white mb-1 relative z-10">
            ۴,۸۵۰,۰۰۰ <span className="text-base font-normal text-blue-200">تومان</span>
          </div>
          <p className="text-xs text-blue-200 relative z-10 mt-4 flex items-center gap-1">
            <CheckCircle2 size={14} /> آماده برای درخواست تسویه
          </p>
        </div>

        {/* درآمد کل */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-xl text-green-400">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-zinc-400 font-medium">درآمد کل شما (تا امروز)</h3>
          </div>
          <div className="text-2xl font-black text-white mb-1">
            ۱۶,۷۰۰,۰۰۰ <span className="text-sm font-normal text-zinc-500">تومان</span>
          </div>
          <p className="text-xs text-zinc-500 mt-4 flex items-center gap-1">
            مجموع فروش پس از کسر کارمزد پلتفرم
          </p>
        </div>

        {/* مبالغ در حال تسویه */}
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400">
              <Clock size={20} />
            </div>
            <h3 className="text-zinc-400 font-medium">مبالغ در حال تسویه</h3>
          </div>
          <div className="text-2xl font-black text-white mb-1">
            ۳,۲۰۰,۰۰۰ <span className="text-sm font-normal text-zinc-500">تومان</span>
          </div>
          <p className="text-xs text-zinc-500 mt-4 flex items-center gap-1">
            منتظر تایید و واریز توسط بخش مالی
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* فرم درخواست تسویه (سمت راست) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <ArrowDownToLine size={20} className="text-blue-400" />
              درخواست تسویه‌حساب
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2">مبلغ درخواستی (تومان)</label>
                <input 
                  type="text" 
                  placeholder="مثال: 1000000" 
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-all font-sans text-left" 
                  dir="ltr"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-zinc-500">حداقل برداشت: ۵۰۰,۰۰۰ تومان</span>
                  <button onClick={() => setPayoutAmount("4850000")} className="text-[10px] text-blue-400 hover:text-blue-300">برداشت کل موجودی</button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-sm text-zinc-300 mb-3">
                  <Building2 size={16} className="text-zinc-400" />
                  حساب مقصد (پیش‌فرض)
                </div>
                <div className="text-xs text-zinc-400 mb-1">بانک ملت - به نام سورن جهانگیری</div>
                <div className="text-sm text-white font-sans tracking-widest text-left" dir="ltr">IR12 0123 4567 8900 0000 0000</div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-lg shadow-blue-500/25 mt-2">
                ثبت درخواست واریز
              </button>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-5 flex items-start gap-3">
            <AlertCircle size={20} className="text-orange-400 shrink-0 mt-0.5" />
            <p className="text-xs text-orange-200/80 leading-relaxed">
              تسویه‌حساب‌ها در روزهای <span className="text-orange-400 font-bold">دوشنبه</span> و <span className="text-orange-400 font-bold">پنجشنبه</span> هر هفته انجام می‌شود. شماره شبا باید حتماً به نام شخص مدرس باشد.
            </p>
          </div>
        </div>

        {/* تاریخچه تراکنش‌ها (سمت چپ) */}
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-lg shadow-black/20 flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard size={20} className="text-purple-400" />
              تاریخچه برداشت‌ها
            </h3>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-right border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-white/[0.01] border-b border-white/5 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                  <th className="p-4 pl-0">کد پیگیری</th>
                  <th className="p-4">مبلغ (تومان)</th>
                  <th className="p-4">تاریخ ثبت</th>
                  <th className="p-4">حساب مقصد</th>
                  <th className="p-4 text-left">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {payoutHistory.length > 0 ? (
                  payoutHistory.map((item) => {
                    const status = getStatusInfo(item.status);
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-sans text-xs text-zinc-500">{item.id}</td>
                        <td className="p-4 font-bold text-white">{item.amount}</td>
                        <td className="p-4 text-zinc-400 text-xs">{item.date}</td>
                        <td className="p-4 text-zinc-400 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Building2 size={12} className="text-zinc-500" />
                            {item.bank}
                          </div>
                        </td>
                        <td className="p-4 text-left">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${status.border} ${status.bg} ${status.color} text-[10px] font-bold whitespace-nowrap`}>
                            <status.icon size={12} />
                            {status.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center">
                      <div className="flex flex-col items-center justify-center text-zinc-500">
                        <Wallet size={32} className="mb-3 opacity-50" />
                        <p>تاکنون هیچ درخواست تسویه‌ای ثبت نکرده‌اید.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}