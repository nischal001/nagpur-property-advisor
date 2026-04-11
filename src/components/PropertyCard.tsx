import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Property, formatPrice, getPropertyImage } from '@/lib/data';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => (
  <Link
    to={`/property/${property.id}`}
    className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group border border-border/50 hover:border-gold/30 block"
  >
    <div className="relative h-48 bg-muted overflow-hidden">
      <img
        src={getPropertyImage(property, index)}
        alt={property.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        width={800}
        height={600}
      />
      {property.verified && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-success/90 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3 h-3" /> Verified
        </div>
      )}
      <div className="absolute top-3 right-3 bg-navy-dark/80 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
        {property.approvalType}
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
        <MapPin className="w-3 h-3" /> {property.location}
      </div>
      <h3 className="font-serif font-semibold text-foreground text-base mb-2 group-hover:text-navy-light transition-colors line-clamp-2">
        {property.title}
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{property.propertyType}</span>
        <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{property.area} {property.areaUnit}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-navy">{formatPrice(property.price)}</span>
        <Button variant="gold" size="sm">View Details</Button>
      </div>
    </div>
  </Link>
);

export default PropertyCard;
