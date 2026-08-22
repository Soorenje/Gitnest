'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, MouseEvent, useEffect } from "react";

export default function Hero() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // بررسی وضعیت موبایل برای تغییر نوع انیمیشن
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // در موبایل انیمیشن موس غیرفعال می‌شود
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;

    const rotateX = ((y - centerY) / centerY) * -20;
    const rotateY = ((x - centerX) / centerX) * 20;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section className="relative min-h-[90vh] md:min-h-screen overflow-hidden bg-[#070b1a]">
      {/* استایل انیمیشن شناور برای موبایل */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-floating {
          animation: floating 4s ease-in-out infinite;
        }
      `}} />

      <div className="absolute top-[-100px] right-[-100px] md:top-[-200px] md:right-[-150px] h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-blue-600/20 blur-[100px] md:blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] md:bottom-[-150px] md:left-[-100px] h-[250px] w-[250px] md:h-[450px] md:w-[450px] rounded-full bg-purple-600/20 blur-[80px] md:blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-36 pb-16 md:pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-12 lg:gap-16 flex-col-reverse md:flex-row">
          
          <div className="text-center md:text-right mt-8 md:mt-0 order-2 md:order-1">
            <span className="text-blue-400 text-xs md:text-sm font-medium mb-4 md:mb-6 block bg-blue-500/10 w-max mx-auto md:mx-0 px-3 py-1 rounded-full border border-blue-500/20">
              آموزش پروژه محور برنامه نویسی
            </span>

            <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl leading-tight font-black">
              از آموزش تا ورود
              <br />
              به بازار کار برنامه نویسی
            </h1>

            <p className="mt-4 md:mt-6 lg:mt-8 text-zinc-400 text-sm sm:text-base lg:text-lg leading-7 sm:leading-8 lg:leading-9 max-w-xl mx-auto md:mx-0 text-justify">
              دوره‌های تخصصی برنامه‌نویسی، پروژه‌های واقعی، تمرین عملی و
              مسیر یادگیری حرفه‌ای برای ورود سریع‌تر به بازار کار.
            </p>

            <div className="mt-6 md:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
              <Link href="/courses" className="rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 md:px-8 py-3.5 md:py-4 text-white text-center font-medium transition hover:scale-105 shadow-lg shadow-blue-500/25 text-sm md:text-base">
                مشاهده دوره‌ها
              </Link>

              <button className="rounded-xl md:rounded-2xl border border-white/10 bg-white/5 px-6 md:px-8 py-3.5 md:py-4 text-white hover:bg-white/10 transition backdrop-blur-md text-sm md:text-base">
                شروع یادگیری
              </button>
            </div>
          </div>

          <div className="flex justify-center relative perspective-[1000px] order-1 md:order-2">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: isMobile ? 'none' : `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transition: rotate.x === 0 && rotate.y === 0 ? "transform 0.5s ease-out" : "transform 0.1s ease-out",
                transformStyle: "preserve-3d"
              }}
              className={`relative w-full max-w-[250px] sm:max-w-[320px] md:max-w-md lg:max-w-[520px] aspect-square flex items-center justify-center cursor-pointer ${isMobile ? 'animate-floating' : ''}`}
            >
              
              <div
                style={{ transform: isMobile ? 'none' : "translateZ(-60px)" }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/30 to-purple-600/30 blur-2xl md:blur-3xl"
              ></div>

              <Image
                src="/young-man.webp" 
                alt="hero"
                width={520}
                height={520}
                priority
                style={{ transform: isMobile ? 'none' : "translateZ(30px)" }}
                className="relative w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] md:drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />

              <div
                style={{ transform: isMobile ? 'none' : "translateZ(90px)" }}
                className="absolute top-[10%] md:top-[15%] -right-2 md:-right-4 lg:-right-8 bg-[#0a1024]/80 border border-white/10 rounded-xl md:rounded-2xl p-2 md:p-3 lg:p-4 backdrop-blur-md shadow-xl md:shadow-2xl flex items-center gap-2 md:gap-3"
              >
                <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-lg md:rounded-xl bg-blue-500/20 flex items-center justify-center text-sm md:text-base lg:text-xl">
                  💻
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-white text-[10px] md:text-xs lg:text-sm font-bold">کدنویسی تمیز</span>
                  <span className="text-zinc-400 text-[8px] md:text-[10px] lg:text-xs">پروژه محور</span>
                </div>
              </div>

              <div
                style={{ transform: isMobile ? 'none' : "translateZ(120px)" }}
                className="absolute bottom-[15%] md:bottom-[20%] -left-2 md:-left-4 lg:-left-8 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-2 md:p-3 lg:p-4 backdrop-blur-md shadow-xl md:shadow-2xl flex items-center gap-2 md:gap-3"
              >
                <div className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-[10px] md:text-xs lg:text-sm">
                  ٪۹۸
                </div>
                <span className="text-white text-[10px] md:text-xs lg:text-sm font-medium">رضایت دانشجویان</span>
              </div>

            </div>
          </div>

        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 lg:h-48 bg-gradient-to-t from-[#070b1a] to-transparent pointer-events-none z-20"></div>
    </section>
  );
}