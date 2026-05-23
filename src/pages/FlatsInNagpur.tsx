import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, FileCheck, MapPin, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO, { ORGANIZATION_LD } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { LOCATIONS } from '@/lib/data';

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are the flats in Nagpur RERA registered?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Every flat listed on Nagpur Property Advisor goes through our V-Audit™ check which includes RERA registration verification before it appears on the site.' },
    },
    {
      '@type': 'Question',
      name: 'Which areas in Nagpur are best for buying a flat?',
      acceptedAnswer: { '@type': 'Answer', text: 'Dharampeth, Civil Lines, Ramdaspeth, Manish Nagar, Wardha Road, and Besa are among the most-searched localities for flats in Nagpur — covering both premium and mid-segment budgets.' },
    },
    {
      '@type': 'Question',
      name: 'What is the average price of a 2BHK flat in Nagpur?',
      acceptedAnswer: { '@type': 'Answer', text: '2BHK flat prices in Nagpur typically range from ₹35 lakh to ₹85 lakh depending on locality, builder, and amenities. Premium areas like Civil Lines and Dharampeth command higher rates.' },
    },
    {
      '@type': 'Question',
      name: 'Do you charge brokerage on flat purchases?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, we operate a flat managed brokerage that covers V-Audit™ legal verification, paperwork support, and end-to-end assistance through registration.' },
    },
  ],
};

const FlatsInNagpur = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Flats in Nagpur — Verified 1, 2 & 3 BHK Apartments for Sale"
      description="Buy verified flats in Nagpur — RERA registered, title-checked 1BHK, 2BHK & 3BHK apartments in Dharampeth, Civil Lines, Manish Nagar, Wardha Road & more."
      canonical="/flats-in-nagpur"
      jsonLd={[ORGANIZATION_LD, FAQ_LD]}
    />
    <Navbar />

    <section className="pt-24 pb-12 bg-gradient-to-b from-navy/5 to-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
          Flats for Sale in Nagpur
        </h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
          Browse <strong>verified 1BHK, 2BHK and 3BHK flats in Nagpur</strong> — every listing
          legally cleared through our V-Audit™ checklist (RERA, 30-year title, NMRDA/NIT approval,
          7/12 and possession status) before it goes live.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/properties?type=Residential">
            <Button size="lg" className="bg-navy hover:bg-navy/90">
              View Verified Flats <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="https://wa.me/918010615388" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline">Talk to an Advisor</Button>
          </a>
        </div>
      </div>
    </section>

    <section className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">Why buy your flat through Nagpur Property Advisor?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: 'V-Audit™ Legal Check', desc: 'Every flat passes 5-point legal verification before being listed — no surprises at registration.' },
            { icon: FileCheck, title: 'RERA & Title Verified', desc: 'We confirm RERA registration, 30-year title chain, encumbrance, and builder NOC.' },
            { icon: CheckCircle2, title: 'End-to-End Support', desc: 'From shortlist to registration — paperwork, loan coordination, and stamp duty all handled.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 shadow-sm">
              <f.icon className="h-8 w-8 text-gold mb-3" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">Popular localities for flats in Nagpur</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LOCATIONS.map((loc) => (
            <Link
              key={loc}
              to={`/properties?type=Residential&location=${encodeURIComponent(loc)}`}
              className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 hover:border-gold hover:shadow-md transition"
            >
              <MapPin className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium">Flats in {loc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQ_LD.mainEntity.map((q) => (
            <div key={q.name} className="rounded-lg border bg-card p-5">
              <h3 className="font-semibold mb-2">{q.name}</h3>
              <p className="text-sm text-muted-foreground">{q.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
    <WhatsAppButton />
  </div>
);

export default FlatsInNagpur;
