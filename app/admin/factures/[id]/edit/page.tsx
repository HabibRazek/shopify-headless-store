'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    // For now, redirect to create page with a note
    // In a full implementation, you would pre-fill the form with existing data
    toast.info('Redirection vers le formulaire de modification...', {
      description: 'La modification des factures sera bientôt disponible',
    });
    
    // Redirect to the invoice detail page for now
    router.push(`/admin/factures/${params.id}`);
  }, [params.id, router]);

  return (
    <AdminLayout
      title="Modification de facture"
      description="Redirection en cours..."
    >
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Redirection en cours...</span>
      </div>
    </AdminLayout>
  );
}
