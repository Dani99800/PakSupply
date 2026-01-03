
import { UserRole, Manufacturer, ShopkeeperProfile } from './types';
import { DB } from './store';

export interface UserSession {
  email: string;
  role: UserRole;
  manufacturerProfile?: Manufacturer;
  shopkeeperProfile?: ShopkeeperProfile;
}

const ADMIN_EMAIL = "admin@paksupply.pk";
const ADMIN_PASS = "PakSupply786!";

export const Auth = {
  login: async (email: string, pass: string): Promise<UserSession | null> => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      const session: UserSession = { email, role: UserRole.ADMIN };
      localStorage.setItem('ps_session', JSON.stringify(session));
      return session;
    }

    const mfrs = await DB.getManufacturers();
    const foundMfr = mfrs.find(m => m.email === email && m.password === pass);
    if (foundMfr) {
      const session: UserSession = { email, role: UserRole.MANUFACTURER, manufacturerProfile: foundMfr };
      localStorage.setItem('ps_session', JSON.stringify(session));
      return session;
    }

    const shops = await DB.getShopkeeperProfiles();
    const foundShop = shops.find(s => s.email === email && s.password === pass);
    if (foundShop) {
      const session: UserSession = { email, role: UserRole.SHOPKEEPER, shopkeeperProfile: foundShop };
      localStorage.setItem('ps_session', JSON.stringify(session));
      DB.saveShopkeeperProfile(foundShop); 
      return session;
    }

    return null;
  },

  registerShopkeeper: async (profile: ShopkeeperProfile): Promise<UserSession> => {
    DB.saveShopkeeperProfile(profile);
    const session: UserSession = { email: profile.email, role: UserRole.SHOPKEEPER, shopkeeperProfile: profile };
    localStorage.setItem('ps_session', JSON.stringify(session));
    return session;
  },

  logout: () => {
    localStorage.removeItem('ps_session');
    localStorage.removeItem('ps_shopkeeper_active');
    window.location.href = '/';
  },

  getSession: (): UserSession | null => {
    const s = localStorage.getItem('ps_session');
    return s ? JSON.parse(s) : null;
  }
};
