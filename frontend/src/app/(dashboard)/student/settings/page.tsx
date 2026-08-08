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
        const res = await apiFetch("/auth/me", { cache: "no-store" });
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

    const uploadData = new FormData();
    uploadData.append("avatar", file);
    setIsUploading(true);
    
    try {
      const res = await axios.post("http://localhost:8000/v1/user/upload/avatar", uploadData, {
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

  if (isLoading) return <div className="flex justify-center py-40"><Loader2 className="w-10 h-10 text-blue-500 animate-spin" /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">تنظیمات پروفایل</h2>
        <p className="text-sm text-zinc-400">مدیریت اطلاعات حساب کاربری، امنیت و اعلان‌ها</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-3 flex flex-row lg:flex-col gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveTab("profile")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeTab === "profile" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white"}`}><User size={18} /> اطلاعات پروفایل</button>
            <button onClick={() => setActiveTab("security")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeTab === "security" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white"}`}><Lock size={18} /> امنیت و رمز عبور</button>
            <button onClick={() => setActiveTab("notifications")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeTab === "notifications" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white"}`}><Bell size={18} /> تنظیمات اعلان‌ها</button>
          </div>
        </div>

        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 shadow-lg">
          
          {activeTab === "profile" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">اطلاعات شخصی من</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden">
                    {isUploading ? <Loader2 className="animate-spin w-8 h-8 text-white" /> : formData.avatar ? <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" /> : (formData.name || formData.username).charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"><Camera size={24} className="text-white" /></button>
                </div>
                <div className="text-center sm:text-right">
                  <h4 className="text-white font-medium mb-1">تغییر تصویر پروفایل</h4>
                  <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white mt-2">انتخاب تصویر</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">نام کاربری (جهت نمایش)</label>
                  <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">ایمیل (غیرقابل تغییر)</label>
                  <div className="relative">
                    <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="email" value={formData.email} disabled className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pr-11 pl-4 text-zinc-500 cursor-not-allowed" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">شماره موبایل</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">سطح کاربری</label>
                  <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl py-3 px-4">
                    <GraduationCap size={18} />
                    <span className="text-sm font-medium">دانشجوی پلتفرم</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">تغییر رمز عبور</h3>
              <div className="max-w-md space-y-6">
                <div><label className="block text-sm font-medium text-zinc-400 mb-2">رمز عبور فعلی</label><input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500" dir="ltr" /></div>
                <div><label className="block text-sm font-medium text-zinc-400 mb-2">رمز عبور جدید</label><input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500" dir="ltr" /></div>
                <div><label className="block text-sm font-medium text-zinc-400 mb-2">تکرار رمز عبور جدید</label><input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500" dir="ltr" /></div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">تنظیمات اطلاع‌رسانی</h3>
              <div className="space-y-6">
                {[
                  { title: "پاسخ به تیکت‌ها", desc: "زمانی که مدرس یا پشتیبان به تیکت من پاسخ داد ایمیل دریافت کنم.", defaultChecked: true },
                  { title: "آپدیت دوره‌ها", desc: "هنگامی که جلسه جدیدی به دوره‌های خریداری شده من اضافه شد مطلع شوم.", defaultChecked: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <div><h4 className="text-white font-medium mb-1">{item.title}</h4><p className="text-xs text-zinc-500">{item.desc}</p></div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0"><input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} /><div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
            <button onClick={handleSaveChanges} disabled={isSaving} className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-lg disabled:opacity-50">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} ذخیره تغییرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}