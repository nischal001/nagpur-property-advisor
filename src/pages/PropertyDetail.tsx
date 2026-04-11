import { useParams, Link } from 'react-router-dom';
import { MapPin, ShieldCheck, FileCheck, CheckCircle, XCircle, ArrowLeft, Phone, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { dummyProperties, formatPrice, getPropertyImage } from '@/lib/data';

const PropertyDetail = () => {
  const { id } = useParams();
  const property = dummyProperties.find(p => p.id === id);

  if (!property) {
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

  const riskColor = property.riskLevel === 'Low' ? 'text-success' : property.riskLevel === 'Medium' ? 'text-warning' : 'text-destructive';
  const riskBg = property.riskLevel === 'Low' ? 'bg-success/10' : property.riskLevel === 'Medium' ? 'bg-warning/10' : 'bg-destructive/10';

  const VerifyBadge = ({ verified, label }: { verified: boolean; label: string }) => (
    <div className="flex items-center gap-2 py-2">
      {verified ? <CheckCircle className="w-5 h-5 text-success" /> : <XCircle className="w-5 h-5 text-destructive/50" />}
      <span className={`text-sm ${verified ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 mt-4">
            <ArrowLeft className="w-4 h-4" /> Back to Properties
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative h-64 md:h-96 bg-muted rounded-2xl overflow-hidden">
                <img
                  src={getPropertyImage(property)}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  width={800}
                  height={600}
                />
                {property.verified && (
                  <div className="absolute top-4 left-4 flex items-center gap-1 bg-success/90 text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-full">
                    <ShieldCheck className="w-4 h-4" /> V-Audit Verified
                  </div>
                )}
              </div>

              <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <MapPin className="w-4 h-4" /> {property.location}, Nagpur
                </div>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">{property.title}</h1>
                <p className="text-muted-foreground leading-relaxed mb-6">{property.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Price', value: formatPrice(property.price) },
                    { label: 'Area', value: `${property.area} ${property.areaUnit}` },
                    { label: 'Type', value: property.propertyType },
                    { label: 'Approval', value: property.approvalType },
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
                  <VerifyBadge verified={property.verified} label="NMRDA/NIT Approved" />
                  <VerifyBadge verified={property.reraRegistered} label="RERA Registered" />
                  <VerifyBadge verified={property.titleVerified} label="30-Year Title Verified" />
                  <VerifyBadge verified={property.possessionVerified} label="Possession Verified" />
                </div>
                <div className={`mt-4 inline-flex items-center gap-2 ${riskBg} px-4 py-2 rounded-lg`}>
                  <span className="text-sm font-medium text-foreground">Legal Risk:</span>
                  <span className={`font-bold ${riskColor}`}>{property.riskLevel}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-card border border-border/50 sticky top-24">
                <div className="text-2xl font-bold text-navy mb-1">{formatPrice(property.price)}</div>
                <div className="text-sm text-muted-foreground mb-6">
                  {property.area} {property.areaUnit} • {property.propertyType}
                </div>
                <div className="space-y-3">
                  <Button variant="gold" className="w-full" size="lg">
                    <Calendar className="w-4 h-4 mr-2" /> Book Site Visit
                  </Button>
                  <Button variant="navy" className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" /> Download Report
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="w-4 h-4 mr-2" /> Talk to Expert
                  </Button>
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
