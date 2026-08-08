// فایل استایل اصلی سایت را اینجا ایمپورت می‌کنیم
// توجه: اگر فایل globals.css شما جای دیگری است، مسیر آن را اینجا اصلاح کنید
import '../globals.css'; 

export default function MockPaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-[#f1f5f9] antialiased">
        {children}
      </body>
    </html>
  );
}