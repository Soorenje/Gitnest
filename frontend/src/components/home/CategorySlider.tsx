"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import {
  FileCode2,
  Globe,
  Shield,
  Atom,
  Server,
  Smartphone,
  Monitor,
  Database,
  FolderOpen,
  Loader2
} from "lucide-react";

import { apiFetch } from "./../../utils/apiFetch"; 

const stylePresets = [
  { icon: FileCode2, color: "text-yellow-400", bgHover: "hover:shadow-yellow-500/10", borderHover: "group-hover:border-yellow-500/30", iconBg: "bg-yellow-500/10" },
  { icon: Globe, color: "text-orange-400", bgHover: "hover:shadow-orange-500/10", borderHover: "group-hover:border-orange-500/30", iconBg: "bg-orange-500/10" },
  { icon: Shield, color: "text-red-400", bgHover: "hover:shadow-red-500/10", borderHover: "group-hover:border-red-500/30", iconBg: "bg-red-500/10" },
  { icon: Atom, color: "text-cyan-400", bgHover: "hover:shadow-cyan-500/10", borderHover: "group-hover:border-cyan-500/30", iconBg: "bg-cyan-500/10" },
  { icon: Server, color: "text-emerald-400", bgHover: "hover:shadow-emerald-500/10", borderHover: "group-hover:border-emerald-500/30", iconBg: "bg-emerald-500/10" },
  { icon: Smartphone, color: "text-sky-400", bgHover: "hover:shadow-sky-500/10", borderHover: "group-hover:border-sky-500/30", iconBg: "bg-sky-500/10" },
  { icon: Monitor, color: "text-blue-400", bgHover: "hover:shadow-blue-500/10", borderHover: "group-hover:border-blue-500/30", iconBg: "bg-blue-500/10" },
  { icon: Database, color: "text-green-400", bgHover: "hover:shadow-green-500/10", borderHover: "group-hover:border-green-500/30", iconBg: "bg-green-500/10" },
];

export default function CategorySlider() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiFetch("/category"); 
        if (res.ok) {
          const result = await res.json();
          setCategories(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-16 md:py-20 relative z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-10 text-center md:text-right">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
            دسته‌بندی دوره‌ها
          </h2>
          <p className="text-zinc-500 text-sm md:text-base">
            مسیر یادگیری خود را انتخاب کنید
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
             <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-zinc-500">دسته‌بندی‌ای یافت نشد.</div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            loop={categories.length >= 5} 
            grabCursor={true}
            spaceBetween={16}
            className="pb-12 pt-4 px-2"
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              320: { slidesPerView: 1.5, spaceBetween: 12 }, // تغییر برای موبایل
              480: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 24 },
            }}
          >
            {categories.map((category, index) => {
              const style = stylePresets[index % stylePresets.length];
              const Icon = style.icon || FolderOpen; 
              
              const courseCount = category.courses ? category.courses.length : 0;
              
              return (
                <SwiperSlide key={category._id}>
                  <Link href={`/courses?category=${category.slug}`} className="block w-full">
                    <div className={`group bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-2 shadow-lg ${style.bgHover}`}>
                      
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-5 transition-transform duration-300 group-hover:scale-110 border border-transparent ${style.iconBg} ${style.color} ${style.borderHover}`}>
                        <Icon size={28} className="md:w-8 md:h-8" />
                      </div>

                      <h3 className="text-white font-bold text-sm md:text-base mb-1 line-clamp-1">
                        {category.title}
                      </h3>

                      <p className="text-zinc-500 text-xs">
                        {courseCount} دوره
                      </p>

                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
  );
}