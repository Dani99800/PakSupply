
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, ShieldCheck, MessageCircle, CheckCircle2, Building2, 
  UserCircle, Package, TrendingUp, X, MapPin, Star, ChevronLeft, 
  ChevronRight, Filter, SortAsc, SortDesc, Eye, Info
} from 'lucide-react';
import { DB } from '../store';
import { ADMIN_WHATSAPP } from '../constants';
import { Product, Manufacturer, ShopkeeperProfile, PlacementTier } from '../types';

const ProductCard = ({ p, mfr, onOrder, onQuickView }: { 
  p: Product, 
  mfr?: Manufacturer, 
  onOrder: (p: Product) => void,
  onQuickView: (p: Product) => void
}) => {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (p.imageUrls.length <= 1) return;
    const interval = setInterval(() => setImgIdx(prev => (prev + 1) % p.imageUrls.length), 4000);
    return () => clearInterval(interval);
  }, [p.imageUrls]);

  return (
    <div className={`bg-white rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all group border flex flex-col relative ${mfr?.placementTier === PlacementTier.PREMIUM ? 'ring-2 ring-emerald-500/20 border-emerald-100 shadow-emerald-50' : 'border-slate-100'}`}>
      {mfr?.placementTier === PlacementTier.PREMIUM && (
        <div className="absolute top-4 right-4 z-10 bg-emerald-600 text-white p-2 rounded-xl shadow-lg animate-pulse">
           <TrendingUp className="w-4 h-4" />
        </div>
      )}
      <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onQuickView(p)}>
        {p.imageUrls.map((url, i) => (
          <img 
            key={`${p.id}-img-${i}`} 
            src={url} 
            alt={p.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === imgIdx ? 'opacity-100' : 'opacity-0'} group-hover:scale-110 transition-transform duration-[2000ms]`} 
          />
        ))}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
           <div className="bg-white/90 backdrop-blur p-3 rounded-full text-slate-900 shadow-xl scale-90 group-hover:scale-100 transition-all">
              <Eye className="w-5 h-5" />
           </div>
        </div>
        {p.isIsraelFreeApproved && (
          <div className="absolute top-4 left-4 bg-emerald-900/80 text-white text-[8px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg backdrop-blur">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{p.brand}</span>
          {mfr?.rating && (
            <div className="flex items-center gap-1 text-amber-500 font-bold text-[10px]">
              <Star className="w-3 h-3 fill-current" /> {mfr.rating.toFixed(1)}
            </div>
          )}
        </div>
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
  const [sortBy, setSortBy] = useState<'default' | 'priceLow' | 'priceHigh' | 'rating'>('default');
  const [selectedMfr, setSelectedMfr] = useState<string | null>(null);
  const [israelFree, setIsraelFree] = useState(false);
  const [prods, setProds] = useState<Product[]>([]);
  const [mfrs, setMfrs] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ShopkeeperProfile | null>(null);
  const [orderModal, setOrderModal] = useState<Product | null>(null);
  const [quickViewModal, setQuickViewModal] = useState<Product | null>(null);
  const [coupon, setCoupon] = useState('');
  
  const categoryScrollRef = useRef<HTMLDivElement>(null);

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
    let result = prods.filter(p => {
      const mSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                      p.brand.toLowerCase().includes(search.toLowerCase()) ||
                      p.manufacturerName.toLowerCase().includes(search.toLowerCase());
      const mCat = cat === 'All' || p.category === cat;
      const mMfr = selectedMfr ? (p.manufacturerId === selectedMfr) : true;
      const mIF = israelFree ? (p.isIsraelFree && p.isIsraelFreeApproved) : true;
      return mSearch && mCat && mMfr && mIF;
    });

    if (sortBy === 'priceLow') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === 'priceHigh') result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => {
        const mfrA = mfrs.find(m => m.id === a.manufacturerId);
        const mfrB = mfrs.find(m => m.id === b.manufacturerId);
        return (mfrB?.rating || 0) - (mfrA?.rating || 0);
      });
    }

    return result;
  }, [search, cat, selectedMfr, israelFree, prods, sortBy, mfrs]);

  const trustedPartners = useMemo(() => mfrs.filter(m => m.isTrustedPartner), [mfrs]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const handleOrderConfirm = (productToOrder?: Product) => {
    const target = productToOrder || orderModal;
    if (!target) return;
    
    const isCouponMatch = coupon.trim().toLowerCase() === 'babar azam';
    let shopInfo = profile 
      ? `\n\n*Shop:* ${profile.shopName}\n*Owner:* ${profile.ownerName}\n*Address:* ${profile.address}\n*City:* ${profile.city}`
      : `\n\n*Note:* Customer not registered. Please ask for shop details.`;

    const reward = isCouponMatch ? '\n\n*COUPON REWARD:* 🎁 1 FREE Carton Bath Soap (Babar Azam Code)' : '';
    const msg = encodeURIComponent(
      `PakSupply.pk Order Request:\n` +
      `--------------------------\n` +
      `*Product:* ${target.name}\n` +
      `*Brand:* ${target.brand}\n` +
      `*Wholesale Price:* Rs. ${target.price}` +
      shopInfo + reward
    );
    
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`, '_blank');
    setOrderModal(null);
    setQuickViewModal(null);
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

      {/* Categories Slide Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
             <Filter className="w-5 h-5 text-emerald-600" /> Browse by Category
           </h2>
           <div className="flex gap-2">
              <button onClick={() => scrollCategories('left')} className="p-2 bg-white border rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                 <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => scrollCategories('right')} className="p-2 bg-white border rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                 <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        </div>
        <div 
          ref={categoryScrollRef}
          className="flex overflow-x-auto gap-4 pb-4 px-2 scrollbar-hide snap-x snap-mandatory"
        >
          <button 
            onClick={() => setCat('All')}
            className={`flex-shrink-0 snap-start px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${cat === 'All' ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200 hover:text-emerald-600'}`}
          >
            All Stock
          </button>
          {DB.getCategories().map(c => (
            <button 
              key={c.id} 
              onClick={() => setCat(c.name)}
              className={`flex-shrink-0 snap-start px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border whitespace-nowrap ${cat === c.name ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-100' : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200 hover:text-emerald-600'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Filter & Sort Bar */}
      <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border sticky top-24 z-40 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Search products, brands or companies..." 
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-2xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-6 py-5 bg-white border rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="default">Sort: Recommended</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Top Rated Partners</option>
            </select>
            <button 
              onClick={() => setIsraelFree(!israelFree)} 
              className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-xs uppercase transition-all shadow-lg ${israelFree ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-white text-slate-400 border'}`}
            >
              <ShieldCheck className="w-5 h-5" /> Israel-Free
            </button>
          </div>
        </div>
      </div>

      {/* Trusted Partners Carousel */}
      {trustedPartners.length > 0 && !search && cat === 'All' && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Featured Partners
            </h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 px-2 scrollbar-hide">
             {trustedPartners.map(m => (
               <div 
                 key={m.id} 
                 className={`flex-shrink-0 px-8 py-6 rounded-[2.5rem] border transition-all flex flex-col items-center justify-center gap-3 min-w-[180px] cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 ${selectedMfr === m.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-100'}`} 
                 onClick={() => setSelectedMfr(selectedMfr === m.id ? null : m.id)}
               >
                 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner ${selectedMfr === m.id ? 'bg-white/10' : 'bg-emerald-50 text-emerald-600'}`}>
                   {m.companyName.charAt(0)}
                 </div>
                 <div className="text-center">
                    <span className="text-[10px] font-black uppercase block leading-tight">{m.companyName}</span>
                    <div className="flex items-center justify-center gap-1 mt-1">
                       <Star className="w-3 h-3 text-amber-400 fill-current" />
                       <span className={`text-[9px] font-bold ${selectedMfr === m.id ? 'text-emerald-400' : 'text-slate-400'}`}>{m.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map(p => (
            <ProductCard 
              key={p.id} 
              p={p} 
              mfr={mfrs.find(m => m.id === p.manufacturerId)} 
              onOrder={setOrderModal} 
              onQuickView={setQuickViewModal}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900">No stock matches found</h3>
          <p className="text-slate-400">Try adjusting your filters or searching for specific brands.</p>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fadeIn relative">
              <button 
                onClick={() => setQuickViewModal(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="md:w-1/2 bg-slate-50 h-[300px] md:h-auto overflow-y-auto scrollbar-hide p-6">
                <div className="space-y-4">
                   {quickViewModal.imageUrls.map((url, i) => (
                     <img key={i} src={url} className="w-full rounded-[2rem] shadow-lg object-cover" alt={`${quickViewModal.name} view ${i}`} />
                   ))}
                </div>
              </div>

              <div className="md:w-1/2 p-8 md:p-12 flex flex-col h-full">
                <div className="mb-6">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">{quickViewModal.brand}</span>
                      {quickViewModal.isIsraelFreeApproved && (
                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] font-black">
                           <ShieldCheck className="w-4 h-4" /> ISRAEL-FREE
                        </div>
                      )}
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 mb-2">{quickViewModal.name}</h2>
                   <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                      <Building2 className="w-4 h-4 text-emerald-600" /> 
                      {quickViewModal.manufacturerName}
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      {quickViewModal.category}
                   </div>
                </div>

                <div className="flex-grow space-y-6">
                   <div>
                      <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Item Description</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{quickViewModal.description || "No detailed description provided by manufacturer."}</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Wholesale</p>
                         <p className="text-xl font-black text-slate-900">Rs. {quickViewModal.price}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Status</p>
                         <p className="text-xl font-black text-emerald-600">Available</p>
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t flex gap-4">
                   <button 
                     onClick={() => { setOrderModal(quickViewModal); setQuickViewModal(null); }}
                     className="flex-grow bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all"
                   >
                     <MessageCircle className="w-6 h-6" /> Place Wholesale Order
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* Order Confirmation & Coupon Modal */}
      {orderModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-4">
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
              onClick={() => handleOrderConfirm()} 
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
