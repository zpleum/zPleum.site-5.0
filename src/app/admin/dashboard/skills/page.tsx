"use client";

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import {
    ArrowLeft,
    Plus,
    Terminal,
    Cpu,
    Globe,
    Code,
    Database,
    Cloud,
    Edit3,
    Trash2,
    Save,
    X,
    RefreshCw,
    ShieldAlert,
    AlertTriangle,
    GripVertical,
    Layers
} from 'lucide-react';

const iconOptions = [
    { name: 'Terminal', component: Terminal },
    { name: 'Cpu', component: Cpu },
    { name: 'Globe', component: Globe },
    { name: 'Code', component: Code },
    { name: 'Database', component: Database },
    { name: 'Cloud', component: Cloud }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = {
Terminal,
    Cpu,
    Globe,
    Code,
    Database,
    Cloud
};

interface Skill {
    id: string;
    name: string;
    display_order: number;
}

interface SkillCategory {
    id: string;
    title: string;
    icon: string;
    color: string;
    display_order: number;
    skills: Skill[];
}

export default function SkillsPage() {
    const [categories, setCategories] = useState<SkillCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [newCategoryIcon, setNewCategoryIcon] = useState('Terminal');
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryData, setEditingCategoryData] = useState({ title: '', icon: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    // Skill management states
    const [newSkillName, setNewSkillName] = useState('');
    const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
    const [editingSkillName, setEditingSkillName] = useState('');

    // Icon selector states
    const [showIconDropdown, setShowIconDropdown] = useState(false);
    const [showEditIconDropdown, setShowEditIconDropdown] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/skills');
            if (response.ok) {
                const data = await response.json();
                setCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Error fetching skill categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryTitle.trim()) return;

        setError('');
        try {
            const response = await fetch('/api/admin/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newCategoryTitle.trim(),
                    icon: newCategoryIcon
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newCategory: SkillCategory = {
                    id: data.id,
                    title: newCategoryTitle.trim(),
                    icon: newCategoryIcon,
                    color: 'blue',
                    display_order: categories.length,
                    skills: []
                };
                setCategories([...categories, newCategory]);
                setNewCategoryTitle('');
                setNewCategoryIcon('Terminal');
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

    const handleUpdateCategory = async (id: string) => {
        if (!editingCategoryData.title.trim()) return;

        setError('');
        try {
            const response = await fetch(`/api/admin/skills/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingCategoryData),
            });

            if (response.ok) {
                setCategories(categories.map(c =>
                    c.id === id
                        ? { ...c, title: editingCategoryData.title, icon: editingCategoryData.icon }
                        : c
                ));
                setEditingCategoryId(null);
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

    const confirmDeleteCategory = async () => {
        if (!deleteCategoryId) return;

        setIsDeleting(true);
        setError('');
        try {
            const response = await fetch(`/api/admin/skills/${deleteCategoryId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCategories(categories.filter(c => c.id !== deleteCategoryId));
                setDeleteCategoryId(null);
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

    const handleReorderCategories = (newOrder: SkillCategory[]) => {
        setCategories(newOrder);
        setHasChanged(true);
    };

    useEffect(() => {
        if (!hasChanged || loading || categories.length === 0) return;

        setIsSyncing(true);

        const timer = setTimeout(async () => {
            try {
                await fetch('/api/admin/skills/reorder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: categories.map(c => c.id) }),
                });
                setHasChanged(false);
            } catch (error) {
                console.error('Failed to sync reorder:', error);
            } finally {
                setIsSyncing(false);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [categories, loading, hasChanged]);

    // Skill management functions
    const handleAddSkill = async (categoryId: string) => {
        if (!newSkillName.trim()) return;

        setError('');
        try {
            const response = await fetch(`/api/admin/skills/${categoryId}/skills`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSkillName.trim() }),
            });

            if (response.ok) {
                const data = await response.json();
                setCategories(categories.map(c => {
                    if (c.id === categoryId) {
                        return {
                            ...c,
                            skills: [...c.skills, {
                                id: data.id,
                                name: newSkillName.trim(),
                                display_order: c.skills.length
                            }]
                        };
                    }
                    return c;
                }));
                setNewSkillName('');
                setSuccess('Skill added');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to add skill');
            }
        } catch {
            setError('Error adding skill');
        }
    };

    const handleUpdateSkill = async (categoryId: string, skillId: string) => {
        if (!editingSkillName.trim()) return;

        setError('');
        try {
            const response = await fetch(`/api/admin/skills/${categoryId}/skills/${skillId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editingSkillName.trim() }),
            });

            if (response.ok) {
                setCategories(categories.map(c => {
                    if (c.id === categoryId) {
                        return {
                            ...c,
                            skills: c.skills.map(s =>
                                s.id === skillId ? { ...s, name: editingSkillName.trim() } : s
                            )
                        };
                    }
                    return c;
                }));
                setEditingSkillId(null);
                setSuccess('Skill updated');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Failed to update skill');
            }
        } catch {
            setError('Error updating skill');
        }
    };

    const handleDeleteSkill = async (categoryId: string, skillId: string) => {
        setError('');
        try {
            const response = await fetch(`/api/admin/skills/${categoryId}/skills/${skillId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCategories(categories.map(c => {
                    if (c.id === categoryId) {
                        return {
                            ...c,
                            skills: c.skills.filter(s => s.id !== skillId)
                        };
                    }
                    return c;
                }));
                setSuccess('Skill deleted');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Failed to delete skill');
            }
        } catch {
            setError('Error deleting skill');
        }
    };

    const handleReorderSkills = async (categoryId: string, newOrder: Skill[]) => {
        setCategories(categories.map(c => {
            if (c.id === categoryId) {
                return { ...c, skills: newOrder };
            }
            return c;
        }));

        try {
            await fetch(`/api/admin/skills/${categoryId}/skills/reorder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: newOrder.map(s => s.id) }),
            });
        } catch (error) {
            console.error('Failed to sync skill reorder:', error);
        }
    };

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
                                <h1 className="text-2xl font-black tracking-tighter uppercase">Skills Registry</h1>
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
                            <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">Technology Matrix</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <form onSubmit={handleAddCategory} className="flex gap-4">
                        <div className="relative flex-1">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30">
                                <Plus size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Initialize new category..."
                                value={newCategoryTitle}
                                onChange={(e) => setNewCategoryTitle(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium shadow-2xl"
                            />
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowIconDropdown(!showIconDropdown)}
                                className="px-6 py-5 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold shadow-2xl flex items-center gap-3 hover:bg-[var(--card-bg)]/70"
                            >
                                {(() => {
                                    const SelectedIcon = iconMap[newCategoryIcon];
                                    return <SelectedIcon size={20} className="text-blue-500" />;
                                })()}
                                <span>{newCategoryIcon}</span>
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
                                                        setNewCategoryIcon(icon.name);
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
                        <button
                            type="submit"
                            disabled={!newCategoryTitle.trim()}
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
                        onReorder={handleReorderCategories}
                        className="flex flex-col gap-4"
                    >
                        <AnimatePresence initial={false}>
                            {categories.map((cat) => (
                                <CategoryItem
                                    key={cat.id}
                                    cat={cat}
                                    editingCategoryId={editingCategoryId}
                                    editingCategoryData={editingCategoryData}
                                    setEditingCategoryData={setEditingCategoryData}
                                    setEditingCategoryId={setEditingCategoryId}
                                    handleUpdateCategory={handleUpdateCategory}
                                    setDeleteCategoryId={setDeleteCategoryId}
                                    expandedCategory={expandedCategory}
                                    setExpandedCategory={setExpandedCategory}
                                    newSkillName={newSkillName}
                                    setNewSkillName={setNewSkillName}
                                    handleAddSkill={handleAddSkill}
                                    editingSkillId={editingSkillId}
                                    editingSkillName={editingSkillName}
                                    setEditingSkillId={setEditingSkillId}
                                    setEditingSkillName={setEditingSkillName}
                                    handleUpdateSkill={handleUpdateSkill}
                                    handleDeleteSkill={handleDeleteSkill}
                                    handleReorderSkills={handleReorderSkills}
                                    showEditIconDropdown={showEditIconDropdown}
                                    setShowEditIconDropdown={setShowEditIconDropdown}
                                />
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                )}
            </main>

            {/* Deletion Modal */}
            <AnimatePresence>
                {deleteCategoryId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeleting && setDeleteCategoryId(null)}
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
                                    Are you certain you wish to permanently terminate this skill category and all associated skills?
                                </p>

                                <div className="flex flex-col sm:flex-row gap-5">
                                    <button
                                        onClick={confirmDeleteCategory}
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
                                        onClick={() => setDeleteCategoryId(null)}
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

const CategoryItem = memo(function CategoryItemComponent({
    cat,
    editingCategoryId,
    editingCategoryData,
    setEditingCategoryData,
    setEditingCategoryId,
    handleUpdateCategory,
    setDeleteCategoryId,
    expandedCategory,
    setExpandedCategory,
    newSkillName,
    setNewSkillName,
    handleAddSkill,
    editingSkillId,
    editingSkillName,
    setEditingSkillId,
    setEditingSkillName,
    handleUpdateSkill,
    handleDeleteSkill,
    handleReorderSkills,
    showEditIconDropdown,
    setShowEditIconDropdown
}: {
    cat: SkillCategory;
    editingCategoryId: string | null;
    editingCategoryData: { title: string; icon: string };
    setEditingCategoryData: (data: { title: string; icon: string }) => void;
    setEditingCategoryId: (id: string | null) => void;
    handleUpdateCategory: (id: string) => void;
    setDeleteCategoryId: (id: string | null) => void;
    expandedCategory: string | null;
    setExpandedCategory: (id: string | null) => void;
    newSkillName: string;
    setNewSkillName: (name: string) => void;
    handleAddSkill: (categoryId: string) => void;
    editingSkillId: string | null;
    editingSkillName: string;
    setEditingSkillId: (id: string | null) => void;
    setEditingSkillName: (name: string) => void;
    handleUpdateSkill: (categoryId: string, skillId: string) => void;
    handleDeleteSkill: (categoryId: string, skillId: string) => void;
    handleReorderSkills: (categoryId: string, newOrder: Skill[]) => void;
    showEditIconDropdown: boolean;
    setShowEditIconDropdown: (show: boolean) => void;
}) {
    const dragControls = useDragControls();
    const IconComponent = iconMap[cat.icon] || Terminal;
    const isExpanded = expandedCategory === cat.id;

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
            className="group bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg"
        >
            <div className="p-5 flex items-center justify-between">
                {editingCategoryId === cat.id ? (
                    <div className="flex-1 flex gap-3 mr-4">
                        <input
                            autoFocus
                            type="text"
                            value={editingCategoryData.title}
                            onChange={(e) => setEditingCategoryData({ ...editingCategoryData, title: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdateCategory(cat.id);
                                if (e.key === 'Escape') setEditingCategoryId(null);
                            }}
                            className="flex-1 px-4 py-2 bg-[var(--background)]/50 border border-blue-500/50 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                        />
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowEditIconDropdown(!showEditIconDropdown)}
                                className="px-4 py-2 bg-[var(--background)]/50 border border-blue-500/50 rounded-xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold flex items-center gap-2 hover:bg-[var(--background)]/70 transition-all"
                            >
                                {(() => {
                                    const SelectedIcon = iconMap[editingCategoryData.icon];
                                    return <SelectedIcon size={18} className="text-blue-500" />;
                                })()}
                                <span>{editingCategoryData.icon}</span>
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
                                                        setEditingCategoryData({ ...editingCategoryData, icon: icon.name });
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
                        <button
                            onClick={() => handleUpdateCategory(cat.id)}
                            className="p-2 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                        >
                            <Save size={18} />
                        </button>
                        <button
                            onClick={() => setEditingCategoryId(null)}
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
                                <IconComponent size={20} />
                            </div>
                            <span className="text-lg font-black tracking-tight uppercase select-none">{cat.title}</span>
                            <span className="text-xs font-black uppercase tracking-widest opacity-30">({cat.skills.length} skills)</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
                                className="p-3 bg-[var(--muted)]/30 hover:bg-purple-500/10 text-[var(--foreground)]/50 hover:text-purple-500 rounded-xl transition-all border border-[var(--border)]"
                            >
                                <Layers size={18} />
                            </button>
                            <button
                                onClick={() => {
                                    setEditingCategoryId(cat.id);
                                    setEditingCategoryData({ title: cat.title, icon: cat.icon });
                                }}
                                className="p-3 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)]/50 hover:text-blue-500 rounded-xl transition-all border border-[var(--border)]"
                            >
                                <Edit3 size={18} />
                            </button>
                            <button
                                onClick={() => setDeleteCategoryId(cat.id)}
                                className="p-3 bg-red-500/5 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 rounded-xl transition-all border border-red-500/10"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </>
                )}
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-[var(--border)] bg-[var(--background)]/30 overflow-hidden"
                    >
                        <div className="p-6 space-y-4">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Add new skill..."
                                    value={newSkillName}
                                    onChange={(e) => setNewSkillName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddSkill(cat.id);
                                        }
                                    }}
                                    className="flex-1 px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                />
                                <button
                                    onClick={() => handleAddSkill(cat.id)}
                                    disabled={!newSkillName.trim()}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest transition-all disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>

                            <Reorder.Group
                                axis="y"
                                values={cat.skills}
                                onReorder={(newOrder) => handleReorderSkills(cat.id, newOrder)}
                                className="space-y-2"
                            >
                                {cat.skills.map((skill: Skill) => (
                                    <SkillItem
                                        key={skill.id}
                                        skill={skill}
                                        categoryId={cat.id}
                                        editingSkillId={editingSkillId}
                                        editingSkillName={editingSkillName}
                                        setEditingSkillId={setEditingSkillId}
                                        setEditingSkillName={setEditingSkillName}
                                        handleUpdateSkill={handleUpdateSkill}
                                        handleDeleteSkill={handleDeleteSkill}
                                    />
                                ))}
                            </Reorder.Group>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Reorder.Item>
    );
});

// Skill Item Component
const SkillItem = memo(function SkillItemComponent({
    skill,
    categoryId,
    editingSkillId,
    editingSkillName,
    setEditingSkillId,
    setEditingSkillName,
    handleUpdateSkill,
    handleDeleteSkill
}: {
    skill: Skill;
    categoryId: string;
    editingSkillId: string | null;
    editingSkillName: string;
    setEditingSkillId: (id: string | null) => void;
    setEditingSkillName: (name: string) => void;
    handleUpdateSkill: (categoryId: string, skillId: string) => void;
    handleDeleteSkill: (categoryId: string, skillId: string) => void;
}) {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={skill}
            dragListener={false}
            dragControls={dragControls}
            className="flex items-center gap-3 p-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl group/skill"
        >
            {editingSkillId === skill.id ? (
                <>
                    <input
                        autoFocus
                        type="text"
                        value={editingSkillName}
                        onChange={(e) => setEditingSkillName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateSkill(categoryId, skill.id);
                            if (e.key === 'Escape') setEditingSkillId(null);
                        }}
                        className="flex-1 px-3 py-1 bg-[var(--background)]/50 border border-blue-500/50 rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                    <button
                        onClick={() => handleUpdateSkill(categoryId, skill.id)}
                        className="p-1.5 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                    >
                        <Save size={14} />
                    </button>
                    <button
                        onClick={() => setEditingSkillId(null)}
                        className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                        <X size={14} />
                    </button>
                </>
            ) : (
                <>
                    <div
                        onPointerDown={(e) => dragControls.start(e)}
                        className="p-1 text-[var(--foreground)]/20 cursor-grab active:cursor-grabbing hover:text-blue-500 transition-colors"
                    >
                        <GripVertical size={16} />
                    </div>
                    <span className="flex-1 font-bold text-sm">{skill.name}</span>
                    <button
                        onClick={() => {
                            setEditingSkillId(skill.id);
                            setEditingSkillName(skill.name);
                        }}
                        className="p-1.5 opacity-0 group-hover/skill:opacity-100 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)]/50 hover:text-blue-500 rounded-lg transition-all"
                    >
                        <Edit3 size={14} />
                    </button>
                    <button
                        onClick={() => handleDeleteSkill(categoryId, skill.id)}
                        className="p-1.5 opacity-0 group-hover/skill:opacity-100 bg-red-500/5 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 rounded-lg transition-all"
                    >
                        <Trash2 size={14} />
                    </button>
                </>
            )}
        </Reorder.Item>
    );
});

