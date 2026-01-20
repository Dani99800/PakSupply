
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Store, MapPin, Phone, ShoppingCart, Plus, Minus, 
  ChevronLeft, Trash2, Truck, ShoppingBag, CheckCircle2, ShieldCheck, QrCode
} from 'lucide-react';
import { DB } from '../store';
import { ShopkeeperProfile, ShopProduct, ConsumerOrder } from '../types';

export default function ShopStorefront() {
  const { shopId } = useParams();
  const [shop, setShop] = useState<ShopkeeperProfile | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [cart, setCart] = useState<{product: ShopProduct, qty: number}[]>([]);
  const [orderMode, setOrderMode] = useState<'PICKUP' | 'DELIVERY'>('PICKUP');
  const [loading, setLoading] = useState(true);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!shopId) return;
      const allShops = await DB.getAllShops();
      const foundShop = allShops.find(s => s.id === shopId);
      if (foundShop) {
        setShop(foundShop);
        const inv = await DB.getShopInventory(shopId);
        setProducts(inv);
      }
      setLoading(false);
    };
    load();
  }, [shopId]);

  const addToCart = (p: ShopProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === p.id);
      if (existing) return prev.map(item => item.product.id === p.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { product: p, qty: 1 }];
    });
  };

  const removeFromCart = (pId: string) => {
    setCart(prev => prev.map(item => item.product.id === pId ? { ...item, qty: Math.max(0, item.qty - 1) } : item).filter(item => item.qty > 0));
  };

  const total = cart.reduce((acc, item) => acc + (item.product.salePrice * item.qty), 0);

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const order: ConsumerOrder = {
      id: 'order-' + Date.now(),
      shopId: shop!.id,
      customerName: fd.get('name') as string,
      customerPhone: fd.get('phone') as string,
      address: fd.get('address') as string,
      items: cart.map(i => ({ productId: i.product.id!, name: i.product.name!, qty: i.qty, price: i.product.salePrice })),
      total: total,
      type: orderMode,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    await DB.saveConsumerOrder(order);
    
    // WhatsApp redirect
    const msg = encodeURIComponent(
      `PakSupply Order from ${order.customerName}:\n` +
      `Items: ${order.items.map(i => `${i.name} x${i.qty}`).join(', ')}\n` +
      `Total: Rs. ${order.total}\n` +
      `Mode: ${order.type}\n` +
      `Address: ${order.address || 'N/A'}`
    );
    window.open(`https://wa.me/${shop!.phone}?text=${msg}`, '_blank');
    
    setOrderComplete(true);
    setCart([]);
    setCheckoutModal(false);
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse">Loading Store...</div>;
  if (!shop) return <div className="p-20 text-center font-black">Shop not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-fadeIn">
      {/* Header */}
      <header className="bg-white border-b px-4 py-6 sticky top-0 z-40">
        <div className="container mx-auto flex items-center gap-4">
          <Link to="/" className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="flex-grow">
             <h1 className="text-xl md:text-2xl font-black text-slate-900">{shop.shopName}</h1>
             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {shop.area}, {shop.city}
             </p>
          </div>
          <button className="p-3 bg-slate-50 rounded-2xl">
             <QrCode className="w-6 h-6 text-slate-400" />
          </button>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Product Grid */}
        <div className="lg:col-span-2 space-y-8">
           <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-emerald-600" /> Daily Stock (دستیاب اشیاء)
           </h2>
           
           {products.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex gap-4 hover:shadow-2xl transition-all">
                     <img src={p.imageUrls?.[0]} className="w-24 h-24 rounded-3xl object-cover bg-slate-50" />
                     <div className="flex-grow">
                        <h3 className="font-bold text-slate-900">{p.name}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-3">{p.brand}</p>
                        <div className="flex items-center justify-between">
                           <p className="text-lg font-black text-emerald-600">Rs. {p.salePrice}</p>
                           <button 
                             onClick={() => addToCart(p)}
                             className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 transition-all active:scale-90"
                           >
                              <Plus className="w-5 h-5" />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="text-center py-16 bg-white rounded-[3rem] border border-dashed">
                <p className="text-slate-400 font-bold">No products listed for sale yet.</p>
             </div>
           )}
        </div>

        {/* Sidebar Cart */}
        <div className="lg:col-span-1">
           <div className="bg-white p-8 rounded-[3rem] shadow-2xl border sticky top-36">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center justify-between">
                 Your Order
                 <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">{cart.length} items</span>
              </h3>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto scrollbar-hide">
                 {cart.length > 0 ? cart.map(item => (
                   <div key={item.product.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.product.name}</p>
                        <p className="text-xs text-slate-400">Rs. {item.product.salePrice} x {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <button onClick={() => removeFromCart(item.product.id!)} className="text-rose-500 p-1"><Minus className="w-4 h-4" /></button>
                         <span className="font-bold">{item.qty}</span>
                         <button onClick={() => addToCart(item.product)} className="text-emerald-500 p-1"><Plus className="w-4 h-4" /></button>
                      </div>
                   </div>
                 )) : (
                   <div className="text-center py-8 text-slate-300">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p className="text-xs font-bold uppercase">Cart is empty</p>
                   </div>
                 )}
              </div>

              <div className="border-t pt-6 space-y-4">
                 <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px]">
                    <span>Subtotal</span>
                    <span>Rs. {total}</span>
                 </div>
                 <div className="flex justify-between text-slate-900 font-black text-xl">
                    <span>Total Bill</span>
                    <span>Rs. {total}</span>
                 </div>
                 
                 <button 
                   disabled={cart.length === 0}
                   onClick={() => setCheckoutModal(true)}
                   className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 disabled:bg-slate-200 disabled:shadow-none transition-all active:scale-95"
                 >
                   Checkout (آرڈر کریں)
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
           <div className="bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl relative animate-fadeIn overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600" />
              <div className="text-center mb-8">
                 <h2 className="text-2xl font-black text-slate-900">Finalize Order</h2>
                 <p className="text-slate-500 font-medium">Send request to {shop.shopName}</p>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                 <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button 
                      type="button"
                      onClick={() => setOrderMode('PICKUP')}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${orderMode === 'PICKUP' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      <ShoppingBag className="w-4 h-4" /> Pickup
                    </button>
                    <button 
                      type="button"
                      disabled={!shop.isDeliveryAvailable}
                      onClick={() => setOrderMode('DELIVERY')}
                      className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${orderMode === 'DELIVERY' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      <Truck className="w-4 h-4" /> Delivery
                    </button>
                 </div>

                 <input required name="name" placeholder="Your Name" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold" />
                 <input required name="phone" placeholder="WhatsApp Number" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold" />
                 {orderMode === 'DELIVERY' && (
                   <textarea required name="address" placeholder="Delivery Address (House #, Street)" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold h-24" />
                 )}

                 <div className="flex gap-4">
                    <button type="button" onClick={() => setCheckoutModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-sm uppercase">Cancel</button>
                    <button type="submit" className="flex-2 py-4 px-10 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase shadow-xl">Confirm Order</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Success Modal */}
      {orderComplete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[70] flex items-center justify-center p-4">
           <div className="bg-white p-12 rounded-[3rem] w-full max-w-sm text-center shadow-2xl animate-fadeIn">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Order Sent!</h2>
              <p className="text-slate-500 font-medium mb-10">Your order has been sent to the shopkeeper on WhatsApp.</p>
              <button 
                onClick={() => setOrderComplete(false)}
                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black"
              >
                Back to Store
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
