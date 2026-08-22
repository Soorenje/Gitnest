"use client";

import { useState, useEffect } from "react";
import { Check, Trash2, MessageSquare, ExternalLink, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "../../../../utils/apiFetch"; 
import { toast } from "sonner";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await apiFetch("/comment/admin/comments");
        if (res.ok) {
          const data = await res.json();
          setComments(Array.isArray(data) ? data : []);
        } else {
          toast.error("خطا در دریافت لیست نظرات");
        }
      } catch (error) {
        toast.error("خطا در ارتباط با سرور");
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await apiFetch(`/comment/${id}/accept`, { method: "PATCH" });
      if (res.ok) {
        toast.success("نظر با موفقیت تایید شد");
        setComments(comments.map(c => c._id === id ? { ...c, isAccept: true } : c));
      } else {
        const data = await res.json();
        toast.error(data?.message || "خطا در تایید نظر");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await apiFetch(`/comment/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("نظر با موفقیت حذف شد");
        setComments(comments.filter(c => c._id !== id));
      } else {
        const data = await res.json();
        toast.error(data?.message || "خطا در حذف نظر");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    }
  };

  const filteredComments = comments.filter(c => {
    const status = c.isAccept ? "approved" : "pending";
    const matchesStatus = filter === "all" || status === filter;
    const authorName = c.creator?.name || c.creator?.username || "کاربر";
    const targetName = c.course?.name || c.article?.title || "نامشخص";
    const matchesSearch = authorName.includes(searchTerm) || c.body.includes(searchTerm) || targetName.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">مدیریت نظرات</h2>
          <p className="text-xs md:text-sm text-zinc-400">بررسی، تایید و پاسخ به نظرات کاربران سایت</p>
        </div>

        <div className="relative w-full lg:w-64 shrink-0 mt-2 lg:mt-0">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="جستجو (نام یا متن)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 pr-10 pl-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2 mb-6 bg-white/[0.02] border border-white/5 p-1 rounded-xl w-max max-w-full overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setFilter("all")}
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${filter === "all" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"}`}
        >
          همه
        </button>
        <button 
          onClick={() => setFilter("pending")}
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-1.5 md:gap-2 whitespace-nowrap ${filter === "pending" ? "bg-orange-500/20 text-orange-400" : "text-zinc-400 hover:text-white"}`}
        >
          در انتظار تایید
          <span className="flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-md bg-orange-500/20 text-[9px] md:text-[10px] text-orange-400">
            {comments.filter(c => !c.isAccept).length}
          </span>
        </button>
        <button 
          onClick={() => setFilter("approved")}
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${filter === "approved" ? "bg-green-500/20 text-green-400" : "text-zinc-400 hover:text-white"}`}
        >
          تایید شده
        </button>
      </div>

      <div className="space-y-4">
        {filteredComments.length > 0 ? (
          filteredComments.map((comment) => {
            const authorName = comment.creator?.name || comment.creator?.username || "کاربر ناشناس";
            const targetName = comment.course?.name || comment.article?.title || "بدون مرجع";

            return (
              <div key={comment._id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 hover:bg-white/[0.04] transition-colors group">
                <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
                  <div className="shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-white/10 text-blue-400 font-bold text-base md:text-lg">
                    {authorName.charAt(0)}
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                        <h4 className="text-white text-sm md:text-base font-medium">{authorName}</h4>
                        <span className="text-[10px] md:text-xs text-zinc-500">
                          {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                        {!comment.isAccept && (
                          <span className="text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            در انتظار
                          </span>
                        )}
                        {comment.isAnswer && (
                          <span className="text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            پاسخ
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-zinc-300 text-xs md:text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                      {comment.body}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
                      <Link href={comment.course ? `/courses/${comment.course._id}` : "#"} className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] md:text-xs text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-2 sm:py-1.5 rounded-lg w-full sm:w-max">
                        <MessageSquare size={12} className="md:w-3.5 md:h-3.5" />
                        <span className="truncate max-w-[200px]">{targetName}</span>
                        <ExternalLink size={10} className="ml-1 opacity-70 md:w-3 md:h-3" />
                      </Link>

                      <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity w-full sm:w-auto">
                        {!comment.isAccept && (
                          <button 
                            onClick={() => handleApprove(comment._id)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 md:py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors text-xs font-medium border border-green-500/20"
                          >
                            <Check size={14} /> تایید نظر
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(comment._id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 md:py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-medium border border-red-500/20"
                        >
                          <Trash2 size={14} /> حذف
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-16 md:py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl">
            <MessageSquare size={36} className="mx-auto text-zinc-600 mb-3 md:mb-4 md:w-10 md:h-10" />
            <p className="text-zinc-500 text-sm md:text-base">نظری با این مشخصات یافت نشد.</p>
          </div>
        )}
      </div>
    </div>
  );
}