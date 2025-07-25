import { SessionProvider } from 'next-auth/react';
import '../globals.css';
import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="admin-layout h-screen bg-gray-50 antialiased overflow-hidden">
        {children}
      </div>
    </SessionProvider>
  );
}
