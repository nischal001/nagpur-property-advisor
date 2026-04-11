import { useState } from 'react';
import { CheckCircle, ArrowRight, ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { LOCATIONS, PROPERTY_TYPES, APPROVAL_TYPES } from '@/lib/data';
import { toast } from 'sonner';

const steps = ['Basic Info', 'Property Details', 'Documents', 'Pricing & Contact'];

const SellerRegistration = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    title: '', description: '', propertyType: '', location: '', area: '', approvalType: '',
    price: '', contactPhone: '',
  });

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const next = () => setStep(s => Math.min(s + 1, 3));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const submit = () => {
    toast.success('Property submitted for review! Our team will contact you within 24 hours.');
    setStep(0);
    setForm({ name: '', email: '', phone: '', title: '', description: '', propertyType: '', location: '', area: '', approvalType: '', price: '', contactPhone: '' });
  };

  const inputClass = "w-full h-11 rounded-lg border border-input bg-background px-4 text-sm focus:ring-2 focus:ring-gold/30 outline-none";
  const labelClass = "text-sm font-medium text-foreground mb-1.5 block";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">List Your Property</h1>
            <p className="text-muted-foreground">Get access to verified buyers and our managed brokerage service.</p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  i <= step ? 'bg-gold text-navy-dark' : 'bg-muted text-muted-foreground'
                }`}>
                  {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className="hidden sm:block text-xs ml-2 text-muted-foreground">{s}</span>
                {i < 3 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${i < step ? 'bg-gold' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl p-6 md:p-8 shadow-card border border-border/50">
            {step === 0 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Basic Information</h3>
                <div><label className={labelClass}>Full Name</label><input className={inputClass} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your full name" /></div>
                <div><label className={labelClass}>Email</label><input className={inputClass} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" /></div>
                <div><label className={labelClass}>Phone</label><input className={inputClass} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 98765 43210" /></div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Property Details</h3>
                <div><label className={labelClass}>Property Title</label><input className={inputClass} value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. 2BHK Flat in Dharampeth" /></div>
                <div><label className={labelClass}>Description</label><textarea className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-gold/30 outline-none min-h-[100px]" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe your property..." /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Type</label>
                    <select className={inputClass} value={form.propertyType} onChange={e => update('propertyType', e.target.value)}>
                      <option value="">Select</option>
                      {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <select className={inputClass} value={form.location} onChange={e => update('location', e.target.value)}>
                      <option value="">Select</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Area (sq ft)</label><input className={inputClass} type="number" value={form.area} onChange={e => update('area', e.target.value)} /></div>
                  <div>
                    <label className={labelClass}>Approval Type</label>
                    <select className={inputClass} value={form.approvalType} onChange={e => update('approvalType', e.target.value)}>
                      <option value="">Select</option>
                      {APPROVAL_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Upload Documents</h3>
                {['7/12 Extract', 'RERA Certificate', 'Layout Approval', 'Sale Deed / Agreement'].map(doc => (
                  <div key={doc} className="flex items-center justify-between p-4 border border-dashed border-border rounded-lg hover:border-gold/40 transition-colors">
                    <span className="text-sm text-foreground">{doc}</span>
                    <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-1" /> Upload</Button>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">Documents will be verified by our legal team within 48 hours.</p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Pricing & Contact</h3>
                <div><label className={labelClass}>Expected Price (₹)</label><input className={inputClass} type="number" value={form.price} onChange={e => update('price', e.target.value)} placeholder="e.g. 5000000" /></div>
                <div><label className={labelClass}>Contact Phone</label><input className={inputClass} value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} placeholder="+91 98765 43210" /></div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">✅ Our brokerage is just <strong className="text-foreground">2%</strong> of the transaction value. No upfront charges.</p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {step > 0 ? (
                <Button variant="outline" onClick={back}><ArrowLeft className="w-4 h-4 mr-1" /> Back</Button>
              ) : <div />}
              {step < 3 ? (
                <Button variant="gold" onClick={next}>Next <ArrowRight className="w-4 h-4 ml-1" /></Button>
              ) : (
                <Button variant="gold" onClick={submit}>Submit Property</Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default SellerRegistration;
