
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Store, Truck, ShoppingBag, ArrowRight, Star, Building2, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DB } from '../store';
import { ShopkeeperProfile } from '../types';

export default function BuyerView() {
  const [search, setSearch] = useState('');
  const [shops, setShops] = useState<ShopkeeperProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await DB.getAllShops();
      setShops(data);
      setLoading(false);
    };
    load();
  }, []);

  const filteredShops = shops.filter(s => {
    const matchesSearch = s.shopName.toLowerCase().includes(search.toLowerCase()) ||
                         s.area.toLowerCase().includes(search.toLowerCase()) ||
                         s.street.toLowerCase().includes(search.toLowerCase());
    const matchesCity = selectedCity === 'All' || s.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const cities = ['All', 'Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Multan'];

  return (
    <div className="animate-fadeIn">
      {/* Search Header */}
      <section className="bg-emerald-600 pt-12 pb-24 md:pt-16 md:pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900/20 rounded-full -ml-20 -mb-20 blur-3xl" />
        
        <div className="container mx-auto max-w-4xl relative text-center text-white">
          <h1 className="text-3xl md:text-6xl font-black mb-4 tracking-tight leading-tight">
             Shop Local <span className="text-emerald-200">Online</span>
          </h1>
          <p className="text-emerald-50 mb-8 md:mb-10 text-base md:text-xl font-medium px-4">Direct orders from verified local kiryana & super stores.</p>
          
          <div className="bg-white p-2 md:p-3 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto border-4 border-emerald-500/30">
             <div className="flex-grow relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <input 
                   type="text" 
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   placeholder="Enter Area, Street or Shop..." 
                   className="w-full pl-14 pr-6 py-4 md:py-5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-900 text-sm md:text-base"
                />
             </div>
             <button className="bg-emerald-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                Find Shops
             </button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2 px-2">
             {cities.map(city => (
               <button 
                 key={city}
                 onClick={() => setSelectedCity(city)}
                 className={`px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${selectedCity === city ? 'bg-white text-emerald-600 shadow-lg scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
               >
                 {city}
               </button>
             ))}
          </div>
        </div>
      </section>

      {/* Shop Listing */}
      <section className="container mx-auto px-4 -mt-12 md:-mt-16 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3 bg-white p-4 md:p-6 rounded-3xl shadow-lg border inline-flex">
             <Building2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
             <div>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Local Shops in</p>
                <h2 className="text-lg md:text-xl font-black text-slate-900">{selectedCity === 'All' ? 'Pakistan' : selectedCity}</h2>
             </div>
          </div>

          <Link to="/business" className="bg-slate-900 text-white px-6 py-4 rounded-3xl flex items-center gap-3 shadow-xl hover:bg-slate-800 transition-all group">
             <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5 text-emerald-400" />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Business Owner?</p>
                <p className="text-sm font-bold flex items-center gap-2">Buy Wholesale <ArrowRight className="w-4 h-4" /></p>
             </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredShops.length > 0 ? (
            filteredShops.map(shop => (
              <Link 
                key={shop.id} 
                to={`/shop/${shop.id}`}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all group border border-slate-100 flex flex-col"
              >
                <div className="h-48 relative overflow-hidden bg-slate-200">
                   {shop.shopPhoto ? (
                      <img src={shop.shopPhoto} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                         <Store className="w-16 h-16" />
                      </div>
                   )}
                   <div className="absolute top-4 left-4 flex gap-2">
                      {shop.isOpen ? (
                        <span className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Open</span>
                      ) : (
                        <span className="bg-slate-400 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Closed</span>
                      )}
                   </div>
                   <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-[9px] font-black text-emerald-600 shadow-sm uppercase tracking-widest border border-slate-100">
                      {shop.city}
                   </div>
                </div>
                <div className="p-8 flex-grow">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{shop.shopName}</h3>
                      <div className="flex items-center gap-1 text-amber-500">
                         <Star className="w-3.5 h-3.5 fill-current" />
                         <span className="text-xs font-bold">4.8</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase mb-6 tracking-wide leading-tight">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> {shop.area}, {shop.street}
                   </div>
                   
                   <div className="flex gap-4 pt-6 border-t border-slate-50">
                      <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${shop.isDeliveryAvailable ? 'text-emerald-600' : 'text-slate-300 line-through'}`}>
                         <Truck className="w-3.5 h-3.5" /> Delivery
                      </div>
                      <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${shop.isPickupAvailable ? 'text-emerald-600' : 'text-slate-300 line-through'}`}>
                         <ShoppingBag className="w-3.5 h-3.5" /> Pickup
                      </div>
                   </div>
                </div>
                <div className="p-5 bg-slate-50 border-t border-slate-100 group-hover:bg-emerald-50 transition-colors flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Order Daily Stock</span>
                   <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
               <Store className="w-16 h-16 text-slate-200 mx-auto mb-4" />
               <p className="text-slate-500 font-black uppercase tracking-widest">No shops listed in this city yet.</p>
               <p className="text-slate-400 text-sm mt-2">Try searching another big city like Karachi or Lahore.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
