"use client";

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import {
    ArrowLeft,
    Edit3,
    Trash2,
    Save,
    X,
    RefreshCw,
    ShieldAlert,
    AlertTriangle,
    GripVertical,
    AlignLeft,
    AlignRight
} from 'lucide-react';

interface Milestone {
    id: string;
    year: string;
    title: string;
    description: string;
    align: string;
    display_order: number;
}

export default function JourneyPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [newYear, setNewYear] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newAlign, setNewAlign] = useState('left');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingData, setEditingData] = useState({ year: '', title: '', description: '', align: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
        fetchMilestones();
    }, []);

    const fetchMilestones = async () => {
        try {
            const response = await fetch('/api/admin/journey');
            if (response.ok) {
                const data = await response.json();
                setMilestones(data.milestones || []);
            }
        } catch (error) {
            console.error('Error fetching milestones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newYear.trim() || !newTitle.trim() || !newDescription.trim()) return;

        setError('');
        try {
            const response = await fetch('/api/admin/journey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    year: newYear.trim(),
                    title: newTitle.trim(),
                    description: newDescription.trim(),
                    align: newAlign
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newMilestone: Milestone = {
                    id: data.id,
                    year: newYear.trim(),
                    title: newTitle.trim(),
                    description: newDescription.trim(),
                    align: newAlign,
                    display_order: milestones.length
                };
                setMilestones([...milestones, newMilestone]);
                setNewYear('');
                setNewTitle('');
                setNewDescription('');
                setNewAlign('left');
                setSuccess('Milestone added successfully');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to add milestone');
            }
        } catch {
            setError('Error adding milestone');
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editingData.year.trim() || !editingData.title.trim() || !editingData.description.trim()) return;

        setError('');
        try {
            const response = await fetch(`/api/admin/journey/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingData),
            });

            if (response.ok) {
                setMilestones(milestones.map(m =>
                    m.id === id
                        ? { ...m, ...editingData }
                        : m
                ));
                setEditingId(null);
                setSuccess('Milestone updated');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update milestone');
            }
        } catch {
            setError('Error updating milestone');
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        setError('');
        try {
            const response = await fetch(`/api/admin/journey/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMilestones(milestones.filter(m => m.id !== deleteId));
                setDeleteId(null);
                setSuccess('Milestone deleted');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Failed to delete milestone');
            }
        } catch {
            setError('Error deleting milestone');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleReorder = (newOrder: Milestone[]) => {
        setMilestones(newOrder);
        setHasChanged(true);
    };

    useEffect(() => {
        if (!hasChanged || loading || milestones.length === 0) return;

        setIsSyncing(true);

        const timer = setTimeout(async () => {
            try {
                await fetch('/api/admin/journey/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: milestones.map(m => m.id) }),
                });
                setHasChanged(false);
            } catch (error) {
                console.error('Failed to sync reorder:', error);
            } finally {
                setIsSyncing(false);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [milestones, loading, hasChanged]);

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
                                <h1 className="text-2xl font-black tracking-tighter uppercase">Journey Timeline</h1>
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
                            <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">About Page Milestones</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Year (e.g., 2024)"
                                value={newYear}
                                onChange={(e) => setNewYear(e.target.value)}
                                className="px-6 py-5 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium shadow-2xl"
                            />
                            <input
                                type="text"
                                placeholder="Title (e.g., GENESIS)"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="px-6 py-5 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium shadow-2xl"
                            />
                        </div>
                        <textarea
                            placeholder="Description..."
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            rows={3}
                            className="w-full px-6 py-5 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium shadow-2xl resize-none"
                        />
                        <div className="flex gap-4">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setNewAlign('left')}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all ${newAlign === 'left' ? 'bg-blue-500 text-white' : 'bg-[var(--muted)]/30 text-[var(--foreground)]'}`}
                                >
                                    <AlignLeft size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewAlign('right')}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all ${newAlign === 'right' ? 'bg-blue-500 text-white' : 'bg-[var(--muted)]/30 text-[var(--foreground)]'}`}
                                >
                                    <AlignRight size={18} />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={!newYear.trim() || !newTitle.trim() || !newDescription.trim()}
                                className="flex-1 px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                Add Milestone
                            </button>
                        </div>
                    </form>
                    {error && <p className="mt-4 text-red-500 text-xs font-black uppercase tracking-widest px-4">Protocol Error: {error}</p>}
                    {success && <p className="mt-4 text-green-500 text-xs font-black uppercase tracking-widest px-4">Sync Success: {success}</p>}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="animate-spin text-blue-500 mb-4" size={32} />
                        <p className="text-[var(--foreground-muted)] font-medium uppercase tracking-widest text-xs">Accessing Timeline...</p>
                    </div>
                ) : (
                    <Reorder.Group
                        axis="y"
                        values={milestones}
                        onReorder={handleReorder}
                        className="flex flex-col gap-4"
                    >
                        <AnimatePresence initial={false}>
                            {milestones.map((milestone) => (
                                <MilestoneItem
                                    key={milestone.id}
                                    milestone={milestone}
                                    editingId={editingId}
                                    editingData={editingData}
                                    setEditingData={setEditingData}
                                    setEditingId={setEditingId}
                                    handleUpdate={handleUpdate}
                                    setDeleteId={setDeleteId}
                                />
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                )}
            </main>

            {/* Deletion Modal */}
            <AnimatePresence>
                {deleteId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeleting && setDeleteId(null)}
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
                                    Are you certain you wish to permanently terminate this milestone?
                                </p>

                                <div className="flex flex-col sm:flex-row gap-5">
                                    <button
                                        onClick={confirmDelete}
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
                                        onClick={() => setDeleteId(null)}
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

// Milestone Item Component
interface MilestoneItemProps {
    milestone: Milestone;
    editingId: string | null;
    editingData: { year: string; title: string; description: string; align: string };
    setEditingData: (data: { year: string; title: string; description: string; align: string }) => void;
    setEditingId: (id: string | null) => void;
    handleUpdate: (id: string) => void;
    setDeleteId: (id: string | null) => void;
}

const MilestoneItem = memo(function MilestoneItemComponent({
    milestone,
    editingId,
    editingData,
    setEditingData,
    setEditingId,
    handleUpdate,
    setDeleteId
}: MilestoneItemProps) {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={milestone}
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
            {editingId === milestone.id ? (
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <input
                            autoFocus
                            type="text"
                            value={editingData.year}
                            onChange={(e) => setEditingData({ ...editingData, year: e.target.value })}
                            className="flex-1 px-4 py-2 bg-[var(--background)]/50 border border-blue-500/50 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                            placeholder="Year"
                        />
                        <input
                            type="text"
                            value={editingData.title}
                            onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                            className="flex-1 px-4 py-2 bg-[var(--background)]/50 border border-blue-500/50 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                            placeholder="Title"
                        />
                    </div>
                    <textarea
                        value={editingData.description}
                        onChange={(e) => setEditingData({ ...editingData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 bg-[var(--background)]/50 border border-blue-500/50 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none"
                        placeholder="Description"
                    />
                    <div className="flex gap-3">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setEditingData({ ...editingData, align: 'left' })}
                                className={`px-4 py-2 rounded-xl font-bold transition-all ${editingData.align === 'left' ? 'bg-blue-500 text-white' : 'bg-[var(--muted)]/30 text-[var(--foreground)]'}`}
                            >
                                <AlignLeft size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingData({ ...editingData, align: 'right' })}
                                className={`px-4 py-2 rounded-xl font-bold transition-all ${editingData.align === 'right' ? 'bg-blue-500 text-white' : 'bg-[var(--muted)]/30 text-[var(--foreground)]'}`}
                            >
                                <AlignRight size={16} />
                            </button>
                        </div>
                        <button
                            onClick={() => handleUpdate(milestone.id)}
                            className="p-2 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                        >
                            <Save size={18} />
                        </button>
                        <button
                            onClick={() => setEditingId(null)}
                            className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <div
                            onPointerDown={(e) => dragControls.start(e)}
                            className="p-2 text-[var(--foreground)]/20 cursor-grab active:cursor-grabbing hover:text-blue-500 transition-colors mt-1"
                        >
                            <GripVertical size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg font-black text-blue-500">{milestone.year}</span>
                                <span className="text-xl font-black tracking-tight uppercase">{milestone.title}</span>
                                {milestone.align === 'right' && (
                                    <AlignRight size={16} className="text-[var(--foreground)]/30" />
                                )}
                            </div>
                            <p className="text-sm text-[var(--foreground)]/70 font-medium leading-relaxed">{milestone.description}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEditingId(milestone.id);
                                setEditingData({ year: milestone.year, title: milestone.title, description: milestone.description, align: milestone.align });
                            }}
                            className="p-3 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)]/50 hover:text-blue-500 rounded-xl transition-all border border-[var(--border)]"
                        >
                            <Edit3 size={18} />
                        </button>
                        <button
                            onClick={() => setDeleteId(milestone.id)}
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
