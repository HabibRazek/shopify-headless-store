'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpFormValues } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon, ArrowRight } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [signupError, setSignupError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{email?: string; password?: string; name?: string}>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const router = useRouter();


  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  const watchedFields = watch();

  // Clear signup error when user starts typing
  useEffect(() => {
    if ((signupError || Object.keys(fieldErrors).length > 0 || successMessage) && (watchedFields.name || watchedFields.email || watchedFields.password || watchedFields.confirmPassword)) {
      setSignupError('');
      setFieldErrors({});
      setSuccessMessage('');
    }
  }, [watchedFields.name, watchedFields.email, watchedFields.password, watchedFields.confirmPassword, signupError, fieldErrors, successMessage]);

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setSignupError(''); // Clear previous errors
    setFieldErrors({}); // Clear field-specific errors
    setSuccessMessage(''); // Clear success message

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Set field-specific error messages with French translation
        const errorMessage = responseData.error || 'Échec de la création du compte';
        const errorField = responseData.field;

        // Handle field-specific errors
        if (errorField === 'email') {
          setFieldErrors({
            email: errorMessage.includes('already exists')
              ? 'Un compte avec cet email existe déjà'
              : errorMessage.includes('valid email')
              ? 'Format d\'email invalide'
              : errorMessage,
            password: ''
          });
        } else if (errorField === 'password') {
          setFieldErrors({
            email: '',
            password: errorMessage.includes('8 characters')
              ? 'Le mot de passe doit contenir au moins 8 caractères'
              : errorMessage
          });
        } else if (errorField === 'name') {
          setFieldErrors({
            email: '',
            password: errorMessage.includes('2 characters')
              ? 'Le nom doit contenir au moins 2 caractères'
              : errorMessage
          });
        } else {
          // General error handling
          if (errorMessage.includes('already exists')) {
            setFieldErrors({
              email: 'Un compte avec cet email existe déjà',
              password: 'Veuillez utiliser un autre email'
            });
          } else if (errorMessage.includes('Invalid input')) {
            setFieldErrors({
              email: 'Format d\'email invalide',
              password: 'Le mot de passe ne respecte pas les critères'
            });
          } else {
            setFieldErrors({
              email: 'Erreur lors de la création du compte',
              password: 'Veuillez vérifier vos informations'
            });
          }
        }
        return;
      }

      // Success - show beautiful Sonner toast and redirect
      setFieldErrors({});
      setSuccessMessage('');

      // Show beautiful success toast
      toast.success('Compte créé avec succès ! 🎉', {
        description: 'Votre compte a été créé. Redirection vers la connexion...',
        duration: 3000,
        action: {
          label: 'Se connecter',
          onClick: () => router.push('/auth/signin')
        }
      });

      // Redirect after showing toast
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
    } catch (error: unknown) {
      toast.error('Erreur de connexion', {
        description: 'Problème de connexion au serveur. Veuillez réessayer.',
      });
      setFieldErrors({
        email: 'Problème de connexion au serveur',
        password: 'Veuillez vérifier votre connexion internet'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to sign in with Google',
      });
      setIsGoogleLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-gray-300',
    };
  };

  const passwordStrength = getPasswordStrength(password);

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
          Create account
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-600 text-sm"
        >
          Get started with your free account today.
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
          {isGoogleLoading ? 'Creating account...' : 'Continue with Google'}
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
          <span className="bg-white px-3 text-gray-500">Or create with email</span>
        </div>
      </motion.div>

      {/* Sign Up Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-3">
          {/* Name Field */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full name
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="pl-9 h-10 border border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
                {...register('name')}
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <div className="relative">
              <MailIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                errors.email || fieldErrors.email ? 'text-red-400' : 'text-gray-400'
              }`} />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`pl-9 h-10 border transition-colors ${
                  errors.email || fieldErrors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50'
                    : 'border-gray-200 focus:border-green-500 focus:ring-green-500'
                }`}
                {...register('email')}
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            {(errors.email || fieldErrors.email) && (
              <p className="text-sm text-red-600 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                {errors.email?.message || fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <LockIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                errors.password || fieldErrors.password ? 'text-red-400' : 'text-gray-400'
              }`} />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                className={`pl-9 pr-10 h-10 border transition-colors ${
                  errors.password || fieldErrors.password
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
                  errors.password || fieldErrors.password
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600">
                  {passwordStrength.label}
                </span>
              </div>
            )}

            {(errors.password || fieldErrors.password) && (
              <p className="text-sm text-red-600 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                {errors.password?.message || fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm password
            </Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className="pl-9 pr-10 h-10 border border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
                {...register('confirmPassword')}
                disabled={isLoading || isGoogleLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading || isGoogleLoading}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600">
                {errors.confirmPassword.message}
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
              Creating account...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Create account
              <ArrowRight className="w-3 h-3" />
            </div>
          )}
        </Button>
      </motion.form>

      {/* Sign in link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center"
      >
        <p className="text-xs text-gray-600">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="font-medium text-green-600 hover:text-green-500 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
