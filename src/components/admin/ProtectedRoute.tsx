'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Admin {
    id: string;
    email: string;
    is2FAEnabled: boolean;
}

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, [pathname]);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me');

            if (!response.ok) {
                router.push('/admin/login');
                return;
            }

            const data = await response.json();
            setAdmin(data.admin);
            setLoading(false);
        } catch (error) {
            router.push('/admin/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-300">Loading...</p>
                </div>
            </div>
        );
    }

    if (!admin) {
        return null;
    }

    return <>{children}</>;
}
