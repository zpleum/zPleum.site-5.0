"use client";

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import {
    ArrowLeft,
    Plus,
    FolderGit2,
    Edit3,
    Trash2,
    X,
    Save,
    RefreshCw,
    ShieldAlert,
    AlertTriangle,
    GripVertical,
    Award
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    created_at: string;
}

export default function CertificateCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/certificate-categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories || []);
            }
        } catch {
            console.error('Error fetching categories');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setError('');
        try {
            const response = await fetch('/api/admin/certificate-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName.trim() }),
            });

            if (response.ok) {
                const data = await response.json();
                setCategories([...categories, { id: data.id, name: newName.trim(), created_at: new Date().toISOString() }].sort((a, b) => a.name.localeCompare(b.name)));
                setNewName('');
                setSuccess('Category added successfully');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to add category');
            }
        } catch {
            setError('Error adding category');
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editingName.trim()) return;

        setError('');
        try {
            const response = await fetch(`/api/admin/certificate-categories/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editingName.trim() }),
            });

            if (response.ok) {
                setCategories(categories.map(c => c.id === id ? { ...c, name: editingName.trim() } : c).sort((a, b) => a.name.localeCompare(b.name)));
                setEditingId(null);
                setSuccess('Category updated');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update category');
            }
        } catch {
            setError('Error updating category');
        }
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        setError('');
        try {
            const response = await fetch(`/api/admin/certificate-categories/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCategories(categories.filter(c => c.id !== deleteId));
                setDeleteId(null);
                setSuccess('Category deleted');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Failed to delete category');
            }
        } catch {
            setError('Error deleting category');
        } finally {
            setIsDeleting(false);
        }
    };

    // Optimized Reorder: Update UI instantly, sync with DB after a delay
    const handleReorder = (newOrder: Category[]) => {
        setCategories(newOrder);
        setHasChanged(true);
    };

    // Debounced Sync Effect
    useEffect(() => {
        if (!hasChanged || loading || categories.length === 0) return;

        // Mark as "about to sync"
        setIsSyncing(true);

        const timer = setTimeout(async () => {
            try {
                await fetch('/api/admin/certificate-categories/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: categories.map(c => c.id) }),
                });
                setHasChanged(false); // Reset change tracker after sync
            } catch {
                console.error('Failed to sync reorder');
            } finally {
                setIsSyncing(false);
            }
        }, 1500); // Slightly longer delay for better batching

        return () => clearTimeout(timer);
    }, [categories, loading, hasChanged]);

    return (
        <div className="relative min-h-screen bg-[var(--background)] overflow-x-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            </div>

            <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
                <div className="max-w-4xl mx-auto px-6 py-5">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin/dashboard"
                            className="p-3 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)] hover:text-blue-500 rounded-2xl transition-all border border-[var(--border)]"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black tracking-tighter uppercase">Certificate Categories</h1>
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
                            <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">Credential Classification</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <form onSubmit={handleAdd} className="flex gap-4">
                        <div className="relative flex-1">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30">
                                <Plus size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Initialize new category..."
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium shadow-2xl"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!newName.trim()}
                            className="px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            Add
                        </button>
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
                        values={categories}
                        onReorder={handleReorder}
                        className="flex flex-col gap-4"
                    >
                        <AnimatePresence initial={false}>
                            {categories.map((cat) => (
                                <CategoryItem
                                    key={cat.id}
                                    cat={cat}
                                    editingId={editingId}
                                    editingName={editingName}
                                    setEditingName={setEditingName}
                                    setEditingId={setEditingId}
                                    handleUpdate={handleUpdate}
                                    handleDelete={handleDelete}
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
                                    Are you certain you wish to permanently terminate this category? Certificates utilizing it may need manual reassignment.
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

// Extracted for performance: Only re-renders moving item
interface CategoryItemProps {
    cat: Category;
    editingId: string | null;
    editingName: string;
    setEditingName: (name: string) => void;
    setEditingId: (id: string | null) => void;
    handleUpdate: (id: string) => void;
    handleDelete: (id: string) => void;
}

const CategoryItem = memo(function CategoryItemComponent({
    cat,
    editingId,
    editingName,
    setEditingName,
    setEditingId,
    handleUpdate,
    handleDelete
}: CategoryItemProps) {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={cat}
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
            className="group bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-5 flex items-center justify-between shadow-lg cursor-default"
        >
            {editingId === cat.id ? (
                <div className="flex-1 flex gap-3 mr-4">
                    <input
                        autoFocus
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdate(cat.id);
                            if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="flex-1 px-4 py-2 bg-[var(--background)]/50 border border-blue-500/50 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                    <button
                        onClick={() => handleUpdate(cat.id)}
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
            ) : (
                <>
                    <div className="flex items-center gap-4">
                        <div
                            onPointerDown={(e) => dragControls.start(e)}
                            className="p-2 text-[var(--foreground)]/20 cursor-grab active:cursor-grabbing hover:text-blue-500 transition-colors"
                        >
                            <GripVertical size={20} />
                        </div>
                        <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                            <Award size={20} />
                        </div>
                        <span className="text-lg font-black tracking-tight uppercase select-none">{cat.name}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEditingId(cat.id);
                                setEditingName(cat.name);
                            }}
                            className="p-3 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)]/50 hover:text-blue-500 rounded-xl transition-all border border-[var(--border)]"
                        >
                            <Edit3 size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-3 bg-red-500/5 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 rounded-xl transition-all border border-red-500/10"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </>
            )}
        </Reorder.Item>
    );
});
