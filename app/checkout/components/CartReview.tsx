"use client";

import { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  imageAlt: string;
}

interface CartReviewProps {
  cart: CartItem[];
  onUpdateCart: (cart: CartItem[]) => void;
}

export default function CartReview({ cart, onUpdateCart }: CartReviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    onUpdateCart(updatedCart);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    onUpdateCart(updatedCart);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-center justify-between hover:bg-secondary transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon name="ShoppingBagIcon" size={24} className="text-primary" />
          <span className="text-lg font-semibold text-foreground">
            Review Cart ({cart.length} items)
          </span>
        </div>
        <Icon
          name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'}
          size={24}
          className="text-foreground"
        />
      </button>

      {isExpanded && (
        <div className="p-6 border-t border-border space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                <AppImage
                  src={item.image}
                  alt={item.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">{item.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-6 h-6 flex items-center justify-center border border-border rounded hover:bg-secondary"
                  >
                    <Icon name="MinusIcon" size={14} className="text-foreground" />
                  </button>
                  <span className="text-sm font-medium text-foreground w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center border border-border rounded hover:bg-secondary"
                  >
                    <Icon name="PlusIcon" size={14} className="text-foreground" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-error hover:text-error/80"
                >
                  <Icon name="TrashIcon" size={18} />
                </button>
                <p className="font-bold text-foreground">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}