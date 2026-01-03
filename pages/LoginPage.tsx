
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Auth, UserSession } from '../authStore';
import { ShieldCheck, Mail, Lock, ArrowRight, UserCircle, Store, User, MapPin, Upload, Camera } from 'lucide-react';
import { UserRole, ShopkeeperProfile } from '../types';

export default function LoginPage({ onLogin, isAdminRoute = false }: { onLogin: (s: UserSession) => void, isAdminRoute?: boolean }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shopPhoto, setShopPhoto] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const session = await Auth.login(email, pass);
    if (session) {
      if (isAdminRoute && session.role !== UserRole.ADMIN) { setError('Unauthorized.'); setLoading(false); return; }
      onLogin(session);
      navigate(session.role === UserRole.ADMIN ? '/admin' : session.role === UserRole.MANUFACTURER ? '/manufacturer' : '/');
    } else setError('Invalid credentials.');
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const profile: ShopkeeperProfile = {
      id: 's-' + Date.now(),
      email: fd.get('email') as string,
      password: fd.get('password') as string,
      shopName: fd.get('shopName') as string,
      ownerName: fd.get('ownerName') as string,
      city: fd.get('city') as string,
      phone: fd.get('phone') as string,
      address: fd.get('address') as string,
      shopPhoto: shopPhoto || undefined
    };
    const session = await Auth.registerShopkeeper(profile);
    onLogin(session);
    navigate('/');
    setLoading(false);
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { const r = new FileReader(); r.onloadend = () => setShopPhoto(r.result as string); r.readAsDataURL(f); }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 animate-fadeIn">
      <div className={`max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 md:p-12 border relative overflow-hidden transition-all ${isRegistering ? 'max-w-2xl' : ''}`}>
        <div className={`absolute top-0 left-0 w-full h-2 ${isAdminRoute ? 'bg-slate-900' : 'bg-emerald-600'}`} />
        
        <div className="text-center mb-10">
          <div className={`w-20 h-20 ${isAdminRoute ? 'bg-slate-900' : 'bg-emerald-600'} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
            {isAdminRoute ? <ShieldCheck className="w-10 h-10 text-white" /> : isRegistering ? <Store className="w-10 h-10 text-white" /> : <UserCircle className="w-10 h-10 text-white" />}
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
            {isAdminRoute ? 'Admin Gatekeeper' : isRegistering ? 'Register Your Shop' : 'Sign In'}
          </h1>
        </div>

        {isRegistering ? (
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input required name="shopName" placeholder="Shop Name" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
              <input required name="ownerName" placeholder="Owner Name" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
              <input required name="email" type="email" placeholder="Email" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
              <input required name="password" type="password" placeholder="Password" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
            </div>
            <div className="space-y-4">
              <input required name="city" placeholder="City" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
              <input required name="phone" placeholder="Phone/WhatsApp" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
              <input required name="address" placeholder="Shop Address" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none" />
              <label className="flex items-center gap-3 p-4 bg-slate-50 border border-dashed rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors">
                {shopPhoto ? <img src={shopPhoto} className="w-10 h-10 rounded-lg object-cover" /> : <Camera className="w-6 h-6 text-slate-300" />}
                <span className="text-xs font-bold text-slate-500">{shopPhoto ? 'Change Photo' : 'Upload Shop Photo'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={onPhotoChange} />
              </label>
            </div>
            <div className="md:col-span-2">
               <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black text-xl shadow-xl">{loading ? 'Creating...' : 'Register & Start Ordering'}</button>
               <button type="button" onClick={() => setIsRegistering(false)} className="w-full mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Back to Login</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative"><Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" /><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-slate-50 border rounded-2xl outline-none" placeholder="Email Address" /></div>
            <div className="relative"><Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" /><input required type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-slate-50 border rounded-2xl outline-none" placeholder="Password" /></div>
            {error && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest bg-rose-50 p-4 rounded-xl text-center border">{error}</p>}
            <button type="submit" disabled={loading} className={`w-full py-5 ${isAdminRoute ? 'bg-slate-900' : 'bg-emerald-600'} text-white rounded-3xl font-black text-xl shadow-xl flex items-center justify-center gap-3`}>
              {loading ? 'Verifying...' : 'Access Dashboard'} <ArrowRight className="w-5 h-5" />
            </button>
            {!isAdminRoute && (
              <div className="pt-4 flex flex-col items-center gap-4">
                <button type="button" onClick={() => setIsRegistering(true)} className="text-sm font-bold text-emerald-600">Don't have a Shop account? Register here</button>
                <div className="w-full h-px bg-slate-100" />
                <Link to="/signup" className="text-xs font-black text-slate-400 uppercase tracking-widest">Register as a Manufacturer</Link>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
