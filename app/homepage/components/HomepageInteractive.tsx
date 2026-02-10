'use client';

import { useState, useEffect } from 'react';
import { rtdb } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  quantity?: number;
  sold?: number;
}

interface Category {
  id: string;
  name: string;
}

export default function HomepageInteractive() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<Product[]>([]);
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const productsRef = ref(rtdb, 'products');
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const productList = Object.entries(data).map(([id, product]: [string, any]) => ({
        id,
        ...product,
      }));
      setProducts(productList);
    }
  };

  const loadCategories = async () => {
    const categoriesRef = ref(rtdb, 'categories');
    const snapshot = await get(categoriesRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const categoryList = Object.entries(data).map(([id, category]: [string, any]) => ({
        id,
        ...category,
      }));
      setCategories(categoryList);
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getStockStatus = (product: Product) => {
    if (!product.quantity) return null;
    const available = product.quantity - (product.sold || 0);
    if (available <= 0) return 'Out of Stock';
    return `${available} left`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5DC' }}>
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: '#8B4513' }}>Store</h1>
          <div className="flex items-center gap-4">
            {user && isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded font-semibold"
                style={{ backgroundColor: '#8B4513', color: 'white' }}
              >
                Admin Panel
              </Link>
            )}
            <button className="relative">
              <span className="text-2xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded whitespace-nowrap font-semibold ${
                selectedCategory === 'All'
                  ? 'text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
              style={selectedCategory === 'All' ? { backgroundColor: '#8B4513' } : { color: '#8B4513' }}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded whitespace-nowrap font-semibold ${
                  selectedCategory === category.name
                    ? 'text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
                style={selectedCategory === category.name ? { backgroundColor: '#8B4513' } : { color: '#8B4513' }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              {product.images && product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2" style={{ color: '#8B4513' }}>{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold" style={{ color: '#8B4513' }}>${product.price}</span>
                  {getStockStatus(product) && (
                    <span className={`text-sm font-semibold ${
                      getStockStatus(product) === 'Out of Stock' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {getStockStatus(product)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={getStockStatus(product) === 'Out of Stock'}
                  className="w-full px-4 py-2 rounded font-semibold text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                  style={getStockStatus(product) !== 'Out of Stock' ? { backgroundColor: '#8B4513' } : {}}
                >
                  {getStockStatus(product) === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
