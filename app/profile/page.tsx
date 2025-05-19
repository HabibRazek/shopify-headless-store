'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, type ProfileFormValues } from '@/lib/validations/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { UserIcon, PackageIcon, ClipboardListIcon } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [shopifyCustomerId, setShopifyCustomerId] = useState<string | null>(null);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Initialize react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    if (session?.user) {
      // Fetch user details including profile information
      const fetchUserDetails = async () => {
        try {
          const response = await fetch(`/api/user/profile`);
          if (response.ok) {
            const data = await response.json();
            const user = data.user;

            // Set form values from user data
            setValue('name', user.name || '');
            setValue('phone', user.phone || '');
            setValue('address', user.address || '');
            setValue('city', user.city || '');
            setValue('postalCode', user.postalCode || '');
            setValue('country', user.country || 'TN');

            // Set Shopify customer ID
            if (user.shopifyCustomerId) {
              setShopifyCustomerId(user.shopifyCustomerId);
            }
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      fetchUserDetails();
    }
  }, [session, status, router, setValue]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user?.id) {
        setIsLoadingOrders(true);
        try {
          const response = await fetch(`/api/user/orders?userId=${session.user.id}`);
          if (response.ok) {
            const data = await response.json();
            setOrders(data.orders);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setIsLoadingOrders(false);
        }
      }
    };

    fetchOrders();
  }, [session]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Show success toast notification with Sonner
      toast.success('Profil mis à jour', {
        description: 'Vos informations ont été mises à jour avec succès!',
        duration: 3000,
      });
    } catch (error) {
      // Show error toast notification with Sonner
      toast.error('Erreur', {
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        duration: 5000,
      });
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Mon Compte</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6 bg-white border">
          <TabsTrigger value="profile" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <UserIcon className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <PackageIcon className="h-4 w-4 mr-2" />
            Commandes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-md border-0">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="flex items-center text-xl">
                <UserIcon className="h-5 w-5 mr-2 text-green-600" />
                Informations Personnelles
              </CardTitle>
              <CardDescription>
                Mettez à jour vos informations de compte
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Personal Information Section */}
                  <div className="space-y-5 md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Informations Personnelles</h3>

                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Nom Complet
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <UserIcon className="h-5 w-5" />
                        </div>
                        <Input
                          id="name"
                          type="text"
                          className={`pl-10 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          disabled={isSubmitting}
                          {...register('name')}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <Input
                          id="email"
                          type="email"
                          value={session?.user?.email || ''}
                          className="pl-10 bg-gray-50"
                          disabled={true}
                        />
                      </div>
                      <p className="text-sm text-gray-500">L'email ne peut pas être modifié</p>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Numéro de Téléphone
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="ex: 50095115"
                          className={`pl-10 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          disabled={isSubmitting}
                          {...register('phone')}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="space-y-5 md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Adresse de Livraison</h3>

                    <div className="space-y-1">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Adresse
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <Input
                          id="address"
                          type="text"
                          placeholder="Adresse complète"
                          className={`pl-10 ${errors.address ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          disabled={isSubmitting}
                          {...register('address')}
                        />
                      </div>
                      {errors.address && (
                        <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="city" className="text-sm font-medium">
                          Ville
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="ex: Nabeul"
                          className={`${errors.city ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          disabled={isSubmitting}
                          {...register('city')}
                        />
                        {errors.city && (
                          <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="postalCode" className="text-sm font-medium">
                          Code Postal
                        </Label>
                        <Input
                          id="postalCode"
                          type="text"
                          placeholder="ex: 8000"
                          className={`${errors.postalCode ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          disabled={isSubmitting}
                          {...register('postalCode')}
                        />
                        {errors.postalCode && (
                          <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="country" className="text-sm font-medium">
                        Pays
                      </Label>
                      <Input
                        id="country"
                        type="text"
                        value="Tunisie"
                        className="bg-gray-50"
                        disabled={true}
                      />
                      <input type="hidden" {...register('country')} value="TN" />
                    </div>
                  </div>
                </div>

                {shopifyCustomerId && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="text-sm font-medium text-green-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Compte Shopify Lié
                    </h3>
                    <p className="mt-2 text-sm text-green-700">
                      Votre compte est lié à Shopify. Vos commandes seront synchronisées avec votre compte client Shopify.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 mt-6 w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Mise à jour...
                    </div>
                  ) : (
                    'Mettre à jour le profil'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="shadow-md border-0">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="flex items-center text-xl">
                <ClipboardListIcon className="h-5 w-5 mr-2 text-green-600" />
                Historique des Commandes
              </CardTitle>
              <CardDescription>
                Consultez vos commandes passées
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoadingOrders ? (
                <div className="flex justify-center items-center py-12">
                  <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-lg">Order #{order.orderNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="font-medium text-green-700">
                          {order.total.toFixed(2)} TND
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          {order.items?.length || 0} {order.items?.length === 1 ? 'article' : 'articles'}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() => router.push(`/orders/${order.id}`)}
                        >
                          Voir les Détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <PackageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Pas encore de commandes</h3>
                  <p className="text-gray-500 mb-6">Vous n&apos;avez pas encore passé de commandes.</p>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => router.push('/products')}
                  >
                    Parcourir les Produits
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
