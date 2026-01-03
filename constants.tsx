
import { Category, PaymentPlan, Product, Manufacturer, ManufacturerStatus, PlacementTier } from './types';
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

// Mock Manufacturers (Trusted Partners)
export const MOCK_MANUFACTURERS: Manufacturer[] = [
  // Soap & Personal Care Leaders
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
  },
  // Cleaning Solutions Experts
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
    id: 'm-7',
    email: 'orders@cleanmaster.pk',
    companyName: 'CleanMaster Chemical Co',
    phone: '03215554433',
    ownerName: 'Sajid Ali',
    ownerPhone: '03215554433',
    address: 'Faisalabad Industrial Zone',
    city: 'Faisalabad',
    status: ManufacturerStatus.APPROVED,
    placementTier: PlacementTier.PREMIUM,
    isTrustedPartner: true,
    isIsraelFreeClaim: true,
    signupDate: new Date().toISOString(),
    rating: 4.6,
    ratingCount: 110
  },
  {
    id: 'm-8',
    email: 'info@superwash.pk',
    companyName: 'SuperWash Detergents',
    phone: '03456667788',
    ownerName: 'Kamran Shah',
    ownerPhone: '03456667788',
    address: 'Hub Industrial Area, Lasbela',
    city: 'Hub',
    status: ManufacturerStatus.APPROVED,
    placementTier: PlacementTier.PREMIUM,
    isTrustedPartner: true,
    isIsraelFreeClaim: true,
    signupDate: new Date().toISOString(),
    rating: 4.4,
    ratingCount: 78
  },
  // Snacks & Beverages Specialists
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
  },
  {
    id: 'm-9',
    email: 'info@sindhbakes.pk',
    companyName: 'Sindh Bakes & Snacks',
    phone: '03123334455',
    ownerName: 'Yasir Ahmed',
    ownerPhone: '03123334455',
    address: 'Nooriabad Industrial Estate',
    city: 'Nooriabad',
    status: ManufacturerStatus.APPROVED,
    placementTier: PlacementTier.PREMIUM,
    isTrustedPartner: true,
    isIsraelFreeClaim: true,
    signupDate: new Date().toISOString(),
    rating: 4.7,
    ratingCount: 156
  },
  {
    id: 'm-10',
    email: 'sales@frontierfoods.pk',
    companyName: 'Frontier Food Co',
    phone: '03310009988',
    ownerName: 'Gul Khan',
    ownerPhone: '03310009988',
    address: 'Peshawar Road, Rawalpindi',
    city: 'Rawalpindi',
    status: ManufacturerStatus.APPROVED,
    placementTier: PlacementTier.PREMIUM,
    isTrustedPartner: true,
    isIsraelFreeClaim: true,
    signupDate: new Date().toISOString(),
    rating: 4.8,
    ratingCount: 204
  }
];

// Comprehensive Mock Products
export const MOCK_PRODUCTS: Product[] = [
  // Bath Soap
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
  },

  // Detergent
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
    id: 'p-201',
    manufacturerId: 'm-7',
    manufacturerName: 'CleanMaster Chemical Co',
    name: 'MasterBlast Washing Bar (Pack of 12)',
    brand: 'MasterBlast',
    category: 'Detergent (Powder / Bar)',
    price: 1100,
    description: 'Heavy duty washing bars for laundry and household cleaning.',
    imageUrls: ['https://images.unsplash.com/photo-1590621466441-83ca23396761?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  {
    id: 'p-202',
    manufacturerId: 'm-8',
    manufacturerName: 'SuperWash Detergents',
    name: 'SuperWash Liquid Detergent 2L',
    brand: 'SuperWash',
    category: 'Detergent (Powder / Bar)',
    price: 650,
    description: 'Color-safe liquid detergent for premium fabrics.',
    imageUrls: ['https://images.unsplash.com/photo-1610557892470-55d9e80e0bce?auto=format&fit=crop&q=80&w=800'],
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
    id: 'p-701',
    manufacturerId: 'm-9',
    manufacturerName: 'Sindh Bakes & Snacks',
    name: 'Pista Delight Cookies',
    brand: 'SindhTreats',
    category: 'Snacks & Biscuits',
    price: 180,
    description: 'Premium pistachio cookies with real nut pieces.',
    imageUrls: ['https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  {
    id: 'p-702',
    manufacturerId: 'm-10',
    manufacturerName: 'Frontier Food Co',
    name: 'Frontier Spicy Nimko Mix 500g',
    brand: 'FrontierSpices',
    category: 'Snacks & Biscuits',
    price: 320,
    description: 'Authentic Peshawar style spicy nimko mix.',
    imageUrls: ['https://images.unsplash.com/photo-1621939514649-280e2ee1d446?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },

  // Beverages
  {
    id: 'p-801',
    manufacturerId: 'm-5',
    manufacturerName: 'Punjab Food Industries',
    name: 'Mango Blast Nectar 1L',
    brand: 'PunjabTreats',
    category: 'Beverages & Juices',
    price: 220,
    description: 'Rich and pulpy mango nectar made from real Sindri mangoes.',
    imageUrls: ['https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  {
    id: 'p-802',
    manufacturerId: 'm-9',
    manufacturerName: 'Sindh Bakes & Snacks',
    name: 'Fresh Orange Squash 750ml',
    brand: 'SindhTreats',
    category: 'Beverages & Juices',
    price: 350,
    description: 'Concentrated orange squash, perfect for refreshing summers.',
    imageUrls: ['https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  },
  {
    id: 'p-803',
    manufacturerId: 'm-10',
    manufacturerName: 'Frontier Food Co',
    name: 'Frontier Green Tea Packs (50 bags)',
    brand: 'FrontierSpices',
    category: 'Beverages & Juices',
    price: 480,
    description: 'Natural mountain-grown green tea from northern areas.',
    imageUrls: ['https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=800'],
    isIsraelFree: true,
    isIsraelFreeApproved: true,
    status: 'ACTIVE'
  }
];
