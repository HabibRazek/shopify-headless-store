'use client';

import React, { ReactNode, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  RefreshCw,
  Plus,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => ReactNode;
}

interface FilterOption {
  key: string;
  label: string;
  value: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  onChange: (value: string) => void;
}

interface DataTableProps {
  title: string;
  subtitle?: string;
  columns: Column[];
  data: any[];
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  actions?: ReactNode;
  emptyState?: {
    icon?: ReactNode;
    title: string;
    description?: string;
  };
  onRowClick?: (row: any) => void;
  showStats?: boolean;
  stats?: Array<{
    label: string;
    value: string | number;
    icon: ReactNode;
    color: string;
    change?: string;
    changeType?: 'increase' | 'decrease' | 'neutral';
  }>;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
}

export default function DataTable({
  title,
  subtitle,
  columns,
  data,
  loading = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Rechercher...',
  filters = [],
  actions,
  emptyState,
  onRowClick,
  showStats = false,
  stats = [],
  pagination
}: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Enhanced search and filtering
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchValue && onSearchChange) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }

    // Apply filters
    filters.forEach(filter => {
      if (filter.value && filter.value !== 'all') {
        result = result.filter(item => {
          const itemValue = item[filter.key];
          return String(itemValue).toLowerCase() === filter.value.toLowerCase();
        });
      }
    });

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchValue, filters, sortConfig]);

  // Apply pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredAndSortedData;

    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, pagination]);

  const totalPages = pagination ? Math.ceil(filteredAndSortedData.length / pagination.pageSize) : 1;

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (current?.key === key) {
        if (current.direction === 'asc') {
          return { key, direction: 'desc' };
        } else {
          return null; // Remove sorting
        }
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  const getSortIcon = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return null;

    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ?
        <ArrowUp className="w-4 h-4" /> :
        <ArrowDown className="w-4 h-4" />;
    }
    return <ArrowUpDown className="w-4 h-4 opacity-50" />;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              {actions}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Filters Bar */}
      {(onSearchChange || filters.length > 0) && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              {onSearchChange && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 w-80 h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {filters.map((filter) => (
                  <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
                    <SelectTrigger className="w-auto min-w-[120px] h-10 border-gray-300 bg-white hover:bg-gray-50">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
                <Button variant="outline" size="sm" className="h-10 gap-2">
                  <Filter className="w-4 h-4" />
                  More filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Table Container */}
      <div className="flex-1 bg-white overflow-hidden">
        {/* Tab-style filters */}
        <div className="border-b border-gray-200">
          <div className="px-6">
            <div className="flex items-center justify-between">
              <div className="flex space-x-8">
                <button className="border-b-2 border-green-500 py-4 px-1 text-sm font-medium text-green-600">
                  All orders
                  <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                    {data.length}
                  </span>
                </button>
                <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Pickups
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    0
                  </span>
                </button>
                <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Returns
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    0
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  showing {Math.min(pagination?.pageSize || 10, filteredAndSortedData.length)} - {Math.min((pagination?.currentPage || 1) * (pagination?.pageSize || 10), filteredAndSortedData.length)} of {filteredAndSortedData.length} results
                </span>
                <Select defaultValue="10">
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">Items per page</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600"></div>
                <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
              </div>
              <p className="mt-4 text-sm sm:text-base text-gray-600 font-medium">Chargement des données...</p>
            </div>
          ) : filteredAndSortedData.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              {emptyState?.icon && (
                <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4 sm:mb-6">
                  {emptyState.icon}
                </div>
              )}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {emptyState?.title || 'Aucune donnée'}
              </h3>
              {emptyState?.description && (
                <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                  {emptyState.description}
                </p>
              )}
              <Button className="mt-4 sm:mt-6 gap-2 text-sm">
                <Plus className="w-4 h-4" />
                Ajouter un élément
              </Button>
            </div>
          ) : (
            <>
              {/* Modern Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                            column.align === 'right' ? 'text-right' :
                            column.align === 'center' ? 'text-center' : 'text-left'
                          } ${column.sortable ? 'cursor-pointer hover:text-gray-700' : ''}`}
                          style={{ width: column.width }}
                          onClick={() => column.sortable && handleSort(column.key)}
                        >
                          <div className="flex items-center gap-1">
                            <span>{column.label}</span>
                            {column.sortable && getSortIcon(column.key)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((row, index) => (
                      <tr
                        key={row.id || index}
                        className={`hover:bg-gray-50 ${
                          onRowClick ? 'cursor-pointer' : ''
                        }`}
                        onClick={() => onRowClick?.(row)}
                      >
                        {columns.map((column) => (
                          <td
                            key={column.key}
                            className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                              column.align === 'right' ? 'text-right' :
                              column.align === 'center' ? 'text-center' : 'text-left'
                            }`}
                          >
                            {column.render
                              ? column.render(row[column.key], row)
                              : row[column.key]
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Modern Pagination */}
        {pagination && totalPages > 1 && (
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="h-8 w-8 p-0 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 7) {
                      pageNumber = i + 1;
                    } else if (pagination.currentPage <= 4) {
                      pageNumber = i + 1;
                    } else if (pagination.currentPage >= totalPages - 3) {
                      pageNumber = totalPages - 6 + i;
                    } else {
                      pageNumber = pagination.currentPage - 3 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={pagination.currentPage === pageNumber ? "default" : "ghost"}
                        size="sm"
                        onClick={() => pagination.onPageChange(pageNumber)}
                        className={`h-8 w-8 p-0 ${
                          pagination.currentPage === pageNumber
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === totalPages}
                  className="h-8 w-8 p-0 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
