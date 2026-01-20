
import { Category, PaymentPlan, Product, Manufacturer, ManufacturerStatus, PlacementTier, ShopkeeperProfile } from './types';
import { 
  Droplets, Trash2, Waves, Sparkles, Home, 
  Smile, Cookie, Coffee, Package 
} from 'lucide-react';

export const ADMIN_WHATSAPP = "03462904137";

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
  'Bath Soap': Droplets,
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

export const MOCK_SHOPS: ShopkeeperProfile[] = [
  {
    id: 'shop-khi-1',
    email: 'ayaz@superstore.pk',
    shopName: 'Ayaz Super Store',
    ownerName: 'Ayaz Khan',
    city: 'Karachi',
    area: 'Shah Faisal Colony',
    street: 'Street No 5, Green Town',
    phone: '03462904137',
    address: 'Plot 45, Near Bilal Masjid, Shah Faisal, Karachi',
    shopPhoto: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&q=80&w=800',
    isDeliveryAvailable: true,
    isPickupAvailable: true,
    isOpen: true
  },
  {
    id: 'shop-lhr-1',
    email: 'punjab@grocery.pk',
    shopName: 'Lahore Grocery Hub',
    ownerName: 'M. Naveed',
    city: 'Lahore',
    area: 'Gulberg III',
    street: 'Main Market',
    phone: '03001122334',
    address: 'Shop 12, Gulberg Main Market, Lahore',
    shopPhoto: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=800',
    isDeliveryAvailable: true,
    isPickupAvailable: true,
    isOpen: true
  },
  {
    id: 'shop-isb-1',
    email: 'capital@essentials.pk',
    shopName: 'Capital Essentials',
    ownerName: 'Sajid Mir',
    city: 'Islamabad',
    area: 'F-7 Markaz',
    street: 'Jinnah Super',
    phone: '03112223344',
    address: 'Basement 4, F-7 Markaz, Islamabad',
    shopPhoto: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
    isDeliveryAvailable: false,
    isPickupAvailable: true,
    isOpen: true
  },
  {
    id: 'shop-fsd-1',
    email: 'lyallpur@grocers.pk',
    shopName: 'Lyallpur Grocers',
    ownerName: 'Usman Ghani',
    city: 'Faisalabad',
    area: 'Gole Market',
    street: 'Clock Tower Sector',
    phone: '03224445566',
    address: 'Shop 88, Gole Market, Faisalabad',
    shopPhoto: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=800',
    isDeliveryAvailable: true,
    isPickupAvailable: true,
    isOpen: true
  },
  {
    id: 'shop-mul-1',
    email: 'multan@mart.pk',
    shopName: 'Sufi General Store',
    ownerName: 'Kashif Ali',
    city: 'Multan',
    area: 'Cantt',
    street: 'Aziz Shaheed Road',
    phone: '03338887766',
    address: 'Plot 12-B, Cantt Plaza, Multan',
    shopPhoto: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    isDeliveryAvailable: true,
    isPickupAvailable: true,
    isOpen: true
  }
];

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
    id: 'm-6',
    email: 'sales@mehranorganic.pk',
    companyName: 'Mehran Organic Care',
    phone: '03009876543',
    ownerName: 'Bilal Mehran',
    ownerPhone: '03009876543',
    address: 'Kot Lakhpat, Lahore',
    city: 'Lahore',
    status: ManufacturerStatus.APPROVED,
    placementTier: PlacementTier.PREMIUM,
    isTrustedPartner: true,
    isIsraelFreeClaim: true,
    signupDate: new Date().toISOString(),
    rating: 4.8,
    ratingCount: 95
  }
];

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
    id: 'p-101',
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
    id: 'p-102',
    manufacturerId: 'm-6',
    manufacturerName: 'Mehran Organic Care',
    name: 'Lemon Zest Fresh Bar',
    brand: 'MehranCare',
    category: 'Bath Soap',
    price: 410,
    description: 'Invigorating lemon soap with natural glycerin.',
    imageUrls: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  }
];
