'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ArrowDown, 
  ArrowUp, 
  MoreHorizontal, 
  Pin, 
  Settings, 
  Share2, 
  Trash, 
  TriangleAlert,
  Users,
  FileText,
  MessageSquare,
  Package,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';

interface KPIData {
  totalUsers: number;
  totalPosts: number;
  totalMessages: number;
  totalPrintOrders: number;
  totalInvoices: number;
  activeUsers: number;
  publishedPosts: number;
  unreadMessages: number;
}

const kpiConfigs = [
  {
    key: 'totalUsers',
    title: 'Total Users',
    icon: Users,
    bg: 'bg-gradient-to-br from-blue-600 to-blue-700',
    format: (value: number) => value.toLocaleString(),
    target: 1000,
    svg: (
      <svg className="absolute right-0 top-0 h-full w-2/3 pointer-events-none" viewBox="0 0 300 200" fill="none">
        <circle cx="220" cy="100" r="90" fill="#fff" fillOpacity="0.08" />
        <circle cx="260" cy="60" r="60" fill="#fff" fillOpacity="0.10" />
        <circle cx="200" cy="160" r="50" fill="#fff" fillOpacity="0.07" />
      </svg>
    ),
  },
  {
    key: 'totalPosts',
    title: 'Blog Posts',
    icon: FileText,
    bg: 'bg-gradient-to-br from-green-600 to-green-700',
    format: (value: number) => value.toLocaleString(),
    target: 100,
    svg: (
      <svg className="absolute right-0 top-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" fill="none">
        <rect x="120" y="20" width="60" height="20" rx="8" fill="#fff" fillOpacity="0.10" />
        <polygon points="150,0 200,0 200,50" fill="#fff" fillOpacity="0.07" />
        <circle cx="180" cy="100" r="14" fill="#fff" fillOpacity="0.16" />
      </svg>
    ),
  },
  {
    key: 'totalMessages',
    title: 'Messages',
    icon: MessageSquare,
    bg: 'bg-gradient-to-br from-purple-600 to-purple-700',
    format: (value: number) => value.toLocaleString(),
    target: 500,
    svg: (
      <svg className="absolute right-0 top-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" fill="none">
        <ellipse cx="170" cy="80" rx="28" ry="12" fill="#fff" fillOpacity="0.12" />
        <polygon points="200,0 200,60 140,0" fill="#fff" fillOpacity="0.07" />
        <circle cx="150" cy="30" r="10" fill="#fff" fillOpacity="0.15" />
      </svg>
    ),
  },
  {
    key: 'totalPrintOrders',
    title: 'Print Orders',
    icon: Package,
    bg: 'bg-gradient-to-br from-orange-600 to-orange-700',
    format: (value: number) => value.toLocaleString(),
    target: 200,
    svg: (
      <svg className="absolute right-0 top-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" fill="none">
        <polygon points="200,0 200,100 100,0" fill="#fff" fillOpacity="0.09" />
        <rect x="140" y="60" width="40" height="18" rx="8" fill="#fff" fillOpacity="0.10" />
        <circle cx="150" cy="30" r="14" fill="#fff" fillOpacity="0.18" />
      </svg>
    ),
  },
];

export default function RealKPICards() {
  const [kpiData, setKpiData] = useState<KPIData>({
    totalUsers: 0,
    totalPosts: 0,
    totalMessages: 0,
    totalPrintOrders: 0,
    totalInvoices: 0,
    activeUsers: 0,
    publishedPosts: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIData();
  }, []);

  const fetchKPIData = async () => {
    try {
      setLoading(true);
      
      // Fetch users data
      const usersResponse = await fetch('/api/admin/users?limit=1000');
      const usersData = await usersResponse.json();
      const users = usersData.users || [];

      // Fetch blog posts data
      const postsResponse = await fetch('/api/admin/blog/posts');
      const postsData = await postsResponse.json();
      const posts = postsData.posts || [];

      // Fetch messages data (if available)
      let messages = [];
      try {
        const messagesResponse = await fetch('/api/admin/messages');
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          messages = messagesData.messages || [];
        }
      } catch (error) {
        console.log('Messages API not available');
      }

      // Fetch print orders data (if available)
      let printOrders = [];
      try {
        const printOrdersResponse = await fetch('/api/admin/print-service');
        if (printOrdersResponse.ok) {
          const printOrdersData = await printOrdersResponse.json();
          printOrders = printOrdersData.orders || [];
        }
      } catch (error) {
        console.log('Print orders API not available');
      }

      // Fetch invoices data (if available)
      let invoices = [];
      try {
        const invoicesResponse = await fetch('/api/admin/invoices');
        if (invoicesResponse.ok) {
          const invoicesData = await invoicesResponse.json();
          invoices = invoicesData.invoices || [];
        }
      } catch (error) {
        console.log('Invoices API not available');
      }

      setKpiData({
        totalUsers: users.length,
        totalPosts: posts.length,
        totalMessages: messages.length,
        totalPrintOrders: printOrders.length,
        totalInvoices: invoices.length,
        activeUsers: users.filter((user: any) => user.status === 'active').length,
        publishedPosts: posts.filter((post: any) => post.published).length,
        unreadMessages: messages.filter((msg: any) => !msg.read).length,
      });
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateChange = (current: number, target: number) => {
    const progress = calculateProgress(current, target);
    return progress > 50 ? '+' + (progress - 50).toFixed(1) : '-' + (50 - progress).toFixed(1);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="relative overflow-hidden bg-gray-200 animate-pulse">
            <CardHeader className="border-0 pb-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiConfigs.map((config) => {
        const value = kpiData[config.key as keyof KPIData];
        const progress = calculateProgress(value, config.target);
        const change = calculateChange(value, config.target);
        const isPositive = progress > 50;

        return (
          <Card key={config.key} className={`relative overflow-hidden ${config.bg} text-white border-0`}>
            {config.svg}
            <CardHeader className="border-0 z-10 relative pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white/90 text-sm font-medium flex items-center gap-2">
                  <config.icon className="h-4 w-4" />
                  {config.title}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="bottom">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TriangleAlert className="mr-2 h-4 w-4" /> Add Alert
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pin className="mr-2 h-4 w-4" /> Pin to Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash className="mr-2 h-4 w-4" /> Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 z-10 relative pt-0">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-semibold tracking-tight">
                  {config.format(value)}
                </span>
                <Badge className="bg-white/20 text-white font-semibold hover:bg-white/30">
                  {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(parseFloat(change))}%
                </Badge>
              </div>
              <div className="text-xs text-white/80 mt-2 border-t border-white/20 pt-2.5">
                Progress to target:{' '}
                <span className="font-medium text-white">
                  {progress.toFixed(1)}% ({value}/{config.target})
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
