import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PropertyCard from '@/components/PropertyCard';
import { dummyProperties, LOCATIONS, PROPERTY_TYPES, APPROVAL_TYPES } from '@/lib/data';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get('type') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [approval, setApproval] = useState('');
  const [sort, setSort] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...dummyProperties];
    if (type) list = list.filter(p => p.propertyType === type);
    if (location) list = list.filter(p => p.location === location);
    if (approval) list = list.filter(p => p.approvalType === approval);
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'verified') list.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    return list;
  }, [type, location, approval, sort]);

  const selectClass = "w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-gold/30 outline-none";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Properties in Nagpur</h1>
            <p className="text-muted-foreground">Browse verified properties with complete legal documentation.</p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <button
              className="md:hidden flex items-center gap-2 text-sm font-medium text-navy mb-4"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" /> {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              <select value={type} onChange={e => setType(e.target.value)} className={selectClass}>
                <option value="">All Types</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={location} onChange={e => setLocation(e.target.value)} className={selectClass}>
                <option value="">All Locations</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select value={approval} onChange={e => setApproval(e.target.value)} className={selectClass}>
                <option value="">All Approvals</option>
                {APPROVAL_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={sort} onChange={e => setSort(e.target.value)} className={selectClass}>
                <option value="recent">Recently Added</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="verified">Verified First</option>
              </select>
              <div className="flex items-center text-sm text-muted-foreground">
                {filtered.length} properties found
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No properties found matching your criteria. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Properties;
