import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Deshmukh',
    location: 'Manish Nagar, Nagpur',
    text: 'Nagpur Property Advisor made my first property purchase completely stress-free. Their 7/12 verification caught an issue that could have cost me lakhs.',
    rating: 5,
  },
  {
    name: 'Priya Waghmare',
    location: 'Dharampeth, Nagpur',
    text: 'The end-to-end documentation service is worth every rupee. From sale deed to electricity transfer, everything was handled professionally.',
    rating: 5,
  },
  {
    name: 'Amit Patil',
    location: 'Wardha Road, Nagpur',
    text: 'Transparent 2% brokerage with no hidden charges. Finally a property consultant I can trust. Highly recommended for Nagpur property buyers.',
    rating: 5,
  },
];

const TestimonialsSection = () => (
  <section className="py-20 bg-cream">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
          Trusted by <span className="text-gradient-gold">1200+ Families</span>
        </h2>
        <p className="text-muted-foreground">Real stories from real property buyers in Nagpur.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-card rounded-xl p-8 shadow-card border border-border/50">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
            <div>
              <div className="font-semibold text-foreground text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
