import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
}

/**
 * Check if the current user has admin permissions
 * @param requiredRole - Minimum role required ('admin' or 'super_admin')
 * @returns AdminUser if authorized, null if not
 */
export async function checkAdminAuth(requiredRole: 'admin' | 'super_admin' = 'admin'): Promise<AdminUser | null> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      }
    });

    if (!user || user.status !== 'active') {
      return null;
    }

    // Check role permissions
    const hasPermission = 
      user.role === 'super_admin' || 
      (requiredRole === 'admin' && (user.role === 'admin' || user.role === 'super_admin'));

    if (!hasPermission) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('Error checking admin auth:', error);
    return null;
  }
}

/**
 * Middleware function to protect admin API routes
 * @param request - NextRequest object
 * @param requiredRole - Minimum role required
 * @returns NextResponse with error if unauthorized, null if authorized
 */
export async function requireAdminAuth(
  request: NextRequest, 
  requiredRole: 'admin' | 'super_admin' = 'admin'
): Promise<NextResponse | null> {
  const adminUser = await checkAdminAuth(requiredRole);
  
  if (!adminUser) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 403 }
    );
  }

  return null; // No error, user is authorized
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  if (password.length > 128) {
    errors.push('Le mot de passe ne peut pas dépasser 128 caractères');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate phone number (basic validation for international formats)
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Phone is optional
  
  // Remove all non-digit characters except + at the beginning
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Check if it's a valid international format
  const phoneRegex = /^\+?[\d\s\-\(\)]{8,15}$/;
  return phoneRegex.test(phone);
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 255); // Limit length
}

/**
 * Generate a secure random password
 */
export function generateSecurePassword(length: number = 12): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Rate limiting helper (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

/**
 * Log admin actions for audit trail
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  targetUserId?: string,
  details?: any
): Promise<void> {
  try {
    // In a production environment, you might want to store this in a separate audit log table
    console.log('Admin Action:', {
      adminId,
      action,
      targetUserId,
      details,
      timestamp: new Date().toISOString(),
    });
    
    // TODO: Implement proper audit logging to database
    // await prisma.auditLog.create({
    //   data: {
    //     adminId,
    //     action,
    //     targetUserId,
    //     details: JSON.stringify(details),
    //     timestamp: new Date(),
    //   }
    // });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
}
