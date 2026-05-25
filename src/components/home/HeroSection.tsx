import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="Nagpur skyline" className="w-full h-full object-cover" width={1920} height={1080} fetchPriority="high" decoding="async" />
      <div className="absolute inset-0 bg-navy-dark/80" />
    </div>
    <div className="container mx-auto px-4 relative z-10 py-32">
      <div className="max-w-3xl animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-gold text-sm font-medium">Nagpur's Trusted Property Consultancy</span>
        </div>
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
          Buy Property in Nagpur with{' '}
          <span className="text-gradient-gold">100% Risk-Free</span> Guarantee
        </h1>
        <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl leading-relaxed">
          Just 2% brokerage with complete legal verification, 7/12 document check, and end-to-end ownership transfer. Your property, our guarantee.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="hero" size="lg" asChild>
            <Link to="/properties"><Search className="w-5 h-5 mr-2" /> Search Property</Link>
          </Button>
          <Button variant="outline-light" size="lg" asChild>
            <Link to="/flats-in-nagpur">Flats in Nagpur</Link>
          </Button>
          <Button variant="outline-light" size="lg" asChild>
            <Link to="/houses-for-sale-in-nagpur">Houses for Sale</Link>
          </Button>
        </div>
        <div className="flex flex-wrap gap-8 mt-12">
          {[
            { value: '500+', label: 'Properties Verified' },
            { value: '₹200Cr+', label: 'Transactions Done' },
            { value: '1200+', label: 'Happy Families' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-gold">{s.value}</div>
              <div className="text-sm text-primary-foreground/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
