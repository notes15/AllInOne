import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutInteractive from './components/CheckoutInteractive';

export const metadata: Metadata = {
  title: 'Checkout - AllInOne',
  description: 'Complete your purchase securely. Free shipping on orders over $50. 30-day easy returns.',
  keywords: 'checkout, secure payment, online shopping',
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-background min-h-screen">
        <CheckoutInteractive />
      </main>
      <Footer />
    </>
  );
}