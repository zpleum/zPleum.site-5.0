"use client";

import { useState, useEffect } from 'react';
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
    Mail
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

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
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
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

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
                setSuccess('Profile updated successfully');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update profile');
            }
        } catch (error) {
            setError('Error updating profile');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (url: string) => {
        setProfileImageUrl(url);
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
        } catch (error) {
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
        </div>
    );
}
