"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    UserPlus,
    ShieldCheck,
    ShieldX,
    Trash2,
    ShieldAlert,
    Clock,
    AlertTriangle
} from 'lucide-react';

interface Admin {
    id: string;
    email: string;
    is_2fa_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export default function AdminsPage() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);
    const [revokeId, setRevokeId] = useState<string | null>(null);
    const [isRevoking, setIsRevoking] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [adminsRes, meRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/auth/me')
            ]);

            if (adminsRes.ok) {
                const data = await adminsRes.json();
                setAdmins(data.admins || []);
            }

            if (meRes.ok) {
                const data = await meRes.json();
                setCurrentAdmin(data.admin);
            }
        } catch {
            console.error('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (id === currentAdmin?.id) {
            alert('Security Protocol: Self-deletion is restricted.');
            return;
        }

        setRevokeId(id);
    };

    const confirmRevoke = async () => {
        if (!revokeId) return;

        setIsRevoking(true);
        try {
            const response = await fetch(`/api/admin/users/${revokeId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setAdmins(admins.filter(a => a.id !== revokeId));
                setRevokeId(null);
            } else {
                const data = await response.json();
                console.error(data.error || 'Failed to revoke identity');
            }
        } catch {
            console.error('Error revoking admin');
        } finally {
            setIsRevoking(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[var(--background)] overflow-x-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex justify-between items-center text-center md:text-left flex-col md:flex-row gap-6 md:gap-0">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/admin/dashboard"
                                className="p-3 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)] hover:text-blue-500 rounded-2xl transition-all border border-[var(--border)]"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-black tracking-tighter uppercase">Access Control</h1>
                                <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">Identity Management</p>
                            </div>
                        </div>

                        <Link
                            href="/admin/register"
                            className="flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95"
                        >
                            <UserPlus size={20} />
                            <span>Create Identity</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Synchronizing Identities</h3>
                        <p className="text-[var(--foreground-muted)] font-medium">Verifying access protocols...</p>
                    </div>
                ) : admins.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-[var(--card-bg)]/30 backdrop-blur-xl rounded-[3rem] border border-[var(--border)] border-dashed">
                        <div className="p-8 bg-purple-500/10 text-purple-500 rounded-full mb-8">
                            <ShieldAlert size={64} />
                        </div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">No Identities Found</h3>
                        <p className="text-xl text-[var(--foreground-muted)] font-medium mb-10 max-w-md">The administrative registry is currently empty.</p>
                        <Link
                            href="/admin/register"
                            className="px-10 py-5 bg-[var(--foreground)] text-[var(--background)] font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 transition-transform"
                        >
                            Initialize First Identity
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {admins.map((admin, i) => (
                            <motion.div
                                key={admin.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`group relative bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border ${admin.id === currentAdmin?.id
                                    ? 'border-blue-500/30 bg-blue-500/5'
                                    : 'border-[var(--border)]'
                                    } hover:border-purple-500/30 transition-all duration-500 shadow-xl overflow-hidden`}
                            >
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className={`p-4 rounded-2xl ${admin.id === currentAdmin?.id
                                            ? 'bg-blue-500/10 text-blue-500'
                                            : 'bg-purple-500/10 text-purple-500'
                                            }`}>
                                            <ShieldAlert size={28} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl md:text-2xl font-black tracking-tighter uppercase">{admin.email}</h3>
                                                {admin.id === currentAdmin?.id && (
                                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                        YOU
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest opacity-40">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock size={12} /> Joined {new Date(admin.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="flex flex-col items-center md:items-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1 leading-none">Protocols</span>
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${admin.is_2fa_enabled
                                                ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                                                } text-[10px] font-black uppercase tracking-widest shadow-lg`}>
                                                {admin.is_2fa_enabled ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
                                                <span>{admin.is_2fa_enabled ? 'MFA: ACTIVE' : 'MFA: BYPASSED'}</span>
                                            </div>
                                        </div>

                                        <div className="h-12 w-px bg-[var(--border)] hidden md:block"></div>

                                        <button
                                            onClick={() => handleDelete(admin.id)}
                                            disabled={admin.id === currentAdmin?.id}
                                            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all ${admin.id === currentAdmin?.id
                                                ? 'bg-slate-500/5 text-slate-500/30 cursor-not-allowed border border-slate-500/10'
                                                : 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 shadow-lg'
                                                }`}
                                        >
                                            <Trash2 size={18} />
                                            <span className="hidden sm:inline">Revoke</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Revocation Modal */}
            <AnimatePresence>
                {revokeId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isRevoking && setRevokeId(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[var(--card-bg)] border border-red-500/20 rounded-[3rem] p-10 md:p-14 shadow-[0_0_50px_rgba(239,68,68,0.1)] overflow-hidden"
                        >
                            {/* Decorative background intensity */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>

                            <div className="relative z-10 text-center">
                                <div className="w-24 h-24 mx-auto mb-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                    <ShieldAlert size={48} />
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-6">
                                    REVOKE PROTOCOL
                                </h2>

                                <p className="text-[var(--foreground-muted)] text-lg font-medium mb-12 leading-relaxed">
                                    Revoking this identity will <span className="text-red-500 font-bold uppercase tracking-wider">permanently terminate</span> their access to the system.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-5">
                                    <button
                                        onClick={confirmRevoke}
                                        disabled={isRevoking}
                                        className="flex-1 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-6 rounded-2xl transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {isRevoking ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Trash2 size={24} />
                                                <span>Confirm Revoke</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setRevokeId(null)}
                                        disabled={isRevoking}
                                        className="flex-1 bg-[var(--muted)]/20 hover:bg-[var(--muted)]/40 text-[var(--foreground)] font-black uppercase tracking-widest py-6 rounded-2xl transition-all border border-[var(--border)]"
                                    >
                                        Abort
                                    </button>
                                </div>
                            </div>

                            {/* Corner identification */}
                            <div className="absolute bottom-6 right-8 opacity-10 flex items-center gap-2">
                                <AlertTriangle size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Critical Access</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
