
export enum UserRole {
  ADMIN = 'ADMIN',
  MANUFACTURER = 'MANUFACTURER',
  SHOPKEEPER = 'SHOPKEEPER',
  BUYER = 'BUYER'
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
  orderWhatsApp?: string;
}

// B2C Extensions
export interface ShopProduct extends Partial<Product> {
  shopId: string;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK';
  salePrice: number;
}

export interface ConsumerOrder {
  id: string;
  shopId: string;
  customerName: string;
  customerPhone: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  type: 'PICKUP' | 'DELIVERY';
  address?: string;
  status: 'PENDING' | 'ACCEPTED' | 'READY' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
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
  isTrustedPartner: boolean;
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
  area: string;      // New: Specific area like "Shah Faisal"
  street: string;    // New: Specific street/block
  phone: string;
  address: string;
  shopPhoto?: string;
  isDeliveryAvailable: boolean;
  isPickupAvailable: boolean;
  isOpen: boolean;
  qrCodeUrl?: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  description: string;
}
