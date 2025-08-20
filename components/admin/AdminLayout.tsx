'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import AdminSidebar from './AdminSidebar';
import AdminTopNavbar from './AdminTopNavbar';
import { FullScreenLoader } from '@/components/ui/loader';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({ 
  children, 
  title, 
  description, 
  actions 
}: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Check admin permissions
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    // Check if user has admin role (this will be validated on the server side too)
    if (session.user.role !== 'admin' && session.user.role !== 'super_admin') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(false);
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Loading state
  if (status === 'loading') {
    return <FullScreenLoader />;
  }

  // Not authenticated or not admin
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'super_admin')) {
    return null;
  }

  return (
    <div className="admin-layout h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex overflow-hidden">
      {/* Professional Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <AdminTopNavbar />

        {/* Main Content with Professional Spacing */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-6">
              <div className="space-y-6">
                {children}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
