
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, Manufacturer } from './types';
import { Auth, UserSession } from './authStore';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ShopkeeperView from './pages/ShopkeeperView';
import ManufacturerFlow from './pages/ManufacturerFlow';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import BuyerView from './pages/BuyerView';
import ShopStorefront from './pages/ShopStorefront';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSession(Auth.getSession());
    setIsLoading(false);
  }, []);

  if (isLoading) return null;

  const handleSetManufacturer = (profile: Manufacturer | null) => {
    if (!profile) {
      Auth.logout();
      setSession(null);
    } else {
      const updatedSession: UserSession = { 
        email: profile.email, 
        role: UserRole.MANUFACTURER, 
        manufacturerProfile: profile 
      };
      setSession(updatedSession);
      localStorage.setItem('ps_session', JSON.stringify(updatedSession));
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation session={session} onLogout={Auth.logout} />
        <main className="flex-grow">
          <Routes>
            {/* Buyer/B2C Mode */}
            <Route path="/" element={<BuyerView />} />
            <Route path="/shop/:shopId" element={<ShopStorefront />} />
            
            {/* Business/B2B Mode */}
            <Route path="/business" element={<ShopkeeperView />} />
            <Route path="/login" element={<LoginPage onLogin={setSession} />} />
            <Route path="/signup" element={<ManufacturerFlow currentUser={session?.manufacturerProfile || null} setCurrentUser={handleSetManufacturer} />} />
            <Route path="/profile" element={session?.role === UserRole.SHOPKEEPER ? <ProfilePage /> : <Navigate to="/login" />} />
            
            <Route 
              path="/manufacturer/*" 
              element={session?.role === UserRole.MANUFACTURER ? (
                <ManufacturerFlow 
                  currentUser={session.manufacturerProfile || null} 
                  setCurrentUser={handleSetManufacturer} 
                />
              ) : <Navigate to="/login" />} 
            />

            <Route 
              path="/admin/*" 
              element={session?.role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/" />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
