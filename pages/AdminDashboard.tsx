
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle, X, Image as ImageIcon, Star, TrendingUp, 
  Ban, Check, EyeOff, Eye, User, Phone, MapPin, Mail, Plus, AlertCircle 
} from 'lucide-react';
import { DB } from '../store';
import { Manufacturer, ManufacturerStatus, Product, PlacementTier } from '../types';

export default function AdminDashboard() {
  const [mfrs, setMfrs] = useState<Manufacturer[]>([]);
  const [prods, setProds] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'mfrs' | 'prods' | 'add'>('mfrs');
  const [reviewMfr, setReviewMfr] = useState<Manufacturer | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [listingLoading, setListingLoading] = useState(false);

  const loadData = async () => {
    const m = await DB.getManufacturers();
    const p = await DB.getProducts();
    setMfrs(m);
    setProds(p);
  };

  useEffect(() => { loadData(); }, []);

  const handleUpdateTier = async (id: string, tier: PlacementTier) => { await DB.updateManufacturerProp(id, { placementTier: tier }); loadData(); };
  
  const handleToggleTrusted = async (id: string, current: boolean) => { 
    await DB.updateManufacturerProp(id, { isTrustedPartner: !current }); 
    loadData(); 
  };

  const handleUpdateMfrStatus = async (id: string, next: ManufacturerStatus) => { 
    await DB.updateManufacturerProp(id, { status: next }); 
    setReviewMfr(null);
    loadData(); 
  };

  const handleApproveProd = async (id: string) => { 
    await DB.updateProductStatus(id, 'ACTIVE', true); 
    loadData(); 
  };

  const handleToggleProdStatus = async (id: string, current: string) => { 
    await DB.updateProductStatus(id, current === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'); 
    loadData(); 
  };

  const handleAdminProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (productImages.length === 0) return alert("Add at least one photo.");
    setListingLoading(true);
    const fd = new FormData(e.currentTarget);
    const p: Product = {
      id: 'admin-p-' + Date.now(),
      manufacturerId: 'admin',
      manufacturerName: 'PakSupply Official',
      name: fd.get('name') as string,
      brand: fd.get('brand') as string,
      category: fd.get('cat') as string,
      price: Number(fd.get('price')),
      description: fd.get('desc') as string,
      imageUrls: productImages,
      isIsraelFree: true,
      isIsraelFreeApproved: true,
      status: 'ACTIVE',
      orderWhatsApp: (fd.get('whatsapp') as string) || undefined
    };
    await DB.saveProduct(p);
    setProds([p, ...prods]);
    setProductImages([]);
    e.currentTarget.reset();
    setListingLoading(false);
    alert("Official product listed successfully!");
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      <header className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm uppercase mb-2">
            <ShieldAlert className="w-4 h-4" /> System Administrator
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Control</h1>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 overflow-x-auto">
          {['mfrs', 'prods', 'add'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>
              {t === 'mfrs' ? 'Verify Partners' : t === 'prods' ? 'Marketplace Stock' : 'Official Listing'}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'mfrs' && (
        <div className="bg-white rounded-[2.5rem] shadow-xl border overflow-hidden">
          <div className="p-8 border-b flex justify-between items-center">
             <h2 className="font-black text-xl">Manufacturer Directory</h2>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mfrs.length} Registered</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                <tr>
                  <th className="p-6">Company</th>
                  <th className="p-6">Status</th>
                  <th className="p-6">Tier</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {mfrs.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="p-6">
                      <p className="font-black text-slate-900">{m.companyName}</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase">{m.city} • {m.email}</p>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${m.status === ManufacturerStatus.APPROVED ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <select 
                        value={m.placementTier} 
                        onChange={(e) => handleUpdateTier(m.id, e.target.value as PlacementTier)} 
                        className={`text-[10px] font-black uppercase p-2 border rounded-lg outline-none ${m.placementTier === PlacementTier.PREMIUM ? 'bg-amber-50 border-amber-200' : 'bg-white'}`}
                      >
                        {Object.values(PlacementTier).map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => setReviewMfr(m)} 
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all"
                      >
                        Review Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'prods' && (
        <div className="bg-white rounded-[2.5rem] shadow-xl border overflow-hidden">
          <div className="p-8 border-b"><h2 className="font-black text-xl">Inventory Management</h2></div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 border-b">
              <tr><th className="p-6">Item</th><th className="p-6">Provider</th><th className="p-6">Status</th><th className="p-6 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y text-sm">
              {prods.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="p-6 flex items-center gap-3">
                    <img src={p.imageUrls[0]} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                    <div><p className="font-black text-slate-900">{p.name}</p><p className="text-[10px] uppercase font-bold text-slate-400">{p.brand}</p></div>
                  </td>
                  <td className="p-6 font-bold">{p.manufacturerName}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${p.status === 'ACTIVE' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    {p.status === 'PENDING' ? (
                      <button onClick={() => handleApproveProd(p.id)} className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-[10px] font-black">Approve & List</button>
                    ) : (
                      <button onClick={() => handleToggleProdStatus(p.id, p.status)} className="flex items-center gap-2 ml-auto text-[10px] font-black uppercase text-slate-400 hover:text-rose-600">
                        {p.status === 'ACTIVE' ? <><EyeOff className="w-3 h-3" /> Unlist Item</> : <><Eye className="w-3 h-3" /> Relist Item</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'add' && (
        <div className="max-w-3xl mx-auto bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border">
          <div className="mb-10 text-center">
             <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Plus className="w-10 h-10" />
             </div>
             <h2 className="text-3xl font-black text-slate-900">Official Admin Listing</h2>
             <p className="text-slate-400 font-medium">Add products to the marketplace directly as PakSupply.</p>
          </div>

          <form onSubmit={handleAdminProductSubmit} className="space-y-6">
            <div className="grid grid-cols-5 gap-3 mb-6">
              {productImages.map((img, i) => (
                <div key={i} className="aspect-square relative rounded-xl overflow-hidden shadow-inner border">
                  <img src={img} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setProductImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-white/90 backdrop-blur rounded-full text-rose-500 shadow-lg"><X className="w-3 h-3" /></button>
                </div>
              ))}
              {productImages.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors">
                  <ImageIcon className="w-6 h-6 text-slate-300 mb-1" />
                  <span className="text-[8px] font-black text-slate-400 uppercase">Add Photo</span>
                  <input type="file" multiple className="hidden" accept="image/*" onChange={e => {
                    Array.from(e.target.files || []).forEach((f: File) => { const r = new FileReader(); r.onloadend = () => setProductImages(p => [...p, r.result as string]); r.readAsDataURL(f); });
                  }} />
                </label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input required name="name" placeholder="Product Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
              <input required name="brand" placeholder="Brand Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select required name="cat" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold">
                {DB.getCategories().map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <input required name="price" type="number" placeholder="Price (PKR)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2">
                <AlertCircle className="w-3 h-3" /> WhatsApp Order Overlap (Optional)
              </label>
              <input name="whatsapp" placeholder="Leave empty to use main admin number" className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl outline-none font-bold text-emerald-900" />
            </div>

            <textarea required name="desc" placeholder="Product details, wholesale packing, etc..." className="w-full p-4 bg-slate-50 rounded-2xl h-32 outline-none font-bold" />

            <button 
              type="submit" 
              disabled={listingLoading}
              className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
            >
              {listingLoading ? 'Listing...' : 'List on Marketplace'}
            </button>
          </form>
        </div>
      )}

      {/* Review Manufacturer Modal */}
      {reviewMfr && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl animate-fadeIn relative overflow-hidden">
             <button onClick={() => setReviewMfr(null)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 transition-colors">
               <X className="w-6 h-6" />
             </button>
             
             <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 mb-1">Verify Manufacturer</h2>
                <p className="text-slate-500 font-medium">Review credentials before approval</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                   <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-emerald-600" /> <div><p className="text-[9px] font-black text-slate-400 uppercase">Email</p><p className="font-bold">{reviewMfr.email}</p></div></div>
                   <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-emerald-600" /> <div><p className="text-[9px] font-black text-slate-400 uppercase">Company Phone</p><p className="font-bold">{reviewMfr.phone}</p></div></div>
                   <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-emerald-600" /> <div><p className="text-[9px] font-black text-slate-400 uppercase">City / Address</p><p className="font-bold">{reviewMfr.city} • {reviewMfr.address}</p></div></div>
                </div>
                <div className="bg-emerald-50/50 p-6 rounded-3xl space-y-4 border border-emerald-100">
                   <div className="flex items-center gap-3"><User className="w-5 h-5 text-emerald-700" /> <div><p className="text-[9px] font-black text-emerald-600 uppercase">Owner Name</p><p className="font-bold text-emerald-900">{reviewMfr.ownerName}</p></div></div>
                   <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-emerald-700" /> <div><p className="text-[9px] font-black text-emerald-600 uppercase">Owner Direct Phone</p><p className="font-bold text-emerald-900">{reviewMfr.ownerPhone}</p></div></div>
                   <div className="bg-white p-3 rounded-2xl flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-slate-400">Israel-Free Claim</span>
                      <span className={`text-[10px] font-black ${reviewMfr.isIsraelFreeClaim ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {reviewMfr.isIsraelFreeClaim ? 'YES' : 'NO'}
                      </span>
                   </div>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-4">
                {reviewMfr.status !== ManufacturerStatus.APPROVED && (
                  <button 
                    onClick={() => handleUpdateMfrStatus(reviewMfr.id, ManufacturerStatus.APPROVED)}
                    className="flex-grow py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-100"
                  >
                    <CheckCircle className="w-6 h-6" /> Approve Partner
                  </button>
                )}
                {reviewMfr.status === ManufacturerStatus.APPROVED && (
                   <button 
                    onClick={() => handleUpdateMfrStatus(reviewMfr.id, ManufacturerStatus.SUSPENDED)}
                    className="flex-grow py-5 bg-rose-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl"
                  >
                    <Ban className="w-6 h-6" /> Suspend Account
                  </button>
                )}
                <button 
                  onClick={() => handleUpdateMfrStatus(reviewMfr.id, ManufacturerStatus.PENDING_APPROVAL)}
                  className="px-8 py-5 border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all"
                >
                  Reject / Reset
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
