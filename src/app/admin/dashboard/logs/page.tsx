"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Clock,
    User,
    Search,
    RefreshCw,
    Database,
    Filter,
    ChevronDown
} from 'lucide-react';

interface Log {
    id: string;
    admin_id: string;
    admin_email: string;
    action: string;
    details: string; // JSON string
    ip_address: string;
    created_at: string;
}

export default function LogsPage() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterAction, setFilterAction] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/logs?limit=100');
            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs || []);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const parseDetails = (detailsStr: string) => {
        try {
            return JSON.parse(detailsStr);
        } catch {
            return {};
        }
    };

    const getActionColor = (action: string) => {
        if (action.includes('CREATE')) return 'text-green-500 bg-green-500/10';
        if (action.includes('UPDATE')) return 'text-blue-500 bg-blue-500/10';
        if (action.includes('DELETE')) return 'text-red-500 bg-red-500/10';
        if (action.includes('LOGIN')) return 'text-purple-500 bg-purple-500/10';
        return 'text-[var(--foreground)] bg-[var(--muted)]/20';
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.admin_email?.toLowerCase().includes(search.toLowerCase()) ||
            log.action?.toLowerCase().includes(search.toLowerCase()) ||
            (typeof log.details === 'string' ? log.details : JSON.stringify(log.details || {})).toLowerCase().includes(search.toLowerCase());

        const matchesAction = filterAction === 'All' || log.action === filterAction;

        return matchesSearch && matchesAction;
    });

    const uniqueActions = ['All', ...Array.from(new Set(logs.map(l => l.action)))];

    return (
        <div className="relative min-h-screen bg-[var(--background)] overflow-x-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            </div>

            <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin/dashboard"
                            className="p-3 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)] hover:text-blue-500 rounded-2xl transition-all border border-[var(--border)]"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter uppercase">Activity Terminal</h1>
                            <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">Audit Stream Protocol</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                    <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30" size={20} />
                        <input
                            type="text"
                            placeholder="Filter audit entries..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>
                    <div className="relative w-full md:w-64">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="w-full pl-14 pr-6 py-4 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold shadow-2xl flex items-center justify-between hover:bg-[var(--card-bg)]/70 group"
                        >
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30 group-hover:text-blue-500 transition-colors">
                                <Filter size={18} />
                            </div>
                            <span className="truncate">{filterAction}</span>
                            <ChevronDown size={18} className={`transition-transform duration-300 ${showFilterDropdown ? 'rotate-180' : ''} opacity-30`} />
                        </button>

                        <AnimatePresence>
                            {showFilterDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-[60]"
                                        onClick={() => setShowFilterDropdown(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="absolute top-full mt-2 left-0 w-full bg-[var(--card-bg)]/90 backdrop-blur-2xl border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-[70] py-2"
                                    >
                                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                            {uniqueActions.map(action => (
                                                <button
                                                    key={action}
                                                    onClick={() => {
                                                        setFilterAction(action);
                                                        setShowFilterDropdown(false);
                                                    }}
                                                    className={`w-full px-6 py-3 text-left hover:bg-blue-500/10 transition-all font-bold flex items-center justify-between group ${filterAction === action ? 'text-blue-500 bg-blue-500/5' : 'text-[var(--foreground)]'
                                                        }`}
                                                >
                                                    <span>{action}</span>
                                                    {filterAction === action && (
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    <button
                        onClick={fetchLogs}
                        className="p-4 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)] hover:text-blue-500 rounded-2xl transition-all border border-[var(--border)]"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Database className="animate-pulse text-blue-500 mb-6" size={48} />
                        <p className="text-[var(--foreground-muted)] font-black uppercase tracking-widest text-xs">Decrypting Ledger...</p>
                    </div>
                ) : (
                    <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-[2rem] overflow-hidden shadow-2xl overflow-x-auto">
                        <table className="w-full border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--muted)]/10 text-left">
                                    <th className="px-8 py-5 text-sm font-black uppercase tracking-widest opacity-40">Timestamp</th>
                                    <th className="px-8 py-5 text-sm font-black uppercase tracking-widest opacity-40">Identity</th>
                                    <th className="px-8 py-5 text-sm font-black uppercase tracking-widest opacity-40">Classification</th>
                                    <th className="px-8 py-5 text-sm font-black uppercase tracking-widest opacity-40">Metadata</th>
                                    <th className="px-8 py-5 text-sm font-black uppercase tracking-widest opacity-40 text-right">Endpoint</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {filteredLogs.map((log) => {
                                        const details = parseDetails(log.details);
                                        return (
                                            <motion.tr
                                                key={log.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="border-b border-[var(--border)]/50 hover:bg-blue-500/5 transition-colors group"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <Clock size={14} className="opacity-30" />
                                                        <span className="text-sm font-medium tabular-nums opacity-60">
                                                            {new Date(log.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                                            <User size={14} />
                                                        </div>
                                                        <span className="text-sm font-bold tracking-tight">{log.admin_email || 'System'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="max-w-xs space-y-1">
                                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                        {Object.entries(details).map(([key, val]: [string, any]) => (
                                                            <div key={key} className="flex items-center gap-2 text-[10px]">
                                                                <span className="font-black uppercase tracking-widest opacity-30">{key}:</span>
                                                                <span className="font-medium truncate block">{JSON.stringify(val)}</span>
                                                            </div>
                                                        ))}
                                                        {Object.keys(details).length === 0 && (
                                                            <span className="text-[10px] italic opacity-30">No extra payload</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right text-[10px] font-mono opacity-40 tabular-nums">
                                                    {log.ip_address}
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                                {filteredLogs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <p className="text-[var(--foreground-muted)] font-medium uppercase tracking-widest text-xs">No audit matches found in the registry.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}

