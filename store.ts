
import { Manufacturer, Product, ManufacturerStatus, Category, ShopkeeperProfile, PlacementTier } from './types';
import { CATEGORIES } from './constants';
import { supabase } from './supabase';

export const DB = {
  getManufacturers: async (): Promise<Manufacturer[]> => {
    const { data, error } = await supabase.from('manufacturers').select('*');
    if (error || !data) {
       const local = localStorage.getItem('ps_db_mfrs');
       return local ? JSON.parse(local) : [];
    }
    
    return data.map(m => ({
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
      signupDate: m.signup_date,
      rating: m.rating || 0,
      ratingCount: m.rating_count || 0
    }));
  },

  saveManufacturer: async (m: Manufacturer) => {
    const payload = {
      id: m.id,
      email: m.email,
      password: m.password,
      phone: m.phone,
      company_name: m.companyName,
      owner_name: m.ownerName,
      owner_phone: m.ownerPhone,
      manager_phone: m.managerPhone,
      address: m.address,
      city: m.city,
      status: m.status,
      placement_tier: m.placementTier,
      is_trusted_partner: m.isTrustedPartner,
      is_israel_free_claim: m.isIsraelFreeClaim,
      government_doc_url: m.governmentDocUrl,
      signup_date: m.signupDate
    };

    await supabase.from('manufacturers').upsert(payload);
    const list = JSON.parse(localStorage.getItem('ps_db_mfrs') || '[]');
    const index = list.findIndex((item: any) => item.id === m.id);
    if (index > -1) list[index] = m; else list.push(m);
    localStorage.setItem('ps_db_mfrs', JSON.stringify(list));
  },

  updateManufacturerProp: async (id: string, props: Partial<Manufacturer>) => {
    const update: any = {};
    if (props.status) update.status = props.status;
    if (props.isTrustedPartner !== undefined) update.is_trusted_partner = props.isTrustedPartner;
    if (props.placementTier) update.placement_tier = props.placementTier;

    await supabase.from('manufacturers').update(update).eq('id', id);
    const list = JSON.parse(localStorage.getItem('ps_db_mfrs') || '[]');
    const m = list.find((x: any) => x.id === id);
    if (m) {
      Object.assign(m, props);
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
        imageUrls: typeof p.image_urls === 'string' ? JSON.parse(p.image_urls) : (p.image_urls || [])
      })) as Product[];
    }

    const mfrs = await DB.getManufacturers();
    const tierWeights: Record<string, number> = { 
      [PlacementTier.PREMIUM]: 3, 
      [PlacementTier.STANDARD]: 2, 
      [PlacementTier.BASIC]: 1 
    };

    return prods.sort((a, b) => {
      const mfrA = mfrs.find(m => m.id === a.manufacturerId);
      const mfrB = mfrs.find(m => m.id === b.manufacturerId);
      const weightA = mfrA ? tierWeights[mfrA.placementTier] : 0;
      const weightB = mfrB ? tierWeights[mfrB.placementTier] : 0;
      if (weightB !== weightA) return weightB - weightA;
      return b.id.localeCompare(a.id);
    });
  },

  saveProduct: async (p: Product) => {
    const payload = { ...p, image_urls: JSON.stringify(p.imageUrls) };
    // @ts-ignore
    delete payload.imageUrls;
    await supabase.from('products').upsert(payload);
    const list = JSON.parse(localStorage.getItem('ps_db_prods') || '[]');
    const index = list.findIndex((item: any) => item.id === p.id);
    if (index > -1) list[index] = p; else list.push(p);
    localStorage.setItem('ps_db_prods', JSON.stringify(list));
  },

  updateProductStatus: async (id: string, status: 'ACTIVE' | 'DISABLED' | 'PENDING', isApproved?: boolean) => {
    const update: any = { status };
    if (isApproved !== undefined) update.is_israel_free_approved = isApproved;
    await supabase.from('products').update(update).eq('id', id);
    const list = JSON.parse(localStorage.getItem('ps_db_prods') || '[]');
    const p = list.find((x: any) => x.id === id);
    if (p) {
      p.status = status;
      if (isApproved !== undefined) p.isIsraelFreeApproved = isApproved;
      localStorage.setItem('ps_db_prods', JSON.stringify(list));
    }
  },

  getShopkeeperProfiles: async (): Promise<ShopkeeperProfile[]> => {
    const local = localStorage.getItem('ps_db_shops');
    return local ? JSON.parse(local) : [];
  },

  saveShopkeeperProfile: (profile: ShopkeeperProfile) => {
    const list = JSON.parse(localStorage.getItem('ps_db_shops') || '[]');
    const index = list.findIndex((item: any) => item.id === profile.id);
    if (index > -1) list[index] = profile; else list.push(profile);
    localStorage.setItem('ps_db_shops', JSON.stringify(list));
    localStorage.setItem('ps_shopkeeper_active', JSON.stringify(profile));
    
    // Also update current session if active
    const sessionStr = localStorage.getItem('ps_session');
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      if (session.shopkeeperProfile && session.shopkeeperProfile.id === profile.id) {
        session.shopkeeperProfile = profile;
        localStorage.setItem('ps_session', JSON.stringify(session));
      }
    }
  },

  getActiveShopkeeper: (): ShopkeeperProfile | null => {
    const data = localStorage.getItem('ps_shopkeeper_active');
    return data ? JSON.parse(data) : null;
  },

  getCategories: (): Category[] => CATEGORIES,

  submitRating: async (manufacturerId: string, stars: number) => {
    const mfrs = await DB.getManufacturers();
    const mfr = mfrs.find(m => m.id === manufacturerId);
    if (mfr) {
      const currentRating = mfr.rating || 0;
      const currentCount = mfr.ratingCount || 0;
      const newCount = currentCount + 1;
      const newRating = ((currentRating * currentCount) + stars) / newCount;
      await supabase.from('manufacturers').update({ rating: newRating, rating_count: newCount }).eq('id', manufacturerId);
      const list = JSON.parse(localStorage.getItem('ps_db_mfrs') || '[]');
      const localMfr = list.find((x: any) => x.id === manufacturerId);
      if (localMfr) { localMfr.rating = newRating; localMfr.ratingCount = newCount; localStorage.setItem('ps_db_mfrs', JSON.stringify(list)); }
      const localRatings = JSON.parse(localStorage.getItem('ps_ratings') || '{}');
      localRatings[manufacturerId] = stars;
      localStorage.setItem('ps_ratings', JSON.stringify(localRatings));
    }
  }
};
