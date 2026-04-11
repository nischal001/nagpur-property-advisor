import property1 from '@/assets/property-1.jpg';
import property2 from '@/assets/property-2.jpg';
import property3 from '@/assets/property-3.jpg';
import property4 from '@/assets/property-4.jpg';
import property5 from '@/assets/property-5.jpg';
import property6 from '@/assets/property-6.jpg';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  propertyType: 'Agriculture Land' | 'Plot' | 'Residential' | 'Shop' | 'Office';
  area: number;
  areaUnit: string;
  approvalType: 'NMRDA Approved' | 'NIT Approved' | 'RL' | 'Gram Panchayat';
  status: 'pending' | 'approved' | 'rejected';
  verified: boolean;
  reraRegistered: boolean;
  titleVerified: boolean;
  possessionVerified: boolean;
  riskLevel: 'Low' | 'Medium' | 'High';
  images: string[];
  sellerId: string;
  createdAt: string;
}

export const LOCATIONS = [
  'Dharampeth', 'Sadar', 'Civil Lines', 'Manish Nagar', 'Wardha Road',
  'Hingna', 'Kamptee', 'Koradi', 'Besa', 'Manewada',
  'Pratap Nagar', 'Laxmi Nagar', 'Ramdaspeth', 'Sitabuldi', 'Trimurti Nagar'
];

export const PROPERTY_TYPES = ['Agriculture Land', 'Plot', 'Residential', 'Shop', 'Office'] as const;
export const APPROVAL_TYPES = ['NMRDA Approved', 'NIT Approved', 'RL', 'Gram Panchayat'] as const;

// Map dummy property titles to local images as fallback
export const PROPERTY_IMAGES: Record<string, string> = {
  'Plot': property1,
  'Residential': property2,
  'Agriculture Land': property3,
  'Shop': property4,
  'Office': property5,
};

export const DUMMY_IMAGES = [property1, property2, property3, property4, property5, property6];

export function getPropertyImage(property: Property, index = 0): string {
  if (property.images && property.images.length > 0 && property.images[0]) {
    return property.images[0];
  }
  return PROPERTY_IMAGES[property.propertyType] || DUMMY_IMAGES[index % DUMMY_IMAGES.length];
}

export const dummyProperties: Property[] = [
  {
    id: '1', title: 'Premium Residential Plot in Manish Nagar',
    description: 'Well-developed residential plot with all amenities nearby. NMRDA approved layout with clear titles and ready for construction.',
    price: 4500000, location: 'Manish Nagar', propertyType: 'Plot', area: 2400, areaUnit: 'sq ft',
    approvalType: 'NMRDA Approved', status: 'approved', verified: true, reraRegistered: true,
    titleVerified: true, possessionVerified: true, riskLevel: 'Low', images: [], sellerId: 's1', createdAt: '2026-04-01',
  },
  {
    id: '2', title: '3BHK Luxury Apartment in Dharampeth',
    description: 'Spacious 3BHK apartment in prime Dharampeth location with modern amenities, parking, and 24/7 security.',
    price: 12500000, location: 'Dharampeth', propertyType: 'Residential', area: 1800, areaUnit: 'sq ft',
    approvalType: 'NIT Approved', status: 'approved', verified: true, reraRegistered: true,
    titleVerified: true, possessionVerified: true, riskLevel: 'Low', images: [], sellerId: 's2', createdAt: '2026-03-28',
  },
  {
    id: '3', title: 'Agriculture Land near Hingna MIDC',
    description: 'Fertile agriculture land ideal for farming or future development. Well-connected to Hingna MIDC.',
    price: 8000000, location: 'Hingna', propertyType: 'Agriculture Land', area: 1, areaUnit: 'acre',
    approvalType: 'Gram Panchayat', status: 'approved', verified: true, reraRegistered: false,
    titleVerified: true, possessionVerified: true, riskLevel: 'Medium', images: [], sellerId: 's3', createdAt: '2026-03-25',
  },
  {
    id: '4', title: 'Commercial Shop in Sitabuldi',
    description: 'Prime commercial shop in the heart of Sitabuldi market. High footfall area, ready for immediate business setup.',
    price: 6500000, location: 'Sitabuldi', propertyType: 'Shop', area: 450, areaUnit: 'sq ft',
    approvalType: 'NIT Approved', status: 'approved', verified: true, reraRegistered: true,
    titleVerified: true, possessionVerified: false, riskLevel: 'Low', images: [], sellerId: 's4', createdAt: '2026-03-20',
  },
  {
    id: '5', title: 'Office Space in Ramdaspeth',
    description: 'Modern office space in commercial hub of Ramdaspeth. Fully furnished with AC and parking.',
    price: 9500000, location: 'Ramdaspeth', propertyType: 'Office', area: 1200, areaUnit: 'sq ft',
    approvalType: 'NMRDA Approved', status: 'approved', verified: true, reraRegistered: true,
    titleVerified: true, possessionVerified: true, riskLevel: 'Low', images: [], sellerId: 's5', createdAt: '2026-03-15',
  },
  {
    id: '6', title: 'Residential Plot in Besa',
    description: 'Affordable residential plot in developing Besa area. Good connectivity and growing infrastructure.',
    price: 2200000, location: 'Besa', propertyType: 'Plot', area: 1500, areaUnit: 'sq ft',
    approvalType: 'NMRDA Approved', status: 'approved', verified: false, reraRegistered: false,
    titleVerified: true, possessionVerified: true, riskLevel: 'Medium', images: [], sellerId: 's6', createdAt: '2026-03-10',
  },
];

export function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
  return `₹${price.toLocaleString('en-IN')}`;
}
