"use client";

import { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "./../../utils/apiFetch";

export default function PopularFreeCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFreeCourses = async () => {
      try {
        const res = await apiFetch("/course?isFree=true&limit=8");
        if (res.ok) {
          const data = await res.json();
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
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 md:mb-12 text-center sm:text-right">
          <h2 className="text-2xl md:text-3xl font-bold">
            <span className="text-white">پرطرفدارترین</span>{" "}
            <span className="text-blue-400">دوره‌های رایگان</span>
          </h2>

          <Link
            href="/courses?isFree=true"
            className="flex items-center justify-center sm:justify-start gap-2 text-blue-500 hover:text-blue-400 transition-colors font-medium border border-blue-500/30 px-4 md:px-5 py-2 md:py-2.5 rounded-xl hover:bg-blue-500/10 w-full sm:w-max text-sm md:text-base mt-2 sm:mt-0"
          >
            مشاهده همه
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16 md:py-20">
            <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-spin" />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={{
                  id: course.href || course._id, 
                  title: course.name,
                  description: course.shortDescription,
                  coverImage: course.cover || "/courses/placeholder.webp",
                  teacher: course.creator?.name || course.creator?.username || "مدرس گیت‌نست",
                  rating: 5, 
                  students: course.studentsCount || 0,
                  price: course.price,
                  discount: course.discount || (course.price === 0 ? 100 : 0),
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 md:py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl md:rounded-3xl">
            <p className="text-zinc-400 text-sm md:text-base">در حال حاضر دوره رایگانی ثبت نشده است.</p>
          </div>
        )}
      </div>
    </section>
  );
}