import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Property, formatPrice, getPropertyImage } from '@/lib/data';
import { timeAgo } from '@/lib/timeAgo';

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
        alt={`${property.title} — ${property.propertyType} in ${property.location}, Nagpur`}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${property.soldOut ? 'opacity-60 grayscale' : ''}`}
        loading="lazy"
        width={800}
        height={600}
      />
      {property.soldOut && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-destructive text-destructive-foreground text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider rotate-[-8deg] shadow-lg">
            Sold Out
          </div>
        </div>
      )}
      {property.verified && !property.soldOut && (
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-success/90 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3 h-3" /> Verified
        </div>
      )}
      <div className="absolute top-3 right-3 bg-navy-dark/80 text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
        {property.approvalType}
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between text-muted-foreground text-xs mb-2">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {property.location}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(property.createdAt)}</span>
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
        <Button variant={property.soldOut ? 'outline' : 'gold'} size="sm" disabled={property.soldOut}>
          {property.soldOut ? 'Sold Out' : 'View Details'}
        </Button>
      </div>
    </div>
  </Link>
);

export default PropertyCard;
