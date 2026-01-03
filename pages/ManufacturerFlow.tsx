
import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, X, Image as ImageIcon, Eye, EyeOff, 
  Building2, User, Phone, MapPin, ShieldCheck, Mail, Lock, 
  ArrowRight, Clock, CheckCircle2, TrendingUp 
} from 'lucide-react';
import { Manufacturer, ManufacturerStatus, Product, PlacementTier } from '../types';
import { DB } from '../store';
import { Auth } from '../authStore';

export default function ManufacturerFlow({ currentUser, setCurrentUser }: { 
  currentUser: Manufacturer | null, 
  setCurrentUser: (u: Manufacturer | null) => void 
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [myProds, setMyProds] = useState<Product[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Registration State
  const [isRegistering, setIsRegistering] = useState(true);
  const [regData, setRegData] = useState({
    email: '',
    password: '',
    companyName: '',
    phone: '',
    ownerName: '',
    address: '',
    city: '',
    isIsraelFreeClaim: false
  });

  useEffect(() => {
    if (currentUser && currentUser.status === ManufacturerStatus.APPROVED) {
      const load = async () => {
        const all = await DB.getProducts();
        setMyProds(all.filter(p => p.manufacturerId === currentUser.id));
      };
      load();
    }
  }, [currentUser]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Fix: Added missing required 'ownerPhone' property by defaulting to the provided company phone.
    const newMfr: Manufacturer = {
      id: 'm-' + Date.now(),
      ...regData,
      ownerPhone: regData.phone,
      status: ManufacturerStatus.PENDING_APPROVAL,
      placementTier: PlacementTier.BASIC,
      isTrustedPartner: false,
      signupDate: new Date().toISOString(),
      rating: 0,
      ratingCount: 0
    };

    await DB.saveManufacturer(newMfr);
    setCurrentUser(newMfr);
    setLoading(false);
  };

  const toggleProductStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    await DB.updateProductStatus(id, newStatus);
    setMyProds(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (productImages.length === 0) return alert("Add at least one photo.");
    const fd = new FormData(e.currentTarget);
    const p: Product = {
      id: 'p-' + Date.now(),
      manufacturerId: currentUser!.id,
      manufacturerName: currentUser!.companyName,
      name: fd.get('name') as string,
      brand: fd.get('brand') as string,
      category: fd.get('cat') as string,
      price: Number(fd.get('price')),
      description: fd.get('desc') as string,
      imageUrls: productImages,
      isIsraelFree: currentUser!.isIsraelFreeClaim,
      isIsraelFreeApproved: false,
      status: 'PENDING'
    };
    await DB.saveProduct(p);
    setMyProds([p, ...myProds]);
    setShowAdd(false);
    setProductImages([]);
  };

  // Case 1: Manufacturer is not logged in / Hasn't signed up
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-fadeIn">
        <div className="bg-white rounded-[3rem] shadow-2xl border overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-emerald-600 p-12 text-white flex flex-col justify-between">
            <div>
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black mb-4 leading-tight">Join Pakistan's Local FMCG Network</h2>
              <p className="text-emerald-50 text-sm leading-relaxed font-medium">Connect directly with 10,000+ verified shopkeepers across Pakistan and grow your wholesale brand.</p>
            </div>
            <div className="space-y-4 pt-8 border-t border-white/10">
               <div className="flex items-center gap-3 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Guaranteed Leads
               </div>
               <div className="flex items-center gap-3 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" /> B2B Visibility
               </div>
            </div>
          </div>

          <div className="md:w-2/3 p-10 md:p-16">
            <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Manufacturer Signup</h1>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input required value={regData.companyName} onChange={e => setRegData({...regData, companyName: e.target.value})} placeholder="Indus FMCG Ltd" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input required type="email" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} placeholder="contact@company.pk" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp / Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input required value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} placeholder="03xx xxxxxxx" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Owner Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input required value={regData.ownerName} onChange={e => setRegData({...regData, ownerName: e.target.value})} placeholder="Full Name" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input required value={regData.city} onChange={e => setRegData({...regData, city: e.target.value})} placeholder="Karachi / Lahore" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input required type="password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} placeholder="••••••••" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="checkbox" checked={regData.isIsraelFreeClaim} onChange={e => setRegData({...regData, isIsraelFreeClaim: e.target.checked})} className="w-6 h-6 accent-emerald-600" />
                  <div>
                    <span className="block font-black text-emerald-900 text-sm">Official Israel-Free Claim</span>
                    <span className="block text-[10px] text-emerald-700/70 font-bold uppercase tracking-wider">Show badge on marketplace products</span>
                  </div>
                </label>
              </div>

              <button type="submit" disabled={loading} className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xl shadow-2xl hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3">
                {loading ? 'Creating Account...' : 'Submit Application'} <ArrowRight className="w-6 h-6" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Manufacturer is waiting for approval
  if (currentUser.status !== ManufacturerStatus.APPROVED) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-fadeIn">
        <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border flex flex-col items-center">
          <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <Clock className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Application Pending</h1>
          <p className="text-slate-500 font-medium mb-12 leading-relaxed">Thank you, <span className="text-emerald-600 font-bold">{currentUser.companyName}</span>. Our team is verifying your details. You will receive an update on WhatsApp once approved.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="bg-slate-50 p-6 rounded-3xl text-left border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <p className="font-bold text-amber-600 flex items-center gap-2 uppercase text-xs">
                <Clock className="w-3 h-3" /> Under Review
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl text-left border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next Step</p>
              <p className="font-bold text-slate-900 uppercase text-xs">Payment Verification</p>
            </div>
          </div>
          
          <button onClick={() => Auth.logout()} className="mt-12 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-colors">
            Cancel & Logout
          </button>
        </div>
      </div>
    );
  }

  // Case 3: Manufacturer is APPROVED - Show Dashboard
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
           <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase mb-2">
             <TrendingUp className="w-4 h-4" /> Partner Workspace
           </div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tight">{currentUser.companyName}</h1>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl hover:bg-emerald-700 transition-all shadow-emerald-100"><Plus className="w-6 h-6" /> List Product</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[2.5rem] border-none shadow-xl flex flex-col justify-between h-40">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Inventory</p>
           <p className="text-5xl font-black text-slate-900">{myProds.length}</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border-none shadow-xl flex flex-col justify-between h-40">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marketplace Tier</p>
           <p className="text-3xl font-black text-emerald-600 uppercase tracking-tight">{currentUser.placementTier}</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border-none shadow-xl flex flex-col justify-between h-40">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
           <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
              <p className="text-3xl font-black text-slate-900 uppercase">ACTIVE</p>
           </div>
         </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <form onSubmit={handleAddProduct} className="bg-white p-10 rounded-[3rem] w-full max-w-2xl space-y-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto shadow-2xl">
            <button type="button" onClick={() => setShowAdd(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors"><X className="w-6 h-6" /></button>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900">List New Stock</h2>
              <p className="text-slate-400 font-medium">Add professional photos for better visibility.</p>
            </div>
            
            <div className="grid grid-cols-5 gap-3">
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
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                <input required name="name" placeholder="Item Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand</label>
                <input required name="brand" placeholder="Brand Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <select required name="cat" className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold">{DB.getCategories().map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (PKR)</label>
                <input required name="price" type="number" placeholder="Wholesale Price" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
              </div>
            </div>
            
            <div className="space-y-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
               <textarea name="desc" placeholder="Details about packing, quantity per carton, etc..." className="w-full p-4 bg-slate-50 rounded-2xl h-32 outline-none font-bold" />
            </div>

            <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-100">Submit for Listing</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 border-b bg-slate-50/30 flex justify-between items-center">
           <h2 className="font-black text-xl text-slate-900">Current Inventory</h2>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{myProds.length} Items Listed</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 border-b">
              <tr><th className="p-8">Product</th><th className="p-8">Price</th><th className="p-8">Visibility</th><th className="p-8 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y text-sm">
              {myProds.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="p-8 flex items-center gap-6">
                    <img src={p.imageUrls[0]} className="w-16 h-16 rounded-[1.25rem] object-cover bg-slate-50 shadow-sm" />
                    <div>
                       <p className="font-black text-slate-900 text-base">{p.name}</p>
                       <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{p.brand}</p>
                    </div>
                  </td>
                  <td className="p-8 font-black text-slate-900 text-lg">Rs. {p.price}</td>
                  <td className="p-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    <button onClick={() => toggleProductStatus(p.id, p.status)} className="flex items-center gap-2 ml-auto p-3 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-emerald-600">
                      {p.status === 'ACTIVE' ? <><EyeOff className="w-5 h-5" /> <span className="text-[10px] font-black uppercase">Unlist</span></> : <><Eye className="w-5 h-5" /> <span className="text-[10px] font-black uppercase">Go Live</span></>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
