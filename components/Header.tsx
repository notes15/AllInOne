"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import AuthModal from '@/components/auth/AuthModal';
import SignOutModal from '@/components/SignOutModal';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const filtered = products.filter((product: any) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchClick = (productId: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/products?search=${productId}`);
  };

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    setIsSignOutModalOpen(true);
  };

  const confirmLogout = async () => {
    await signOut();
    setIsSignOutModalOpen(false);
    router.push('/homepage');
  };

  const navLinks = [
    { href: '/homepage', label: 'Home' },
    { href: '/products', label: 'Shop' },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/95 backdrop-blur-md shadow-md' : 'bg-background'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/homepage" className="text-2xl font-serif font-bold text-foreground">
              AllInOne
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    mounted && pathname === link.href
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Search"
              >
                <Icon name="MagnifyingGlassIcon" size={20} className="text-foreground" />
              </button>

              <Link href="/checkout" className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
                <Icon name="ShoppingCartIcon" size={20} className="text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="p-2 bg-white border-2 border-gray-400 hover:border-gray-500 rounded-lg transition-colors"
                  >
                    <Icon name="UserCircleIcon" size={20} className="text-gray-900" />
                  </button>
                  
                  {isUserDropdownOpen && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsUserDropdownOpen(false)}
                      />
                      
                      {/* Dropdown Menu - WHITE */}
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="p-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.displayName || user.email}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                              Admin
                            </span>
                          )}
                        </div>
                        
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              router.push('/orders');
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-2"
                          >
                            <Icon name="ShoppingBagIcon" size={16} />
                            Orders / Deliveries
                          </button>
                          
                          <button
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              router.push('/settings');
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-2"
                          >
                            <Icon name="Cog6ToothIcon" size={16} />
                            Settings
                          </button>
                        </div>
                        
                        <div className="border-t border-gray-200 py-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <Icon name="ArrowRightOnRectangleIcon" size={16} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  aria-label="Account"
                >
                  <Icon name="UserCircleIcon" size={20} className="text-foreground" />
                </button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Menu"
              >
                <Icon name="Bars3Icon" size={20} className="text-foreground" />
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-base font-medium transition-colors ${
                    mounted && pathname === link.href
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                  className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Account
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)}>
          <div className="max-w-2xl mx-auto mt-24 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-4 p-6 border-b border-border">
                <Icon name="MagnifyingGlassIcon" size={24} className="text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="flex-1 text-lg outline-none bg-transparent text-foreground"
                  autoFocus
                />
                <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                  <Icon name="XMarkIcon" size={24} className="text-foreground" />
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.map((product: any) => (
                    <button
                      key={product.id}
                      onClick={() => handleSearchClick(product.id)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-secondary transition-colors text-left"
                    >
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category} • ${product.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No products found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <SignOutModal 
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}