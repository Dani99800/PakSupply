
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="text-white font-bold mb-4">PakSupply.pk</h3>
          <p className="leading-relaxed">Pakistan's premier B2B FMCG order generation engine. Supporting local manufacturers.</p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="hover:text-emerald-400">Privacy Policy</Link></li>
            <li><Link to="/contract" className="hover:text-emerald-400">Manufacturer Contract</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Support</h3>
          <p>WhatsApp: 0346 3904137</p>
          <p>Email: support@paksupply.pk</p>
        </div>
      </div>
      <div className="text-center mt-12 pt-8 border-t border-slate-800 text-[10px]">&copy; 2024 PakSupply.pk. All local brands supported.</div>
    </footer>
  );
}
