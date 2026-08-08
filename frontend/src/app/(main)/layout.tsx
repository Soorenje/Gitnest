import { Vazirmatn } from "next/font/google";
import "./../globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner"; // 💡 ۱. ایمپورت سونر

const vazir = Vazirmatn({
  subsets: ["arabic"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazir.className}>
        {/* نوار لودینگ جذاب بالای سایت */}
        <NextTopLoader 
          color="#3b82f6" 
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false} 
          easing="ease"
          speed={200}
          shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
        />
        
        {children}

        {/* 💡 ۲. قرار دادن کامپوننت سونر در انتهای body */}
        <Toaster position="bottom-left" theme="dark" richColors />
      </body>
    </html>
  );
}