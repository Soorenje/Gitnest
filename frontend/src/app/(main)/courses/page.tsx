'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../../components/home/Navbar"; // آدرس‌ها را با ساختار پوشه خود چک کنید
import Footer from "../../../components/home/footer";
import CourseCard, { Course } from "../../../components/home/CourseCard";
import { Search, SlidersHorizontal, ChevronDown, Check, Filter, Loader2 } from "lucide-react";
import { apiFetch } from "../../../utils/apiFetch"; // آدرس پوشه util خود را تنظیم کنید

const categories = [
  { id: "all", title: "همه دوره‌ها" },
  { id: "python", title: "پایتون (Python)" },
  { id: "html-css", title: "HTML & CSS" },
  { id: "security", title: "امنیت وب" },
  { id: "react", title: "ری‌اکت (React.js)" },
  { id: "nodejs", title: "نود جی‌اس (Node.js)" },
  { id: "flutter", title: "فلاتر (Flutter)" },
  { id: "wordpress", title: "وردپرس (WordPress)" },
  { id: "mongodb", title: "مونگو دی‌بی (MongoDB)" },
];

const sortOptions = ["جدیدترین‌ها", "پرطرفدارترین‌ها", "آخرین آپدیت", "رایگان‌ها"];

function CoursesContent() {
  const searchParams = useSearchParams();
  
  // خواندن مقادیر اولیه از URL
  const initialCategory = searchParams.get("category") || "all";
  const initialSort = searchParams.get("sort") || "جدیدترین‌ها";
  
  // استیت‌های مربوط به دیتا و لودینگ
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // استیت‌های فیلتر و سرچ
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSort, setActiveSort] = useState(initialSort);
  const [searchTerm, setSearchTerm] = useState("");
  
  // استیت‌های باز و بسته شدن منوها
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // آپدیت استیت در صورت تغییر دستی URL
  useEffect(() => {
    const cat = searchParams.get("category");
    const sortParam = searchParams.get("sort");
    if (cat) setActiveCategory(cat);
    if (sortParam) setActiveSort(sortParam);
  }, [searchParams]);

  // دریافت اطلاعات از بک‌اند با توجه به فیلترها
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        // ساخت کوئری‌های داینامیک برای ارسال به بک‌اند
        const queryParams = new URLSearchParams();
        
        if (activeCategory !== "all") {
          queryParams.append("category", activeCategory);
        }

        switch (activeSort) {
          case "جدیدترین‌ها":
            queryParams.append("sort", "newest");
            break;
          case "پرطرفدارترین‌ها":
            queryParams.append("sort", "popular");
            break;
          case "آخرین آپدیت":
            queryParams.append("sort", "updated");
            break;
          case "رایگان‌ها":
            queryParams.append("isFree", "true");
            break;
        }

        const res = await apiFetch(`/course?${queryParams.toString()}`);
        
        if (res.ok) {
          const data = await res.json();
          
          if (Array.isArray(data)) {
            // مپ کردن دیتای بک‌اند به ساختار CourseCard
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

    fetchCourses();
  }, [activeCategory, activeSort]); // هر بار که دسته‌بندی یا مرتب‌سازی تغییر کند، درخواست جدید ارسال می‌شود

  // فیلتر کردن نتایج بر اساس نوار جستجوی متنی (Client Side)
  const finalCourses = courses.filter((course) => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCategoryTitle = categories.find(c => c.id === activeCategory)?.title || "همه دوره‌ها";

  return (
    <main className="min-h-screen bg-[#070b1a] pt-28 md:pt-36 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6">
            دوره‌های <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">آموزشی</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            با دوره‌های پروژه‌محور و تخصصی ما، مهارت‌های برنامه‌نویسی خود را به سطح حرفه‌ای برسانید.
          </p>
        </div>

        {/* نوار جستجو و فیلترها */}
        <div className="relative z-40 bg-white/[0.02] border border-white/5 rounded-3xl p-4 md:p-6 mb-12 backdrop-blur-md flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full lg:flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در بین دوره‌ها..." 
              className="w-full bg-[#0a1024] border border-white/10 rounded-2xl py-3.5 pr-12 pl-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.02] transition-all text-sm"
            />
          </div>

          <div className="relative w-full lg:w-64 shrink-0">
            <button 
              onClick={() => {
                setFilterOpen(!filterOpen);
                setSortOpen(false);
              }}
              className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-white text-sm font-medium hover:bg-blue-600/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-blue-400" />
                <span className="truncate">دسته‌بندی: <strong className="text-white font-semibold">{activeCategoryTitle}</strong></span>
              </div>
              <ChevronDown size={16} className={`text-blue-400 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>

            {filterOpen && (
              <div className="absolute left-0 right-0 mt-2 z-50 bg-[#0a1024] border border-white/10 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-y-auto max-h-64 custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setFilterOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-right text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span>{cat.title}</span>
                    {activeCategory === cat.id && <Check size={16} className="text-blue-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative w-full lg:w-56 shrink-0">
            <button 
              onClick={() => {
                setSortOpen(!sortOpen);
                setFilterOpen(false);
              }}
              className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2 text-zinc-400">
                <SlidersHorizontal size={16} />
                <span>مرتب‌سازی: <strong className="text-white font-semibold">{activeSort}</strong></span>
              </div>
              <ChevronDown size={16} className={`text-zinc-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>

            {sortOpen && (
              <div className="absolute left-0 right-0 mt-2 z-50 bg-[#0a1024] border border-white/10 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setActiveSort(option);
                      setSortOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-right text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <span>{option}</span>
                    {activeSort === option && <Check size={16} className="text-blue-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* لیست دوره‌ها */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-zinc-400 gap-4">
             <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
             <span>در حال دریافت دوره‌ها...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
              {finalCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {finalCourses.length === 0 && (
              <div className="text-center py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl relative z-10 flex flex-col items-center gap-3">
                <Search className="w-12 h-12 text-zinc-700" />
                <p className="text-zinc-500">دوره‌ای با این مشخصات یافت نشد.</p>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}

export default function CoursesPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-[#070b1a] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <span className="text-zinc-500">در حال پردازش...</span>
        </div>
      }>
        <CoursesContent />
      </Suspense>
      <Footer />
    </>
  );
}