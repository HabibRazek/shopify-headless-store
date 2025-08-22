'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  Folder,
  Tag,
  Settings,
  ChevronLeft,
  ChevronRight,
  Receipt,
  BarChart3,
  HelpCircle,
  MessageSquare,
  Package,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: MessageSquare,
    badge: '12',
  },
  {
    title: 'Invoices',
    href: '/admin/factures',
    icon: Receipt,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Print Service',
    href: '/admin/print-service',
    icon: Package,
  },
  {
    title: 'Blog',
    href: '/admin/blog',
    icon: FileText,
    children: [
      {
        title: 'Articles',
        href: '/admin/blog/posts',
        icon: FileText,
      },
      {
        title: 'Categories',
        href: '/admin/blog/categories',
        icon: Folder,
      },
      {
        title: 'Tags',
        href: '/admin/blog/tags',
        icon: Tag,
      },
    ],
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand parent items based on current path
  useEffect(() => {
    navigationItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => pathname === child.href);
        if (hasActiveChild && !expandedItems.includes(item.title)) {
          setExpandedItems(prev => [...prev, item.title]);
        }
      }
    });
  }, [pathname]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const active = isActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);

    return (
      <div className="w-full">
        <Link
          href={item.href}
          onClick={hasChildren && !isCollapsed ? (e) => {
            e.preventDefault();
            toggleExpanded(item.title);
          } : () => {
            // Close mobile menu on navigation
            if (window.innerWidth < 768) {
              setIsMobileOpen(false);
            }
          }}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative',
            level > 0 && 'ml-4 pl-6',
            active
              ? 'bg-gray-100 text-gray-900 shadow-sm'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            isCollapsed && level === 0 && 'justify-center px-2'
          )}
        >
          <item.icon className={cn(
            'flex-shrink-0 transition-all duration-200',
            active ? 'text-gray-700' : 'text-gray-500',
            isCollapsed ? 'h-5 w-5' : 'h-5 w-5'
          )} />
          
          {!isCollapsed && (
            <>
              <span className="flex-1 truncate">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs font-medium border-0 rounded-md">
                  {item.badge}
                </Badge>
              )}
              {hasChildren && (
                <ChevronRight className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isExpanded && 'rotate-90'
                )} />
              )}
            </>
          )}

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {item.title}
            </div>
          )}
        </Link>

        {/* Children */}
        {hasChildren && !isCollapsed && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-1 space-y-1">
                  {item.children?.map((child) => (
                    <NavItemComponent key={child.href} item={child} level={level + 1} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
      {/* Clean Professional Header */}
      <div className={cn(
        'flex items-center p-4 border-b border-gray-100',
        isCollapsed && 'justify-center px-3'
      )}>
        {!isCollapsed ? (
          <div className="relative h-10 w-28 flex-shrink-0">
            <Image
              src="/cropped-packedIn-LOGO-FINAL-2021-BLACK-01.webp"
              alt="Packedin Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        ) : (
          <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">P</span>
          </div>
        )}
      </div>

      {/* Clean Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </nav>

        {!isCollapsed && (
          <>
            <div className="my-4 mx-3 border-t border-gray-100"></div>

            {/* Quick Actions */}
            <div className="px-3">
              <div className="space-y-1">
                <Link
                  href="/admin/help"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all duration-200"
                >
                  <HelpCircle className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">Centre d'Aide</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Clean User Info & Collapse Button */}
      <div className="border-t border-gray-100 p-3">
        {!isCollapsed && session?.user && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 mb-3">
            <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {session.user.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'flex-1 justify-center hover:bg-gray-100 transition-all duration-200 rounded-lg',
              isCollapsed && 'px-2'
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="font-medium">Réduire</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Clean Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-screen sticky top-0 z-40 mr-2 sm:mr-4"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 h-full w-80 z-50 md:hidden shadow-lg"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
