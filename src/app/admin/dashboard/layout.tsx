import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
}
