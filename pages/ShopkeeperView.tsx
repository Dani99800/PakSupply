
import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShieldCheck, MessageCircle, CheckCircle2, Building2, UserCircle, Package, TrendingUp, X, MapPin } from 'lucide-react';
import { DB } from '../store';
import { ADMIN_WHATSAPP } from '../constants';
import { Product, Manufacturer, ShopkeeperProfile, PlacementTier } from '../types';

// Added optional key to props type to satisfy strict JSX prop checking in certain environments
const ProductCard = ({ p, mfr, onOrder }: { p: Product, mfr?: Manufacturer, onOrder: (p: Product) => void, key?: React.Key }) => {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (p.imageUrls.length <= 1) return;
    const interval = setInterval(() => setImgIdx(prev => (prev + 1) % p.imageUrls.length), 4000);
    return () => clearInterval(interval);
  }, [p.imageUrls]);

  return (
    <div className={`bg-white rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all group border flex flex-col relative ${mfr?.placementTier === PlacementTier.PREMIUM ? 'ring-2 ring-emerald-500/20 border-emerald-100 shadow-emerald-50' : 'border-slate-50'}`}>
      {mfr?.placementTier === PlacementTier.PREMIUM && (
        <div className="absolute top-4 right-4 z-10 bg-emerald-600 text-white p-2 rounded-xl shadow-lg animate-pulse">
           <TrendingUp className="w-4 h-4" />
        </div>
      )}
      <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
        {p.imageUrls.map((url, i) => (
          <img 
            key={`${p.id}-img-${i}`} 
            src={url} 
            alt={p.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === imgIdx ? 'opacity-100' : 'opacity-0'} group-hover:scale-110 transition-transform duration-[2000ms]`} 
          />
        ))}
        {p.isIsraelFreeApproved && (
          <div className="absolute top-4 left-4 bg-emerald-900/80 text-white text-[8px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg backdrop-blur">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{p.brand}</span>
        <h3 className="font-bold text-slate-900 text-lg mb-2 leading-tight group-hover:text-emerald-700 transition-colors">{p.name}</h3>
        <p className="text-[10px] text-slate-400 font-bold mb-6 flex items-center gap-1"><Building2 className="w-3 h-3" /> {p.manufacturerName}</p>
        <div className="mt-auto flex items-center justify-between pt-4 border-t">
          <div>
             <p className="text-[9px] font-black text-slate-300 uppercase">Wholesale</p>
             <p className="text-xl font-black">Rs. {p.price}</p>
          </div>
          <button 
            onClick={() => onOrder(p)} 
            className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 active:scale-90 transition-all shadow-lg flex items-center gap-2 group-hover:px-6"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase">Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ShopkeeperView() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [selectedMfr, setSelectedMfr] = useState<string | null>(null);
  const [israelFree, setIsraelFree] = useState(false);
  const [prods, setProds] = useState<Product[]>([]);
  const [mfrs, setMfrs] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ShopkeeperProfile | null>(null);
  const [orderModal, setOrderModal] = useState<Product | null>(null);
  const [coupon, setCoupon] = useState('');

  useEffect(() => { 
    const load = async () => {
      const [p, m] = await Promise.all([DB.getProducts(), DB.getManufacturers()]);
      setProds(p.filter(x => x.status === 'ACTIVE'));
      setMfrs(m.filter(x => x.status === 'APPROVED'));
      setProfile(DB.getActiveShopkeeper());
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return prods.filter(p => {
      const mSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
      const mCat = cat === 'All' || p.category === cat;
      const mMfr = selectedMfr ? (p.manufacturerId === selectedMfr) : true;
      const mIF = israelFree ? (p.isIsraelFree && p.isIsraelFreeApproved) : true;
      return mSearch && mCat && mMfr && mIF;
    });
  }, [search, cat, selectedMfr, israelFree, prods]);

  const trustedPartners = useMemo(() => mfrs.filter(m => m.isTrustedPartner), [mfrs]);

  const handleOrderConfirm = () => {
    if (!orderModal) return;
    const isCouponMatch = coupon.trim().toLowerCase() === 'babar azam';
    
    let shopInfo = "";
    if (profile) {
      shopInfo = `\n\n*Shop:* ${profile.shopName}\n*Owner:* ${profile.ownerName}\n*Address:* ${profile.address}\n*City:* ${profile.city}`;
    } else {
      shopInfo = `\n\n*Note:* Customer not registered. Please ask for shop details.`;
    }

    const reward = isCouponMatch ? '\n\n*COUPON REWARD:* 🎁 1 FREE Carton Bath Soap (Babar Azam Code)' : '';
    
    const msg = encodeURIComponent(
      `PakSupply.pk Order Request:\n` +
      `--------------------------\n` +
      `*Product:* ${orderModal.name}\n` +
      `*Brand:* ${orderModal.brand}\n` +
      `*Wholesale Price:* Rs. ${orderModal.price}` +
      shopInfo + 
      reward
    );
    
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`, '_blank');
    setOrderModal(null);
    setCoupon('');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-12 animate-fadeIn pb-20">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] rounded-[3rem] overflow-hidden flex items-center px-6 md:px-12 text-white shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="B2B Marketplace"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 to-emerald-900/10" />
        <div className="relative max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <UserCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {profile ? `Welcome, ${profile.shopName}` : 'Marketplace Hub'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
            Direct Access to <span className="text-emerald-400">Verified</span> Local Brands
          </h1>
          <p className="text-emerald-50/80 font-medium">Connecting 10,000+ Shopkeepers with Pakistan's top FMCG manufacturers.</p>
        </div>
      </section>

      {/* Trusted Partners Carousel */}
      {trustedPartners.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Trusted Partners
            </h2>
            {selectedMfr && (
              <button onClick={() => setSelectedMfr(null)} className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                Clear Filter
              </button>
            )}
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 px-2 scrollbar-hide">
             {trustedPartners.map(m => (
               <div 
                 key={m.id} 
                 className={`flex-shrink-0 px-6 py-6 rounded-3xl border transition-all flex flex-col items-center justify-center gap-3 min-w-[160px] cursor-pointer shadow-sm hover:shadow-md ${selectedMfr === m.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100'}`} 
                 onClick={() => setSelectedMfr(selectedMfr === m.id ? null : m.id)}
               >
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner ${selectedMfr === m.id ? 'bg-white/10' : 'bg-emerald-50 text-emerald-600'}`}>
                   {m.companyName.charAt(0)}
                 </div>
                 <div className="text-center">
                    <span className="text-[10px] font-black uppercase block">{m.companyName}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-widest ${selectedMfr === m.id ? 'text-emerald-400' : 'text-slate-400'}`}>{m.city}</span>
                 </div>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* Filter Bar */}
      <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border sticky top-24 z-40 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search products or brands..." 
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-700" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <button 
            onClick={() => setIsraelFree(!israelFree)} 
            className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-xs uppercase transition-all shadow-lg ${israelFree ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-white text-slate-400 border'}`}
          >
            <ShieldCheck className="w-5 h-5" /> Israel-Free Only
          </button>
        </div>
        <div className="flex overflow-x-auto gap-3 scrollbar-hide">
          <button 
            onClick={() => setCat('All')} 
            className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all ${cat === 'All' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-slate-100 hover:bg-slate-200'}`}
          >
            ALL STOCK
          </button>
          {DB.getCategories().map(c => (
            <button 
              key={c.id} 
              onClick={() => setCat(c.name)} 
              className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${cat === c.name ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-slate-100 hover:bg-slate-200'}`}
            >
              {c.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map(p => (
            <ProductCard 
              key={p.id} 
              p={p} 
              mfr={mfrs.find(m => m.id === p.manufacturerId)} 
              onOrder={setOrderModal} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900">No products found</h3>
          <p className="text-slate-400">Try adjusting your filters or search keywords.</p>
        </div>
      )}

      {/* Order Confirmation & Coupon Modal */}
      {orderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[3rem] w-full max-w-md shadow-2xl space-y-6 relative animate-fadeIn overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600" />
            <button 
              onClick={() => setOrderModal(null)} 
              className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-900">Confirm Order</h2>
              <p className="text-slate-500 font-medium">Direct lead to {orderModal.manufacturerName}</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border space-y-3">
               <div className="flex justify-between items-center border-b pb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Item</span>
                  <span className="text-sm font-bold">{orderModal.name}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Wholesale Price</span>
                  <span className="text-lg font-black text-emerald-600">Rs. {orderModal.price}</span>
               </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                Promo Code
              </label>
              <div className="relative">
                <input 
                  value={coupon} 
                  onChange={e => setCoupon(e.target.value)} 
                  placeholder="Enter code (e.g. Babar Azam)" 
                  className={`w-full p-5 bg-slate-50 border rounded-2xl outline-none font-bold transition-all ${coupon.trim().toLowerCase() === 'babar azam' ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/50' : 'focus:ring-2 focus:ring-emerald-500/20'}`} 
                />
                {coupon.trim().toLowerCase() === 'babar azam' && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-1 rounded-full animate-bounce">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>
              {coupon.trim().toLowerCase() === 'babar azam' && (
                <div className="bg-emerald-600 text-white p-4 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-100 animate-fadeIn">
                  <div className="bg-white/20 p-2 rounded-lg">🎁</div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Active Reward</p>
                    <p className="font-bold">1 FREE Carton Bath Soap Added!</p>
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleOrderConfirm} 
              className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-emerald-700 transition-all active:scale-95"
            >
              Confirm & WhatsApp Admin
            </button>
            
            <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-wider">
              Secure B2B Lead Generation Powered by PakSupply.pk
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
