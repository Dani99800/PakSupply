
import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, X, Image as ImageIcon, Star, TrendingUp, Ban, Check, EyeOff, Eye } from 'lucide-react';
import { DB } from '../store';
import { Manufacturer, ManufacturerStatus, Product, PlacementTier } from '../types';

export default function AdminDashboard() {
  const [mfrs, setMfrs] = useState<Manufacturer[]>([]);
  const [prods, setProds] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'mfrs' | 'prods' | 'add'>('mfrs');

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

  const handleToggleMfrStatus = async (id: string, currentStatus: ManufacturerStatus) => { 
    const next = currentStatus === ManufacturerStatus.APPROVED ? ManufacturerStatus.SUSPENDED : ManufacturerStatus.APPROVED;
    await DB.updateManufacturerProp(id, { status: next }); 
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

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      <header className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm uppercase mb-2">
            <ShieldAlert className="w-4 h-4" /> System Administrator
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Control</h1>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
          {['mfrs', 'prods', 'add'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${activeTab === t ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>
              {t === 'mfrs' ? 'Manufacturers' : t === 'prods' ? 'Marketplace Stock' : 'Official Listing'}
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
                  <th className="p-6">Visibility Tier</th>
                  <th className="p-6">Carousel Partner</th>
                  <th className="p-6 text-right">Account Control</th>
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
                      <select 
                        value={m.placementTier} 
                        onChange={(e) => handleUpdateTier(m.id, e.target.value as PlacementTier)} 
                        className={`text-[10px] font-black uppercase p-2 border rounded-lg outline-none ${m.placementTier === PlacementTier.PREMIUM ? 'bg-amber-50 border-amber-200' : 'bg-white'}`}
                      >
                        {Object.values(PlacementTier).map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </td>
                    <td className="p-6">
                      <button 
                        onClick={() => handleToggleTrusted(m.id, m.isTrustedPartner)} 
                        className={`flex items-center gap-2 text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all ${m.isTrustedPartner ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                      >
                        {m.isTrustedPartner ? <Check className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />} 
                        {m.isTrustedPartner ? 'In Carousel' : 'Add to Carousel'}
                      </button>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleToggleMfrStatus(m.id, m.status)} 
                        className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${m.status === ManufacturerStatus.APPROVED ? 'text-rose-600 hover:bg-rose-50' : 'bg-emerald-600 text-white'}`}
                      >
                        {m.status === ManufacturerStatus.APPROVED ? <><Ban className="w-3 h-3 inline mr-1" /> Suspend Company</> : 'Activate Company'}
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
    </div>
  );
}
