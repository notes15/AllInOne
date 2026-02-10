"use client";

import { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';


interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  imageAlt: string;
  badge?: string;
}

export default function FeaturedProducts() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const featuredProducts: Product[] = [];


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

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 animate-fade-in-up">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 block font-medium">
              Curated Selection
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground">
              Featured <span className="italic text-primary">Products</span>
            </h2>
          </div>
          <a
            href="/products"
            className="text-sm uppercase tracking-wide text-primary border-b-2 border-primary pb-1 hover:text-accent hover:border-accent transition-colors">

            View All Products
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Large Featured Product */}
          <div className="md:col-span-7 animate-fade-in-up delay-100">
            <div className="group relative image-zoom aspect-[4/5] bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500">
              <AppImage
                src={featuredProducts[0].image}
                alt={featuredProducts[0].imageAlt}
                className="w-full h-full object-cover" />

              {featuredProducts[0].badge &&
              <span className="absolute top-4 left-4 px-4 py-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide rounded-full">
                  {featuredProducts[0].badge}
                </span>
              }
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <button
                    onClick={() => handleAddToCart(featuredProducts[0])}
                    className="w-full py-3 bg-white text-foreground rounded-lg font-medium text-sm uppercase tracking-wide hover:bg-primary hover:text-primary-foreground transition-colors">

                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-start mt-6">
              <div>
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-1">
                  {featuredProducts[0].name}
                </h3>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {featuredProducts[0].category}
                </p>
              </div>
              <span className="text-2xl font-bold text-foreground">
                ${featuredProducts[0].price}
              </span>
            </div>
          </div>

          {/* Small Products Column */}
          <div className="md:col-span-5 space-y-12">
            {featuredProducts.slice(1).map((product, index) =>
            <div key={product.id} className={`animate-fade-in-up delay-${200 + index * 100}`}>
                <div className="group relative image-zoom aspect-square bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500">
                  <AppImage
                  src={product.image}
                  alt={product.imageAlt}
                  className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-3 bg-white text-foreground rounded-lg font-medium text-sm uppercase tracking-wide hover:bg-primary hover:text-primary-foreground transition-colors">

                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-start mt-4">
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-foreground mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-foreground">
                    ${product.price}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}