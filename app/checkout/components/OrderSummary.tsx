"use client";

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummaryProps {
  cart: CartItem[];
}

export default function OrderSummary({ cart }: OrderSummaryProps) {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.1);
      setPromoApplied(true);
    }
  };

  return (
    <div className="sticky top-24 bg-card border border-border rounded-xl p-6 space-y-6 shadow-md">
      <h2 className="text-xl font-serif font-bold text-foreground">Order Summary</h2>

      {/* Line Items */}
      <div className="space-y-3 border-b border-border pb-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-foreground">
              {item.name} x {item.quantity}
            </span>
            <span className="font-medium text-foreground">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Promo Code */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Promo Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
            disabled={promoApplied}
            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:outline-none text-foreground bg-card disabled:bg-secondary disabled:text-muted-foreground"
          />
          <button
            onClick={handleApplyPromo}
            disabled={promoApplied}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply
          </button>
        </div>
        {promoApplied && (
          <p className="text-xs text-success flex items-center gap-1">
            <Icon name="CheckCircleIcon" size={14} />
            Promo code applied!
          </p>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-foreground">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-success">Discount</span>
            <span className="font-medium text-success">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Security Badges */}
      <div className="bg-secondary p-4 rounded-lg space-y-3">
        <div className="flex items-center gap-2">
          <Icon name="LockClosedIcon" size={20} className="text-success" />
          <span className="text-sm font-medium text-foreground">Secure Checkout</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>
    </div>
  );
}