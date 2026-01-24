"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShieldAlert,
    ShieldCheck,
    Briefcase,
    Award,
    User,
    Calendar,
    Mail,
    Search,
    MousePointer2,
    BarChart3,
    History,
    Globe,
    Menu,
    X,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const menuGroups = [
    {
        name: "Security",
        items: [
            { title: "Access Control", href: "/admin/dashboard/admins", icon: ShieldAlert },
            { title: "Security Uplink", href: "/admin/dashboard/2fa", icon: ShieldCheck },
        ]
    },
    {
        name: "Content",
        items: [
            { title: "Projects", href: "/admin/dashboard/projects", icon: Briefcase },
            { title: "Certificates", href: "/admin/dashboard/certificates", icon: Award },
            { title: "Journey", href: "/admin/dashboard/journey", icon: Calendar },
            { title: "Skills", href: "/admin/dashboard/skills", icon: MousePointer2 },
            { title: "Stats", href: "/admin/dashboard/stats", icon: BarChart3 },
        ]
    },
    {
        name: "Configuration",
        items: [
            { title: "Profile", href: "/admin/dashboard/profile", icon: User },
            { title: "Contact Info", href: "/admin/dashboard/contact-info", icon: Mail },
            { title: "SEO Protocols", href: "/admin/dashboard/seo", icon: Search },
        ]
    },
    {
        name: "System",
        items: [
            { title: "Intelligence Hub", href: "/admin/dashboard/analytics", icon: BarChart3 },
            { title: "Audit Terminal", href: "/admin/dashboard/logs", icon: History },
        ]
    },
    {
        name: "External",
        items: [
            { title: "Live Site", href: "/", icon: Globe },
        ]
    }
];

interface AdminSidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export default function AdminSidebar({ isCollapsed = false, onToggle }: AdminSidebarProps) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close sidebar on navigation (mobile)
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const SidebarContent = ({ side = "desktop" }: { side?: "desktop" | "mobile" }) => {
        const showFull = side === "mobile" || !isCollapsed;

        return (
            <div className={`flex flex-col h-full transition-all duration-300 ${!showFull ? 'items-center' : ''}`}>
                <div className={`p-8 border-b border-[var(--border)] transition-all duration-300 w-full ${!showFull ? 'px-0 flex justify-center' : ''}`}>
                    <Link href="/admin/dashboard" className="flex items-center gap-4 group">
                        <div className={`p-2.5 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-110 transition-transform ${!showFull ? 'mx-auto' : ''}`}>
                            <LayoutDashboard size={24} />
                        </div>
                        {showFull && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-xl font-black tracking-tighter uppercase transition-colors group-hover:text-blue-500 overflow-hidden whitespace-nowrap"
                            >
                                Command
                            </motion.span>
                        )}
                    </Link>
                </div>

                <nav className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 w-full ${showFull ? 'p-6 space-y-8' : 'p-4 space-y-6 flex flex-col items-center'}`}>
                    {menuGroups.map((group) => (
                        <div key={group.name} className={`space-y-3 w-full ${!showFull ? 'flex flex-col items-center' : ''}`}>
                            {showFull ? (
                                <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-30">
                                    {group.name}
                                </h4>
                            ) : (
                                <div className="w-8 h-px bg-[var(--border)] opacity-20" />
                            )}
                            <div className={`space-y-1 w-full ${!showFull ? 'flex flex-col items-center' : ''}`}>
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            title={!showFull ? item.title : undefined}
                                            className={`group flex items-center gap-3 rounded-xl transition-all relative ${isActive
                                                ? 'bg-blue-500/10 text-blue-500'
                                                : 'text-[var(--foreground)]/50 hover:bg-[var(--muted)]/30 hover:text-[var(--foreground)]'
                                                } ${showFull ? 'px-4 py-3 w-full' : 'p-3 justify-center'}`}
                                        >
                                            <item.icon size={isActive ? 20 : 18} className={isActive ? 'text-blue-500' : 'opacity-50 group-hover:opacity-100'} />
                                            {showFull && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="text-sm font-bold tracking-tight uppercase whitespace-nowrap overflow-hidden"
                                                >
                                                    {item.title}
                                                </motion.span>
                                            )}
                                            {isActive && (
                                                <motion.div
                                                    layoutId={`active-indicator-${side}`}
                                                    className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className={`p-6 border-t border-[var(--border)] transition-all duration-300 w-full ${!showFull ? 'px-2' : ''}`}>
                    <button
                        onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            window.location.href = '/admin/login';
                        }}
                        title={!showFull ? "Terminate Session" : undefined}
                        className={`flex justify-center items-center gap-3 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-red-500/10 ${showFull ? 'w-full py-4 px-4' : 'w-12 h-12 p-0'}`}
                    >
                        <LogOut size={16} />
                        {showFull && <span>Terminate</span>}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 288 }}
                className="fixed left-0 top-0 bottom-0 bg-[var(--background)]/80 backdrop-blur-xl border-r border-[var(--border)] z-[60] hidden lg:flex flex-col shadow-2xl transition-colors duration-300"
            >
                {/* Desktop Toggle Button */}
                <button
                    onClick={onToggle}
                    className="absolute -right-3 top-24 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-[70] border-2 border-[var(--background)]"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                <SidebarContent side="desktop" />
            </motion.aside>

            {/* Mobile Header / Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-[70] bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)] px-6 py-4 flex justify-between items-center">
                <Link href="/admin/dashboard" className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                        <LayoutDashboard size={20} />
                    </div>
                    <span className="text-lg font-black tracking-tighter uppercase">Command</span>
                </Link>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 bg-[var(--muted)]/30 rounded-lg text-[var(--foreground)]"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <div className="fixed inset-0 z-[80] lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute left-0 top-0 bottom-0 w-[80%] max-w-72 bg-[var(--background)] border-r border-[var(--border)] flex flex-col pt-20 lg:pt-0"
                        >
                            <SidebarContent side="mobile" />
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
