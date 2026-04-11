import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LOCATIONS, PROPERTY_TYPES } from '@/lib/data';

const SearchBar = () => {
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (propertyType) params.set('type', propertyType);
    if (location) params.set('location', location);
    if (budget) params.set('budget', budget);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative -mt-12 z-20 px-4">
      <div className="container mx-auto">
        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
          <h3 className="font-serif text-xl font-semibold text-foreground mb-5">Find Your Perfect Property</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-gold/30 outline-none"
              >
                <option value="">All Types</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus:ring-2 focus:ring-gold/30 outline-none"
                >
                  <option value="">All Nagpur</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-gold/30 outline-none"
              >
                <option value="">Any Budget</option>
                <option value="0-2500000">Under ₹25 Lac</option>
                <option value="2500000-5000000">₹25 Lac - ₹50 Lac</option>
                <option value="5000000-10000000">₹50 Lac - ₹1 Cr</option>
                <option value="10000000-99999999">Above ₹1 Cr</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="gold" className="w-full h-11" onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" /> Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
