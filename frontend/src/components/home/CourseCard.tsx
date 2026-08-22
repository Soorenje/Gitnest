"use client";

import React from "react";
import { User, Star } from "lucide-react";
import Link from "next/link";

export interface Course {
  id: string;
  title: string;
  description: string;
  teacher: string;
  rating: number;
  students: number;
  price: number;
  discount?: number;
  coverImage: string;
}

interface Props {
  course: Course;
}

const CourseCard: React.FC<Props> = ({ course }) => {
  const discountedPrice = course.discount
    ? Math.round(course.price * (1 - course.discount / 100))
    : course.price;

  const displayPrice = course.discount === 100 ? "رایگان" : discountedPrice.toLocaleString();

  return (
    <Link 
      href={`/course/${course.id}`} 
      className="rounded-3xl border border-white/5 bg-[#0a0f1d] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.1)] hover:border-blue-500/30 flex flex-col group h-full"
      dir="rtl"
    >
      <div className="relative h-40 sm:h-48 w-full bg-zinc-800/50 overflow-hidden shrink-0">
        <img
          src={course.coverImage}
          alt={course.title || "تصویر دوره"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/600x400/1e293b/94a3b8?text=No+Image";
          }}
        />
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        
        <h3 className="text-white font-bold text-base sm:text-lg mb-2 group-hover:text-blue-400 transition-colors line-clamp-1 text-right w-full">
          {course.title}
        </h3>
        
        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-2 overflow-hidden text-ellipsis text-right w-full min-h-[36px] sm:min-h-[40px] mb-4 sm:mb-5">
          {course.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-blue-600 to-purple-500 flex items-center justify-center shadow-md shrink-0">
              <span className="text-[10px] sm:text-[11px] text-white font-bold">
                {course.teacher ? course.teacher.charAt(0) : "م"}
              </span>
            </div>
            <span className="text-zinc-300 text-xs sm:text-sm font-medium truncate">{course.teacher}</span>
          </div>
          
          <div className="flex items-center gap-1 text-yellow-500 shrink-0">
            <span className="font-bold text-xs sm:text-sm pt-0.5">{Number(course.rating).toFixed(1)}</span>
            <Star size={14} className="sm:w-4 sm:h-4" fill="currentColor" strokeWidth={1.5} />
          </div>
        </div>

        <div className="mt-auto">
          <div className="h-px w-full bg-white/5 mb-3"></div>

          <div className="flex flex-col w-full">
            <div className="flex justify-end h-5 mb-1">
              {course.discount && course.discount > 0 && course.discount < 100 ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs text-zinc-500 line-through">
                    {course.price.toLocaleString()}
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold">
                    {course.discount}%
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between w-full">
              
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs sm:text-sm font-medium">
                <User size={14} className="sm:w-4 sm:h-4" strokeWidth={1.5} />
                <span className="pt-1">{course.students}</span>
              </div>

              <div className="flex items-center gap-1">
                <span className={course.discount === 100 ? "text-emerald-400 font-bold text-sm sm:text-base" : "text-emerald-400 font-bold text-base sm:text-lg leading-none"}>
                  {displayPrice}
                </span>
                {course.discount !== 100 && <span className="text-zinc-500 text-[10px] sm:text-xs leading-none pt-1">تومان</span>}
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default CourseCard;