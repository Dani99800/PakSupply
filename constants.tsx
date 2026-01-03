
import { Category, PaymentPlan, Product, Manufacturer, ManufacturerStatus, PlacementTier } from './types';

export const ADMIN_WHATSAPP = "03463904137";

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Bath Soap', enabled: true },
  { id: '2', name: 'Detergent (Powder / Bar)', enabled: true },
  { id: '3', name: 'Dishwash & Kitchen Cleaning', enabled: true },
  { id: '4', name: 'Shampoo & Personal Care', enabled: true },
  { id: '5', name: 'Home & Surface Cleaning', enabled: true },
  { id: '6', name: 'Toothpaste & Oral Care', enabled: true },
  { id: '7', name: 'Snacks & Biscuits', enabled: true },
  { id: '8', name: 'Beverages & Juices', enabled: true },
];

export const PLANS: PaymentPlan[] = [
  { id: 'intro', name: 'Introductory Trial', price: 5000, description: 'Valid until first order is generated' },
  { id: 'monthly', name: 'Standard Monthly', price: 10000, description: 'Billed monthly' },
  { id: '6months', name: '6 Months Plan', price: 60000, description: 'Billed every 6 months' },
  { id: '12months', name: '12 Months Plan', price: 120000, description: 'Billed annually' },
];

// Mock Manufacturers (Trusted Partners)
export const MOCK_MANUFACTURERS: Manufacturer[] = [
  {
    id: 'm-1',
    email: 'contact@induscare.pk',
    companyName: 'Indus Care Pakistan',
    phone: '03001234567',
    ownerName: 'Zubair Ahmed',
    ownerPhone: '03001234567',
    address: 'S.I.T.E Area, Karachi',
    city: 'Karachi',
    status: ManufacturerStatus.APPROVED,
    placementTier: PlacementTier.PREMIUM,
    isTrustedPartner: true,
    isIsraelFreeClaim: true,
    signupDate: new Date().toISOString(),
    rating: 4.9,
    ratingCount: 128
  },
  {
    id: 'm-2',
    email: 'info@paksuds.com',
    companyName: 'PakSuds Cleaning Solutions',
    phone: '03112223344',
    ownerName: 'Imran Khan',
    ownerPhone: '03112223344',
    address: 'Industrial Estate, Multan',
    city: 'Multan',
    status: ManufacturerStatus.APPROVED,
    placementTier: PlacementTier.PREMIUM,
    isTrustedPartner: true,
    isIsraelFreeClaim: true,
    signupDate: new Date().toISOString(),
    rating: 4.7,
    ratingCount: 85
  },
  {
    id: 'm-3',
    email: 'sales@lahoreorganics.pk',
    companyName: 'Lahore Organics FMCG',
    phone: '03225556677',
    ownerName: 'Sara Ali',
    ownerPhone: '03225556677',
    address: 'Quaid-e-Azam Industrial Estate, Lahore',
    city: 'Lahore',
    status: ManufacturerStatus.APPROVED,
    placementTier: PlacementTier.PREMIUM,
    isTrustedPartner: true,
    isIsraelFreeClaim: true,
    signupDate: new Date().toISOString(),
    rating: 4.8,
    ratingCount: 210
  }
];

// Mock Products
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    manufacturerId: 'm-1',
    manufacturerName: 'Indus Care Pakistan',
    name: 'Pure Neem Bath Soap (Pack of 6)',
    brand: 'IndusCare',
    category: 'Bath Soap',
    price: 450,
    description: 'Antiseptic neem soap for healthy skin. 100% Organic ingredients.',
    imageUrls: ['https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  {
    id: 'p-2',
    manufacturerId: 'm-1',
    manufacturerName: 'Indus Care Pakistan',
    name: 'Anti-Dandruff Shampoo 400ml',
    brand: 'HairGlow',
    category: 'Shampoo & Personal Care',
    price: 380,
    description: 'Professional grade anti-dandruff formula with Aloe Vera.',
    imageUrls: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  {
    id: 'p-3',
    manufacturerId: 'm-2',
    manufacturerName: 'PakSuds Cleaning Solutions',
    name: 'Ultra Suds Detergent 1kg',
    brand: 'PakSuds',
    category: 'Detergent (Powder / Bar)',
    price: 290,
    description: 'High efficiency washing powder for tough stains.',
    imageUrls: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  {
    id: 'p-4',
    manufacturerId: 'm-3',
    manufacturerName: 'Lahore Organics FMCG',
    name: 'Lemon Fresh Dishwash 500ml',
    brand: 'OrganicClean',
    category: 'Dishwash & Kitchen Cleaning',
    price: 180,
    description: 'Grease cutting formula with natural lemon extracts.',
    imageUrls: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  {
    id: 'p-5',
    manufacturerId: 'm-3',
    manufacturerName: 'Lahore Organics FMCG',
    name: 'Natural Rose Water 200ml',
    brand: 'OrganicClean',
    category: 'Shampoo & Personal Care',
    price: 150,
    description: 'Pure distillate of steam-distilled roses.',
    imageUrls: ['https://images.unsplash.com/photo-1626450639915-0f86539a2d04?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  {
    id: 'p-6',
    manufacturerId: 'm-2',
    manufacturerName: 'PakSuds Cleaning Solutions',
    name: 'Floor Shine 1L',
    brand: 'PakSuds',
    category: 'Home & Surface Cleaning',
    price: 320,
    description: 'Kills 99.9% germs and leaves a jasmine scent.',
    imageUrls: ['https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  }
];
