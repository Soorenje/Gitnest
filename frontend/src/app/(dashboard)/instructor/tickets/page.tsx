"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Reply,
  Eye,
  BookOpen
} from "lucide-react";
import Link from "next/link";

// دیتای تستی سوالات دانشجویان از مدرس
const mockTickets = [
  {
    id: "QNA-1042",
    studentName: "امیرحسین رضایی",
    studentAvatar: "ا",
    course: "دوره جامع React.js",
    subject: "مشکل در اجرای هوک useEffect در حالت Strict Mode",
    status: "pending", // pending (نیاز به پاسخ), answered (پاسخ داده شده), closed
    date: "۲ ساعت پیش",
    messages: 1,
  },
  {
    id: "QNA-1038",
    studentName: "سارا کریمی",
    studentAvatar: "س",
    course: "طراحی وب با Tailwind CSS",
    subject: "چطور کلاس‌های سفارشی رو تو کانفیگ اضافه کنم؟",
    status: "answered",
    date: "دیروز",
    messages: 3,
  },
  {
    id: "QNA-1025",
    studentName: "محمد عباسی",
    studentAvatar: "م",
    course: "دوره جامع React.js",
    subject: "ارور Next.js هنگام بیلد گرفتن پروژه نهایی",
    status: "pending",
    date: "امروز",
    messages: 2,
  },
  {
    id: "QNA-0988",
    studentName: "علی حسینی",
    studentAvatar: "ع",
    course: "مسترکلاس جاوااسکریپت",
    subject: "تشکر بابت تدریس عالی شما در بخش Promise ها",
    status: "closed",
    date: "هفته پیش",
    messages: 2,
  },
];

export default function InstructorTicketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, answered, closed

  // فیلتر کردن تیکت‌ها
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch = ticket.subject.includes(searchTerm) || ticket.studentName.includes(searchTerm);
    const matchesFilter = filter === "all" || ticket.status === filter;
    return matchesSearch && matchesFilter;
  });

  // استایل‌دهی بر اساس وضعیت
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "نیاز به پاسخ", icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
      case "answered":
        return { text: "پاسخ داده شده", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" };
      case "closed":
        return { text: "بسته شده", icon: XCircle, color: "text-zinc-400", bg: "bg-white/5", border: "border-white/10" };
      default:
        return { text: "نامشخص", icon: MessageSquare, color: "text-zinc-400", bg: "bg-white/5", border: "border-white/10" };
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* هدر صفحه */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">پرسش و پاسخ (تیکت‌ها)</h2>
          <p className="text-sm text-zinc-400">پاسخگویی به سوالات و مشکلات آموزشی دانشجویان شما</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="جستجو در سوالات..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all text-sm"
          />
        </div>
      </div>

      {/* تب‌های فیلتر */}
      <div className="flex items-center gap-2 mb-6 bg-white/[0.02] border border-white/5 p-1 rounded-xl w-max overflow-x-auto max-w-full scrollbar-hide">
        <div className="px-3 text-zinc-500 flex items-center gap-2 border-l border-white/10">
          <Filter size={16} />
        </div>
        {[
          { id: "all", title: "همه سوالات" },
          { id: "pending", title: "نیاز به پاسخ" },
          { id: "answered", title: "پاسخ داده شده" },
          { id: "closed", title: "بسته شده" },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
              filter === tab.id ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.title}
            {tab.id === "pending" && mockTickets.filter(t => t.status === "pending").length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-500/20 text-[10px] text-orange-400">
                {mockTickets.filter(t => t.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* لیست تیکت‌ها/سوالات */}
      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => {
            const status = getStatusInfo(ticket.status);
            return (
              <div key={ticket.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
                <div className="flex flex-col md:flex-row gap-5">
                  
                  {/* آواتار دانشجو */}
                  <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-blue-500/20 text-blue-400 font-bold text-lg hidden sm:flex">
                    {ticket.studentAvatar}
                  </div>

                  {/* اطلاعات تیکت */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">
                          {ticket.subject}
                        </h4>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border ${status.border} ${status.bg} ${status.color} text-[10px] font-bold whitespace-nowrap`}>
                          <status.icon size={12} />
                          {status.text}
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500">{ticket.date}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-400 mb-4">
                      <span className="flex items-center gap-1.5">
                        <span className="text-zinc-500">دانشجو:</span> 
                        <span className="text-zinc-300 font-medium">{ticket.studentName}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen size={14} className="text-zinc-500" />
                        {ticket.course}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare size={14} className="text-zinc-500" />
                        {ticket.messages} پیام تبادل شده
                      </span>
                    </div>

                    {/* دکمه‌های عملیات */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                      {ticket.status === "pending" ? (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all text-xs font-medium shadow-lg shadow-blue-500/20">
                          <Reply size={16} />
                          ثبت پاسخ
                        </button>
                      ) : (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all text-xs font-medium border border-white/10">
                          <Eye size={16} />
                          مشاهده گفتگو
                        </button>
                      )}
                      
                      {ticket.status !== "closed" && (
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-xs font-medium">
                          بستن تیکت
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center">
            <MessageSquare size={48} className="text-zinc-700 mb-4" />
            <h3 className="text-white font-medium mb-2">سوال یا تیکتی یافت نشد</h3>
            <p className="text-zinc-500 text-sm">در حال حاضر هیچ سوالی با این وضعیت برای شما ثبت نشده است.</p>
          </div>
        )}
      </div>

    </div>
  );
}