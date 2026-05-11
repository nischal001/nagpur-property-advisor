import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PropertyCard from '@/components/PropertyCard';
import SEO, { ORGANIZATION_LD } from '@/components/SEO';
import { LOCATIONS, PROPERTY_TYPES, APPROVAL_TYPES, dummyProperties, type Property } from '@/lib/data';
import { supabase } from '@/integrations/supabase/client';

const FRESHNESS_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: '1', label: 'Last 24 hours' },
  { value: '3', label: 'Last 3 days' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
];

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [type, setType] = useState(searchParams.get('type') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [approval, setApproval] = useState('');
  const [freshness, setFreshness] = useState('');
  const [sort, setSort] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState<Property[]>(dummyProperties);

  useEffect(() => {
    const fetchProperties = async () => {
      let query = supabase.from('properties').select('*').eq('status', 'approved').eq('visible', true);
      if (type) query = query.eq('property_type', type);
      if (location) query = query.eq('location', location);
      if (approval) query = query.eq('approval_type', approval);
      if (freshness) {
        const since = new Date(Date.now() - Number(freshness) * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', since);
      }
      if (sort === 'price-asc') query = query.order('price', { ascending: true });
      else if (sort === 'price-desc') query = query.order('price', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      const { data } = await query;
      if (data && data.length > 0) {
        setProperties(data.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description || '',
          price: Number(p.price),
          location: p.location,
          propertyType: p.property_type as Property['propertyType'],
          area: Number(p.area),
          areaUnit: p.area_unit,
          approvalType: p.approval_type as Property['approvalType'],
          status: p.status as Property['status'],
          verified: p.verified || false,
          reraRegistered: p.rera_registered || false,
          titleVerified: p.title_verified || false,
          possessionVerified: p.possession_verified || false,
          riskLevel: (p.risk_level || 'Medium') as Property['riskLevel'],
          images: p.images || [],
          sellerId: p.seller_id || '',
          createdAt: p.created_at,
          soldOut: p.sold_out || false,
        })));
      }
    };
    fetchProperties();
  }, [type, location, approval, sort, freshness]);

  const filtered = sort === 'verified'
    ? [...properties].sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0))
    : properties;

  const selectClass = "w-full h-10 rounded-lg border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-gold/30 outline-none";

  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: filtered.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://nagpur-property-advisor.lovable.app/property/${p.id}`,
      name: p.title,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Properties for Sale in Nagpur — Verified Plots, Flats & Commercial"
        description="Browse verified properties in Nagpur — NMRDA/NIT approved plots, RERA-registered flats, agricultural land, shops & offices. Filtered by location, price & freshness."
        canonical="/properties"
        jsonLd={[ORGANIZATION_LD, itemListLd]}
      />
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <header className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Properties in Nagpur</h1>
            <p className="text-muted-foreground">Browse verified properties with complete legal documentation.</p>
          </header>

          <div className="mb-8">
            <button
              className="md:hidden flex items-center gap-2 text-sm font-medium text-navy mb-4"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="w-4 h-4" /> {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            <div className={`grid grid-cols-1 md:grid-cols-6 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
              <select aria-label="Property type" value={type} onChange={e => setType(e.target.value)} className={selectClass}>
                <option value="">All Types</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select aria-label="Location" value={location} onChange={e => setLocation(e.target.value)} className={selectClass}>
                <option value="">All Locations</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select aria-label="Approval" value={approval} onChange={e => setApproval(e.target.value)} className={selectClass}>
                <option value="">All Approvals</option>
                {APPROVAL_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <select aria-label="Freshness" value={freshness} onChange={e => setFreshness(e.target.value)} className={selectClass}>
                {FRESHNESS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select aria-label="Sort" value={sort} onChange={e => setSort(e.target.value)} className={selectClass}>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No properties found matching your criteria.
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
