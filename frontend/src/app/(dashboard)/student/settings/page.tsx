"use client";

import { useState, useEffect, useRef } from "react";
import { User, Lock, Bell, Save, Camera, GraduationCap, Mail, Loader2 } from "lucide-react";
import { apiFetch } from "./../../../../utils/apiFetch";
import { toast } from "sonner";
import axios from "axios";

export default function StudentSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiFetch("/auth/me", { cache: "no-store", headers: { "Cache-Control": "no-cache" } });
        if (res.ok) {
          const data = await res.json();
          const user = data.data || data;
          setFormData({
            id: user.id || user._id || "",
            name: user.name || "",
            username: user.username || "",
            email: user.email || "",
            phone: user.phone || "",
            avatar: user.avatar || "",
          });
        }
      } catch (error) {
        toast.error("خطا در بارگذاری اطلاعات");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("حجم عکس نباید بیشتر از ۲ مگابایت باشد");

    const uploadData = new FormData();
    uploadData.append("avatar", file);
    setIsUploading(true);
    
    try {
      // 💡 متصل شده به روت واقعی بک‌اند شما
      const res = await axios.post("https://gitnest-backend-l3tu.onrender.com/v1/user/upload/avatar", uploadData, {
        withCredentials: true,
      });
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, avatar: res.data.avatarUrl }));
        toast.success("تصویر پروفایل آپلود شد");
      }
    } catch (error) {
      toast.error("خطا در آپلود تصویر");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (activeTab === "profile") {
      setIsSaving(true);
      try {
        const res = await apiFetch(`/user/${formData.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            phone: formData.phone,
            avatar: formData.avatar,
          }),
        });
        if (res.ok) toast.success("اطلاعات حساب با موفقیت بروزرسانی شد");
        else toast.error("خطا در بروزرسانی اطلاعات");
      } catch (error) {
        toast.error("خطای ارتباط با سرور");
      } finally {
        setIsSaving(false);
      }
    } 
    else if (activeTab === "security") {
      if (!passwords.currentPassword || !passwords.newPassword) return toast.error("فیلدها را پر کنید");
      if (passwords.newPassword !== passwords.confirmPassword) return toast.error("تکرار رمز عبور مطابقت ندارد");
      if (passwords.newPassword.length < 8) return toast.error("رمز عبور جدید باید حداقل ۸ کاراکتر باشد");
      
      setIsSaving(true);
      try {
        const res = await apiFetch(`/auth/changePassword`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: passwords.currentPassword, newPassword: passwords.newPassword }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success("رمز عبور تغییر کرد");
          setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
          toast.error(data.message || "رمز عبور فعلی اشتباه است");
        }
      } catch (error) {
        toast.error("خطای ارتباط با سرور");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) return <div className="flex justify-center py-40"><Loader2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500 animate-spin" /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/jpeg, image/png, image/webp" className="hidden" />

      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">تنظیمات پروفایل</h2>
        <p className="text-xs md:text-sm text-zinc-400">مدیریت اطلاعات حساب کاربری، امنیت و اعلان‌ها</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-2 md:p-3 flex flex-row lg:flex-col gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveTab("profile")} className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === "profile" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white"}`}><User size={16} className="md:w-[18px]" /> اطلاعات پروفایل</button>
            <button onClick={() => setActiveTab("security")} className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === "security" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white"}`}><Lock size={16} className="md:w-[18px]" /> امنیت و رمز عبور</button>
            <button onClick={() => setActiveTab("notifications")} className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === "notifications" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white"}`}><Bell size={16} className="md:w-[18px]" /> تنظیمات اعلان‌ها</button>
          </div>
        </div>

        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-lg">
          
          {activeTab === "profile" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-base md:text-lg font-bold text-white mb-5 md:mb-6 border-b border-white/5 pb-3 md:pb-4">اطلاعات شخصی من</h3>
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-lg overflow-hidden">
                    {isUploading ? <Loader2 className="animate-spin w-6 h-6 md:w-8 md:h-8 text-white" /> : formData.avatar ? <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" /> : (formData.name || formData.username || "U").charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"><Camera size={20} className="text-white md:w-6 md:h-6" /></button>
                </div>
                <div className="text-center sm:text-right">
                  <h4 className="text-white font-medium mb-1 text-sm md:text-base">تغییر تصویر پروفایل</h4>
                  <p className="text-[10px] md:text-xs text-zinc-500 mb-2 md:mb-3">حداکثر حجم فایل مجاز 2 مگابایت است</p>
                  <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg md:rounded-xl text-[10px] md:text-xs text-white transition-colors">انتخاب تصویر</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">نام کاربری (جهت نمایش)</label>
                  <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 px-3 md:px-4 text-white text-xs md:text-sm focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">ایمیل (غیرقابل تغییر)</label>
                  <div className="relative">
                    <Mail size={16} className="absolute right-3.5 md:right-4 top-1/2 -translate-y-1/2 text-zinc-500 md:w-[18px]" />
                    <input type="email" value={formData.email} disabled className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 md:py-3 pr-10 md:pr-11 pl-4 text-zinc-500 text-xs md:text-sm cursor-not-allowed" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">شماره موبایل</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 px-3 md:px-4 text-white text-xs md:text-sm focus:border-blue-500 transition-colors" dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">سطح کاربری</label>
                  <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl py-2.5 md:py-3 px-3 md:px-4">
                    <GraduationCap size={16} className="md:w-[18px] md:h-[18px]" />
                    <span className="text-xs md:text-sm font-medium">دانشجوی پلتفرم</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-base md:text-lg font-bold text-white mb-5 md:mb-6 border-b border-white/5 pb-3 md:pb-4">تغییر رمز عبور</h3>
              <div className="max-w-md space-y-4 md:space-y-6">
                <div><label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">رمز عبور فعلی</label><input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 px-3 md:px-4 text-white text-sm focus:border-blue-500" dir="ltr" /></div>
                <div><label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">رمز عبور جدید</label><input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 px-3 md:px-4 text-white text-sm focus:border-blue-500" dir="ltr" /></div>
                <div><label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">تکرار رمز عبور جدید</label><input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 px-3 md:px-4 text-white text-sm focus:border-blue-500" dir="ltr" /></div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-base md:text-lg font-bold text-white mb-5 md:mb-6 border-b border-white/5 pb-3 md:pb-4">تنظیمات اطلاع‌رسانی</h3>
              <div className="space-y-4 md:space-y-6">
                {[
                  { title: "پاسخ به تیکت‌ها", desc: "زمانی که مدرس یا پشتیبان به تیکت من پاسخ داد ایمیل دریافت کنم.", defaultChecked: true },
                  { title: "آپدیت دوره‌ها", desc: "هنگامی که جلسه جدیدی به دوره‌های من اضافه شد مطلع شوم.", defaultChecked: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.01] border border-white/5">
                    <div><h4 className="text-white font-medium mb-1 text-sm md:text-base">{item.title}</h4><p className="text-[10px] md:text-xs text-zinc-500">{item.desc}</p></div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0"><input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} /><div className="w-9 h-5 md:w-11 md:h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 peer-checked:bg-blue-600 transition-all"></div></label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-white/5 flex justify-end">
            <button onClick={handleSaveChanges} disabled={isSaving} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-base font-medium transition-all shadow-lg disabled:opacity-50">
              {isSaving ? <Loader2 size={16} className="animate-spin md:w-[18px] md:h-[18px]" /> : <Save size={16} className="md:w-[18px] md:h-[18px]" />} ذخیره تغییرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}