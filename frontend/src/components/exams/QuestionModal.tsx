"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questionData: any) => Promise<void>; // تابعی که از والد پاس داده می‌شود
  isSaving: boolean;
}

export default function QuestionModal({ isOpen, onClose, onSave, isSaving }: QuestionModalProps) {
  const [questionForm, setQuestionForm] = useState({
    title: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1,
  });

  if (!isOpen) return null;

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.title.trim() || questionForm.options.some(opt => !opt.trim())) {
      toast.error("لطفا صورت سوال و تمام ۴ گزینه را پر کنید");
      return;
    }
    
    await onSave(questionForm);
    // بعد از ذخیره موفق، فرم را برای دفعات بعدی ریست می‌کنیم
    setQuestionForm({ title: "", options: ["", "", "", ""], correctAnswer: 0, points: 1 });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0a1024] border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02] shrink-0">
          <h3 className="text-lg font-bold text-white">طراحی سوال جدید</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white p-1.5 rounded-lg"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">صورت سوال *</label>
            <textarea required rows={3} value={questionForm.title} onChange={(e) => setQuestionForm({...questionForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 resize-none custom-scrollbar" placeholder="مثلاً: کاربرد هوک useEffect چیست؟"></textarea>
          </div>
          
          <div className="space-y-4 border-t border-white/5 pt-4">
            <label className="block text-xs font-medium text-zinc-400">گزینه‌ها (پاسخ صحیح را انتخاب کنید)</label>
            {questionForm.options.map((opt, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${questionForm.correctAnswer === idx ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 bg-white/5'}`}>
                <input 
                  type="radio" 
                  name="correctAnswer" 
                  checked={questionForm.correctAnswer === idx} 
                  onChange={() => setQuestionForm({...questionForm, correctAnswer: idx})}
                  className="w-4 h-4 ml-2 accent-green-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-zinc-500 w-5">{idx + 1}.</span>
                <input required type="text" value={opt} onChange={(e) => handleOptionChange(idx, e.target.value)} className="flex-1 bg-transparent border-none outline-none text-sm text-white focus:ring-0" placeholder={`متن گزینه ${idx + 1}`} />
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-4">
            <label className="block text-xs font-medium text-zinc-400 mb-2">بارم (نمره) سوال</label>
            <input type="number" min="0.5" step="0.5" value={questionForm.points} onChange={(e) => setQuestionForm({...questionForm, points: Number(e.target.value)})} className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 text-center" />
          </div>

          <div className="mt-4 flex gap-3 shrink-0">
            <button type="submit" disabled={isSaving} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium flex justify-center items-center">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : "ذخیره سوال"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3.5 rounded-xl bg-white/5 text-zinc-300 text-sm hover:bg-white/10 transition-colors">انصراف</button>
          </div>
        </form>
      </div>
    </div>
  );
}