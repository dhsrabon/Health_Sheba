import Navbar from '@/components/shared/Navbar';
import './globals.css';

import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'MediDesk | Advanced Healthcare System',
  description: 'Connect with top specialists, manage your appointments, and access your medical records securely.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 flex flex-col min-h-screen">
        
        {/* গ্লোবাল নেভিগেশন বার */}
        <Navbar />
        
        {/* 
          মেইন কনটেন্ট: Navbar যেহেতু 'fixed', তাই কনটেন্ট যেন 
          Navbar এর নিচে ঢাকা না পড়ে যায় সেজন্য pt-24 (padding-top) দেওয়া হয়েছে। 
        */}
        <main className="flex-grow pt-20 lg:pt-24">
          {children}
        </main>

      </body>
    </html>
  );
}