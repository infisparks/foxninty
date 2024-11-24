import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Chrono Elite - Luxury Watches',
  description: 'Discover our curated collection of premium timepieces',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        {/* Navbar */}
        <Navbar />

        {/* Page content */}
        <main className="pt-16 pb-14">{children}</main> {/* Adjust padding for fixed navs */}
      </body>
    </html>
  );
}
