'use client';

import { usePathname } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if current route is an admin route
  const isAdminRoute = pathname?.startsWith('/admin');
  
  // For admin routes, render children without main site layout
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  // For non-admin routes, render with main site layout
  return (
    <>
      <div className="sm:block hidden">
        <TopBar />
      </div>
      <Navbar />
      <main className="pt-16 sm:pt-20 md:pt-24 lg:pt-28">
        {children}
      </main>
      <Footer />
    </>
  );
}
