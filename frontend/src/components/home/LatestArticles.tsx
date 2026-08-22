'use client';

import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const articlesData = [
  {
    id: 1,
    title: "بررسی ویژگی‌های جدید Next.js 14",
    excerpt: "در این مقاله به بررسی امکانات و تغییرات جدیدترین نسخه فریم‌ورک محبوب نکست جی‌اس می‌پردازیم و تاثیر آن را روی پرفورمنس بررسی می‌کنیم.",
    date: "۱۵ مهر ۱۴۰۲",
    author: "امیرعلی محمدی",
  },
  {
    id: 2,
    title: "چگونه در برنامه‌نویسی تمرکز خود را حفظ کنیم؟",
    excerpt: "راهکارها و تکنیک‌های عملی برای مدیریت زمان و جلوگیری از حواس‌پرتی در زمان کدنویسی که هر توسعه‌دهنده‌ای باید بداند.",
    date: "۱۰ مهر ۱۴۰۲",
    author: "سارا احمدی",
  },
  {
    id: 3,
    title: "تفاوت بین SSR و CSR در ری‌اکت",
    excerpt: "مقایسه جامع رندر سمت سرور و رندر سمت کلاینت و بررسی مزایا و معایب هر کدام برای انتخاب بهترین معماری در پروژه‌های وب.",
    date: "۵ مهر ۱۴۰۲",
    author: "علی رضایی",
  },
];

export default function LatestArticles() {
  return (
    <section className="py-16 md:py-24 bg-[#070b1a]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12 gap-4 text-center sm:text-right">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              آخرین <span className="text-blue-500">مقالات</span>
            </h2>
            <p className="text-gray-400 mt-2 md:mt-3 text-sm md:text-base">به‌روزترین مطالب دنیای برنامه‌نویسی و تکنولوژی</p>
          </div>
          <Link 
            href="/articles" 
            className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors font-medium border border-blue-500/30 px-4 md:px-5 py-2 md:py-2.5 rounded-xl hover:bg-blue-500/10 text-sm md:text-base mt-2 sm:mt-0"
          >
            مشاهده وبلاگ
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articlesData.map((article) => (
            <article 
              key={article.id} 
              className="bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden group hover:border-blue-500/30 hover:-translate-y-2 hover:bg-white/[0.05] transition-all duration-300 flex flex-col"
            >
              <div className="h-40 md:h-52 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-5 md:p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center text-[11px] md:text-xs text-zinc-400 mb-3 md:mb-4">
                  <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
                    <span>{article.date}</span>
                  </div>
                </div>

                <Link href="#">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 hover:text-blue-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="mt-auto pt-3 md:pt-4 border-t border-white/5">
                  <Link href="#" 
                    className="inline-flex items-center gap-2 text-xs md:text-sm text-blue-400 font-semibold group-hover:gap-3 transition-all"
                  >
                    ادامه مطلب
                    <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}