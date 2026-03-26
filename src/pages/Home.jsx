import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { serverUrl } from "../../config";
import {
  FaBoxOpen,
  FaUsers,
  FaHistory,
  FaDollarSign,
  FaLayerGroup,
  FaCrown,
  FaChartLine,
} from "react-icons/fa";

// Skeleton Loader for Premium Light Theme
const PremiumSkeleton = () => (
  <div className="animate-pulse flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-100 shadow-xl h-56 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-10 -mt-10"></div>
    <div className="flex items-center gap-5 relative z-10">
      <div className="w-14 h-14 bg-slate-200 rounded-2xl"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-4 bg-slate-200 rounded w-1/3 mt-8 relative z-10"></div>
  </div>
);

const Home = ({ token }) => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchDashboardStats = async () => {
    if (!token) return toast.error("Session expired. Please login again.");

    try {
      setLoading(true);
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        axios.get(`${serverUrl}/api/order/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${serverUrl}/api/user/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${serverUrl}/api/product/list`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (ordersRes.data.success) {
        setTotalOrders(ordersRes.data.orders.length);
        const revenue = ordersRes.data.orders.reduce(
          (acc, order) => acc + (order.totalAmount || order.amount || 0),
          0
        );
        setTotalRevenue(revenue);
      }

      if (usersRes.data.success) setTotalUsers(usersRes.data.users.length);
      if (productsRes.data.success) {
        setTotalProducts(productsRes.data.product.length);
        const categories = [
          ...new Set(productsRes.data.product.map((p) => p.category)),
        ];
        setTotalCategories(categories.length);
      }
    } catch (error) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [token]);

  const stats = [
    {
      title: "Total Revenue",
      count: `$${totalRevenue.toLocaleString()}`,
      icon: <FaDollarSign size={28} />,
      link: "/sales",
      description: "Aggregate earnings from all successful transactions.",
      trend: "+12.5% this month",
      gradient: "from-amber-500 to-orange-600",
      textGradient: "from-amber-600 to-orange-600",
      trendColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Global Orders",
      count: totalOrders,
      icon: <FaHistory size={28} />,
      link: "/order",
      description: "Comprehensive log of all customer purchases.",
      trend: "Consistent growth",
      gradient: "from-blue-500 to-indigo-600",
      textGradient: "from-blue-600 to-indigo-600",
      trendColor: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Active Users",
      count: totalUsers,
      icon: <FaUsers size={28} />,
      link: "/user",
      description: "Total registered members within the ecosystem.",
      trend: "Highly engaged",
      gradient: "from-emerald-500 to-teal-600",
      textGradient: "from-emerald-600 to-teal-600",
      trendColor: "text-teal-600 bg-teal-50 border-teal-200",
    },
    {
      title: "Premium Inventory",
      count: totalProducts,
      icon: <FaBoxOpen size={28} />,
      link: "/list",
      description: "Exclusive products currently available in stock.",
      trend: "Optimized catalog",
      gradient: "from-rose-500 to-red-600",
      textGradient: "from-rose-600 to-red-600",
      trendColor: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      title: "Product Collections",
      count: totalCategories,
      icon: <FaLayerGroup size={28} />,
      link: "/list",
      description: "Diverse categories organizing our premium assets.",
      trend: "Well structured",
      gradient: "from-fuchsia-500 to-purple-600",
      textGradient: "from-fuchsia-600 to-purple-600",
      trendColor: "text-purple-600 bg-purple-50 border-purple-200",
    },
  ];

  return (
    <div className="relative min-h-screen bg-white p-6 md:p-12 overflow-hidden font-sans">
      {/* Soft Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header Section */}
      <div className="relative z-10 mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-amber-600 text-xs font-black tracking-widest uppercase mb-6">
            <FaCrown className="text-amber-500" />
            Executive Workspace
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
            Welcome Back, Shihab
          </h1>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl font-medium">
            Monitor your global metrics and premium assets in real-time with our latest intelligence dashboard.
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-slate-400 text-xs font-black tracking-wider uppercase">Current Date</p>
          <p className="text-slate-800 font-black text-lg">{currentDate}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((i) => <PremiumSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-slate-100 transition-all duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden hover:-translate-y-1"
              >
                <div className="relative z-10 flex items-start gap-6">
                  {/* Fixed Icon Container with Gradient Background */}
                  <div className={`p-5 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}>
                    <div className="text-white drop-shadow-md">
                      {stat.icon}
                    </div>
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                      {stat.title}
                    </p>
                    <p className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br ${stat.textGradient} truncate pb-1`}>
                      {stat.count}
                    </p>
                    <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">
                      {stat.description}
                    </p>
                    <div className={`flex items-center gap-2 mt-4 text-[10px] font-black inline-flex px-3 py-1 rounded-full border ${stat.trendColor} uppercase tracking-tighter`}>
                      <FaChartLine /> {stat.trend}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                  <Link
                    to={stat.link}
                    className="text-xs font-black text-slate-400 group-hover:text-slate-900 transition-colors flex items-center gap-2 uppercase tracking-widest"
                  >
                    Explore Insights <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
