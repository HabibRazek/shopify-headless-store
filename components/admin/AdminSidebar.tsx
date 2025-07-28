'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

  BarChart3,

  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
    title: 'Tableau de Bord',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Gestion des Utilisateurs',
    href: '/admin/users',
    icon: Users,
    badge: 'Nouveau',
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
        title: 'Catégories',
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
    title: 'Statistiques',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Paramètres',
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
            'flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative',
            level > 0 && 'ml-4 pl-6',
            active
              ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 shadow-md border border-green-200'
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 hover:shadow-sm',
            isCollapsed && level === 0 && 'justify-center px-2'
          )}
        >
          <item.icon className={cn(
            'flex-shrink-0 transition-colors',
            active ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600',
            isCollapsed ? 'h-5 w-5' : 'h-4 w-4'
          )} />
          
          {!isCollapsed && (
            <>
              <span className="flex-1 truncate">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
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
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-lg">
      {/* Header */}
      <div className={cn(
        'flex items-center gap-3 p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100',
        isCollapsed && 'justify-center px-2'
      )}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Packedin</h2>
                <p className="text-xs text-green-600 font-medium">Admin Panel</p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-10 h-10 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">P</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </nav>

        {!isCollapsed && (
          <>
            <Separator className="my-4 mx-3" />
            
            {/* Quick Actions */}
            <div className="px-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Actions Rapides
              </p>
              <div className="space-y-1">
                <Link
                  href="/admin/help"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-200 hover:shadow-sm"
                >
                  <HelpCircle className="h-4 w-4" />
                  Aide
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Info & Collapse Button */}
      <div className="border-t border-gray-200 p-3 bg-gradient-to-r from-gray-50 to-gray-100">
        {!isCollapsed && session?.user && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border border-gray-200 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-medium text-sm">
                {session.user.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {session.user.name || 'Admin'}
              </p>
              <p className="text-xs text-green-600 font-medium truncate">
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
              'flex-1 justify-center hover:bg-green-50 hover:text-green-600 transition-colors rounded-xl',
              isCollapsed && 'px-2'
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Réduire
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-screen sticky top-0 z-40"
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
              className="fixed left-0 top-0 h-full w-80 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
