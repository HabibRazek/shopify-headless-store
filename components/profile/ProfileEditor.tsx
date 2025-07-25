'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  User,
  MapPin,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Globe,
  Calendar,
  Check,
  Star,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const profileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

// type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileEditorProps {
  className?: string;
}

export function ProfileEditor({ className }: ProfileEditorProps) {
  const { data: session, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [profileData, setProfileData] = useState<{
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    createdAt?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'TN',
    },
  });

  const watchedValues = watch();

  // Load user profile data and order count
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setProfileData(data.user);

          // Set form values
          setValue('name', data.user.name || '');
          setValue('phone', data.user.phone || '');
          setValue('address', data.user.address || '');
          setValue('city', data.user.city || '');
          setValue('postalCode', data.user.postalCode || '');
          setValue('country', data.user.country || 'TN');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchOrderCount = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch('/api/user/orders');
        if (response.ok) {
          const data = await response.json();
          setOrderCount(data.orders?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching order count:', error);
      }
    };

    fetchProfile();
    fetchOrderCount();
  }, [session, setValue]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    console.log('🔄 Starting profile update with data:', data);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.text();
        } catch {
          errorData = 'Could not read error response';
        }

        const errorInfo = {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          url: response.url
        };

        console.error('Profile update failed:', errorInfo);
        console.error('Full response details:', {
          headers: Object.fromEntries(response.headers.entries()),
          ok: response.ok,
          redirected: response.redirected,
          type: response.type
        });

        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('AUTHENTICATION_ERROR: Vous devez vous connecter pour modifier votre profil');
        } else if (response.status === 403) {
          throw new Error('Vous n\'avez pas les permissions pour effectuer cette action');
        } else if (response.status === 400) {
          throw new Error('Données invalides. Veuillez vérifier vos informations');
        } else if (response.status >= 500) {
          throw new Error('Erreur serveur. Veuillez réessayer plus tard');
        } else {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
      }

      const updatedData = await response.json();
      setProfileData(updatedData.user);
      setIsEditing(false);

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
        },
      });

      toast.success('Profil mis à jour', {
        description: 'Vos informations ont été mises à jour avec succès!',
        duration: 3000,
      });
    } catch (error) {
      console.error('Profile update error:', error);
      console.error('Error type:', typeof error);
      console.error('Error constructor:', error?.constructor?.name);

      let errorMessage = 'Une erreur inconnue est survenue';

      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        console.error('Non-standard error object:', error);
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet.';
      }

      // If it's an authentication error, redirect to sign-in
      if (errorMessage.includes('AUTHENTICATION_ERROR') || errorMessage.includes('connecter') || errorMessage.includes('401')) {
        const cleanMessage = errorMessage.replace('AUTHENTICATION_ERROR: ', '');
        toast.error('Session expirée', {
          description: cleanMessage,
          duration: 5000,
        });
        // Redirect to sign-in page after a short delay
        setTimeout(() => {
          window.location.href = '/auth/signin?callbackUrl=' + encodeURIComponent('/profile');
        }, 2000);
      } else {
        toast.error('Erreur', {
          description: errorMessage,
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCompletionPercentage = () => {
    const fields = [
      watchedValues.name,
      watchedValues.phone,
      watchedValues.address,
      watchedValues.city,
      session?.user?.email,
    ];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className={className}>
      {/* Professional Profile Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Summary */}
        <Card className="lg:col-span-2 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white pb-20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Mon Profil</CardTitle>
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex gap-2"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCancel}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    form="profile-form"
                    variant="secondary"
                    size="sm"
                    disabled={!isDirty || isLoading}
                    className="bg-white hover:bg-white/90 text-green-600 border-white"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Sauvegarder
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Avatar and Basic Info */}
          <div className="absolute -bottom-12 left-6 flex items-end gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={session.user.image || ''} />
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xl font-bold">
                  {getInitials(session.user.name || session.user.email || 'U')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white hover:bg-gray-50 text-gray-600 shadow-lg"
                disabled
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="pb-2">
              <h3 className="text-xl font-bold text-white">
                {session.user.name || 'Utilisateur'}
              </h3>
              <p className="text-green-100 text-sm">{session.user.email}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-16 pb-6">
          {/* Profile Completion */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profil complété</span>
              <span className="text-sm font-bold text-green-600">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getCompletionPercentage()}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Informations personnelles
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  layout
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nom complet *
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      {...register('name')}
                      className={`transition-all duration-200 ${errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-green-500'}`}
                      placeholder="Votre nom complet"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-900">{watchedValues.name || 'Non renseigné'}</p>
                    </div>
                  )}
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name.message}</p>
                  )}
                </motion.div>

                <motion.div
                  layout
                  className="space-y-2"
                >
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Téléphone
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      {...register('phone')}
                      className="focus:border-green-500"
                      placeholder="+216 XX XXX XXX"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-900">{watchedValues.phone || 'Non renseigné'}</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Adresse de livraison
              </h4>

              <div className="space-y-4">
                <motion.div layout className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                    Adresse complète
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      {...register('address')}
                      className="focus:border-green-500"
                      placeholder="Rue, numéro, appartement..."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-900">{watchedValues.address || 'Non renseigné'}</p>
                    </div>
                  )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div layout className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                      Ville
                    </Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        {...register('city')}
                        className="focus:border-green-500"
                        placeholder="Votre ville"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-900">{watchedValues.city || 'Non renseigné'}</p>
                      </div>
                    )}
                  </motion.div>

                  <motion.div layout className="space-y-2">
                    <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                      Code postal
                    </Label>
                    {isEditing ? (
                      <Input
                        id="postalCode"
                        {...register('postalCode')}
                        className="focus:border-green-500"
                        placeholder="1000"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="text-gray-900">{watchedValues.postalCode || 'Non renseigné'}</p>
                      </div>
                    )}
                  </motion.div>

                  <motion.div layout className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                      Pays
                    </Label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-gray-900 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-600" />
                        Tunisie
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Sécurité du compte
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Email vérifié</p>
                      <p className="text-sm text-green-600">{session.user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Membre depuis</p>
                      <p className="text-sm text-gray-600">
                        {profileData?.createdAt
                          ? new Date(profileData.createdAt).toLocaleDateString('fr-FR')
                          : 'Récemment'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </CardContent>
      </Card>

      {/* Quick Stats Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Star className="h-4 w-4 text-white" />
            </div>
            Aperçu du compte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Count */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-900">Commandes</p>
                <p className="text-sm text-blue-700">Total passées</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">{orderCount}</div>
          </div>

          {/* Profile Completion */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-green-900">Profil</p>
                <p className="text-sm text-green-700">Complété à</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-600">{getCompletionPercentage()}%</div>
          </div>

          {/* Member Status */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-purple-900">Statut</p>
                <p className="text-sm text-purple-700">Membre depuis</p>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-700 border-purple-200">
              Client Premium
            </Badge>
          </div>

          {/* Member Since */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Membre depuis</p>
                <p className="text-sm text-gray-600">
                  {profileData?.createdAt
                    ? new Date(profileData.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Récemment'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
