"use client";

import { useState } from 'react';
import { Upload, Plus, Loader2, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadZoneProps {
    onUploadComplete: (url: string) => void;
    compact?: boolean | 'minimal';
    className?: string;
    uploadEndpoint?: string;
}

export default function ImageUploadZone({ onUploadComplete, compact = false, className = "", uploadEndpoint = '/api/admin/projects/upload' }: ImageUploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'upload' | 'url'>('upload');
    const [urlInput, setUrlInput] = useState('');

    const handleUpload = async (file: File) => {
        if (!file) return;

        // Reset states
        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(uploadEndpoint, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            onUploadComplete(data.url);
        } catch (err: unknown) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';
            setError(errorMessage);
        } finally {
            setUploading(false);
            setIsDragging(false);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleUpload(file);
        }
    };

    const handleUrlSubmit = () => {
        if (!urlInput.trim()) return;

        setError('');
        // Validate URL format
        try {
            new URL(urlInput);
            onUploadComplete(urlInput.trim());
            setUrlInput('');
        } catch {
            setError('Invalid URL format');
        }
    };

    // Compact Mode (for Grid)
    if (compact === true) {
        return (
            <div
                className={`relative group/add aspect-video rounded-3xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center gap-2 cursor-pointer ${isDragging
                    ? 'border-blue-500 bg-blue-500/10 scale-[0.98]'
                    : 'border-[var(--border)] hover:border-blue-500 bg-[var(--background)]/30 hover:bg-blue-500/5'
                    } ${className}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                    title="Add Asset"
                />

                <AnimatePresence mode="wait">
                    {uploading ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <Loader2 size={24} className="text-blue-500 animate-spin" />
                            <span className="text-xs font-black uppercase tracking-widest text-blue-500">Syncing...</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className={`p-3 rounded-full transition-colors ${isDragging ? 'bg-blue-500 text-white' : 'bg-[var(--muted)]/20 group-hover/add:bg-blue-500/10'
                                }`}>
                                <Plus size={24} className={`transition-all ${isDragging ? 'opacity-100' : 'opacity-50 group-hover/add:opacity-100 group-hover/add:text-blue-500'
                                    }`} />
                            </div>
                            <span className={`text-sm font-black uppercase tracking-widest transition-all ${isDragging ? 'text-blue-500 opacity-100' : 'opacity-50 group-hover/add:opacity-100 group-hover/add:text-blue-500'
                                }`}>
                                {isDragging ? 'Drop Asset' : 'Add Asset'}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && <span className="absolute bottom-2 text-sm text-red-500 font-bold uppercase">{error}</span>}
            </div>
        );
    }

    // Minimal Mode (for Toggle Bar)
    if (compact === 'minimal') {
        return (
            <div
                className={`relative group/add h-full w-full border-2 border-dashed transition-all flex items-center justify-center gap-2 cursor-pointer ${isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-[var(--border)] hover:border-blue-500/50 bg-[var(--background)]/30 group-hover:bg-blue-500/5'
                    } rounded-2xl ${className}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                    title="Upload File"
                />

                <AnimatePresence mode="wait">
                    {uploading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                        >
                            <Loader2 size={16} className="text-blue-500 animate-spin" />
                            <span className="text-sm font-black uppercase tracking-widest text-blue-500">Syncing...</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2"
                        >
                            <Upload size={16} className={`transition-colors ${isDragging ? 'text-blue-500' : 'text-blue-500'}`} />
                            <span className={`text-sm font-black uppercase tracking-widest transition-colors ${isDragging ? 'text-blue-500' : 'opacity-50 group-hover:opacity-100'
                                }`}>
                                {isDragging ? 'Release to Upload' : 'Click to Select File'}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && <span className="absolute right-3 text-sm text-red-500 font-bold uppercase">{error}</span>}
            </div>
        );
    }

    // Full / Empty State Mode
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Mode Toggle */}
            <div className="flex gap-2 p-1 bg-[var(--muted)]/20 rounded-xl border border-[var(--border)] w-fit">
                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'upload'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-[var(--foreground)]/50 hover:text-[var(--foreground)]'
                        }`}
                >
                    <Upload size={16} />
                    Upload
                </button>
                <button
                    type="button"
                    onClick={() => setMode('url')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'url'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-[var(--foreground)]/50 hover:text-[var(--foreground)]'
                        }`}
                >
                    <Link size={16} />
                    URL
                </button>
            </div>

            {mode === 'upload' ? (
                <div
                    className={`relative flex flex-col items-center gap-4 py-12 border-2 border-dashed rounded-[2rem] transition-all cursor-pointer ${isDragging
                        ? 'border-blue-500 bg-blue-500/5 scale-[0.99] shadow-lg shadow-blue-500/10'
                        : 'border-[var(--border)] hover:border-blue-500 bg-[var(--background)]/30 hover:bg-blue-500/5'
                        }`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                        title="Initialize Visual Matrix"
                    />

                    <AnimatePresence mode="wait">
                        {uploading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                                    <Loader2 size={48} className="text-blue-500 animate-spin relative z-10" />
                                </div>
                                <span className="text-sm font-black uppercase tracking-widest text-blue-500 animate-pulse">Uploading Asset...</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center gap-4 w-full"
                            >
                                <div className={`p-5 rounded-full transition-all duration-500 ${isDragging
                                    ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/30 rotate-12 scale-110'
                                    : 'bg-[var(--muted)]/20 text-[var(--foreground)]/40 group-hover:bg-blue-500/10 group-hover:text-blue-500'
                                    }`}>
                                    <Upload size={32} />
                                </div>

                                <div className="flex flex-col items-center gap-1 text-center">
                                    <span className={`text-sm font-black uppercase tracking-widest transition-all ${isDragging ? 'text-blue-500' : 'text-[var(--foreground)]'
                                        }`}>
                                        {isDragging ? 'Release to Initialize' : 'Initialize Visual Matrix'}
                                    </span>
                                    <span className="text-xs font-medium uppercase tracking-[0.2em] opacity-40">
                                        {isDragging ? 'Target Locked' : 'Drag & Drop or Click to Browse'}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-bold text-red-500 uppercase tracking-widest">
                            {error}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <input
                            type="url"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                            placeholder="Paste image URL here..."
                            className="flex-1 px-6 py-4 bg-[var(--background)]/50 border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                        <button
                            type="button"
                            onClick={handleUrlSubmit}
                            disabled={!urlInput.trim()}
                            className="px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                        >
                            Add
                        </button>
                    </div>
                    {error && (
                        <p className="text-xs text-red-500 font-bold uppercase tracking-widest px-2">{error}</p>
                    )}
                    <p className="text-xs text-[var(--foreground-muted)] font-medium px-2">
                        Enter a direct link to an image (e.g., https://example.com/image.jpg)
                    </p>
                </div>
            )}
        </div>
    );
}
