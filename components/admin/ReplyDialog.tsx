'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  X,
  Mail,
  User,
  Building,
  Phone,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

interface ReplyDialogProps {
  message: ContactMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReplySuccess: () => void;
}

export default function ReplyDialog({
  message,
  open,
  onOpenChange,
  onReplySuccess,
}: ReplyDialogProps) {
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default subject when message changes
  useEffect(() => {
    if (message) {
      const defaultSubject = message.subject || 'Votre demande de contact';
      setReplySubject(defaultSubject);
      setReplyMessage('');
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message || !replySubject.trim() || !replyMessage.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/messages/${message.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: replySubject,
          message: replyMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Réponse envoyée avec succès!');
        onReplySuccess();
        onOpenChange(false);
        setReplySubject('');
        setReplyMessage('');
      } else {
        toast.error(data.error || 'Erreur lors de l\'envoi de la réponse');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la réponse');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-600" />
            Répondre à {message.name}
          </DialogTitle>
          <DialogDescription>
            Envoyez une réponse personnalisée à ce message de contact
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Message */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Message Original
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{message.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{message.email}</span>
                </div>
                {message.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{message.phone}</span>
                  </div>
                )}
                {message.company && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{message.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{formatDate(message.createdAt)}</span>
                </div>
              </div>

              {/* Subject */}
              {message.subject && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Sujet</Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">{message.subject}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Message</Label>
                <div className="text-sm bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto whitespace-pre-wrap">
                  {message.message}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-700">Statut</Label>
                <Badge 
                  variant={message.status === 'unread' ? 'destructive' : 
                          message.status === 'read' ? 'secondary' : 'default'}
                  className={message.status === 'replied' ? 'bg-green-600' : ''}
                >
                  {message.status === 'unread' ? 'Non lu' : 
                   message.status === 'read' ? 'Lu' : 'Répondu'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Reply Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Send className="h-4 w-4" />
                Votre Réponse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="replySubject">Sujet *</Label>
                  <Input
                    id="replySubject"
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Sujet de votre réponse"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="replyMessage">Message *</Label>
                  <Textarea
                    id="replyMessage"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Tapez votre réponse ici..."
                    rows={12}
                    required
                    className="mt-1 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Votre message sera envoyé avec l'en-tête et le pied de page Packedin
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {isSubmitting ? 'Envoi...' : 'Envoyer la réponse'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isSubmitting}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
