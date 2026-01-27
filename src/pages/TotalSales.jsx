import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { serverUrl } from "../../config";
import toast from "react-hot-toast";
import { 
  FaChartBar, FaBox, FaDollarSign, FaArrowTrendUp, 
  FaLayerGroup, FaGem, FaCircleNodes 
} from "react-icons/fa6";

const TotalSales = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderRes, productRes] = await Promise.all([
          axios.get(`${serverUrl}/api/order/all`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${serverUrl}/api/product/list`)
        ]);

        if (orderRes.data?.success) setOrders(orderRes.data.orders || []);
        if (productRes.data?.success) setProducts(productRes.data.product || []);
      } catch (err) {
        toast.error("Systems synchronization failed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const salesData = useMemo(() => {
    const report = {};
    orders.forEach(order => {
      order.products?.forEach(item => {
        const pId = item.productId?._id || item.productId; 
        if (pId) {
          if (!report[pId]) report[pId] = { quantity: 0, revenue: 0 };
          const qty = Number(item.quantity || 0);
          const price = Number(item.productId?.price || 0);
          report[pId].quantity += qty;
          report[pId].revenue += (qty * price);
        }
      });
    });
    return report;
  }, [orders]);

  const totalGlobalRevenue = Object.values(salesData).reduce((sum, item) => sum + item.revenue, 0);
  const totalUnits = Object.values(salesData).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-[#f8fafc] min-h-screen p-4 md:p-12 font-sans selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 animate-in fade-in duration-1000">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-600">
              <FaCircleNodes className="animate-pulse" size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Analytics Engine v2.0</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">
              Revenue <span className="text-slate-300 font-light italic text-4xl md:text-6xl uppercase">Stream.</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm min-w-[160px]">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Gross Sales</p>
              <p className="text-3xl font-black text-slate-900">${totalGlobalRevenue.toLocaleString()}</p>
            </div>
            <div className="flex-1 md:flex-none bg-indigo-600 p-6 rounded-[2.5rem] shadow-xl shadow-indigo-200 min-w-[160px] text-white">
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Units Sold</p>
              <p className="text-3xl font-black">{totalUnits} <span className="text-xs font-medium opacity-50">Items</span></p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Compiling Ledger...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            
            {/* Table Sub-Header (Hidden on Mobile) */}
            <div className="hidden lg:grid grid-cols-12 px-12 py-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <div className="col-span-6">Inventory Asset</div>
              <div className="col-span-3 text-center">Market Traction</div>
              <div className="col-span-3 text-right">Financial Impact</div>
            </div>

            {products.map((product, index) => {
              const stats = salesData[product._id] || { quantity: 0, revenue: 0 };
              const revenuePercentage = totalGlobalRevenue > 0 ? (stats.revenue / totalGlobalRevenue) * 100 : 0;

              return (
                <div 
                  key={product._id} 
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="group animate-in slide-in-from-bottom-5 duration-700 bg-white border border-slate-100/60 rounded-[3rem] p-6 md:p-10 flex flex-col lg:grid lg:grid-cols-12 items-center gap-8 transition-all hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-1"
                >
                  {/* Asset Info */}
                  <div className="col-span-6 flex items-center gap-8 w-full">
                    <div className="relative w-24 h-24 rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                      <img 
                        src={product.images?.[0] || product.image?.[0] || "https://placehold.co/200"} 
                        alt="p" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">{product.category}</p>
                      <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors uppercase">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold text-slate-400">Inventory Sync Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Units Sold Metric */}
                  <div className="col-span-3 flex flex-col items-center justify-center w-full py-6 md:py-0 border-y md:border-y-0 border-slate-50">
                    <p className="lg:hidden text-[10px] font-black uppercase text-slate-300 mb-2 tracking-widest">Market Traction</p>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-50 rounded-full text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <FaBox size={14} />
                      </div>
                      <div className="text-center lg:text-left">
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.quantity.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Sales Volume</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Impact */}
                  <div className="col-span-3 text-center lg:text-right w-full">
                    <p className="lg:hidden text-[10px] font-black uppercase text-slate-300 mb-2 tracking-widest">Revenue Generation</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center lg:justify-end gap-2">
                         <FaDollarSign className="text-green-500" size={16} />
                         <p className="text-4xl font-black text-slate-900 tracking-tighter">${stats.revenue.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-center lg:justify-end gap-2">
                        <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden hidden lg:block">
                           <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${revenuePercentage}%` }}></div>
                        </div>
                        <p className="text-[10px] font-black text-indigo-600 uppercase italic">{revenuePercentage.toFixed(1)}% Yield</p>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 py-10 border-t border-slate-100 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">End of Business Ledger • Daulatpur Sync</p>
        </footer>

      </div>
    </div>
  );
};

export default TotalSales;