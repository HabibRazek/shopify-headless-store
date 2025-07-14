'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import {  useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInFormValues } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  // const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // No need to clear errors since we're using toast notifications

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      // Check for authentication errors
      if (result?.error === 'CredentialsSignin' ||
          result?.error ||
          (result?.ok && result?.url === null)) {
        // Show error toast when email or password is incorrect
        toast.error('Login Failed', {
          description: 'Incorrect username or password.',
          duration: 4000,
        });
      } else if (result?.ok && result?.url) {
        // Show success toast when login is successful
        toast.success('Login Successful', {
          description: 'Welcome back! Redirecting...',
          duration: 2000,
        });

        // Redirect after showing success message
        setTimeout(() => {
          window.location.href = callbackUrl;
        }, 2000);
      } else if (result?.ok && !result?.error) {
        // Sometimes NextAuth returns ok:true but no URL for failed logins
        toast.error('Login Failed', {
          description: 'Incorrect username or password.',
          duration: 4000,
        });
      } else {
        // Unknown error
        toast.error('Connection Error', {
          description: 'Please try again.',
          duration: 4000,
        });
      }
    } catch {
      toast.error('Connection Error', {
        description: 'Please check your internet connection.',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Use standard NextAuth redirect approach
      await signIn('google', {
        callbackUrl: callbackUrl,
        redirect: true // Let NextAuth handle the redirect
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Connection Error', {
        description: 'Failed to connect to Google. Please check your internet connection.',
        duration: 4000,
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Compact Header */}
      <div className="text-center lg:text-left space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-900"
        >
          Sign in
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-600 text-sm"
        >
          Welcome back! Please enter your details.
        </motion.p>
      </div>



      {/* Google Sign In */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full h-11 text-sm border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative"
      >
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-500">Or continue with email</span>
        </div>
      </motion.div>

      {/* Credentials Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <div className="relative">
              <MailIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                errors.email ? 'text-red-400' : 'text-gray-400'
              }`} />
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                className={`pl-9 h-10 border transition-colors ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
                    : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
                }`}
                {...register('email')}
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <LockIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                errors.password ? 'text-red-400' : 'text-gray-400'
              }`} />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Entrez votre mot de passe"
                className={`pl-9 pr-10 h-10 border transition-colors ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
                    : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
                }`}
                {...register('password')}
                disabled={isLoading || isGoogleLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                  errors.password
                    ? 'text-red-400 hover:text-red-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                disabled={isLoading || isGoogleLoading}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                {errors.password.message}
              </p>
            )}
          </div>
        </div>





        <Button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing in...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Sign in
              <ArrowRight className="w-3 h-3" />
            </div>
          )}
        </Button>
      </motion.form>

      {/* Sign up link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center"
      >
        <p className="text-xs text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            className="font-medium text-green-600 hover:text-green-500 transition-colors"
          >
            Sign up for free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
