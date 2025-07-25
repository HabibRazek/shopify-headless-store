'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Eye, EyeOff, RefreshCw, Copy } from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string | null;
}

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onPasswordReset: () => void;
}

export default function ResetPasswordModal({ open, onOpenChange, user, onPasswordReset }: ResetPasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(password);
    toast.success('Mot de passe généré automatiquement');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(newPassword);
      toast.success('Mot de passe copié dans le presse-papiers');
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!newPassword.trim()) {
      toast.error('Veuillez saisir un nouveau mot de passe');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/users/${user.id}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la réinitialisation');
      }

      toast.success('Mot de passe réinitialisé avec succès');
      setNewPassword('');
      onPasswordReset();
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword('');
    setShowPassword(false);
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
          <DialogDescription>
            Définir un nouveau mot de passe pour <strong>{user.name || user.email}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password">Nouveau mot de passe *</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                required
                className="pr-24"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-8 w-8 p-0"
                  title="Afficher/Masquer le mot de passe"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generatePassword}
                  className="h-8 w-8 p-0"
                  title="Générer un mot de passe"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                {newPassword && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-8 w-8 p-0"
                    title="Copier le mot de passe"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span>Cliquez sur <RefreshCw className="h-3 w-3 inline" /> pour générer</span>
              {newPassword && (
                <span>• <Copy className="h-3 w-3 inline" /> pour copier</span>
              )}
            </div>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Force du mot de passe:</div>
              <div className="flex space-x-1">
                <div className={`h-2 w-full rounded ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className={`h-2 w-full rounded ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className={`h-2 w-full rounded ${/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className={`h-2 w-full rounded ${/\d/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`} />
                <div className={`h-2 w-full rounded ${/[!@#$%^&*]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`} />
              </div>
              <div className="text-xs text-gray-500">
                Critères: 6+ caractères, majuscules, minuscules, chiffres, symboles
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="text-sm text-yellow-800">
              <strong>Attention:</strong> L'utilisateur devra utiliser ce nouveau mot de passe 
              pour se connecter. Assurez-vous de lui communiquer de manière sécurisée.
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || !newPassword}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
