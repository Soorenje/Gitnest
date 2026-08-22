"use client";

import Link from "next/link";
import { Mail, Send, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#070b1a] border-t border-white/5 pt-16 md:pt-20 pb-8 relative overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] md:w-[800px] h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[300px] md:w-[500px] h-[200px] bg-blue-600/10 blur-[100px] md:blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          
          <div className="flex flex-col gap-4 md:gap-6">
            <Link href="/" className="inline-block text-center md:text-right">
              <span className="text-2xl md:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Gitnest
              </span>
            </Link>
            <p className="text-zinc-400 leading-relaxed text-xs md:text-sm text-center md:text-justify">
              تیم ما در گیت‌نست با هدف ارائه دوره‌های آموزشی پروژه‌محور، کمک به توسعه‌دهندگان و آماده‌سازی آن‌ها برای ورود سریع به بازار کار، دوره‌ها و منابع عملی با کیفیت بالا ارائه می‌دهد.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-pink-600 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(219,39,119,0.5)] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-gray-800 hover:border-gray-600 hover:shadow-[0_0_15px_rgba(75,85,99,0.5)] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-blue-700 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(29,78,216,0.5)] transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">دسترسی سریع</h4>
            <ul className="flex flex-col gap-3 md:gap-4 items-center sm:items-start">
              {[
                { title: 'درباره ما', href: '/about' },
                { title: 'تماس با ما', href: '/contact' },
                { title: 'مقالات آموزشی', href: '/articles' },
                { title: 'دوره‌های آموزشی', href: '/courses' },
                { title: 'سبد خرید', href: '/cart' }
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="text-zinc-400 hover:text-blue-400 transition-colors text-xs md:text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-400 group-hover:scale-150 transition-all hidden sm:block"></span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-right">
            <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">دوره‌های پیشنهادی</h4>
            <ul className="flex flex-col gap-3 md:gap-4 items-center sm:items-start">
              {[
                { title: 'آموزش جامع Next.js', href: '/courses?category=react' },
                { title: 'متخصص React.js', href: '/courses?category=react' },
                { title: 'بک‌اند با Node.js', href: '/courses?category=nodejs' },
                { title: 'مسترکلاس پایتون', href: '/courses?category=python' },
                { title: 'توسعه با Flutter', href: '/courses?category=flutter' }
              ].map((item, i) => (
                <li key={i}>
                  <Link href={item.href} className="text-zinc-400 hover:text-blue-400 transition-colors text-xs md:text-sm flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 group-hover:bg-purple-400 group-hover:scale-150 transition-all hidden sm:block"></span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-right">
            <h4 className="text-white font-bold text-base md:text-lg mb-4 md:mb-6">خبرنامه و ارتباط</h4>
            <p className="text-zinc-400 text-xs md:text-sm mb-4 leading-relaxed">
              برای اطلاع از دوره‌ها و تخفیف‌ها، ایمیل خود را وارد کنید.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center mb-6 md:mb-8 relative max-w-sm mx-auto sm:mx-0">
              <input 
                type="email" 
                placeholder="ایمیل شما..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 md:py-3 px-4 text-xs md:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                required
              />
              <button 
                type="submit"
                className="absolute left-1.5 md:left-2 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-500/20"
              >
                <Send size={14} className="mr-0.5 -ml-0.5 md:w-4 md:h-4" />
              </button>
            </form>
            
            <div className="flex flex-col gap-3 md:gap-4 text-xs md:text-sm text-zinc-400 items-center sm:items-start">
              <a href="mailto:info@gitnest.ir" className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer group" dir="ltr">
                <Mail size={16} className="text-blue-400 group-hover:scale-110 transition-transform md:w-[18px] md:h-[18px]" />
                <span>info@gitnest.ir</span>
              </a>
              <a href="tel:02112345678" className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer group" dir="ltr">
                <Phone size={16} className="text-blue-400 group-hover:scale-110 transition-transform md:w-[18px] md:h-[18px]" />
                <span>021 - 1234 5678</span>
              </a>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-6 md:pt-8 border-t border-white/10 text-xs md:text-sm text-zinc-500 gap-3 md:gap-4">
          <p className="text-center md:text-right">© ۲۰۲۶ تمامی حقوق برای گیت‌نست محفوظ است.</p>
          <p className="flex items-center gap-1.5">
            طراحی و توسعه توسط
            <a 
              href="https://linkedin.com/in/soren-je" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white font-medium hover:text-blue-400 transition-colors group"
            >
              Soren-JE
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity md:w-[14px] md:h-[14px]">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}