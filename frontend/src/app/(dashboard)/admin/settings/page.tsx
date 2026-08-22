"use client";

import { useState, useEffect, useRef } from "react";
import { User, Lock, Bell, Save, Camera, ShieldCheck, Mail, Loader2 } from "lucide-react";
import { apiFetch } from "./../../../../utils/apiFetch"; 
import { toast } from "sonner"; 
import axios from "axios";

const getRoleFa = (role: string) => {
  if (!role) return "کاربر";
  switch (role.toLowerCase()) {
    case "admin": return "مدیر کل سیستم";
    case "instructor": return "مدرس دوره";
    default: return "کاربر عادی";
  }
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ id: "", username: "", email: "", phone: "", role: "", avatar: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiFetch("/auth/me", { cache: "no-store", headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" } });
        if (res.ok) {
          const data = await res.json();
          setFormData({
            id: data.id || data._id || "",
            username: data.username || data.name || "", 
            email: data.email || "", 
            phone: data.phone || "", 
            role: data.role || "User",
            avatar: data.avatar || "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("حجم عکس نباید بیشتر از ۲ مگابایت باشد");

    const uploadData = new FormData();
    uploadData.append("avatar", file);

    setIsUploading(true);
    try {
      const res = await axios.post("https://gitnest-backend-l3tu.onrender.com/v1/user/upload/avatar", uploadData, { withCredentials: true });
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, avatar: res.data.avatarUrl }));
        toast.success("آپلود شد");
      }
    } catch {
      toast.error("فرمت غیرمجاز");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (activeTab === "profile") {
      if (!formData.id) return;
      setIsSaving(true);
      try {
        const res = await apiFetch(`/user/${formData.id}`, {
          method: "PATCH",
          body: JSON.stringify({ username: formData.username, phone: formData.phone, avatar: formData.avatar }),
        });
        res.ok ? toast.success("بروزرسانی شد") : toast.error("خطا در بروزرسانی");
      } catch {
        toast.error("ارتباط قطع شد");
      } finally {
        setIsSaving(false);
      }
    } 
    else if (activeTab === "security") {
      if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) return toast.error("فیلدها را پر کنید");
      if (passwords.newPassword !== passwords.confirmPassword) return toast.error("رمزها تطابق ندارند");
      if (passwords.newPassword.length < 8) return toast.error("حداقل ۸ کاراکتر");

      setIsSaving(true);
      try {
        const res = await apiFetch(`/auth/changePassword`, {
          method: "POST",
          body: JSON.stringify({ password: passwords.currentPassword, newPassword: passwords.newPassword }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success("رمز عبور تغییر کرد");
          setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
          toast.error(data.message || "رمز فعلی اشتباه است");
        }
      } catch {
        toast.error("ارتباط قطع شد");
      } finally {
        setIsSaving(false);
      }
    }
    else {
      toast.success("ذخیره شد");
    }
  };

  if (isLoading) return <div className="flex flex-col items-center py-40"><Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" /><p className="text-sm text-zinc-400">بارگذاری...</p></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/jpeg, image/png, image/webp" className="hidden" />

      <div className="mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-1">تنظیمات حساب کاربری</h2>
        <p className="text-xs md:text-sm text-zinc-400">مدیریت اطلاعات شخصی و امنیت</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-2 md:p-3 flex flex-row lg:flex-col gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveTab("profile")} className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === "profile" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white"}`}><User size={16} className="md:w-[18px]" />اطلاعات پروفایل</button>
            <button onClick={() => setActiveTab("security")} className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === "security" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white"}`}><Lock size={16} className="md:w-[18px]" />امنیت و رمز</button>
            <button onClick={() => setActiveTab("notifications")} className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === "notifications" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white"}`}><Bell size={16} className="md:w-[18px]" />اعلان‌ها</button>
          </div>
        </div>

        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-lg">
          {activeTab === "profile" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-base md:text-lg font-bold text-white mb-5 md:mb-6 border-b border-white/5 pb-3 md:pb-4">اطلاعات شخصی</h3>

              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="relative group cursor-pointer w-20 h-20 md:w-24 md:h-24 shrink-0" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-2xl md:text-3xl font-bold text-white overflow-hidden">
                    {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : formData.avatar ? <img src={formData.avatar} className="w-full h-full object-cover" /> : formData.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <button type="button" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"><Camera size={20} className="text-white" /></button>
                </div>
                <div className="text-center sm:text-right">
                  <h4 className="text-white text-sm md:text-base font-medium mb-1">تغییر تصویر پروفایل</h4>
                  <p className="text-[10px] md:text-xs text-zinc-500 mb-2 md:mb-3">فرمت مجاز: JPG, PNG. حداکثر 2MB</p>
                  <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-[10px] md:text-xs text-white">
                    {isUploading ? "درحال آپلود..." : "انتخاب تصویر"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">نام کاربری</label>
                  <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 px-4 text-white text-xs md:text-sm focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">ایمیل (غیرقابل تغییر)</label>
                  <div className="relative">
                    <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 md:w-[18px]" />
                    <input type="text" value={formData.email} disabled className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 md:py-3 pr-10 pl-4 text-zinc-500 text-xs md:text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">شماره موبایل</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} dir="ltr" className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 px-4 text-white text-xs md:text-sm focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">سطح دسترسی</label>
                  <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl py-2.5 md:py-3 px-4">
                    <ShieldCheck size={16} className="md:w-[18px]" />
                    <span className="text-xs md:text-sm font-medium">{getRoleFa(formData.role)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-base md:text-lg font-bold text-white mb-5 md:mb-6 border-b border-white/5 pb-3 md:pb-4">تغییر رمز عبور</h3>
              <div className="max-w-md space-y-4 md:space-y-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">رمز عبور فعلی</label>
                  <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" dir="ltr" className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 px-4 text-white text-sm focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">رمز عبور جدید</label>
                  <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} placeholder="••••••••" dir="ltr" className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 px-4 text-white text-sm focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-zinc-400 mb-1.5 md:mb-2">تکرار رمز عبور جدید</label>
                  <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} placeholder="••••••••" dir="ltr" className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 px-4 text-white text-sm focus:border-blue-500" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-base md:text-lg font-bold text-white mb-5 md:mb-6 border-b border-white/5 pb-3 md:pb-4">تنظیمات اطلاع‌رسانی</h3>
              <div className="space-y-4 md:space-y-6">
                {[
                  { title: "ثبت‌نام کاربر جدید", desc: "ایمیل ثبت نام جدید", defaultChecked: true },
                  { title: "ارسال دوره جدید", desc: "ایمیل بررسی دوره", defaultChecked: true },
                  { title: "نظرات جدید", desc: "ایمیل تایید نظرات", defaultChecked: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.01] border border-white/5">
                    <div><h4 className="text-white text-sm md:text-base font-medium mb-1">{item.title}</h4><p className="text-[10px] md:text-xs text-zinc-500">{item.desc}</p></div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0"><input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} /><div className="w-9 h-5 md:w-11 md:h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 md:after:h-5 md:after:w-5 peer-checked:bg-blue-600 transition-all"></div></label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-white/5 flex justify-end">
            <button 
              onClick={handleSaveChanges} 
              disabled={isSaving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm md:text-base font-medium transition-all"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              ذخیره تغییرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}