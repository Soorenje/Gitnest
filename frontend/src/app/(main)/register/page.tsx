'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, Lock, Eye, EyeOff, User, Phone, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiFetch } from '../../../utils/apiFetch'; // 👈 ایمپورت هسته مرکزی درخواست‌ها

const registerSchema = z.object({
  name: z.string().min(3, 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد'),
  username: z.string().min(3, 'نام کاربری باید حداقل ۳ کاراکتر باشد'),
  phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست (مثال: 09123456789)'),
  email: z.string().email('فرمت آدرس ایمیل نامعتبر است'),
  password: z.string().min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setIsLoading(true);
    setApiMessage(null);

    try {
      // 👈 استفاده از apiFetch به جای fetch طولانی
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setApiMessage({ text: result.message || "خطایی در ثبت‌نام رخ داد.", type: 'error' });
        return;
      }

      setApiMessage({ text: "ثبت‌نام با موفقیت انجام شد. در حال انتقال به صفحه ورود...", type: 'success' });
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      console.error("Fetch error:", error);
      setApiMessage({ text: "خطا در ارتباط با سرور. لطفا اتصال اینترنت را بررسی کنید.", type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070b1a] flex items-center justify-center p-4 relative overflow-hidden py-12">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

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
            <h1 className="text-2xl font-black text-white mb-2">ساخت حساب کاربری</h1>
            <p className="text-zinc-400 text-sm">برای شروع یادگیری، اطلاعات خود را وارد کنید</p>
          </div>

          {apiMessage && (
            <div className={`p-4 rounded-xl text-sm text-center mb-6 border ${
              apiMessage.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {apiMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            
            {/* نام و نام خانوادگی */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <User className={`w-5 h-5 ${errors.name ? 'text-red-400' : 'text-zinc-500'}`} />
                </div>
                <input 
                  {...register('name')}
                  type="text" 
                  placeholder="نام و نام خانوادگی" 
                  dir="rtl"
                  className={`w-full bg-white/5 border rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-zinc-500 focus:outline-none transition-all text-sm text-right ${errors.name ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5' : 'border-white/10 focus:border-blue-500 focus:bg-white/10'}`}
                />
              </div>
              {errors.name && (
                <span className="flex items-center gap-1 text-red-400 text-xs mt-1.5 pr-1">
                  <AlertCircle size={12} /> {errors.name.message}
                </span>
              )}
            </div>

            {/* نام کاربری */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <User className={`w-5 h-5 ${errors.username ? 'text-red-400' : 'text-zinc-500'}`} />
                </div>
                <input 
                  {...register('username')}
                  type="text" 
                  placeholder="نام کاربری (انگلیسی)" 
                  dir="rtl"
                  className={`w-full bg-white/5 border rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-zinc-500 focus:outline-none transition-all text-sm text-right ${errors.username ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5' : 'border-white/10 focus:border-blue-500 focus:bg-white/10'}`}
                />
              </div>
              {errors.username && (
                <span className="flex items-center gap-1 text-red-400 text-xs mt-1.5 pr-1">
                  <AlertCircle size={12} /> {errors.username.message}
                </span>
              )}
            </div>

            {/* شماره موبایل */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <Phone className={`w-5 h-5 ${errors.phone ? 'text-red-400' : 'text-zinc-500'}`} />
                </div>
                <input 
                  {...register('phone')}
                  type="tel" 
                  placeholder="شماره موبایل (مثلاً ۰۹۱۲۳۴۵۶۷۸۹)" 
                  dir="rtl"
                  className={`w-full bg-white/5 border rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-zinc-500 focus:outline-none transition-all text-sm text-right ${errors.phone ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5' : 'border-white/10 focus:border-blue-500 focus:bg-white/10'}`}
                />
              </div>
              {errors.phone && (
                <span className="flex items-center gap-1 text-red-400 text-xs mt-1.5 pr-1">
                  <AlertCircle size={12} /> {errors.phone.message}
                </span>
              )}
            </div>

            {/* ایمیل */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <Mail className={`w-5 h-5 ${errors.email ? 'text-red-400' : 'text-zinc-500'}`} />
                </div>
                <input 
                  {...register('email')}
                  type="text" 
                  placeholder="آدرس ایمیل" 
                  dir="rtl"
                  className={`w-full bg-white/5 border rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-zinc-500 focus:outline-none transition-all text-sm text-right ${errors.email ? 'border-red-500/50 focus:border-red-500 focus:bg-red-500/5' : 'border-white/10 focus:border-blue-500 focus:bg-white/10'}`}
                />
              </div>
              {errors.email && (
                <span className="flex items-center gap-1 text-red-400 text-xs mt-1.5 pr-1">
                  <AlertCircle size={12} /> {errors.email.message}
                </span>
              )}
            </div>

            {/* رمز عبور */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <Lock className={`w-5 h-5 ${errors.password ? 'text-red-400' : 'text-zinc-500'}`} />
                </div>
                <input 
                  {...register('password')}
                  type={showPassword ? "text" : "password"} 
                  placeholder="رمز عبور (حداقل ۸ کاراکتر)" 
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

            {/* دکمه ثبت‌نام */}
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 mt-4 flex items-center justify-center ${
                isLoading ? 'bg-zinc-700 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  در حال پردازش...
                </span>
              ) : (
                "ثبت‌نام در گیت‌نست"
              )}
            </button>
          </form>
          
          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="px-4 text-xs text-zinc-500">یا</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <p className="text-center text-zinc-400 text-sm">
            قبلاً ثبت‌نام کرده‌اید؟{" "}
            <Link href="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
              وارد شوید
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}