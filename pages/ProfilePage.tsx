
import React, { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Save, CheckCircle, UserCircle, Camera, Mail, Truck, ShoppingBag, Globe, QrCode } from 'lucide-react';
import { DB } from '../store';
import { ShopkeeperProfile } from '../types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<ShopkeeperProfile>({
    id: '',
    email: '',
    shopName: '',
    ownerName: '',
    city: '',
    area: '',
    street: '',
    phone: '',
    address: '',
    shopPhoto: '',
    isDeliveryAvailable: false,
    isPickupAvailable: true,
    isOpen: true
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = DB.getActiveShopkeeper();
    if (existing) setProfile({...profile, ...existing});
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
    if (f) { const r = new FileReader(); r.onloadend = () => setProfile({ ...profile, shopPhoto: r.result as string }); r.readAsDataURL(f); }
  };

  if (loading) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 animate-fadeIn px-4">
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
          <h1 className="text-3xl font-black text-slate-900">Manage Your Shop</h1>
          <p className="text-slate-500 font-medium">B2B and B2C Business Settings</p>
        </div>

        <form onSubmit={handleSave} className="space-y-10">
          {/* General Info */}
          <div className="space-y-6">
             <h2 className="text-lg font-black uppercase tracking-widest text-emerald-600">General Information</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required value={profile.shopName} onChange={e => setProfile({...profile, shopName: e.target.value})} placeholder="Shop Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
                <input required value={profile.ownerName} onChange={e => setProfile({...profile, ownerName: e.target.value})} placeholder="Owner Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
                <input required value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="WhatsApp Number" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
                <input required value={profile.city} onChange={e => setProfile({...profile, city: e.target.value})} placeholder="City (Karachi / Lahore)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
             </div>
          </div>

          {/* Location Targeting */}
          <div className="space-y-6">
             <h2 className="text-lg font-black uppercase tracking-widest text-emerald-600">Local Area Targeting</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Area / Colony</label>
                   <input required value={profile.area} onChange={e => setProfile({...profile, area: e.target.value})} placeholder="e.g. Shah Faisal Colony" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-emerald-50" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street / Block</label>
                   <input required value={profile.street} onChange={e => setProfile({...profile, street: e.target.value})} placeholder="e.g. Street 4, Green Town" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold border-2 border-emerald-50" />
                </div>
             </div>
             <textarea required value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} placeholder="Full Detailed Address" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold h-24" />
          </div>

          {/* Service Toggles */}
          <div className="space-y-6">
             <h2 className="text-lg font-black uppercase tracking-widest text-emerald-600">Buyer Mode Features (B2C)</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  type="button"
                  onClick={() => setProfile({...profile, isDeliveryAvailable: !profile.isDeliveryAvailable})}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${profile.isDeliveryAvailable ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-100 opacity-60'}`}
                >
                   <Truck className={`w-8 h-8 ${profile.isDeliveryAvailable ? 'text-emerald-600' : 'text-slate-300'}`} />
                   <span className="text-[10px] font-black uppercase">Home Delivery</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setProfile({...profile, isPickupAvailable: !profile.isPickupAvailable})}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${profile.isPickupAvailable ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-100 opacity-60'}`}
                >
                   <ShoppingBag className={`w-8 h-8 ${profile.isPickupAvailable ? 'text-emerald-600' : 'text-slate-300'}`} />
                   <span className="text-[10px] font-black uppercase">Pickup Store</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setProfile({...profile, isOpen: !profile.isOpen})}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${profile.isOpen ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-200'}`}
                >
                   <Globe className={`w-8 h-8 ${profile.isOpen ? 'text-emerald-600' : 'text-rose-600'}`} />
                   <span className="text-[10px] font-black uppercase">{profile.isOpen ? 'Store Live' : 'Store Offline'}</span>
                </button>
             </div>
          </div>

          <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-emerald-700 active:scale-95 transition-all">
             {saved ? "Profile Updated Successfully!" : "Save Shop Settings"}
          </button>
        </form>

        <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-8">
           <div className="bg-white p-4 rounded-3xl">
              <QrCode className="w-20 h-20 text-slate-900" />
           </div>
           <div>
              <h3 className="text-xl font-black mb-2">Your Shop QR Code</h3>
              <p className="text-slate-400 text-sm mb-4">Print this and paste it at your shop. Customers can scan to order from home!</p>
              <button onClick={() => window.open(`/#/shop/${profile.id}`, '_blank')} className="bg-white text-slate-900 px-6 py-2 rounded-xl text-xs font-bold uppercase">View Online Store</button>
           </div>
        </div>
      </div>
    </div>
  );
}
