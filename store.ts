
import { 
  Manufacturer, Product, ManufacturerStatus, Category, 
  ShopkeeperProfile, PlacementTier, ShopProduct, ConsumerOrder 
} from './types';
import { CATEGORIES, MOCK_MANUFACTURERS, MOCK_PRODUCTS, MOCK_SHOPS } from './constants';
import { supabase } from './supabase';

export const DB = {
  // Existing B2B Methods
  getManufacturers: async (): Promise<Manufacturer[]> => {
    let mfrs: Manufacturer[] = [];
    const { data, error } = await supabase.from('manufacturers').select('*');
    if (error || !data) {
       const local = localStorage.getItem('ps_db_mfrs');
       mfrs = local ? JSON.parse(local) : [];
    } else {
      mfrs = data.map(m => ({
        id: m.id,
        email: m.email,
        password: m.password,
        phone: m.phone,
        companyName: m.company_name,
        ownerName: m.owner_name || '',
        ownerPhone: m.owner_phone || '',
        managerPhone: m.manager_phone || '',
        address: m.address || '',
        city: m.city,
        status: m.status as ManufacturerStatus,
        placementTier: (m.placement_tier as PlacementTier) || PlacementTier.BASIC,
        isTrustedPartner: !!m.is_trusted_partner,
        plan: m.plan,
        isIsraelFreeClaim: m.is_israel_free_claim,
        governmentDocUrl: m.government_doc_url,
        signup_date: m.signup_date,
        rating: m.rating || 0,
        rating_count: m.rating_count || 0
      }));
    }
    const merged = [...MOCK_MANUFACTURERS];
    mfrs.forEach(m => { if (!merged.find(x => x.id === m.id)) merged.push(m); });
    return merged;
  },

  saveManufacturer: async (m: Manufacturer) => {
    const list = JSON.parse(localStorage.getItem('ps_db_mfrs') || '[]');
    const index = list.findIndex((item: any) => item.id === m.id);
    if (index > -1) list[index] = m; else list.push(m);
    localStorage.setItem('ps_db_mfrs', JSON.stringify(list));
  },

  updateManufacturerProp: async (id: string, props: Partial<Manufacturer>) => {
    const list = JSON.parse(localStorage.getItem('ps_db_mfrs') || '[]');
    const index = list.findIndex((item: any) => item.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...props };
      localStorage.setItem('ps_db_mfrs', JSON.stringify(list));
    }
  },

  getProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase.from('products').select('*');
    let prods: Product[] = [];
    if (error || !data) {
      const local = localStorage.getItem('ps_db_prods');
      prods = local ? JSON.parse(local) : [];
    } else {
      prods = data.map(p => ({
        ...p,
        imageUrls: typeof p.image_urls === 'string' ? JSON.parse(p.image_urls) : (p.image_urls || []),
        orderWhatsApp: p.order_whatsapp
      })) as Product[];
    }
    const mergedProds = [...MOCK_PRODUCTS];
    prods.forEach(p => { if (!mergedProds.find(x => x.id === p.id)) mergedProds.push(p); });
    return mergedProds;
  },

  saveProduct: async (p: Product) => {
    const list = JSON.parse(localStorage.getItem('ps_db_prods') || '[]');
    const index = list.findIndex((item: any) => item.id === p.id);
    if (index > -1) list[index] = p; else list.push(p);
    localStorage.setItem('ps_db_prods', JSON.stringify(list));
  },

  updateProductStatus: async (id: string, status: 'ACTIVE' | 'DISABLED' | 'PENDING', isApproved?: boolean) => {
    const list = JSON.parse(localStorage.getItem('ps_db_prods') || '[]');
    const index = list.findIndex((item: any) => item.id === id);
    if (index > -1) {
      list[index].status = status;
      if (isApproved !== undefined) list[index].isIsraelFreeApproved = isApproved;
      localStorage.setItem('ps_db_prods', JSON.stringify(list));
    }
  },

  // B2C Shop Management
  getAllShops: async (): Promise<ShopkeeperProfile[]> => {
    const local = localStorage.getItem('ps_db_shops');
    const dbShops = local ? JSON.parse(local) : [];
    
    // Merge mock shops with DB shops
    const merged = [...MOCK_SHOPS];
    dbShops.forEach((s: ShopkeeperProfile) => {
      if (!merged.find(x => x.id === s.id)) merged.push(s);
    });
    return merged;
  },

  getShopkeeperProfiles: async (): Promise<ShopkeeperProfile[]> => {
    return await DB.getAllShops();
  },

  getShopInventory: async (shopId: string): Promise<ShopProduct[]> => {
    const key = `ps_inventory_${shopId}`;
    const local = localStorage.getItem(key);
    return local ? JSON.parse(local) : [];
  },

  saveShopProduct: async (shopId: string, sp: ShopProduct) => {
    const key = `ps_inventory_${shopId}`;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const idx = list.findIndex((x: any) => x.id === sp.id);
    if (idx > -1) list[idx] = sp; else list.push(sp);
    localStorage.setItem(key, JSON.stringify(list));
  },

  saveConsumerOrder: async (order: ConsumerOrder) => {
    const list = JSON.parse(localStorage.getItem('ps_db_consumer_orders') || '[]');
    list.push(order);
    localStorage.setItem('ps_db_consumer_orders', JSON.stringify(list));
  },

  getShopOrders: async (shopId: string): Promise<ConsumerOrder[]> => {
    const all = JSON.parse(localStorage.getItem('ps_db_consumer_orders') || '[]');
    return all.filter((o: any) => o.shopId === shopId);
  },

  updateConsumerOrderStatus: async (orderId: string, status: ConsumerOrder['status']) => {
    const all = JSON.parse(localStorage.getItem('ps_db_consumer_orders') || '[]');
    const order = all.find((o: any) => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem('ps_db_consumer_orders', JSON.stringify(all));
    }
  },

  saveShopkeeperProfile: (profile: ShopkeeperProfile) => {
    const list = JSON.parse(localStorage.getItem('ps_db_shops') || '[]');
    const index = list.findIndex((item: any) => item.id === profile.id);
    if (index > -1) list[index] = profile; else list.push(profile);
    localStorage.setItem('ps_db_shops', JSON.stringify(list));
    localStorage.setItem('ps_shopkeeper_active', JSON.stringify(profile));
  },

  getActiveShopkeeper: (): ShopkeeperProfile | null => {
    const data = localStorage.getItem('ps_shopkeeper_active');
    return data ? JSON.parse(data) : null;
  },

  getCategories: (): Category[] => CATEGORIES
};
