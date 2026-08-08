"use client";

import "../globals.css";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // 💡 useRouter اضافه شد
import { Vazirmatn } from "next/font/google";
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  PlaySquare, 
  Ticket,
  Percent,
  LucideIcon,
  Layers
} from "lucide-react";
import { Toaster, toast } from "sonner"; // 💡 toast اضافه شد

const vazir = Vazirmatn({ subsets: ["arabic"] });

type SidebarItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // 💡 تعریف روتر

  const adminLinks: SidebarItem[] = [
    { title: "پیشخوان", href: "/admin", icon: LayoutDashboard },
    { title: "مدیریت دوره‌ها", href: "/admin/courses", icon: BookOpen },
    { title: "مدیریت دسته‌بندی‌ها", href: "/admin/categories", icon: Layers },
    { title: "مدیریت کاربران", href: "/admin/users", icon: Users },
    { title: "مدیریت تخفیف‌ها", href: "/admin/discounts", icon: Percent },
    { title: "نظرات (تایید نشده)", href: "/admin/comments", icon: MessageSquare, badge: 3 },
    { title: "روزنامه", href: "/admin/newsletter", icon: Mail},
    { title: "تنظیمات حساب", href: "/admin/settings", icon: Settings },
  ];

  const studentLinks: SidebarItem[] = [
    { title: "پیشخوان من", href: "/student", icon: LayoutDashboard },
    { title: "دوره‌های خریداری شده", href: "/student/courses", icon: PlaySquare },
    //{ title: "تیکت‌های پشتیبانی", href: "/student/tickets", icon: Ticket },
    { title: "تنظیمات پروفایل", href: "/student/settings", icon: Settings },
  ];

  const instructorLinks: SidebarItem[] = [
    { title: "پیشخوان مدرس", href: "/instructor", icon: LayoutDashboard },
    { title: "دوره‌های من", href: "/instructor/courses", icon: BookOpen },
    { title: "دانشجویان من", href: "/instructor/users", icon: Users },
    //{ title: "تیکت‌های آموزشی", href: "/instructor/tickets", icon: MessageSquare, badge: 2 },
    //{ title: "کیف پول و تسویه", href: "/instructor/wallet", icon: Mail },
    { title: "تنظیمات حساب", href: "/instructor/settings", icon: Settings },
  ];

  const sidebarLinks = pathname.startsWith("/student") 
    ? studentLinks 
    : pathname.startsWith("/instructor")
    ? instructorLinks
    : adminLinks; 

  const userRole = pathname.startsWith("/student") 
    ? "دانشجو" 
    : pathname.startsWith("/instructor") 
    ? "مدرس دوره" 
    : "مدیر کل سیستم";

  // 💡 تابع خروج از حساب کاربری
  const handleLogout = () => {
    // پاک کردن کوکی یا توکن ذخیره شده در لوکال استوریج (اگر استفاده میکنید)
    localStorage.removeItem("token"); // در صورت استفاده از توکن
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // در صورت استفاده از کوکی
    
    toast.success("با موفقیت از سیستم خارج شدید");
    
    // هدایت کاربر به صفحه لاگین (یا صفحه اصلی)
    router.push("/login");
  };

  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.className} bg-[#070b1a] text-white`}>
        <div className="min-h-screen flex">
          
          <aside 
            className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#0a1024]/80 backdrop-blur-2xl border-l border-white/5 transform transition-transform duration-300 ease-in-out flex flex-col ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
              <Link href="/" className="text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Gitnest
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-zinc-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-hide">
              <div className="text-xs font-medium text-zinc-500 mb-4 px-2">منوی دسترسی</div>
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300 group ${
                      isActive 
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"} />
                      <span className="text-sm font-medium">{link.title}</span>
                    </div>
                    {link.badge && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-red-500/20 text-[10px] font-bold text-red-400 border border-red-500/20">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/5">
              {/* 💡 دکمه لاگ‌اوت با اتصال به تابع */}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
              >
                <LogOut size={18} />
                خروج از حساب
              </button>
            </div>
          </aside>

          <main className="flex-1 lg:pr-64 flex flex-col min-h-screen">
            <header className="h-20 bg-white/[0.01] border-b border-white/5 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden text-zinc-400 hover:text-white p-1"
                >
                  <Menu size={24} />
                </button>
                <h1 className="text-lg font-bold text-white hidden sm:block">پلتفرم آموزشی</h1>
              </div>

              <div className="flex items-center gap-4 md:gap-6">
                <button className="relative text-zinc-400 hover:text-white transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-500"></span>
                </button>
                <div className="h-8 w-px bg-white/10"></div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                    <div className="text-sm font-bold text-white">Soren-JE</div>
                    <div className="text-xs text-blue-400">{userRole}</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    S
                  </div>
                </div>
              </div>
            </header>

            <div className="p-4 md:p-8 flex-1">
              {children}
            </div>

          </main>

          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

        </div>

        <Toaster position="bottom-left" theme="dark" richColors />
      </body>
    </html>
  );
}