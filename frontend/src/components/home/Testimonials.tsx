'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';

// استایل‌های مورد نیاز Swiper
import 'swiper/css';
import 'swiper/css/pagination';

// داده‌های فیک برای نظرات دانشجویان (بدون نقش کاربری)
const testimonialsData = [
  {
    id: 1,
    name: "علی رضایی",
    comment: "آموزش‌ها بسیار روان و پروژه‌محور هستند. من بعد از گذراندن دوره جامع جاوا اسکریپت توانستم اولین کارآموزی‌ام را پیدا کنم.",
    rating: 5,
  },
  {
    id: 2,
    name: "سارا احمدی",
    comment: "پشتیبانی دوره‌ها در گیت‌نست بی‌نظیر است. هر جا که در کدنویسی به مشکل خوردم، اساتید خیلی سریع راهنمایی‌ام کردند.",
    rating: 5,
  },
  {
    id: 3,
    name: "محمد حسینی",
    comment: "مباحث Node.js بسیار عمیق و کاربردی تدریس شده بود. برای کسی که می‌خواهد فول‌استک بشود، این پلتفرم بهترین انتخاب است.",
    rating: 4,
  },
  {
    id: 4,
    name: "مریم نوری",
    comment: "کیفیت ویدیوها و دسته‌بندی مطالب فوق‌العاده است. همه چیز از پایه تا پیشرفته با دقت چیده شده است.",
    rating: 5,
  },
  {
    id: 5,
    name: "امیرحسین عباسی",
    comment: "من دوره‌های زیادی رو در سایت‌های مختلف دیدم، اما پروژه‌های عملی گیت‌نست باعث شد واقعاً مفاهیم رو درک کنم و فقط تئوری یاد نگیرم.",
    rating: 5,
  },
  {
    id: 6,
    name: "فاطمه سعیدی",
    comment: "آموزش ری‌اکت در این سایت عالی بود، کاملاً کاربردی و مطابق با نیاز بازار کار. الان دارم روی اولین پروژه فریلنسری خودم کار می‌کنم.",
    rating: 4,
  },
  {
    id: 7,
    name: "رضا کریمی",
    comment: "بخش پشتیبانی و منتورینگ خیلی خوبه. هر وقت با باگ عجیبی روبرو می‌شدم، اساتید با حوصله کدها رو بررسی می‌کردند و راه حل می‌دادند.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* هدر سکشن */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            نظرات <span className="text-blue-500">دانشجویان</span> ما
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            بیش از هزاران دانشجو به گیت‌نست اعتماد کرده‌اند. نظرات برخی از آن‌ها را درباره تجربه‌ی یادگیری‌شان بخوانید.
          </p>
        </div>

        {/* اسلایدر نظرات */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {testimonialsData.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-[#070b1a] border border-gray-800 rounded-2xl p-8 h-full flex flex-col relative group hover:border-blue-500/50 transition-colors duration-300">
                
                {/* آیکون نقل قول پس‌زمینه - اضافه شدن z-0 */}
                <Quote className="absolute top-6 right-6 w-12 h-12 text-gray-800 opacity-50 group-hover:text-blue-500/20 transition-colors duration-300 z-0" />
                
                {/* کانتینر اصلی محتوا - اضافه شدن relative z-10 */}
                <div className="relative z-10 flex flex-col flex-grow h-full">
                  
                  {/* ستاره‌های امتیاز */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${
                          index < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-700 text-gray-700'
                        }`}
                      />
                    ))}
                  </div>

                  {/* متن نظر */}
                  <p className="text-gray-300 leading-relaxed mb-8 flex-grow text-justify">
                    "{testimonial.comment}"
                  </p>

                  {/* اطلاعات دانشجو */}
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    </div>
                  </div>

                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}