'use client';

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "../../../../utils/apiFetch";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

function VerifyPaymentContent() {
  const searchParams = useSearchParams();
  const authority = searchParams.get("authority");
  const status = searchParams.get("status");

  const [verifyState, setVerifyState] = useState<"loading" | "success" | "failed">("loading");
  const [trackingCode, setTrackingCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // این متغیر نگهبان ماست! اگر تراکنش موفق شد، دیگر اجازه نمی‌دهد درخواست دوم صفحه را خراب کند
  const isSuccessLocked = useRef(false);

  useEffect(() => {
    const verifyTransaction = async () => {
      if (!authority || !status) {
        setVerifyState("failed");
        setErrorMessage("اطلاعات پرداخت نامعتبر است.");
        return;
      }

      try {
        const res = await apiFetch(`/order/verifyPayment?authority=${authority}&status=${status}&t=${Date.now()}`, {
          method: "GET",
          cache: "no-store", 
        });
        
        const data = await res.json();
        const responseString = JSON.stringify(data).toLowerCase();

        const isSuccessResponse = 
          (res.ok && (data.success || data.trackingCode)) || 
          responseString.includes("already been added") || 
          responseString.includes("concurrently");

        if (isSuccessResponse) {
          isSuccessLocked.current = true; 
          setVerifyState("success");
          
          // دریافت کد پیگیری
          setTrackingCode(data?.data?.trackingCode || data?.trackingCode || "ثبت‌شده در سیستم");
        } else {
          if (!isSuccessLocked.current) {
            setVerifyState("failed");
            setErrorMessage(data?.message || data?.error || "خطایی در پردازش اطلاعات رخ داد.");
          }
        }
      } catch (error: any) {
        const errorString = (error?.message || JSON.stringify(error)).toLowerCase();
        
        if (errorString.includes("already been added") || errorString.includes("concurrently")) {
          isSuccessLocked.current = true;
          setVerifyState("success");
          setTrackingCode("ثبت‌شده در سیستم");
        } else if (!isSuccessLocked.current) {
          setVerifyState("failed");
          setErrorMessage("خطا در برقراری ارتباط با سرور.");
        }
      }
    };

    verifyTransaction();
  }, [authority, status]);

  return (
    <div className="min-h-screen bg-[#070b1a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-center backdrop-blur-md">
        
        {verifyState === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
            <h2 className="text-xl font-bold text-white mb-2">در حال بررسی تراکنش...</h2>
            <p className="text-zinc-400">لطفاً از این صفحه خارج نشوید.</p>
          </div>
        )}

        {verifyState === "success" && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">پرداخت با موفقیت انجام شد!</h2>
            <p className="text-zinc-400 mb-6">دوره‌های خریداری شده به حساب شما اضافه شدند.</p>
            
            <div className="bg-black/20 w-full p-4 rounded-xl border border-white/5 mb-8 flex justify-between items-center">
              <span className="text-zinc-500">کد پیگیری:</span>
              <span className="text-white font-mono font-bold tracking-widest">{trackingCode}</span>
            </div>

            <Link href="/courses" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
              شروع یادگیری <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {verifyState === "failed" && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">تراکنش ناموفق بود</h2>
            <p className="text-red-400/90 bg-red-500/10 px-4 py-2 rounded-lg text-sm mb-8 font-medium">
              دلیل: {errorMessage}
            </p>
            
            <Link href="/cart" className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">
              بازگشت به سبد خرید
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b1a]"></div>}>
      <VerifyPaymentContent />
    </Suspense>
  );
}