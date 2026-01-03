
import React from 'react';
import { Link } from 'react-router-dom';
import { UserSession } from './authStore';
import { LogOut, LayoutDashboard, Store, UserCircle } from 'lucide-react';
import { UserRole } from './types';

interface Props {
  session: UserSession | null;
  onLogout: () => void;
}

export default function Navigation({ session, onLogout }: Props) {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-emerald-600 text-white w-12 h-12 flex items-center justify-center rounded-2xl font-black text-2xl shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
            PS
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 block leading-none tracking-tight">PakSupply</span>
            <span className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] uppercase">B2B Hub Pakistan</span>
          </div>
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors hidden sm:flex items-center gap-2">
            <Store className="w-4 h-4" /> Marketplace
          </Link>
          
          {session ? (
            <div className="flex items-center space-x-4">
              {session.role === UserRole.ADMIN ? (
                <Link to="/admin" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-slate-200">
                  <LayoutDashboard className="w-4 h-4" /> Admin Panel
                </Link>
              ) : session.role === UserRole.MANUFACTURER ? (
                <Link to="/manufacturer" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-100">
                  <LayoutDashboard className="w-4 h-4" /> Partner Dashboard
                </Link>
              ) : (
                <Link to="/profile" className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors">
                  <UserCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-700 hidden md:inline">My Profile</span>
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
            <Link 
              to="/login" 
              className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
