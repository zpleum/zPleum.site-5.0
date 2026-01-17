"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Sparkles,
    FolderGit2,
    Link as LinkIcon,
    Github,
    Layout,
    CheckCircle2,
    Info,
    RefreshCw,
    Image as ImageIcon,
    Upload,
    Cloud,
    Trash2,
    Star,
    Plus,
    X,
    Terminal,
    Cpu,
    Globe,
    Code,
    Database,
    ChevronDown
} from 'lucide-react';
import ImageUploadZone from '@/components/admin/ImageUploadZone';

const iconMap: Record<string, any> = {
    Terminal,
    Cpu,
    Globe,
    Code,
    Database,
    Cloud,
    FolderGit2
};

// Categories will be fetched from the database

export default function EditProjectPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        images: [] as string[],
        project_url: '',
        github_url: '',
        technologies: '',
        category: 'Web App',
        featured: false,
    });

    useEffect(() => {
        if (id) {
            fetchProject();
            fetchCategories();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch (err) {
            console.error('Fetch categories error:', err);
        }
    };

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/admin/projects/${id}`);
            if (response.ok) {
                const data = await response.json();
                const project = data.project;

                // Parse existing images
                let parsedImages: string[] = [];
                if (Array.isArray(project.images)) {
                    parsedImages = project.images;
                } else if (typeof project.images === 'string') {
                    try {
                        parsedImages = JSON.parse(project.images);
                    } catch (e) {
                        parsedImages = [];
                    }
                }

                // Ensure legacy image_url is included in the gallery if images array is empty
                if (parsedImages.length === 0 && project.image_url) {
                    parsedImages.push(project.image_url);
                }

                setFormData({
                    title: project.title || '',
                    description: project.description || '',
                    image_url: project.image_url || '',
                    images: parsedImages,
                    project_url: project.project_url || '',
                    github_url: project.github_url || '',
                    technologies: Array.isArray(project.technologies)
                        ? project.technologies.join(', ')
                        : (typeof project.technologies === 'string' ? JSON.parse(project.technologies).join(', ') : ''),
                    category: project.category || 'Web App',
                    featured: !!project.featured,
                });
            } else {
                setError('Failed to fetch project details.');
            }
        } catch (err) {
            console.error('Error fetching project:', err);
            setError('An error occurred while loading project.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const technologiesArray = formData.technologies
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            // Ensure image_url matches one of the images if possible, or is explicitly set
            // If images exist but no image_url, set the first one
            let finalImageUrl = formData.image_url;
            if (!finalImageUrl && formData.images.length > 0) {
                finalImageUrl = formData.images[0];
            }

            const response = await fetch(`/api/admin/projects/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    image_url: finalImageUrl,
                    technologies: technologiesArray,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to update project');
                setSaving(false);
                return;
            }

            router.push('/admin/dashboard/projects');
        } catch (err) {
            setError('An error occurred. Please try again.');
            setSaving(false);
        }
    };



    const addImage = (url: string) => {
        if (!url) return;
        // Avoid duplicates
        if (formData.images.includes(url)) return;

        const newImages = [...formData.images, url];
        setFormData({
            ...formData,
            images: newImages,
            // Set as cover if it's the first image
            image_url: !formData.image_url ? url : formData.image_url
        });
        setImageUrlInput('');
    };

    const removeImage = (index: number) => {
        const newImages = [...formData.images];
        const removedUrl = newImages[index];
        newImages.splice(index, 1);

        // If we removed the cover image, set a new one
        let newCover = formData.image_url;
        if (removedUrl === formData.image_url) {
            newCover = newImages.length > 0 ? newImages[0] : '';
        }

        setFormData({
            ...formData,
            images: newImages,
            image_url: newCover
        });
    };

    const setCoverImage = (url: string) => {
        setFormData({ ...formData, image_url: url });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)]">
                <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Accessing Archive</h3>
                <p className="text-[var(--foreground-muted)] font-medium">Retrieving project matrix...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[var(--background)] overflow-x-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            </div>

            <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
                <div className="max-w-4xl mx-auto px-6 py-5">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin/dashboard/projects"
                            className="p-3 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)] hover:text-blue-500 rounded-2xl transition-all border border-[var(--border)]"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter uppercase">Modify Work</h1>
                            <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">Matrix Revision</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                <Sparkles className="text-blue-500" size={20} />
                                Work Evolution
                            </h3>

                            <div className="grid grid-cols-1 gap-8">
                                <div>
                                    <label htmlFor="title" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 ml-2">
                                        Project Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30">
                                            <Layout size={20} />
                                        </div>
                                        <input
                                            id="title"
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            className="w-full pl-14 pr-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 ml-2">
                                        Narrative Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        rows={4}
                                        className="w-full px-6 py-6 bg-[var(--background)]/50 border border-[var(--border)] rounded-3xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gallery Management Section */}
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 mt-6 border border-[var(--border)] shadow-2xl">
                            <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                <ImageIcon className="text-pink-500" size={20} />
                                Gallery Management
                            </h3>

                            <div className="space-y-8">
                                {/* Upload / Add Controls */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl p-1 w-full md:w-auto">
                                        <button
                                            type="button"
                                            onClick={() => setUploadMode('url')}
                                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${uploadMode === 'url' ? 'bg-blue-600 text-white shadow-lg' : 'text-[var(--foreground)]/40 hover:text-[var(--foreground)]'}`}
                                        >
                                            <Cloud size={14} />
                                            Link URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUploadMode('file')}
                                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${uploadMode === 'file' ? 'bg-blue-600 text-white shadow-lg' : 'text-[var(--foreground)]/40 hover:text-[var(--foreground)]'}`}
                                        >
                                            <Upload size={14} />
                                            Upload File
                                        </button>
                                    </div>

                                    <div className="flex-1">
                                        {uploadMode === 'url' ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={imageUrlInput}
                                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                    className="flex-1 px-4 py-3 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => addImage(imageUrlInput)}
                                                    disabled={!imageUrlInput}
                                                    className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="relative h-[52px]">
                                                <ImageUploadZone
                                                    onUploadComplete={addImage}
                                                    compact="minimal"
                                                    className="!py-0 h-full"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Image Grid */}
                                {formData.images.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className={`group relative aspect-video rounded-3xl overflow-hidden border-2 transition-all ${img === formData.image_url ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-[var(--border)] hover:border-[var(--foreground)]/30'}`}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />

                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                                                    {img !== formData.image_url && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setCoverImage(img)}
                                                            className="px-4 py-2 bg-white/20 hover:bg-white/40 rounded-xl text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-2 transition-all"
                                                        >
                                                            <Star size={12} />
                                                            Set as Cover
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(idx)}
                                                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/80 rounded-xl text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-2 transition-all"
                                                    >
                                                        <Trash2 size={12} />
                                                        Remove Asset
                                                    </button>
                                                </div>

                                                {img === formData.image_url && (
                                                    <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-lg z-10">
                                                        Cover Asset
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {/* Persistent Add Button / Drop Zone */}
                                        <ImageUploadZone
                                            onUploadComplete={addImage}
                                            compact={true}
                                        />
                                    </div>
                                ) : (
                                    <ImageUploadZone
                                        onUploadComplete={addImage}
                                        className="w-full"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                                <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                    <FolderGit2 className="text-purple-500" size={20} />
                                    Categorization
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="category" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 ml-2">
                                            Domain
                                        </label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                                className="w-full px-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium hover:bg-[var(--background)]/70 flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {(() => {
                                                        const selectedCat = categories.find(c => c.name === formData.category);
                                                        const IconComp = selectedCat?.icon ? iconMap[selectedCat.icon] : FolderGit2;
                                                        return <IconComp size={20} className="text-blue-500" />;
                                                    })()}
                                                    <span className="font-bold">{formData.category || 'Select Category'}</span>
                                                </div>
                                                <ChevronDown size={18} className="opacity-50" />
                                            </button>
                                            <AnimatePresence>
                                                {showCategoryDropdown && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="absolute top-full mt-2 left-0 w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto"
                                                    >
                                                        {categories.map(cat => {
                                                            const IconComp = cat.icon ? iconMap[cat.icon] : FolderGit2;
                                                            return (
                                                                <button
                                                                    key={cat.name}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFormData({ ...formData, category: cat.name });
                                                                        setShowCategoryDropdown(false);
                                                                    }}
                                                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-500/10 transition-all text-left font-bold"
                                                                >
                                                                    <IconComp size={20} className="text-blue-500" />
                                                                    <span>{cat.name}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                                        className="group relative flex items-center justify-between p-5 bg-[var(--background)]/40 border border-[var(--border)] rounded-2xl cursor-pointer hover:border-blue-500/50 transition-all overflow-hidden"
                                    >
                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className={`p-2.5 rounded-xl transition-all ${formData.featured ? 'bg-blue-500/10 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-[var(--muted)]/20 text-[var(--foreground)]/30'}`}>
                                                <Sparkles size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Featured Status</p>
                                                <p className="text-[9px] font-medium opacity-30 mt-1 uppercase tracking-[0.2em]">Priority Matrix</p>
                                            </div>
                                        </div>

                                        <div className={`relative w-12 h-6 rounded-full transition-all duration-500 ${formData.featured ? 'bg-blue-600' : 'bg-[var(--muted)]/30'}`}>
                                            <motion.div
                                                animate={{ x: formData.featured ? 26 : 4 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-xl"
                                            />
                                        </div>

                                        {formData.featured && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="absolute inset-0 bg-blue-500/5 pointer-events-none"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                                <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                    <RefreshCw className="text-green-500" size={20} />
                                    Technology Stack
                                </h3>
                                <div>
                                    <label htmlFor="technologies" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 ml-2">
                                        Stack Registry
                                    </label>
                                    <textarea
                                        id="technologies"
                                        value={formData.technologies || ''}
                                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                        className="w-full px-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium h-[160px] resize-none"
                                    />
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 px-2">
                                        <Info size={12} />
                                        <span>Use comma-separated format</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                <LinkIcon className="text-orange-500" size={20} />
                                Digital Uplinks
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label htmlFor="project_url" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 ml-2">
                                        Interface URL
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30">
                                            <LinkIcon size={18} />
                                        </div>
                                        <input
                                            id="project_url"
                                            type="url"
                                            value={formData.project_url || ''}
                                            onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                                            className="w-full pl-14 pr-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="github_url" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 ml-2">
                                        Repository Link
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30">
                                            <Github size={18} />
                                        </div>
                                        <input
                                            id="github_url"
                                            type="url"
                                            value={formData.github_url || ''}
                                            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                            className="w-full pl-14 pr-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-500 text-sm font-black uppercase tracking-widest text-center">
                                Protocol Error: {error}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-6">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-3 bg-[var(--foreground)] text-[var(--background)] hover:scale-[1.02] active:scale-[0.98] font-black uppercase tracking-widest py-6 px-10 rounded-2xl transition-all shadow-2xl disabled:opacity-50"
                            >
                                {saving ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin"></div>
                                        <span>Syncing Matrix...</span>
                                    </div>
                                ) : (
                                    <>
                                        <CheckCircle2 size={24} />
                                        <span>Consolidate Changes</span>
                                    </>
                                )}
                            </button>
                            <Link
                                href="/admin/dashboard/projects"
                                className="flex items-center justify-center bg-[var(--muted)]/20 hover:bg-[var(--muted)]/40 text-[var(--foreground)] font-black uppercase tracking-widest py-6 px-10 rounded-2xl transition-all border border-[var(--border)]"
                            >
                                Abort
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
