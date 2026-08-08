'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, MouseEvent } from "react";

export default function Hero() {
  // استیت برای ذخیره زاویه چرخش X و Y
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  // محاسبه زاویه چرخش بر اساس موقعیت موس روی تصویر
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;

    // شدت چرخش (اینجا روی ۲۰ درجه تنظیم شده است)
    const rotateX = ((y - centerY) / centerY) * -20;
    const rotateY = ((x - centerX) / centerX) * 20;

    setRotate({ x: rotateX, y: rotateY });
  };

  // برگشت نرم به حالت اولیه وقتی موس خارج می‌شود
  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#070b1a]">
      {/* background glow */}
      <div className="absolute top-[-200px] right-[-150px] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-150px] left-[-100px] h-[450px] w-[450px] rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 lg:gap-16">
          
          {/* متن سمت راست (بدون تغییر) */}
          <div className="text-center md:text-right">
            <span className="text-blue-400 text-sm font-medium mb-6 block">
              آموزش پروژه محور برنامه نویسی
            </span>

            <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl leading-tight font-black">
              از آموزش تا ورود
              <br />
              به بازار کار برنامه نویسی
            </h1>

            <p className="mt-6 md:mt-8 text-zinc-400 text-base sm:text-lg leading-8 sm:leading-9 max-w-xl mx-auto md:mx-0 text-justify">
              دوره‌های تخصصی برنامه‌نویسی، پروژه‌های واقعی، تمرین عملی و
              مسیر یادگیری حرفه‌ای برای ورود سریع‌تر به بازار کار.
            </p>

            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/courses" className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-white text-center font-medium transition hover:scale-105 shadow-lg shadow-blue-500/25">
                مشاهده دوره‌ها
              </Link>

              <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-white hover:bg-white/10 transition backdrop-blur-md">
                شروع یادگیری
              </button>
            </div>
          </div>

          {/* تصویر سمت چپ با افکت سه بعدی (3D Parallax Tilt) */}
          <div className="flex justify-center relative perspective-[1000px]">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transition: rotate.x === 0 && rotate.y === 0 ? "transform 0.5s ease-out" : "transform 0.1s ease-out",
                transformStyle: "preserve-3d"
              }}
              className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-[520px] aspect-square flex items-center justify-center cursor-pointer"
            >
              
              {/* هاله نورانی پشت تصویر (عمق منفی: دورتر از چشم کاربر) */}
              <div
                style={{ transform: "translateZ(-60px)" }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/30 to-purple-600/30 blur-3xl"
              ></div>

              {/* عکس اصلی (عمق خنثی یا کمی جلوتر) */}
              <Image
                src="/young-man.webp" // عکسی که خودت داشتی
                alt="hero"
                width={520}
                height={520}
                priority
                style={{ transform: "translateZ(30px)" }}
                className="relative w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />

              {/* باکس شناور بالا سمت راست (عمق زیاد: خیلی نزدیک به چشم کاربر) */}
              <div
                style={{ transform: "translateZ(90px)" }}
                className="absolute top-[15%] -right-4 sm:-right-8 bg-[#0a1024]/80 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-2xl flex items-center gap-3"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">
                  💻
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-white text-xs sm:text-sm font-bold">کدنویسی تمیز</span>
                  <span className="text-zinc-400 text-[10px] sm:text-xs">پروژه محور</span>
                </div>
              </div>

              {/* باکس شناور پایین سمت چپ (عمق متوسط) */}
              <div
                style={{ transform: "translateZ(120px)" }}
                className="absolute bottom-[20%] -left-4 sm:-left-8 bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-2xl flex items-center gap-3"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-xs sm:text-sm">
                  ٪۹۸
                </div>
                <span className="text-white text-xs sm:text-sm font-medium">رضایت دانشجویان</span>
              </div>

            </div>
          </div>

        </div>
      </div>
      {/* دیو محو کننده مرز پایین (Fade Out Gradient) */}
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-[#070b1a] to-transparent pointer-events-none z-20"></div>
    </section>
  );
}