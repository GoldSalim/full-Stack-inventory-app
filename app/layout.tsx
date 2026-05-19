import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InventoryPro',
  description: 'Inventory Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={{display: 'flex', height: '100vh'}}>
          <Sidebar />
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
            <Header />
            <main style={{flex: 1, overflow: 'auto', backgroundColor: '#f9fafb'}}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}