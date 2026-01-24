"use client";

import { useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-[var(--background)]">
                <AdminSidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
                <main className={`flex-1 min-h-screen pt-20 lg:pt-0 transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
                    }`}>
                    <div className="relative">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
