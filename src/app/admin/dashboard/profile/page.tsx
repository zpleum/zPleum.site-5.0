"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    User,
    Save,
    RefreshCw,
    Image as ImageIcon,
    CheckCircle2,
    Trash2,
    ShieldAlert,
    AlertTriangle,
    Github,
    Facebook,
    MessageCircle,
    Linkedin,
    Instagram,
    Mail,
    HardDrive,
    ChevronDown,
    ChevronUp,
    Download,
    UserCircle
} from 'lucide-react';
import ImageUploadZone from '@/components/admin/ImageUploadZone';
import Image from 'next/image';

export default function ProfileSettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullName, setFullName] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [githubUrl, setGithubUrl] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [discordUrl, setDiscordUrl] = useState('');
    const [email, setEmail] = useState('');
    const [sessionUploads, setSessionUploads] = useState<string[]>([]);
    const [initialProfileImageUrl, setInitialProfileImageUrl] = useState('');
    const [r2Images, setR2Images] = useState<Array<{ key: string; url: string; size: number; lastModified: Date }>>([]);
    const [loadingR2, setLoadingR2] = useState(false);
    const [showR2Panel, setShowR2Panel] = useState(false);
    const [deletingR2, setDeletingR2] = useState<string | null>(null);
    const [showClearAllModal, setShowClearAllModal] = useState(false);
    const [showDeleteR2Modal, setShowDeleteR2Modal] = useState(false);
    const [selectedR2Image, setSelectedR2Image] = useState<string | null>(null);



    const fetchProfile = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/profile');

            // Check for auth errors
            if (response.status === 401 || response.status === 403) {
                router.push('/admin/login');
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setFullName(data.profile.full_name || '');
                setProfileImageUrl(data.profile.profile_image_url || '');
                setGithubUrl(data.profile.github_url || '');
                setLinkedinUrl(data.profile.linkedin_url || '');
                setFacebookUrl(data.profile.facebook_url || '');
                setInstagramUrl(data.profile.instagram_url || '');
                setDiscordUrl(data.profile.discord_url || '');
                setEmail(data.profile.email || '');
                setInitialProfileImageUrl(data.profile.profile_image_url || '');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSave = async () => {
        if (!fullName.trim()) {
            setError('Name is required');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/admin/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName.trim(),
                    profile_image_url: profileImageUrl,
                    email: email.trim(),
                    github_url: githubUrl.trim(),
                    linkedin_url: linkedinUrl.trim(),
                    facebook_url: facebookUrl.trim(),
                    instagram_url: instagramUrl.trim(),
                    discord_url: discordUrl.trim()
                }),
            });

            // Check for auth errors
            if (response.status === 401 || response.status === 403) {
                router.push('/admin/login');
                return;
            }

            if (response.ok) {
                setInitialProfileImageUrl(profileImageUrl);
                setSessionUploads([]); // Clear session uploads as they are now "the" image
                setSuccess('Profile updated successfully');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update profile');
            }
        } catch {
            setError('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (url: string) => {
        // Track new R2 uploads for session cleanup
        if (url.startsWith('http') && url !== initialProfileImageUrl) {
            setSessionUploads(prev => [...prev, url]);
        }
        setProfileImageUrl(url);
    };

    const handleCancel = async () => {
        if (sessionUploads.length > 0) {
            setSaving(true);
            try {
                await Promise.all(sessionUploads.map(url =>
                    fetch('/api/admin/projects/upload/delete', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url })
                    })
                ));
            } catch (err) {
                console.error('Failed to cleanup session uploads:', err);
            }
        }
        router.push('/admin/dashboard');
    };

    const fetchR2Images = async () => {
        setLoadingR2(true);
        try {
            const response = await fetch('/api/admin/profile/list-images');
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

    const clearAllR2Images = async () => {
        setLoadingR2(true);
        try {
            const urls = r2Images.map(img => img.url);
            await fetch('/api/admin/profile/bulk-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls })
            });
            await fetchR2Images();
            setShowClearAllModal(false);
        } catch (err) {
            console.error('Failed to clear R2 images:', err);
        } finally {
            setLoadingR2(false);
        }
    };

    useEffect(() => {
        if (showR2Panel) {
            fetchR2Images();
        }
    }, [showR2Panel]);

    const useAsProfile = (url: string) => {
        setProfileImageUrl(url);
        setSuccess('Profile image updated! Remember to save.');
        setTimeout(() => setSuccess(''), 3000);
    };

    const downloadImage = (url: string, filename: string) => {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleDeleteImage = async () => {
        setIsDeleting(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/admin/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profile_image_url: '/profile.png'
                }),
            });

            // Check for auth errors
            if (response.status === 401 || response.status === 403) {
                router.push('/admin/login');
                return;
            }

            if (response.ok) {
                setProfileImageUrl('/profile.png');
                setShowDeleteModal(false);
                setSuccess('Profile picture deleted');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to delete profile picture');
            }
        } catch {
            setError('Error deleting profile picture');
        } finally {
            setIsDeleting(false);
        }
    };

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
                            <h1 className="text-2xl font-black tracking-tighter uppercase">Profile Settings</h1>
                            <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">About Page Configuration</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="animate-spin text-blue-500 mb-4" size={32} />
                        <p className="text-[var(--foreground-muted)] font-medium uppercase tracking-widest text-xs">Loading Profile...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Profile Image Section */}
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                                    <ImageIcon size={20} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Profile Picture</h2>
                            </div>

                            <div className="space-y-6">
                                {/* Current Image Preview */}
                                {profileImageUrl && profileImageUrl !== '/profile.png' && (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative w-64 h-64 rounded-[2rem] overflow-hidden border-4 border-[var(--border)] shadow-xl">
                                            <Image
                                                src={profileImageUrl}
                                                alt="Profile"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteModal(true)}
                                            disabled={saving}
                                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-red-500/20 hover:border-red-500/40 disabled:opacity-50"
                                        >
                                            <Trash2 size={16} />
                                            Delete Picture
                                        </button>
                                    </div>
                                )}

                                {/* Image Upload Zone */}
                                <ImageUploadZone
                                    onUploadComplete={handleImageUpload}
                                    uploadEndpoint="/api/admin/profile/upload"
                                    className="w-full"
                                />

                                <p className="text-xs text-[var(--foreground-muted)] text-center font-medium">
                                    Upload a new image or paste an image URL
                                </p>
                            </div>
                        </div>

                        {/* Name Section */}
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                                    <User size={20} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Full Name</h2>
                            </div>

                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full px-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium shadow-xl"
                            />
                        </div>

                        {/* Social Links Section */}
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <h2 className="text-xl font-black uppercase tracking-tight mb-8">Social Media Links</h2>

                            <div className="space-y-6">
                                {/* GitHub */}
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Github size={18} className="text-blue-500" />
                                        <label className="text-sm font-bold uppercase tracking-widest opacity-60">GitHub</label>
                                    </div>
                                    <input
                                        type="url"
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        placeholder="https://github.com/username"
                                        className="w-full px-6 py-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>

                                {/* LinkedIn */}
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Linkedin size={18} className="text-blue-600" />
                                        <label className="text-sm font-bold uppercase tracking-widest opacity-60">LinkedIn</label>
                                    </div>
                                    <input
                                        type="url"
                                        value={linkedinUrl}
                                        onChange={(e) => setLinkedinUrl(e.target.value)}
                                        placeholder="https://linkedin.com/in/username"
                                        className="w-full px-6 py-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>

                                {/* Facebook */}
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Facebook size={18} className="text-pink-500" />
                                        <label className="text-sm font-bold uppercase tracking-widest opacity-60">Facebook</label>
                                    </div>
                                    <input
                                        type="url"
                                        value={facebookUrl}
                                        onChange={(e) => setFacebookUrl(e.target.value)}
                                        placeholder="https://facebook.com/username"
                                        className="w-full px-6 py-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>

                                {/* Instagram */}
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Instagram size={18} className="text-pink-600" />
                                        <label className="text-sm font-bold uppercase tracking-widest opacity-60">Instagram</label>
                                    </div>
                                    <input
                                        type="url"
                                        value={instagramUrl}
                                        onChange={(e) => setInstagramUrl(e.target.value)}
                                        placeholder="https://instagram.com/username"
                                        className="w-full px-6 py-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>

                                {/* Discord */}
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <MessageCircle size={18} className="text-purple-500" />
                                        <label className="text-sm font-bold uppercase tracking-widest opacity-60">Discord</label>
                                    </div>
                                    <input
                                        type="url"
                                        value={discordUrl}
                                        onChange={(e) => setDiscordUrl(e.target.value)}
                                        placeholder="https://discord.com/users/123456789"
                                        className="w-full px-6 py-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Mail size={18} className="text-green-500" />
                                        <label className="text-sm font-bold uppercase tracking-widest opacity-60">Email</label>
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@example.com"
                                        className="w-full px-6 py-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* R2 Storage Management */}
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <button
                                type="button"
                                onClick={() => setShowR2Panel(!showR2Panel)}
                                className="w-full flex items-center justify-between mb-6"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                                        <HardDrive size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-xl font-black uppercase tracking-tight">R2 Storage Management</h2>
                                        <p className="text-xs text-[var(--foreground-muted)] font-medium mt-1">
                                            Manage orphaned profile images
                                        </p>
                                    </div>
                                </div>
                                {showR2Panel ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            <AnimatePresence>
                                {showR2Panel && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-[var(--foreground-muted)] font-medium">
                                                {r2Images.length} image{r2Images.length !== 1 ? 's' : ''} in storage
                                            </p>
                                            {r2Images.length > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowClearAllModal(true)}
                                                    disabled={loadingR2}
                                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-red-500/20 hover:border-red-500/40 disabled:opacity-50 text-xs"
                                                >
                                                    <Trash2 size={14} />
                                                    Clear All
                                                </button>
                                            )}
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
                                                        className="group relative aspect-square rounded-2xl overflow-hidden border border-[var(--border)] hover:border-red-500/50 transition-all"
                                                    >
                                                        <Image
                                                            src={img.url}
                                                            alt="Profile"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm p-3">
                                                            <p className="text-white text-[10px] font-bold mb-1">
                                                                {(img.size / 1024).toFixed(1)} KB
                                                            </p>
                                                            <button
                                                                type="button"
                                                                onClick={() => useAsProfile(img.url)}
                                                                className="w-full px-2 py-1.5 bg-blue-500/20 hover:bg-blue-500/80 rounded-lg text-white text-[9px] font-black uppercase tracking-widest backdrop-blur-md flex items-center justify-center gap-1.5 transition-all"
                                                            >
                                                                <UserCircle size={10} />
                                                                Use as Profile
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => downloadImage(img.url, img.key.split('/').pop() || 'profile.jpg')}
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
                            </AnimatePresence>
                        </div>

                        {/* Save Button */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleSave}
                                disabled={saving || !fullName.trim()}
                                className="w-full px-8 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw className="animate-spin" size={20} />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span>Save Profile</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                className="w-full px-8 py-6 bg-[var(--muted)]/20 hover:bg-[var(--muted)]/40 text-[var(--foreground)] rounded-2xl font-black uppercase tracking-widest py-6 px-10 rounded-2xl transition-all border border-[var(--border)] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {saving && sessionUploads.length > 0 ? (
                                    <>
                                        <RefreshCw className="animate-spin" size={20} />
                                        <span>Cleaning...</span>
                                    </>
                                ) : (
                                    "Abort"
                                )}
                            </button>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-center font-black uppercase tracking-widest text-xs"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-center font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={16} />
                                    <span>{success}</span>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeleting && setShowDeleteModal(false)}
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
                                    DELETE PROFILE PICTURE
                                </h2>

                                <p className="text-[var(--foreground-muted)] text-lg font-medium mb-12 leading-relaxed">
                                    Are you certain you wish to permanently delete your profile picture? This will reset it to the default image.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-5">
                                    <button
                                        onClick={handleDeleteImage}
                                        disabled={isDeleting}
                                        className="flex-1 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-6 rounded-2xl transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {isDeleting ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Trash2 size={24} />
                                                <span>Confirm Delete</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        disabled={isDeleting}
                                        className="flex-1 bg-[var(--muted)]/20 hover:bg-[var(--muted)]/40 text-[var(--foreground)] font-black uppercase tracking-widest py-6 rounded-2xl transition-all border border-[var(--border)]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-8 opacity-10 flex items-center gap-2">
                                <AlertTriangle size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Destructive Action</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Clear All R2 Images Confirmation Modal */}
            <AnimatePresence>
                {showClearAllModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !loadingR2 && setShowClearAllModal(false)}
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
                                    CLEAR ALL IMAGES
                                </h2>

                                <p className="text-[var(--foreground-muted)] text-lg font-medium mb-12 leading-relaxed">
                                    Are you certain you wish to permanently delete all {r2Images.length} profile images from R2 storage? This action cannot be undone.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-5">
                                    <button
                                        onClick={clearAllR2Images}
                                        disabled={loadingR2}
                                        className="flex-1 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-6 rounded-2xl transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {loadingR2 ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Trash2 size={24} />
                                                <span>Confirm Delete</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setShowClearAllModal(false)}
                                        disabled={loadingR2}
                                        className="flex-1 bg-[var(--muted)]/20 hover:bg-[var(--muted)]/40 text-[var(--foreground)] font-black uppercase tracking-widest py-6 rounded-2xl transition-all border border-[var(--border)]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-8 opacity-10 flex items-center gap-2">
                                <AlertTriangle size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Destructive Action</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Single R2 Image Confirmation Modal */}
            <AnimatePresence>
                {showDeleteR2Modal && selectedR2Image && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !deletingR2 && setShowDeleteR2Modal(false)}
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
                                    DELETE IMAGE
                                </h2>

                                <p className="text-[var(--foreground-muted)] text-lg font-medium mb-12 leading-relaxed">
                                    Are you certain you wish to permanently delete this image from R2 storage? This action cannot be undone.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-5">
                                    <button
                                        onClick={() => deleteR2Image(selectedR2Image)}
                                        disabled={deletingR2 === selectedR2Image}
                                        className="flex-1 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-6 rounded-2xl transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {deletingR2 === selectedR2Image ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Trash2 size={24} />
                                                <span>Confirm Delete</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteR2Modal(false);
                                            setSelectedR2Image(null);
                                        }}
                                        disabled={deletingR2 === selectedR2Image}
                                        className="flex-1 bg-[var(--muted)]/20 hover:bg-[var(--muted)]/40 text-[var(--foreground)] font-black uppercase tracking-widest py-6 rounded-2xl transition-all border border-[var(--border)]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-8 opacity-10 flex items-center gap-2">
                                <AlertTriangle size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Destructive Action</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
