import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, ShieldCheck, FileCheck, CheckCircle, XCircle, ArrowLeft, Phone, Download, Calendar, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { dummyProperties, getPropertyImage } from '@/lib/data';
import { timeAgo } from '@/lib/timeAgo';

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
};

const PropertyDetail = () => {
  const { id } = useParams();
  const { user, hasRole } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) { setError(true); setLoading(false); return; }
      
      const { data, error: err } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (err || !data) {
        // Fallback to dummy data (e.g. when DB fetch fails in preview)
        const dummy = dummyProperties.find(p => p.id === id);
        if (dummy) {
          setProperty({
            ...dummy,
            property_type: dummy.propertyType,
            area_unit: dummy.areaUnit,
            approval_type: dummy.approvalType,
            risk_level: dummy.riskLevel,
            rera_registered: dummy.reraRegistered,
            title_verified: dummy.titleVerified,
            possession_verified: dummy.possessionVerified,
          });
        } else {
          setError(true);
        }
      } else {
        if (!hasRole('admin') && (data.status !== 'approved' || !data.visible)) {
          setError(true);
        } else {
          setProperty(data);
        }
      }
      setLoading(false);
    };
    fetchProperty();
  }, [id, hasRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-16 container mx-auto px-4">
          <Skeleton className="h-8 w-48 mt-4 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 md:h-96 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-serif text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
          <Button variant="gold" asChild><Link to="/properties">Browse Properties</Link></Button>
        </div>
      </div>
    );
  }

  const riskColor = property.risk_level === 'Low' ? 'text-success' : property.risk_level === 'Medium' ? 'text-warning' : 'text-destructive';
  const riskBg = property.risk_level === 'Low' ? 'bg-success/10' : property.risk_level === 'Medium' ? 'bg-warning/10' : 'bg-destructive/10';
  const imageUrl = property.images?.[0] || '/placeholder.svg';

  const VerifyBadge = ({ verified, label }: { verified: boolean; label: string }) => (
    <div className="flex items-center gap-2 py-2">
      {verified ? <CheckCircle className="w-5 h-5 text-success" /> : <XCircle className="w-5 h-5 text-destructive/50" />}
      <span className={`text-sm ${verified ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
    </div>
  );

  const listingLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description: property.description,
    image: imageUrl,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: property.sold_out ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
    category: property.property_type,
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${property.title} — Nagpur`}
        description={(property.description || `${property.property_type} in ${property.location}, Nagpur. ${property.area} ${property.area_unit}. ${property.approval_type || ''}`).slice(0, 160)}
        canonical={`/property/${property.id}`}
        image={imageUrl}
        type="product"
        jsonLd={listingLd}
      />
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 mt-4">
            <ArrowLeft className="w-4 h-4" /> Back to Properties
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative h-64 md:h-96 bg-muted rounded-2xl overflow-hidden">
                <img src={imageUrl} alt={`${property.title} in ${property.location}, Nagpur`} className={`w-full h-full object-cover ${property.sold_out ? 'opacity-60 grayscale' : ''}`} />
                {property.sold_out && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-destructive text-destructive-foreground text-2xl font-bold px-8 py-3 rounded-full uppercase tracking-widest rotate-[-8deg] shadow-2xl">
                      Sold Out
                    </div>
                  </div>
                )}
                {property.verified && !property.sold_out && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-success/90 text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-4 h-4" /> V-Audit Verified
                  </div>
                )}
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm mb-2">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {property.location}, Nagpur</span>
                  {property.created_at && (
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Listed {timeAgo(property.created_at)}</span>
                  )}
                  {property.sold_out && (
                    <span className="text-destructive font-semibold uppercase text-xs tracking-wider">Sold Out</span>
                  )}
                </div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">{property.title}</h1>
                <p className="text-muted-foreground leading-relaxed mb-6">{property.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Price', value: formatPrice(property.price) },
                    { label: 'Area', value: `${property.area} ${property.area_unit}` },
                    { label: 'Type', value: property.property_type },
                    { label: 'Approval', value: property.approval_type || 'N/A' },
                  ].map(d => (
                    <div key={d.label} className="bg-muted rounded-lg p-4">
                      <div className="text-xs text-muted-foreground mb-1">{d.label}</div>
                      <div className="font-semibold text-foreground text-sm">{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
                <h3 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-gold" /> V-Audit™ Report
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <VerifyBadge verified={property.verified ?? false} label="NMRDA/NIT Approved" />
                  <VerifyBadge verified={property.rera_registered ?? false} label="RERA Registered" />
                  <VerifyBadge verified={property.title_verified ?? false} label="30-Year Title Verified" />
                  <VerifyBadge verified={property.possession_verified ?? false} label="Possession Verified" />
                </div>
                <div className={`mt-4 inline-flex items-center gap-2 ${riskBg} px-4 py-2 rounded-lg`}>
                  <span className="text-sm font-medium text-foreground">Legal Risk:</span>
                  <span className={`font-bold ${riskColor}`}>{property.risk_level}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 sticky top-24">
                <div className="text-2xl font-bold text-navy mb-1">{formatPrice(property.price)}</div>
                <div className="text-sm text-muted-foreground mb-6">
                  {property.area} {property.area_unit} • {property.property_type}
                </div>
                <div className="space-y-3">
                  {(() => {
                    const propertyLink = `${window.location.origin}/property/${property.id}`;
                    const waUrl = (msg: string) =>
                      `https://wa.me/918010615388?text=${encodeURIComponent(msg)}`;
                    const visitMsg = `Hi, I'd like to book a site visit for "${property.title}" at ${property.location}, Nagpur. Please help me schedule a convenient time. Link: ${propertyLink}`;
                    const detailsMsg = `Hi, I'd like more details about "${property.title}" at ${property.location}, Nagpur (V-Audit report, documents, pricing, etc.). Link: ${propertyLink}`;
                    const expertMsg = `Hi, I'm interested in this property: ${property.title} located at ${property.location}, Nagpur. Please share more details. Link: ${propertyLink}`;
                    return property.sold_out ? (
                      <div className="w-full bg-destructive/10 text-destructive text-center font-semibold py-3 rounded-lg uppercase tracking-wide text-sm">
                        This property is sold out
                      </div>
                    ) : (
                      <>
                        <Button variant="gold" className="w-full" size="lg" asChild>
                          <a href={waUrl(visitMsg)} target="_blank" rel="noopener noreferrer">
                            <Calendar className="w-4 h-4 mr-2" /> Book Site Visit
                          </a>
                        </Button>
                        <Button variant="navy" className="w-full" size="lg" asChild>
                          <a href={waUrl(detailsMsg)} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Us for More Details
                          </a>
                        </Button>
                        <Button variant="outline" className="w-full" size="lg" asChild>
                          <a href={waUrl(expertMsg)} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="w-4 h-4 mr-2" /> Talk to Expert
                          </a>
                        </Button>
                      </>
                    );
                  })()}
                </div>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground text-center">
                    🔒 Your details are safe with us. We never share your information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PropertyDetail;
