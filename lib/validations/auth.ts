import * as z from 'zod';

// Sign In form validation schema
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(32, { message: 'Password must be less than 32 characters' }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

// Sign Up form validation schema
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(32, { message: 'Password must be less than 32 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

// Profile form validation schema
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters' }),
  phone: z
    .string()
    .min(8, { message: 'Phone number must be at least 8 digits' })
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .min(5, { message: 'Address must be at least 5 characters' })
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .min(2, { message: 'City must be at least 2 characters' })
    .optional()
    .or(z.literal('')),
  postalCode: z
    .string()
    .min(4, { message: 'Postal code must be at least 4 characters' })
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .default('TN')
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// Checkout form validation schema
export const checkoutSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .min(2, { message: 'Last name must be at least 2 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .min(1, { message: 'Phone number is required' })
    .min(8, { message: 'Phone number must be at least 8 digits' }),
  address: z
    .string()
    .min(1, { message: 'Address is required' })
    .min(5, { message: 'Address must be at least 5 characters' }),
  city: z
    .string()
    .min(1, { message: 'City is required' }),
  postalCode: z
    .string()
    .min(1, { message: 'Postal code is required' }),
  country: z
    .string()
    .min(1, { message: 'Country is required' }),
  paymentMethod: z
    .string()
    .min(1, { message: 'Payment method is required' }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
