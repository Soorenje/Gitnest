"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  MoreVertical, 
  Shield, 
  User as UserIcon, 
  GraduationCap, 
  Ban, 
  CheckCircle2, 
  Edit, 
  Trash2,
  Filter,
  X,
  ChevronDown,
  AlertTriangle,
  UserCog
} from "lucide-react";
import { apiFetch } from "../../../../utils/apiFetch";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // 💡 متغیر آیدی کاربر لاگین‌شده (آن را با استیتِ احراز هویت خودت متصل کن)
  const currentLoggedUserId = "آیدی_شما_از_بک‌اند"; 

  // استیت‌های مودالِ فرم (افزودن و ویرایش)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // استیت‌های دراپ‌داون فرم افزودن
  const [selectedRole, setSelectedRole] = useState("User");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // استیت‌های مودال تاییدیه (حذف و تغییر نقش)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "delete" | "changeRole" | null;
    userId: string | null;
    userName: string;
  }>({ isOpen: false, type: null, userId: null, userName: "" });
  
  const [confirmText, setConfirmText] = useState("");
  
  // استیت‌های دراپ‌داون کاستوم در مودال تغییر نقش
  const [newRoleForChange, setNewRoleForChange] = useState("User");
  const [isChangeRoleDropdownOpen, setIsChangeRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch(`/user/admin/users?role=${roleFilter}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("خطا در دریافت لیست کاربران:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [roleFilter, refreshKey]);

  const filteredUsers = users.filter((user) => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "Admin": return { text: "مدیر کل", icon: Shield, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
      case "Instructor": return { text: "مدرس", icon: UserIcon, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" };
      case "User":
      case "Student": return { text: "کاربر عادی", icon: GraduationCap, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" };
      default: return { text: "نامشخص", icon: UserIcon, color: "text-zinc-400", bg: "bg-white/5", border: "border-white/10" };
    }
  };

  const formatToShamsi = (dateString: string) => {
    if (!dateString) return "نامشخص";
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  const openAddModal = () => {
    setFormMode("add");
    setEditingUser(null);
    setSelectedRole("User");
    setApiMessage(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setFormMode("edit");
    setEditingUser(user);
    setApiMessage(null);
    setOpenMenuId(null);
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const url = formMode === "add" ? "/user/admin/users" : `/user/admin/users/${editingUser._id || editingUser.id}`;
    const method = formMode === "add" ? "POST" : "PATCH";

    try {
      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        setApiMessage({ text: formMode === "add" ? "کاربر با موفقیت اضافه شد." : "اطلاعات با موفقیت بروز شد.", type: "success" });
        setTimeout(() => {
          setIsFormModalOpen(false);
          setRefreshKey(prev => prev + 1); 
        }, 1500);
      } else {
        setApiMessage({ text: result.message || "خطایی رخ داد.", type: "error" });
      }
    } catch (error) {
      setApiMessage({ text: "خطا در ارتباط با سرور.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = async () => {
    if (confirmText !== "CONFIRM" || !confirmModal.userId) return;
    setIsSubmitting(true);
    
    try {
      if (confirmModal.type === "delete") {
        const res = await apiFetch(`/user/admin/users/${confirmModal.userId}`, { method: "DELETE" });
        if (res.ok) {
          setConfirmModal({ isOpen: false, type: null, userId: null, userName: "" });
          setConfirmText("");
          setRefreshKey(prev => prev + 1);
        }
      } else if (confirmModal.type === "changeRole") {
        const res = await apiFetch(`/user/admin/users/${confirmModal.userId}/role?role=${newRoleForChange}`, { method: "PATCH" });
        if (res.ok) {
          setConfirmModal({ isOpen: false, type: null, userId: null, userName: "" });
          setConfirmText("");
          setRefreshKey(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error("Action failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      
      {/* هدر صفحه */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">مدیریت کاربران</h2>
          <p className="text-sm text-zinc-400">مشاهده و مدیریت تمام اعضای سایت (دانشجویان و مدرسین)</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="جستجو (نام یا ایمیل)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:bg-white/[0.05] transition-all text-sm"
            />
          </div>

          <button 
            onClick={openAddModal} 
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
          >
            + افزودن کاربر
          </button>
        </div>
      </div>

      {/* فیلتر نقش‌ها */}
      <div className="flex items-center gap-2 mb-6 bg-white/[0.02] border border-white/5 p-1 rounded-xl w-max overflow-x-auto max-w-full scrollbar-hide">
        <div className="px-3 text-zinc-500 flex items-center gap-2 border-l border-white/10">
          <Filter size={16} />
        </div>
        {[
          { id: "all", title: "همه کاربران" },
          { id: "User", title: "دانشجویان" },
          { id: "Instructor", title: "مدرسین" },
          { id: "Admin", title: "مدیران" },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setRoleFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              roleFilter === tab.id ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* جدول کاربران */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden shadow-lg shadow-black/20 min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-zinc-400 gap-3">
             <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
             <span>در حال دریافت اطلاعات...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-400 text-xs font-medium uppercase tracking-wider">
                  <th className="p-5 w-16 text-center">آواتار</th>
                  <th className="p-5">کاربر</th>
                  <th className="p-5">نقش</th>
                  <th className="p-5">وضعیت</th>
                  <th className="p-5">تاریخ عضویت</th>
                  <th className="p-5 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const role = getRoleInfo(user.role);
                    const userId = user._id || user.id; 
                    
                    // 💡 تشخیص کاربر لاگین‌شده (سورن جمیلی) بر اساس آیدی یا نام
                    const isCurrentUser = userId === currentLoggedUserId || user.name?.includes("سورن");
                    
                    return (
                      <tr 
                        key={userId} 
                        // استایل اختصاصی و متمایز برای ردیف حساب کاربری شما
                        className={`transition-colors group ${
                          isCurrentUser 
                            ? "bg-blue-500/5 border-r-2 border-blue-500" 
                            : "hover:bg-white/[0.02]"
                        }`}
                      >
                        
                        <td className="p-5 text-center">
                          <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold text-lg border overflow-hidden ${role.border} ${role.bg} ${role.color}`}>
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user.name ? user.name.charAt(0) : "?"
                            )}
                          </div>
                        </td>
                        
                        <td className="p-5">
                          <div className="flex flex-col">
                            <div className={`font-bold mb-0.5 ${isCurrentUser ? "text-blue-400" : "text-white"}`}>
                              {user.name || "کاربر ناشناس"}
                            </div>
                            <div className="text-xs text-zinc-500 font-sans tracking-wide">{user.email}</div>
                          </div>
                        </td>

                        <td className="p-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border ${role.border} ${role.bg} ${role.color} text-xs font-medium`}>
                            <role.icon size={14} />
                            {role.text}
                          </span>
                        </td>

                        <td className="p-5">
                          {user.ban !== true ? (
                            <span className="inline-flex items-center gap-1.5 text-green-400 text-xs font-medium">
                              <CheckCircle2 size={14} /> فعال
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-medium">
                              <Ban size={14} /> مسدود شده
                            </span>
                          )}
                        </td>

                        <td className="p-5 text-zinc-400">
                          {formatToShamsi(user.createdAt)}
                        </td>

                        <td className="p-5 text-left relative">
                          {/* 💡 اگر ردیف متعلق به خود کاربر باشد، منوی ۳ نقطه حذف و فقط یک لیبل زیبا نشان داده می‌شود */}
                          {isCurrentUser ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-medium whitespace-nowrap">
                              <Shield size={14} />
                              حساب شما
                            </span>
                          ) : (
                            <>
                              <button 
                                onClick={() => setOpenMenuId(openMenuId === userId ? null : userId)}
                                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                              >
                                <MoreVertical size={18} />
                              </button>

                              {openMenuId === userId && (
                                <div className="absolute left-8 top-10 mt-1 w-44 bg-[#0a1024] border border-white/10 rounded-2xl p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-20 animate-in fade-in zoom-in-95 duration-100">
                                  <button onClick={() => openEditModal(user)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                                    <Edit size={14} /> ویرایش اطلاعات
                                  </button>
                                  
                                  <button 
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setConfirmText("");
                                      setNewRoleForChange(user.role || "User");
                                      setConfirmModal({ isOpen: true, type: "changeRole", userId, userName: user.name });
                                    }} 
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors mt-1"
                                  >
                                    <UserCog size={14} /> تغییر نقش کاربری
                                  </button>
                                  
                                  <button 
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setConfirmText("");
                                      setConfirmModal({ isOpen: true, type: "delete", userId, userName: user.name });
                                    }} 
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1 border-t border-white/5 pt-3"
                                  >
                                    <Trash2 size={14} /> حذف دائمی کاربر
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-10 text-center">
                      <div className="flex flex-col items-center justify-center text-zinc-500">
                        <Search size={32} className="mb-3 opacity-50" />
                        <p>کاربری با این مشخصات یافت نشد.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* پاپ‌آپ افزودن / ویرایش کاربر */}
      {/* ------------------------------------------------ */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white">
                {formMode === "add" ? "افزودن کاربر جدید" : "ویرایش اطلاعات کاربر"}
              </h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 flex flex-col gap-4">
              
              {apiMessage && (
                <div className={`p-3 rounded-xl text-sm text-center border ${apiMessage.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                  {apiMessage.text}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">نام و نام خانوادگی</label>
                  <input required name="name" defaultValue={editingUser?.name || ""} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">نام کاربری</label>
                  <input required name="username" defaultValue={editingUser?.username || ""} type="text" dir="ltr" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>

              {formMode === "add" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">شماره موبایل</label>
                      <input required name="phone" type="tel" dir="ltr" placeholder="09..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    
                    <div className="relative">
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">نقش کاربری</label>
                      <input type="hidden" name="role" value={selectedRole} />
                      <button type="button" onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)} className="w-full bg-[#0f1631] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors flex justify-between items-center">
                        <span>{selectedRole === "Admin" ? "مدیر کل" : selectedRole === "Instructor" ? "مدرس" : "کاربر عادی"}</span>
                        <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-200 ${isRoleDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isRoleDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsRoleDropdownOpen(false)}></div>
                          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f1631] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                            {[{ value: "User", label: "کاربر عادی" }, { value: "Instructor", label: "مدرس" }, { value: "Admin", label: "مدیر کل" }].map((role) => (
                              <div key={role.value} onClick={() => { setSelectedRole(role.value); setIsRoleDropdownOpen(false); }} className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center gap-2 ${selectedRole === role.value ? "bg-blue-600/20 text-blue-400" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${selectedRole === role.value ? "bg-blue-500" : "bg-transparent"}`}></div>
                                {role.label}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">ایمیل</label>
                      <input required name="email" type="email" dir="ltr" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">رمز عبور</label>
                      <input required name="password" type="password" dir="ltr" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  </div>
                </>
              )}

              <div className="mt-4 flex gap-3">
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all flex justify-center items-center">
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (formMode === "add" ? "ثبت کاربر" : "ذخیره تغییرات")}
                </button>
                <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-5 py-3 rounded-xl bg-white/5 text-zinc-300 text-sm font-medium hover:bg-white/10 transition-colors">
                  انصراف
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* پاپ‌آپ تاییدیه (حذف و تغییر نقش) */}
      {/* ------------------------------------------------ */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${confirmModal.type === "delete" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>
              {confirmModal.type === "delete" ? <AlertTriangle size={28} /> : <UserCog size={28} />}
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              {confirmModal.type === "delete" ? "حذف دائمی کاربر" : "تغییر نقش کاربری"}
            </h3>
            
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              {confirmModal.type === "delete" ? (
                <>آیا از حذف کامل کاربر <span className="text-white font-bold">{confirmModal.userName}</span> مطمئن هستید؟ این عملیات غیرقابل بازگشت است.</>
              ) : (
                <>شما در حال تغییر نقش <span className="text-white font-bold">{confirmModal.userName}</span> هستید. لطفاً نقش جدید را انتخاب کنید.</>
              )}
            </p>

            {confirmModal.type === "changeRole" && (
              <div className="w-full mb-6 text-right relative">
                <label className="block text-xs font-medium text-zinc-400 mb-2">نقش جدید:</label>
                <button 
                  type="button" 
                  onClick={() => setIsChangeRoleDropdownOpen(!isChangeRoleDropdownOpen)} 
                  className="w-full bg-[#0f1631] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors flex justify-between items-center"
                >
                  <span>{newRoleForChange === "Admin" ? "مدیر کل" : newRoleForChange === "Instructor" ? "مدرس" : "کاربر عادی"}</span>
                  <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-200 ${isChangeRoleDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                {isChangeRoleDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsChangeRoleDropdownOpen(false)}></div>
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f1631] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-right">
                      {[{ value: "User", label: "کاربر عادی" }, { value: "Instructor", label: "مدرس" }, { value: "Admin", label: "مدیر کل" }].map((role) => (
                        <div 
                          key={role.value} 
                          onClick={() => { setNewRoleForChange(role.value); setIsChangeRoleDropdownOpen(false); }} 
                          className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center gap-2 ${newRoleForChange === role.value ? "bg-blue-600/20 text-blue-400" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${newRoleForChange === role.value ? "bg-blue-500" : "bg-transparent"}`}></div>
                          {role.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="w-full bg-white/5 border border-white/10 p-4 rounded-xl mb-6">
              <label className="block text-xs font-medium text-zinc-400 mb-2">برای تایید، کلمه <span className="text-white font-bold tracking-widest">CONFIRM</span> را تایپ کنید:</label>
              <input 
                type="text" 
                dir="ltr"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="CONFIRM"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white text-center tracking-widest text-sm focus:outline-none focus:border-blue-500 transition-colors" 
              />
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={handleConfirmAction}
                disabled={confirmText !== "CONFIRM" || isSubmitting}
                className={`flex-1 py-3 rounded-xl text-white text-sm font-medium transition-all flex justify-center items-center ${
                  confirmText !== "CONFIRM" 
                    ? "bg-white/5 text-zinc-500 cursor-not-allowed" 
                    : (confirmModal.type === "delete" ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/25")
                }`}
              >
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "تایید عملیات"}
              </button>
              <button 
                onClick={() => { setConfirmModal({ isOpen: false, type: null, userId: null, userName: "" }); setConfirmText(""); }}
                className="px-5 py-3 rounded-xl bg-transparent border border-white/10 text-zinc-300 text-sm font-medium hover:bg-white/5 transition-colors"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}