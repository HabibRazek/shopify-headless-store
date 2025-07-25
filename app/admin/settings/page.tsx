'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Packedin',
    siteDescription: 'Solutions d\'emballage professionnelles',
    adminEmail: 'admin@packedin.tn',
    enableNotifications: true,
    enableUserRegistration: true,
    enableBlogComments: true,
    maintenanceMode: false,
    enableAnalytics: true,
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
    <AdminLayout
      title="Paramètres"
      description="Configurez votre site web et vos préférences d'administration"
      actions={
        <Button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Paramètres Généraux
            </CardTitle>
            <CardDescription>
              Configuration de base de votre site web
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nom du Site</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email Administrateur</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Description du Site</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* User Management Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Gestion des Utilisateurs
            </CardTitle>
            <CardDescription>
              Paramètres liés aux comptes utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Inscription Utilisateurs</Label>
                <p className="text-sm text-gray-500">
                  Permettre aux nouveaux utilisateurs de s'inscrire
                </p>
              </div>
              <Switch
                checked={settings.enableUserRegistration}
                onCheckedChange={(checked) => handleInputChange('enableUserRegistration', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Blog Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Paramètres du Blog
            </CardTitle>
            <CardDescription>
              Configuration du système de blog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Commentaires</Label>
                <p className="text-sm text-gray-500">
                  Permettre les commentaires sur les articles
                </p>
              </div>
              <Switch
                checked={settings.enableBlogComments}
                onCheckedChange={(checked) => handleInputChange('enableBlogComments', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications Email</Label>
                <p className="text-sm text-gray-500">
                  Recevoir des notifications par email
                </p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => handleInputChange('enableNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-red-600" />
              Système
            </CardTitle>
            <CardDescription>
              Paramètres système et maintenance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mode Maintenance</Label>
                <p className="text-sm text-gray-500">
                  Activer le mode maintenance du site
                </p>
              </div>
              <div className="flex items-center gap-2">
                {settings.maintenanceMode && (
                  <Badge variant="destructive">Actif</Badge>
                )}
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Analytics</Label>
                <p className="text-sm text-gray-500">
                  Activer le suivi des statistiques
                </p>
              </div>
              <Switch
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => handleInputChange('enableAnalytics', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-600" />
              Informations Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-gray-500">Version</Label>
                <p className="font-medium">1.0.0</p>
              </div>
              <div>
                <Label className="text-gray-500">Dernière Mise à Jour</Label>
                <p className="font-medium">Aujourd'hui</p>
              </div>
              <div>
                <Label className="text-gray-500">Statut</Label>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Opérationnel
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
