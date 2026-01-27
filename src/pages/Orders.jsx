import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { serverUrl } from "../../config";
import toast from "react-hot-toast";
import { 
  FaBox, FaUser, FaMapMarkerAlt, FaCalendarAlt, 
  FaCreditCard, FaChevronDown, FaHistory, FaInfoCircle
} from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  // English Comment: Fetching all orders with populated product data
  const fetchOrders = useCallback(async () => {
    if (!token) {
      toast.error("Session expired! Please login again.");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`${serverUrl}/api/order/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      toast.error("Database connection failed");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // English Comment: Status update with local state feedback
  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await axios.put(
        `${serverUrl}/api/order/status`,
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(`Transition to ${status} successful`);
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      }
    } catch (err) {
      // English Comment: Showing backend validation error (e.g., status flow restriction)
      toast.error(err.response?.data?.message || "Invalid status transition");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // English Comment: Helper to determine if status change should be disabled
  const isFinalState = (status) => ["Delivered", "Cancelled"].includes(status);

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-10 font-sans selection:bg-slate-900 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400">
               <FaHistory size={12} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Logistics</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Order <span className="text-slate-300 italic font-light">Control.</span></h1>
          </div>
          <div className="bg-white px-8 py-5 rounded-[2rem] border border-slate-200/60 shadow-sm">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Throughput</p>
            <p className="text-3xl font-black text-slate-900">{orders.length} <span className="text-sm font-medium text-slate-400">Packages</span></p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Synchronizing Nexus...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {orders.map((order, index) => (
              <div 
                key={order._id} 
                className="group bg-white rounded-[2.5rem] border border-slate-200/50 overflow-hidden shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Control Strip */}
                <div className="bg-slate-900 p-6 md:px-10 flex flex-wrap justify-between items-center gap-6">
                  <div className="flex items-center gap-5">
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md text-white">
                      <FaBox size={18} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Tracking Identity</p>
                      <p className="text-white font-mono text-sm tracking-wider uppercase">#{order._id.slice(-12)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden lg:block text-right mr-4">
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Live Phase</p>
                       <p className={`text-xs font-bold ${isFinalState(order.status) ? 'text-green-400' : 'text-amber-400'}`}>{order.status}</p>
                    </div>
                    
                    <div className="relative group/select">
                      <select
                        disabled={isFinalState(order.status)}
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`appearance-none bg-white/10 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-xl outline-none cursor-pointer pr-12 transition-all ${isFinalState(order.status) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
                      >
                        <option className="text-slate-900" value="Order Placed">Placed</option>
                        <option className="text-slate-900" value="Processing">Processing</option>
                        <option className="text-slate-900" value="Shipped">Shipped</option>
                        <option className="text-slate-900" value="Delivered">Delivered</option>
                        <option className="text-slate-900" value="Cancelled">Cancelled</option>
                      </select>
                      <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none size-2" />
                    </div>
                  </div>
                </div>

                {/* Information Nexus */}
                <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Customer Meta */}
                  <div className="lg:col-span-3 space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-50 p-3 rounded-xl text-slate-400"><FaUser size={14}/></div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Consignee</h4>
                        <p className="font-bold text-slate-900">{order.address?.firstName} {order.address?.lastName}</p>
                        <p className="text-[11px] text-slate-400 truncate w-32">{order.address?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-50 p-3 rounded-xl text-slate-400"><FaMapMarkerAlt size={14}/></div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Destination</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">"{order.address}"</p>
                      </div>
                    </div>
                  </div>

                  {/* Manifest / Item List */}
                  <div className="lg:col-span-5 bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100/50">
                    <div className="flex items-center gap-2 mb-6 text-slate-400">
                       <FaInfoCircle size={10} />
                       <h4 className="text-[10px] font-black uppercase tracking-widest">Manifest Details</h4>
                    </div>
                    <div className="space-y-5">
                      {order.products?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-5 group/item">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-slate-100 shrink-0 shadow-sm transition-transform duration-500 group-hover/item:scale-105">
                            <img 
                              src={item.productId?.images?.[0] || "https://placehold.co/200x200?text=Digital+Asset"} 
                              alt="sku" 
                              className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-700"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate tracking-tight">{item.productId?.name || "Premium Inventory"}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[10px] font-bold text-slate-400">Unit: {item.quantity}</span>
                               <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                               <span className="text-[10px] font-black text-slate-900">${item.productId?.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Settlement */}
                  <div className="lg:col-span-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-lg">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</span>
                        <span className="text-xs font-black text-slate-700">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                      </div>
                      <div className="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-lg">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</span>
                        <span className="text-xs font-black text-slate-700">{order.paymentMethod || 'COD'}</span>
                      </div>
                    </div>

                    <div className="pt-8 text-right">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Total Receivable</p>
                        <p className="text-5xl font-black text-slate-900 tracking-tighter">${order.totalAmount || order.amount}</p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;