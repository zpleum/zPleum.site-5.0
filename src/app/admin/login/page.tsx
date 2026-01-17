'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail, ShieldCheck, Sparkles, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [totpCode, setTotpCode] = useState('');
    const [backupCode, setBackupCode] = useState('');
    const [requires2FA, setRequires2FA] = useState(false);
    const [useBackupCode, setUseBackupCode] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    ...(totpCode && { totpCode }),
                    ...(backupCode && { backupCode }),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.requires2FA) {
                    setRequires2FA(true);
                    setError('');
                } else {
                    setError(data.error || 'Login failed');
                }
                setLoading(false);
                return;
            }

            // Success - redirect to dashboard
            router.push('/admin/dashboard');
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px]"></div>
            </div>

            <main className="relative z-10 w-full max-w-lg">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-blue-500 hover:gap-4 transition-all uppercase tracking-widest">
                        <ArrowLeft size={16} /> Public Gateway
                    </Link>
                </div>

                <div className="bg-[var(--card-bg)]/80 backdrop-blur-2xl rounded-[2.5rem] p-10 md:p-14 border border-[var(--border)] shadow-2xl relative overflow-hidden group">
                    {/* Decorative Border Glow */}
                    <div className="absolute inset-0 border border-blue-500/20 group-hover:border-blue-500/40 transition-colors pointer-events-none rounded-[2.5rem]"></div>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-xs font-bold bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-500 uppercase tracking-widest mx-auto">
                            <Sparkles size={14} />
                            <span>Restricted Access</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 leading-none">
                            ADMIN <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">PORTAL</span>
                        </h1>
                        <p className="text-[var(--foreground-muted)] font-medium">Verify your credentials to architect</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {!requires2FA ? (
                            <>
                                <div className="space-y-3">
                                    <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-[var(--foreground)] opacity-50 ml-1">
                                        Admin Identity
                                    </label>
                                    <div className="relative flex items-center">
                                        <Mail className={`absolute left-6 transition-colors ${email ? 'text-blue-500 opacity-100' : 'text-[var(--foreground)] opacity-30'}`} size={20} />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-16 pr-6 py-4 rounded-2xl border border-[var(--border)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all bg-[var(--muted)]/30 focus:bg-[var(--card-bg)] text-[var(--foreground)] font-bold placeholder:opacity-30"
                                            placeholder="identity@zpleum.site"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-[var(--foreground)] opacity-50 ml-1">
                                        Access Key
                                    </label>
                                    <div className="relative flex items-center">
                                        <Lock className={`absolute left-6 transition-colors ${password ? 'text-blue-500 opacity-100' : 'text-[var(--foreground)] opacity-30'}`} size={20} />
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full pl-16 pr-14 py-4 rounded-2xl border border-[var(--border)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all bg-[var(--muted)]/30 focus:bg-[var(--card-bg)] text-[var(--foreground)] font-bold placeholder:opacity-30"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={`absolute right-5 p-2 transition-all ${password ? 'text-blue-500 opacity-100' : 'text-[var(--foreground)] opacity-30 hover:opacity-100'}`}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-6">
                                {!useBackupCode ? (
                                    <>
                                        <div className="space-y-3">
                                            <label htmlFor="totpCode" className="block text-xs font-black uppercase tracking-widest text-[var(--foreground)] opacity-50 text-center">
                                                Authenticator Verification
                                            </label>
                                            <div className="relative flex items-center">
                                                <ShieldCheck className="absolute left-6 text-blue-500" size={20} />
                                                <input
                                                    id="totpCode"
                                                    type="text"
                                                    value={totpCode}
                                                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    required
                                                    maxLength={6}
                                                    className="w-full pl-16 pr-6 py-5 rounded-2xl border border-blue-500/30 text-center text-3xl font-black tracking-[0.5em] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all bg-blue-500/5 text-blue-500 placeholder:opacity-20"
                                                    placeholder="000000"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setUseBackupCode(true)}
                                            className="w-full text-sm font-bold text-[var(--foreground-muted)] hover:text-blue-500 transition-colors uppercase tracking-widest"
                                        >
                                            Use Emergency Backup Key
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            <label htmlFor="backupCode" className="block text-xs font-black uppercase tracking-widest text-[var(--foreground)] opacity-50 text-center">
                                                Emergency Access Key
                                            </label>
                                            <input
                                                id="backupCode"
                                                type="text"
                                                value={backupCode}
                                                onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                                                required
                                                className="w-full px-6 py-5 rounded-2xl border border-purple-500/30 text-center text-2xl font-black tracking-widest focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all bg-purple-500/5 text-purple-500 placeholder:opacity-20"
                                                placeholder="XXXXXXXX"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setUseBackupCode(false)}
                                            className="w-full text-sm font-bold text-[var(--foreground-muted)] hover:text-blue-500 transition-colors uppercase tracking-widest"
                                        >
                                            Return to Authenticator
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-black uppercase tracking-widest text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-4 px-10 py-5 bg-[var(--foreground)] text-[var(--background)] font-black rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                        >
                            {loading ? 'TRANSMITTING...' : requires2FA ? 'INITIALIZE ACCESS' : 'DISPATCH CREDENTIALS'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
