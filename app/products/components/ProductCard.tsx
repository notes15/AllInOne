"use client";

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
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

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <div className="group animate-fade-in-up">
      <div className="relative image-zoom aspect-[3/4] bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500">
        <AppImage
          src={product.image}
          alt={product.imageAlt}
          className="w-full h-full object-cover"
        />
        
        {!product.inStock && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-error text-error-foreground text-xs font-bold uppercase tracking-wide rounded-full">
            Out of Stock
          </span>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <button
              onClick={() => setIsQuickViewOpen(true)}
              className="w-full py-2 bg-white/90 text-foreground rounded-lg font-medium text-sm hover:bg-white transition-colors"
            >
              Quick View
            </button>
            <button
              onClick={() => product.inStock && onAddToCart(product)}
              disabled={!product.inStock}
              className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
                product.inStock
                  ? 'bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Wishlist Icon */}
        <button
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
          aria-label="Add to wishlist"
        >
          <Icon name="HeartIcon" size={20} className="text-foreground" />
        </button>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>
        <h3 className="text-lg font-serif font-semibold text-foreground">
          {product.name}
        </h3>
        <p className="text-xl font-bold text-foreground">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}