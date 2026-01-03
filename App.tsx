
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
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contract from './pages/Contract';
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
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<ShopkeeperView />} />
            <Route path="/login" element={<LoginPage onLogin={setSession} />} />
            <Route path="/signup" element={<ManufacturerFlow currentUser={session?.manufacturerProfile || null} setCurrentUser={handleSetManufacturer} />} />
            <Route path="/gatekeeper" element={<LoginPage onLogin={setSession} isAdminRoute={true} />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contract" element={<Contract />} />
            
            {/* Shopkeeper Protected */}
            <Route 
              path="/profile" 
              element={session?.role === UserRole.SHOPKEEPER ? <ProfilePage /> : <Navigate to="/login" />} 
            />

            {/* Protected Manufacturer Routes */}
            <Route 
              path="/manufacturer/*" 
              element={session?.role === UserRole.MANUFACTURER ? (
                <ManufacturerFlow 
                  currentUser={session.manufacturerProfile || null} 
                  setCurrentUser={handleSetManufacturer} 
                />
              ) : <Navigate to="/login" />} 
            />

            {/* Protected Admin Routes */}
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
