import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import SearchBar from '@/components/home/SearchBar';
import VAuditSection from '@/components/home/VAuditSection';
import ServicesSection from '@/components/home/ServicesSection';
import StampDutyCalculator from '@/components/home/StampDutyCalculator';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <SearchBar />
    <VAuditSection />
    <ServicesSection />
    <StampDutyCalculator />
    <TestimonialsSection />
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Index;
