"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail, Sparkles, UserPlus, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminRegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Registration failed');
                setLoading(false);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/admin/login');
            }, 2000);
        } catch {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px]"></div>
            </div>

            <main className="relative z-10 w-full max-w-lg">
                <div className="mb-8">
                    <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm font-bold text-blue-500 hover:gap-4 transition-all uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back to Entry
                    </Link>
                </div>

                <div className="bg-[var(--card-bg)]/80 backdrop-blur-2xl rounded-[2.5rem] p-10 md:p-14 border border-[var(--border)] shadow-2xl relative overflow-hidden group">
                    {/* Decorative Border Glow */}
                    <div className="absolute inset-0 border border-purple-500/20 group-hover:border-purple-500/40 transition-colors pointer-events-none rounded-[2.5rem]"></div>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-xs font-bold bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-500 uppercase tracking-widest mx-auto">
                            <UserPlus size={14} />
                            <span>Account Creation</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 leading-none">
                            ADMIN <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">SIGNUP</span>
                        </h1>
                        <p className="text-[var(--foreground-muted)] font-medium">Create your administrative identity</p>
                    </div>

                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-500/10 border border-green-500/20 rounded-[2rem] p-8 text-green-500 text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles size={32} />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Identity Initialized</h3>
                            <p className="font-bold">Redirecting to terminal entry...</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-[var(--foreground)] opacity-50 ml-1">
                                    Digital Mail
                                </label>
                                <div className="relative flex items-center">
                                    <Mail className={`absolute left-6 transition-colors ${email ? 'text-purple-500 opacity-100' : 'text-[var(--foreground)] opacity-30'}`} size={20} />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-16 pr-6 py-4 rounded-2xl border border-[var(--border)] focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all bg-[var(--muted)]/30 focus:bg-[var(--card-bg)] text-[var(--foreground)] font-bold placeholder:opacity-30"
                                        placeholder="admin@zpleum.site"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-[var(--foreground)] opacity-50 ml-1">
                                    Access Key
                                </label>
                                <div className="relative flex items-center">
                                    <Lock className={`absolute left-6 transition-colors ${password ? 'text-purple-500 opacity-100' : 'text-[var(--foreground)] opacity-30'}`} size={20} />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-16 pr-14 py-4 rounded-2xl border border-[var(--border)] focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all bg-[var(--muted)]/30 focus:bg-[var(--card-bg)] text-[var(--foreground)] font-bold placeholder:opacity-30"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute right-5 p-2 transition-all ${password ? 'text-purple-500 opacity-100' : 'text-[var(--foreground)] opacity-30 hover:opacity-100'}`}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <p className="mt-2 text-[10px] text-[var(--foreground-muted)] font-black uppercase tracking-widest text-center px-4">
                                    Must include uppercase, lowercase, number & symbol
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="confirmPassword" className="block text-xs font-black uppercase tracking-widest text-[var(--foreground)] opacity-50 ml-1">
                                    Verify Access Key
                                </label>
                                <div className="relative flex items-center">
                                    <Lock className={`absolute left-6 transition-colors ${confirmPassword ? 'text-purple-500 opacity-100' : 'text-[var(--foreground)] opacity-30'}`} size={20} />
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full pl-16 pr-14 py-4 rounded-2xl border border-[var(--border)] focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all bg-[var(--muted)]/30 focus:bg-[var(--card-bg)] text-[var(--foreground)] font-bold placeholder:opacity-30"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className={`absolute right-5 p-2 transition-all ${confirmPassword ? 'text-purple-500 opacity-100' : 'text-[var(--foreground)] opacity-30 hover:opacity-100'}`}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-black uppercase tracking-widest text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-4 px-10 py-5 bg-[var(--foreground)] text-[var(--background)] font-black rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                                >
                                    {loading ? 'INITIALIZING...' : 'CREATE IDENTITY'}
                                </button>

                                <div className="text-center">
                                    <Link href="/admin/login" className="text-xs font-black uppercase tracking-widest text-[var(--foreground-muted)] hover:text-blue-500 transition-colors">
                                        Active Identity? Enter Portal
                                    </Link>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
