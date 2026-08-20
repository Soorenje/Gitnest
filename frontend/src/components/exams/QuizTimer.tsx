"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

interface QuizTimerProps {
  timeLimitMinutes: number;
  onTimeUp: () => void;
  isPaused: boolean;
}

export default function QuizTimer({ timeLimitMinutes, onTimeUp, isPaused }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);

  useEffect(() => {
    if (isPaused) return; // اگر آزمون تمام شده، تایمر متوقف شود

    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      onTimeUp(); // وقتی زمان صفر شد، تابع پایان آزمون را صدا می‌زنیم
    }
  }, [timeLeft, isPaused, onTimeUp]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl transition-colors ${timeLeft < 60 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-blue-500/20 text-blue-400'}`}>
      <Timer size={18} />
      <span className="tracking-widest">{formatTime(timeLeft)}</span>
    </div>
  );
}