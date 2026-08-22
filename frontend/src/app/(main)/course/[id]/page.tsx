"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; 
import Navbar from "../../../../components/home/Navbar";
import Footer from "../../../../components/home/footer";
import Link from 'next/link';
import { 
  Clock, Users, User, PlayCircle, Lock, 
  ChevronDown, Shield, MonitorPlay, Star,
  MessageSquare, Info, BarChart, Loader2, Play, X, Send
} from 'lucide-react';
import { apiFetch } from "../../../../utils/apiFetch"; 
import { toast } from "sonner";

const translateError = (msg: string) => {
  if (!msg) return "خطایی رخ داده است";
  const translations: Record<string, string> = {
    "You have already purchased this course": "شما قبلاً این دوره را خریداری کرده‌اید",
    "This course is already in your cart": "این دوره از قبل در سبد خرید شما وجود دارد",
    "Course not found": "دوره یافت نشد",
  };
  return translations[msg] || "خطایی در سیستم رخ داد، لطفاً دوباره تلاش کنید.";
};

const getCourseStateFa = (state: string) => {
  if (!state) return "نامشخص";
  switch (state.toLowerCase()) {
    case "completed": return "تکمیل شده";
    case "in_progress":
    case "ongoing":
    case "inprogress": return "در حال برگزاری";
    case "pre_sale":
    case "presale": return "پیش‌فروش";
    case "canceled": return "لغو شده";
    default: return "نامشخص"; 
  }
};

export default function SingleCoursePage() {
  const params = useParams(); 
  const courseId = params.id as string;
  const router = useRouter(); 

  const [course, setCourse] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]); 
  const [currentUser, setCurrentUser] = useState<any>(null); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  const [newCommentText, setNewCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      try {
        const [courseRes, authRes, commentsRes] = await Promise.all([
          apiFetch(`/course/${courseId}`),
          apiFetch("/auth/me").catch(() => null),
          apiFetch(`/comment/course/${courseId}`).catch(() => null) 
        ]);

        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setCourse(courseData); 

          if (authRes && authRes.ok) {
            const userData = await authRes.json();
            setCurrentUser(userData); 
            const hasPurchased = userData?.courses?.some(
              (c: any) => c === courseId || c._id === courseId
            );
            setIsEnrolled(hasPurchased || courseData.isUserEnrolled);
          }
          
          if (commentsRes && commentsRes.ok) {
            const commentsData = await commentsRes.json();
            const actualComments = commentsData.data || commentsData; 
            setComments(Array.isArray(actualComments) ? actualComments : []);
          }
        } else {
          setIsError(true);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [courseId]);

  const toggleChapter = (id: string) => {
    setOpenChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const res = await apiFetch(`/cart/${courseId}`, { method: "POST" });
      if (res.ok) {
        toast.success("دوره با موفقیت به سبد خرید اضافه شد");
        router.push("/cart");
      } else {
        const data = await res.json();
        toast.error(translateError(data?.message));
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handlePlayLesson = (lesson: any, isAccessible: boolean) => {
    if (!isAccessible) {
      toast.error("برای مشاهده این جلسه باید در دوره ثبت‌نام کنید.");
      return;
    }
    const videoLink = lesson.fileUrl;
    if (videoLink) {
      setActiveVideoUrl(videoLink);
    } else {
      toast.error("لینک ویدیوی این جلسه هنوز ثبت نشده است.");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return toast.error("متن نظر نمی‌تواند خالی باشد.");

    setIsSubmittingComment(true);
    try {
      const res = await apiFetch(`/comment`, {
        method: "POST",
        body: JSON.stringify({
          body: newCommentText,
          course: course._id,
          rate: rating, 
        })
      });
      
      if (res.ok || res.status === 201) {
        toast.success("نظر شما با موفقیت ثبت شد و پس از تایید مدیریت نمایش داده می‌شود.");
        setNewCommentText("");
        setRating(5);
      } else {
        const data = await res.json();
        if (res.status === 401 || res.status === 403) {
          toast.error("برای ثبت نظر ابتدا وارد حساب کاربری خود شوید.");
        } else {
          toast.error(data?.message || "خطا در ثبت نظر");
        }
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyText.trim()) return toast.error("متن پاسخ نمی‌تواند خالی باشد.");
    setIsSubmittingReply(true);
    try {
      const res = await apiFetch(`/comment/${commentId}/answer`, {
        method: "POST",
        body: JSON.stringify({ body: replyText })
      });
      
      if (res.ok || res.status === 201) {
        toast.success("پاسخ شما با موفقیت ثبت شد.");
        setReplyingTo(null);
        setReplyText("");
        window.location.reload(); 
      } else {
        const data = await res.json();
        toast.error(data?.message || "خطا در ثبت پاسخ");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar/>
        <div className="min-h-screen bg-[#070b1a] flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 md:w-12 md:h-12 text-blue-500 animate-spin" />
          <span className="text-zinc-400 text-sm md:text-base">در حال دریافت اطلاعات دوره...</span>
        </div>
        <Footer />
      </>
    );
  }

  if (isError || !course) {
    return (
      <>
        <Navbar/>
        <div className="min-h-screen bg-[#070b1a] flex flex-col items-center justify-center gap-4 p-4 text-center">
          <Info className="w-12 h-12 md:w-16 md:h-16 text-zinc-600" />
          <h1 className="text-xl md:text-2xl text-white font-bold">دوره مورد نظر یافت نشد!</h1>
          <Link href="/courses" className="text-blue-500 hover:underline text-sm md:text-base">بازگشت به لیست دوره‌ها</Link>
        </div>
        <Footer />
      </>
    );
  }

  const discountedPrice = course.discount
    ? Math.round(course.price * (1 - course.discount / 100))
    : course.price;

  const displayPrice = course.discount === 100 ? "رایگان" : discountedPrice.toLocaleString();

  let safeImageSrc = course.cover || "/placeholder.jpg";
  if (!safeImageSrc.startsWith("http") && !safeImageSrc.startsWith("/")) {
    safeImageSrc = `/${safeImageSrc}`;
  }

  const sortedChapters = course.chapters 
    ? [...course.chapters].sort((a: any, b: any) => (a.order || 0) - (b.order || 0)) 
    : [];

  const isAdminOrTeacher = currentUser && (
    currentUser?.role === "Admin" || 
    currentUser?.role === "Instructor" || 
    String(currentUser?._id) === String(course?.creator?._id || course?.creator)
  );

  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-[#070b1a] pt-24 md:pt-32 pb-12 relative font-sans">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-8 md:mb-12">
          
          <div className="lg:col-span-7 space-y-5 md:space-y-6 order-2 lg:order-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-snug md:leading-tight">
              {course.name}
            </h1>
            <p className="text-zinc-400 text-sm md:text-base text-justify leading-7 md:leading-relaxed break-words">
              {course.shortDescription || "توضیح کوتاهی برای این دوره ثبت نشده است."}
            </p>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 rounded-lg md:rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                  <User size={20} className="md:w-[24px] md:h-[24px]" />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-zinc-500 text-[10px] md:text-xs mb-0.5 md:mb-1">مدرس دوره</span>
                  <span className="text-white font-bold text-xs md:text-sm truncate block">{course.creator?.username || course.creator?.name || "بدون مدرس"}</span>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/10 rounded-lg md:rounded-xl flex items-center justify-center text-green-500 shrink-0">
                  <Info size={20} className="md:w-[24px] md:h-[24px]" />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-zinc-500 text-[10px] md:text-xs mb-0.5 md:mb-1">وضعیت دوره</span>
                  <span className="text-white font-bold text-xs md:text-sm truncate block">{getCourseStateFa(course.courseState)}</span>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/10 rounded-lg md:rounded-xl flex items-center justify-center text-purple-500 shrink-0">
                  <Clock size={20} className="md:w-[24px] md:h-[24px]" />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-zinc-500 text-[10px] md:text-xs mb-0.5 md:mb-1">آخرین بروزرسانی</span>
                  <span className="text-white font-bold text-xs md:text-sm truncate block">
                    {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString("fa-IR") : "نامشخص"}
                  </span>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/10 rounded-lg md:rounded-xl flex items-center justify-center text-yellow-500 shrink-0">
                  <Users size={20} className="md:w-[24px] md:h-[24px]" />
                </div>
                <div className="overflow-hidden">
                  <span className="block text-zinc-500 text-[10px] md:text-xs mb-0.5 md:mb-1">تعداد دانشجو</span>
                  <span className="text-white font-bold text-xs md:text-sm truncate block">{course.studentsCount || 0} نفر</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative w-full aspect-video rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 group cursor-pointer shadow-2xl shadow-blue-900/20 bg-zinc-800">
              <img src={safeImageSrc} alt={course.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/60 to-[#070b1a]/50"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600/80 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300">
                  <PlayCircle size={28} className="ml-0.5 md:ml-1 md:w-[32px] md:h-[32px]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-8 overflow-hidden">
              <h2 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
                <MonitorPlay className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
                توضیحات دوره
              </h2>
              <p className="text-zinc-300 text-sm md:text-base leading-7 md:leading-loose text-justify whitespace-pre-wrap break-words">
                {course.description}
              </p>
            </div>

            {/* سرفصل‌های آموزشی */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-8">
              <h2 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6">سرفصل‌های آموزشی</h2>
              <div className="space-y-3 md:space-y-4">
                {sortedChapters.length > 0 ? (
                  sortedChapters.map((chapter: any, cIdx: number) => (
                    <div key={chapter._id || chapter.id || `chapter-${cIdx}`} className="bg-[#0a1024] border border-white/10 rounded-xl md:rounded-2xl overflow-hidden">
                      <button 
                        onClick={() => toggleChapter(chapter._id)}
                        className="w-full flex items-center justify-between p-4 md:p-5 text-right hover:bg-white/[0.02] transition-colors"
                      >
                        <h3 className="font-semibold text-white text-sm md:text-base pr-1">{chapter.title}</h3>
                        <ChevronDown className={`text-zinc-400 w-4 h-4 md:w-5 md:h-5 shrink-0 transition-transform duration-300 ${openChapters[chapter._id] ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {openChapters[chapter._id] && (
                        <div className="px-3 md:px-5 pb-4 md:pb-5 space-y-2 border-t border-white/5 pt-3 md:pt-4">
                          {(chapter.lessons || [])
                            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                            .map((lesson: any, lIdx: number) => {
                              
                              const isAccessible = lesson.isFree || isEnrolled;
                              
                              return (
                              <div 
                                key={lesson._id || lesson.id || `lesson-${cIdx}-${lIdx}`} 
                                onClick={() => handlePlayLesson(lesson, isAccessible)}
                                className={`flex items-center justify-between p-2.5 md:p-3 bg-white/[0.03] rounded-xl border transition-colors ${
                                  isAccessible 
                                    ? 'border-white/10 hover:border-blue-500/50 cursor-pointer group' 
                                    : 'border-white/5 opacity-70'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 md:gap-3 text-xs md:text-sm text-zinc-300 overflow-hidden pr-1">
                                  {isAccessible ? (
                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                                      <Play size={12} className="text-blue-500 ml-0.5 md:w-[14px] md:h-[14px]" />
                                    </div>
                                  ) : (
                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                      <Lock size={12} className="text-zinc-500 md:w-[14px] md:h-[14px]" />
                                    </div>
                                  )}
                                  <span className={`truncate ${isAccessible ? "text-white font-medium" : ""}`}>
                                    {lesson.title}
                                  </span>
                                </div>
                                <span className="text-[10px] md:text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded-md shrink-0">{lesson.time}</span>
                              </div>
                            )})}
                          {(!chapter.lessons || chapter.lessons.length === 0) && (
                            <div className="text-center py-3 text-xs md:text-sm text-zinc-500">
                              جلسه‌ای در این فصل وجود ندارد.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-sm text-zinc-500 bg-[#0a1024] rounded-2xl border border-white/5">
                    هنوز سرفصلی برای این دوره تعریف نشده است.
                  </div>
                )}
              </div>
            </div>

            {/* بخش نظرات و پرسش‌ها */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-8">
              <h2 className="text-lg md:text-2xl font-bold text-white mb-6 md:mb-8 flex items-center gap-2">
                <MessageSquare className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
                نظرات و پرسش‌ها ({comments.length})
              </h2>

              {/* فرم ثبت کامنت جدید و ستاره‌ها */}
              <form onSubmit={handleSubmitComment} className="mb-8 md:mb-10 bg-[#0a1024] p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 md:mb-5">
                  <span className="text-zinc-300 text-xs md:text-sm font-medium">امتیاز شما به این دوره:</span>
                  <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={`star-${star}`}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110 p-0.5 md:p-1"
                      >
                        <Star
                          size={20}
                          className={`${
                            star <= (hoveredRating || rating)
                              ? "fill-yellow-500 text-yellow-500 shadow-yellow-500/50 drop-shadow-md"
                              : "text-zinc-600"
                          } transition-all duration-200 md:w-[22px] md:h-[22px]`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md font-bold text-[10px] md:text-xs sm:mr-2 w-max">
                    {rating} از 5
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="پرسش یا نظر خود را درباره این دوره بنویسید..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl md:rounded-2xl p-3 md:p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.04] transition-all resize-none min-h-[100px] md:min-h-[120px] text-xs md:text-sm leading-relaxed pb-12"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={isSubmittingComment}
                    className="absolute left-2 bottom-2 md:left-4 md:bottom-4 bg-blue-600 hover:bg-blue-500 text-white px-4 md:px-5 py-1.5 md:py-2 rounded-lg md:rounded-xl flex items-center gap-1.5 md:gap-2 transition-colors disabled:opacity-70 text-xs md:text-sm font-medium shadow-lg shadow-blue-900/20"
                  >
                    {isSubmittingComment ? (
                      <Loader2 size={14} className="animate-spin md:w-[16px] md:h-[16px]" />
                    ) : (
                      <>
                        ارسال <span className="hidden sm:inline">نظر</span>
                        <Send size={14} className="rotate-180 md:w-[16px] md:h-[16px]" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* لیست کامنت‌ها */}
              <div className="space-y-4 md:space-y-6">
                {comments.length > 0 ? (
                  comments.map((comment: any, index: number) => (
                    <div key={comment._id || comment.id || `comment-${index}`} className="bg-[#0a1024] border border-white/5 rounded-xl md:rounded-2xl p-4 md:p-5">
                      <div className="flex gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-base md:text-lg shrink-0">
                          {(comment.creator?.name || comment.creator?.username || "ک").charAt(0)}
                        </div>
                        <div className="flex-1 w-full overflow-hidden">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                            <div>
                              <h4 className="text-white font-medium flex items-center gap-2 text-xs md:text-sm truncate">
                                {comment.creator?.name || comment.creator?.username || "کاربر سایت"}
                                {comment.rate && (
                                  <div className="flex items-center gap-1 bg-yellow-500/10 px-1.5 md:px-2 py-0.5 rounded-full shrink-0">
                                    <Star size={8} className="fill-yellow-500 text-yellow-500 md:w-[10px] md:h-[10px]" />
                                    <span className="text-[9px] md:text-[10px] text-yellow-500 font-bold mt-0.5">{comment.rate}</span>
                                  </div>
                                )}
                              </h4>
                              <span className="text-[10px] md:text-xs text-zinc-500 mt-1 block">
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString('fa-IR') : 'تاریخ نامشخص'}
                              </span>
                            </div>
                          </div>
                          <p className="text-zinc-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {comment.body}
                          </p>
                          
                          {isAdminOrTeacher && (
                            <div className="mt-3">
                              <button
                                onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                className="text-[10px] md:text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors bg-blue-500/10 px-2.5 md:px-3 py-1.5 rounded-lg w-max"
                              >
                                <MessageSquare size={12} className="md:w-[14px] md:h-[14px]" />
                                {replyingTo === comment._id ? "لغو پاسخ" : "پاسخ مدرس"}
                              </button>
                            </div>
                          )}

                          {replyingTo === comment._id && (
                            <div className="mt-3 md:mt-4 bg-white/[0.02] p-3 md:p-4 rounded-xl border border-blue-500/30 relative">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="پاسخ خود را بنویسید..."
                                className="w-full bg-transparent text-xs md:text-sm text-white placeholder-zinc-500 focus:outline-none resize-none min-h-[60px] md:min-h-[80px]"
                              ></textarea>
                              <div className="flex justify-end mt-2">
                                <button
                                  onClick={() => handleSubmitReply(comment._id)}
                                  disabled={isSubmittingReply}
                                  className="bg-blue-600 hover:bg-blue-500 text-white px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm flex items-center gap-1.5 transition-colors disabled:opacity-70"
                                >
                                  {isSubmittingReply ? <Loader2 size={12} className="animate-spin md:w-[14px] md:h-[14px]" /> : "ارسال پاسخ"}
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>

                      {/* پاسخ‌های کامنت (Reply) */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/5 space-y-3 md:space-y-4">
                          {comment.replies.map((reply: any, replyIndex: number) => (
                            <div key={reply._id || reply.id || `reply-${index}-${replyIndex}`} className="flex gap-2.5 md:gap-4 mr-4 md:mr-8 lg:mr-12">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center font-bold text-sm md:text-md shrink-0 border border-green-500/20">
                                {(reply.creator?.name || reply.creator?.username || "م").charAt(0)}
                              </div>
                              <div className="flex-1 bg-white/[0.02] rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/5 overflow-hidden">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1.5 md:mb-2 gap-1">
                                  <div>
                                    <h4 className="text-white font-medium flex items-center gap-1.5 md:gap-2 text-xs md:text-sm">
                                      {reply.creator?.name || reply.creator?.username || "پاسخ دهنده"}
                                      <span className="text-[8px] md:text-[10px] bg-green-500/20 text-green-400 px-1.5 md:px-2 py-0.5 rounded-full shrink-0">مدرس / پشتیبان</span>
                                    </h4>
                                    <span className="text-[10px] md:text-xs text-zinc-500 block mt-0.5 md:mt-1">
                                      {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString('fa-IR') : 'تاریخ نامشخص'}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-zinc-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words">
                                  {reply.body}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 md:py-10 text-xs md:text-sm text-zinc-500">
                    هنوز نظری برای این دوره ثبت نشده است. اولین نفر باشید!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* سایدبار اطلاعات دوره */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-6 backdrop-blur-xl">
                <div className="text-center mb-5 md:mb-6">
                  {course.discount && course.discount > 0 && course.discount < 100 ? (
                    <span className="text-zinc-400 line-through text-xs md:text-sm block mb-1">
                      {course.price.toLocaleString()} تومان
                    </span>
                  ) : null}

                  <div className="flex items-center justify-center gap-1.5 md:gap-2">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-black text-green-400">
                      {displayPrice}
                    </span>
                    {course.discount !== 100 && <span className="text-zinc-400 text-xs md:text-sm pt-1">تومان</span>}
                  </div>
                </div>
                
                {isEnrolled ? (
                  <button 
                    disabled
                    className="w-full py-3.5 md:py-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-sm md:text-base lg:text-lg flex items-center justify-center gap-2 cursor-default"
                  >
                    شما دانشجوی این دوره هستید
                  </button>
                ) : (
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full py-3.5 md:py-4 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-sm md:text-base lg:text-lg transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isAddingToCart ? <Loader2 className="animate-spin md:w-[20px] md:h-[20px]" size={16} /> : "ثبت‌نام در این دوره"}
                  </button>
                )}
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6">
                <ul className="space-y-3 md:space-y-4">
                  <li className="flex items-center justify-between border-b border-white/5 pb-3 md:pb-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <BarChart size={16} className="text-blue-500 md:w-[18px] md:h-[18px]" />
                      <span className="text-xs md:text-sm">سطح دوره</span>
                    </div>
                    <span className="text-white text-xs md:text-sm font-medium">همه سطوح</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-3 md:pb-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Shield size={16} className="text-blue-500 md:w-[18px] md:h-[18px]" />
                      <span className="text-xs md:text-sm">پشتیبانی</span>
                    </div>
                    <span className="text-white text-xs md:text-sm font-medium truncate max-w-[120px]">{course.support || "دارد"}</span>
                  </li>
                  <li className="flex items-center justify-between pb-1 md:pb-2">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <MonitorPlay size={16} className="text-blue-500 md:w-[18px] md:h-[18px]" />
                      <span className="text-xs md:text-sm">وضعیت</span>
                    </div>
                    <span className="text-white text-xs md:text-sm font-medium">
                      {getCourseStateFa(course.courseState)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* مودال ویدیو */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl bg-[#0a1024] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-300">
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-2 right-2 md:top-4 md:right-4 z-10 w-8 h-8 md:w-10 md:h-10 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors border border-white/10"
            >
              <X size={16} className="md:w-[20px] md:h-[20px]" />
            </button>
            <video
              src={activeVideoUrl}
              controls
              autoPlay
              className="w-full aspect-video object-contain bg-black max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </main>
    <Footer />
    </>
  );
}