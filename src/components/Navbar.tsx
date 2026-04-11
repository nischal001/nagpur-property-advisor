import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone } from 'lucide-react';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
    { to: '/seller', label: 'List Property' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-dark/95 backdrop-blur-md border-b border-navy-light/20">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
            <span className="font-serif font-bold text-navy-dark text-sm">NP</span>
          </div>
          <span className="font-serif text-lg font-bold text-primary-foreground">
            Nagpur <span className="text-gradient-gold">Property</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? 'text-gold'
                  : 'text-primary-foreground/70 hover:text-primary-foreground'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline-light" size="sm" asChild>
            <a href="tel:+919876543210"><Phone className="w-4 h-4 mr-1" /> Call Expert</a>
          </Button>
          <Button variant="gold" size="sm">Get Consultation</Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-primary-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy-dark border-t border-navy-light/20 px-4 py-4 space-y-3 animate-fade-in">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block py-2 text-sm font-medium ${
                location.pathname === l.to ? 'text-gold' : 'text-primary-foreground/70'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Button variant="gold" className="w-full" size="sm">Get Consultation</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
