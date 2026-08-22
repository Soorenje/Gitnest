"use client";

import { useEffect, useState } from "react";
import CourseCard, { Course } from "./CourseCard";
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from "./../../utils/apiFetch";

export default function LatestCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestCourses = async () => {
      try {
        const res = await apiFetch("/course?limit=8&sort=newest");
        if (res.ok) {
          const data = await res.json();
          
          if (Array.isArray(data)) {
            const mappedCourses: Course[] = data.map((course: any) => ({
              id: course._id,
              title: course.name,
              description: course.description,
              coverImage: course.cover,
              price: course.price,
              discount: course.discount || 0,
              teacher: course.creator?.username || "بدون مدرس", 
              rating: course.rating || 5.0, 
              students: course.studentsCount || 0,
            }));

            setCourses(mappedCourses);
          }
        }
      } catch (error) {
        console.error("خطا در دریافت دوره‌ها:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestCourses();
  }, []);

  return (
    <section className="bg-[#070b1a] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 md:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-right">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white">آخرین دوره‌های گیت‌نست</h2>
            <p className="mt-2 md:mt-3 text-zinc-400 text-sm md:text-base">
              جدیدترین دوره‌های منتشر شده برای یادگیری حرفه‌ای برنامه‌نویسی
            </p>
          </div>
          <Link 
            href="/courses" 
            className="flex items-center justify-center sm:justify-start gap-2 text-blue-500 hover:text-blue-400 transition-colors font-medium border border-blue-500/30 px-4 md:px-5 py-2 md:py-2.5 rounded-xl hover:bg-blue-500/10 w-full sm:w-max text-sm md:text-base mt-2 sm:mt-0"
          >
            مشاهده همه دوره‌ها
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16 md:py-20">
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-spin" />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 md:py-20 text-zinc-400 border border-white/5 border-dashed rounded-2xl md:rounded-3xl text-sm md:text-base">
            دوره‌ای برای نمایش وجود ندارد
          </div>
        )}
      </div>
    </section>
  );
}