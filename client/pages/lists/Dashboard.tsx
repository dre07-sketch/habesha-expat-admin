import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import {
    Users, FileText, Mic, Video, Calendar, Megaphone,
    Globe, MessageSquare, Mail, MapPin, Star,
    Utensils, Briefcase, Home, Monitor, HeartPulse,
    TrendingUp, Building2, ArrowUpRight, Activity, ArrowRight,
    TrendingDown
} from 'lucide-react';
import { CITY_COORDINATES, COUNTRY_FLAGS } from '../../cityCoordinates';

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        summary: {},
        growth: [],
        membership: {},
        engagement: {},
        business: {},
        locations: []
    });
    
    // State for active metrics in the growth chart
    const [activeMetrics, setActiveMetrics] = useState(['users', 'articles', 'businesses']);
    
    // Function to toggle metrics
    const toggleMetric = (metric) => {
        if (activeMetrics.includes(metric)) {
            // Don't allow removing all metrics
            if (activeMetrics.length > 1) {
                setActiveMetrics(activeMetrics.filter(m => m !== metric));
            }
        } else {
            setActiveMetrics([...activeMetrics, metric]);
        }
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch all dashboard data in parallel
                const [summaryRes, growthRes, membershipRes, engagementRes, businessRes, locationsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/dashboard/summary'),
                    fetch('http://localhost:5000/api/dashboard/growth'),
                    fetch('http://localhost:5000/api/dashboard/membership'),
                    fetch('http://localhost:5000/api/dashboard/engagement'),
                    fetch('http://localhost:5000/api/dashboard/business'),
                    fetch('http://localhost:5000/api/dashboard/locations/top')
                ]);

                // Parse all responses
                const [summary, growth, membership, engagement, business, locations] = await Promise.all([
                    summaryRes.json(),
                    growthRes.json(),
                    membershipRes.json(),
                    engagementRes.json(),
                    businessRes.json(),
                    locationsRes.json()
                ]);

                // Check for errors in responses
                if (!summary.success || !growth.success || !membership.success ||
                    !engagement.success || !business.success || !locations.success) {
                    throw new Error('One or more API requests failed');
                }

                // Set dashboard data
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
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center bg-red-50 p-8 rounded-xl max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-red-700 mb-2">Dashboard Error</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Format membership data for pie chart
    const MEMBERSHIP_DATA = [
        { name: 'Free Members', value: dashboardData.membership.free || 0, color: '#3b82f6' },
        { name: 'Premium Members', value: dashboardData.membership.premium || 0, color: '#1e293b' },
    ];

    // Helper to find coordinates locally since backend mapping was removed
    const getCoordinates = (locationName: string) => {
        if (!locationName) return { top: '50%', left: '50%' };
        // 1. Try exact match
        if (CITY_COORDINATES[locationName]) return CITY_COORDINATES[locationName];

        // 2. Try partial match (e.g. "London, UK" -> "London")
        const key = Object.keys(CITY_COORDINATES).find(k => locationName.includes(k) || k.includes(locationName));
        if (key) return CITY_COORDINATES[key];

        // 3. Fallback to center
        return { top: '50%', left: '50%' };
    };

    // Helper to find flag
    const getFlag = (locationName: string) => {
        if (!locationName) return '🌐';
        if (COUNTRY_FLAGS[locationName]) return COUNTRY_FLAGS[locationName];
        const key = Object.keys(COUNTRY_FLAGS).find(k => locationName.includes(k) || k.includes(locationName));
        return key ? COUNTRY_FLAGS[key] : '🌐';
    };

    // Format location data with flags (simplified for demo)
    const LOCATION_DATA = dashboardData.locations.map(location => ({
        name: location.location,
        value: location.count,
        flag: getFlag(location.location),
        growth: '+12%', // Default growth since API doesn't provide growth
        coordinates: getCoordinates(location.location)
    }));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* --- TOP SUMMARY STATS ROW --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        label: 'Total Users',
                        value: dashboardData.summary.users?.toLocaleString() || '0',
                        badge: '+12%',
                        icon: Users,
                        iconClass: 'bg-blue-600 text-white shadow-blue-600/20',
                        badgeClass: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                        barClass: 'bg-blue-500',
                        progress: 65
                    },
                    {
                        label: 'Businesses',
                        value: dashboardData.summary.businesses?.toLocaleString() || '0',
                        badge: '+18%',
                        icon: Building2,
                        iconClass: 'bg-indigo-600 text-white shadow-indigo-600/20',
                        badgeClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
                        barClass: 'bg-indigo-500',
                        progress: 45
                    },
                    {
                        label: 'Jobs Posted',
                        value: dashboardData.summary.jobs?.toLocaleString() || '0',
                        badge: '+5',
                        icon: Briefcase,
                        iconClass: 'bg-emerald-600 text-white shadow-emerald-600/20',
                        badgeClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
                        barClass: 'bg-emerald-500',
                        progress: 20
                    },
                    {
                        label: 'Total Podcasts',
                        value: dashboardData.summary.podcasts?.toLocaleString() || '0',
                        badge: '+8%',
                        icon: Mic,
                        iconClass: 'bg-rose-600 text-white shadow-rose-600/20',
                        badgeClass: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
                        barClass: 'bg-rose-500',
                        progress: 60
                    },
                    {
                        label: 'Total Videos',
                        value: dashboardData.summary.videos?.toLocaleString() || '0',
                        badge: '+15%',
                        icon: Video,
                        iconClass: 'bg-sky-600 text-white shadow-sky-600/20',
                        badgeClass: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
                        barClass: 'bg-sky-500',
                        progress: 45
                    },
                    {
                        label: 'Articles',
                        value: dashboardData.summary.articles?.toLocaleString() || '0',
                        badge: '+24%',
                        icon: FileText,
                        iconClass: 'bg-purple-600 text-white shadow-purple-600/20',
                        badgeClass: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                        barClass: 'bg-purple-500',
                        progress: 78
                    },
                    {
                        label: 'Events',
                        value: dashboardData.summary.events?.toLocaleString() || '0',
                        badge: '+2',
                        icon: Calendar,
                        iconClass: 'bg-amber-500 text-white shadow-amber-500/20',
                        badgeClass: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
                        barClass: 'bg-amber-500',
                        progress: 80
                    },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden group hover:border-blue-500/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl shadow-lg ${stat.iconClass}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.badgeClass}`}>
                                {stat.badge}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                        </div>
                        <div className="mt-4 w-full bg-slate-100 dark:bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${stat.barClass}`} style={{ width: `${stat.progress}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MONTHLY GROWTH TRENDS CHART --- */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                        <TrendingUp className="text-blue-600 mr-3" size={28} />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Monthly Growth Trends</h2>
                    </div>
                    
                    {/* Metric selector */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'users', label: 'Users', color: 'bg-blue-500' },
                            { key: 'articles', label: 'Articles', color: 'bg-indigo-500' },
                            { key: 'businesses', label: 'Businesses', color: 'bg-slate-500' },
                            { key: 'videos', label: 'Videos', color: 'bg-emerald-500' },
                            { key: 'podcasts', label: 'Podcasts', color: 'bg-purple-500' }
                        ].map((metric) => (
                            <button
                                key={metric.key}
                                className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                    activeMetrics.includes(metric.key) 
                                        ? `${metric.color} text-white` 
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                }`}
                                onClick={() => toggleMetric(metric.key)}
                            >
                                <div className={`w-2 h-2 rounded-full mr-2 ${metric.color}`}></div>
                                {metric.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dashboardData.growth} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorBusinesses" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorVideos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPodcasts" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700/50" />
                            <RechartsTooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg" style={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                                                <p className="font-bold text-white mb-2">{label}</p>
                                                <div className="space-y-1">
                                                    {payload.map((entry, index) => (
                                                        <div key={index} className="flex justify-between">
                                                            <span className="text-blue-400">{entry.dataKey}:</span>
                                                            <span className="text-white font-medium">{entry.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                                cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '5 5' }}
                            />
                            
                            {/* Conditionally render areas based on active metrics */}
                            {activeMetrics.includes('users') && (
                                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                            )}
                            {activeMetrics.includes('articles') && (
                                <Area type="monotone" dataKey="articles" stroke="#6366f1" fillOpacity={1} fill="url(#colorArticles)" strokeWidth={3} />
                            )}
                            {activeMetrics.includes('businesses') && (
                                <Area type="monotone" dataKey="businesses" stroke="#64748b" fillOpacity={1} fill="url(#colorBusinesses)" strokeWidth={3} />
                            )}
                            {activeMetrics.includes('videos') && (
                                <Area type="monotone" dataKey="videos" stroke="#10b981" fillOpacity={1} fill="url(#colorVideos)" strokeWidth={3} />
                            )}
                            {activeMetrics.includes('podcasts') && (
                                <Area type="monotone" dataKey="podcasts" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPodcasts)" strokeWidth={3} />
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Summary stats below the chart */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                    {[
                        { label: 'Users', value: dashboardData.summary.users?.toLocaleString() || '0', change: '+12%', color: 'bg-blue-500' },
                        { label: 'Articles', value: dashboardData.summary.articles?.toLocaleString() || '0', change: '+24%', color: 'bg-indigo-500' },
                        { label: 'Businesses', value: dashboardData.summary.businesses?.toLocaleString() || '0', change: '+18%', color: 'bg-slate-500' },
                        { label: 'Videos', value: dashboardData.summary.videos?.toLocaleString() || '0', change: '+15%', color: 'bg-emerald-500' },
                        { label: 'Podcasts', value: dashboardData.summary.podcasts?.toLocaleString() || '0', change: '+8%', color: 'bg-purple-500' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    stat.change.startsWith('+') 
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                                        : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                                }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                            <div className="text-lg font-bold text-slate-800 dark:text-white">{stat.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- CONTENT ENGAGEMENT & BUSINESS ANALYTICS --- */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* LEFT: Content Engagement */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                            <Globe className="mr-2 text-blue-500" size={20} /> Content Engagement
                        </h2>
                        <button className="text-slate-400 hover:text-blue-500 transition-colors"><ArrowRight size={18} /></button>
                    </div>

                    <div className="space-y-6 mb-10">
                        {/* Progress Items */}
                        {[
                            {
                                label: 'Articles',
                                icon: FileText,
                                views: `${dashboardData.engagement.totals?.total_comments?.toLocaleString() || 0} comments`,
                                pct: 78,
                                color: 'bg-blue-600'
                            },
                            {
                                label: 'Videos',
                                icon: Video,
                                views: `${dashboardData.engagement.topVideos?.reduce((sum, video) => sum + (video.views || 0), 0)?.toLocaleString() || 0} views`,
                                pct: 85,
                                color: 'bg-indigo-500'
                            },
                            {
                                label: 'Podcasts',
                                icon: Mic,
                                views: `${dashboardData.summary.podcasts?.toLocaleString() || 0} episodes`,
                                pct: 72,
                                color: 'bg-slate-500'
                            },
                            {
                                label: 'Events',
                                icon: Calendar,
                                views: `${dashboardData.summary.events?.toLocaleString() || 0} events`,
                                pct: 91,
                                color: 'bg-blue-400'
                            },
                            {
                                label: 'Directory',
                                icon: MapPin,
                                views: `${dashboardData.business.total_businesses?.toLocaleString() || 0} businesses`,
                                pct: 68,
                                color: 'bg-slate-600'
                            },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-center mb-2 text-sm">
                                    <div className="flex items-center font-medium text-slate-700 dark:text-slate-200">
                                        <item.icon size={16} className="mr-3 text-slate-400" /> {item.label}
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-slate-500 dark:text-slate-400 mr-3 text-xs">{item.views}</span>
                                        <span className="font-bold text-blue-600 dark:text-blue-400">{item.pct}%</span>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="p-2 w-fit rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-3">
                                <FileText size={18} />
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Articles</div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{dashboardData.summary.articles?.toLocaleString() || 0}</div>
                            <div className="text-xs font-bold text-blue-500 mt-1">+24</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="p-2 w-fit rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-3">
                                <MessageSquare size={18} />
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Comments</div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{dashboardData.engagement.totals?.total_comments?.toLocaleString() || 0}</div>
                            <div className="text-xs font-bold text-indigo-500 mt-1">+142</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="p-2 w-fit rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-3">
                                <Mail size={18} />
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Subscribers</div>
                            <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{dashboardData.summary.subscribers?.toLocaleString() || 0}</div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">+324</div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Business Directory Analytics */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                            <MapPin className="mr-2 text-slate-500" size={20} /> Business Directory Analytics
                        </h2>
                    </div>

                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-slate-800 dark:bg-slate-900 p-4 rounded-xl border border-slate-700 dark:border-slate-800 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="p-2 w-fit rounded-lg bg-blue-500/20 text-blue-400 mb-3">
                                    <MapPin size={18} />
                                </div>
                                <div className="text-xs text-slate-400 font-medium">Total Businesses</div>
                                <div className="text-2xl font-bold mt-1">{dashboardData.business.total_businesses?.toLocaleString() || 0}</div>
                                <div className="text-xs font-bold text-blue-400 mt-1">+32</div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        </div>
                        <div className="bg-slate-800 dark:bg-slate-900 p-4 rounded-xl border border-slate-700 dark:border-slate-800 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="p-2 w-fit rounded-lg bg-indigo-500/20 text-indigo-400 mb-3">
                                    <Star size={18} />
                                </div>
                                <div className="text-xs text-slate-400 font-medium">Reviews</div>
                                <div className="text-2xl font-bold mt-1">{dashboardData.business.reviews?.total_reviews?.toLocaleString() || 0}</div>
                                <div className="text-xs font-bold text-indigo-400 mt-1">+87</div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        </div>
                        <div className="bg-slate-800 dark:bg-slate-900 p-4 rounded-xl border border-slate-700 dark:border-slate-800 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="p-2 w-fit rounded-lg bg-slate-600/20 text-slate-300 mb-3">
                                    <FileText size={18} />
                                </div>
                                <div className="text-xs text-slate-400 font-medium">Avg Rating</div>
                                <div className="text-2xl font-bold mt-1">{dashboardData.business.reviews?.avg_rating || '0.0'}</div>
                                <div className="text-xs font-bold text-slate-300 mt-1">+0.2</div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-slate-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-5">Popular Categories</h3>
                    <div className="space-y-5">
                        {dashboardData.business.categories?.map((cat, i) => {
                            // Calculate percentage based on total businesses
                            const percentage = Math.round((cat.count / dashboardData.business.total_businesses) * 100);

                            return (
                                <div key={i}>
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex items-center">
                                            <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mr-3">
                                                <Briefcase size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{cat.category}</div>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-3">
                                            <span className="font-bold text-slate-800 dark:text-white">{cat.count}</span>
                                            <span className="text-xs font-bold text-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">+12%</span>
                                        </div>
                                    </div>
                                    <div className="relative pt-1">
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-slate-800 dark:bg-blue-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <div className="text-[10px] text-slate-400 text-right mt-1">{percentage}%</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* GLOBAL USER MAP */}
            <div className="bg-white dark:bg-[#0f172a] text-slate-800 dark:text-white p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden flex flex-col min-h-[500px]">
                {/* Map Background */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center bg-no-repeat pointer-events-none dark:invert"></div>

                {/* Animated Map Markers (Simulated) */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* North America */}
                    <span className="absolute top-[30%] left-[20%] w-3 h-3 bg-blue-500 rounded-full animate-ping"></span>
                    <span className="absolute top-[30%] left-[20%] w-3 h-3 bg-blue-500 rounded-full"></span>

                    <span className="absolute top-[35%] left-[15%] w-2 h-2 bg-indigo-500 rounded-full animate-ping delay-700"></span>
                    <span className="absolute top-[35%] left-[15%] w-2 h-2 bg-indigo-500 rounded-full"></span>

                    {/* Europe */}
                    <span className="absolute top-[25%] left-[48%] w-3 h-3 bg-emerald-500 rounded-full animate-ping delay-300"></span>
                    <span className="absolute top-[25%] left-[48%] w-3 h-3 bg-emerald-500 rounded-full"></span>

                    {/* Africa (Ethiopia approx) */}
                    <span className="absolute top-[45%] left-[53%] w-4 h-4 bg-amber-500 rounded-full animate-ping delay-500"></span>
                    <span className="absolute top-[45%] left-[53%] w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.6)]"></span>

                    {/* Asia */}
                    <span className="absolute top-[30%] left-[70%] w-2 h-2 bg-purple-500 rounded-full animate-ping delay-1000"></span>
                    <span className="absolute top-[30%] left-[70%] w-2 h-2 bg-purple-500 rounded-full"></span>
                </div>

                <div className="relative z-10 flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center"><Globe className="mr-3 text-blue-500 dark:text-blue-400" /> Global Community</h2>
                        <p className="text-slate-500 dark:text-slate-300 text-sm mt-1 dark:shadow-black dark:drop-shadow-md">Real-time user activity map.</p>
                    </div>
                    <div className="flex gap-2 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Live</span>
                    </div>
                </div>

                {/* OVERLAY STATS: Top Active Regions - Cool Glassmorphic Style */}
                <div className="absolute left-8 top-28 z-20 w-72 bg-white/60 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-left-4 duration-700">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-white/10">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Top Active Regions</h3>
                        <Globe size={14} className="text-blue-500 dark:text-blue-400 opacity-70" />
                    </div>

                    <div className="space-y-4">
                        {LOCATION_DATA.map((loc, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <div className="flex items-center text-slate-600 dark:text-slate-200 font-medium">
                                        <span className="mr-2 text-base">{loc.flag}</span> {loc.name}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-800 dark:text-white">{loc.value.toLocaleString()}</span>
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1 rounded">{loc.growth}</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-indigo-500' : 'bg-slate-500'}`}
                                        style={{ width: `${(loc.value / Math.max(...LOCATION_DATA.map(l => l.value))) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/5 text-center">
                        <button className="text-xs text-blue-500 dark:text-blue-400 hover:text-slate-800 dark:hover:text-white transition-colors font-bold uppercase tracking-wider flex items-center justify-center w-full">
                            View Full Report <ArrowRight size={12} className="ml-1" />
                        </button>
                    </div>
                </div>
            </div>

            {/* MEMBERSHIP DISTRIBUTION - Enhanced with cool pie chart */}
            {/* MEMBERSHIP DISTRIBUTION - Enhanced with cool pie chart */}
<div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl"></div>
    <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl"></div>
    
    <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                <Users className="mr-2 text-blue-500" size={20} /> Membership Distribution
            </h2>
            <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                LIVE DATA
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Enhanced Pie Chart Section */}
            <div className="lg:col-span-1 flex flex-col items-center">
                <div className="relative h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={MEMBERSHIP_DATA}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                                animationDuration={1000}
                                animationEasing="ease-out"
                            >
                                {MEMBERSHIP_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip
                                contentStyle={{ 
                                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                                    borderColor: '#334155', 
                                    borderRadius: '0.75rem', 
                                    color: '#f8fafc',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)'
                                }}
                                itemStyle={{ color: '#f8fafc' }}
                                formatter={(value) => [`${value} members`, '']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Center content with animation */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="text-4xl font-bold text-slate-800 dark:text-white animate-pulse">
                            {dashboardData.membership.total?.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mt-1">Total Members</div>
                    </div>
                </div>
                
                {/* Legend with icons */}
                <div className="flex justify-center gap-6 mt-4">
                    {MEMBERSHIP_DATA.map((item, index) => (
                        <div key={index} className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                            <span className="text-xs text-slate-600 dark:text-slate-300">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Enhanced Stats Cards Section */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Members Card */}
                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mr-4 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                <Users size={28} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">Free Members</div>
                                <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                                    {dashboardData.membership.free?.toLocaleString() || 0}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                                {dashboardData.membership.trends?.free || '+8%'}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">vs last month</span>
                        </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                            <span>Percentage</span>
                            <span>{dashboardData.membership.free_percentage || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${dashboardData.membership.free_percentage || 0}%` }}
                            ></div>
                        </div>
                    </div>
                    
                    {/* Stats row */}
                    <div className="flex justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="text-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Avg. Activity</div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white">
                                {dashboardData.membership.free_metrics?.avg_activity || '3.2/week'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Retention</div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white">
                                {dashboardData.membership.free_metrics?.retention || 42}%
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Conversion</div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white">
                                {dashboardData.membership.free_metrics?.conversion || 5.8}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium Members Card */}
                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white mr-4 shadow-lg shadow-slate-700/20 group-hover:scale-105 transition-transform">
                                <Star size={28} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">Premium Members</div>
                                <div className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                                    {dashboardData.membership.premium?.toLocaleString() || 0}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30 px-2 py-1 rounded-full">
                                {dashboardData.membership.trends?.premium || '+15%'}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">vs last month</span>
                        </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                            <span>Percentage</span>
                            <span>{dashboardData.membership.premium_percentage || 0}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-slate-600 to-slate-800 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${dashboardData.membership.premium_percentage || 0}%` }}
                            ></div>
                        </div>
                    </div>
                    
                    {/* Stats row */}
                    <div className="flex justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="text-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Avg. Activity</div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white">
                                {dashboardData.membership.premium_metrics?.avg_activity || '8.7/week'}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Retention</div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white">
                                {dashboardData.membership.premium_metrics?.retention || 87}%
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400">Revenue</div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white">
                                {dashboardData.membership.premium_metrics?.revenue || '$24.8K'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Additional insights */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Conversion Rate</div>
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">
                            {dashboardData.membership.insights?.conversion_rate || 5.8}%
                        </span>
                        <span className={`ml-2 text-xs font-bold flex items-center ${
                            dashboardData.membership.trends?.conversion_rate?.startsWith('+') 
                                ? 'text-emerald-500' 
                                : 'text-rose-500'
                        }`}>
                            {dashboardData.membership.trends?.conversion_rate?.startsWith('+') 
                                ? <TrendingUp size={12} className="mr-1" /> 
                                : <TrendingDown size={12} className="mr-1" />
                            }
                            {dashboardData.membership.trends?.conversion_rate || '+1.2%'}
                        </span>
                    </div>
                </div>
                <div className="flex-1 min-w-[200px] bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg. Premium Tenure</div>
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">
                            {dashboardData.membership.insights?.avg_premium_tenure || 14.2}
                        </span>
                        <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">months</span>
                        <span className={`ml-2 text-xs font-bold flex items-center ${
                            dashboardData.membership.trends?.avg_premium_tenure?.startsWith('+') 
                                ? 'text-emerald-500' 
                                : 'text-rose-500'
                        }`}>
                            {dashboardData.membership.trends?.avg_premium_tenure?.startsWith('+') 
                                ? <TrendingUp size={12} className="mr-1" /> 
                                : <TrendingDown size={12} className="mr-1" />
                            }
                            {dashboardData.membership.trends?.avg_premium_tenure || '+2.4'}
                        </span>
                    </div>
                </div>
                <div className="flex-1 min-w-[200px] bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Churn Rate</div>
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">
                            {dashboardData.membership.insights?.churn_rate || 3.2}%
                        </span>
                        <span className={`ml-2 text-xs font-bold flex items-center ${
                            dashboardData.membership.trends?.churn_rate?.startsWith('-') 
                                ? 'text-emerald-500' 
                                : 'text-rose-500'
                        }`}>
                            {dashboardData.membership.trends?.churn_rate?.startsWith('-') 
                                ? <TrendingDown size={12} className="mr-1" /> 
                                : <TrendingUp size={12} className="mr-1" />
                            }
                            {dashboardData.membership.trends?.churn_rate || '-0.8%'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

        </div>
    );
};

export default Dashboard;