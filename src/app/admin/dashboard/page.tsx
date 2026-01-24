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
    Award,
    Filter,
    ChevronDown
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
    category: string;
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
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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
            color: "blue",
            category: "Security"
        },
        {
            title: "Security Uplink",
            description: "Configure multi-factor protocols",
            href: "/admin/dashboard/2fa",
            icon: ShieldCheck,
            gradient: "from-blue-600 to-blue-400",
            color: "blue",
            category: "Security"
        },
        {
            title: "Project Architecture",
            description: "Construct, modify, and manage works",
            href: "/admin/dashboard/projects",
            icon: Briefcase,
            gradient: "from-green-600 to-green-400",
            color: "green",
            category: "Content"
        },
        {
            title: "Certificate Registry",
            description: "Manage credentials and licenses",
            href: "/admin/dashboard/certificates",
            icon: Award,
            gradient: "from-green-600 to-green-400",
            color: "green",
            category: "Content"
        },
        {
            title: "Profile Settings",
            description: "Update name and picture",
            href: "/admin/dashboard/profile",
            icon: User,
            gradient: "from-orange-600 to-orange-400",
            color: "orange",
            category: "Configuration"
        },
        {
            title: "Journey Timeline",
            description: "Manage career milestones",
            href: "/admin/dashboard/journey",
            icon: Calendar,
            gradient: "from-green-600 to-green-400",
            color: "green",
            category: "Content"
        },
        {
            title: "Contact Info",
            description: "Update contact details",
            href: "/admin/dashboard/contact-info",
            icon: Mail,
            gradient: "from-orange-600 to-orange-400",
            color: "orange",
            category: "Configuration"
        },
        {
            title: "SEO Protocols",
            description: "Define search engine optimization",
            href: "/admin/dashboard/seo",
            icon: Search,
            gradient: "from-orange-600 to-orange-400",
            color: "orange",
            category: "Configuration"
        },
        {
            title: "Skills Registry",
            description: "Manage technology stacks",
            href: "/admin/dashboard/skills",
            icon: MousePointer2,
            gradient: "from-green-600 to-green-400",
            color: "green",
            category: "Content"
        },
        {
            title: "Stats Registry",
            description: "Manage about page metrics",
            href: "/admin/dashboard/stats",
            icon: BarChart3,
            gradient: "from-green-600 to-green-400",
            color: "green",
            category: "Content"
        },
        {
            title: "Intelligence Hub",
            description: "Traffic analytics & telemetry",
            href: "/admin/dashboard/analytics",
            icon: BarChart3,
            gradient: "from-purple-600 to-purple-400",
            color: "purple",
            category: "System"
        },
        {
            title: "Audit Terminal",
            description: "Review system activity logs",
            href: "/admin/dashboard/logs",
            icon: History,
            gradient: "from-purple-600 to-purple-400",
            color: "purple",
            category: "System"
        },
        {
            title: "Live Site",
            description: "Exit to the public interface",
            href: "/",
            icon: Globe,
            gradient: "from-red-600 to-red-400",
            color: "red",
            category: "External",
            fullWidth: true
        }
    ] as ActionLink[];

    const categories = ["All", "Security", "Content", "Configuration", "System", "External"];

    const filteredActions = actionLinks.filter(link => {
        const matchesSearch =
            link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            link.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "All" || link.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

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
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] sm:leading-none mb-6">
                        SYSTEM <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">OVERVIEW</span>
                    </h2>
                    <p className="text-sm sm:text-lg md:text-xl text-[var(--foreground-muted)] font-medium max-w-2xl border-l-2 border-blue-500/50 pl-6 opacity-80">
                        Monitor platform health and manage architectural entities from a centralized telemetry interface.
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
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative bg-[var(--card-bg)]/20 backdrop-blur-3xl rounded-[2.5rem] p-8 sm:p-10 border border-[var(--border)] group-hover:border-blue-500/50 transition-all duration-700 h-full flex flex-col items-center text-center shadow-2xl">
                                    <div className={`p-5 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 mb-6 group-hover:scale-110 transition-transform duration-500 border border-${stat.color}-500/20 shadow-2xl shadow-${stat.color}-500/10`}>
                                        <stat.icon size={36} />
                                    </div>
                                    <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)] opacity-30 mb-2">{stat.label}</h3>
                                    <p className="text-4xl sm:text-6xl font-black tracking-tighter text-[var(--foreground)] drop-shadow-2xl">{stat.value}</p>
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

                    <div className="space-y-6">
                        {incidents.length > 0 ? (
                            incidents.map((incident, idx) => (
                                <motion.div
                                    key={incident.id || idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + idx * 0.1 }}
                                    className="group relative bg-[var(--card-bg)]/20 backdrop-blur-2xl border border-[var(--border)] rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-2xl"
                                >
                                    <div className={`absolute top-0 left-0 w-2 h-full ${incident.severity === 'critical' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' :
                                        incident.severity === 'warning' ? 'bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]' :
                                            'bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                        }`} />

                                    <div className="flex flex-col md:flex-row gap-8 p-8 md:p-10">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg ${incident.status === 'resolved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    incident.status === 'investigating' ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' :
                                                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                    }`}>
                                                    {incident.status}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30">
                                                    <Clock size={12} />
                                                    {new Date(incident.started_at).toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none">
                                                    {incident.title}
                                                </h3>
                                                <div className="relative">
                                                    <div className="absolute -left-6 top-0 bottom-0 w-px bg-blue-500/20 hidden md:block" />
                                                    <p className="text-sm md:text-lg text-[var(--foreground-muted)] font-medium leading-relaxed font-mono opacity-80">
                                                        <span className="text-blue-500/40 mr-2">$ cat logs/detail:</span>
                                                        {incident.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end">
                                            <div className={`p-6 rounded-[1.5rem] border shadow-2xl transition-all duration-500 group-hover:scale-110 ${incident.severity === 'critical' ? 'border-red-500/30 bg-red-500/5 text-red-500 shadow-red-500/10' :
                                                incident.severity === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5 text-yellow-500 shadow-yellow-500/10' :
                                                    'border-blue-500/30 bg-blue-500/5 text-blue-500 shadow-blue-500/10'
                                                }`}>
                                                {incident.severity === 'critical' ? <ShieldAlert size={32} /> : incident.severity === 'warning' ? <AlertTriangle size={32} /> : <Info size={32} />}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-16 bg-[var(--card-bg)]/20 backdrop-blur-xl border border-[var(--border)] border-dashed rounded-[3rem] text-center">
                                <Activity className="mx-auto mb-6 text-blue-500/20" size={48} />
                                <p className="text-[var(--foreground-muted)] font-black uppercase tracking-[0.3em] text-xs">Scanning registry for incident signatures...</p>
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
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.9 }}
                                className="p-8 bg-[var(--card-bg)]/20 backdrop-blur-3xl border border-[var(--border)] rounded-[2.5rem] flex items-center justify-between group overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                    <HardDrive size={100} />
                                </div>
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className={`p-4 rounded-[1.2rem] shadow-2xl transition-all duration-500 group-hover:scale-110 ${health?.services?.database?.status === 'online' ? 'bg-green-500/10 text-green-500 border border-green-500/20 shadow-green-500/10' : 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-red-500/10'}`}>
                                        <HardDrive size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-1">Database Layer</p>
                                        <div className="flex items-center gap-2">
                                            <p className={`text-xl font-black uppercase tracking-tight ${health?.services?.database?.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                                                {health?.services?.database?.status || 'OFFLINE'}
                                            </p>
                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${health?.services?.database?.status === 'online' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.0 }}
                                className="p-8 bg-[var(--card-bg)]/20 backdrop-blur-3xl border border-[var(--border)] rounded-[2.5rem] flex items-center justify-between group overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                    <Server size={100} />
                                </div>
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="p-4 rounded-[1.2rem] bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-2xl shadow-blue-500/10 transition-all duration-500 group-hover:scale-110">
                                        <Server size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-1">Compute Node</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xl font-black uppercase tracking-tight text-blue-500">
                                                v{health?.services?.backend?.version || '0.0.0'}
                                            </p>
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">STABLE</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Latency</span>
                                    <span className="text-xs font-mono font-bold text-green-500/60">12ms</span>
                                </div>
                            </motion.div>

                            {/* Configuration Status */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.1 }}
                                className="p-10 bg-[var(--card-bg)]/20 backdrop-blur-3xl border border-[var(--border)] rounded-[3rem] md:col-span-2 relative overflow-hidden group"
                            >
                                <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-colors" />
                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Environment Variable Registry</p>
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Active</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 overflow-x-auto relative z-10 custom-scrollbar pb-4 md:pb-0">
                                    {health?.config && Object.entries(health.config).map(([key, value]) => (
                                        <div key={key} className="flex flex-col gap-2 min-w-[120px]">
                                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-30 truncate">{key}</span>
                                            <div className={`px-4 py-3 rounded-2xl border flex items-center justify-center gap-3 transition-all ${value ? 'bg-green-500/5 border-green-500/10 text-green-500' : 'bg-red-500/5 border-red-500/10 text-red-500'}`}>
                                                <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{value ? 'SECURE' : 'MISSING'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Hardware Metrics */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2 }}
                            className="p-10 bg-[var(--card-bg)]/20 backdrop-blur-3xl border border-[var(--border)] rounded-[3rem] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-1">Resource Telemetry</p>
                                    <h4 className="text-xl font-black tracking-tighter uppercase">Hardware Node</h4>
                                </div>
                                <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl shadow-2xl shadow-blue-500/10">
                                    <Cpu size={24} className="animate-pulse" />
                                </div>
                            </div>

                            <div className="space-y-10 relative z-10">
                                <div>
                                    <div className="flex justify-between items-end mb-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Memory Allocation</p>
                                            <p className="text-lg font-black tracking-tight text-blue-500">Heap Utilization</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black tracking-widest opacity-30">LOAD</p>
                                            <p className="text-xl font-mono font-black text-blue-500">
                                                {health ? Math.round(parseInt(health.system.memory.heapUsed) / parseInt(health.system.memory.heapTotal) * 100) : 0}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-blue-500/5 rounded-full overflow-hidden border border-blue-500/10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: health ? (parseInt(health.system.memory.heapUsed) / parseInt(health.system.memory.heapTotal) * 100) + '%' : '0%' }}
                                            transition={{ duration: 2, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 relative"
                                        >
                                            <div className="absolute inset-0 bg-blue-400 blur-[8px] opacity-50" />
                                        </motion.div>
                                    </div>
                                    <div className="flex justify-between mt-3">
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-20 font-mono">
                                            {health?.system?.memory?.heapUsed || '0MB'} IN_USE
                                        </span>
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-20 font-mono">
                                            MAX {health?.system?.memory?.heapTotal || '0MB'}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 border-t border-[var(--border)] pt-8">
                                    <div className="space-y-2 p-4 bg-blue-500/5 rounded-[1.5rem] border border-blue-500/20">
                                        <div className="flex items-center gap-2 opacity-30 mb-1">
                                            <Clock size={14} />
                                            <p className="text-[9px] font-black uppercase tracking-widest">System Uptime</p>
                                        </div>
                                        <p className="text-lg font-black tracking-tight font-mono text-blue-500">
                                            {health ? Math.floor(health.services.backend.uptime / 3600) + 'h ' + Math.floor((health.services.backend.uptime % 3600) / 60) + 'm' : '00:00:00'}
                                        </p>
                                    </div>
                                    <div className="space-y-2 p-4 bg-purple-500/5 rounded-[1.5rem] border border-purple-500/20">
                                        <div className="flex items-center gap-2 opacity-30 mb-1">
                                            <Cpu size={14} />
                                            <p className="text-[9px] font-black uppercase tracking-widest">Logic Cores</p>
                                        </div>
                                        <p className="text-lg font-black tracking-tight font-mono text-purple-500">
                                            0{health?.system?.cpuCount || '0'}_THREADS
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Quick Actions Header with Search and Filter */}
                <div className="mt-20 mb-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase mb-2">QUICK ACTIONS</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Direct interface to administrative modules</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-stretch md:items-center">
                            {/* Search bar */}
                            <div className="relative w-full sm:w-72 lg:w-96">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--foreground)]/30" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search modules..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-6 py-4 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] placeholder-[var(--foreground)]/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>

                            {/* Custom Category Dropdown */}
                            <div className="relative w-full sm:w-56 lg:w-64">
                                <button
                                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    className="w-full px-6 py-4 bg-[var(--card-bg)]/50 backdrop-blur-xl border border-[var(--border)] rounded-2xl text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold flex items-center justify-between group hover:bg-[var(--card-bg)]/70"
                                >
                                    <div className="flex items-center gap-3">
                                        <Filter size={18} className="text-[var(--foreground)]/30 group-hover:text-blue-500 transition-colors" />
                                        <span className="truncate">{filterCategory}</span>
                                    </div>
                                    <ChevronDown size={18} className={`transition-transform duration-300 ${showCategoryDropdown ? 'rotate-180' : ''} opacity-30`} />
                                </button>

                                {showCategoryDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-[60]"
                                            onClick={() => setShowCategoryDropdown(false)}
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="absolute top-full mt-2 left-0 w-full bg-[var(--card-bg)]/90 backdrop-blur-2xl border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-[70] py-2"
                                        >
                                            {categories.map(category => (
                                                <button
                                                    key={category}
                                                    onClick={() => {
                                                        setFilterCategory(category);
                                                        setShowCategoryDropdown(false);
                                                    }}
                                                    className={`w-full px-6 py-3.5 text-left hover:bg-blue-500/10 transition-all font-bold text-sm flex items-center justify-between group ${filterCategory === category ? 'text-blue-500 bg-blue-500/5' : 'text-[var(--foreground)]'
                                                        }`}
                                                >
                                                    <span>{category}</span>
                                                    {filterCategory === category && (
                                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                                    )}
                                                </button>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Grouped Quick Actions */}
                    <div className="space-y-20">
                        {categories.filter(cat => cat !== 'All').map(cat => {
                            const actionsInCat = filteredActions.filter(a => a.category === cat);
                            if (actionsInCat.length === 0) return null;

                            return (
                                <div key={cat} className="space-y-10">
                                    <div className="flex items-center gap-6">
                                        <h3 className="text-xl font-black tracking-[0.4em] uppercase opacity-40">
                                            {cat} <span className="text-blue-500/50 ml-2">Protocols</span>
                                        </h3>
                                        <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {actionsInCat.map((action, i) => (
                                            <motion.div
                                                key={action.href}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className={action.fullWidth ? "md:col-span-2" : ""}
                                            >
                                                <Link
                                                    href={action.href}
                                                    className={`group relative block p-8 sm:p-12 rounded-[3.5rem] bg-[var(--card-bg)]/20 backdrop-blur-3xl border border-[var(--border)] overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:border-${action.color}-500/50 shadow-2xl hover:shadow-${action.color}-500/10`}
                                                >
                                                    <div className={`absolute -top-12 -right-12 p-12 opacity-[0.03] group-hover:opacity-10 transition-all duration-700 text-${action.color}-500 group-hover:scale-125 group-hover:rotate-12`}>
                                                        <action.icon size={180} />
                                                    </div>

                                                    <div className="relative z-10">
                                                        <div className="flex items-start justify-between mb-10">
                                                            <div className={`p-5 bg-${action.color}-500/10 text-${action.color}-500 rounded-[1.8rem] shadow-2xl shadow-${action.color}-500/5 group-hover:scale-110 transition-transform duration-500 border border-${action.color}-500/20`}>
                                                                <action.icon size={32} />
                                                            </div>
                                                            <div className={`px-5 py-2 rounded-full border border-${action.color}-500/10 bg-${action.color}-500/5 text-${action.color}-500 text-[10px] font-black uppercase tracking-[0.2em] transform -translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all`}>
                                                                {action.category}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-4">
                                                                <h3 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
                                                                    {action.title}
                                                                </h3>
                                                                <div className={`w-12 h-px bg-${action.color}-500/20 group-hover:w-24 transition-all duration-700`} />
                                                                <ArrowRight size={24} className={`opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 flex-shrink-0 text-${action.color}-500`} />
                                                            </div>
                                                            <p className="text-lg sm:text-xl text-[var(--foreground-muted)] font-medium leading-relaxed max-w-xl opacity-70 group-hover:opacity-100 transition-opacity">
                                                                {action.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        {filteredActions.length === 0 && (
                            <div className="p-24 bg-[var(--card-bg)]/20 backdrop-blur-xl border border-[var(--border)] border-dashed rounded-[4rem] text-center">
                                <Search className="mx-auto mb-8 opacity-10 animate-pulse text-blue-500" size={80} />
                                <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">NO SEARCH SIGNATURES FOUND</h3>
                                <p className="text-xs font-black uppercase tracking-[0.3em] opacity-30 max-w-md mx-auto">The registry query returned zero modules that match the input criteria.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setFilterCategory('All'); }}
                                    className="mt-10 px-10 py-5 bg-blue-500 hover:bg-blue-400 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl hover:scale-105 active:scale-95"
                                >
                                    Clear Registry Search
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
