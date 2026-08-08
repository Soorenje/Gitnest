import Navbar from "../../components/home/Navbar";
import Hero from "../../components/home/Hero";
import Footer from "../../components/home/footer";
import LatestCourses from "../../components/home/LatestCourses";
import CategorySlider from "../../components/home/CategorySlider";
import PopularFreeCourses from "../../components/home/PopularFreeCourses";
import Testimonials from "../../components/home/Testimonials";
import LatestArticles from "../../components/home/LatestArticles";





export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <LatestCourses />
      <CategorySlider />
      <PopularFreeCourses />
      <Testimonials />
      <Footer />
    </main>
  );
}