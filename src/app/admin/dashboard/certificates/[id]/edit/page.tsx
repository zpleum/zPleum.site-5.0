"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Sparkles,
    Award,
    Calendar,
    Link as LinkIcon,
    CheckCircle2,
    RefreshCw,
    BadgeCheck,
    Image as ImageIcon,
    Upload,
    Cloud,
    Trash2,
    HardDrive,
    ChevronDown,
    ChevronUp,
    Download,
    ImagePlus,
    Star
} from 'lucide-react';
import ImageUploadZone from '@/components/admin/ImageUploadZone';

export default function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [r2Images, setR2Images] = useState<Array<{ key: string; url: string; size: number; lastModified: Date }>>([]);
    const [loadingR2, setLoadingR2] = useState(false);
    const [showR2Panel, setShowR2Panel] = useState(false);
    const [deletingR2, setDeletingR2] = useState<string | null>(null);
    const [showDeleteR2Modal, setShowDeleteR2Modal] = useState(false);
    const [selectedR2Image, setSelectedR2Image] = useState<string | null>(null);

    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        date: '',
        credential_url: '',
        image_url: '',
        images: [] as string[],
        skills: '',
        featured: false,
        category: '',
    });

    useEffect(() => {
        fetch('/api/admin/certificate-categories')
            .then(res => res.json())
            .then(data => {
                setCategories(data.categories || []);
            })
            .catch(err => console.error('Fetch categories error:', err));
    }, []);

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const response = await fetch(`/api/admin/certificates/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    const cert = data.certificate;

                    let skillsStr = '';
                    if (cert.skills) {
                        try {
                            const skillsArr = typeof cert.skills === 'string' ? JSON.parse(cert.skills) : cert.skills;
                            if (Array.isArray(skillsArr)) {
                                skillsStr = skillsArr.join(', ');
                            }
                        } catch (e) {
                            console.error("Error parsing skills", e);
                        }
                    }

                    let imagesArr: string[] = [];
                    if (cert.images) {
                        try {
                            const rawImages = typeof cert.images === 'string' ? JSON.parse(cert.images) : cert.images;
                            if (Array.isArray(rawImages)) {
                                // Deduplicate fetched images immediately
                                imagesArr = Array.from(new Set(rawImages));
                            }
                        } catch (e) {
                            console.error("Error parsing images", e);
                        }
                    }

                    setFormData({
                        title: cert.title,
                        issuer: cert.issuer,
                        date: cert.date,
                        credential_url: cert.credential_url || '',
                        image_url: cert.image_url || '',
                        images: imagesArr,
                        skills: skillsStr,
                        featured: !!cert.featured,
                        category: cert.category || 'Certification',
                    });
                } else {
                    setError('Failed to fetch certificate details');
                }
            } catch {
                setError('Error connecting to server');
            } finally {
                setFetching(false);
            }
        };

        fetchCertificate();
    }, [id]);



    const addImage = (url: string) => {
        if (!url) return;

        setFormData(prev => {
            // Avoid duplicates
            if (prev.images.includes(url)) return prev;

            return {
                ...prev,
                images: [...prev.images, url],
                // Set as cover if it's the first image
                image_url: !prev.image_url ? url : prev.image_url
            };
        });
        setImageUrlInput('');
    };

    const removeImage = (index: number) => {
        setFormData(prev => {
            const newImages = [...prev.images];
            const removedUrl = newImages[index];
            newImages.splice(index, 1);

            // If we removed the cover image, set a new one
            let newCover = prev.image_url;
            if (removedUrl === prev.image_url) {
                newCover = newImages.length > 0 ? newImages[0] : '';
            }

            return {
                ...prev,
                images: newImages,
                image_url: newCover
            };
        });
    };

    const setCoverImage = (url: string) => {
        setFormData(prev => ({ ...prev, image_url: url }));
    };

    const fetchR2Images = async () => {
        setLoadingR2(true);
        try {
            const response = await fetch('/api/admin/projects/list-images');
            if (response.ok) {
                const data = await response.json();
                setR2Images(data.images || []);
            }
        } catch (err) {
            console.error('Failed to fetch R2 images:', err);
        } finally {
            setLoadingR2(false);
        }
    };

    const deleteR2Image = async (url: string) => {
        setDeletingR2(url);
        try {
            await fetch('/api/admin/projects/upload/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            await fetchR2Images();
            setShowDeleteR2Modal(false);
            setSelectedR2Image(null);
        } catch (err) {
            console.error('Failed to delete R2 image:', err);
        } finally {
            setDeletingR2(null);
        }
    };

    const downloadImage = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const skillsArray = formData.skills
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            const response = await fetch(`/api/admin/certificates/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    images: formData.images, // Include images array
                    skills: skillsArray,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || 'Failed to update certificate');
                setLoading(false);
                return;
            }

            router.push('/admin/dashboard/certificates');
        } catch {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
                            href="/admin/dashboard/certificates"
                            className="p-3 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)] hover:text-blue-500 rounded-2xl transition-all border border-[var(--border)]"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter uppercase">Edit Certificate</h1>
                            <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">Credential Management</p>
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
                                Certificate Details
                            </h3>

                            <div className="grid grid-cols-1 gap-8">




                                <div>
                                    <label htmlFor="title" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 ml-2">
                                        Certificate Title
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30">
                                            <Award size={20} />
                                        </div>
                                        <input
                                            id="title"
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            className="w-full pl-14 pr-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                            placeholder="e.g. AWS Certified Solutions Architect"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="category" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 ml-2">
                                            Category
                                        </label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                                className="w-full px-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium hover:bg-[var(--background)]/70 flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <BadgeCheck size={20} className="text-blue-500" />
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
                                                        {categories.map(cat => (
                                                            <button
                                                                key={cat.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData({ ...formData, category: cat.name });
                                                                    setShowCategoryDropdown(false);
                                                                }}
                                                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-500/10 transition-all text-left font-bold"
                                                            >
                                                                <Award size={20} className="text-blue-500" />
                                                                <span>{cat.name}</span>
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="issuer" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 ml-2">
                                            Issuing Organization
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30">
                                                <BadgeCheck size={20} />
                                            </div>
                                            <input
                                                id="issuer"
                                                type="text"
                                                value={formData.issuer}
                                                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                                required
                                                className="w-full pl-14 pr-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                                placeholder="e.g. Amazon Web Services"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="date" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 ml-2">
                                            Issue Date
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30">
                                                <Calendar size={20} />
                                            </div>
                                            <input
                                                id="date"
                                                type="text"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                required
                                                className="w-full pl-14 pr-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                                placeholder="e.g. Dec 2025"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Asset Management */}
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                <ImageIcon className="text-pink-500" size={20} />
                                Gallery Management
                            </h3>

                            <div className="space-y-8">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl p-1 w-full md:w-auto self-start">
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
                                                    placeholder="https://example.com/certificate.jpg"
                                                    className="flex-1 px-4 py-3 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => addImage(imageUrlInput)}
                                                    disabled={!imageUrlInput}
                                                    className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                                >
                                                    Set
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

                                {formData.images.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className={`group relative aspect-video rounded-3xl overflow-hidden border-2 transition-all ${img === formData.image_url ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-[var(--border)] hover:border-blue-500/50'}`}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={img} alt={`Certificate Preview ${idx}`} className="w-full h-full object-cover" />

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
                                        {/* Persistent Add Button / Drop Zone in Grid */}
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

                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                <RefreshCw className="text-green-500" size={20} />
                                Skills & Validation
                            </h3>

                            <div className="space-y-8">
                                <div>
                                    <label htmlFor="skills" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 ml-2">
                                        Relevant Skills (Comma Separated)
                                    </label>
                                    <textarea
                                        id="skills"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        className="w-full px-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none h-[120px]"
                                        placeholder="Cloud Computing, System Design, Security..."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="credential_url" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 ml-2">
                                        Credential URL
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30">
                                            <LinkIcon size={18} />
                                        </div>
                                        <input
                                            id="credential_url"
                                            type="url"
                                            value={formData.credential_url}
                                            onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                                            className="w-full pl-14 pr-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                            placeholder="https://aws.amazon.com/verify/..."
                                        />
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
                                            <p className="text-[9px] font-medium opacity-30 mt-1 uppercase tracking-[0.2em]">Priority Display</p>
                                        </div>
                                    </div>

                                    <div className={`relative w-12 h-6 rounded-full transition-all duration-500 ${formData.featured ? 'bg-blue-600' : 'bg-[var(--muted)]/30'}`}>
                                        <motion.div
                                            animate={{ x: formData.featured ? 26 : 4 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* R2 Storage Management */}
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowR2Panel(!showR2Panel);
                                    if (!showR2Panel) fetchR2Images();
                                }}
                                className="w-full flex items-center justify-between mb-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                                        <HardDrive size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-xl font-black uppercase tracking-tight">R2 Storage Management</h2>
                                        <p className="text-xs text-[var(--foreground-muted)] font-medium mt-1">
                                            Manage central asset repository
                                        </p>
                                    </div>
                                </div>
                                {showR2Panel ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            {showR2Panel && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-[var(--foreground-muted)] font-medium">
                                            {r2Images.length} image{r2Images.length !== 1 ? 's' : ''} in storage
                                        </p>
                                    </div>

                                    {loadingR2 ? (
                                        <div className="flex items-center justify-center py-12">
                                            <RefreshCw className="animate-spin text-blue-500" size={24} />
                                        </div>
                                    ) : r2Images.length === 0 ? (
                                        <div className="text-center py-12 text-[var(--foreground-muted)]">
                                            <HardDrive size={48} className="mx-auto mb-4 opacity-20" />
                                            <p className="font-medium">No images found in R2 storage</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {r2Images.map((img) => (
                                                <div
                                                    key={img.key}
                                                    className="group relative aspect-square rounded-2xl overflow-hidden border border-[var(--border)] hover:border-blue-500/50 transition-all"
                                                >
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={img.url} alt="Project" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm p-3">
                                                        <p className="text-white text-[10px] font-bold mb-1">
                                                            {(img.size / 1024).toFixed(1)} KB
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => addImage(img.url)}
                                                            className="w-full px-2 py-1.5 bg-purple-500/20 hover:bg-purple-500/80 rounded-lg text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-md flex items-center justify-center gap-1.5 transition-all"
                                                        >
                                                            <Star size={10} />
                                                            Use as Asset
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => downloadImage(img.url, img.key.split('/').pop() || 'image.jpg')}
                                                            className="w-full px-2 py-1.5 bg-green-500/20 hover:bg-green-500/80 rounded-lg text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-md flex items-center justify-center gap-1.5 transition-all"
                                                        >
                                                            <Download size={10} />
                                                            Download
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedR2Image(img.url);
                                                                setShowDeleteR2Modal(true);
                                                            }}
                                                            disabled={deletingR2 === img.url}
                                                            className="w-full px-2 py-1.5 bg-red-500/20 hover:bg-red-500/80 rounded-lg text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-md flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                                                        >
                                                            {deletingR2 === img.url ? (
                                                                <RefreshCw size={10} className="animate-spin" />
                                                            ) : (
                                                                <Trash2 size={10} />
                                                            )}
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-500 text-sm font-black uppercase tracking-widest text-center"
                            >
                                Protocol Error: {error}
                            </motion.div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-3 bg-[var(--foreground)] text-[var(--background)] hover:scale-[1.02] active:scale-[0.98] font-black uppercase tracking-widest py-6 px-10 rounded-2xl transition-all shadow-2xl disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin"></div>
                                        <span>Saving Changes...</span>
                                    </div>
                                ) : (
                                    <>
                                        <CheckCircle2 size={24} />
                                        <span>Update Record</span>
                                    </>
                                )}
                            </button>
                            <Link
                                href="/admin/dashboard/certificates"
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
