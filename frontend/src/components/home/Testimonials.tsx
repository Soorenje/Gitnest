'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';

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
    <section className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
            نظرات <span className="text-blue-500">دانشجویان</span> ما
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base px-2">
            بیش از هزاران دانشجو به گیت‌نست اعتماد کرده‌اند. نظرات برخی از آن‌ها را درباره تجربه‌ی یادگیری‌شان بخوانید.
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="pb-12"
        >
          {testimonialsData.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="h-auto">
              <div className="bg-[#070b1a] border border-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-8 h-full flex flex-col relative group hover:border-blue-500/50 transition-colors duration-300">
                
                <Quote className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-12 md:h-12 text-gray-800 opacity-50 group-hover:text-blue-500/20 transition-colors duration-300 z-0" />
                
                <div className="relative z-10 flex flex-col flex-grow h-full">
                  
                  <div className="flex gap-1 mb-4 md:mb-6">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 md:w-5 md:h-5 ${
                          index < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-700 text-gray-700'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-6 md:mb-8 flex-grow text-justify text-sm md:text-base">
                    "{testimonial.comment}"
                  </p>

                  <div className="flex items-center gap-3 md:gap-4 mt-auto">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-base md:text-lg shrink-0">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm md:text-base">{testimonial.name}</h4>
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