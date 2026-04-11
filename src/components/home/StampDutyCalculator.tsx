import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/data';

const StampDutyCalculator = () => {
  const [propertyValue, setPropertyValue] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<{ stampDuty: number; registration: number; metroCess: number; total: number } | null>(null);

  const calculate = () => {
    const value = parseFloat(propertyValue);
    if (!value || value <= 0) return;
    // Nagpur stamp duty rates
    const stampDutyRate = gender === 'female' ? 0.05 : 0.06;
    const registrationRate = 0.01;
    const metroCessRate = 0.01;
    const stampDuty = value * stampDutyRate;
    const registration = value * registrationRate;
    const metroCess = value * metroCessRate;
    setResult({ stampDuty, registration, metroCess, total: stampDuty + registration + metroCess });
  };

  return (
    <section className="py-20 bg-navy-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-gold/15 rounded-full px-4 py-1.5 mb-4">
              <Calculator className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold">Free Calculator</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Stamp Duty Calculator
            </h2>
            <p className="text-primary-foreground/60">Calculate stamp duty, registration, and metro cess for Nagpur properties.</p>
          </div>

          <div className="bg-navy-light/50 rounded-2xl p-8 border border-navy-light/30">
            <div className="space-y-5">
              <div>
                <label className="text-sm text-primary-foreground/70 mb-2 block">Property Value (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000000"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                  className="w-full h-12 rounded-lg bg-navy-dark border border-navy-light/40 text-primary-foreground px-4 text-sm placeholder:text-primary-foreground/30 focus:ring-2 focus:ring-gold/30 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-primary-foreground/70 mb-2 block">Buyer Gender</label>
                <div className="flex gap-3">
                  {(['male', 'female'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 h-11 rounded-lg text-sm font-medium transition-all ${
                        gender === g
                          ? 'bg-gold text-navy-dark'
                          : 'bg-navy-dark border border-navy-light/40 text-primary-foreground/60 hover:border-gold/40'
                      }`}
                    >
                      {g === 'male' ? 'Male (6%)' : 'Female (5%)'}
                    </button>
                  ))}
                </div>
              </div>
              <Button variant="gold" className="w-full h-12" onClick={calculate}>
                <Calculator className="w-4 h-4 mr-2" /> Calculate
              </Button>
            </div>

            {result && (
              <div className="mt-8 space-y-3 border-t border-navy-light/30 pt-6">
                {[
                  { label: 'Stamp Duty', value: result.stampDuty },
                  { label: 'Registration Fee', value: result.registration },
                  { label: 'Metro Cess (LBT)', value: result.metroCess },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-primary-foreground/60">{r.label}</span>
                    <span className="text-primary-foreground font-medium">{formatPrice(r.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t border-navy-light/30">
                  <span className="text-gold font-semibold">Total Charges</span>
                  <span className="text-gold font-bold text-lg">{formatPrice(result.total)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StampDutyCalculator;
