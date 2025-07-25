'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
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
    <div className="admin-layout h-screen admin-gradient-bg flex overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <AdminHeader
          title={title}
          description={description}
          actions={actions}
          isCollapsed={isCollapsed}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto admin-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 h-full admin-fade-in"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
