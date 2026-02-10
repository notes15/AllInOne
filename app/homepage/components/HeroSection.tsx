"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-b from-background to-secondary">
      {/* Massive Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="text-[clamp(4rem,18vw,20rem)] font-serif font-bold tracking-tighter leading-none opacity-[0.02] select-none"
          style={{ whiteSpace: 'nowrap' }}>

          ALL IN ONE
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="animate-fade-in-up">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6 font-medium">
            Est. 2026
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-8 leading-tight">
            EVERYTHING.
            <br />
            <br />
            <span className="text-primary italic">ALL IN ONE</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground mb-12 leading-relaxed">
            The freshest stuff, all in one spot
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="px-10 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-sm uppercase tracking-wide hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">

              Shop Now
            </Link>
            <Link
              href="/products"
              className="px-10 py-4 border-2 border-primary text-foreground rounded-lg font-medium text-sm uppercase tracking-wide hover:bg-primary hover:text-primary-foreground transition-all duration-300">

              Explore Categories
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        {isHydrated &&
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-fade-in delay-500">
            <div className="w-px h-20 bg-gradient-to-b from-primary to-transparent"></div>
          </div>
        }
      </div>
    </section>);

}