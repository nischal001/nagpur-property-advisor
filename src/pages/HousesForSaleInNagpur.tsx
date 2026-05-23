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
      name: 'How do you verify houses and bungalows in Nagpur?',
      acceptedAnswer: { '@type': 'Answer', text: 'Every house listed passes our V-Audit™ check — NMRDA/NIT sanction, 30-year title search, 7/12 extract, encumbrance certificate, and possession verification — before it appears on the site.' },
    },
    {
      '@type': 'Question',
      name: 'Which Nagpur areas have independent houses for sale?',
      acceptedAnswer: { '@type': 'Answer', text: 'Civil Lines, Dharampeth, Sadar, Ramdaspeth, Manish Nagar, Hingna and Wardha Road have a strong inventory of bungalows and independent houses across budget segments.' },
    },
    {
      '@type': 'Question',
      name: 'What documents are checked before listing a house?',
      acceptedAnswer: { '@type': 'Answer', text: 'We check the 7/12 extract, mutation entries, NMRDA/NIT/Gram Panchayat sanction, building plan approval, 30-year title chain, encumbrance certificate, and current possession status.' },
    },
    {
      '@type': 'Question',
      name: 'Can you help with home loan and registration?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Our managed brokerage covers paperwork, bank loan coordination, stamp duty calculation, and end-to-end support through registration.' },
    },
  ],
};

const HousesForSaleInNagpur = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Houses for Sale in Nagpur — Verified Bungalows & Independent Homes"
      description="Buy verified houses & bungalows in Nagpur with V-Audit™ legal checks — 30-year title, 7/12, NMRDA/NIT sanction verified. Browse independent homes in top localities."
      canonical="/houses-for-sale-in-nagpur"
      jsonLd={[ORGANIZATION_LD, FAQ_LD]}
    />
    <Navbar />

    <section className="pt-24 pb-12 bg-gradient-to-b from-navy/5 to-background">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
          Houses for Sale in Nagpur
        </h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
          Browse <strong>verified bungalows and independent houses in Nagpur</strong> — every
          property legally cleared through our V-Audit™ checklist (30-year title, 7/12,
          NMRDA/NIT sanction, encumbrance, possession) before it goes live.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/properties?type=Residential">
            <Button size="lg" className="bg-navy hover:bg-navy/90">
              View Verified Houses <ArrowRight className="ml-2 h-4 w-4" />
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
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">Why buy your house through Nagpur Property Advisor?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: 'V-Audit™ Legal Check', desc: 'Every house passes a 5-point legal verification — no last-minute surprises.' },
            { icon: FileCheck, title: '30-Year Title & 7/12', desc: 'Title chain, 7/12 extract, mutation entries and encumbrance certificate all reviewed.' },
            { icon: CheckCircle2, title: 'End-to-End Support', desc: 'Site visit, negotiation, loan, stamp duty and registration — all handled for you.' },
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
        <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">Popular localities for houses in Nagpur</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {LOCATIONS.map((loc) => (
            <Link
              key={loc}
              to={`/properties?type=Residential&location=${encodeURIComponent(loc)}`}
              className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 hover:border-gold hover:shadow-md transition"
            >
              <MapPin className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium">Houses in {loc}</span>
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

export default HousesForSaleInNagpur;
