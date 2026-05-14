import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-navy-dark text-primary-foreground/70">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
              <span className="font-serif font-bold text-navy-dark text-sm">NP</span>
            </div>
            <span className="font-serif text-lg font-bold text-primary-foreground">Nagpur Property</span>
          </div>
          <p className="text-sm leading-relaxed">
            Premium real estate consultancy in Nagpur. 2% managed brokerage with 100% risk-free transaction guarantee.
          </p>
        </div>
        <div>
          <h3 className="font-serif font-semibold text-primary-foreground mb-4">Quick Links</h3>
          <div className="space-y-2 text-sm">
            <Link to="/properties" className="block hover:text-gold transition-colors">Browse Properties</Link>
            <Link to="/seller" className="block hover:text-gold transition-colors">List Your Property</Link>
            <Link to="/" className="block hover:text-gold transition-colors">Stamp Duty Calculator</Link>
          </div>
        </div>
        <div>
          <h3 className="font-serif font-semibold text-primary-foreground mb-4">Services</h3>
          <div className="space-y-2 text-sm">
            <p>Legal Verification</p>
            <p>7/12 Document Check</p>
            <p>Site Visit Coordination</p>
            <p>End-to-End Documentation</p>
          </div>
        </div>
        <div>
          <h3 className="font-serif font-semibold text-primary-foreground mb-4">Contact</h3>
          <div className="space-y-3 text-sm">
            <a href="tel:+917219437006" className="flex items-center gap-2 hover:text-gold transition-colors"><Phone className="w-4 h-4 text-gold" /> +91 72194 37006</a>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold" /> info@nagpurproperty.com</div>
            <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gold mt-0.5" /> Dharampeth, Nagpur, Maharashtra</div>
          </div>
        </div>
      </div>
      <div className="border-t border-navy-light/20 mt-12 pt-8 text-center text-sm">
        © 2026 Nagpur Property Advisor. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
