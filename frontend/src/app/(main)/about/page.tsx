'use client';

import Navbar from "../../../components/home/Navbar";
import Footer from "../../../components/home/footer";
import { Users, Target, Award, BookOpen, ShieldCheck, Zap } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { id: 1, icon: <Users size={28} />, value: "+۵,۰۰۰", label: "دانشجوی فعال" },
    { id: 2, icon: <BookOpen size={28} />, value: "+۱۵", label: "دوره تخصصی" },
    { id: 3, icon: <Award size={28} />, value: "٪۹۸", label: "رضایت دانشجویان" },
    { id: 4, icon: <Zap size={28} />, value: "+۱,۲۰۰", label: "ورود به بازار کار" },
  ];

  const features = [
    {
      title: "آموزش کاملاً پروژه‌محور",
      description: "ما در گیت‌نست اعتقادی به تئوری‌های خشک نداریم. تمام دوره‌ها بر اساس سناریوهای واقعی بازار کار طراحی شده‌اند.",
      icon: <Target className="text-blue-500" size={24} />
    },
    {
      title: "پشتیبانی دائم و واقعی",
      description: "مسیر یادگیری برنامه‌نویسی پر از چالش است. مربیان ما در تمام طول مسیر پاسخگوی سوالات و رفع اشکال شما هستند.",
      icon: <Users className="text-purple-500" size={24} />
    },
    {
      title: "تضمین کیفیت محتوا",
      description: "سرفصل‌ها همگام با آخرین تغییرات تکنولوژی در دنیا آپدیت می‌شوند و دسترسی شما به آپدیت‌ها برای همیشه رایگان است.",
      icon: <ShieldCheck className="text-green-500" size={24} />
    }
  ];

  // دیتای ۸ مدرس حرفه‌ای
  const teamMembers = [
    {
      id: 1,
      name: "مهندس احمدی",
      role: "مدرس ارشد بک‌اند",
      desc: "متخصص Node.js و معماری مایکروسرویس با بیش از ۸ سال تجربه در پروژه‌های بین‌المللی.",
      initial: "A",
      gradient: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/20"
    },
    {
      id: 2,
      name: "سارا رضایی",
      role: "مدرس فرانت‌اند",
      desc: "توسعه‌دهنده سینور React و Next.js، عاشق خلق رابط‌های کاربری مدرن و تعاملی.",
      initial: "S",
      gradient: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/20"
    },
    {
      id: 3,
      name: "دکتر کریمی",
      role: "مدرس پایتون و هوش مصنوعی",
      desc: "پژوهشگر حوزه یادگیری ماشین و مدرس دوره‌های پیشرفته Data Science.",
      initial: "K",
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20"
    },
    {
      id: 4,
      name: "مهندس علوی",
      role: "مدرس امنیت و تست نفوذ",
      desc: "مشاور امنیت سایبری و هکر کلاه‌سفید، متخصص در ایمن‌سازی زیرساخت‌های وب.",
      initial: "M",
      gradient: "from-red-500 to-orange-500",
      shadow: "shadow-red-500/20"
    },
    {
      id: 5,
      name: "امیرحسین تقوی",
      role: "مدرس برنامه‌نویسی موبایل",
      desc: "توسعه‌دهنده ارشد Flutter، با تجربه انتشار ده‌ها اپلیکیشن موفق در مارکت‌های جهانی.",
      initial: "A",
      gradient: "from-sky-400 to-indigo-500",
      shadow: "shadow-sky-500/20"
    },
    {
      id: 6,
      name: "مریم شفیعی",
      role: "مدرس UI/UX",
      desc: "طراح محصول با سابقه کار در استارتاپ‌های برتر، متمرکز بر تجربه کاربری کاربرمحور.",
      initial: "M",
      gradient: "from-yellow-400 to-orange-500",
      shadow: "shadow-yellow-500/20"
    },
    {
      id: 7,
      name: "رضا مرادی",
      role: "مدرس دواپس (DevOps)",
      desc: "متخصص لینوکس، داکر و کوبرنیتیز، کمک به تیم‌ها برای استقرار سریع و امن پروژه‌ها.",
      initial: "R",
      gradient: "from-slate-500 to-gray-700",
      shadow: "shadow-slate-500/20"
    },
    {
      id: 8,
      name: "علی حسینی",
      role: "مدرس C# و .NET",
      desc: "برنامه‌نویس ارشد سیستم‌های سازمانی و مدرس دوره‌های پیشرفته دات‌نت کور.",
      initial: "A",
      gradient: "from-violet-500 to-fuchsia-500",
      shadow: "shadow-violet-500/20"
    }
  ];

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[#070b1a] pt-28 md:pt-36 pb-24 overflow-hidden relative">
        
        {/* افکت‌های نوری پس‌زمینه */}
        <div className="absolute top-[10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          {/* بخش اول: هدر و معرفی اصلی */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 mb-24">
            <div className="space-y-6 text-center lg:text-right">
              <span className="text-blue-400 text-sm font-medium tracking-wider block">داستان شکل‌گیری گیت‌نست</span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                آشیانه‌ای برای رشد <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">متخصصین برنامه‌نویسی</span>
              </h1>
              <p className="text-zinc-400 text-base md:text-lg leading-8 text-justify max-w-2xl mx-auto lg:mx-0">
                گیت‌نست با هدف پر کردن خلاء میان آموزش دانشگاهی و نیازهای واقعی بازار کار متولد شد. ما اینجا جمع شده‌ایم تا مسیر یادگیری برنامه‌نویسی را برای شما کوتاه، لذت‌بخش و هدفمند کنیم. هدف ما صرفاً آموزش کدنویسی نیست، بلکه پرورش تفکر حل مسئله و آماده‌سازی شما برای استخدام در بهترین شرکت‌هاست.
              </p>
            </div>
            
            {/* لوگوی گرافیکی هدر */}
            <div className="flex justify-center relative">
              <div className="w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 p-8 backdrop-blur-md flex items-center justify-center group hover:border-blue-500/30 transition-all duration-500">
                <span className="text-6xl md:text-8xl font-black text-white/10 uppercase tracking-widest select-none group-hover:scale-105 transition-transform duration-500" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>
                  Gitnest
                </span>
              </div>
            </div>
          </div>

          {/* بخش دوم: آمار و ارقام */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-24">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-6 text-center backdrop-blur-sm hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <span className="block text-2xl md:text-4xl font-black text-white mb-2">{stat.value}</span>
                <span className="text-zinc-500 text-xs md:text-sm">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* بخش سوم: ویژگی‌ها */}
          <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-8 md:p-12 mb-24">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-black text-white mb-4">چرا برنامه‌نویسی را با گیت‌نست یاد بگیرید؟</h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base">مزایایی که ما را از دیگر پلتفرم‌های آموزشی متمایز می‌کند</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feat, index) => (
                <div key={index} className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                  <p className="text-zinc-400 text-sm leading-7 text-justify">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* بخش چهارم: مدرسین پلتفرم */}
          <div className="text-center max-w-7xl mx-auto space-y-12">
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-white mb-4">مدرسین گیت‌نست</h2>
              <p className="text-zinc-400 text-sm md:text-base">تیمی از متخصصین با تجربه بازار کار که برای رشد شما در کنار هم قرار گرفته‌اند.</p>
            </div>
            
            {/* گرید ۴ ستونه برای ۸ مدرس */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex flex-col items-center p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-md hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${member.gradient} p-1 mb-5 shadow-xl ${member.shadow}`}>
                    <div className="w-full h-full rounded-full bg-[#0a1024] flex items-center justify-center text-white text-2xl font-black">
                      {member.initial}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <span className="text-blue-400 text-xs font-medium mb-4 text-center h-8 flex items-center justify-center">{member.role}</span>
                  <p className="text-zinc-500 text-sm leading-relaxed text-center h-16 overflow-hidden">
                    {member.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}