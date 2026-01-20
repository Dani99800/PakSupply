
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserSession } from '../authStore';
import { LogOut, LayoutDashboard, Store, UserCircle, ShoppingBag, Briefcase, ChevronRight } from 'lucide-react';
import { UserRole } from '../types';

interface Props {
  session: UserSession | null;
  onLogout: () => void;
}

export default function Navigation({ session, onLogout }: Props) {
  const location = useLocation();
  const isBusinessMode = location.pathname.startsWith('/business') || 
                         location.pathname.startsWith('/manufacturer') || 
                         location.pathname.startsWith('/admin') ||
                         location.pathname.startsWith('/profile');

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b sticky top-0 z-50 transition-all">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-emerald-600 text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl font-black text-xl md:text-2xl shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
            PS
          </div>
          <div className="hidden xs:block">
            <span className="text-lg md:text-xl font-black text-slate-900 block leading-none tracking-tight">PakSupply</span>
            <span className="text-[9px] md:text-[10px] font-bold text-emerald-600 tracking-[0.2em] uppercase">B2B2C Pakistan</span>
          </div>
        </Link>

        {/* Improved Mode Switcher for all screens */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border mx-2 md:mx-4">
           <Link 
              to="/" 
              className={`px-3 md:px-6 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1 md:gap-2 transition-all ${!isBusinessMode ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
           >
              <ShoppingBag className="w-3 md:w-3.5 h-3 md:h-3.5" /> 
              <span className="hidden sm:inline">Consumer</span>
              <span className="sm:hidden">Buyer</span>
           </Link>
           <Link 
              to="/business" 
              className={`px-3 md:px-6 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1 md:gap-2 transition-all ${isBusinessMode ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
           >
              <Briefcase className="w-3 md:w-3.5 h-3 md:h-3.5" /> 
              <span className="hidden sm:inline">Wholesale</span>
              <span className="sm:hidden">B2B</span>
           </Link>
        </div>

        <div className="flex items-center space-x-2 md:space-x-6">
          {session ? (
            <div className="flex items-center space-x-2 md:space-x-4">
              {session.role === UserRole.ADMIN ? (
                <Link to="/admin" className="bg-slate-900 text-white p-2.5 md:px-5 md:py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-slate-800 transition-all">
                  <LayoutDashboard className="w-4 h-4" /> 
                  <span className="hidden md:inline">Admin</span>
                </Link>
              ) : session.role === UserRole.MANUFACTURER ? (
                <Link to="/manufacturer" className="bg-emerald-600 text-white p-2.5 md:px-5 md:py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all">
                  <LayoutDashboard className="w-4 h-4" /> 
                  <span className="hidden md:inline">Partner</span>
                </Link>
              ) : (
                <Link to="/profile" className="flex items-center gap-2 bg-slate-100 p-2.5 md:px-4 md:py-2.5 rounded-xl hover:bg-slate-200 transition-all border border-slate-200">
                  <UserCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-black text-slate-700 hidden lg:inline uppercase tracking-widest">Manage Store</span>
                </Link>
              )}
              <button 
                onClick={onLogout}
                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
               <Link to="/login" className="bg-emerald-600 text-white px-4 md:px-8 py-2.5 md:py-3 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95 flex items-center gap-2">
                 Login <ChevronRight className="hidden md:block w-4 h-4" />
               </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
