'use client';

import { motion } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';
import EnhancedOrdersTable from '@/components/admin/EnhancedOrdersTable';

export default function OrdersAdminPage() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <EnhancedOrdersTable />
      </motion.div>
    </AdminLayout>
  );
}
