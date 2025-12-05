"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Github, Facebook, MapPin, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
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
    }>({ type: null, message: '' });
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate captcha
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
                setSubmitStatus({
                    type: 'success',
                    message: 'Message sent successfully! I\'ll get back to you soon.',
                });
                setFormData({ name: '', email: '', subject: '', message: '' });
                setCaptchaToken(null);

                if (data.mailtoLink) {
                    window.location.href = data.mailtoLink;
                }
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: data.error || 'Failed to send message. Please try again.',
                });
                setCaptchaToken(null);
            }
        } catch {
            setSubmitStatus({
                type: 'error',
                message: 'An error occurred. Please try emailing me directly.',
            });
            setCaptchaToken(null);
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
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)]">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            </div>

            {/* Floating Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 100, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
                />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-24 py-24">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium bg-[var(--card-bg)]/80 backdrop-blur-sm border border-[var(--accent-blue)]/30 rounded-full shadow-lg">
                        <Sparkles size={16} className="text-[var(--accent-blue)]" />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Let&apos;s Connect
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Get In Touch
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed">
                        Have a project in mind or just want to chat? I&apos;d love to hear from you!
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Contact Information Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        {/* Contact Info Card */}
                        <div className="bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-8 border border-[var(--border)] shadow-xl">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                                Contact Information
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                        <Mail className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--foreground)] mb-1">Email</h3>
                                        <a
                                            href="mailto:wiraphat.makwong@gmail.com"
                                            className="text-[var(--foreground-muted)] hover:text-[var(--accent-blue)] transition-colors text-sm"
                                        >
                                            wiraphat.makwong@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                        <MapPin className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--foreground)] mb-1">Location</h3>
                                        <p className="text-[var(--foreground-muted)] text-sm">Thailand</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-gradient-to-br from-pink-500 to-blue-500 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                                        <Facebook className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--foreground)] mb-1">Facebook</h3>
                                        <a
                                            href="https://www.facebook.com/wiraphat.makwong"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[var(--foreground-muted)] hover:text-[var(--accent-blue)] transition-colors text-sm"
                                        >
                                            Wiraphat Makwong
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mt-8 pt-8 border-t border-[var(--border)]">
                                <h3 className="font-semibold text-[var(--foreground)] mb-4">Follow Me</h3>
                                <div className="flex gap-3">
                                    <a
                                        href="https://github.com/zPleum"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-[var(--muted)] rounded-xl hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all hover:scale-110"
                                    >
                                        <Github size={20} />
                                    </a>
                                    <a
                                        href="https://www.facebook.com/wiraphat.makwong"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-[var(--muted)] rounded-xl hover:bg-[#1877F2] hover:text-white transition-all hover:scale-110"
                                    >
                                        <Facebook size={20} />
                                    </a>
                                    <a
                                        href="https://discord.com/users/837918998242656267"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-[var(--muted)] rounded-xl hover:bg-[#5865F2] hover:text-white transition-all hover:scale-110"
                                    >
                                        <MessageCircle size={20} />
                                    </a>
                                    <a
                                        href="mailto:wiraphat.makwong@gmail.com"
                                        className="p-3 bg-[var(--muted)] rounded-xl hover:bg-[var(--accent-blue)] hover:text-white transition-all hover:scale-110"
                                    >
                                        <Mail size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Availability Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="rounded-2xl p-6 border shadow-xl"
                            style={{
                                background: 'linear-gradient(to bottom right, var(--availability-bg-from), var(--availability-bg-to))',
                                borderColor: 'var(--availability-border)'
                            }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="relative">
                                    <span className="w-3 h-3 bg-green-500 rounded-full block animate-pulse"></span>
                                    <span className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping"></span>
                                </div>
                                <span className="font-bold" style={{ color: 'var(--availability-text)' }}>Available for Work</span>
                            </div>
                            <p className="text-sm" style={{ color: 'var(--availability-text-muted)' }}>
                                I&apos;m currently available for freelance projects and full-time opportunities.
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-[var(--border)] shadow-xl">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
                                Send Me a Message
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] focus:border-[var(--accent-blue)] focus:outline-none transition-all bg-[var(--background)] text-[var(--foreground)]"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                                            Your Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] focus:border-[var(--accent-blue)] focus:outline-none transition-all bg-[var(--background)] text-[var(--foreground)]"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] focus:border-[var(--accent-blue)] focus:outline-none transition-all bg-[var(--background)] text-[var(--foreground)]"
                                        placeholder="Project Inquiry"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-[var(--foreground)] mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] focus:border-[var(--accent-blue)] focus:outline-none transition-all resize-none bg-[var(--background)] text-[var(--foreground)]"
                                        placeholder="Tell me about your project..."
                                    />
                                </div>

                                {/* Cloudflare Turnstile Captcha */}
                                <TurnstileCaptcha
                                    onSuccess={(token) => setCaptchaToken(token)}
                                    onError={() => setCaptchaToken(null)}
                                    onExpire={() => setCaptchaToken(null)}
                                />

                                {submitStatus.type && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl flex items-center gap-3 border-2"
                                        style={{
                                            backgroundColor: submitStatus.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)',
                                            color: submitStatus.type === 'success' ? 'var(--success-text)' : 'var(--error-text)',
                                            borderColor: submitStatus.type === 'success' ? 'var(--success-border)' : 'var(--error-border)'
                                        }}
                                    >
                                        {submitStatus.type === 'success' && <CheckCircle2 size={20} />}
                                        <span className="font-medium">{submitStatus.message}</span>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Contact Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-7xl mx-auto"
                >
                    <a
                        href="mailto:wiraphat.makwong@gmail.com"
                        className="group bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-8 border border-[var(--border)] hover:shadow-2xl hover:scale-105 transition-all text-center"
                    >
                        <div className="inline-flex p-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                            <Mail className="text-white" size={32} />
                        </div>
                        <h3 className="font-bold text-[var(--foreground)] mb-2 text-lg">Email Me</h3>
                        <p className="text-sm text-[var(--foreground-muted)]">Quick response guaranteed</p>
                    </a>

                    <a
                        href="https://www.facebook.com/wiraphat.makwong"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-8 border border-[var(--border)] hover:shadow-2xl hover:scale-105 transition-all text-center"
                    >
                        <div className="inline-flex p-5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                            <Facebook className="text-white" size={32} />
                        </div>
                        <h3 className="font-bold text-[var(--foreground)] mb-2 text-lg">Facebook</h3>
                        <p className="text-sm text-[var(--foreground-muted)]">Connect on social media</p>
                    </a>

                    <a
                        href="https://github.com/zPleum"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-8 border border-[var(--border)] hover:shadow-2xl hover:scale-105 transition-all text-center"
                    >
                        <div className="inline-flex p-5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                            <Github className="text-white" size={32} />
                        </div>
                        <h3 className="font-bold text-[var(--foreground)] mb-2 text-lg">GitHub</h3>
                        <p className="text-sm text-[var(--foreground-muted)]">Check out my work</p>
                    </a>
                </motion.div>
            </main>
        </div>
    );
}
