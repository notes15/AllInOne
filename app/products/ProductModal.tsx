'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

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

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

interface SizeQuantity {
  size: string;
  quantity: number;
}

export default function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [sizeQuantities, setSizeQuantities] = useState<SizeQuantity[]>([]);

  const getStockStatus = () => {
    if (product.quantity === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', available: false };
    } else if (product.quantity !== null && product.quantity !== undefined) {
      return { text: `${product.quantity} in stock`, color: 'text-yellow-600', available: true };
    } else {
      return { text: 'In Stock', color: 'text-green-600', available: true };
    }
  };

  const stockStatus = getStockStatus();

  const toggleSize = (size: string) => {
    const existing = sizeQuantities.find(sq => sq.size === size);
    if (existing) {
      setSizeQuantities(prev => prev.filter(sq => sq.size !== size));
    } else {
      setSizeQuantities(prev => [...prev, { size, quantity: 1 }]);
    }
  };

  const updateQuantity = (size: string, newQty: number) => {
    if (newQty < 1) {
      setSizeQuantities(prev => prev.filter(sq => sq.size !== size));
    } else {
      setSizeQuantities(prev => 
        prev.map(sq => sq.size === size ? { ...sq, quantity: newQty } : sq)
      );
    }
  };

  const getSizeQuantity = (size: string) => {
    return sizeQuantities.find(sq => sq.size === size)?.quantity || 0;
  };

  const getTotalItems = () => {
    return sizeQuantities.reduce((total, sq) => total + sq.quantity, 0);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    if (product.sizes && product.sizes.length > 0) {
      if (sizeQuantities.length === 0) {
        alert('Please select at least one size');
        return;
      }
      const productWithSizes = {
        ...product,
        selectedSizes: sizeQuantities
      };
      onAddToCart(productWithSizes as any, e);
    } else {
      onAddToCart(product, e);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
          >
            <Icon name="XMarkIcon" size={24} className="text-gray-900" />
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Left side - Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-secondary rounded-xl overflow-hidden">
                <img 
                  src={product.images[selectedImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-primary' 
                          : 'border-border hover:border-gray-400'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} ${index + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right side - Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  {product.category}
                </p>
                <h2 className="text-3xl font-bold text-foreground mb-4">{product.name}</h2>
                <p className="text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2">
                <Icon 
                  name={stockStatus.available ? "CheckCircleIcon" : "XCircleIcon"} 
                  size={20} 
                  className={stockStatus.color} 
                />
                <span className={`font-medium ${stockStatus.color}`}>
                  {stockStatus.text}
                </span>
              </div>

              {/* Sizes Section */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Select Size</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => {
                        const qty = getSizeQuantity(size);
                        const isSelected = qty > 0;
                        return (
                          <button
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all ${
                              isSelected 
                                ? 'bg-primary text-white shadow-md scale-105' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Sizes with Quantity Controls */}
                  {sizeQuantities.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Quantity for each size:</h4>
                      <div className="space-y-2">
                        {sizeQuantities.map(sq => (
                          <div 
                            key={sq.size} 
                            className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                          >
                            <span className="font-semibold text-foreground">Size {sq.size}</span>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateQuantity(sq.size, sq.quantity - 1)}
                                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-bold text-gray-700"
                              >
                                −
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={sq.quantity}
                                onChange={(e) => updateQuantity(sq.size, parseInt(e.target.value) || 1)}
                                className="w-16 text-center font-bold text-lg border-2 border-gray-200 rounded-lg py-1 focus:border-primary focus:outline-none"
                              />
                              <button
                                onClick={() => updateQuantity(sq.size, sq.quantity + 1)}
                                className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-bold text-gray-700"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Total Items:</span>
                        <span className="text-2xl font-bold text-primary">{getTotalItems()}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!stockStatus.available}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
                  stockStatus.available
                    ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105 shadow-lg'
                    : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
              >
                <Icon name="ShoppingCartIcon" size={24} />
                {stockStatus.available 
                  ? (getTotalItems() > 0 && product.sizes && product.sizes.length > 0 
                      ? `Add ${getTotalItems()} Item${getTotalItems() > 1 ? 's' : ''} to Cart` 
                      : 'Add to Cart')
                  : 'Out of Stock'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
