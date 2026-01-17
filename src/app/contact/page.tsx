"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Github, Facebook, MapPin, Send, Sparkles, CheckCircle2, ArrowLeft, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import TurnstileCaptcha from "@/components/TurnstileCaptcha";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
        mailtoLink?: string;
    }>({ type: null, message: '' });
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [captchaResetTrigger, setCaptchaResetTrigger] = useState(0);
    const [profile, setProfile] = useState({ full_name: 'Wiraphat Makwong' });
    const [contactInfo, setContactInfo] = useState({
        email: 'wiraphat.makwong@gmail.com',
        location: 'Bangkok, Thailand',
        github_url: 'https://github.com/zPleum',
        facebook_url: 'https://www.facebook.com/wiraphat.makwong',
        discord_url: 'https://discord.com/users/837918998242656267'
    });

    useEffect(() => {
        fetch('/api/profile')
            .then(res => res.json())
            .then(data => setProfile(data.profile || { full_name: 'Wiraphat Makwong' }))
            .catch(err => console.error('Error fetching profile:', err));

        fetch('/api/contact-info')
            .then(res => res.json())
            .then(data => setContactInfo(prev => data.contactInfo || prev))
            .catch(err => console.error('Error fetching contact info:', err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!captchaToken) {
            setSubmitStatus({
                type: 'error',
                message: 'Please complete the captcha verification.',
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus({ type: null, message: '' });

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, captchaToken }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.error && data.mailtoLink) {
                    // Handled case where service is not configured but we have a fallback
                    setSubmitStatus({
                        type: 'error',
                        message: data.error,
                        mailtoLink: data.mailtoLink
                    });
                } else {
                    setSubmitStatus({
                        type: 'success',
                        message: `Message sent successfully! I'll get back to you soon.`,
                    });
                    setFormData({ name: '', email: '', subject: '', message: '' });
                }
                setCaptchaToken(null);
                setCaptchaResetTrigger(prev => prev + 1);
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: data.error || 'Failed to send message. Please try again.',
                    mailtoLink: data.mailtoLink
                });
                setCaptchaToken(null);
                setCaptchaResetTrigger(prev => prev + 1);
            }
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus({
                type: 'error',
                message: 'An error occurred. Please try emailing me directly.',
            });
            setCaptchaToken(null);
            setCaptchaResetTrigger(prev => prev + 1);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
            {/* Premium Background Architecture */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent"></div>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-20">
                {/* Navigation & Label */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-3 px-6 py-3 bg-[var(--muted)]/20 hover:bg-blue-500/10 text-sm font-black uppercase tracking-widest rounded-xl border border-[var(--border)] transition-all hover:scale-105 active:scale-95"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Core Terminal
                        </Link>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                        <div>
                            <div className="inline-flex items-center gap-3 px-6 py-2 mb-6 text-sm font-black uppercase tracking-[0.3em] bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20">
                                <Sparkles size={12} className="text-blue-500" />
                                Communication Uplink
                            </div>
                            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] sm:leading-[0.8] uppercase mb-4">
                                GET IN <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                    TOUCH
                                </span>
                            </h1>
                        </div>
                        <p className="text-sm md:text-lg text-[var(--foreground-muted)] max-w-xl font-medium leading-relaxed lg:mb-4 border-l-2 border-blue-500/30 pl-5 sm:pl-6">
                            Neural uplink established. Ready for transmission of technical specifications, architectural inquiries, or strategic collaboration proposals.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Intel & Access */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[var(--card-bg)]/30 backdrop-blur-3xl rounded-[2.5rem] p-6 sm:p-10 md:p-12 border border-[var(--border)] shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <MessageCircle size={120} />
                            </div>

                            <h2 className="text-sm font-black uppercase tracking-[0.4em] mb-12 opacity-30">Access Protocols</h2>

                            <div className="space-y-10">
                                <div className="group/item">
                                    <div className="flex items-center gap-5 mb-4">
                                        <div className="p-3.5 sm:p-4 bg-blue-500/10 text-blue-500 rounded-2xl group-hover/item:scale-110 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-500">
                                            <Mail size={20} className="sm:w-[24px] sm:h-[24px]" />
                                        </div>
                                        <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">Main Channel</h3>
                                    </div>
                                    <a href={`mailto:${contactInfo.email}`} className="text-base sm:text-lg md:text-xl font-black hover:text-blue-500 transition-colors break-all">
                                        {contactInfo.email}
                                    </a>
                                </div>

                                <div className="group/item">
                                    <div className="flex items-center gap-5 mb-4">
                                        <div className="p-3.5 sm:p-4 bg-purple-500/10 text-purple-500 rounded-2xl group-hover/item:scale-110 group-hover/item:bg-purple-600 group-hover/item:text-white transition-all duration-500">
                                            <MapPin size={20} className="sm:w-[24px] sm:h-[24px]" />
                                        </div>
                                        <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">Station</h3>
                                    </div>
                                    <p className="text-base sm:text-lg font-black uppercase tracking-tight">{contactInfo.location}</p>
                                </div>

                                <div className="group/item">
                                    <div className="flex items-center gap-5 mb-4">
                                        <div className="p-3.5 sm:p-4 bg-pink-500/10 text-pink-500 rounded-2xl group-hover/item:scale-110 group-hover/item:bg-pink-600 group-hover/item:text-white transition-all duration-500">
                                            <Facebook size={20} className="sm:w-[24px] sm:h-[24px]" />
                                        </div>
                                        <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-40">Identity</h3>
                                    </div>
                                    <a href={contactInfo.facebook_url} target="_blank" className="text-base sm:text-lg font-black hover:text-pink-500 transition-colors uppercase tracking-tight">
                                        {profile.full_name}
                                    </a>
                                </div>
                            </div>

                            <div className="mt-16 pt-10 border-t border-[var(--border)]">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-10 opacity-30 text-center">Neural Networks</h3>
                                <div className="flex justify-center gap-4">
                                    {[
                                        { icon: Github, href: contactInfo.github_url, color: "hover:bg-blue-600" },
                                        { icon: Facebook, href: contactInfo.facebook_url, color: "hover:bg-pink-600" },
                                        { icon: MessageCircle, href: contactInfo.discord_url, color: "hover:bg-purple-600" }
                                    ].map((social: { icon: React.ComponentType<{ size?: number; className?: string }>; href: string; color: string }, i) => (
                                        <a
                                            key={i}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`p-4 sm:p-5 bg-[var(--muted)]/20 rounded-2xl border border-[var(--border)] transition-all hover:scale-110 hover:text-white ${social.color}`}
                                        >
                                            <social.icon size={16} className="sm:w-[20px] sm:h-[20px]" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-blue-600 rounded-[2rem] p-6 sm:p-8 text-white shadow-[0_20px_50px_rgba(37,99,235,0.3)] relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative">
                                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                                        <div className="absolute inset-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-ping opacity-50"></div>
                                    </div>
                                    <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.3em]">Status: Ready</span>
                                </div>
                                <p className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-tight italic">
                                    Available for high-impact engineering & architecture.
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <CheckCircle2 size={80} className="sm:w-[100px] sm:h-[100px]" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Transmission Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-8"
                    >
                        <div className="bg-[var(--card-bg)]/30 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 border border-[var(--border)] shadow-2xl h-full relative overflow-hidden">
                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]"></div>

                            <div className="relative z-10">
                                <h2 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase mb-8 sm:mb-12">
                                    Initialize <span className="text-blue-500">Transmission</span>
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-sm font-black uppercase tracking-[0.4em] opacity-30 ml-1">Identity</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="off"
                                                    className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] text-sm sm:text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-20"
                                                    placeholder="Input name..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-sm font-black uppercase tracking-[0.4em] opacity-30 ml-1">Digital Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                autoComplete="off"
                                                className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] text-sm sm:text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-20"
                                                placeholder="Input email..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-black uppercase tracking-[0.4em] opacity-30 ml-1">Transmission Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            autoComplete="off"
                                            className="w-full px-6 sm:px-8 py-4 sm:py-5 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] text-sm sm:text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:opacity-20"
                                            placeholder="What is this regarding?"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-black uppercase tracking-[0.4em] opacity-30 ml-1">Data Payload</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-48 sm:h-64 px-6 sm:px-8 py-5 sm:py-6 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl sm:rounded-[2rem] text-[var(--foreground)] text-sm sm:text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none placeholder:opacity-20"
                                            placeholder="Compose message..."
                                        />
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-8 pt-4">
                                        <div className="flex-1 w-full origin-left">
                                            <TurnstileCaptcha
                                                onSuccess={(token) => {
                                                    setCaptchaToken(token);
                                                }}
                                                onError={() => {
                                                    setCaptchaToken(null);
                                                }}
                                                onExpire={() => {
                                                    setCaptchaToken(null);
                                                }}
                                                resetTrigger={captchaResetTrigger}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full md:w-auto px-10 sm:px-12 py-5 sm:py-6 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_20px_40px_rgba(37,99,235,0.2)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-4 text-xs sm:text-sm"
                                        >
                                            {isSubmitting ? 'TRANSMITTING...' : 'DISPATCH'}
                                            <Send size={18} className={`sm:w-[20px] sm:h-[20px] ${isSubmitting ? 'animate-pulse' : ''}`} />
                                        </button>
                                    </div>

                                    {submitStatus.type && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`p-6 rounded-3xl flex items-center gap-4 border-2 ${submitStatus.type === 'success'
                                                ? 'bg-green-500/5 text-green-500 border-green-500/20'
                                                : 'bg-red-500/5 text-red-500 border-red-500/20'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-full ${submitStatus.type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                                {submitStatus.type === 'success' ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">Response Protocol</p>
                                                <p className="font-bold mb-2">{submitStatus.message}</p>
                                                {submitStatus.mailtoLink && (
                                                    <button
                                                        type="button"
                                                        onClick={() => window.location.href = submitStatus.mailtoLink!}
                                                        className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-lg hover:opacity-80 transition-all flex items-center gap-2"
                                                    >
                                                        <Mail size={12} />
                                                        Transmit via Local Client
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
