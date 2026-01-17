"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Globe,
    Share2,
    RefreshCw,
    CheckCircle2,
    Settings2,
    Sparkles
} from 'lucide-react';

export default function SEOProtocolsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // SEO State
    const [siteTitle, setSiteTitle] = useState('');
    const [siteDescription, setSiteDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [ogImage, setOgImage] = useState('');

    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchSEO = async () => {
            try {
                const response = await fetch('/api/admin/seo');
                if (response.ok) {
                    const data = await response.json();
                    setSiteTitle(data.seo.site_title || '');
                    setSiteDescription(data.seo.site_description || '');
                    setKeywords(data.seo.keywords || '');
                    setOgImage(data.seo.og_image || '');
                }
            } catch (error) {
                console.error('Error fetching SEO:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSEO();
    }, []);

    const handleSave = async () => {
        if (!siteTitle.trim()) {
            console.error('Site Title is required for search visibility');
            return;
        }

        setSaving(true);
        setSuccess('');

        try {
            const response = await fetch('/api/admin/seo', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    site_title: siteTitle.trim(),
                    site_description: siteDescription.trim(),
                    keywords: keywords.trim(),
                    og_image: ogImage.trim()
                }),
            });

            if (response.ok) {
                setSuccess('SEO Protocol definitions updated successfully');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                console.error('Failed to update SEO configuration');
            }
        } catch {
            console.error('Error updating SEO configuration');
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
                            className="p-3 bg-[var(--muted)]/30 hover:bg-orange-500/10 text-[var(--foreground)] hover:text-orange-500 rounded-2xl transition-all border border-[var(--border)]"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter uppercase">SEO Protocols</h1>
                            <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">Search Engine Algorithm Tuning</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="animate-spin text-orange-500 mb-4" size={32} />
                        <p className="text-[var(--foreground-muted)] font-medium uppercase tracking-widest text-xs">Calibrating Algorithms...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Title & Description Section */}
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
                                    <Globe size={20} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Search Result Appearance</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2 block">Site Title</label>
                                    <input
                                        type="text"
                                        value={siteTitle}
                                        onChange={(e) => setSiteTitle(e.target.value)}
                                        className="w-full px-6 py-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2 block">Meta Description</label>
                                    <textarea
                                        rows={3}
                                        value={siteDescription}
                                        onChange={(e) => setSiteDescription(e.target.value)}
                                        className="w-full px-6 py-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Discovery Keywords */}
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
                                    <Settings2 size={20} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Registry Keywords</h2>
                            </div>
                            <input
                                type="text"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                placeholder="keyword1, keyword2, keyword3"
                                className="w-full px-6 py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            />
                            <p className="mt-4 text-[10px] font-medium opacity-30 uppercase tracking-widest italic">Separate keywords with commas for engine classification.</p>
                        </div>

                        {/* Social Graph */}
                        <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-pink-500/10 text-pink-500 rounded-xl">
                                    <Share2 size={20} />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight">Social Graph Architecture (OpenGraph)</h2>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-2 block">Sharing Image PATH</label>
                                <input
                                    type="text"
                                    value={ogImage}
                                    onChange={(e) => setOgImage(e.target.value)}
                                    className="w-full px-6 py-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full px-8 py-6 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw className="animate-spin" size={20} />
                                        <span>Synchronizing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        <span>Apply SEO Protocols</span>
                                    </>
                                )}
                            </button>

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
