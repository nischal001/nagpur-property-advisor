import { Percent, Scale, MapPin, FileText } from 'lucide-react';

const services = [
  {
    icon: Percent,
    title: '2% Managed Brokerage',
    desc: 'Transparent, fixed 2% brokerage with no hidden charges. Pay only after successful transaction.',
  },
  {
    icon: Scale,
    title: 'Legal Verification',
    desc: 'Complete legal due diligence including title search, encumbrance check, and mutation verification.',
  },
  {
    icon: MapPin,
    title: 'Site Visit Coordination',
    desc: 'Our field experts accompany you for site visits, ensuring you see exactly what you\'re buying.',
  },
  {
    icon: FileText,
    title: 'End-to-End Documentation',
    desc: 'From sale deed to electricity bill transfer — we handle every document so you don\'t have to.',
  },
];

const ServicesSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
          Why Choose <span className="text-gradient-gold">Nagpur Property Advisor</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          We're not a marketplace. We're your trusted property consultants.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <div
            key={s.title}
            className="bg-card rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 group border border-border/50 hover:border-gold/30"
          >
            <div className="w-14 h-14 rounded-xl bg-navy/5 flex items-center justify-center mb-5 group-hover:bg-gold/10 transition-colors">
              <s.icon className="w-7 h-7 text-navy group-hover:text-gold transition-colors" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-3">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
