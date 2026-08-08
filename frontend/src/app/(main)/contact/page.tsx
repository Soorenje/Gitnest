'use client';

import Navbar from "../../../components/home/Navbar";
import Footer from "../../../components/home/footer";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[#070b1a] pt-28 md:pt-36 pb-24 relative overflow-hidden">
        
        {/* افکت‌های نوری پس‌زمینه */}
        <div className="absolute top-[20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          {/* هدر صفحه */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6">
              ارتباط با <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">گیت‌نست</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              سوالی دارید؟ مشکلی پیش آمده؟ یا پیشنهادی برای همکاری دارید؟ از طریق راه‌های زیر با ما در ارتباط باشید؛ تیم پشتیبانی ما همیشه پاسخگوی شماست.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* سمت راست: اطلاعات تماس (۵ ستون) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* کارت ایمیل */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex items-start gap-5 backdrop-blur-sm hover:bg-white/[0.04] transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Mail size={28} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">ایمیل پشتیبانی</h3>
                  <p className="text-zinc-500 text-sm mb-3">پاسخگویی در کمتر از ۲۴ ساعت</p>
                  <a href="mailto:support@gitnest.ir" className="text-blue-400 font-medium hover:text-blue-300 transition-colors" dir="ltr">
                    support@gitnest.ir
                  </a>
                </div>
              </div>

              {/* کارت تلفن */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex items-start gap-5 backdrop-blur-sm hover:bg-white/[0.04] transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <Phone size={28} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">تماس تلفنی</h3>
                  <p className="text-zinc-500 text-sm mb-3">شنبه تا چهارشنبه، ۹ صبح تا ۵ عصر</p>
                  <a href="tel:02112345678" className="text-purple-400 font-medium hover:text-purple-300 transition-colors" dir="ltr">
                    ۰۲۱ - ۱۲۳۴ ۵۶۷۸
                  </a>
                </div>
              </div>

              {/* کارت آدرس / تلگرام */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex items-start gap-5 backdrop-blur-sm hover:bg-white/[0.04] transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">پشتیبانی تلگرام</h3>
                  <p className="text-zinc-500 text-sm mb-3">سریع‌ترین راه برای رفع مشکلات فنی</p>
                  <a href="https://t.me/gitnest_support" target="_blank" rel="noopener noreferrer" className="text-green-400 font-medium hover:text-green-300 transition-colors" dir="ltr">
                    @gitnest_support
                  </a>
                </div>
              </div>

            </div>

            {/* سمت چپ: فرم تماس (۷ ستون) */}
            <div className="lg:col-span-7">
              <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md relative">
                <h2 className="text-2xl font-bold text-white mb-8">ارسال پیام مستقیم</h2>
                
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  
                  {/* نام و ایمیل (کنار هم در لپ‌تاپ) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">نام و نام خانوادگی</label>
                      <input 
                        type="text" 
                        placeholder="مثال: علی محمدی"
                        className="w-full bg-[#0a1024] border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.02] transition-all text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">ایمیل شما</label>
                      <input 
                        type="email" 
                        placeholder="example@gmail.com"
                        className="w-full bg-[#0a1024] border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.02] transition-all text-sm text-left" dir="ltr"
                      />
                    </div>
                  </div>

                  {/* موضوع پیام */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">موضوع پیام</label>
                    <input 
                      type="text" 
                      placeholder="پیام شما در چه موردی است؟"
                      className="w-full bg-[#0a1024] border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.02] transition-all text-sm"
                    />
                  </div>

                  {/* متن پیام */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">متن پیام</label>
                    <textarea 
                      placeholder="پیام خود را اینجا بنویسید..."
                      rows={5}
                      className="w-full bg-[#0a1024] border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:bg-white/[0.02] transition-all resize-none text-sm leading-relaxed"
                    ></textarea>
                  </div>

                  {/* دکمه ارسال */}
                  <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                    ارسال پیام
                    <Send size={20} className="rotate-180" /> {/* چرخش برای همخوانی با جهت RTL */}
                  </button>

                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}