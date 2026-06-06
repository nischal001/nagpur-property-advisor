import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import SearchBar from '@/components/home/SearchBar';
import VAuditSection from '@/components/home/VAuditSection';
import ServicesSection from '@/components/home/ServicesSection';
import StampDutyCalculator from '@/components/home/StampDutyCalculator';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO, { ORGANIZATION_LD } from '@/components/SEO';

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does Nagpur Property Advisor verify properties?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every listing goes through our V-Audit™ check covering NMRDA/NIT approval, RERA registration, 30-year title verification, and possession status before being listed.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the brokerage fee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We charge a flat 2% managed brokerage that includes legal verification, paperwork support, and end-to-end assistance until registration.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which areas of Nagpur do you cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We cover all major Nagpur localities including Dharampeth, Sadar, Civil Lines, Manish Nagar, Wardha Road, Hingna, Besa, Ramdaspeth, Sitabuldi and surrounding areas.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is stamp duty calculated in Nagpur?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Maharashtra stamp duty in Nagpur is typically 6% for male buyers and 5% for female buyers, plus 1% registration fee. Use our on-page calculator for an exact estimate.',
      },
    },
  ],
};

const Index = () => (
  <div className="min-h-screen">
    <SEO
      title="Nagpur Property Advisor — Verified Properties with V-Audit™"
      description="Buy & sell verified properties in Nagpur with V-Audit™ legal checks, RERA & title verification, and end-to-end paperwork support. Risk-free real estate consultancy."
      canonical="/"
      jsonLd={[ORGANIZATION_LD, FAQ_LD]}
    />
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
