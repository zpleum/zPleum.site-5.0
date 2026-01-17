"use client";

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import {
    ArrowLeft,
    Plus,
    Briefcase,
    Code,
    Heart,
    Rocket,
    Target,
    Sparkles,
    Edit3,
    Trash2,
    Save,
    X,
    RefreshCw,
    ShieldAlert,
    AlertTriangle,
    GripVertical,
    BarChart3,
    ChevronDown
} from 'lucide-react';

const iconOptions = [
    { name: 'Briefcase', component: Briefcase },
    { name: 'Code', component: Code },
    { name: 'Heart', component: Heart },
    { name: 'Rocket', component: Rocket },
    { name: 'Target', component: Target },
    { name: 'Sparkles', component: Sparkles }
];

const iconMap: Record<string, any> = {
    Briefcase,
    Code,
    Heart,
    Rocket,
    Target,
    Sparkles
};

const colorOptions = ['blue', 'purple', 'pink', 'green', 'yellow', 'red'];

const COLOR_VARIANTS: Record<string, { dot: string; card: string; hover: string }> = {
    blue: {
        dot: 'bg-blue-500',
        card: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        hover: 'hover:bg-blue-500/10'
    },
    purple: {
        dot: 'bg-purple-500',
        card: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        hover: 'hover:bg-purple-500/10'
    },
    pink: {
        dot: 'bg-pink-500',
        card: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
        hover: 'hover:bg-pink-500/10'
    },
    green: {
        dot: 'bg-green-500',
        card: 'bg-green-500/10 text-green-500 border-green-500/20',
        hover: 'hover:bg-green-500/10'
    },
    yellow: {
        dot: 'bg-yellow-500',
        card: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        hover: 'hover:bg-yellow-500/10'
    },
    red: {
        dot: 'bg-red-500',
        card: 'bg-red-500/10 text-red-500 border-red-500/20',
        hover: 'hover:bg-red-500/10'
    }
};

interface Stat {
    id: string;
    label: string;
    value: string;
    icon: string;
    color: string;
    display_order: number;
}

export default function StatsPage() {
    const [stats, setStats] = useState<Stat[]>([]);
    const [loading, setLoading] = useState(true);
    const [newStatLabel, setNewStatLabel] = useState('');
    const [newStatValue, setNewStatValue] = useState('');
    const [newStatIcon, setNewStatIcon] = useState('Briefcase');
    const [newStatColor, setNewStatColor] = useState('blue');
    const [editingStatId, setEditingStatId] = useState<string | null>(null);
    const [editingStatData, setEditingStatData] = useState({ label: '', value: '', icon: '', color: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteStatId, setDeleteStatId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);
    const [showIconDropdown, setShowIconDropdown] = useState(false);
    const [showEditIconDropdown, setShowEditIconDropdown] = useState(false);
    const [showColorDropdown, setShowColorDropdown] = useState(false);
    const [showEditColorDropdown, setShowEditColorDropdown] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data.stats || []);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStatLabel.trim() || !newStatValue.trim()) return;

        setError('');
        try {
            const response = await fetch('/api/admin/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    label: newStatLabel.trim(),
                    value: newStatValue.trim(),
                    icon: newStatIcon,
                    color: newStatColor
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newStat: Stat = {
                    id: data.id,
                    label: newStatLabel.trim(),
                    value: newStatValue.trim(),
                    icon: newStatIcon,
                    color: newStatColor,
                    display_order: stats.length
                };
                setStats([...stats, newStat]);
                setNewStatLabel('');
                setNewStatValue('');
                setNewStatIcon('Briefcase');
                setNewStatColor('blue');
                setSuccess('Stat added successfully');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to add stat');
            }
        } catch (error) {
            setError('Error adding stat');
        }
    };

    const handleUpdateStat = async (id: string) => {
        if (!editingStatData.label.trim() || !editingStatData.value.trim()) return;

        setError('');
        try {
            const response = await fetch(`/api/admin/stats/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingStatData),
            });

            if (response.ok) {
                setStats(stats.map(s =>
                    s.id === id
                        ? { ...s, ...editingStatData }
                        : s
                ));
                setEditingStatId(null);
                setSuccess('Stat updated');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update stat');
            }
        } catch (error) {
            setError('Error updating stat');
        }
    };

    const confirmDeleteStat = async () => {
        if (!deleteStatId) return;

        setIsDeleting(true);
        setError('');
        try {
            const response = await fetch(`/api/admin/stats/${deleteStatId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setStats(stats.filter(s => s.id !== deleteStatId));
                setDeleteStatId(null);
                setSuccess('Stat deleted');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Failed to delete stat');
            }
        } catch (error) {
            setError('Error deleting stat');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleReorderStats = (newOrder: Stat[]) => {
        setStats(newOrder);
        setHasChanged(true);
    };

    useEffect(() => {
        if (!hasChanged || loading || stats.length === 0) return;

        setIsSyncing(true);

        const timer = setTimeout(async () => {
            try {
                await fetch('/api/admin/stats/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: stats.map(s => s.id) }),
                });
                setHasChanged(false);
            } catch (error) {
                console.error('Failed to sync reorder:', error);
            } finally {
                setIsSyncing(false);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [stats, loading, hasChanged]);

    return (
        <div className="relative min-h-screen bg-[var(--background)] overflow-x-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            </div>

            <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
                <div className="max-w-6xl mx-auto px-6 py-5">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin/dashboard"
                            className="p-3 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)] hover:text-blue-500 rounded-2xl transition-all border border-[var(--border)]"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black tracking-tighter uppercase">Stats Registry</h1>
                                {isSyncing && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full"
                                    >
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Saving...</span>
                                    </motion.div>
                                )}
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">About Page Metrics</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <form onSubmit={handleAddStat} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Label (e.g., Experience)"
                                    value={newStatLabel}
                                    onChange={(e) => setNewStatLabel(e.target.value)}
                                    className="w-full px-6 py-5 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium shadow-2xl"
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Value (e.g., 5+ Years)"
                                    value={newStatValue}
                                    onChange={(e) => setNewStatValue(e.target.value)}
                                    className="w-full px-6 py-5 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium shadow-2xl"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {/* Icon Selector */}
                            <div className="relative flex-1">
                                <button
                                    type="button"
                                    onClick={() => setShowIconDropdown(!showIconDropdown)}
                                    className="w-full px-6 py-5 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold shadow-2xl flex items-center justify-between hover:bg-[var(--card-bg)]/70"
                                >
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const SelectedIcon = iconMap[newStatIcon];
                                            return <SelectedIcon size={20} className="text-blue-500" />;
                                        })()}
                                        <span>{newStatIcon}</span>
                                    </div>
                                    <ChevronDown size={18} className="opacity-50" />
                                </button>
                                <AnimatePresence>
                                    {showIconDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full mt-2 left-0 w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-50"
                                        >
                                            {iconOptions.map(icon => {
                                                const IconComp = icon.component;
                                                return (
                                                    <button
                                                        key={icon.name}
                                                        type="button"
                                                        onClick={() => {
                                                            setNewStatIcon(icon.name);
                                                            setShowIconDropdown(false);
                                                        }}
                                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-500/10 transition-all text-left font-bold"
                                                    >
                                                        <IconComp size={20} className="text-blue-500" />
                                                        <span>{icon.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Color Selector */}
                            <div className="relative flex-1">
                                <button
                                    type="button"
                                    onClick={() => setShowColorDropdown(!showColorDropdown)}
                                    className="w-full px-6 py-5 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold shadow-2xl flex items-center justify-between hover:bg-[var(--card-bg)]/70"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${COLOR_VARIANTS[newStatColor]?.dot || 'bg-blue-500'}`}></div>
                                        <span className="capitalize">{newStatColor}</span>
                                    </div>
                                    <ChevronDown size={18} className="opacity-50" />
                                </button>
                                <AnimatePresence>
                                    {showColorDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full mt-2 left-0 w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-50"
                                        >
                                            {colorOptions.map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => {
                                                        setNewStatColor(color);
                                                        setShowColorDropdown(false);
                                                    }}
                                                    className={`w-full px-4 py-3 flex items-center gap-3 transition-all text-left font-bold ${COLOR_VARIANTS[color]?.hover}`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full ${COLOR_VARIANTS[color]?.dot}`}></div>
                                                    <span className="capitalize">{color}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                type="submit"
                                disabled={!newStatLabel.trim() || !newStatValue.trim()}
                                className="px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                    {error && <p className="mt-4 text-red-500 text-xs font-black uppercase tracking-widest px-4">Protocol Error: {error}</p>}
                    {success && <p className="mt-4 text-green-500 text-xs font-black uppercase tracking-widest px-4">Sync Success: {success}</p>}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="animate-spin text-blue-500 mb-4" size={32} />
                        <p className="text-[var(--foreground-muted)] font-medium uppercase tracking-widest text-xs">Accessing Registry...</p>
                    </div>
                ) : (
                    <Reorder.Group
                        axis="y"
                        values={stats}
                        onReorder={handleReorderStats}
                        className="flex flex-col gap-4"
                    >
                        <AnimatePresence initial={false}>
                            {stats.map((stat) => (
                                <StatItem
                                    key={stat.id}
                                    stat={stat}
                                    editingStatId={editingStatId}
                                    editingStatData={editingStatData}
                                    setEditingStatData={setEditingStatData}
                                    setEditingStatId={setEditingStatId}
                                    handleUpdateStat={handleUpdateStat}
                                    setDeleteStatId={setDeleteStatId}
                                    showEditIconDropdown={showEditIconDropdown}
                                    setShowEditIconDropdown={setShowEditIconDropdown}
                                    showEditColorDropdown={showEditColorDropdown}
                                    setShowEditColorDropdown={setShowEditColorDropdown}
                                />
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                )}
            </main>

            {/* Deletion Modal */}
            <AnimatePresence>
                {deleteStatId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeleting && setDeleteStatId(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-[var(--card-bg)] border border-red-500/20 rounded-[3rem] p-10 md:p-14 shadow-[0_0_50px_rgba(239,68,68,0.1)] overflow-hidden"
                        >
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>

                            <div className="relative z-10 text-center">
                                <div className="w-24 h-24 mx-auto mb-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                    <ShieldAlert size={48} />
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-6">
                                    ERASE PROTOCOL
                                </h2>

                                <p className="text-[var(--foreground-muted)] text-lg font-medium mb-12 leading-relaxed">
                                    Are you certain you wish to permanently terminate this stat?
                                </p>

                                <div className="flex flex-col sm:flex-row gap-5">
                                    <button
                                        onClick={confirmDeleteStat}
                                        disabled={isDeleting}
                                        className="flex-1 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-6 rounded-2xl transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {isDeleting ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Trash2 size={24} />
                                                <span>Confirm Erase</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setDeleteStatId(null)}
                                        disabled={isDeleting}
                                        className="flex-1 bg-[var(--muted)]/20 hover:bg-[var(--muted)]/40 text-[var(--foreground)] font-black uppercase tracking-widest py-6 rounded-2xl transition-all border border-[var(--border)]"
                                    >
                                        Abort
                                    </button>
                                </div>
                            </div>

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

// Stat Item Component
const StatItem = memo(function StatItemComponent({
    stat,
    editingStatId,
    editingStatData,
    setEditingStatData,
    setEditingStatId,
    handleUpdateStat,
    setDeleteStatId,
    showEditIconDropdown,
    setShowEditIconDropdown,
    showEditColorDropdown,
    setShowEditColorDropdown
}: any) {
    const dragControls = useDragControls();
    const IconComponent = iconMap[stat.icon] || Briefcase;

    return (
        <Reorder.Item
            value={stat}
            dragListener={false}
            dragControls={dragControls}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            whileDrag={{
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                borderColor: "rgba(59, 130, 246, 0.5)"
            }}
            className="group bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5 shadow-lg"
        >
            {editingStatId === stat.id ? (
                <div className="flex gap-3">
                    <input
                        autoFocus
                        type="text"
                        value={editingStatData.label}
                        onChange={(e) => setEditingStatData({ ...editingStatData, label: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateStat(stat.id);
                            if (e.key === 'Escape') setEditingStatId(null);
                        }}
                        className="flex-1 px-4 py-2 bg-[var(--background)]/50 border border-blue-500/50 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                        placeholder="Label"
                    />
                    <input
                        type="text"
                        value={editingStatData.value}
                        onChange={(e) => setEditingStatData({ ...editingStatData, value: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateStat(stat.id);
                            if (e.key === 'Escape') setEditingStatId(null);
                        }}
                        className="flex-1 px-4 py-2 bg-[var(--background)]/50 border border-blue-500/50 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                        placeholder="Value"
                    />

                    {/* Icon Dropdown in Edit Mode */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowEditIconDropdown(!showEditIconDropdown)}
                            className="px-4 py-2 bg-[var(--background)]/50 border border-blue-500/50 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold flex items-center gap-2 hover:bg-[var(--background)]/70 transition-all"
                        >
                            {(() => {
                                const SelectedIcon = iconMap[editingStatData.icon];
                                return <SelectedIcon size={18} className="text-blue-500" />;
                            })()}
                        </button>
                        <AnimatePresence>
                            {showEditIconDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full mt-2 left-0 w-48 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-50"
                                >
                                    {iconOptions.map(icon => {
                                        const IconComp = icon.component;
                                        return (
                                            <button
                                                key={icon.name}
                                                type="button"
                                                onClick={() => {
                                                    setEditingStatData({ ...editingStatData, icon: icon.name });
                                                    setShowEditIconDropdown(false);
                                                }}
                                                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-blue-500/10 transition-all text-left font-bold text-sm"
                                            >
                                                <IconComp size={18} className="text-blue-500" />
                                                <span>{icon.name}</span>
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Color Dropdown in Edit Mode */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowEditColorDropdown(!showEditColorDropdown)}
                            className="px-4 py-2 bg-[var(--background)]/50 border border-blue-500/50 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold flex items-center gap-2 hover:bg-[var(--background)]/70 transition-all"
                        >
                            <div className={`w-4 h-4 rounded-full ${COLOR_VARIANTS[editingStatData.color]?.dot || 'bg-blue-500'}`}></div>
                        </button>
                        <AnimatePresence>
                            {showEditColorDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full mt-2 left-0 w-32 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-50"
                                >
                                    {colorOptions.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => {
                                                setEditingStatData({ ...editingStatData, color });
                                                setShowEditColorDropdown(false);
                                            }}
                                            className={`w-full px-3 py-2 flex items-center gap-2 transition-all text-left font-bold text-sm ${COLOR_VARIANTS[color]?.hover}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full ${COLOR_VARIANTS[color]?.dot}`}></div>
                                            <span className="capitalize">{color}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={() => handleUpdateStat(stat.id)}
                        className="p-2 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                    >
                        <Save size={18} />
                    </button>
                    <button
                        onClick={() => setEditingStatId(null)}
                        className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            onPointerDown={(e) => dragControls.start(e)}
                            className="p-2 text-[var(--foreground)]/20 cursor-grab active:cursor-grabbing hover:text-blue-500 transition-colors"
                        >
                            <GripVertical size={20} />
                        </div>
                        <div className={`p-3 rounded-xl ${COLOR_VARIANTS[stat.color]?.card || 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                            <IconComponent size={20} />
                        </div>
                        <div>
                            <span className="text-lg font-black tracking-tight uppercase">{stat.label}</span>
                            <p className="text-sm text-[var(--foreground)]/50 font-bold">{stat.value}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEditingStatId(stat.id);
                                setEditingStatData({ label: stat.label, value: stat.value, icon: stat.icon, color: stat.color });
                            }}
                            className="p-3 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)]/50 hover:text-blue-500 rounded-xl transition-all border border-[var(--border)]"
                        >
                            <Edit3 size={18} />
                        </button>
                        <button
                            onClick={() => setDeleteStatId(stat.id)}
                            className="p-3 bg-red-500/5 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 rounded-xl transition-all border border-red-500/10"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            )}
        </Reorder.Item>
    );
});
