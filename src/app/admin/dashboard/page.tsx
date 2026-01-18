"use client";

import { useState, useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    LogOut,
    Briefcase,
    Users,
    ShieldAlert,
    Globe,
    ArrowRight,
    ShieldCheck,
    FolderGit2,
    BarChart3,
    History,
    MousePointer2,
    Calendar,
    User,
    Mail,
    Activity,
    Server,
    HardDrive,
    Cpu,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    Clock,
    Shield,
    Search,
    Award
} from 'lucide-react';

interface Admin {
    id: string;
    email: string;
    is2FAEnabled: boolean;
}

interface Incident {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    status: 'resolved' | 'investigating' | 'monitoring';
    started_at: string;
}

interface Health {
    services: {
        database: { status: string };
        backend: { status: string; version: string; uptime: number };
    };
    config: Record<string, boolean>;
    system: {
        memory: { heapUsed: string; heapTotal: string };
        cpuCount: number;
    };
}

interface AnalyticsSummary {
    today: {
        unique_visitors: number;
    };
}

interface ActionLink {
    title: string;
    description: string;
    href: string;
    icon: ComponentType<{ size?: number; className?: string }>;
    gradient: string;
    color: string;
    fullWidth?: boolean;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [projects, setProjects] = useState<unknown[]>([]);
    const [certificates, setCertificates] = useState<unknown[]>([]);
    const [admins, setAdmins] = useState<unknown[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [health, setHealth] = useState<Health | null>(null);

    useEffect(() => {
        fetchData();
        fetchHealth();
        fetchIncidents();

        // Refresh every 30 seconds
        const interval = setInterval(() => {
            fetchHealth();
            fetchIncidents();
        }, 30000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchIncidents = async () => {
        try {
            const res = await fetch('/api/admin/incidents');
            if (res.ok) {
                const data = await res.json();
                setIncidents(data.incidents || []);
            }
        } catch (error) {
            console.error('Error fetching incidents:', error);
        }
    };

    const fetchHealth = async () => {
        try {
            const res = await fetch('/api/admin/health');
            if (res.ok) {
                const data = await res.json();
                healthSetter(data);
            }
        } catch (error) {
            console.error('Error fetching health:', error);
        }
    };

    const healthSetter = (data: Health) => {
        setHealth(data);
    };

    const fetchData = async () => {
        try {
            const [meRes, projectsRes, certificatesRes, adminsRes, analyticsRes] = await Promise.all([
                fetch('/api/auth/me'),
                fetch('/api/admin/projects'),
                fetch('/api/admin/certificates'),
                fetch('/api/admin/users'),
                fetch('/api/admin/analytics/summary'),
            ]);

            // Check for auth errors on any request
            if (!meRes.ok && (meRes.status === 401 || meRes.status === 403)) {
                router.push('/admin/login');
                return;
            }

            if (meRes.ok) {
                const meData = await meRes.json();
                setAdmin(meData.admin);
            }

            if (projectsRes.ok) {
                const projectsData = await projectsRes.json();
                setProjects(projectsData.projects || []);
            }

            if (certificatesRes.ok) {
                const certificatesData = await certificatesRes.json();
                setCertificates(certificatesData.certificates || []);
            }

            if (adminsRes.ok) {
                const adminsData = await adminsRes.json();
                setAdmins(adminsData.admins || []);
            }

            if (analyticsRes?.ok) {
                const analyticsData = await analyticsRes.json();
                setAnalytics(analyticsData.summary);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const statsCards = [
        {
            label: "Total Certificates",
            value: certificates.length,
            icon: Award,
            color: "pink",
            href: "/admin/dashboard/certificates"
        },
        {
            label: "Total Projects",
            value: projects.length,
            icon: FolderGit2,
            color: "blue",
            href: "/admin/dashboard/projects"
        },
        {
            label: "Administrative Core",
            value: admins.length,
            icon: Users,
            color: "purple",
            href: "/admin/dashboard/admins"
        },
        {
            label: "Today's Visitors",
            value: analytics?.today?.unique_visitors || 0,
            icon: Globe,
            color: "green",
            href: "/admin/dashboard/analytics"
        }
    ];

    const actionLinks = [
        {
            title: "Access Control",
            description: "Manage administrative permissions",
            href: "/admin/dashboard/admins",
            icon: ShieldAlert,
            gradient: "from-blue-600 to-blue-400",
            color: "blue"
        },
        {
            title: "Security Uplink",
            description: "Configure multi-factor protocols",
            href: "/admin/dashboard/2fa",
            icon: ShieldCheck,
            gradient: "from-blue-600 to-blue-400",
            color: "blue"
        },
        {
            title: "Project Architecture",
            description: "Construct, modify, and manage works",
            href: "/admin/dashboard/projects",
            icon: Briefcase,
            gradient: "from-green-600 to-green-400",
            color: "green"
        },
        {
            title: "Certificate Registry",
            description: "Manage credentials and licenses",
            href: "/admin/dashboard/certificates",
            icon: Award,
            gradient: "from-green-600 to-green-400",
            color: "green"
        },
        {
            title: "Profile Settings",
            description: "Update name and picture",
            href: "/admin/dashboard/profile",
            icon: User,
            gradient: "from-yellow-600 to-yellow-400",
            color: "yellow"
        },
        {
            title: "Journey Timeline",
            description: "Manage career milestones",
            href: "/admin/dashboard/journey",
            icon: Calendar,
            gradient: "from-yellow-600 to-yellow-400",
            color: "yellow"
        },
        {
            title: "Contact Info",
            description: "Update contact details",
            href: "/admin/dashboard/contact-info",
            icon: Mail,
            gradient: "from-orange-600 to-orange-400",
            color: "orange"
        },
        {
            title: "SEO Protocols",
            description: "Define search engine optimization",
            href: "/admin/dashboard/seo",
            icon: Search,
            gradient: "from-orange-600 to-orange-400",
            color: "orange"
        },
        {
            title: "Skills Registry",
            description: "Manage technology stacks",
            href: "/admin/dashboard/skills",
            icon: MousePointer2,
            gradient: "from-pink-600 to-pink-400",
            color: "pink"
        },
        {
            title: "Stats Registry",
            description: "Manage about page metrics",
            href: "/admin/dashboard/stats",
            icon: BarChart3,
            gradient: "from-pink-600 to-pink-400",
            color: "pink"
        },
        {
            title: "Intelligence Hub",
            description: "Traffic analytics & telemetry",
            href: "/admin/dashboard/analytics",
            icon: BarChart3,
            gradient: "from-purple-600 to-purple-400",
            color: "purple"
        },
        {
            title: "Audit Terminal",
            description: "Review system activity logs",
            href: "/admin/dashboard/logs",
            icon: History,
            gradient: "from-purple-600 to-purple-400",
            color: "purple"
        },
        {
            title: "Live Site",
            description: "Exit to the public interface",
            href: "/",
            icon: Globe,
            gradient: "from-red-600 to-red-400",
            color: "red",
            fullWidth: true
        }
    ] as ActionLink[];

    return (
        <div className="relative min-h-screen bg-[var(--background)] overflow-x-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                                <LayoutDashboard size={24} />
                            </div>
                            <h1 className="text-xl font-black tracking-tighter uppercase">Command Center</h1>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-xs font-black uppercase tracking-widest opacity-30 text-[var(--foreground)]">Logged as</span>
                                <span className="text-sm font-bold text-[var(--foreground)]">{admin?.email}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-xl"
                            >
                                <LogOut size={14} className="sm:w-[16px] sm:h-[16px]" />
                                <span>Terminate</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] sm:leading-none mb-4">
                        SYSTEM <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">OVERVIEW</span>
                    </h2>
                    <p className="text-sm sm:text-lg md:text-xl text-[var(--foreground-muted)] font-medium max-w-2xl border-l border-blue-500/30 pl-5 sm:pl-0">
                        Monitor platform health and manage architectural entities from a centralized interface.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {statsCards.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative group h-full"
                        >
                            <Link href={stat.href} className="block h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative bg-[var(--card-bg)]/50 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[var(--border)] group-hover:border-blue-500/30 transition-all duration-500 h-full flex flex-col items-center text-center">
                                    <div className={`p-3.5 sm:p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                                        <stat.icon size={28} className="sm:w-[32px] sm:h-[32px]" />
                                    </div>
                                    <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[var(--foreground)] opacity-50 mb-1 sm:mb-2">{stat.label}</h3>
                                    <p className="text-3xl sm:text-5xl font-black tracking-tighter text-[var(--foreground)]">{stat.value}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Incident & Alerts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-16"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-2.5 sm:p-3 bg-red-500/10 text-red-500 rounded-2xl">
                            <AlertTriangle size={20} className="sm:w-[24px] sm:h-[24px]" />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase">INCIDENT logs</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Problem history & active response logs</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {incidents.length > 0 ? (
                            incidents.map((incident, idx) => (
                                <div key={incident.id || idx} className="p-8 bg-[var(--card-bg)]/30 backdrop-blur-xl border border-[var(--border)] rounded-[2.5rem] relative overflow-hidden group">
                                    <div className={`absolute top-0 left-0 w-1 h-full ${incident.severity === 'critical' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
                                        incident.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`} />

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-3 sm:mb-2">
                                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${incident.status === 'resolved' ? 'bg-green-500/10 text-green-500' :
                                                    incident.status === 'investigating' ? 'bg-red-500/10 text-red-500 animate-pulse' :
                                                        'bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                    {incident.status}
                                                </span>
                                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-30 flex items-center gap-1">
                                                    <Clock size={10} className="sm:w-[12px] sm:h-[12px]" />
                                                    {new Date(incident.started_at).toLocaleString()}
                                                </span>
                                            </div>
                                            <h3 className="text-lg sm:text-2xl font-black tracking-tighter uppercase mb-2">{incident.title}</h3>
                                            <p className="text-xs sm:text-base text-[var(--foreground-muted)] font-medium leading-relaxed max-w-3xl">
                                                {incident.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className={`p-3.5 sm:p-4 rounded-2xl border ${incident.severity === 'critical' ? 'border-red-500/30 bg-red-500/5 text-red-500' :
                                                incident.severity === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5 text-yellow-500' :
                                                    'border-blue-500/30 bg-blue-500/5 text-blue-500'
                                                }`}>
                                                {incident.severity === 'critical' ? <Shield size={20} className="sm:w-[24px] sm:h-[24px]" /> : <Info size={20} className="sm:w-[24px] sm:h-[24px]" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 bg-[var(--card-bg)]/30 backdrop-blur-xl border border-[var(--border)] rounded-[2.5rem] text-center">
                                <p className="text-[var(--foreground-muted)] font-black uppercase tracking-widest opacity-30">Scanning for incidents...</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* System Health Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-2.5 sm:p-3 bg-green-500/10 text-green-500 rounded-2xl">
                            <Activity size={20} className="sm:w-[24px] sm:h-[24px]" />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase">SYSTEM HEALTH</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Real-time telemetry & service status</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Service Status */}
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 sm:p-6 bg-[var(--card-bg)]/30 backdrop-blur-xl border border-[var(--border)] rounded-[2rem] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 sm:p-3 rounded-xl ${health?.services?.database?.status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        <HardDrive size={18} className="sm:w-[20px] sm:h-[20px]" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-30">Database</p>
                                        <p className="text-xs sm:text-sm font-bold uppercase">{health?.services?.database?.status || 'Searching...'}</p>
                                    </div>
                                </div>
                                {health?.services?.database?.status === 'online' ? <CheckCircle2 size={14} className="sm:w-[16px] sm:h-[16px] text-green-500" /> : <XCircle size={14} className="sm:w-[16px] sm:h-[16px] text-red-500" />}
                            </div>

                            <div className="p-5 sm:p-6 bg-[var(--card-bg)]/30 backdrop-blur-xl border border-[var(--border)] rounded-[2rem] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 sm:p-3 rounded-xl bg-blue-500/10 text-blue-500">
                                        <Server size={18} className="sm:w-[20px] sm:h-[20px]" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-30">Backend</p>
                                        <p className="text-xs sm:text-sm font-bold uppercase">Online ({health?.services?.backend?.version || '...'})</p>
                                    </div>
                                </div>
                                <CheckCircle2 size={14} className="sm:w-[16px] sm:h-[16px] text-green-500" />
                            </div>

                            {/* Configuration Status */}
                            <div className="p-5 sm:p-6 bg-[var(--card-bg)]/30 backdrop-blur-xl border border-[var(--border)] rounded-[2rem] md:col-span-2">
                                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-30 mb-4">Environment Protocol Readiness</p>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {health?.config && Object.entries(health.config).map(([key, value]) => (
                                        <div key={key} className="flex flex-col gap-1">
                                            <span className="text-[9px] font-bold uppercase opacity-50">{key}</span>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_8px_rgba(34,197,94,0.5)]`} />
                                                <span className="text-[9px] font-black uppercase tracking-tighter">{value ? 'READY' : 'MISSING'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Hardware Metrics */}
                        <div className="p-6 sm:p-8 bg-[var(--card-bg)]/30 backdrop-blur-xl border border-[var(--border)] rounded-[2.5rem]">
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-30">Hardware Telemetry</p>
                                <Cpu size={14} className="sm:w-[16px] sm:h-[16px] opacity-30" />
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2">
                                        <span>Memory (Heap)</span>
                                        <span className="text-blue-500">{health?.system?.memory?.heapUsed || '0MB'} / {health?.system?.memory?.heapTotal || '0MB'}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-1000"
                                            style={{ width: health ? (parseInt(health.system.memory.heapUsed) / parseInt(health.system.memory.heapTotal) * 100) + '%' : '0%' }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-6">
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">Uptime</p>
                                        <p className="text-xs sm:text-sm font-bold">{health ? Math.floor(health.services.backend.uptime / 3600) + 'h ' + Math.floor((health.services.backend.uptime % 3600) / 60) + 'm' : '...'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">CPU Cores</p>
                                        <p className="text-xs sm:text-sm font-bold">{health?.system?.cpuCount || '...'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
                    {actionLinks.map((action, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className={action.fullWidth ? "md:col-span-2" : ""}
                        >
                            <Link
                                href={action.href}
                                className={`group relative block p-6 sm:p-10 rounded-[2.5rem] bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-${action.color || 'blue'}-500/30 shadow-2xl`}
                            >
                                <div className={`absolute top-0 right-0 p-6 sm:p-8 opacity-5 group-hover:opacity-20 transition-opacity text-${action.color || 'blue'}-500`}>
                                    <action.icon size={80} className="sm:w-[120px] sm:h-[120px]" />
                                </div>

                                <div className="relative z-10">
                                    <div className={`p-2.5 sm:p-3 bg-${action.color || 'blue'}-500/10 text-${action.color || 'blue'}-500 rounded-xl w-fit mb-4 sm:mb-6`}>
                                        <action.icon size={22} className="sm:w-[28px] sm:h-[28px]" />
                                    </div>
                                    <h3 className="text-xl sm:text-3xl font-black tracking-tighter uppercase mb-2 sm:mb-3 flex items-center gap-3">
                                        {action.title}
                                        <ArrowRight size={20} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 sm:w-[24px] sm:h-[24px]" />
                                    </h3>
                                    <p className="text-sm sm:text-lg text-[var(--foreground-muted)] font-medium">
                                        {action.description}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
