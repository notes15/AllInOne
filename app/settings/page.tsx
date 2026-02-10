import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SettingsClient from './SettingsClient';

export const metadata: Metadata = {
  title: 'Settings - AllInOne',
  description: 'Manage your account settings',
};

export default function SettingsPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-background min-h-screen">
        <SettingsClient />
      </main>
      <Footer />
    </>
  );
}