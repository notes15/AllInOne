import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-120px)] bg-background relative overflow-hidden flex items-center">
        {/* Soft beige gradient at bottom - extended upward */}
        <div className="fixed bottom-0 left-0 right-0 h-[800px] bg-gradient-to-t from-amber-50/70 via-stone-50/40 to-transparent pointer-events-none z-0"></div>
        
        {/* Hero Section */}
        <section className="relative w-full px-6 z-10 py-20">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-foreground mb-8 leading-tight">
              Welcome to<br />
              <span className="text-primary">AllInOne</span>
            </h1>
            
            <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover our curated collection of premium products, handpicked for quality and style.
            </p>
            
            <div className="flex gap-6 justify-center flex-wrap">
              <Link
                href="/products"
                className="px-12 py-5 bg-primary text-primary-foreground rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Shop Now →
              </Link>
              <Link
                href="/products"
                className="px-12 py-5 bg-card text-foreground border-2 border-border rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Browse Collection
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}