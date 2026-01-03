
import { Category, PaymentPlan, Product, Manufacturer, ManufacturerStatus, PlacementTier } from './types';
import { 
  Soap, Trash2, Waves, Sparkles, Home, 
  Smile, Cookie, Coffee, Package 
} from 'lucide-react';

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

export const CATEGORY_ICONS: Record<string, any> = {
  'Bath Soap': Soap,
  'Detergent (Powder / Bar)': Trash2,
  'Dishwash & Kitchen Cleaning': Waves,
  'Shampoo & Personal Care': Sparkles,
  'Home & Surface Cleaning': Home,
  'Toothpaste & Oral Care': Smile,
  'Snacks & Biscuits': Cookie,
  'Beverages & Juices': Coffee,
  'All': Package
};

export const PLANS: PaymentPlan[] = [
  { id: 'intro', name: 'Introductory Trial', price: 5000, description: 'Valid until first order is generated' },
  { id: 'monthly', name: 'Standard Monthly', price: 10000, description: 'Billed monthly' },
  { id: '6months', name: '6 Months Plan', price: 60000, description: 'Billed every 6 months' },
  { id: '12months', name: '12 Months Plan', price: 120000, description: 'Billed annually' },
];

// Mock Manufacturers (Trusted Partners) - 3 per core category
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
  },
  {
    id: 'm-4',
    email: 'hello@khybersoaps.pk',
    companyName: 'Khyber Pure Soaps',
    phone: '03339998877',
    ownerName: 'Abid Khan',
    ownerPhone: '03339998877',
    address: 'Hayatabad Industrial Estate, Peshawar',
    city: 'Peshawar',
    status: ManufacturerStatus.APPROVED,
    placementTier: PlacementTier.PREMIUM,
    isTrustedPartner: true,
    isIsraelFreeClaim: true,
    signupDate: new Date().toISOString(),
    rating: 4.5,
    ratingCount: 62
  },
  {
    id: 'm-5',
    email: 'orders@punjabfoods.pk',
    companyName: 'Punjab Food Industries',
    phone: '03445551122',
    ownerName: 'M. Shafiq',
    ownerPhone: '03445551122',
    address: 'Ferozepur Road, Lahore',
    city: 'Lahore',
    status: ManufacturerStatus.APPROVED,
    placementTier: PlacementTier.PREMIUM,
    isTrustedPartner: true,
    isIsraelFreeClaim: true,
    signupDate: new Date().toISOString(),
    rating: 4.9,
    ratingCount: 340
  }
];

// Comprehensive Mock Products
export const MOCK_PRODUCTS: Product[] = [
  // Bath Soap Category
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
    id: 'p-401',
    manufacturerId: 'm-4',
    manufacturerName: 'Khyber Pure Soaps',
    name: 'Khyber Rose Luxury Soap',
    brand: 'KhyberPure',
    category: 'Bath Soap',
    price: 390,
    description: 'Traditional rose scented luxury soap bars.',
    imageUrls: ['https://images.unsplash.com/photo-1605264964521-324735175d9e?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  {
    id: 'p-402',
    manufacturerId: 'm-3',
    manufacturerName: 'Lahore Organics FMCG',
    name: 'Activated Charcoal Soap',
    brand: 'OrganicClean',
    category: 'Bath Soap',
    price: 550,
    description: 'Deep cleansing charcoal soap for oily skin.',
    imageUrls: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  // Detergent Category
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
    id: 'p-301',
    manufacturerId: 'm-3',
    manufacturerName: 'Lahore Organics FMCG',
    name: 'Bio-Friendly Washing Bar',
    brand: 'OrganicClean',
    category: 'Detergent (Powder / Bar)',
    price: 120,
    description: 'Natural ingredients that are soft on hands but tough on dirt.',
    imageUrls: ['https://images.unsplash.com/photo-1590621466441-83ca23396761?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  // Snacks & Biscuits
  {
    id: 'p-501',
    manufacturerId: 'm-5',
    manufacturerName: 'Punjab Food Industries',
    name: 'Crunchy Cumin Biscuits (Carton)',
    brand: 'PunjabTreats',
    category: 'Snacks & Biscuits',
    price: 2400,
    description: 'Bulk carton of 24 packs. Best selling cumin flavored biscuits.',
    imageUrls: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  {
    id: 'p-502',
    manufacturerId: 'm-5',
    manufacturerName: 'Punjab Food Industries',
    name: 'Tea Time Rusk (Pack of 12)',
    brand: 'PunjabTreats',
    category: 'Snacks & Biscuits',
    price: 1800,
    description: 'Golden baked crispy rusks for the perfect tea time.',
    imageUrls: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  // Shampoo
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
  }
];
