"use client";

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import CategoryTabs from './CategoryTabs';
import FilterSidebar from './FilterSidebar';
import Icon from '@/components/ui/AppIcon';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  imageAlt: string;
  inStock: boolean;
  brand: string;
}

const defaultProducts: Product[] = [
{
  id: 'prod_frag_1',
  name: 'Midnight Essence',
  category: 'Fragrances',
  price: 89.99,
  image: "https://images.unsplash.com/photo-1694538967543-f3dcdd1358f5",
  imageAlt: 'Black luxury perfume bottle with gold accents on marble surface',
  inStock: true,
  brand: 'Luxury Scents'
},
{
  id: 'prod_frag_2',
  name: 'Ocean Breeze',
  category: 'Fragrances',
  price: 75.00,
  image: "https://images.unsplash.com/photo-1709100647741-7affc9db8c9f",
  imageAlt: 'Blue perfume bottle with silver cap on white background',
  inStock: true,
  brand: 'Luxury Scents'
},
{
  id: 'prod_frag_3',
  name: 'Rose Garden',
  category: 'Fragrances',
  price: 95.00,
  image: "https://images.unsplash.com/photo-1595425959632-34f2822322ce",
  imageAlt: 'Pink perfume bottle with floral design surrounded by roses',
  inStock: false,
  brand: 'Premium Goods'
},
{
  id: 'prod_gadget_1',
  name: 'Wireless Earbuds Pro',
  category: 'Gadgets',
  price: 149.99,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bdfd9a13-1767706853256.png",
  imageAlt: 'White wireless earbuds in charging case with LED indicator',
  inStock: true,
  brand: 'TechPro'
},
{
  id: 'prod_gadget_2',
  name: 'Smart Watch Ultra',
  category: 'Gadgets',
  price: 299.99,
  image: "https://images.unsplash.com/photo-1550262887-a838365fe644",
  imageAlt: 'Black smartwatch with digital display showing time and fitness data',
  inStock: true,
  brand: 'TechPro'
},
{
  id: 'prod_gadget_3',
  name: 'Portable Speaker',
  category: 'Gadgets',
  price: 79.99,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_14a7a9840-1769367055693.png",
  imageAlt: 'Compact wireless speaker in black with metallic finish',
  inStock: true,
  brand: 'TechPro'
},
{
  id: 'prod_cloth_1',
  name: 'Classic Cotton Tee',
  category: 'Clothing',
  price: 29.99,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_14b43bf8b-1767542951094.png",
  imageAlt: 'White cotton t-shirt laid flat on neutral background',
  inStock: true,
  brand: 'Urban Style'
},
{
  id: 'prod_cloth_2',
  name: 'Denim Jacket',
  category: 'Clothing',
  price: 89.99,
  image: "https://images.unsplash.com/photo-1602515931029-16b4a8ff505a",
  imageAlt: 'Blue denim jacket hanging on white wall',
  inStock: true,
  brand: 'Urban Style'
},
{
  id: 'prod_cloth_3',
  name: 'Leather Boots',
  category: 'Clothing',
  price: 159.99,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_19cd48e9f-1768152217583.png",
  imageAlt: 'Brown leather boots on wooden surface',
  inStock: false,
  brand: 'Premium Goods'
},
{
  id: 'prod_frag_4',
  name: 'Citrus Splash',
  category: 'Fragrances',
  price: 69.99,
  image: "https://images.unsplash.com/photo-1716694318655-57469c4e5031",
  imageAlt: 'Yellow perfume bottle with citrus fruits in background',
  inStock: true,
  brand: 'Luxury Scents'
},
{
  id: 'prod_gadget_4',
  name: 'Wireless Charger',
  category: 'Gadgets',
  price: 39.99,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_16a98beff-1766738333882.png",
  imageAlt: 'White wireless charging pad with smartphone',
  inStock: true,
  brand: 'TechPro'
},
{
  id: 'prod_cloth_4',
  name: 'Casual Sneakers',
  category: 'Clothing',
  price: 79.99,
  image: "https://images.unsplash.com/photo-1634624943276-c67cf187d925",
  imageAlt: 'White casual sneakers on gray background',
  inStock: true,
  brand: 'Urban Style'
}];


export default function ProductsInteractive() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>(defaultProducts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({ brands: [], priceRange: [0, 500], inStock: false });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    // Load products from localStorage or initialize with defaults
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setAllProducts(JSON.parse(storedProducts));
    } else {
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }

    // Listen for product updates from admin panel
    const handleProductsUpdate = () => {
      const updatedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      setAllProducts(updatedProducts);
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
    };
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!isHydrated) return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const filteredProducts = allProducts.
  filter((product) => {
    if (activeCategory !== 'all' && product.category.toLowerCase() !== activeCategory) {
      return false;
    }
    if (filters.inStock && !product.inStock) {
      return false;
    }
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    return true;
  }).
  sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
          All Products
        </h1>
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} of {allProducts.length} products
        </p>
      </div>

      {/* Category Tabs & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors">

            <Icon name="FunnelIcon" size={18} />
            Filters
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground bg-card focus:ring-2 focus:ring-primary focus:outline-none">

            <option value="popular">Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar onFilterChange={setFilters} />
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen &&
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileFilterOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-background p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-foreground">Filters</h2>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <Icon name="XMarkIcon" size={24} className="text-foreground" />
                </button>
              </div>
              <FilterSidebar onFilterChange={setFilters} />
            </div>
          </div>
        }

        {/* Products Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}