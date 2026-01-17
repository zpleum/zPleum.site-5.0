"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ShieldCheck,
    ShieldAlert,
    Copy,
    Check,
    QrCode,
    Lock,
    AlertTriangle,
    Download
} from 'lucide-react';
import Image from 'next/image';

export default function TwoFactorPage() {
    const [loading, setLoading] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const [step, setStep] = useState<'overview' | 'setup' | 'verify' | 'backup'>('overview');
    const [setupData, setSetupData] = useState<{ qrCode: string; tempEncryptedSecret: string } | null>(null);
    const [totpCode, setTotpCode] = useState('');
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [password, setPassword] = useState('');
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [manualPassword, setManualPassword] = useState('');
    const [revealedSecret, setRevealedSecret] = useState('');

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setIsEnabled(data.admin.is2FAEnabled);
            }
        } catch (err) {
            console.error('Error fetching 2FA status:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartSetup = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/2fa/setup', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setSetupData(data);
                setStep('setup');
            } else {
                setError('Failed to initiate 2FA setup.');
            }
        } catch {
            setError('An error occurred during setup.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/2fa/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    totpCode,
                    encryptedSecret: setupData?.tempEncryptedSecret || ''
                })
            });

            if (res.ok) {
                const data = await res.json();
                setBackupCodes(data.backupCodes);
                setIsEnabled(true);
                setStep('backup');
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid verification code.');
            }
        } catch {
            setError('Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleDisable = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/2fa/disable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                setIsEnabled(false);
                setShowDisableModal(false);
                setStep('overview');
                setPassword('');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to disable 2FA.');
            }
        } catch {
            setError('Error disabling 2FA.');
        } finally {
            setLoading(false);
        }
    };

    const handleRevealSecret = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/2fa/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    revealSecret: true,
                    password: manualPassword
                })
            });

            if (res.ok) {
                const data = await res.json();
                setRevealedSecret(data.secret);
                setShowManualEntry(false);
                setManualPassword('');
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid password');
            }
        } catch {
            setError('Failed to reveal secret');
        } finally {
            setLoading(false);
        }
    };

    const copyBackupCodes = () => {
        navigator.clipboard.writeText(backupCodes.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadBackupCodes = () => {
        const content = `zPleum Admin - 2FA Backup Codes\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join('\n')}\n\nKeep these codes in a secure place. Each code can only be used once.`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zpleum-backup-codes-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                            <h1 className="text-2xl font-black tracking-tighter uppercase">Security Uplink</h1>
                            <p className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)] mt-1">Multi-Factor Protocol</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-20 flex flex-col min-h-[calc(100vh-5rem)]">
                {loading && step === 'overview' ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter">Scanning Protocols</h3>
                        <p className="text-[var(--foreground-muted)] font-medium">Verifying security state...</p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
                        <AnimatePresence mode="wait">
                            {step === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[3rem] p-10 md:p-14 border border-[var(--border)] shadow-2xl text-center"
                                >
                                    <div className={`w-24 h-24 mx-auto mb-10 rounded-full flex items-center justify-center ${isEnabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {isEnabled ? <ShieldCheck size={48} /> : <ShieldAlert size={48} />}
                                    </div>

                                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-6">
                                        MFA IS {isEnabled ? 'ENABLED' : 'DISABLED'}
                                    </h2>
                                    <p className="text-lg text-[var(--foreground-muted)] font-medium mb-12 leading-relaxed">
                                        {isEnabled
                                            ? 'Your administrative identity is secured by multi-factor authentication. This provides an additional layer of architectural defense.'
                                            : 'Multi-factor authentication adds a critical layer of security to your account. We highly recommend enabling this protocol.'
                                        }
                                    </p>

                                    {isEnabled ? (
                                        <button
                                            onClick={() => setShowDisableModal(true)}
                                            className="w-full py-6 px-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl"
                                        >
                                            Deactivate Protocol
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleStartSetup}
                                            className="w-full py-6 px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl hover:scale-105 active:scale-95"
                                        >
                                            Initialize MFA
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {step === 'setup' && (
                                <motion.div
                                    key="setup"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl text-center">
                                        <h3 className="text-xl font-black uppercase tracking-widest mb-10 flex items-center justify-center gap-3">
                                            <QrCode className="text-blue-500" size={24} />
                                            Setup Interface
                                        </h3>

                                        <div className="relative w-56 h-56 mx-auto mb-10 bg-white p-6 rounded-3xl shadow-2xl">
                                            <Image
                                                src={setupData?.qrCode || ''}
                                                alt="Security QR Code"
                                                fill
                                                className="object-contain p-4"
                                            />
                                        </div>

                                        <p className="text-[var(--foreground-muted)] font-medium mb-6 max-w-sm mx-auto">
                                            Scan this code with your authenticator app (Google Authenticator, Microsoft Authenticator, etc.)
                                        </p>

                                        {/* Manual Entry Section */}
                                        {!revealedSecret ? (
                                            <button
                                                type="button"
                                                onClick={() => setShowManualEntry(true)}
                                                className="text-sm text-blue-500 hover:text-blue-400 font-bold underline transition-colors"
                                            >
                                                Can&apos;t scan QR code? Click for manual entry
                                            </button>
                                        ) : (
                                            <div className="p-6 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl overflow-hidden">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-30 block mb-2">Secret Key (Manual Entry)</span>
                                                <code className="text-sm md:text-lg font-black tracking-widest text-blue-500 break-all block">
                                                    {revealedSecret}
                                                </code>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setStep('verify')}
                                        className="w-full py-6 px-10 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl"
                                    >
                                        Proceed to Verification
                                    </button>
                                </motion.div>
                            )}

                            {step === 'verify' && (
                                <motion.div
                                    key="verify"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl"
                                >
                                    <h3 className="text-xl font-black uppercase tracking-widest mb-10 text-center flex items-center justify-center gap-3">
                                        <Lock className="text-blue-500" size={24} />
                                        Verification
                                    </h3>

                                    <form onSubmit={handleVerify} className="space-y-10">
                                        <div>
                                            <label htmlFor="totpCode" className="block text-xs font-black uppercase tracking-widest opacity-40 mb-3 text-center">
                                                6-Digit Protocol Code
                                            </label>
                                            <input
                                                id="totpCode"
                                                type="text"
                                                maxLength={6}
                                                value={totpCode}
                                                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                                                required
                                                className="w-full px-6 py-6 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-2xl md:text-4xl font-black tracking-[0.5rem] md:tracking-[1.5rem] text-center text-blue-500 placeholder-[var(--foreground)]/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                                placeholder="000000"
                                            />
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-black uppercase tracking-widest text-center">
                                                {error}
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button
                                                type="submit"
                                                disabled={loading || totpCode.length !== 6}
                                                className="flex-1 py-6 px-10 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl disabled:opacity-50"
                                            >
                                                {loading ? 'Verifying...' : 'Finalize Setup'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setStep('setup')}
                                                className="py-6 px-10 bg-[var(--muted)]/20 text-[var(--foreground)] rounded-2xl font-black uppercase tracking-widest transition-all border border-[var(--border)]"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {step === 'backup' && (
                                <motion.div
                                    key="backup"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-14 border border-[var(--border)] shadow-2xl"
                                >
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl">
                                            <ShieldCheck size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black tracking-tighter uppercase">Protocol Secured</h2>
                                            <p className="text-xs font-black uppercase tracking-widest opacity-40">MFA Highly Active</p>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl mb-10">
                                        <div className="flex items-center gap-3 text-yellow-600 mb-4">
                                            <AlertTriangle size={20} />
                                            <span className="font-black uppercase tracking-widest text-sm">Critical: Backup Codes</span>
                                        </div>
                                        <p className="text-[var(--foreground)]/70 font-medium mb-8 leading-relaxed">
                                            Save these codes in a secure vault. They are the ONLY way to recover access if you lose your MFA device.
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            {backupCodes.map((code, i) => (
                                                <div key={i} className="bg-[var(--background)]/50 p-4 rounded-xl border border-[var(--border)] font-mono text-center font-bold tracking-widest text-lg">
                                                    {code}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={copyBackupCodes}
                                                className="flex-1 flex items-center justify-center gap-3 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-black uppercase tracking-widest transition-all"
                                            >
                                                {copied ? <Check size={20} /> : <Copy size={20} />}
                                                <span>{copied ? 'Copied' : 'Copy All'}</span>
                                            </button>
                                            <button
                                                onClick={downloadBackupCodes}
                                                className="p-4 bg-white/5 border border-white/10 rounded-xl text-[var(--foreground)] hover:bg-white/10 transition-all"
                                            >
                                                <Download size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setStep('overview')}
                                        className="w-full py-6 px-10 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl"
                                    >
                                        Complete Authorization
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {/* Disable Modal */}
            <AnimatePresence>
                {showDisableModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDisableModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[var(--card-bg)]/90 backdrop-blur-2xl border border-[var(--border)] w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl"
                        >
                            <h3 className="text-2xl font-black tracking-tighter uppercase mb-6 flex items-center gap-3">
                                <AlertTriangle className="text-red-500" size={24} />
                                Security Override
                            </h3>
                            <p className="text-[var(--foreground-muted)] font-medium mb-8">
                                Disabling MFA will significantly reduce account security. Enter your administrative password to proceed.
                            </p>

                            <form onSubmit={handleDisable} className="space-y-6">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Admin Password"
                                    className="w-full px-6 py-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                />

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black uppercase tracking-widest transition-all"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowDisableModal(false)}
                                        className="px-6 py-4 bg-[var(--muted)]/20 text-[var(--foreground)] rounded-xl font-black uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Manual Entry Password Modal */}
            <AnimatePresence>
                {showManualEntry && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowManualEntry(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[var(--card-bg)]/90 backdrop-blur-2xl border border-[var(--border)] w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl"
                        >
                            <h3 className="text-2xl font-black tracking-tighter uppercase mb-6 flex items-center gap-3">
                                <Lock className="text-blue-500" size={24} />
                                Security Verification
                            </h3>
                            <p className="text-[var(--foreground-muted)] font-medium mb-8">
                                Enter your password to reveal the manual entry secret key.
                            </p>

                            <form onSubmit={handleRevealSecret} className="space-y-6">
                                <input
                                    type="password"
                                    value={manualPassword}
                                    onChange={(e) => setManualPassword(e.target.value)}
                                    required
                                    placeholder="Admin Password"
                                    className="w-full px-6 py-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest transition-all"
                                    >
                                        Reveal Secret
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowManualEntry(false)}
                                        className="px-6 py-4 bg-[var(--muted)]/20 text-[var(--foreground)] rounded-xl font-black uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
