"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Mail,
    MapPin,
    Github,
    Facebook,
    MessageCircle,
    Save,
    RefreshCw,
    CheckCircle2
} from 'lucide-react';

export default function ContactInfoPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [discordUrl, setDiscordUrl] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const response = await fetch('/api/admin/contact-info');
            if (response.ok) {
                const data = await response.json();
                setEmail(data.contactInfo.email || '');
                setLocation(data.contactInfo.location || '');
                setGithubUrl(data.contactInfo.github_url || '');
                setFacebookUrl(data.contactInfo.facebook_url || '');
                setDiscordUrl(data.contactInfo.discord_url || '');
            }
        } catch (error) {
            console.error('Error fetching contact info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!email.trim() || !location.trim()) {
            setError('Email and location are required');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/admin/contact-info', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    location: location.trim(),
                    github_url: githubUrl.trim(),
                    facebook_url: facebookUrl.trim(),
                    discord_url: discordUrl.trim()
                }),
            });

            if (response.ok) {
                setSuccess('Contact information updated successfully');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update contact info');
            }
        } catch {
            setError('Error updating contact info');
        } finally {
            setSaving(false);
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
                            <h1 className="text-2xl font-black tracking-tighter uppercase">Contact Information</h1>
                            <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">Contact Page Configuration</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="animate-spin text-blue-500 mb-4" size={32} />
                        <p className="text-[var(--foreground-muted)] font-medium uppercase tracking-widest text-xs">Loading Contact Info...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Email Section */}
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                                    <Mail size={20} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Email Address</h2>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                className="w-full px-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium shadow-xl"
                            />
                        </div>

                        {/* Location Section */}
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
                                    <MapPin size={20} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Location</h2>
                            </div>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City, Country"
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
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleSave}
                                disabled={saving || !email.trim() || !location.trim()}
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
                                        <span>Save Contact Info</span>
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
        </div>
    );
}
