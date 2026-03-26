import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { serverUrl } from "../../config";
import Title from "../component/Title";
import Loader from "../component/Loader";
import { Link } from "react-router-dom";
import Price from "../component/Price";
import { FaRegTrashAlt, FaEdit, FaPlus, FaBoxOpen } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  // English Comment: Fetch all products from the database
  const fetchProductList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/product/list`);
      if (response.data?.success) {
        setList(response.data.product);
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // English Comment: Delete product logic with Confirmation
  const handleRemoveProduct = async (item) => {
    const confirm = window.confirm(`Remove ${item.name} from inventory?`);
    if (!confirm) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${serverUrl}/api/product/remove`,
        { _id: item._id },
        { headers: { token } }
      );
      if (response.data?.success) {
        toast.success("Product deleted");
        fetchProductList();
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {loading && <Loader />}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <Title>Inventory System</Title>
            <p className="text-gray-500 text-xs md:text-sm font-medium">
              You have total <span className="text-indigo-600 font-bold">{list?.length}</span> products in stock.
            </p>
          </div>
          <Link
            to="/add"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
          >
            <FaPlus size={14} /> Add New Item
          </Link>
        </div>

        {/* Content Section */}
        {list?.length > 0 ? (
          <div className="bg-white rounded-[2rem] border border-gray-200 shadow-2xl overflow-hidden">
            
            {/* Desktop Table Header (Hidden on Mobile) */}
            <div className="hidden md:grid grid-cols-[0.8fr_3fr_1.5fr_1.2fr_1.5fr] items-center py-5 px-8 bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              <span>Preview</span>
              <span>Product & Brand</span>
              <span>Category</span>
              <span>Price</span>
              <span className="text-right">Management</span>
            </div>

            {/* Product Rows */}
            <div className="divide-y divide-gray-200">
              {list.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:grid md:grid-cols-[0.8fr_3fr_1.5fr_1.2fr_1.5fr] items-center py-6 px-6 md:px-8 hover:bg-indigo-50/20 transition-all gap-4 md:gap-0"
                >
                  {/* Image Section */}
                  <div className="relative group w-full md:w-auto flex justify-center md:justify-start">
                    <img
                      src={item.images?.[0] || "https://placehold.co/100"}
                      className="w-24 h-24 md:w-16 md:h-16 object-cover rounded-2xl border border-gray-100 bg-white shadow-sm"
                      alt="product"
                    />
                    <div className="absolute top-0 left-0 bg-black/50 text-white text-[8px] px-2 py-1 rounded-tl-2xl rounded-br-2xl md:hidden font-bold uppercase">
                       {item.brand || 'No Brand'}
                    </div>
                  </div>

                  {/* Name & Brand */}
                  <div className="text-center md:text-left space-y-1">
                    <p className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 px-2 md:px-0">{item.name}</p>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter hidden md:block">
                      {item.brand || 'Generic'}
                    </p>
                  </div>

                  {/* Category Badge */}
                  <div className="flex justify-center md:justify-start">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="text-center md:text-left">
                    <p className="text-lg md:text-sm font-black text-gray-900">
                      <Price amount={item.price} />
                    </p>
                  </div>

                  {/* Actions (Mobile Friendly) */}
                  <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto mt-2 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                    <Link
                      to={`/add/${item._id}`}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 md:p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 group"
                    >
                      <FaEdit size={16} />
                      <span className="text-xs font-bold md:hidden">Edit Product</span>
                    </Link>
                    <button
                      onClick={() => handleRemoveProduct(item)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 md:p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      <FaRegTrashAlt size={16} />
                      <span className="text-xs font-bold md:hidden">Delete Item</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State Section */
          <div className="text-center py-24 md:py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBoxOpen className="text-gray-200 text-4xl" />
            </div>
            <h3 className="text-gray-900 font-bold text-xl">Your inventory is empty</h3>
            <p className="text-gray-400 text-sm max-w-[250px] mx-auto mt-2 font-medium">
              Start adding products to see them listed here in your vault.
            </p>
            <Link 
              to="/add" 
              className="mt-8 inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:scale-105 transition-transform"
            >
              Add Your First Product
            </Link>
          </div>
        )}

        {/* Pro Tip Footer */}
        <div className="mt-10 flex items-center justify-center gap-2 text-gray-400">
          <IoMdInformationCircleOutline size={16} />
          <p className="text-[10px] font-bold uppercase tracking-widest">Tip: Use the edit button to update stock levels</p>
        </div>
      </div>
    </div>
  );
};

export default List;
