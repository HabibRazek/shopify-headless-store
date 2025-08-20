'use client';


import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  LogOut,
  Menu,
  ChevronDown,
  MessageSquare,
  FileText,
  Users,
  BarChart3,
  Home,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminTopNavbarProps {
  onMobileMenuToggle?: () => void;
}

export default function AdminTopNavbar({ onMobileMenuToggle }: AdminTopNavbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();


  // Get page title based on current route
  const getPageTitle = () => {
    if (pathname.includes('/admin/messages')) return 'Messages';
    if (pathname.includes('/admin/factures')) return 'Factures';
    if (pathname.includes('/admin/users')) return 'Utilisateurs';
    if (pathname.includes('/admin/blog')) return 'Blog';
    if (pathname.includes('/admin/print-service')) return 'Service d\'Impression';
    if (pathname.includes('/admin/analytics')) return 'Analytics';
    if (pathname.includes('/admin/settings')) return 'Paramètres';
    if (pathname === '/admin') return 'Tableau de Bord';
    return 'Administration';
  };

  // Get breadcrumb items
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Accueil', href: '/admin', icon: Home }
    ];

    if (segments.length > 1) {
      const currentPage = getPageTitle();
      breadcrumbs.push({
        label: currentPage,
        href: pathname,
        icon: getPageIcon()
      });
    }

    return breadcrumbs;
  };

  const getPageIcon = () => {
    if (pathname.includes('/admin/messages')) return MessageSquare;
    if (pathname.includes('/admin/factures')) return FileText;
    if (pathname.includes('/admin/users')) return Users;
    if (pathname.includes('/admin/analytics')) return BarChart3;
    return Home;
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left Section - Breadcrumbs & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMobileMenuToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center space-x-2 text-sm">
              {getBreadcrumbs().map((item, index) => (
                <div key={item.href} className="flex items-center">
                  {index > 0 && (
                    <ChevronDown className="h-4 w-4 text-gray-400 mx-2 rotate-[-90deg]" />
                  )}
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </div>
              ))}
            </nav>

            {/* Page Title for Mobile */}
            <h1 className="sm:hidden text-lg font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>



          {/* Right Section - User Menu */}
          <div className="flex items-center space-x-4">

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {session?.user?.name || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session?.user?.email}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <Link href="/admin/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
