'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CheckoutInteractive() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<'cart' | 'payment' | 'processing'>('cart');
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    name: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const router = useRouter();

  useEffect(() => {
    loadCart();
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const removeItem = (id: string) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      // Clear cart
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Redirect to success page
      router.push('/checkout/success');
    }, 2000);
  };

  if (cart.length === 0 && step === 'cart') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="ShoppingCartIcon" size={48} className="text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Add some amazing products to get started!
          </p>
          <button
            onClick={() => router.push('/products')}
            className="px-12 py-5 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg className="animate-spin h-12 w-12 text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Processing Payment...</h2>
          <p className="text-muted-foreground">Please wait while we process your order</p>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStep('cart')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </button>

          <h1 className="text-5xl font-serif font-bold text-foreground mb-12">Payment Details</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Contact Info */}
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Contact Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Shipping Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                        placeholder="123 Main St"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">ZIP Code</label>
                        <input
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                          placeholder="10001"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-card border border-border rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Payment Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Card Number</label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                        className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground font-mono"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={formData.cardExpiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setFormData({ ...formData, cardExpiry: value });
                          }}
                          className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground font-mono"
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">CVV</label>
                        <input
                          type="text"
                          value={formData.cardCVV}
                          onChange={(e) => setFormData({ ...formData, cardCVV: e.target.value.replace(/\D/g, '') })}
                          className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground font-mono"
                          placeholder="123"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-5 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Pay ${total.toFixed(2)}
                </button>

                <p className="text-sm text-muted-foreground text-center">
                  🔒 Your payment information is secure and encrypted
                </p>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-8 sticky top-24">
                <h3 className="text-xl font-bold text-foreground mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {item.image && (
                        <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-foreground mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-2xl p-6 flex gap-6 items-center hover:shadow-lg transition-shadow"
              >
                {item.image && (
                  <div className="w-24 h-24 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{item.name}</h3>
                  <p className="text-lg text-primary font-bold">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-secondary rounded-xl px-4 py-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-foreground font-bold text-xl hover:text-primary transition-colors"
                    >
                      −
                    </button>
                    <span className="text-foreground font-bold min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-foreground font-bold text-xl hover:text-primary transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Shipping</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-foreground mb-8">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => setStep('payment')}
                className="w-full px-8 py-5 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Proceed to Checkout
              </button>

              <p className="text-sm text-muted-foreground text-center mt-6">
                🔒 Secure checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}