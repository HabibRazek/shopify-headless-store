'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Settings,
  Save,
  Bell,
  Shield,
  Globe,
  Mail,
  Database,
  Palette,
  Users,
  FileText,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // Site Configuration
    siteName: 'Packedin',
    siteDescription: 'Solutions d\'emballage professionnelles',
    siteUrl: 'https://packedin.tn',
    adminEmail: 'admin@packedin.tn',
    contactEmail: 'contact@packedin.tn',
    supportEmail: 'support@packedin.tn',

    // Features
    enableNotifications: true,
    enableUserRegistration: true,
    enableBlogComments: true,
    enableAnalytics: true,
    enableNewsletter: true,
    enableSocialLogin: false,

    // Security
    maintenanceMode: false,
    enableTwoFactor: false,
    sessionTimeout: '24',
    maxLoginAttempts: '5',

    // Performance
    enableCaching: true,
    enableCompression: true,
    enableCDN: false,

    // Notifications
    emailNotifications: true,
    orderNotifications: true,
    blogNotifications: true,
    systemNotifications: true,
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-4 max-w-full overflow-hidden">
        {/* Professional Page Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#B4E50D] to-[#9BC70A] rounded-lg flex items-center justify-center shadow-lg">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Paramètres</h1>
                </div>
                <p className="text-gray-600 text-sm sm:text-lg">Configurez votre site web et vos préférences d'administration</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  size="sm"
                  className="bg-gradient-to-r from-gray-900 to-[#B4E50D] hover:from-gray-800 hover:to-[#9BC70A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Site Configuration */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#B4E50D]" />
                Configuration du Site
              </CardTitle>
              <CardDescription>Paramètres de base de votre site web</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nom du Site</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Description du Site</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteUrl">URL du Site</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Configuration */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#B4E50D]" />
                Configuration Email
              </CardTitle>
              <CardDescription>Adresses email pour les notifications</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email Administrateur</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email Contact</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Email Support</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#B4E50D]" />
                Fonctionnalités
              </CardTitle>
              <CardDescription>Activez ou désactivez les fonctionnalités</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Inscription des utilisateurs</Label>
                  <p className="text-sm text-gray-500">Permettre aux nouveaux utilisateurs de s'inscrire</p>
                </div>
                <Switch
                  checked={settings.enableUserRegistration}
                  onCheckedChange={(checked) => handleInputChange('enableUserRegistration', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Commentaires du blog</Label>
                  <p className="text-sm text-gray-500">Autoriser les commentaires sur les articles</p>
                </div>
                <Switch
                  checked={settings.enableBlogComments}
                  onCheckedChange={(checked) => handleInputChange('enableBlogComments', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Newsletter</Label>
                  <p className="text-sm text-gray-500">Système d'abonnement à la newsletter</p>
                </div>
                <Switch
                  checked={settings.enableNewsletter}
                  onCheckedChange={(checked) => handleInputChange('enableNewsletter', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Connexion sociale</Label>
                  <p className="text-sm text-gray-500">Connexion via Google, Facebook, etc.</p>
                </div>
                <Switch
                  checked={settings.enableSocialLogin}
                  onCheckedChange={(checked) => handleInputChange('enableSocialLogin', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#B4E50D]" />
                Sécurité
              </CardTitle>
              <CardDescription>Paramètres de sécurité et maintenance</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    Mode maintenance
                    {settings.maintenanceMode && <AlertCircle className="h-4 w-4 text-orange-500" />}
                  </Label>
                  <p className="text-sm text-gray-500">Désactiver temporairement le site</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-gray-500">Sécurité renforcée pour les administrateurs</p>
                </div>
                <Switch
                  checked={settings.enableTwoFactor}
                  onCheckedChange={(checked) => handleInputChange('enableTwoFactor', checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Délai d'expiration de session (heures)</Label>
                <Select value={settings.sessionTimeout} onValueChange={(value) => handleInputChange('sessionTimeout', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 heure</SelectItem>
                    <SelectItem value="6">6 heures</SelectItem>
                    <SelectItem value="12">12 heures</SelectItem>
                    <SelectItem value="24">24 heures</SelectItem>
                    <SelectItem value="168">7 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
                <Select value={settings.maxLoginAttempts} onValueChange={(value) => handleInputChange('maxLoginAttempts', value)}>
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 tentatives</SelectItem>
                    <SelectItem value="5">5 tentatives</SelectItem>
                    <SelectItem value="10">10 tentatives</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Performance */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Database className="h-5 w-5 text-[#B4E50D]" />
                Performance
              </CardTitle>
              <CardDescription>Optimisations et cache</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    Cache activé
                    {settings.enableCaching && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </Label>
                  <p className="text-sm text-gray-500">Améliore les performances du site</p>
                </div>
                <Switch
                  checked={settings.enableCaching}
                  onCheckedChange={(checked) => handleInputChange('enableCaching', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compression</Label>
                  <p className="text-sm text-gray-500">Compression des fichiers CSS/JS</p>
                </div>
                <Switch
                  checked={settings.enableCompression}
                  onCheckedChange={(checked) => handleInputChange('enableCompression', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>CDN</Label>
                  <p className="text-sm text-gray-500">Réseau de distribution de contenu</p>
                </div>
                <Switch
                  checked={settings.enableCDN}
                  onCheckedChange={(checked) => handleInputChange('enableCDN', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b border-gray-100">
              <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#B4E50D]" />
                Notifications
              </CardTitle>
              <CardDescription>Préférences de notifications</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications email</Label>
                  <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications de commandes</Label>
                  <p className="text-sm text-gray-500">Nouvelles commandes et mises à jour</p>
                </div>
                <Switch
                  checked={settings.orderNotifications}
                  onCheckedChange={(checked) => handleInputChange('orderNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications blog</Label>
                  <p className="text-sm text-gray-500">Nouveaux commentaires et articles</p>
                </div>
                <Switch
                  checked={settings.blogNotifications}
                  onCheckedChange={(checked) => handleInputChange('blogNotifications', checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications système</Label>
                  <p className="text-sm text-gray-500">Mises à jour et alertes système</p>
                </div>
                <Switch
                  checked={settings.systemNotifications}
                  onCheckedChange={(checked) => handleInputChange('systemNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Info className="h-5 w-5 text-[#B4E50D]" />
              État du Système
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium text-green-900">Serveur</p>
                  <p className="text-sm text-green-700">En ligne</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium text-green-900">Base de données</p>
                  <p className="text-sm text-green-700">Connectée</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-medium text-green-900">Cache</p>
                  <p className="text-sm text-green-700">Actif</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
