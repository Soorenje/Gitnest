'use client';

import { useState } from "react";
import Navbar from "../../../components/home/Navbar";
import Footer from "../../../components/home/footer";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowLeft, User, BookOpen } from "lucide-react";

// دیتای تستی مقالات
const articlesData = [
  {
    id: "nextjs-14-features",
    title: "بررسی کامل ویژگی‌های جدید Next.js 14",
    excerpt: "در نسخه ۱۴ نکست‌جی‌اس شاهد تغییرات بزرگی در Server Actions و بهینه‌سازی کامپایلر Turbopack بودیم. در این مقاله به بررسی عملی این تغییرات می‌پردازیم.",
    author: "سورن",
    date: "۲۵ خرداد ۱۴۰۵",
    readTime: "۸ دقیقه",
    category: "frontend",
    image: "/blog-1.jpg" // آدرس عکس‌های خودت رو جایگزین کن
  },
  {
    id: "nodejs-security-best-practices",
    title: "۱۰ راهکار حیاتی برای افزایش امنیت در Node.js",
    excerpt: "امنیت سرور یکی از مهم‌ترین وظایف بک‌اند دولوپرهاست. یاد بگیرید چطور از حملات XSS و Injection در اپلیکیشن‌های اکسپرس جلوگیری کنید.",
    author: "مهندس احمدی",
    date: "۲۰ خرداد ۱۴۰۵",
    readTime: "۱۲ دقیقه",
    category: "backend",
    image: "/blog-2.jpg"
  },
  {
    id: "ai-in-programming",
    title: "آیا هوش مصنوعی جای برنامه‌نویسان را می‌گیرد؟",
    excerpt: "با معرفی ابزارهایی مثل GitHub Copilot و ChatGPT، آینده شغلی توسعه‌دهندگان وب دستخوش چه تغییراتی خواهد شد؟",
    author: "دکتر کریمی",
    date: "۱۵ خرداد ۱۴۰۵",
    readTime: "۶ دقیقه",
    category: "tech",
    image: "/blog-3.jpg"
  },
  {
    id: "react-vs-vue",
    title: "مقایسه جامع React و Vue در سال ۲۰۲۶",
    excerpt: "اگر قصد ورود به دنیای فرانت‌اند را دارید، انتخاب بین این دو کتابخانه محبوب می‌تواند چالش‌برانگیز باشد. کدام یک برای بازار کار بهتر است؟",
    author: "سارا رضایی",
    date: "۱۰ خرداد ۱۴۰۵",
    readTime: "۱۰ دقیقه",
    category: "frontend",
    image: "/blog-4.jpg"
  },
  {
    id: "freelance-guide",
    title: "چگونه اولین پروژه فریلنسری خود را بگیریم؟",
    excerpt: "راهنمای قدم به قدم برای ساخت پروفایل حرفه‌ای در پلتفرم‌های فریلنسری و نحوه مذاکره با کارفرما برای برنامه‌نویسان تازه‌کار.",
    author: "سورن",
    date: "۵ خرداد ۱۴۰۵",
    readTime: "۱۵ دقیقه",
    category: "career",
    image: "/blog-5.jpg"
  },
  {
    id: "mongodb-indexing",
    title: "جادوی ایندکس‌گذاری در MongoDB",
    excerpt: "چگونه با استفاده صحیح از ایندکس‌ها، سرعت کوئری‌های دیتابیس خود را تا ۱۰۰ برابر افزایش دهیم؟ یک آموزش کاملاً عملی.",
    author: "مهندس احمدی",
    date: "۱ خرداد ۱۴۰۵",
    readTime: "۹ دقیقه",
    category: "backend",
    image: "/blog-6.jpg"
  }
];

const categories = [
  { id: "all", title: "همه مقالات" },
  { id: "frontend", title: "فرانت‌اند" },
  { id: "backend", title: "بک‌اند" },
  { id: "tech", title: "تکنولوژی و AI" },
  { id: "career", title: "مسیر شغلی" },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  // فیلتر کردن مقالات بر اساس دسته‌بندی
  const filteredArticles = articlesData.filter(article => {
    if (activeCategory === "all") return true;
    return article.category === activeCategory;
  });

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[#070b1a] pt-28 md:pt-36 pb-24 relative overflow-hidden">
        
        {/* افکت‌های نوری پس‌زمینه */}
        <div className="absolute top-[10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          {/* هدر صفحه مقالات */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6">
              مقالات <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">آموزشی</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              بروزترین مقالات برنامه‌نویسی، تکنولوژی و توسعه فردی برای ارتقای مهارت‌های شما.
            </p>
          </div>

          {/* نوار جستجو و فیلتر */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-4 md:p-6 mb-12 backdrop-blur-md flex flex-col lg:flex-row gap-4 items-center justify-between relative z-40">
            
            {/* باکس جستجو */}
            <div className="relative w-full lg:w-1/3">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="جستجو در مقالات..." 
                className="w-full bg-[#0a1024] border border-white/10 rounded-2xl py-3.5 pr-12 pl-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.02] transition-all text-sm"
              />
            </div>

            {/* دسته‌بندی‌ها (اسکرول افقی در موبایل) */}
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

          </div>

          {/* گرید مقالات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredArticles.map((article) => (
              <div key={article.id} className="group bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 flex flex-col">
                
                {/* تصویر مقاله */}
                <Link href={`/blog/${article.id}`} className="block relative w-full aspect-[16/10] overflow-hidden bg-[#0a1024]">
                  {/* جایگزین تصویر با گرادیانت برای حالت بدون عکس */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 group-hover:scale-105 transition-transform duration-500"></div>
                  
                  {/* تگ دسته‌بندی روی عکس */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-medium rounded-lg">
                    {categories.find(c => c.id === article.category)?.title}
                  </div>
                </Link>

                {/* محتوای مقاله */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  
                  <Link href={`/blog/${article.id}`}>
                    <h2 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                  </Link>
                  
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3 text-justify flex-1">
                    {article.excerpt}
                  </p>

                  {/* فوتر کارت مقاله (نویسنده و اطلاعات) */}
                  <div className="pt-5 border-t border-white/5 flex items-center justify-between mt-auto">
                    
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {article.author.charAt(0)}
                      </div>
                      <span className="text-zinc-300 text-xs font-medium">{article.author}</span>
                    </div>

                    <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* حالت خالی */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
              <p className="text-zinc-500">مقاله‌ای در این دسته‌بندی یافت نشد.</p>
            </div>
          )}

          {/* دکمه بارگذاری بیشتر */}
          {filteredArticles.length > 0 && (
            <div className="mt-12 flex justify-center">
              <button className="px-8 py-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-white font-medium transition-all duration-300 flex items-center gap-2 group">
                بارگذاری مقالات بیشتر
                <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
              </button>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}