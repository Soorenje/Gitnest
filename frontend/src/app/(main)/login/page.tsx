'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiFetch } from '../../../utils/apiFetch'; 

// ۱. تعریف قوانین اعتبارسنجی لاگین
const loginSchema = z.object({
  identifier: z.string().min(3, 'ایمیل یا شماره موبایل خود را وارد کنید'),
  password: z.string().min(1, 'رمز عبور را وارد کنید'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  // ۲. تابع ارسال اطلاعات به بک‌اند
  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setApiMessage(null);

    try {
      // 👈 استفاده از apiFetch به جای fetch طولانی
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // ترجمه ارورهای بک‌اند برای کاربر
        const errorMessage = 
          result.message === "User not found" ? "اطلاعات وارد شده نامعتبر است." :
          result.message === "Invalid password" ? "رمز عبور اشتباه است." :
          result.message === "Your account has been banned" ? "حساب کاربری شما مسدود شده است." :
          "خطایی در ورود رخ داد.";
          
        setApiMessage({ text: errorMessage, type: 'error' });
        return;
      }

      setApiMessage({ text: "ورود با موفقیت انجام شد. در حال انتقال...", type: 'success' });
      
      // 👈 استفاده از window.location برای رفرش شدن نوبار و آپدیت وضعیت کاربر
      setTimeout(() => {
        window.location.href = "/"; 
      }, 1500);

    } catch (error) {
      console.error("Login Error:", error);
      setApiMessage({ text: "خطا در ارتباط با سرور. لطفا اینترنت خود را بررسی کنید.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070b1a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>بازگشت به صفحه اصلی</span>
        </Link>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white tracking-wider uppercase mb-2">
              Gitnest
            </h1>
            <p className="text-zinc-400 text-sm">
              به جامعه برنامه‌نویسان گیت‌نست خوش آمدید
            </p>
          </div>

          {/* پیام‌های لاگین */}
          {apiMessage && (
            <div className={`p-4 rounded-xl text-sm text-center mb-6 border ${
              apiMessage.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {apiMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            
            {/* اینپوت ایمیل یا شماره موبایل */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <Mail className={`w-5 h-5 ${errors.identifier ? 'text-red-400' : 'text-zinc-500'}`} />
                </div>
                <input 
                  {...register('identifier')}
                  type="text" 
                  placeholder="ایمیل یا شماره موبایل" 
                  dir="rtl"
                  className={`w-full bg-white/5 border rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-zinc-500 focus:outline-none transition-all text-sm text-right ${errors.identifier ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5' : 'border-white/10 focus:border-blue-500 focus:bg-white/10'}`}
                />
              </div>
              {errors.identifier && (
                <span className="flex items-center gap-1 text-red-400 text-xs mt-1.5 pr-1">
                  <AlertCircle size={12} /> {errors.identifier.message}
                </span>
              )}
            </div>

            {/* اینپوت رمز عبور */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <Lock className={`w-5 h-5 ${errors.password ? 'text-red-400' : 'text-zinc-500'}`} />
                </div>
                <input 
                  {...register('password')}
                  type={showPassword ? "text" : "password"} 
                  placeholder="رمز عبور" 
                  dir="rtl"
                  className={`w-full bg-white/5 border rounded-xl py-3.5 pr-12 pl-12 text-white placeholder-zinc-500 focus:outline-none transition-all text-sm text-right ${errors.password ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5' : 'border-white/10 focus:border-blue-500 focus:bg-white/10'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <span className="flex items-center gap-1 text-red-400 text-xs mt-1.5 pr-1">
                  <AlertCircle size={12} /> {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex justify-end">
              <Link href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                رمز عبور را فراموش کردید؟
              </Link>
            </div>

            {/* دکمه ورود */}
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 mt-2 flex items-center justify-center ${
                isLoading ? 'bg-zinc-700 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  در حال ورود...
                </span>
              ) : (
                "ورود به حساب کاربری"
              )}
            </button>
          </form>
          
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="px-4 text-xs text-zinc-500">یا</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <p className="text-center text-zinc-400 text-sm">
            حساب کاربری ندارید؟{" "}
            <Link href="/register" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              ثبت‌نام کنید
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}