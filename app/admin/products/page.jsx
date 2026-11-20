'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import { db, storage } from '@/lib/firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Search,
  Upload,
  X,
  Check,
  Sparkles,
  Star,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Leaf,
  AlertCircle,
  RefreshCw,
  Tag,
  DollarSign,
  Layers,
  FileText
} from 'lucide-react';

const CATEGORIES = [
  'Elixirs & Nectars',
  'Royal Taila (Oils)',
  'Rasayana & Jam',
  'Serums & Extractions',
  'Herbal Infusions'
];

const HEALTH_CONCERNS = [
  'Gut Harmony & Digestion',
  'Deep Sleep & Stress Relief',
  'Hair Roots & Scalp Vitality',
  'Radiant Skin & Youth Renewal',
  'Daily Immunity & Vitality'
];

const INITIAL_FORM_STATE = {
  name: '',
  slug: '',
  sku: '',
  tagline: '',
  category: CATEGORIES[0],
  concerns: [],
  price: '',
  compareAtPrice: '',
  stock: 25,
  isFeatured: false,
  isActive: true,
  shortDesc: '',
  description: '',
  howToUse: '',
  ingredients: [],
  ingredientInput: '',
  benefits: [],
  benefitInput: '',
  sensoryProfile: {
    aroma: '',
    texture: '',
    dosha: 'Tridoshic'
  },
  images: []
};

function ProductMasterContent() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [saving, setSaving] = useState(false);
  
  // Image Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      if (!db) return;

      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));

      setProducts(list);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Slug Auto Generator
  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    const generatedSlug = nameVal
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      slug: editingProduct ? prev.slug : generatedSlug
    }));
  };

  // Open Modal for New
  const handleOpenNewModal = () => {
    setEditingProduct(null);
    setFormData(INITIAL_FORM_STATE);
    setShowModal(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      slug: prod.slug || prod.id,
      sku: prod.sku || '',
      tagline: prod.tagline || '',
      category: prod.category || CATEGORIES[0],
      concerns: prod.concerns || [],
      price: prod.price || '',
      compareAtPrice: prod.compareAtPrice || '',
      stock: prod.stock ?? 25,
      isFeatured: !!prod.isFeatured,
      isActive: prod.isActive ?? true,
      shortDesc: prod.shortDesc || '',
      description: prod.description || '',
      howToUse: prod.howToUse || '',
      ingredients: prod.ingredients || [],
      ingredientInput: '',
      benefits: prod.benefits || [],
      benefitInput: '',
      sensoryProfile: {
        aroma: prod.sensoryProfile?.aroma || '',
        texture: prod.sensoryProfile?.texture || '',
        dosha: prod.sensoryProfile?.dosha || 'Tridoshic'
      },
      images: prod.images || []
    });
    setShowModal(true);
  };

  // Image Upload to Firebase Storage
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!storage) {
      alert('Firebase Storage is not initialized properly.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const storageRef = ref(storage, `products/${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        alert('Image upload failed.');
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, downloadURL]
        }));
        setUploading(false);
        setUploadProgress(0);
      }
    );
  };

  // Remove Image URL from array
  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Concern Toggle
  const handleToggleConcern = (concern) => {
    setFormData((prev) => {
      const exists = prev.concerns.includes(concern);
      return {
        ...prev,
        concerns: exists
          ? prev.concerns.filter((c) => c !== concern)
          : [...prev.concerns, concern]
      };
    });
  };

  // Golden Chip Maker: Ingredients
  const handleAddIngredient = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = formData.ingredientInput.trim();
      if (val && !formData.ingredients.includes(val)) {
        setFormData((prev) => ({
          ...prev,
          ingredients: [...prev.ingredients, val],
          ingredientInput: ''
        }));
      }
    }
  };

  const handleRemoveIngredient = (idxToRemove) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, idx) => idx !== idxToRemove)
    }));
  };

  // Golden Chip Maker: Benefits
  const handleAddBenefit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = formData.benefitInput.trim();
      if (val && !formData.benefits.includes(val)) {
        setFormData((prev) => ({
          ...prev,
          benefits: [...prev.benefits, val],
          benefitInput: ''
        }));
      }
    }
  };

  const handleRemoveBenefit = (idxToRemove) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, idx) => idx !== idxToRemove)
    }));
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Product Name and Price are mandatory.');
      return;
    }

    try {
      setSaving(true);

      const targetId = editingProduct
        ? editingProduct.id
        : formData.slug || `nwo-${Date.now()}`;

      const payload = {
        name: formData.name,
        slug: formData.slug || targetId,
        sku: formData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        tagline: formData.tagline,
        category: formData.category,
        concerns: formData.concerns,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        stock: Number(formData.stock),
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        shortDesc: formData.shortDesc,
        description: formData.description,
        howToUse: formData.howToUse,
        ingredients: formData.ingredients,
        benefits: formData.benefits,
        sensoryProfile: formData.sensoryProfile,
        images: formData.images.length > 0 ? formData.images : ['/ingredients/card1.png'],
        updatedAt: serverTimestamp()
      };

      if (!editingProduct) {
        payload.createdAt = serverTimestamp();
      }

      await setDoc(doc(db, 'products', targetId), payload, { merge: true });

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product formulation.');
    } finally {
      setSaving(false);
    }
  };

  // Zero-Reload Toggle: Featured
  const handleToggleFeatured = async (product) => {
    try {
      const newStatus = !product.isFeatured;
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isFeatured: newStatus } : p))
      );
      await updateDoc(doc(db, 'products', product.id), { isFeatured: newStatus });
    } catch (err) {
      console.error('Error toggling featured:', err);
      fetchProducts();
    }
  };

  // Zero-Reload Toggle: Active
  const handleToggleActive = async (product) => {
    try {
      const newStatus = !product.isActive;
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: newStatus } : p))
      );
      await updateDoc(doc(db, 'products', product.id), { isActive: newStatus });
    } catch (err) {
      console.error('Error toggling active:', err);
      fetchProducts();
    }
  };

  // Delete Product
  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, 'products', deleteTarget.id));
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product.');
    }
  };

  // Filtered Products List
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0f4d2c]/30 border border-[#b07f24]/30 backdrop-blur-md shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b07f24]/20 border border-[#b07f24]/40 text-[#b07f24] text-[10px] uppercase font-bold tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Apothecary Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#fdfcf8] font-light">
            Formulation Master Catalog
          </h1>
          <p className="text-xs text-[#fdfcf8]/70 mt-1 font-sans">
            Build new clinical extractions, adjust pricing, tag dosha vitality, and manage stock status.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="px-6 py-3 rounded-xl bg-[#b07f24] hover:bg-[#c9942b] text-[#0a1813] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(176,127,36,0.3)] flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Botanical Formulation</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#b07f24] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Title, SKU or Slug..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#06120e] border border-[#b07f24]/30 text-xs text-[#fdfcf8] placeholder-[#fdfcf8]/40 focus:outline-none focus:border-[#b07f24]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-2 md:pb-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#b07f24] text-[#0a1813] border-[#b07f24] font-bold'
                : 'bg-[#06120e] text-[#fdfcf8]/70 border-[#b07f24]/30 hover:border-[#b07f24]'
            }`}
          >
            All Categories ({products.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                selectedCategory === cat
                  ? 'bg-[#b07f24] text-[#0a1813] border-[#b07f24] font-bold'
                  : 'bg-[#06120e] text-[#fdfcf8]/70 border-[#b07f24]/30 hover:border-[#b07f24]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Catalog Table */}
      <div className="bg-[#06120e] border border-[#b07f24]/30 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#fdfcf8]">
            <thead className="bg-[#0f4d2c]/40 border-b border-[#b07f24]/20 text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold">
              <tr>
                <th className="p-4 sm:p-5">Formulation</th>
                <th className="p-4 sm:p-5">Category & Dosha</th>
                <th className="p-4 sm:p-5">Pricing (₹)</th>
                <th className="p-4 sm:p-5">Stock</th>
                <th className="p-4 sm:p-5">Spotlight</th>
                <th className="p-4 sm:p-5">Visibility</th>
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b07f24]/10">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#fdfcf8]/60">
                    <RefreshCw className="w-6 h-6 text-[#b07f24] animate-spin mx-auto mb-2" />
                    <span>Loading formulation catalog...</span>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#fdfcf8]/60">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#0f4d2c]/20 transition-colors">
                    
                    {/* Thumbnail & Title */}
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg bg-[#0a1813] border border-[#b07f24]/30 overflow-hidden shrink-0 flex items-center justify-center p-1">
                          <img
                            src={p.images?.[0] || '/ingredients/card1.png'}
                            alt={p.name}
                            className="object-contain max-h-full"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-[#fdfcf8]">{p.name}</div>
                          <div className="text-[10px] font-mono text-[#b07f24]">SKU: {p.sku || 'N/A'}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Dosha */}
                    <td className="p-4 sm:p-5">
                      <div className="text-xs text-[#fdfcf8]">{p.category}</div>
                      <div className="text-[10px] text-[#b07f24] italic mt-0.5">
                        {p.sensoryProfile?.dosha || 'Tridoshic'}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 sm:p-5 font-mono">
                      <div className="font-bold text-[#fdfcf8]">₹{p.price}</div>
                      {p.compareAtPrice && (
                        <div className="text-[10px] text-[#fdfcf8]/50 line-through">₹{p.compareAtPrice}</div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="p-4 sm:p-5 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        p.stock > 10 
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40' 
                          : p.stock > 0 
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                            : 'bg-red-950/60 text-red-400 border border-red-500/40'
                      }`}>
                        {p.stock} pcs
                      </span>
                    </td>

                    {/* Spotlight Toggle */}
                    <td className="p-4 sm:p-5">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          p.isFeatured
                            ? 'bg-[#b07f24]/20 border-[#b07f24] text-[#b07f24]'
                            : 'bg-[#0a1813] border-[#b07f24]/20 text-[#fdfcf8]/40 hover:text-[#fdfcf8]'
                        }`}
                        title="Toggle Spotlight on Home"
                      >
                        <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-[#b07f24]' : ''}`} />
                      </button>
                    </td>

                    {/* Visibility Toggle */}
                    <td className="p-4 sm:p-5">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border cursor-pointer ${
                          p.isActive
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50'
                            : 'bg-red-950/60 text-red-400 border-red-500/50'
                        }`}
                      >
                        {p.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{p.isActive ? 'Active' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 sm:p-5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-2 rounded-lg bg-[#0f4d2c]/60 hover:bg-[#0f4d2c] text-[#fdfcf8] border border-[#b07f24]/30 transition-all cursor-pointer"
                        title="Edit Formulation"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800 transition-all cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MASTER PRODUCT BUILDER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#06120e] border border-[#b07f24] rounded-3xl p-6 sm:p-8 text-[#fdfcf8] shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto scrollbar-none">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#b07f24]/20 pb-4 sticky top-0 bg-[#06120e] z-10">
              <div className="flex items-center gap-2 text-[#b07f24]">
                <Package className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-[#fdfcf8]">
                  {editingProduct ? 'Edit Apothecary Formulation' : 'Create New Botanical Extraction'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg bg-[#0f4d2c] text-[#fdfcf8] hover:bg-[#b07f24] hover:text-[#0a1813] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Title & SKU Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    Formulation Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Triphala & Supercritical Ginger Bio-Elixir"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SKU-9021"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  />
                </div>
              </div>

              {/* Tagline & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-7">
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    Apothecary Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="10:1 Cold-Pressed Supercritical CO₂ Extract"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#0f4d2c]/20 border border-[#b07f24]/20">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    Offer Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1399"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    Compare MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="1850"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    Harvest Stock (Units)
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="25"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  />
                </div>
              </div>

              {/* Health Concern Tagging */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-2">
                  Target Health Concerns / Dosha Alignment:
                </label>
                <div className="flex flex-wrap gap-2">
                  {HEALTH_CONCERNS.map((hc) => {
                    const isSelected = formData.concerns.includes(hc);
                    return (
                      <button
                        key={hc}
                        type="button"
                        onClick={() => handleToggleConcern(hc)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-[#b07f24] text-[#0a1813] border-[#b07f24] font-bold'
                            : 'bg-[#0a1813] text-[#fdfcf8]/70 border-[#b07f24]/30 hover:border-[#b07f24]'
                        }`}
                      >
                        {hc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image Direct PC Uploader */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-2">
                  Product Images (Direct Upload from PC / Storage)
                </label>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Upload Trigger Button */}
                  <label className="w-24 h-24 rounded-2xl bg-[#0a1813] border-2 border-dashed border-[#b07f24]/50 hover:border-[#b07f24] flex flex-col items-center justify-center cursor-pointer transition-all">
                    {uploading ? (
                      <div className="text-center p-2">
                        <RefreshCw className="w-5 h-5 text-[#b07f24] animate-spin mx-auto mb-1" />
                        <span className="text-[10px] font-mono text-[#b07f24]">{uploadProgress}%</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-[#b07f24] mb-1" />
                        <span className="text-[9px] uppercase tracking-wider text-[#fdfcf8]/70">Add Image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded Thumbnails Grid */}
                  {formData.images.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-24 rounded-2xl bg-[#0a1813] border border-[#b07f24]/40 overflow-hidden p-1 group"
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-950 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-[#b07f24] text-[#0a1813] text-[8px] font-bold px-1.5 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Golden Chip Maker: Botanical Composition (Ingredients) */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                  Botanical Composition (Press Enter to Add Golden Chip)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.ingredientInput}
                    onChange={(e) => setFormData({ ...formData, ingredientInput: e.target.value })}
                    onKeyDown={handleAddIngredient}
                    placeholder="e.g. Organic Kashmiri Saffron"
                    className="flex-1 px-4 py-2 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  />
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="px-4 py-2 rounded-xl bg-[#0f4d2c] border border-[#b07f24]/40 text-xs font-semibold text-[#fdfcf8]"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#b07f24]/15 text-[#b07f24] border border-[#b07f24]/40"
                    >
                      <Leaf className="w-3 h-3 text-[#0f4d2c]" />
                      <span>{ing}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(idx)}
                        className="hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Descriptions & How To Use */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    Short Narrative Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.shortDesc}
                    onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                    placeholder="Brief 2-line summary for PDP header and quick views..."
                    className="w-full px-4 py-2 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#b07f24] font-semibold mb-1">
                    Ritual Application & How to Use
                  </label>
                  <textarea
                    rows={2}
                    value={formData.howToUse}
                    onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                    placeholder="Take 3-4 drops at night, massage gently in upward circular motions..."
                    className="w-full px-4 py-2 rounded-xl bg-[#0a1813] border border-[#b07f24]/30 text-xs text-[#fdfcf8] focus:outline-none focus:border-[#b07f24]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#b07f24]/20 sticky bottom-0 bg-[#06120e] py-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#b07f24]/30 text-xs text-[#fdfcf8]/70 hover:bg-[#0f4d2c]/20"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#b07f24] hover:bg-[#c9942b] text-[#0a1813] font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Formulation...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingProduct ? 'Update Formulation' : 'Publish Formulation'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* TWO-STEP SAFE DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#06120e] border border-red-800 rounded-3xl p-6 text-[#fdfcf8] shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold">Delete Formulation?</h3>
            </div>

            <p className="text-xs text-[#fdfcf8]/80 leading-relaxed">
              Are you sure you want to permanently delete <span className="font-bold text-[#b07f24]">{deleteTarget.name}</span>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#b07f24]/20">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-[#b07f24]/30 text-xs text-[#fdfcf8]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-5 py-2 rounded-xl bg-red-900 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductMasterPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'subadmin', 'logistics']}>
      <ProductMasterContent />
    </ProtectedRoute>
  );
}