'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Menu,
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Home,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  isCollapsed: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function AdminHeader({
  title,
  description,
  actions,
  isCollapsed,
  setIsMobileOpen
}: AdminHeaderProps) {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden hover:bg-green-50"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="h-5 w-5 text-green-600" />
          </Button>

          {/* Page Title */}
          <div className="flex flex-col">
            {title && (
              <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                {title}
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </h1>
            )}
            {description && (
              <p className="text-sm text-gray-500 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Page Actions */}
          {actions && (
            <div className="hidden sm:flex items-center gap-2">
              {actions}
            </div>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-green-50">
                <Bell className="h-5 w-5 text-gray-600" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-green-500 hover:bg-green-600"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nouvel utilisateur inscrit</p>
                    <p className="text-xs text-gray-500">Il y a 5 minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nouveau commentaire sur le blog</p>
                    <p className="text-xs text-gray-500">Il y a 1 heure</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Mise à jour système disponible</p>
                    <p className="text-xs text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center">
                Voir toutes les notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-3 hover:bg-green-50">
                <div className="w-8 h-8 bg-gradient-to-r from-green-700 via-green-500 to-[#77db19bd] rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-medium text-sm">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    {session?.user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {session?.user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Mon Profil
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Voir le Site
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link href="/admin/help" className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Aide & Support
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="flex items-center gap-2 text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Se Déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 w-full"
          />
        </div>
      </div>

      {/* Mobile Actions */}
      {actions && (
        <div className="sm:hidden px-6 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {actions}
          </div>
        </div>
      )}
    </header>
  );
}
