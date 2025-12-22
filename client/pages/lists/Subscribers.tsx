import React, { useState, useEffect } from 'react';
import { Send, Mail, Calendar, Zap, Search, Filter, MoreHorizontal, ArrowUpRight, Users, BarChart2, CheckCircle, Clock, MousePointer, Eye, User, Monitor } from 'lucide-react';
import Modal from '../../components/Modal';
import NewsletterForm from '../../components/forms/NewsletterForm';
import { Subscriber, Newsletter } from '../../types';

const Subscribers: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
    const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns'>('subscribers');
    const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
    const [loading, setLoading] = useState(true);
    const [newslettersLoading, setNewslettersLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newslettersError, setNewslettersError] = useState<string | null>(null);

    const [subSearch, setSubSearch] = useState('');
    const [newsSearch, setNewsSearch] = useState('');

    // Define API Base URL
    const API_BASE_URL = 'http://localhost:5000';

    // Fetch subscribers from API
    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/api/subscribers/subscribers-get`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch subscribers');
                }
                const data = await response.json();
                setSubscribers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, []);

    // Fetch newsletters from API
    useEffect(() => {
        const fetchNewsletters = async () => {
            try {
                setNewslettersLoading(true);
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/api/newsletters/newsletters-get`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch newsletters');
                }
                const data = await response.json();
                setNewsletters(data);
            } catch (err) {
                setNewslettersError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setNewslettersLoading(false);
            }
        };

        fetchNewsletters();
    }, []);

    const filteredSubscribers = subscribers.filter(sub =>
        (sub.name?.toLowerCase().includes(subSearch.toLowerCase()) || '') ||
        sub.email.toLowerCase().includes(subSearch.toLowerCase())
    );

    const filteredNewsletters = newsletters.filter(news =>
        news.subject.toLowerCase().includes(newsSearch.toLowerCase()) ||
        news.status.toLowerCase().includes(newsSearch.toLowerCase())
    );

    // Helper to construct image URL
    const getImageUrl = (imagePath: string | undefined) => {
        if (!imagePath) return null;
        // If the path from DB is like "/upload/123.jpg", prepend the localhost URL
        return `${API_BASE_URL}${imagePath}`;
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Audience & Campaigns</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your subscriber base and email newsletters.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <Send size={20} className="mr-2" /> Create Campaign
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl mb-6 w-fit border border-slate-200 dark:border-slate-700/60">
                <button
                    onClick={() => setActiveTab('subscribers')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === 'subscribers' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <Users size={16} className="mr-2" /> Subscribers
                </button>
                <button
                    onClick={() => setActiveTab('campaigns')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === 'campaigns' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <Mail size={16} className="mr-2" /> Newsletters
                </button>
            </div>

            {activeTab === 'subscribers' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search subscribers by email or name..."
                                value={subSearch}
                                onChange={(e) => setSubSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                            />
                        </div>
                        <button className="flex items-center justify-center px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors shadow-sm">
                            <Filter size={18} className="mr-2" /> Filter Segment
                        </button>
                    </div>

                    {/* List View */}
                    <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                <p className="mt-2 text-slate-500 dark:text-slate-400">Loading subscribers...</p>
                            </div>
                        ) : error ? (
                            <div className="p-8 text-center">
                                <p className="text-red-500 dark:text-red-400">Error: {error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/60">
                                        <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subscriber</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Plan</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Source</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-800/0">
                                            {filteredSubscribers.length > 0 ? (
                                                filteredSubscribers.map((sub) => (
                                                    <tr key={sub.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors duration-200">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="relative">
                                                                    <img className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" src={sub.avatar || `https://ui-avatars.com/api/?name=${sub.email}&background=random`} alt="" />
                                                                    <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-800 ${sub.status === 'active' ? 'bg-emerald-500' : sub.status === 'bounced' ? 'bg-red-500' : 'bg-slate-400'}`}></span>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{sub.name || 'Unknown User'}</div>
                                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{sub.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${sub.plan === 'Premium'
                                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                                                }`}>
                                                                {sub.plan === 'Premium' && <Zap size={10} className="mr-1 fill-current" />}
                                                                {sub.plan || 'Free'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                            {sub.source || 'Website'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                                                <Calendar size={14} className="mr-1.5 text-slate-400" />
                                                                {sub.joinedDate}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${sub.status === 'active'
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                                : sub.status === 'bounced'
                                                                    ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                                }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${sub.status === 'active' ? 'bg-emerald-500' : sub.status === 'bounced' ? 'bg-red-500' : 'bg-slate-500'
                                                                    }`}></span>
                                                                {sub.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button className="text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                                                                <MoreHorizontal size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                                        No subscribers found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Visual */}
                                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Showing {filteredSubscribers.length} results</span>
                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">Prev</button>
                                        <button className="px-3 py-1 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Next</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'campaigns' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Newsletter Search */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search newsletters..."
                                value={newsSearch}
                                onChange={(e) => setNewsSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {newslettersLoading ? (
                            <div className="p-8 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                <p className="mt-2 text-slate-500 dark:text-slate-400">Loading newsletters...</p>
                            </div>
                        ) : newslettersError ? (
                            <div className="p-8 text-center">
                                <p className="text-red-500 dark:text-red-400">Error: {newslettersError}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : filteredNewsletters.length > 0 ? (
                            filteredNewsletters.map((news) => (
                                <div
                                    key={news.id}
                                    onClick={() => setSelectedNewsletter(news)}
                                    className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row gap-6 items-start md:items-center"
                                >
                                    {/* Icon Status Box */}
                                    <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${news.status === 'Sent' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        news.status === 'Scheduled' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                            'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                        }`}>
                                        {news.status === 'Sent' ? <CheckCircle size={24} /> : news.status === 'Scheduled' ? <Clock size={24} /> : <Mail size={24} />}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{news.subject}</h3>
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide w-fit mt-2 md:mt-0 ${news.status === 'Sent' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                                news.status === 'Scheduled' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                                    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }`}>
                                                {news.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 space-x-4">
                                            <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> {news.sentDate}</span>
                                            <span className="flex items-center"><Users size={14} className="mr-1.5" /> {news.segment}</span>
                                        </div>
                                    </div>

                                    {/* Quick Stats (Only for Sent) */}
                                    {news.status === 'Sent' && (
                                        <div className="flex space-x-6 border-l border-slate-100 dark:border-slate-700 pl-6 py-1">
                                            <div>
                                                <div className="text-2xl font-bold text-slate-800 dark:text-white">{news.openRate}</div>
                                                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center"><Eye size={10} className="mr-1" /> Open Rate</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-slate-800 dark:text-white">{news.clickRate}</div>
                                                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center"><MousePointer size={10} className="mr-1" /> Clicks</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                No newsletters found.
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Create Email Campaign" maxWidth="max-w-3xl">
                <NewsletterForm onSubmit={() => setIsFormOpen(false)} onCancel={() => setIsFormOpen(false)} />
            </Modal>

            {/* Campaign Details Modal */}
            <Modal isOpen={!!selectedNewsletter} onClose={() => setSelectedNewsletter(null)} title="" maxWidth="max-w-6xl">
                {selectedNewsletter && (
                    <div className="flex flex-col h-[85vh] bg-slate-50 dark:bg-slate-900">
                        {/* 1. HEADER SECTION (Simplified - No Buttons) */}
                        <div className="px-8 py-5 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex flex-col justify-center shrink-0">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`flex h-2.5 w-2.5 rounded-full ${selectedNewsletter.status === 'Sent' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                    selectedNewsletter.status === 'Scheduled' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                                        'bg-slate-400'
                                    }`}></span>
                                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                                    {selectedNewsletter.status}
                                </span>
                            </div>
                            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight line-clamp-1">
                                {selectedNewsletter.subject}
                            </h2>
                        </div>

                        {/* 2. MAIN CONTENT AREA (Full Width) */}
                        <div className="flex-1 w-full bg-slate-200 dark:bg-slate-950/50 overflow-hidden flex flex-col">

                            {/* Mock Browser Toolbar */}
                            <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-center shrink-0">
                                <div className="w-full max-w-4xl flex items-center justify-between">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                        <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                        <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 px-6 py-1 rounded-md text-xs text-slate-400 font-mono flex items-center shadow-sm border border-slate-200 dark:border-slate-700">
                                        <span className="text-emerald-500 mr-2">🔒</span> habeshaexpat.com/newsletter/{selectedNewsletter.id}
                                    </div>
                                    <div className="w-8"></div> {/* Spacer for balance */}
                                </div>
                            </div>

                            {/* SCROLLABLE ARTICLE AREA */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 flex justify-center">
                                <div className="bg-white dark:bg-slate-800 w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-700 min-h-fit h-fit">

                                    {/* Hero Image - UPDATED SRC */}
                                    {selectedNewsletter.image && (
                                        <div className="w-full h-72 sm:h-96 overflow-hidden relative group">
                                            <img
                                                src={getImageUrl(selectedNewsletter.image) || ''}
                                                alt="Header"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                        </div>
                                    )}

                                    {/* Email Body */}
                                    <div className="px-8 py-10 sm:px-16 sm:py-14">
                                        <div className="mb-10 border-b border-slate-100 dark:border-slate-700 pb-8 text-center">
                                            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                                                {selectedNewsletter.subject}
                                            </h1>
                                            <div className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 font-sans">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold mr-3">H</div>
                                                <span>By <span className="text-slate-800 dark:text-slate-200 font-semibold">Habesha Expat Team</span></span>
                                                <span className="mx-3">•</span>
                                                <span>{selectedNewsletter.sentDate || "Draft"}</span>
                                            </div>
                                        </div>

                                        {/* THE FORMATTED CONTENT */}
                                        <div
                                            className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
                                            dangerouslySetInnerHTML={{
                                                __html: (() => {
                                                    // TEXT FORMATTER LOGIC
                                                    const text = selectedNewsletter.content || "";
                                                    if (!text) return '<p class="text-slate-400 italic text-center">No content available.</p>';

                                                    return text
                                                        .split(/\n\s*\n/) // Split by empty lines
                                                        .map(paragraph => {
                                                            const cleanText = paragraph.trim();
                                                            if (!cleanText) return '';
                                                            // Styled Paragraph with spacing
                                                            return `<p style="margin-bottom: 28px; font-family: 'Georgia', 'Times New Roman', serif; font-size: 19px; line-height: 1.8; color: inherit;">${cleanText}</p>`;
                                                        })
                                                        .join('');
                                                })()
                                            }}
                                        />

                                        {/* Footer */}
                                        <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-700 text-center">
                                            <p className="text-slate-400 text-sm mb-4">© 2024 Habesha Expat. All rights reserved.</p>
                                            <div className="flex justify-center gap-4 text-xs text-blue-500">
                                                <span className="cursor-pointer hover:underline">Unsubscribe</span>
                                                <span>•</span>
                                                <span className="cursor-pointer hover:underline">View in Browser</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Subscribers;