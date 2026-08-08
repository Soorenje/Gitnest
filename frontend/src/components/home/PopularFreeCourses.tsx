"use client";

import { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "./../..//utils/apiFetch"; // 💡 مسیر را با توجه به پوشه‌بندی خود تنظیم کنید

export default function PopularFreeCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFreeCourses = async () => {
      try {
        // 💡 دریافت دوره‌های تایید شده و رایگان از بک‌اند
        const res = await apiFetch("/course?isFree=true&limit=8");
        if (res.ok) {
          const data = await res.json();
          // دریافت دیتا و مرتب‌سازی بر اساس تعداد دانشجو
          const fetchedCourses = (data.data || []).sort(
            (a: any, b: any) => (b.studentsCount || 0) - (a.studentsCount || 0)
          );
          setCourses(fetchedCourses);
        }
      } catch (error) {
        console.error("Error fetching free courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFreeCourses();
  }, []);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <h2 className="text-3xl font-bold">
            <span className="text-white">پرطرفدارترین</span>{" "}
            <span className="text-blue-400">دوره‌های رایگان</span>
          </h2>

          <Link
            href="/courses?isFree=true"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors font-medium border border-blue-500/30 px-5 py-2.5 rounded-xl hover:bg-blue-500/10"
          >
            مشاهده همه
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* 💡 نمایش لودینگ در زمان دریافت دیتا */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={{
                  id: course.href || course._id, // لینک‌دهی با href
                  title: course.name,
                  description: course.shortDescription,
                  coverImage: course.cover || "/courses/placeholder.webp",
                  teacher: course.creator?.name || course.creator?.username || "مدرس گیت‌نست",
                  rating: 5, // چون فیلد ریتینگ در مدل شما نیست، پیش‌فرض 5
                  students: course.studentsCount || 0,
                  price: course.price,
                  discount: course.discount || (course.price === 0 ? 100 : 0),
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
            <p className="text-zinc-400">در حال حاضر دوره رایگانی ثبت نشده است.</p>
          </div>
        )}
      </div>
    </section>
  );
}