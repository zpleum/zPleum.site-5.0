"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    TrendingUp,
    Users,
    MousePointer2,
    Calendar,
    RefreshCw,
    Globe,
    FileText,
    BarChart3,
    Trophy
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS modules
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function AnalyticsPage() {
    const [summary, setSummary] = useState<any>(null);
    const [traffic, setTraffic] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sumRes, trafficRes] = await Promise.all([
                fetch('/api/admin/analytics/summary'),
                fetch('/api/admin/analytics/traffic')
            ]);

            if (sumRes.ok && trafficRes.ok) {
                const sumData = await sumRes.json();
                const trafficData = await trafficRes.json();
                setSummary(sumData);
                setTraffic(trafficData.dailyTraffic || []);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    // Chart Data Configs
    const lineChartData = {
        labels: traffic.map(t => new Date(t.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })),
        datasets: [
            {
                label: 'Page Views',
                data: traffic.map(t => t.views),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#3b82f6',
            },
            {
                label: 'Unique Visitors',
                data: traffic.map(t => t.visitors),
                borderColor: '#a855f7',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0,
            }
        ]
    };

    const donutChartData = {
        labels: summary?.categoryDist.map((c: any) => c.category) || [],
        datasets: [{
            data: summary?.categoryDist.map((c: any) => c.count) || [],
            backgroundColor: [
                '#3b82f6', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#64748b'
            ],
            borderWidth: 0,
            hoverOffset: 15
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 12 },
                cornerRadius: 12,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10 } }
            },
            x: {
                grid: { display: false },
                ticks: { color: 'rgba(255, 255, 255, 0.3)', font: { size: 10 } }
            }
        }
    };

    const statsCards = [
        {
            label: "Total Interaction",
            value: summary?.summary.total.total_views || 0,
            sub: "All-time page hits",
            icon: MousePointer2,
            color: "blue"
        },
        {
            label: "Unique Entrants",
            value: summary?.summary.total.unique_visitors || 0,
            sub: "Distinct IP signatures",
            icon: Users,
            color: "purple"
        },
        {
            label: "Daily Velocity",
            value: summary?.summary.today.total_views || 0,
            sub: "Captured in last 24h",
            icon: TrendingUp,
            color: "green"
        },
        {
            label: "Unique Today",
            value: summary?.summary.today.unique_visitors || 0,
            sub: "Real-time identifiers",
            icon: Globe,
            color: "orange"
        }
    ];

    const handleExport = async () => {
        try {
            const res = await fetch('/api/admin/analytics/export');
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `zpleum-registry-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    return (
        <div className="relative min-h-screen bg-[var(--background)] overflow-x-hidden text-[var(--foreground)]">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-500/10 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            </div>

            <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin/dashboard"
                            className="p-3 bg-[var(--muted)]/30 hover:bg-blue-500/10 text-[var(--foreground)] hover:text-blue-500 rounded-2xl transition-all border border-[var(--border)]"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter uppercase">Intelligence Core</h1>
                            <p className="text-xs font-black uppercase tracking-widest opacity-30 mt-1">Foundry Telemetry Matrix</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchData}
                        className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statsCards.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[var(--card-bg)]/40 backdrop-blur-xl border border-[var(--border)] p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group"
                        >
                            <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500 w-fit mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={20} />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-1">{stat.label}</h3>
                            <p className="text-3xl font-black tracking-tighter mb-1">{stat.value.toLocaleString()}</p>
                            <p className="text-sm font-medium opacity-30 uppercase tracking-widest">{stat.sub}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Traffic Chart */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[var(--card-bg)]/40 backdrop-blur-xl border border-[var(--border)] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden h-[450px] flex flex-col">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                                        <BarChart3 className="text-blue-500" size={20} />
                                        Traffic Flux
                                    </h3>
                                    <p className="text-xs font-medium opacity-30 uppercase tracking-widest mt-1">14-Day Propagation Cycle</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm font-black uppercase tracking-widest opacity-40">Views</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500/30"></div>
                                        <span className="text-sm font-black uppercase tracking-widest opacity-40">Uniques</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 w-full relative">
                                {loading ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <Line data={lineChartData} options={chartOptions as any} />
                                )}
                            </div>
                        </div>

                        {/* Top Pages Table */}
                        <div className="bg-[var(--card-bg)]/40 backdrop-blur-xl border border-[var(--border)] rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="p-8 border-b border-[var(--border)]">
                                <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                                    <Trophy className="text-yellow-500" size={20} />
                                    Dominant Nodes
                                </h3>
                                <p className="text-xs font-medium opacity-30 uppercase tracking-widest mt-1">High-Priority Directives</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-[var(--muted)]/10">
                                            <th className="px-8 py-5 text-sm font-black uppercase tracking-widest opacity-40">Endpoint Path</th>
                                            <th className="px-8 py-5 text-sm font-black uppercase tracking-widest opacity-40 text-right">Hit Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summary?.topPages.map((page: any, i: number) => (
                                            <tr key={i} className="border-b border-[var(--border)]/30 hover:bg-blue-500/5 transition-colors group">
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-black text-blue-500 opacity-30">0{i + 1}</span>
                                                        <span className="text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity">{page.path}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 text-right tabular-nums">
                                                    <span className="text-sm font-black text-blue-500">{page.views.toLocaleString()}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Charts & Info */}
                    <div className="space-y-8">
                        <div className="bg-[var(--card-bg)]/40 backdrop-blur-xl border border-[var(--border)] p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center">
                            <h3 className="text-lg font-black uppercase tracking-tighter mb-8 w-full">Category Weight</h3>
                            <div className="relative w-48 h-48 mb-8">
                                <Doughnut data={donutChartData} options={{ ...chartOptions, cutout: '75%' } as any} />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-black tracking-tighter">{summary?.categoryDist.length || 0}</span>
                                    <span className="text-sm font-black uppercase tracking-widest opacity-30">Domains</span>
                                </div>
                            </div>
                            <div className="w-full space-y-3">
                                {summary?.categoryDist.map((c: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center bg-[var(--background)]/30 p-3 rounded-xl border border-[var(--border)]/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: donutChartData.datasets[0].backgroundColor[i] }}></div>
                                            <span className="text-sm font-black uppercase tracking-widest opacity-50">{c.category}</span>
                                        </div>
                                        <span className="text-xs font-bold">{c.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                                <Globe size={120} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-black uppercase tracking-tight mb-4">Export Telemetry</h3>
                                <p className="text-sm opacity-80 mb-8 leading-relaxed">
                                    Aggregate all system logs and traffic analytics into a consolidated JSON archive for external processing.
                                </p>
                                <button
                                    onClick={handleExport}
                                    className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                                >
                                    Download Registry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
