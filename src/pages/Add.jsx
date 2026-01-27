import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt, FaMagic, FaSave } from "react-icons/fa";
import Title from "../component/Title";
import Input, { Label } from "../component/ui/Input";
import { TiPlus } from "react-icons/ti";
import SmallLoader from "../component/SmallLoader";
import toast from "react-hot-toast";
import { serverUrl } from "../../config";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Add = () => {
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // English Comment: Get product ID from URL params

  // ✅ List of 20 Categories
  const categoriesList = [
    "Smartphones", "Laptops", "Tablets", "Monitors", "Processors",
    "RAM", "Motherboards", "Graphics Cards", "SSD & HDD", "Power Supply",
    "Casing", "Airbuds", "Over-Ear Headphones", "Smart Watches", "Keyboards",
    "Mouse", "Speakers", "Cameras", "Gaming Console", "Lights & Studio"
  ];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    discountedPercentage: "",
    stock: "10",
    _type: "electronics",
    category: "",
    offer: false,
    isAvailable: true,
    badge: "",
    tags: [],
    specifications: "", 
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });

  const [previews, setPreviews] = useState({ image1: null, image2: null, image3: null, image4: null });

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await axios.get(`${serverUrl}/api/product/single/${id}`);
          if (response.data.success) {
            const p = response.data.product;
            setFormData({
              ...formData,
              name: p.name || "",
              description: p.description || "",
              brand: p.brand || "",
              price: p.price || "",
              discountedPercentage: p.discountedPercentage || "",
              stock: p.stock || "10",
              category: p.category || "",
              offer: p.offer || false,
              isAvailable: p.isAvailable ?? true,
              badge: p.badge || "",
              tags: p.tags || [],
              specifications: p.specifications ? JSON.stringify(p.specifications, null, 2) : "",
            });
            
            setPreviews({
              image1: p.images?.[0] || null,
              image2: p.images?.[1] || null,
              image3: p.images?.[2] || null,
              image4: p.images?.[3] || null,
            });
          }
        } catch (error) {
          console.error("Fetch Error:", error);
          toast.error("Failed to load product data.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : 
                       (value === "true" ? true : (value === "false" ? false : value));
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleImageChange = (e) => {
    const { id, files } = e.target;
    if (files[0]) {
      setFormData((prev) => ({ ...prev, [id]: files[0] }));
      setPreviews((prev) => ({ ...prev, [id]: URL.createObjectURL(files[0]) }));
    }
  };

  const handleAiFill = async () => {
    if (!formData.name) return toast.error("Please enter a product name first!");
    try {
      setAiLoading(true);
      const adminToken = localStorage.getItem("token");
      const response = await axios.post(`${serverUrl}/api/product/ai-generate`,
        { productName: formData.name, brand: formData.brand, category: formData.category },
        { headers: { token: adminToken } }
      );

      if (response.data.success) {
        const ai = response.data.data;
        setFormData((prev) => ({
          ...prev,
          description: ai.description || prev.description,
          brand: ai.brand || prev.brand,
          tags: ai.tags || prev.tags,
          price: ai.suggestedPrice || prev.price,
          badge: ai.badge || prev.badge,
          specifications: JSON.stringify(ai.specifications, null, 2), 
        }));
        toast.success("AI has refilled the details!");
      }
    } catch (error) {
      toast.error("AI failed to generate data.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleUploadProduct = async (e) => {
    e.preventDefault();
    const adminToken = localStorage.getItem("token");
    if (!adminToken) return toast.error("Admin not logged in!");

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags") {
          data.append(key, JSON.stringify(value));
        } else if (key === "specifications") {
          data.append(key, value);
        } else if (value !== null && !key.startsWith('image')) {
          data.append(key, value);
        }
      });

      if (formData.image1 instanceof File) data.append("image1", formData.image1);
      if (formData.image2 instanceof File) data.append("image2", formData.image2);
      if (formData.image3 instanceof File) data.append("image3", formData.image3);
      if (formData.image4 instanceof File) data.append("image4", formData.image4);

      const endpoint = id ? `${serverUrl}/api/product/update/${id}` : `${serverUrl}/api/product/add`;
      const response = await axios.post(endpoint, data, {
        headers: { token: adminToken, "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success(id ? "Product updated successfully!" : "Product added successfully!");
        navigate("/list");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUploadProduct} className="flex flex-col items-start gap-4 w-full pb-10 max-w-5xl mx-auto px-4">
      <Title className="text-black">{id ? "Edit Product" : "Upload Product to Database"}</Title>

      {/* Image Preview Section */}
      <div className="flex flex-wrap items-center gap-5 my-4">
        {["image1", "image2", "image3", "image4"].map((imageId) => (
          <label htmlFor={imageId} key={imageId} className="group relative">
            <div className="text-gray-500 border-2 border-dashed border-gray-400 w-28 h-28 flex flex-col items-center justify-center hover:border-black transition-all cursor-pointer rounded-lg overflow-hidden bg-white">
              {previews[imageId] ? (
                <img src={previews[imageId]} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <FaCloudUploadAlt className="text-4xl" />
              )}
              <input type="file" hidden id={imageId} onChange={handleImageChange} />
            </div>
          </label>
        ))}
      </div>

      <div className="flex flex-col w-full gap-1">
        <Label>Product Name</Label>
        <div className="flex gap-2">
          <Input className="flex-1" type="text" value={formData.name} name="name" onChange={handleChange} required />
          <button type="button" onClick={handleAiFill} disabled={aiLoading} className="bg-blue-600 text-white px-4 rounded-md flex items-center gap-2 hover:bg-blue-700 transition disabled:bg-gray-400 font-medium">
            {aiLoading ? <SmallLoader /> : <><FaMagic /> AI Fill</>}
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full gap-1">
        <Label>Product Description</Label>
        <textarea rows={4} name="description" value={formData.description} onChange={handleChange} className="border p-3 border-gray-300 rounded-md w-full focus:border-black outline-none transition bg-white" required />
      </div>

      <div className="flex flex-col w-full gap-1">
        <Label>Technical Specifications (JSON)</Label>
        <textarea rows={5} name="specifications" value={formData.specifications} onChange={handleChange} className="border p-3 border-gray-300 rounded-md w-full font-mono text-sm bg-gray-50 outline-none focus:border-blue-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        <div className="flex flex-col gap-1">
          <Label>Price (USD)</Label>
          <Input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Brand</Label>
          <Input type="text" name="brand" value={formData.brand} onChange={handleChange} required />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Discount (%)</Label>
          <Input type="number" name="discountedPercentage" value={formData.discountedPercentage} onChange={handleChange} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 w-full">
        {/* ✅ Dynamic Category Selector */}
        <div className="flex flex-col gap-1 min-w-[200px]">
          <Label>Category</Label>
          <select name="category" value={formData.category} onChange={handleChange} className="border p-2 rounded-md outline-none bg-white cursor-pointer hover:border-black transition" required>
            <option value="">Select Category</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <Label>Badge</Label>
          <select name="badge" value={formData.badge} onChange={handleChange} className="border p-2 rounded-md outline-none bg-white cursor-pointer">
            <option value="">None</option>
            <option value="New Arrival">New Arrival</option>
            <option value="Best Seller">Best Seller</option>
            <option value="Special Offer">Special Offer</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[120px]">
          <Label>Availability</Label>
          <select name="isAvailable" value={formData.isAvailable} onChange={handleChange} className="border p-2 rounded-md outline-none bg-white cursor-pointer">
            <option value={true}>Available</option>
            <option value={false}>Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="w-full mt-2">
        <Label>Tags (SEO Keywords)</Label>
        <div className="flex flex-wrap gap-4 mt-2 bg-gray-50 p-3 rounded-md border border-gray-200">
          {["Fashion", "Electronics", "Mobile", "Laptops", "Gadgets"].map((tag) => (
            <label key={tag} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" checked={formData.tags.includes(tag)} onChange={(e) => {
                const updatedTags = e.target.checked ? [...formData.tags, tag] : formData.tags.filter(t => t !== tag);
                setFormData(prev => ({ ...prev, tags: updatedTags }));
              }} />
              <span className="text-sm">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      <button disabled={loading || aiLoading} type="submit" className="mt-6 bg-black text-white px-12 py-3 rounded-md flex items-center gap-2 hover:bg-zinc-800 transition-all font-bold disabled:bg-gray-400 uppercase tracking-wider shadow-lg">
        {loading ? <SmallLoader /> : (id ? <><FaSave /> Update Product</> : <><TiPlus /> Add Product</>)}
      </button>
    </form>
  );
};

export default Add;