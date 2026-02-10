import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import FirebaseInit from './firebase-init';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Store',
  description: 'Online Store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <FirebaseInit />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
