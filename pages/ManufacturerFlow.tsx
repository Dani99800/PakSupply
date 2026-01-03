
import React, { useState, useEffect } from 'react';
import { Package, Clock, BarChart3, Plus, X, Image as ImageIcon, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Manufacturer, ManufacturerStatus, Product, PlacementTier } from '../types';
import { DB } from '../store';

export default function ManufacturerFlow({ currentUser, setCurrentUser }: { currentUser: Manufacturer | null, setCurrentUser: (u: Manufacturer | null) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [myProds, setMyProds] = useState<Product[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    if (currentUser) {
      const load = async () => {
        const all = await DB.getProducts();
        setMyProds(all.filter(p => p.manufacturerId === currentUser.id));
      };
      load();
    }
  }, [currentUser]);

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

  if (currentUser?.status === ManufacturerStatus.APPROVED) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Partner Workspace</h1>
          <button onClick={() => setShowAdd(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2"><Plus className="w-5 h-5" /> List Product</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-[2rem] border-none shadow-xl"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Inventory</p><p className="text-4xl font-black">{myProds.length}</p></div>
           <div className="bg-white p-8 rounded-[2rem] border-none shadow-xl"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tier</p><p className="text-4xl font-black">{currentUser.placementTier}</p></div>
           <div className="bg-white p-8 rounded-[2rem] border-none shadow-xl"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Orders</p><p className="text-4xl font-black text-emerald-600">Active</p></div>
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <form onSubmit={handleAddProduct} className="bg-white p-10 rounded-[3rem] w-full max-w-2xl space-y-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">
              <button type="button" onClick={() => setShowAdd(false)} className="absolute top-6 right-6 text-slate-300"><X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-black">List New Product</h2>
              <div className="grid grid-cols-5 gap-3">
                {productImages.map((img, i) => (
                  <div key={i} className="aspect-square relative rounded-xl overflow-hidden"><img src={img} className="w-full h-full object-cover" /><button type="button" onClick={() => setProductImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-white rounded-full text-rose-500"><X className="w-3 h-3" /></button></div>
                ))}
                {productImages.length < 5 && <label className="aspect-square border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer"><ImageIcon className="w-6 h-6 text-slate-300" /><input type="file" multiple className="hidden" accept="image/*" onChange={e => {
                  // Explicitly type the file as 'File' to satisfy FileReader.readAsDataURL requirements
                  Array.from(e.target.files || []).forEach((f: File) => { const r = new FileReader(); r.onloadend = () => setProductImages(p => [...p, r.result as string]); r.readAsDataURL(f); });
                }} /></label>}
              </div>
              <div className="grid grid-cols-2 gap-4"><input required name="name" placeholder="Title" className="w-full p-4 bg-slate-50 rounded-2xl" /><input required name="brand" placeholder="Brand" className="w-full p-4 bg-slate-50 rounded-2xl" /></div>
              <div className="grid grid-cols-2 gap-4"><select required name="cat" className="w-full p-4 bg-slate-50 rounded-2xl">{DB.getCategories().map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select><input required name="price" type="number" placeholder="Price" className="w-full p-4 bg-slate-50 rounded-2xl" /></div>
              <textarea name="desc" placeholder="Details..." className="w-full p-4 bg-slate-50 rounded-2xl h-24" />
              <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black">Submit</button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 border-b">
              <tr><th className="p-8">Product</th><th className="p-8">Price</th><th className="p-8">Visibility</th><th className="p-8 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y text-sm">
              {myProds.map(p => (
                <tr key={p.id}>
                  <td className="p-8 flex items-center gap-4"><img src={p.imageUrls[0]} className="w-12 h-12 rounded-xl object-cover bg-slate-50" /><div><p className="font-black">{p.name}</p><p className="text-[10px] text-slate-400">{p.brand}</p></div></td>
                  <td className="p-8 font-black">Rs. {p.price}</td>
                  <td className="p-8"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{p.status}</span></td>
                  <td className="p-8 text-right">
                    <button onClick={() => toggleProductStatus(p.id, p.status)} className="flex items-center gap-2 ml-auto text-slate-400 hover:text-emerald-600 transition-colors">
                      {p.status === 'ACTIVE' ? <><EyeOff className="w-4 h-4" /> <span className="text-[10px] font-black uppercase">Unlist</span></> : <><Eye className="w-4 h-4" /> <span className="text-[10px] font-black uppercase">Go Live</span></>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return <div className="max-w-4xl mx-auto py-12 text-center">Please login or wait for approval.</div>;
}
