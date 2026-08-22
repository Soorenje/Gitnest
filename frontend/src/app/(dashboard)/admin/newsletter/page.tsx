"use client";

import { useState, useEffect } from "react";
import { 
  Send, Save, Users, History, Mail, CheckCircle2, Bold, Italic, Link as LinkIcon, List, Image as ImageIcon, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "./../../../../utils/apiFetch";

interface NewsletterHistory {
  _id: string;
  subject: string;
  createdAt: string;
  recipientsCount: number;
  status: string;
}

export default function AdminNewsletterPage() {
  const [subject, setSubject] = useState("");
  const [audience, setAudience] = useState("all");
  const [content, setContent] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<NewsletterHistory[]>([]);

  const fetchHistory = async () => {
    try {
      const response = await apiFetch("/newsletter/history");
      if (response.ok) {
        const data = await response.json();
        setHistory(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("خطا در دریافت تاریخچه:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) return toast.error("لطفاً موضوع و محتوای ایمیل را وارد کنید.");

    setIsSending(true);
    try {
      const response = await apiFetch("/newsletter/send", {
        method: "POST",
        body: JSON.stringify({ subject, content, audience }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "خبرنامه ارسال شد!");
        setSubject(""); setContent(""); fetchHistory();
      } else {
        toast.error(data.message || "خطا در ارسال.");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!subject || !content) return toast.error("لطفاً موضوع و محتوای ایمیل را وارد کنید.");

    setIsSaving(true);
    try {
      const response = await apiFetch("/newsletter/draft", {
        method: "POST",
        body: JSON.stringify({ subject, content, audience }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "پیش‌نویس ذخیره شد!");
        fetchHistory(); 
      } else {
        toast.error(data.message || "خطا در ذخیره پیش‌نویس.");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">ارسال خبرنامه</h2>
        <p className="text-xs md:text-sm text-zinc-400">ارسال ایمیل گروهی به دانشجویان، مدرسین یا تمام اعضای سایت</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg">

            <form onSubmit={handleSend} className="space-y-5 md:space-y-6">

              {/* انتخاب گیرندگان */}
              <div>
                <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-zinc-300 mb-2.5 md:mb-3">
                  <Users size={16} className="text-blue-400 md:w-[18px] md:h-[18px]" /> گیرندگان ایمیل
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-3">
                  {[
                    { id: "all", title: "همه کاربران" },
                    { id: "students", title: "فقط دانشجویان" },
                    { id: "instructors", title: "فقط مدرسین" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setAudience(option.id)}
                      className={`px-3 md:px-4 py-2.5 md:py-3 rounded-xl border text-xs md:text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        audience === option.id ? "bg-blue-600/10 border-blue-500/50 text-blue-400" : "bg-white/[0.02] border-white/10 text-zinc-400 hover:bg-white/[0.05]"
                      }`}
                    >
                      {option.title}
                      {audience === option.id && <CheckCircle2 size={14} className="md:w-4 md:h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* موضوع ایمیل */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-zinc-300 mb-2.5 md:mb-3">موضوع ایمیل</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="مثال: تخفیف‌های ویژه..." 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 px-4 text-white text-xs md:text-sm focus:border-blue-500 transition-all"
                />
              </div>

              {/* ادیتور متن */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-zinc-300 mb-2.5 md:mb-3">محتوای ایمیل (HTML)</label>
                <div className="border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500 transition-all">
                  <div className="bg-white/[0.02] border-b border-white/10 px-2 md:px-4 py-1.5 md:py-2 flex flex-wrap items-center gap-1 overflow-x-auto scrollbar-hide">
                    <button type="button" className="p-1.5 md:p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"><Bold size={14} className="md:w-4 md:h-4" /></button>
                    <button type="button" className="p-1.5 md:p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"><Italic size={14} className="md:w-4 md:h-4" /></button>
                    <div className="w-px h-4 bg-white/10 mx-1"></div>
                    <button type="button" className="p-1.5 md:p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"><LinkIcon size={14} className="md:w-4 md:h-4" /></button>
                    <button type="button" className="p-1.5 md:p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"><ImageIcon size={14} className="md:w-4 md:h-4" /></button>
                    <div className="w-px h-4 bg-white/10 mx-1"></div>
                    <button type="button" className="p-1.5 md:p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"><List size={14} className="md:w-4 md:h-4" /></button>
                  </div>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    placeholder="متن خبرنامه را بنویسید..."
                    className="w-full bg-[#0a1024] p-3 md:p-4 text-white text-xs md:text-sm focus:outline-none resize-y min-h-[120px] md:min-h-[150px]"
                  ></textarea>
                </div>
              </div>

              {/* دکمه‌های اکشن */}
              <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 pt-4 md:pt-5 border-t border-white/5">
                <button 
                  type="submit" 
                  disabled={isSending || isSaving}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 md:py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-xs md:text-sm transition-all shadow-lg"
                >
                  {isSending ? <Loader2 size={16} className="animate-spin md:w-[18px] md:h-[18px]" /> : <><Send size={16} className="rotate-45 md:w-[18px] md:h-[18px]" /> ارسال خبرنامه</>}
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveDraft}
                  disabled={isSending || isSaving}
                  className="w-full sm:w-auto px-6 py-3 md:py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs md:text-sm font-medium transition-all flex justify-center items-center gap-2"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin md:w-[18px] md:h-[18px]" /> : <><Save size={16} className="md:w-[18px] md:h-[18px]" /> پیش‌نویس</>}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* سایدبار: تاریخچه ارسال‌ها */}
        <div className="lg:col-span-1">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg h-full">
            <div className="flex items-center gap-2 text-white font-bold mb-5 md:mb-6">
              <History size={18} className="text-purple-400 md:w-5 md:h-5" />
              <h3 className="text-sm md:text-base">آخرین ارسال‌ها</h3>
            </div>

            <div className="space-y-3 md:space-y-4">
              {history.length === 0 ? (
                <p className="text-zinc-500 text-xs md:text-sm text-center py-4">هیچ تاریخچه‌ای وجود ندارد.</p>
              ) : (
                history.map((item) => (
                  <div key={item._id} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                    <h4 className="text-xs md:text-sm font-medium text-white mb-1.5 md:mb-2 line-clamp-1 group-hover:text-blue-400">
                      {item.subject}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] md:text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Mail size={10} className="md:w-3 md:h-3" />
                        {item.recipientsCount || 0} نفر
                      </span>
                      <span>{new Date(item.createdAt).toLocaleDateString('fa-IR')}</span>
                    </div>
                    <div className="mt-1.5 md:mt-2 text-[9px] md:text-[10px] uppercase font-bold tracking-wider">
                      {item.status === 'sent' && <span className="text-green-500">ارسال شده</span>}
                      {item.status === 'draft' && <span className="text-orange-500">پیش‌نویس</span>}
                      {item.status === 'pending' && <span className="text-blue-500">در حال ارسال</span>}
                      {item.status === 'failed' && <span className="text-red-500">خطا در ارسال</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}