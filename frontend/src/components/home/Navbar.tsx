"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { apiFetch } from "../../utils/apiFetch"; 

interface UserType {
  name: string;
  username: string;
  role: string;
  avatar?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  // 💡 بخش مقالات حذف شد و "آزمون‌ها" اضافه شد
  const navItems = [
    { title: "خانه", href: "/" },
    { title: "دوره‌ها", href: "/courses" },
    { title: "آزمون‌ها", href: "/exams" }, // <-- اضافه شدن لینک آزمون‌ها
    { title: "درباره ما", href: "/about" },
    { title: "تماس با ما", href: "/contact" },
  ];

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await apiFetch("/auth/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.data || data);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    checkUserAuth();
  }, []);

  const handleLogout = async () => {
    try {
      setShowDropdown(false);
      setIsOpen(false);
      
      const response = await apiFetch("/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        setUser(null);
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getDashboardRoute = (role: string) => {
    if (role === 'Admin') return '/admin';
    if (role === 'Instructor') return '/instructor';
    return '/student';
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 md:pt-6">
        
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#070b1a]/30 backdrop-blur-xl px-6 md:px-8 py-4 shadow-lg shadow-black/20">
          
          <div className="flex items-center gap-8 lg:gap-12">
            <Link href="/" className="flex items-center">
              <span className="text-2xl md:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 hover:scale-105 inline-block">
                Gitnest
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative py-1 text-sm font-medium transition-colors group ${isActive ? "text-blue-400" : "text-zinc-300 hover:text-white"}`}
                  >
                    {item.title}
                    <span className={`absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 origin-right ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4 md:gap-5">
            <Link href="/cart" className="text-white hover:text-blue-400 transition relative p-1 md:p-2">
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-lg shadow-blue-500/50">0</span>
            </Link>

            <div className="hidden sm:block relative">
              {isLoadingAuth ? (
                <div className="w-9 h-9 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold hover:bg-blue-600/30 transition-colors focus:outline-none overflow-hidden"
                  >
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : (user.name || user.username)?.charAt(0).toUpperCase()}
                  </button>

                  {showDropdown && (
                    <div className="absolute left-0 top-full mt-3 w-48 bg-[#0f1631]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-xl z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-2 border-b border-white/5 mb-1 text-zinc-400 text-xs text-right">
                        {user.name || user.username} عزیز، خوش آمدید
                      </div>
                      
                      <Link 
                        href={getDashboardRoute(user.role)}
                        className="flex items-center justify-end gap-2 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <span>پنل کاربری</span>
                        <LayoutDashboard size={16} />
                      </Link>

                      <button 
                        onClick={handleLogout}
                        className="flex items-center justify-end gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors w-full"
                      >
                        <span>خروج از حساب</span>
                        <LogOut size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                  ورود / ثبت‌نام
                </Link>
              )}
            </div>

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-zinc-300 hover:text-white p-1 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 rounded-2xl border border-white/10 bg-[#070b1a]/95 backdrop-blur-xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            {!isLoadingAuth && user && (
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : (user.name || user.username)?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-white text-sm font-medium">{user.name || user.username}</span>
                    <span className="text-zinc-400 text-xs">{user.role}</span>
                  </div>
                </div>
                <Link 
                  href={getDashboardRoute(user.role)}
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-white/5 rounded-lg text-blue-400 hover:bg-white/10"
                >
                  <LayoutDashboard size={18} />
                </Link>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium text-right transition-colors ${isActive ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "text-zinc-300 hover:text-white hover:bg-white/5"}`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-2 pt-4 border-t border-white/10 sm:hidden">
              {!isLoadingAuth && user ? (
                <button 
                  onClick={handleLogout}
                  className="flex justify-center items-center gap-2 w-full px-5 py-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-bold shadow-lg hover:bg-red-500/20 transition-colors"
                >
                  <LogOut size={18} />
                  خروج از حساب
                </button>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-blue-500/25"
                >
                  ورود / ثبت‌نام
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}