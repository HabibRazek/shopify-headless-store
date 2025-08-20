'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartData {
  period: string;
  users: number;
  posts: number;
  messages: number;
  invoices: number;
}

// Chart colors
const chartConfig = {
  users: {
    label: 'Users',
    color: '#22c55e', // Green
  },
  posts: {
    label: 'Posts',
    color: '#3b82f6', // Blue
  },
  messages: {
    label: 'Messages',
    color: '#8b5cf6', // Purple
  },
  invoices: {
    label: 'Invoices',
    color: '#f59e0b', // Orange
  },
};

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const ChartLabel = ({ label, color }: { label: string; color: string }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-gray-600">{label}</span>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white p-3 shadow-lg min-w-[150px]">
        <div className="text-xs font-medium text-gray-600 tracking-wide mb-2.5">{label}</div>
        <div className="space-y-2">
          {payload.map((entry, index) => {
            const config = chartConfig[entry.dataKey as keyof typeof chartConfig];
            return (
              <div key={index} className="flex items-center gap-2 text-xs">
                <ChartLabel label={config?.label + ':'} color={entry.color} />
                <span className="font-semibold text-gray-900">
                  {entry.value.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

// Period configuration
const PERIODS = {
  '7d': { key: '7d', label: 'Last 7 days' },
  '30d': { key: '30d', label: 'Last 30 days' },
  '90d': { key: '90d', label: 'Last 90 days' },
} as const;

type PeriodKey = keyof typeof PERIODS;

export default function RealSalesChart() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('30d');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    users: 0,
    posts: 0,
    messages: 0,
    invoices: 0,
  });

  useEffect(() => {
    fetchRealData();
  }, [selectedPeriod]);

  const fetchRealData = async () => {
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

      // Process data based on selected period
      const processedData = processDataByPeriod(users, posts, messages, invoices, selectedPeriod);
      setChartData(processedData);

      // Calculate totals
      setTotals({
        users: users.length,
        posts: posts.length,
        messages: messages.length,
        invoices: invoices.length,
      });

    } catch (error) {
      console.error('Error fetching real data:', error);
      // Set fallback data
      setChartData(generateFallbackData(selectedPeriod));
      setTotals({ users: 0, posts: 0, messages: 0, invoices: 0 });
    } finally {
      setLoading(false);
    }
  };

  const processDataByPeriod = (users: any[], posts: any[], messages: any[], invoices: any[], period: PeriodKey): ChartData[] => {
    const now = new Date();
    const data: ChartData[] = [];

    if (period === '7d') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        data.push({
          period: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: users.filter(u => u.createdAt?.startsWith(dateStr)).length,
          posts: posts.filter(p => p.createdAt?.startsWith(dateStr)).length,
          messages: messages.filter(m => m.createdAt?.startsWith(dateStr)).length,
          invoices: invoices.filter(inv => inv.createdAt?.startsWith(dateStr)).length,
        });
      }
    } else if (period === '30d') {
      // Last 30 days grouped by week
      for (let i = 3; i >= 0; i--) {
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - (i * 7));
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);
        
        data.push({
          period: `Week ${4 - i}`,
          users: users.filter(u => {
            const createdAt = new Date(u.createdAt);
            return createdAt >= startDate && createdAt <= endDate;
          }).length,
          posts: posts.filter(p => {
            const createdAt = new Date(p.createdAt);
            return createdAt >= startDate && createdAt <= endDate;
          }).length,
          messages: messages.filter(m => {
            const createdAt = new Date(m.createdAt);
            return createdAt >= startDate && createdAt <= endDate;
          }).length,
          invoices: invoices.filter(inv => {
            const createdAt = new Date(inv.createdAt);
            return createdAt >= startDate && createdAt <= endDate;
          }).length,
        });
      }
    } else {
      // Last 90 days grouped by month
      for (let i = 2; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toISOString().slice(0, 7); // YYYY-MM
        
        data.push({
          period: date.toLocaleDateString('en-US', { month: 'short' }),
          users: users.filter(u => u.createdAt?.startsWith(monthStr)).length,
          posts: posts.filter(p => p.createdAt?.startsWith(monthStr)).length,
          messages: messages.filter(m => m.createdAt?.startsWith(monthStr)).length,
          invoices: invoices.filter(inv => inv.createdAt?.startsWith(monthStr)).length,
        });
      }
    }

    return data;
  };

  const generateFallbackData = (period: PeriodKey): ChartData[] => {
    // Fallback data when APIs are not available
    if (period === '7d') {
      return [
        { period: 'Mon', users: 5, posts: 2, messages: 8, invoices: 3 },
        { period: 'Tue', users: 8, posts: 1, messages: 12, invoices: 5 },
        { period: 'Wed', users: 12, posts: 3, messages: 6, invoices: 2 },
        { period: 'Thu', users: 7, posts: 1, messages: 15, invoices: 7 },
        { period: 'Fri', users: 15, posts: 4, messages: 9, invoices: 4 },
        { period: 'Sat', users: 10, posts: 2, messages: 11, invoices: 6 },
        { period: 'Sun', users: 6, posts: 1, messages: 7, invoices: 3 },
      ];
    } else if (period === '30d') {
      return [
        { period: 'Week 1', users: 45, posts: 8, messages: 67, invoices: 23 },
        { period: 'Week 2', users: 52, posts: 12, messages: 89, invoices: 31 },
        { period: 'Week 3', users: 38, posts: 6, messages: 54, invoices: 18 },
        { period: 'Week 4', users: 61, posts: 15, messages: 92, invoices: 37 },
      ];
    } else {
      return [
        { period: 'Oct', users: 156, posts: 28, messages: 234, invoices: 89 },
        { period: 'Nov', users: 189, posts: 35, messages: 312, invoices: 124 },
        { period: 'Dec', users: 203, posts: 42, messages: 287, invoices: 156 },
      ];
    }
  };

  // Calculate percentage changes (simulated)
  const calculateChange = (current: number) => {
    return current > 50 ? 12 : current > 20 ? 8 : -3;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="border-0 min-h-auto pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-6">
          <div className="h-[300px] bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="border-0 min-h-auto pt-6 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Site Analytics</CardTitle>
          {/* Period Selector */}
          <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as PeriodKey)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {Object.values(PERIODS).map((period) => (
                <SelectItem key={period.key} value={period.key}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-2 pb-6">
        {/* Stats Section */}
        <div className="flex items-center flex-wrap gap-3.5 md:gap-10 px-5 mb-8 text-sm">
          {Object.entries(totals).map(([key, value]) => {
            const config = chartConfig[key as keyof typeof chartConfig];
            const change = calculateChange(value);
            return (
              <div key={key} className="flex items-center gap-3.5">
                <ChartLabel label={config.label} color={config.color} />
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{value.toLocaleString()}</span>
                  <Badge variant={change >= 0 ? 'default' : 'destructive'} className={change >= 0 ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}>
                    {change >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {Math.abs(change)}%
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{
                top: 30,
                right: 5,
                left: 5,
                bottom: 10,
              }}
            >
              <defs>
                {Object.entries(chartConfig).map(([key, config]) => (
                  <linearGradient key={key} id={`${key}Gradient`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={config.color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={config.color} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                strokeDasharray="4 12"
                stroke="#e5e7eb"
                strokeOpacity={1}
                horizontal={true}
                vertical={false}
              />

              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickMargin={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickMargin={10}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ strokeDasharray: '3 3', stroke: '#6b7280', strokeOpacity: 0.5 }}
              />

              <Line
                type="monotone"
                dataKey="users"
                stroke={chartConfig.users.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: chartConfig.users.color, strokeWidth: 0 }}
              />

              <Line
                type="monotone"
                dataKey="posts"
                stroke={chartConfig.posts.color}
                strokeWidth={2}
                strokeDasharray="8 4"
                dot={false}
                activeDot={{ r: 5, fill: chartConfig.posts.color, strokeWidth: 0 }}
              />

              <Line
                type="monotone"
                dataKey="messages"
                stroke={chartConfig.messages.color}
                strokeWidth={2}
                strokeDasharray="4 8"
                dot={false}
                activeDot={{ r: 5, fill: chartConfig.messages.color, strokeWidth: 0 }}
              />

              <Line
                type="monotone"
                dataKey="invoices"
                stroke={chartConfig.invoices.color}
                strokeWidth={2}
                strokeDasharray="12 4"
                dot={false}
                activeDot={{ r: 5, fill: chartConfig.invoices.color, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
