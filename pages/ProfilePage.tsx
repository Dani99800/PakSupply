
import React, { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Save, CheckCircle, UserCircle, Camera, Mail } from 'lucide-react';
import { DB } from '../store';
import { ShopkeeperProfile } from '../types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<ShopkeeperProfile>({
    id: '',
    email: '',
    shopName: '',
    ownerName: '',
    city: '',
    phone: '',
    address: '',
    shopPhoto: ''
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = DB.getActiveShopkeeper();
    if (existing) {
      setProfile(existing);
    }
    setLoading(false);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    DB.saveShopkeeperProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const r = new FileReader();
      r.onloadend = () => setProfile({ ...profile, shopPhoto: r.result as string });
      r.readAsDataURL(f);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-2xl mx-auto py-12 animate-fadeIn">
      <div className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600" />
        
        <div className="text-center mb-10">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
              {profile.shopPhoto ? (
                <img src={profile.shopPhoto} alt="Shop" className="w-full h-full object-cover" />
              ) : (
                <Store className="w-12 h-12" />
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2 rounded-xl cursor-pointer hover:scale-110 transition-transform shadow-lg">
               <Camera className="w-4 h-4" />
               <input type="file" className="hidden" accept="image/*" onChange={onPhotoChange} />
            </label>
          </div>
          <h1 className="text-3xl font-black text-slate-900">My Shop Profile</h1>
          <p className="text-slate-500 font-medium">Verified business details for PakSupply.pk</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shop Name</label>
              <div className="relative">
                <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  required 
                  value={profile.shopName}
                  onChange={e => setProfile({...profile, shopName: e.target.value})}
                  placeholder="Ali General Store" 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Owner Name</label>
              <div className="relative">
                <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  required 
                  value={profile.ownerName}
                  onChange={e => setProfile({...profile, ownerName: e.target.value})}
                  placeholder="Full Name" 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold" 
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shop Address</label>
            <div className="relative">
              <MapPin className="absolute left-5 top-5 w-5 h-5 text-slate-300" />
              <textarea 
                required 
                value={profile.address}
                onChange={e => setProfile({...profile, address: e.target.value})}
                placeholder="Street name, Area, City" 
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold min-h-[100px]" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
              <input 
                required 
                value={profile.city}
                onChange={e => setProfile({...profile, city: e.target.value})}
                placeholder="Lahore / Karachi" 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  required 
                  value={profile.phone}
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  placeholder="03xx xxxxxxx" 
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className={`w-full py-6 rounded-3xl font-black text-xl transition-all flex items-center justify-center gap-3 shadow-xl ${saved ? 'bg-emerald-50 text-emerald-600 shadow-none ring-1 ring-emerald-500' : 'bg-emerald-600 text-white shadow-emerald-100 hover:bg-emerald-700 active:scale-95'}`}
          >
            {saved ? (
              <><CheckCircle className="w-6 h-6" /> Profile Updated!</>
            ) : (
              <><Save className="w-6 h-6" /> Save Store Details</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
