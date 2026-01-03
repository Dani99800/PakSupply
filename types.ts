
export enum UserRole {
  ADMIN = 'ADMIN',
  MANUFACTURER = 'MANUFACTURER',
  SHOPKEEPER = 'SHOPKEEPER'
}

export enum ManufacturerStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  SUSPENDED = 'SUSPENDED'
}

export enum PlacementTier {
  PREMIUM = 'PREMIUM',
  STANDARD = 'STANDARD',
  BASIC = 'BASIC'
}

export interface Category {
  id: string;
  name: string;
  enabled: boolean;
}

export interface Product {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  description: string;
  imageUrls: string[]; 
  isIsraelFree: boolean;
  isIsraelFreeApproved: boolean;
  status: 'ACTIVE' | 'DISABLED' | 'PENDING';
}

export interface Manufacturer {
  id: string;
  email: string;
  password?: string;
  phone: string;
  companyName: string;
  ownerName: string;
  ownerPhone: string;
  managerPhone?: string;
  address: string;
  city: string;
  status: ManufacturerStatus;
  placementTier: PlacementTier;
  isTrustedPartner: boolean; // Managed manually by Admin
  plan?: string;
  isIsraelFreeClaim: boolean;
  governmentDocUrl?: string; 
  signupDate: string;
  rating?: number;
  ratingCount?: number;
}

export interface ShopkeeperProfile {
  id: string;
  email: string;
  password?: string;
  shopName: string;
  ownerName: string;
  city: string;
  phone: string;
  address: string;
  shopPhoto?: string;
}

export interface Rating {
  id: string;
  manufacturerId: string;
  shopkeeperId: string;
  stars: number;
  comment?: string;
  date: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  description: string;
}
