"use client";

import { useState } from "react";
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MessageCircle,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

// دیتای تستی تیکت‌های پشتیبانی
const mockTickets = [
  {
    id: "TCK-8492",
    subject: "خطا در نصب پکیج‌های پروژه نهایی React",
    department: "پشتیبانی آموزشی (مدرس)",
    status: "answered", // open, answered, closed
    lastUpdate: "۲ ساعت پیش",
    messagesCount: 3,
  },
  {
    id: "TCK-8485",
    subject: "درخواست فاکتور رسمی برای خرید دوره",
    department: "پشتیبانی مالی",
    status: "closed",
    lastUpdate: "۱ روز پیش",
    messagesCount: 2,
  },
  {
    id: "TCK-8501",
    subject: "ویدیو جلسه دهم پخش نمی‌شود",
    department: "پشتیبانی فنی",
    status: "open",
    lastUpdate: "۱۰ دقیقه پیش",
    messagesCount: 1,
  },
];

export default function StudentTicketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, open, answered, closed

  // فیلتر کردن تیکت‌ها
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch = ticket.subject.includes(searchTerm) || ticket.id.includes(searchTerm);
    const matchesFilter = filter === "all" || ticket.status === filter;
    return matchesSearch && matchesFilter;
  });

  // تابع کمکی برای استایل وضعیت تیکت
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "open":
        return { text: "در انتظار پاسخ", icon: Clock, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
      case "answered":
        return { text: "پاسخ داده شده", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" };
      case "closed":
        return { text: "بسته شده", icon: XCircle, color: "text-zinc-400", bg: "bg-white/5", border: "border-white/10" };
      default:
        return { text: "نامشخص", icon: Ticket, color: "text-zinc-400", bg: "bg-white/5", border: "border-white/10" };
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* هدر صفحه */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">تیکت‌های پشتیبانی</h2>
          <p className="text-sm text-zinc-400">پیگیری سوالات آموزشی، مشکلات فنی و درخواست‌های مالی</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="جستجو (موضوع یا شماره)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all text-sm"
            />
          </div>

          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300">
            <Plus size={18} />
            ارسال تیکت جدید
          </button>
        </div>
      </div>

      {/* تب‌های فیلتر */}
      <div className="flex items-center gap-2 mb-6 bg-white/[0.02] border border-white/5 p-1 rounded-xl w-max overflow-x-auto max-w-full scrollbar-hide">
        <div className="px-3 text-zinc-500 flex items-center gap-2 border-l border-white/10">
          <Filter size={16} />
        </div>
        {[
          { id: "all", title: "همه تیکت‌ها" },
          { id: "open", title: "در انتظار پاسخ" },
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
            {tab.id === "open" && mockTickets.filter(t => t.status === "open").length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-orange-500/20 text-[10px] text-orange-400">
                {mockTickets.filter(t => t.status === "open").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* لیست تیکت‌ها */}
      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => {
            const status = getStatusInfo(ticket.status);
            return (
              <div key={ticket.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* اطلاعات اصلی تیکت */}
                  <div className="flex items-start md:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <Ticket size={24} className="-rotate-45" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="text-white font-medium text-sm md:text-base group-hover:text-blue-400 transition-colors line-clamp-1">
                          {ticket.subject}
                        </h4>
                        <span className="text-xs text-zinc-500 font-sans tracking-wide">#{ticket.id}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                        <span>بخش: {ticket.department}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20"></span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={12} />
                          {ticket.messagesCount} پیام
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:block"></span>
                        <span className="hidden sm:block">آخرین بروزرسانی: {ticket.lastUpdate}</span>
                      </div>
                    </div>
                  </div>

                  {/* وضعیت و دکمه مشاهده */}
                  <div className="flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-t-0 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border ${status.border} ${status.bg} ${status.color} text-xs font-medium whitespace-nowrap`}>
                      <status.icon size={14} />
                      {status.text}
                    </span>
                    
                    <Link 
                      href={`/student/tickets/${ticket.id}`} 
                      className="flex items-center gap-1 w-9 h-9 justify-center rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 bg-white/[0.01] border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center">
            <Ticket size={48} className="text-zinc-700 mb-4 -rotate-45" />
            <h3 className="text-white font-medium mb-2">تیکتی یافت نشد</h3>
            <p className="text-zinc-500 text-sm">هیچ تیکتی با این مشخصات در سیستم وجود ندارد.</p>
          </div>
        )}
      </div>

    </div>
  );
}