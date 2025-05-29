/**
 * API utility functions for consistent error handling and response formatting
 */

import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  reverse?: boolean;
}

export interface FilterParams {
  search?: string;
  tags?: string[];
  category?: string;
  available?: boolean;
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      data,
      message,
      timestamp: new Date().toISOString(),
      success: true,
    },
    { status }
  );
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  error: string,
  status: number = 500,
  details?: any
): NextResponse<ApiResponse> {
  console.error('API Error:', { error, status, details });
  
  return NextResponse.json(
    {
      error,
      timestamp: new Date().toISOString(),
      success: false,
      ...(details && { details }),
    },
    { status }
  );
}

/**
 * Parses query parameters from URL search params
 */
export function parseQueryParams(searchParams: URLSearchParams) {
  const params: Record<string, any> = {};
  
  for (const [key, value] of searchParams.entries()) {
    // Handle boolean values
    if (value === 'true' || value === 'false') {
      params[key] = value === 'true';
    }
    // Handle numeric values
    else if (!isNaN(Number(value)) && value !== '') {
      params[key] = Number(value);
    }
    // Handle array values (comma-separated)
    else if (value.includes(',')) {
      params[key] = value.split(',').map(v => v.trim());
    }
    // Handle string values
    else {
      params[key] = value;
    }
  }
  
  return params;
}

/**
 * Validates pagination parameters
 */
export function validatePaginationParams(params: any): PaginationParams {
  const page = Math.max(1, parseInt(params.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 20));
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
}

/**
 * Validates sort parameters
 */
export function validateSortParams(params: any): SortParams {
  const sortBy = typeof params.sortBy === 'string' ? params.sortBy : undefined;
  const sortOrder = params.sortOrder === 'desc' ? 'desc' : 'asc';
  const reverse = params.reverse === true || params.sortOrder === 'desc';
  
  return { sortBy, sortOrder, reverse };
}

/**
 * Validates filter parameters
 */
export function validateFilterParams(params: any): FilterParams {
  const search = typeof params.search === 'string' ? params.search.trim() : undefined;
  const tags = Array.isArray(params.tags) ? params.tags : 
               typeof params.tags === 'string' ? [params.tags] : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const available = typeof params.available === 'boolean' ? params.available : undefined;
  
  return { search, tags, category, available };
}

/**
 * Handles async operations with error catching
 */
export async function handleApiOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'An error occurred'
): Promise<NextResponse<ApiResponse<T>> | NextResponse<ApiResponse>> {
  try {
    const result = await operation();
    return createSuccessResponse(result);
  } catch (error) {
    console.error('API Operation Error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      return createErrorResponse(
        `${errorMessage}: ${error.message}`,
        500,
        { originalError: error.name }
      );
    }
    
    return createErrorResponse(errorMessage, 500);
  }
}

/**
 * Validates required fields in request body
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  
  for (const field of requiredFields) {
    if (!(field in body) || body[field] === null || body[field] === undefined || body[field] === '') {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Sanitizes input data to prevent XSS and other attacks
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

/**
 * Rate limiting helper (basic implementation)
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
  
  getRemainingRequests(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    const now = Date.now();
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

/**
 * Default rate limiter instance
 */
export const defaultRateLimiter = new RateLimiter();

/**
 * Cache helper for API responses
 */
export class ApiCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  
  set(key: string, data: any, ttlMs: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

/**
 * Default cache instance
 */
export const defaultApiCache = new ApiCache();
