"use client";

import { useState, useEffect, useRef } from "react";
import { 
  User, 
  Lock, 
  Bell, 
  Save, 
  Camera, 
  ShieldCheck,
  Mail,
  Loader2
} from "lucide-react";
import { apiFetch } from "./../../../../utils/apiFetch"; 
import { toast } from "sonner"; 
import axios from "axios";

const getRoleFa = (role: string) => {
  if (!role) return "کاربر";
  switch (role.toLowerCase()) {
    case "admin":
      return "مدیر کل سیستم";
    case "instructor":
      return "مدرس دوره";
    case "user":
      return "کاربر عادی";
    default:
      return "کاربر";
  }
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // استیت پروفایل
  const [formData, setFormData] = useState({
    id: "",
    username: "", 
    email: "", 
    phone: "",
    role: "",
    avatar: "",
  });

  // 💡 استیت پسوردها
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await apiFetch("/auth/me", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          }
        });
        
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
        toast.error("خطا در بارگذاری اطلاعات کاربری");
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

    if (file.size > 2 * 1024 * 1024) {
      toast.error("حجم عکس نباید بیشتر از ۲ مگابایت باشد");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("avatar", file);

    setIsUploading(true);
    try {
      const res = await axios.post("http://localhost:8000/v1/user/upload/avatar", uploadData, {
        withCredentials: true,
      });

      if (res.data.success) {
        setFormData((prev) => ({ ...prev, avatar: res.data.avatarUrl }));
        toast.success("تصویر پروفایل با موفقیت آپلود شد");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("فرمت فایل انتخاب شده مجاز نیست (فقط JPG، PNG و WEBP)");
    } finally {
      setIsUploading(false);
    }
  };

  // 💡 تابع اصلی ذخیره سازی (هوشمند بر اساس تب فعال)
  const handleSaveChanges = async () => {
    if (activeTab === "profile") {
      if (!formData.id) return;
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

        if (res.ok) {
          toast.success("اطلاعات حساب کاربری با موفقیت بروزرسانی شد");
        } else {
          toast.error("خطا در بروزرسانی اطلاعات فرم");
        }
      } catch (error) {
        toast.error("مشکل در برقراری ارتباط با سرور");
      } finally {
        setIsSaving(false);
      }
    } 
    // 💡 بخش مربوط به تغییر پسورد
    else if (activeTab === "security") {
      if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
        return toast.error("لطفاً تمامی فیلدهای رمز عبور را پر کنید");
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
        return toast.error("رمز عبور جدید با تکرار آن مطابقت ندارد");
      }
      if (passwords.newPassword.length < 8) {
        return toast.error("رمز عبور جدید باید حداقل ۸ کاراکتر باشد");
      }

      setIsSaving(true);
      try {
        const res = await apiFetch(`/auth/changePassword`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: passwords.currentPassword,
            newPassword: passwords.newPassword,
          }),
        });

        const data = await res.json();
        
        if (res.ok && data.success) {
          toast.success("رمز عبور شما با موفقیت تغییر کرد");
          setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
          toast.error(data.message || "رمز عبور فعلی اشتباه است");
        }
      } catch (error) {
        toast.error("مشکل در برقراری ارتباط با سرور");
      } finally {
        setIsSaving(false);
      }
    }
    else {
      toast.success("تنظیمات با موفقیت ذخیره شد");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-zinc-400">در حال بارگذاری اطلاعات...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarChange} 
        accept="image/jpeg, image/png, image/webp" 
        className="hidden" 
      />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">تنظیمات حساب کاربری</h2>
        <p className="text-sm text-zinc-400">مدیریت اطلاعات شخصی، امنیت و اعلان‌های سیستم</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-3 flex flex-row lg:flex-col gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveTab("profile")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === "profile" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}><User size={18} />اطلاعات پروفایل</button>
            <button onClick={() => setActiveTab("security")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === "security" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}><Lock size={18} />امنیت و رمز عبور</button>
            <button onClick={() => setActiveTab("notifications")} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === "notifications" ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}><Bell size={18} />تنظیمات اعلان‌ها</button>
          </div>
        </div>

        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 shadow-lg">
          
          {activeTab === "profile" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">اطلاعات شخصی</h3>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden relative">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      formData.username ? formData.username.charAt(0).toUpperCase() : "U"
                    )}
                  </div>
                  <button type="button" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl backdrop-blur-sm">
                    <Camera size={24} className="text-white" />
                  </button>
                </div>
                <div className="text-center sm:text-right">
                  <h4 className="text-white font-medium mb-1">تغییر تصویر پروفایل</h4>
                  <p className="text-xs text-zinc-500 mb-3">فرمت‌های مجاز: JPG, PNG, WEBP. حداکثر حجم: 2MB</p>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white font-medium transition-colors disabled:opacity-50"
                  >
                    {isUploading ? "در حال آپلود..." : "انتخاب تصویر"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">نام کاربری</label>
                  <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">ایمیل (غیرقابل تغییر)</label>
                  <div className="relative">
                    <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="text" value={formData.email} disabled className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pr-11 pl-4 text-zinc-500 cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">شماره موبایل</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">سطح دسترسی</label>
                  <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl py-3 px-4">
                    <ShieldCheck size={18} />
                    <span className="text-sm font-medium">{getRoleFa(formData.role)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 💡 بخش تغییر رمز عبور متصل به استیت */}
          {activeTab === "security" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">تغییر رمز عبور</h3>
              <div className="max-w-md space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">رمز عبور فعلی</label>
                  <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">رمز عبور جدید</label>
                  <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} placeholder="••••••••" className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors" dir="ltr" />
                  <p className="text-xs text-zinc-500 mt-2">حداقل ۸ کاراکتر.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">تکرار رمز عبور جدید</label>
                  <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} placeholder="••••••••" className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors" dir="ltr" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-4">تنظیمات اطلاع‌رسانی</h3>
              <div className="space-y-6">
                {/* 💡 آیتم گزارش مالی از اینجا حذف شد */}
                {[
                  { title: "ثبت‌نام کاربر جدید", desc: "هنگامی که یک کاربر جدید در سایت ثبت‌نام می‌کند ایمیل دریافت کنم.", defaultChecked: true },
                  { title: "ارسال دوره جدید", desc: "هنگامی که مدرسین دوره جدیدی برای بررسی ارسال می‌کنند مطلع شوم.", defaultChecked: true },
                  { title: "نظرات جدید", desc: "ارسال ایمیل برای نظراتی که نیاز به بررسی و تایید دارند.", defaultChecked: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-colors">
                    <div><h4 className="text-white font-medium mb-1">{item.title}</h4><p className="text-xs text-zinc-500">{item.desc}</p></div>
                    <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" value="" className="sr-only peer" defaultChecked={item.defaultChecked} /><div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
            <button 
              onClick={handleSaveChanges} 
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium transition-all shadow-lg shadow-blue-500/25"
            >
              {isSaving ? (
                <><Loader2 size={18} className="animate-spin" />در حال پردازش...</>
              ) : (
                <><Save size={18} />ذخیره تغییرات</>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}