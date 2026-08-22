"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, Shield, User as UserIcon, GraduationCap, Ban, CheckCircle2, Edit, Trash2, Filter, X, ChevronDown, AlertTriangle, UserCog, Loader2 } from "lucide-react";
import { apiFetch } from "../../../../utils/apiFetch";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const currentLoggedUserId = "آیدی_شما_از_بک‌اند"; 

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingUser, setEditingUser] = useState<any>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedRole, setSelectedRole] = useState("User");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: "delete" | "changeRole" | null; userId: string | null; userName: string; }>({ isOpen: false, type: null, userId: null, userName: "" });
  const [confirmText, setConfirmText] = useState("");

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
        console.error("خطا:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [roleFilter, refreshKey]);

  const filteredUsers = users.filter(user => user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "Admin": return { text: "مدیر کل", icon: Shield, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
      case "Instructor": return { text: "مدرس", icon: UserIcon, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" };
      case "User": case "Student": return { text: "کاربر عادی", icon: GraduationCap, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" };
      default: return { text: "نامشخص", icon: UserIcon, color: "text-zinc-400", bg: "bg-white/5", border: "border-white/10" };
    }
  };

  const formatToShamsi = (dateString: string) => dateString ? new Date(dateString).toLocaleDateString("fa-IR") : "نامشخص";

  const openAddModal = () => { setFormMode("add"); setEditingUser(null); setSelectedRole("User"); setApiMessage(null); setIsFormModalOpen(true); };
  const openEditModal = (user: any) => { setFormMode("edit"); setEditingUser(user); setApiMessage(null); setOpenMenuId(null); setIsFormModalOpen(true); };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); setApiMessage(null);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const url = formMode === "add" ? "/user/admin/users" : `/user/admin/users/${editingUser._id || editingUser.id}`;
    const method = formMode === "add" ? "POST" : "PATCH";

    try {
      const response = await apiFetch(url, { method, body: JSON.stringify(data) });
      const result = await response.json();
      if (response.ok) {
        setApiMessage({ text: formMode === "add" ? "کاربر اضافه شد." : "اطلاعات بروز شد.", type: "success" });
        setTimeout(() => { setIsFormModalOpen(false); setRefreshKey(prev => prev + 1); }, 1000);
      } else {
        setApiMessage({ text: result.message || "خطا رخ داد.", type: "error" });
      }
    } catch {
      setApiMessage({ text: "ارتباط با سرور قطع شد.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = async () => {
    if (confirmText !== "CONFIRM" || !confirmModal.userId) return;
    setIsSubmitting(true);
    try {
      const endpoint = confirmModal.type === "delete" ? `/user/admin/users/${confirmModal.userId}` : `/user/admin/users/${confirmModal.userId}/role?role=${newRoleForChange}`;
      const method = confirmModal.type === "delete" ? "DELETE" : "PATCH";
      const res = await apiFetch(endpoint, { method });
      if (res.ok) {
        setConfirmModal({ isOpen: false, type: null, userId: null, userName: "" });
        setConfirmText(""); setRefreshKey(prev => prev + 1);
      }
    } catch {
      console.error("Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-1">مدیریت کاربران</h2>
          <p className="text-xs md:text-sm text-zinc-400">مشاهده و مدیریت تمام اعضای سایت</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input type="text" placeholder="جستجو (نام یا ایمیل)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 md:py-3 pr-10 pl-4 text-white text-sm focus:border-blue-500" />
          </div>
          <button onClick={openAddModal} className="w-full sm:w-auto px-5 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium whitespace-nowrap shadow-lg">
            + افزودن کاربر
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2 mb-6 bg-white/[0.02] border border-white/5 p-1 rounded-xl w-max overflow-x-auto max-w-full scrollbar-hide">
        <div className="px-2 md:px-3 text-zinc-500 flex items-center gap-2 border-l border-white/10"><Filter size={14} className="md:w-4 md:h-4" /></div>
        {[{ id: "all", title: "همه کاربران" }, { id: "User", title: "دانشجویان" }, { id: "Instructor", title: "مدرسین" }, { id: "Admin", title: "مدیران" }].map((tab) => (
          <button key={tab.id} onClick={() => setRoleFilter(tab.id)} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${roleFilter === tab.id ? "bg-white/10 text-white" : "text-zinc-400"}`}>
            {tab.title}
          </button>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-zinc-400 gap-3"><div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div><span className="text-sm">دریافت اطلاعات...</span></div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-right border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-zinc-400 text-[10px] md:text-xs uppercase">
                  <th className="p-4 md:p-5 w-16 text-center">آواتار</th>
                  <th className="p-4 md:p-5">کاربر</th>
                  <th className="p-4 md:p-5">نقش</th>
                  <th className="p-4 md:p-5">وضعیت</th>
                  <th className="p-4 md:p-5">تاریخ عضویت</th>
                  <th className="p-4 md:p-5 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs md:text-sm">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const role = getRoleInfo(user.role);
                    const userId = user._id || user.id; 
                    const isCurrentUser = userId === currentLoggedUserId || user.name?.includes("سورن");

                    return (
                      <tr key={userId} className={`transition-colors group ${isCurrentUser ? "bg-blue-500/5 border-r-2 border-blue-500" : "hover:bg-white/[0.02]"}`}>
                        <td className="p-4 md:p-5 text-center">
                          <div className={`w-8 h-8 md:w-10 md:h-10 mx-auto rounded-full flex items-center justify-center font-bold text-sm md:text-base border overflow-hidden ${role.border} ${role.bg} ${role.color}`}>
                            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name ? user.name.charAt(0) : "?"}
                          </div>
                        </td>
                        <td className="p-4 md:p-5">
                          <div className="flex flex-col">
                            <div className={`font-bold mb-0.5 text-xs md:text-sm ${isCurrentUser ? "text-blue-400" : "text-white"}`}>{user.name || "ناشناس"}</div>
                            <div className="text-[10px] md:text-xs text-zinc-500 dir-ltr text-right">{user.email}</div>
                          </div>
                        </td>
                        <td className="p-4 md:p-5">
                          <span className={`inline-flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 rounded-lg border ${role.border} ${role.bg} ${role.color} text-[10px] md:text-xs font-medium`}>
                            <role.icon size={12} className="md:w-3.5 md:h-3.5" />{role.text}
                          </span>
                        </td>
                        <td className="p-4 md:p-5">
                          {user.ban !== true ? (
                            <span className="inline-flex items-center gap-1 md:gap-1.5 text-green-400 text-[10px] md:text-xs font-medium"><CheckCircle2 size={12} className="md:w-3.5 md:h-3.5" /> فعال</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 md:gap-1.5 text-orange-400 text-[10px] md:text-xs font-medium"><Ban size={12} className="md:w-3.5 md:h-3.5" /> مسدود</span>
                          )}
                        </td>
                        <td className="p-4 md:p-5 text-zinc-400 text-[10px] md:text-xs whitespace-nowrap">{formatToShamsi(user.createdAt)}</td>
                        <td className="p-4 md:p-5 text-left relative">
                          {isCurrentUser ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[10px] md:text-xs font-medium whitespace-nowrap">
                              <Shield size={12} className="md:w-3.5 md:h-3.5" /> حساب شما
                            </span>
                          ) : (
                            <>
                              <button onClick={() => setOpenMenuId(openMenuId === userId ? null : userId)} className="p-1.5 md:p-2 rounded-lg md:rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                                <MoreVertical size={16} className="md:w-[18px] md:h-[18px]" />
                              </button>
                              {openMenuId === userId && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                                  <div className="absolute left-8 md:left-10 top-10 mt-1 w-40 md:w-44 bg-[#0a1024] border border-white/10 rounded-xl md:rounded-2xl p-2 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-100">
                                    <button onClick={() => openEditModal(user)} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg md:rounded-xl transition-colors">
                                      <Edit size={14} /> ویرایش
                                    </button>
                                    <button onClick={() => { setOpenMenuId(null); setConfirmText(""); setNewRoleForChange(user.role || "User"); setConfirmModal({ isOpen: true, type: "changeRole", userId, userName: user.name }); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-400 hover:bg-blue-500/10 rounded-lg md:rounded-xl transition-colors mt-1">
                                      <UserCog size={14} /> تغییر نقش
                                    </button>
                                    <button onClick={() => { setOpenMenuId(null); setConfirmText(""); setConfirmModal({ isOpen: true, type: "delete", userId, userName: user.name }); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg md:rounded-xl transition-colors mt-1 border-t border-white/5 pt-2 md:pt-3">
                                      <Trash2 size={14} /> حذف 
                                    </button>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={6} className="p-8 md:p-10 text-center"><div className="flex flex-col items-center justify-center text-zinc-500"><Search size={28} className="mb-2 md:mb-3 opacity-50" /><p className="text-xs md:text-sm">یافت نشد.</p></div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a1024] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5 bg-white/[0.02]">
              <h3 className="text-base md:text-lg font-bold text-white">{formMode === "add" ? "کاربر جدید" : "ویرایش"}</h3>
              <button onClick={() => setIsFormModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmitForm} className="p-5 md:p-6 flex flex-col gap-4">
              {apiMessage && <div className={`p-3 rounded-xl text-xs md:text-sm text-center border ${apiMessage.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>{apiMessage.text}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-[10px] md:text-xs font-medium text-zinc-400 mb-1.5">نام</label><input required name="name" defaultValue={editingUser?.name || ""} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 text-white text-xs md:text-sm focus:border-blue-500" /></div>
                <div><label className="block text-[10px] md:text-xs font-medium text-zinc-400 mb-1.5">نام کاربری</label><input required name="username" defaultValue={editingUser?.username || ""} type="text" dir="ltr" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 text-white text-xs md:text-sm focus:border-blue-500" /></div>
              </div>
              {formMode === "add" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-[10px] md:text-xs font-medium text-zinc-400 mb-1.5">موبایل</label><input required name="phone" type="tel" dir="ltr" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 text-white text-xs md:text-sm focus:border-blue-500" /></div>
                    <div className="relative"><label className="block text-[10px] md:text-xs font-medium text-zinc-400 mb-1.5">نقش</label><input type="hidden" name="role" value={selectedRole} /><button type="button" onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)} className="w-full bg-[#0f1631] border border-white/10 rounded-xl px-3 md:px-4 py-2.5 text-white text-xs md:text-sm flex justify-between items-center"><span>{selectedRole === "Admin" ? "مدیر کل" : selectedRole === "Instructor" ? "مدرس" : "کاربر عادی"}</span><ChevronDown size={14} className={`${isRoleDropdownOpen ? "rotate-180" : ""}`} /></button>
                      {isRoleDropdownOpen && (<><div className="fixed inset-0 z-40" onClick={() => setIsRoleDropdownOpen(false)}></div><div className="absolute top-full left-0 right-0 mt-1 bg-[#0f1631] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">{[{ value: "User", label: "کاربر عادی" }, { value: "Instructor", label: "مدرس" }, { value: "Admin", label: "مدیر کل" }].map((r) => (<div key={r.value} onClick={() => { setSelectedRole(r.value); setIsRoleDropdownOpen(false); }} className="px-4 py-2.5 text-xs md:text-sm cursor-pointer hover:bg-white/5">{r.label}</div>))}</div></>)}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-[10px] md:text-xs font-medium text-zinc-400 mb-1.5">ایمیل</label><input required name="email" type="email" dir="ltr" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 text-white text-xs md:text-sm focus:border-blue-500" /></div>
                    <div><label className="block text-[10px] md:text-xs font-medium text-zinc-400 mb-1.5">رمز عبور</label><input required name="password" type="password" dir="ltr" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 md:px-4 py-2.5 text-white text-xs md:text-sm focus:border-blue-500" /></div>
                  </div>
                </>
              )}
              <div className="mt-2 flex gap-2 md:gap-3"><button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs md:text-sm">{isSubmitting ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin mx-auto" /> : "ثبت"}</button><button type="button" onClick={() => setIsFormModalOpen(false)} className="px-4 md:px-5 py-2.5 md:py-3 rounded-xl bg-white/5 text-zinc-300 text-xs md:text-sm">لغو</button></div>
            </form>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a1024] border border-white/10 rounded-2xl md:rounded-3xl w-full max-w-sm shadow-2xl p-5 md:p-6 text-center">
            <div className={`w-12 h-12 md:w-14 md:h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${confirmModal.type === "delete" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>{confirmModal.type === "delete" ? <AlertTriangle size={24} /> : <UserCog size={24} />}</div>
            <h3 className="text-base md:text-lg font-bold text-white mb-2">{confirmModal.type === "delete" ? "حذف" : "تغییر نقش"}</h3>
            <div className="flex gap-2 md:gap-3 mt-6"><button onClick={handleConfirmAction} disabled={confirmText !== "CONFIRM" || isSubmitting} className="flex-1 py-2.5 md:py-3 rounded-xl bg-red-600 text-white text-xs md:text-sm">{isSubmitting ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin mx-auto" /> : "تایید"}</button><button onClick={() => setConfirmModal({ isOpen: false, type: null, userId: null, userName: "" })} className="px-4 md:px-5 py-2.5 md:py-3 rounded-xl border border-white/10 text-zinc-300 text-xs md:text-sm">لغو</button></div>
          </div>
        </div>
      )}
    </div>
  );
}