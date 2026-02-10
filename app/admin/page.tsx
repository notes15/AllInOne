import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminInteractive from './components/AdminInteractive';
import AdminProtection from './components/AdminProtection';

export const metadata: Metadata = {
  title: 'Admin Panel - AllInOne',
  description: 'Manage categories and products',
};

export default function AdminPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-background min-h-screen">
        <AdminProtection>
          <AdminInteractive />
        </AdminProtection>
      </main>
      <Footer />
    </>
  );
}