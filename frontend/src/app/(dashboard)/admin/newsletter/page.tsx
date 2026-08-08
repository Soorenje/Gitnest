"use client";

import { useState, useEffect } from "react";
import { 
  Send, 
  Save, 
  Users, 
  History, 
  Mail, 
  CheckCircle2, 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  List, 
  Image as ImageIcon 
} from "lucide-react";
import { toast } from "sonner"; // 💡 اضافه شدن سونر
import { apiFetch } from "./../../../../utils/apiFetch"; // مسیر را بر اساس پروژه خودت تنظیم کن

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

    if (!subject || !content) {
      toast.error("لطفاً موضوع و محتوای ایمیل را وارد کنید.");
      return;
    }
    
    setIsSending(true);
    try {
      const response = await apiFetch("/newsletter/send", {
        method: "POST",
        body: JSON.stringify({ subject, content, audience }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || "خبرنامه با موفقیت ارسال شد!");
        setSubject("");
        setContent("");
        fetchHistory();
      } else {
        toast.error(data.message || "خطایی در ارسال رخ داد.");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور. لطفاً اینترنت خود را بررسی کنید.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!subject || !content) {
      toast.error("لطفاً موضوع و محتوای ایمیل را وارد کنید.");
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await apiFetch("/newsletter/draft", {
        method: "POST",
        body: JSON.stringify({ subject, content, audience }),
      });
      
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "پیش‌نویس با موفقیت ذخیره شد!");
        fetchHistory(); 
      } else {
        toast.error(data.message || "خطا در ذخیره پیش‌نویس.");
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور. لطفاً اینترنت خود را بررسی کنید.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* هدر صفحه */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">ارسال خبرنامه</h2>
        <p className="text-sm text-zinc-400">ارسال ایمیل گروهی به دانشجویان، مدرسین یا تمام اعضای سایت</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* فرم ارسال خبرنامه */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg">
            
            <form onSubmit={handleSend} className="space-y-6">
              
              {/* انتخاب گیرندگان */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-3">
                  <Users size={16} className="text-blue-400" />
                  گیرندگان ایمیل
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "all", title: "همه کاربران" },
                    { id: "students", title: "فقط دانشجویان" },
                    { id: "instructors", title: "فقط مدرسین" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setAudience(option.id)}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        audience === option.id 
                          ? "bg-blue-600/10 border-blue-500/50 text-blue-400" 
                          : "bg-white/[0.02] border-white/10 text-zinc-400 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      {option.title}
                      {audience === option.id && <CheckCircle2 size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* موضوع ایمیل */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  موضوع ایمیل
                </label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="مثال: تخفیف‌های ویژه آخر هفته..." 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all"
                />
              </div>

              {/* ادیتور متن */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  محتوای ایمیل (HTML)
                </label>
                <div className="border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  <div className="bg-white/[0.02] border-b border-white/10 px-4 py-2 flex flex-wrap items-center gap-1">
                    <button type="button" className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Bold size={16} /></button>
                    <button type="button" className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Italic size={16} /></button>
                    <div className="w-px h-5 bg-white/10 mx-1"></div>
                    <button type="button" className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><LinkIcon size={16} /></button>
                    <button type="button" className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><ImageIcon size={16} /></button>
                    <div className="w-px h-5 bg-white/10 mx-1"></div>
                    <button type="button" className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><List size={16} /></button>
                  </div>
                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    placeholder="متن خبرنامه خود را اینجا بنویسید (پشتیبانی از تگ‌های HTML)..."
                    className="w-full bg-[#0a1024] p-4 text-white placeholder-zinc-500 focus:outline-none resize-y min-h-[150px] text-sm leading-relaxed"
                  ></textarea>
                </div>
              </div>

              {/* دکمه‌های اکشن */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/5">
                <button 
                  type="submit" 
                  disabled={isSending || isSaving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send size={18} className="rotate-45 -mt-1" />
                      ارسال خبرنامه
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveDraft}
                  disabled={isSending || isSaving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save size={18} />
                      ذخیره پیش‌نویس
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* سایدبار: تاریخچه ارسال‌ها */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center gap-2 text-white font-bold mb-6">
              <History size={20} className="text-purple-400" />
              <h3>آخرین ارسال‌ها</h3>
            </div>

            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-4">هیچ تاریخچه‌ای وجود ندارد.</p>
              ) : (
                history.map((item) => (
                  <div key={item._id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                    <h4 className="text-sm font-medium text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {item.subject}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <Mail size={12} />
                        {item.recipientsCount || 0} نفر
                      </span>
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                    {/* نمایش وضعیت */}
                    <div className="mt-2 text-[10px] uppercase font-bold tracking-wider">
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