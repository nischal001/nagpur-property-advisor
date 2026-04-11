import { ShieldCheck, FileCheck, CheckCircle, AlertTriangle } from 'lucide-react';

const checks = [
  { icon: ShieldCheck, label: 'NMRDA/NIT Approval', desc: 'Layout plan verified with municipal authorities' },
  { icon: FileCheck, label: 'RERA Registration', desc: 'Confirmed registration with RERA Maharashtra' },
  { icon: CheckCircle, label: '30-Year Title Check', desc: 'Complete ownership history verification' },
  { icon: FileCheck, label: '7/12 Verified', desc: 'Revenue record verified from Talathi office' },
  { icon: CheckCircle, label: 'Possession Verified', desc: 'Physical possession status confirmed on-site' },
];

const VAuditSection = () => (
  <section className="py-20 bg-cream">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-1.5 mb-4">
          <AlertTriangle className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium text-gold-dark">V-Audit™ Verification Engine</span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
          Every Property, <span className="text-gradient-gold">5-Point Verified</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Our proprietary verification engine ensures complete legal due diligence before you invest.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {checks.map((c, i) => (
          <div
            key={c.label}
            className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-center group"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
              <c.icon className="w-6 h-6 text-gold" />
            </div>
            <h4 className="font-semibold text-foreground text-sm mb-2">{c.label}</h4>
            <p className="text-xs text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default VAuditSection;
