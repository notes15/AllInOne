import Link from 'next/link';


export default function Footer() {
  const currentYear = 2026;

  const footerLinks = [
    { id: 'footer_shop', label: 'Shop', href: '/products' },
    { id: 'footer_about', label: 'About', href: '/about' },
    { id: 'footer_contact', label: 'Contact', href: '/contact' },
    { id: 'footer_help', label: 'Help', href: '/help' },
    { id: 'footer_faq', label: 'FAQ', href: '/faq' },
  ];

  const socialLinks = [
    { id: 'social_instagram', icon: 'instagram', href: 'https://www.instagram.com/allinone250/', label: 'Instagram' },
    { id: 'social_tiktok', icon: 'tiktok', href: 'https://www.tiktok.com/@all.in.one59312', label: 'TikTok' },
  ];

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/homepage" className="flex items-center">
            <span className="text-2xl font-serif font-bold tracking-tight text-foreground">
              AllInOne
            </span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {footerLinks?.map((link) => (
              <Link
                key={link?.id}
                href={link?.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link?.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons & Copyright */}
          <div className="flex items-center gap-6">
            {socialLinks?.map((social) => (
              <a
                key={social?.id}
                href={social?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={social?.label}
              >
                {social?.icon === 'instagram' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                ) : social?.icon === 'tiktok' ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                )}
              </a>
            ))}
            <span className="text-sm text-muted-foreground hidden md:block">
              © {currentYear} AllInOne
            </span>
          </div>
        </div>

        {/* Mobile Copyright */}
        <div className="md:hidden text-center mt-6">
          <span className="text-sm text-muted-foreground">
            © {currentYear} AllInOne. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}