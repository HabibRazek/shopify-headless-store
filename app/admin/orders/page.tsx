'use client';

import { motion } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';
import OrdersDataTable from '@/components/admin/OrdersDataTable';
import { ShoppingCart, Plus, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrdersAdminPage() {
  return (
    <AdminLayout
      title="Gestion des Commandes"
      description="Gérez toutes les commandes de votre boutique en ligne"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Synchroniser
          </Button>
        </div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Page Header */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-600 rounded-xl shadow-lg">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
              <p className="text-gray-600 mt-1">
                Gérez et suivez toutes les commandes de votre boutique Shopify
              </p>
            </div>
          </div>
        </div>

        {/* Orders Data Table */}
        <OrdersDataTable />
      </motion.div>
    </AdminLayout>
  );
}
