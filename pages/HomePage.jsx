import { useSearchParams } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedProducts from '../components/FeaturedProducts';
import TrendingSection from '../components/TrendingSection';
import OffersSection from '../components/OffersSection';
import WhyChooseUs from '../components/WhyChooseUs';
import ReviewsSection from '../components/ReviewsSection';
import Newsletter from '../components/Newsletter';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  return (
    <main className="pb-16 sm:pb-0">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts searchQuery={searchQuery} />
      <TrendingSection />
      <OffersSection />
      <WhyChooseUs />
      <ReviewsSection />
      <Newsletter />
    </main>
  );
}
