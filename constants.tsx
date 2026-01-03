
import { Category, PaymentPlan, Product, Manufacturer, ManufacturerStatus } from './types';

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

// Mock data removed as requested. System starts clean.
export const MOCK_MANUFACTURERS: Manufacturer[] = [];
export const MOCK_PRODUCTS: Product[] = [];
