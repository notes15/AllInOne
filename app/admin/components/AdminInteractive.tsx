'use client';

import { useState, useEffect } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, push, get, remove, set } from 'firebase/database';
import Icon from '@/components/ui/AppIcon';
import UsersManagement from './UsersManagement';
import OrdersManagement from './OrdersManagement';
import ConfirmModal from './ConfirmModal';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  images: string[];
  imageAlt?: string;
  quantity?: number | null;
  description?: string;
  sizes?: string[];
}

interface Category {
  id: string;
  name: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export default function AdminInteractive() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '', category: '', price: '', images: [''], imageAlt: '', quantity: '', description: '', sizes: [] as string[]
  });
  const [currentSize, setCurrentSize] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editCurrentSize, setEditCurrentSize] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const fetchProducts = async () => {
    const snapshot = await get(ref(rtdb, 'products'));
    if (snapshot.exists()) {
      setProducts(Object.entries(snapshot.val()).map(([id, val]: [string, any]) => ({ id, ...val })) as Product[]);
    } else setProducts([]);
  };

  const fetchCategories = async () => {
    const snapshot = await get(ref(rtdb, 'categories'));
    if (snapshot.exists()) {
      setCategories(Object.entries(snapshot.val()).map(([id, val]: [string, any]) => ({
        id, name: typeof val === 'string' ? val : val.name
      })) as Category[]);
    } else setCategories([]);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    try {
      await push(ref(rtdb, 'categories'), { name: newCategory.trim() });
      const name = newCategory.trim();
      setNewCategory('');
      fetchCategories();
      showToast(`Category "${name}" added!`);
    } catch { showToast('Failed to add category', 'error'); }
  };

  const handleSaveEditCategory = async (id: string) => {
    if (!editCategoryName.trim()) return;
    try {
      await set(ref(rtdb, `categories/${id}`), { name: editCategoryName.trim() });
      setEditingCategoryId(null);
      fetchCategories();
      showToast(`Category renamed to "${editCategoryName.trim()}"!`);
    } catch { showToast('Failed to update category', 'error'); }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    try {
      await remove(ref(rtdb, `categories/${id}`));
      fetchCategories();
      showToast(`Category "${name}" deleted!`);
    } catch { showToast('Failed to delete category', 'error'); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData: any = {
        name: newProduct.name, category: newProduct.category,
        price: parseFloat(newProduct.price),
        images: newProduct.images.filter(img => img.trim() !== ''),
        quantity: newProduct.quantity === '' ? null : parseInt(newProduct.quantity),
      };
      if (newProduct.imageAlt) productData.imageAlt = newProduct.imageAlt;
      if (newProduct.description) productData.description = newProduct.description;
      if (newProduct.sizes.length > 0) productData.sizes = newProduct.sizes;
      await push(ref(rtdb, 'products'), productData);
      const name = newProduct.name;
      setNewProduct({ name: '', category: '', price: '', images: [''], imageAlt: '', quantity: '', description: '', sizes: [] });
      setCurrentSize('');
      fetchProducts();
      showToast(`Product "${name}" added!`);
    } catch { showToast('Failed to add product', 'error'); }
  };

  const handleAddSize = () => { if (currentSize.trim()) { setNewProduct(p => ({ ...p, sizes: [...p.sizes, currentSize.trim()] })); setCurrentSize(''); } };
  const handleRemoveSize = (i: number) => setNewProduct(p => ({ ...p, sizes: p.sizes.filter((_, j) => j !== i) }));
  const handleEditAddSize = () => { if (editCurrentSize.trim() && editProduct) { setEditProduct({ ...editProduct, sizes: [...(editProduct.sizes || []), editCurrentSize.trim()] }); setEditCurrentSize(''); } };
  const handleEditRemoveSize = (i: number) => { if (editProduct) setEditProduct({ ...editProduct, sizes: (editProduct.sizes || []).filter((_, j) => j !== i) }); };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await remove(ref(rtdb, `products/${productToDelete.id}`));
      fetchProducts();
      showToast(`Product "${productToDelete.name}" deleted!`);
      setShowDeleteModal(false); setProductToDelete(null);
    } catch { showToast('Failed to delete product', 'error'); }
  };

  const handleSaveEdit = async () => {
    if (!editProduct || !editingProductId) return;
    try {
      const productData: any = {
        name: editProduct.name, category: editProduct.category, price: editProduct.price,
        images: editProduct.images.filter(img => img.trim() !== ''),
        quantity: editProduct.quantity === null ? null : editProduct.quantity,
      };
      if (editProduct.imageAlt) productData.imageAlt = editProduct.imageAlt;
      if (editProduct.description) productData.description = editProduct.description;
      if (editProduct.sizes && editProduct.sizes.length > 0) productData.sizes = editProduct.sizes;
      await set(ref(rtdb, `products/${editingProductId}`), productData);
      setEditingProductId(null); setEditProduct(null); setEditCurrentSize('');
      fetchProducts(); showToast('Product updated!');
    } catch { showToast('Failed to update product', 'error'); }
  };

  const inp = "px-4 py-2 bg-white text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary";
  const btn = "bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors";

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Toasts */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-white font-semibold text-sm ${t.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ animation: 'toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <span className="text-lg">{t.type === 'success' ? '✓' : '✕'}</span>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateX(80px) scale(0.9); } to { opacity:1; transform:translateX(0) scale(1); } }`}</style>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Admin Dashboard</h1>
        <div className="flex gap-4 mb-8 border-b border-border">
          {['products', 'categories', 'users', 'orders'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {tab}
            </button>
          ))}
        </div>

        {showDeleteModal && productToDelete && (
          <ConfirmModal isOpen={true} title="Delete Product"
            message={`Are you sure you want to delete "${productToDelete.name}"?`}
            onConfirm={confirmDelete}
            onCancel={() => { setShowDeleteModal(false); setProductToDelete(null); }} />
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className={inp} required />
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className={inp} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="number" step="0.01" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className={inp} required />
                  <input type="number" placeholder="Quantity (optional, leave empty for unlimited)" value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: e.target.value})} className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Product Images</label>
                  {newProduct.images.map((img, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input type="url" placeholder={`Image URL ${i + 1}`} value={img} onChange={e => setNewProduct(p => ({ ...p, images: p.images.map((x, j) => j === i ? e.target.value : x) }))} className={`flex-1 ${inp}`} required={i === 0} />
                      {newProduct.images.length > 1 && <button type="button" onClick={() => setNewProduct(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }))} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Remove</button>}
                    </div>
                  ))}
                  <button type="button" onClick={() => setNewProduct(p => ({ ...p, images: [...p.images, ''] }))} className={`px-4 py-2 text-sm ${btn}`}>+ Add Another Image</button>
                </div>
                <input type="text" placeholder="Image Alt Text (optional)" value={newProduct.imageAlt} onChange={e => setNewProduct({...newProduct, imageAlt: e.target.value})} className={`w-full ${inp}`} />
                <textarea placeholder="Description (optional)" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className={`w-full ${inp} min-h-[100px]`} />
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Sizes (Optional)</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" placeholder="Enter size (e.g., S, M, L, 38, 40, etc.)" value={currentSize} onChange={e => setCurrentSize(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddSize())} className={`flex-1 ${inp}`} />
                    <button type="button" onClick={handleAddSize} className={`px-4 py-2 ${btn}`}>Add Size</button>
                  </div>
                  {newProduct.sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newProduct.sizes.map((s, i) => (
                        <span key={i} className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {s}<button type="button" onClick={() => handleRemoveSize(i)} className="hover:text-red-500">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button type="submit" className={`w-full py-3 font-semibold ${btn}`}>Add Product</button>
              </form>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Current Products</h2>
              <div className="space-y-4">
                {products.map(product => {
                  const stock = product.quantity === 0 ? { text: 'Out of Stock', color: 'text-red-600' }
                    : product.quantity != null ? { text: `${product.quantity} in stock`, color: 'text-yellow-600' }
                    : { text: 'In Stock', color: 'text-green-600' };

                  if (editingProductId === product.id && editProduct) return (
                    <div key={product.id} className="p-4 bg-secondary rounded-lg border-2 border-primary">
                      <h3 className="font-semibold text-foreground mb-4">Editing Product</h3>
                      <div className="space-y-3">
                        <input type="text" value={editProduct.name} onChange={e => setEditProduct({...editProduct, name: e.target.value})} className="w-full px-3 py-2 bg-white text-foreground rounded-lg border border-border text-sm" />
                        <select value={editProduct.category} onChange={e => setEditProduct({...editProduct, category: e.target.value})} className="w-full px-3 py-2 bg-white text-foreground rounded-lg border border-border text-sm">
                          <option value="">Select Category</option>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="number" step="0.01" value={editProduct.price} onChange={e => setEditProduct({...editProduct, price: parseFloat(e.target.value)})} className="px-3 py-2 bg-white text-foreground rounded-lg border border-border text-sm" />
                          <input type="number" placeholder="Quantity" value={editProduct.quantity === null ? '' : editProduct.quantity} onChange={e => setEditProduct({...editProduct, quantity: e.target.value === '' ? null : parseInt(e.target.value)})} className="px-3 py-2 bg-white text-foreground rounded-lg border border-border text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Images</label>
                          {editProduct.images.map((img, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                              <input type="url" value={img} onChange={e => setEditProduct({...editProduct, images: editProduct.images.map((x, j) => j === i ? e.target.value : x)})} className="flex-1 px-3 py-2 bg-white text-foreground rounded-lg border border-border text-sm" />
                              {editProduct.images.length > 1 && <button type="button" onClick={() => setEditProduct({...editProduct, images: editProduct.images.filter((_, j) => j !== i)})} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">Remove</button>}
                            </div>
                          ))}
                          <button type="button" onClick={() => setEditProduct({...editProduct, images: [...editProduct.images, '']})} className={`px-3 py-2 text-xs ${btn}`}>+ Add Image</button>
                        </div>
                        <input type="text" placeholder="Image Alt Text" value={editProduct.imageAlt || ''} onChange={e => setEditProduct({...editProduct, imageAlt: e.target.value})} className="w-full px-3 py-2 bg-white text-foreground rounded-lg border border-border text-sm" />
                        <textarea placeholder="Description" value={editProduct.description || ''} onChange={e => setEditProduct({...editProduct, description: e.target.value})} className="w-full px-3 py-2 bg-white text-foreground rounded-lg border border-border text-sm min-h-[80px]" />
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">Sizes</label>
                          <div className="flex gap-2 mb-2">
                            <input type="text" placeholder="Enter size" value={editCurrentSize} onChange={e => setEditCurrentSize(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleEditAddSize())} className="flex-1 px-3 py-2 bg-white text-foreground rounded-lg border border-border text-sm" />
                            <button type="button" onClick={handleEditAddSize} className={`px-4 py-2 text-sm ${btn}`}>Add</button>
                          </div>
                          {editProduct.sizes && editProduct.sizes.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {editProduct.sizes.map((s, i) => (
                                <span key={i} className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                  {s}<button type="button" onClick={() => handleEditRemoveSize(i)} className="hover:text-red-500">×</button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button type="button" onClick={handleSaveEdit} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600">Save</button>
                        <button type="button" onClick={() => setEditingProductId(null)} className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600">Cancel</button>
                      </div>
                    </div>
                  );

                  return (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div className="flex items-center gap-4">
                        {product.images?.[0] && <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />}
                        <div>
                          <h3 className="text-foreground font-medium">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {product.category} • ${product.price.toFixed(2)} • <span className={stock.color}>{stock.text}</span>
                            {product.images?.length > 1 && ` • ${product.images.length} images`}
                            {product.sizes?.length > 0 && ` • Sizes: ${product.sizes.join(', ')}`}
                          </p>
                          {product.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => { setEditingProductId(product.id); setEditProduct({...product}); }} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                          <Icon name="PencilIcon" size={20} />
                        </button>
                        <button type="button" onClick={() => { setProductToDelete({id: product.id, name: product.name}); setShowDeleteModal(true); }} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Icon name="TrashIcon" size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Add New Category</h2>
              <form onSubmit={handleAddCategory} className="flex gap-3">
                <input type="text" placeholder="Category Name (e.g., Shoes, Clothing...)" value={newCategory} onChange={e => setNewCategory(e.target.value)} className={`flex-1 ${inp}`} required />
                <button type="submit" className={`px-6 py-2 font-semibold ${btn}`}>Add Category</button>
              </form>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Current Categories
                <span className="ml-3 text-sm font-normal text-muted-foreground">{categories.length} total</span>
              </h2>
              {categories.length === 0 ? (
                <p className="text-muted-foreground text-sm">No categories yet. Add one above.</p>
              ) : (
                <div className="space-y-3">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      {editingCategoryId === cat.id ? (
                        <div className="flex items-center gap-3 flex-1 mr-3">
                          <input
                            type="text"
                            value={editCategoryName}
                            onChange={e => setEditCategoryName(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSaveEditCategory(cat.id)}
                            className="flex-1 px-3 py-1.5 bg-white text-foreground rounded-lg border-2 border-primary text-sm focus:outline-none"
                            autoFocus
                          />
                          <button type="button" onClick={() => handleSaveEditCategory(cat.id)} className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 font-medium">Save</button>
                          <button type="button" onClick={() => setEditingCategoryId(null)} className="px-3 py-1.5 bg-gray-400 text-white rounded-lg text-sm hover:bg-gray-500">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <span className="text-foreground font-medium">{cat.name}</span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => { setEditingCategoryId(cat.id); setEditCategoryName(cat.name); }} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                              <Icon name="PencilIcon" size={18} />
                            </button>
                            <button type="button" onClick={() => handleDeleteCategory(cat.id, cat.name)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                              <Icon name="TrashIcon" size={18} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && <UsersManagement />}
        {activeTab === 'orders' && <OrdersManagement />}
      </div>
    </div>
  );
}
