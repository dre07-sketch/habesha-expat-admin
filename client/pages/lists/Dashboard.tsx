import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
    Users, FileText, Mic, Video, Calendar,
    Globe, MessageSquare, Mail, MapPin, Star,
    Briefcase, TrendingUp, Building2, ArrowRight,
    Activity, Zap, Award, Crown, Sparkles,
    Bell, Settings, LogOut, Heart
} from 'lucide-react';
import { CITY_COORDINATES, COUNTRY_FLAGS } from '../../cityCoordinates';

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeMetrics, setActiveMetrics] = useState(['users', 'articles', 'businesses']);
    
    // Habesha Expat Premium Palette
    const COLORS = {
        primary: '#3b82f6', // Bright Blue
        secondary: '#8b5cf6', // Violet
        accent: '#f59e0b', // Amber/Gold
        success: '#10b981', // Emerald
        danger: '#ef4444', // Rose
        info: '#0ea5e9', // Sky Blue
        dark: '#0f172a' // Slate 900
    };

    const [dashboardData, setDashboardData] = useState({
        summary: {} as any,
        growth: [] as any[],
        membership: {} as any,
        engagement: {} as any,
        business: {} as any,
        locations: [] as any[]
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [summaryRes, growthRes, membershipRes, engagementRes, businessRes, locationsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/dashboard/summary', { headers }),
                    fetch('http://localhost:5000/api/dashboard/growth', { headers }),
                    fetch('http://localhost:5000/api/dashboard/membership', { headers }),
                    fetch('http://localhost:5000/api/dashboard/engagement', { headers }),
                    fetch('http://localhost:5000/api/dashboard/business', { headers }),
                    fetch('http://localhost:5000/api/dashboard/locations/top', { headers })
                ]);

                const [summary, growth, membership, engagement, business, locations] = await Promise.all([
                    summaryRes.json(),
                    growthRes.json(),
                    membershipRes.json(),
                    engagementRes.json(),
                    businessRes.json(),
                    locationsRes.json()
                ]);

                setDashboardData({
                    summary: summary.data,
                    growth: growth.data,
                    membership: membership.data,
                    engagement: engagement.data,
                    business: business.data,
                    locations: locations.data
                });

                setLoading(false);
            } catch (err) {
                setError('Failed to load dashboard data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const toggleMetric = (metric: string) => {
        setActiveMetrics(prev => 
            prev.includes(metric) 
                ? (prev.length > 1 ? prev.filter(m => m !== metric) : prev) 
                : [...prev, metric]
        );
    };

    if (loading) return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                <div className="relative p-12 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="mt-6 text-sm font-black uppercase tracking-[0.3em] text-slate-400 text-center flex flex-col">
                        <span>Syncing Intelligence</span>
                        <span className="text-[10px] lowercase opacity-50 font-normal mt-1">Fetching real-time data...</span>
                    </p>
                </div>
            </div>
        </div>
    );

    const LOCATION_DATA = (dashboardData.locations || []).map(loc => ({
        name: loc.location,
        value: loc.count,
        flag: COUNTRY_FLAGS[loc.location] || '🌐'
    }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            
            {/* --- SECTION 1: PULSE METRICS (2 Rows, Opportunities Removed) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: 'Total Users', value: dashboardData.summary.users, icon: Users, color: 'blue' },
                    { label: 'Business', value: dashboardData.summary.businesses, icon: Building2, color: 'emerald' },
                    { label: 'Podcasts', value: dashboardData.summary.podcasts, icon: Mic, color: 'rose' },
                    { label: 'Video Feed', value: dashboardData.summary.videos, icon: Video, color: 'sky' },
                    { label: 'Articles', value: dashboardData.summary.articles, icon: FileText, color: 'indigo' },
                    { label: 'Events', value: dashboardData.summary.events, icon: Calendar, color: 'teal' },
                ].map((stat, i) => (
                    <div key={i} className="group relative bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10 flex items-center gap-6">
                            <div className={`p-5 rounded-[2rem] bg-${stat.color}-500/10 text-${stat.color}-500 transform group-hover:rotate-6 transition-transform duration-500`}>
                                {React.createElement(stat.icon, { size: 28 })}
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</h4>
                                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {(stat.value || 0).toLocaleString()}
                                </div>
                                <div className="mt-1 flex items-center gap-1.5 text-emerald-500 font-black text-[10px] uppercase">
                                    <TrendingUp size={12} /> +12% growth
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- SECTION 2: INTERACTIVE GROWTH ENGINE (Full Width, Reduced Height) --- */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative w-full">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <TrendingUp size={150} />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            <Activity className="text-blue-500" />
                            Growth Engine
                        </h2>
                        <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-widest">Global Performance Matrix</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {['users', 'articles', 'businesses', 'videos', 'podcasts'].map((key) => (
                            <button
                                key={key}
                                onClick={() => toggleMetric(key)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                                    activeMetrics.includes(key)
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                {key}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[280px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dashboardData.growth} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradientPrimary" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradientSecondary" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradientInfo" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={COLORS.info} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={COLORS.info} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} fontStyle="bold" tick={{ fill: '#94a3b8' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} fontSize={10} fontStyle="bold" tick={{ fill: '#94a3b8' }} />
                            <RechartsTooltip 
                                contentStyle={{ 
                                    backgroundColor: '#0f172a', 
                                    borderRadius: '20px', 
                                    border: 'none', 
                                    padding: '15px'
                                }}
                                itemStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#fff' }}
                            />
                            {activeMetrics.includes('users') && <Area type="monotone" dataKey="users" stroke={COLORS.primary} strokeWidth={4} fill="url(#gradientPrimary)" />}
                            {activeMetrics.includes('articles') && <Area type="monotone" dataKey="articles" stroke={COLORS.secondary} strokeWidth={4} fill="url(#gradientSecondary)" />}
                            {activeMetrics.includes('videos') && <Area type="monotone" dataKey="videos" stroke={COLORS.info} strokeWidth={4} fill="url(#gradientInfo)" />}
                            {activeMetrics.includes('businesses') && <Area type="monotone" dataKey="businesses" stroke={COLORS.success} strokeWidth={4} fillOpacity={0.1} fill={COLORS.success} />}
                            {activeMetrics.includes('podcasts') && <Area type="monotone" dataKey="podcasts" stroke={COLORS.accent} strokeWidth={4} fillOpacity={0.1} fill={COLORS.accent} />}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* --- SECTION 3: GLOBAL PULSE (Full Width, Map Background & Pie Chart) --- */}
            <div className="bg-slate-900 rounded-[4rem] p-12 text-white relative flex flex-col shadow-2xl overflow-hidden group w-full border border-white/5">
                {/* Immersive Map Background */}
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-center bg-no-repeat bg-contain opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-10000" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900 pointer-events-none" />
                
                <div className="relative z-10 mb-12 flex items-center justify-between">
                    <div>
                        <h3 className="text-3xl font-black tracking-tight flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-2xl">
                                <Globe className="text-blue-400" size={32} />
                            </div>
                            Global Pulse Distribution
                        </h3>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2 ml-16">Real-time Expat Network Mapping & Demographics</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
                    {/* Distribution Pie Chart */}
                    <div className="lg:col-span-4 flex flex-col items-center border-r border-white/10 pr-12">
                        <div className="h-[320px] w-full relative">
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-4xl font-black text-white">{LOCATION_DATA.length}</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hubs</span>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={LOCATION_DATA}
                                        innerRadius={90}
                                        outerRadius={120}
                                        paddingAngle={8}
                                        dataKey="value"
                                        cornerRadius={15}
                                        stroke="transparent"
                                    >
                                        {LOCATION_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={[COLORS.primary, COLORS.secondary, COLORS.success, COLORS.accent, COLORS.danger][index % 5]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Geography List */}
                    <div className="lg:col-span-8 flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                        {LOCATION_DATA.map((loc, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white/[0.03] border border-white/5 p-4 pl-6 rounded-[1.5rem] hover:bg-white/[0.08] transition-all duration-300 group/loc">
                                <div className="flex items-center gap-6">
                                    <div className="text-3xl group-hover/loc:scale-110 transition-transform">
                                        {loc.flag}
                                    </div>
                                    <div>
                                        <div className="font-black text-xs uppercase tracking-widest text-slate-200">{loc.name}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Active Community Hub</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden hidden xl:block">
                                        <div 
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                                            style={{ width: `${(loc.value / Math.max(...LOCATION_DATA.map(l => l.value))) * 100}%` }}
                                        />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-blue-400 tracking-tighter">{loc.value.toLocaleString()}</div>
                                        <div className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase">Members</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- SECTION 4: ECOSYSTEMS (Membership & Directory) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Membership Canvas */}
                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <Crown className="text-amber-500" />
                                Membership Ecosystem
                            </h3>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">Tier Distribution Hub</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dashboardData.membership.distribution || []}
                                        innerRadius={65}
                                        outerRadius={90}
                                        paddingAngle={10}
                                        dataKey="value"
                                        cornerRadius={12}
                                        stroke="transparent"
                                    >
                                        {(dashboardData.membership.distribution || []).map((entry: any, index: number) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                fill={
                                                    entry.name === 'User' ? COLORS.primary : 
                                                    entry.name === 'Member' ? COLORS.success : 
                                                    entry.name === 'Author' ? COLORS.accent : COLORS.secondary
                                                } 
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'User', value: dashboardData.membership.roles?.user, color: 'blue', icon: Globe },
                                { label: 'Member', value: dashboardData.membership.roles?.member, color: 'emerald', icon: Heart },
                                { label: 'Author', value: dashboardData.membership.roles?.author, color: 'amber', icon: Sparkles },
                            ].map((tier, i) => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/30 group hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-lg">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl bg-${tier.color}-500/10 text-${tier.color}-500`}>
                                            <tier.icon size={16} />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-[0.2em]">{tier.label}</span>
                                    </div>
                                    <div className="font-black text-slate-900 dark:text-white">{(tier.value || 0).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Account Health Indicator */}
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between px-2">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase text-slate-400">Active: <span className="text-slate-900 dark:text-white">{dashboardData.membership.status?.active || 0}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-rose-500" />
                                <span className="text-[10px] font-black uppercase text-slate-400">Banned: <span className="text-slate-900 dark:text-white">{dashboardData.membership.status?.banned || 0}</span></span>
                            </div>
                        </div>
                        <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest cursor-pointer hover:underline flex items-center gap-1">
                            Manage Users <ArrowRight size={12} />
                        </div>
                    </div>
                </div>

                {/* Directory Insights */}
                <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <Building2 className="text-indigo-500" />
                                Marketplace Matrix
                            </h3>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">Business Intelligence</p>
                        </div>
                        <div className="bg-indigo-500/10 text-indigo-500 px-5 py-2 rounded-2xl border border-indigo-500/20">
                            <span className="text-xl font-black">{dashboardData.business.total_businesses || 0}</span>
                            <span className="text-[10px] font-black uppercase ml-1 opacity-60">Listing</span>
                        </div>
                    </div>

                    <div className="space-y-5 max-h-[420px] overflow-y-auto pr-4 custom-scrollbar">
                        {(dashboardData.business.categories || []).map((cat: any, i: number) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-slate-500 dark:text-white uppercase tracking-widest">{cat.category}</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">{cat.count}</span>
                                </div>
                                <div className="h-5 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
                                    <div 
                                        className="h-full rounded-xl bg-gradient-to-r from-indigo-600 to-blue-400 group-hover:from-indigo-500 transition-all duration-1000" 
                                        style={{ width: `${Math.round((cat.count / (dashboardData.business.total_businesses || 1)) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- BOTTOM: CONNECTIVITY --- */}
            
        </div>
    );
};

export default Dashboard;
