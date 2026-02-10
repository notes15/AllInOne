'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SuccessPage() {
  const [orderNumber] = useState(() => Math.floor(Math.random() * 1000000));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-5xl font-serif font-bold text-foreground mb-6">
            Order Confirmed!
          </h1>
          
          <p className="text-xl text-muted-foreground mb-4">
            Thank you for your purchase!
          </p>
          
          <p className="text-lg text-foreground mb-12">
            Order Number: <span className="font-bold text-primary">#{orderNumber}</span>
          </p>

          <div className="bg-card border border-border rounded-2xl p-8 mb-12 text-left">
            <h2 className="text-2xl font-bold text-foreground mb-6">What's Next?</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Confirmation Email</h3>
                  <p className="text-muted-foreground">
                    You'll receive an order confirmation email shortly with all the details.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Processing</h3>
                  <p className="text-muted-foreground">
                    We'll start processing your order right away.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Shipping</h3>
                  <p className="text-muted-foreground">
                    Your order will be shipped within 2-3 business days. You'll receive tracking information via email.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 justify-center flex-wrap">
            <Link
              href="/products"
              className="px-12 py-5 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Continue Shopping
            </Link>
            <Link
              href="/homepage"
              className="px-12 py-5 bg-card text-foreground border-2 border-border rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}