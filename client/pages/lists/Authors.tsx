import React, { useState, useEffect } from 'react';
import {
    Eye, CheckCircle, XCircle, Search, UserPlus,
    Shield, Activity, Download, ExternalLink, Award,
    MoreVertical, X, Edit2, Monitor, PenTool
} from 'lucide-react';
import Modal from '../../components/Modal';

interface AuthorProfile {
    profile_id: number;
    user_id: number;
    name: string;
    email: string;
    avatar_url?: string;
    portfolio_url?: string;
    experience: string;
    previous_work?: string;
    cv_filename?: string;
    author_status: 'pending' | 'active' | 'declined';
    applied_at: string;
}

const Authors: React.FC = () => {
    // ── List state ──
    const [authors, setAuthors] = useState<AuthorProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // ── Detail modal ──
    const [selectedAuthor, setSelectedAuthor] = useState<AuthorProfile | null>(null);

    // ── Register form modal ──
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [eligibleUsers, setEligibleUsers] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        user_id: '',
        portfolio_url: '',
        experience: '',
        previous_work: ''
    });
    const [cvFile, setCvFile] = useState<File | null>(null);

    // ── Approve / Decline ──
    const [confirmingAction, setConfirmingAction] = useState<{
        profileId: number;
        action: 'approve' | 'decline';
    } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    // ─────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────
    const token = () => localStorage.getItem('authToken') || '';

    const getAvatar = (name: string, url?: string) =>
        url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

    const formatDate = (d: string) => {
        const date = new Date(d);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const mins = Math.floor(diff / 60000);
        const hrs = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        if (hrs < 24) return `${hrs}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    // ─────────────────────────────────────────────
    // Fetch authors
    // ─────────────────────────────────────────────
    const fetchAuthors = async () => {
        try {
            setIsLoading(true);
            const res = await fetch('http://localhost:5000/api/authors', {
                headers: { Authorization: `Bearer ${token()}` }
            });
            const data = await res.json();
            if (data.success) setAuthors(data.data);
        } catch (e) {
            console.error('fetchAuthors error', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchAuthors(); }, []);

    // Fetch eligible (non-author) users for the register form
    const fetchEligibleUsers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/authors/eligible-users', {
                headers: { Authorization: `Bearer ${token()}` }
            });
            const data = await res.json();
            if (data.success) setEligibleUsers(data.data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (isRegisterOpen) fetchEligibleUsers();
    }, [isRegisterOpen]);

    // ─────────────────────────────────────────────
    // Approve / Decline handlers
    // ─────────────────────────────────────────────
    const handleApprove = async (profileId: number) => {
        try {
            setIsProcessing(true);
            setActionError(null);
            setConfirmingAction(null);

            // Optimistic update
            setAuthors(prev => prev.map(a =>
                a.profile_id === profileId ? { ...a, author_status: 'active' } : a
            ));

            const res = await fetch(`http://localhost:5000/api/authors/approve/${profileId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token()}` }
            });
            const data = await res.json();
            if (!data.success) {
                setActionError(data.message || 'Failed to approve');
                fetchAuthors(); // revert
            } else {
                fetchAuthors();
            }
        } catch {
            setActionError('Network error — please try again.');
            fetchAuthors();
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDecline = async (profileId: number) => {
        try {
            setIsProcessing(true);
            setActionError(null);
            setConfirmingAction(null);

            // Optimistic update
            setAuthors(prev => prev.map(a =>
                a.profile_id === profileId ? { ...a, author_status: 'declined' } : a
            ));

            const res = await fetch(`http://localhost:5000/api/authors/decline/${profileId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token()}` }
            });
            const data = await res.json();
            if (!data.success) {
                setActionError(data.message || 'Failed to decline');
                fetchAuthors();
            }
        } catch {
            setActionError('Network error — please try again.');
            fetchAuthors();
        } finally {
            setIsProcessing(false);
        }
    };

    // ─────────────────────────────────────────────
    // Register form submit
    // ─────────────────────────────────────────────
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('user_id', formData.user_id);
            fd.append('portfolio_url', formData.portfolio_url);
            fd.append('experience', formData.experience);
            fd.append('previous_work', formData.previous_work);
            if (cvFile) fd.append('cv', cvFile);

            const res = await fetch('http://localhost:5000/api/authors/register', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token()}` },
                body: fd
            });
            const data = await res.json();
            if (data.success) {
                setIsRegisterOpen(false);
                setFormData({ user_id: '', portfolio_url: '', experience: '', previous_work: '' });
                setCvFile(null);
                fetchAuthors();
            } else {
                alert(data.message || 'Failed to register author');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredAuthors = authors.filter(a =>
        (a.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (a.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const pendingCount = authors.filter(a => a.author_status === 'pending').length;

    // ─────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────
    return (
        <div className="animate-in fade-in duration-500">

            {/* ── Page header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <PenTool size={22} className="text-indigo-500" />
                        Author Management
                        {pendingCount > 0 && (
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase rounded-md border border-amber-500/20 animate-pulse">
                                {pendingCount} pending
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                        Review applications, approve or decline author profiles.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search authors..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm text-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsRegisterOpen(true)}
                        className="bg-slate-900 border border-slate-700/50 text-white px-4 py-2.5 rounded-xl flex items-center font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                    >
                        <UserPlus size={14} className="mr-2 text-indigo-400" /> Add Author
                    </button>
                </div>
            </div>

            {/* ── Error banner ── */}
            {actionError && (
                <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-xs font-bold">
                    <XCircle size={16} /> {actionError}
                    <button onClick={() => setActionError(null)} className="ml-auto text-red-400 hover:text-red-300">
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* ── Table ── */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/60">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Author</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied</th>
                                <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center">
                                        <div className="flex justify-center mb-3">
                                            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                        <p className="text-slate-400 text-sm">Loading authors...</p>
                                    </td>
                                </tr>
                            ) : filteredAuthors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center">
                                        <PenTool size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                                        <p className="text-slate-400 text-sm">No author profiles found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredAuthors.map(author => {
                                    const isConfirming = confirmingAction?.profileId === author.profile_id;
                                    const isThisRowProcessing = isProcessing && isConfirming;
                                    return (
                                        <React.Fragment key={author.profile_id}>
                                            <tr className={`group transition-colors duration-200 ${isConfirming ? 'bg-amber-50/60 dark:bg-amber-900/10' : 'hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10'}`}>
                                                {/* Author column */}
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={getAvatar(author.name, author.avatar_url)}
                                                            alt=""
                                                            className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-700 shadow-sm object-cover"
                                                        />
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                                                                {author.name}
                                                            </div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                                                {author.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Experience */}
                                                <td className="px-4 py-4 max-w-[220px]">
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                        {author.experience}
                                                    </p>
                                                </td>

                                                {/* Status badge */}
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${author.author_status === 'active'
                                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                        : author.author_status === 'declined'
                                                            ? 'bg-red-500/10 text-red-600 border-red-500/20'
                                                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse'
                                                        }`}>
                                                        {author.author_status === 'active' && <CheckCircle size={10} />}
                                                        {author.author_status === 'declined' && <XCircle size={10} />}
                                                        {author.author_status === 'pending' && <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />}
                                                        {author.author_status}
                                                    </span>
                                                </td>

                                                {/* Applied date */}
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-mono">
                                                    {formatDate(author.applied_at)}
                                                </td>

                                                {/* Action buttons — always visible, context-aware */}
                                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Always: Details */}
                                                        <button
                                                            onClick={() => setSelectedAuthor(author)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                                        >
                                                            <Eye size={13} /> Details
                                                        </button>

                                                        {/* Approve — show when NOT already active */}
                                                        {author.author_status !== 'active' && !isConfirming && (
                                                            <button
                                                                onClick={() => setConfirmingAction({ profileId: author.profile_id, action: 'approve' })}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-500/20"
                                                            >
                                                                <CheckCircle size={13} /> Approve
                                                            </button>
                                                        )}

                                                        {/* Decline — show when NOT already declined */}
                                                        {author.author_status !== 'declined' && !isConfirming && (
                                                            <button
                                                                onClick={() => setConfirmingAction({ profileId: author.profile_id, action: 'decline' })}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:hover:border-red-700 transition-all"
                                                            >
                                                                <XCircle size={13} /> Decline
                                                            </button>
                                                        )}

                                                        {isConfirming && (
                                                            <button
                                                                onClick={() => setConfirmingAction(null)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-300 transition-all"
                                                            >
                                                                <X size={13} /> Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* ── Inline confirm bar ── */}
                                            {isConfirming && (
                                                <tr className="animate-in slide-in-from-top-1 duration-200">
                                                    <td colSpan={5} className={`px-5 py-4 border-b ${confirmingAction?.action === 'approve'
                                                        ? 'bg-emerald-500/5 border-emerald-500/20'
                                                        : 'bg-red-500/5 border-red-500/20'
                                                        }`}>
                                                        <div className="flex items-center justify-between gap-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmingAction?.action === 'approve'
                                                                    ? 'bg-emerald-500/10'
                                                                    : 'bg-red-500/10'
                                                                    }`}>
                                                                    {confirmingAction?.action === 'approve'
                                                                        ? <CheckCircle size={18} className="text-emerald-500" />
                                                                        : <XCircle size={18} className="text-red-500" />
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                                                                        {confirmingAction?.action === 'approve'
                                                                            ? `Approve "${author.name}" as an Author?`
                                                                            : `Decline "${author.name}"'s application?`}
                                                                    </p>
                                                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                                                        {confirmingAction?.action === 'approve'
                                                                            ? 'Their role will be set to Author and their profile activated.'
                                                                            : 'Their application status will be marked as declined.'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 shrink-0">
                                                                <button
                                                                    disabled={isThisRowProcessing}
                                                                    onClick={() => {
                                                                        if (confirmingAction?.action === 'approve') {
                                                                            handleApprove(author.profile_id);
                                                                        } else {
                                                                            handleDecline(author.profile_id);
                                                                        }
                                                                    }}
                                                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 ${confirmingAction?.action === 'approve'
                                                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                                                                        : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                                                                        }`}
                                                                >
                                                                    {isThisRowProcessing
                                                                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                        : confirmingAction?.action === 'approve'
                                                                            ? <CheckCircle size={14} />
                                                                            : <XCircle size={14} />
                                                                    }
                                                                    {isThisRowProcessing
                                                                        ? 'Processing...'
                                                                        : confirmingAction?.action === 'approve'
                                                                            ? 'Yes, Approve'
                                                                            : 'Yes, Decline'}
                                                                </button>
                                                                <button
                                                                    onClick={() => setConfirmingAction(null)}
                                                                    className="px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                DETAIL MODAL
            ══════════════════════════════════════════ */}
            <Modal isOpen={!!selectedAuthor} onClose={() => setSelectedAuthor(null)} title="Author Profile" maxWidth="max-w-4xl">
                {selectedAuthor && (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                        {/* Hero banner */}
                        <div className="relative h-48 bg-slate-950 overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                            <div className="absolute bottom-6 left-8 flex items-end gap-6">
                                <div className="relative">
                                    <img
                                        src={getAvatar(selectedAuthor.name, selectedAuthor.avatar_url)}
                                        alt={selectedAuthor.name}
                                        className="w-28 h-28 rounded-2xl border-4 border-slate-900 shadow-2xl object-cover"
                                    />
                                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-slate-900 flex items-center justify-center ${selectedAuthor.author_status === 'active' ? 'bg-emerald-500' :
                                        selectedAuthor.author_status === 'declined' ? 'bg-red-500' : 'bg-amber-500'
                                        }`}>
                                        <Award size={14} className="text-white" />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">{selectedAuthor.name}</h2>
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-400 text-sm font-mono">{selectedAuthor.email}</span>
                                        <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                                            Applied {formatDate(selectedAuthor.applied_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left — experience + works */}
                            <div className="lg:col-span-2 space-y-6">
                                <section>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                            <Shield size={16} />
                                        </div>
                                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Professional Experience</h3>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                        {selectedAuthor.experience}
                                    </div>
                                </section>
                                <section>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                            <Activity size={16} />
                                        </div>
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Notable Works & Projects</h3>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm italic">
                                        {selectedAuthor.previous_work || 'No previous work provided.'}
                                    </div>
                                </section>
                            </div>

                            {/* Right — links + status */}
                            <div className="space-y-5">
                                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Quick Links & Assets</h4>
                                    <div className="space-y-3">
                                        {selectedAuthor.portfolio_url ? (
                                            <a href={selectedAuthor.portfolio_url} target="_blank" rel="noopener noreferrer"
                                                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <ExternalLink size={14} className="text-blue-500" />
                                                    <span className="text-xs font-bold text-slate-300">Portfolio</span>
                                                </div>
                                                <MoreVertical size={12} className="text-slate-600 group-hover:text-blue-400" />
                                            </a>
                                        ) : (
                                            <p className="text-xs text-slate-600 italic">No portfolio URL</p>
                                        )}
                                        {selectedAuthor.cv_filename ? (
                                            <a href={`http://localhost:5000/${selectedAuthor.cv_filename}`} target="_blank" rel="noopener noreferrer"
                                                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <Download size={14} className="text-emerald-500" />
                                                    <span className="text-xs font-bold text-slate-300">Download CV</span>
                                                </div>
                                                <MoreVertical size={12} className="text-slate-600 group-hover:text-emerald-400" />
                                            </a>
                                        ) : (
                                            <p className="text-xs text-slate-600 italic">No CV uploaded</p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Current Status</h4>
                                    <div className={`p-4 rounded-xl border flex items-center gap-3 ${selectedAuthor.author_status === 'active' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500' :
                                        selectedAuthor.author_status === 'declined' ? 'bg-red-500/5 border-red-500/20 text-red-500' :
                                            'bg-amber-500/5 border-amber-500/20 text-amber-500'
                                        }`}>
                                        <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                        <div>
                                            <span className="text-xs font-black uppercase tracking-widest block">{selectedAuthor.author_status}</span>
                                            <span className="text-[10px] text-slate-500 mt-0.5 block">
                                                {selectedAuthor.author_status === 'pending' && 'Awaiting admin review'}
                                                {selectedAuthor.author_status === 'active' && 'Author access granted'}
                                                {selectedAuthor.author_status === 'declined' && 'Application rejected'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer actions — always shows relevant buttons */}
                        <div className="bg-slate-950/80 p-5 flex flex-col sm:flex-row gap-3 border-t border-slate-800">
                            {selectedAuthor.author_status !== 'active' && (
                                <button
                                    onClick={() => { handleApprove(selectedAuthor.profile_id); setSelectedAuthor(null); }}
                                    disabled={isProcessing}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.18em] rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isProcessing
                                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        : <CheckCircle size={16} />}
                                    {selectedAuthor.author_status === 'declined' ? 'Re-Approve' : 'Approve Application'}
                                </button>
                            )}
                            {selectedAuthor.author_status !== 'declined' && (
                                <button
                                    onClick={() => { handleDecline(selectedAuthor.profile_id); setSelectedAuthor(null); }}
                                    disabled={isProcessing}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-800 hover:bg-red-500/10 text-slate-300 hover:text-red-400 text-xs font-black uppercase tracking-[0.18em] rounded-xl border border-slate-700 hover:border-red-500/40 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isProcessing
                                        ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                        : <XCircle size={16} />}
                                    {selectedAuthor.author_status === 'active' ? 'Revoke Access' : 'Decline Request'}
                                </button>
                            )}
                            <button onClick={() => setSelectedAuthor(null)}
                                className="px-6 py-4 bg-slate-900 text-slate-500 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-800 hover:bg-slate-800 transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* ══════════════════════════════════════════
                REGISTER / PROMOTE AUTHOR MODAL
            ══════════════════════════════════════════ */}
            <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register New Author" maxWidth="max-w-4xl">
                <div className="relative p-6">
                    {isSubmitting && (
                        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
                            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <p className="mt-4 text-white font-bold tracking-widest uppercase text-xs">Finalizing Profile...</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left column */}
                            <div className="space-y-4">
                                {/* Step 1 */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">1</div>
                                        Select User Account
                                    </h3>
                                    <select
                                        required
                                        value={formData.user_id}
                                        onChange={e => setFormData({ ...formData, user_id: e.target.value })}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-slate-800 dark:text-white"
                                    >
                                        <option value="">Choose an eligible user...</option>
                                        {eligibleUsers.map(u => (
                                            <option key={u.id} value={u.id}>
                                                {u.first_name} {u.last_name} — {u.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Step 2 */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-black flex items-center justify-center">2</div>
                                        Professional Links
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Portfolio URL (optional)</label>
                                            <div className="relative">
                                                <ExternalLink size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="url"
                                                    value={formData.portfolio_url}
                                                    onChange={e => setFormData({ ...formData, portfolio_url: e.target.value })}
                                                    className="w-full pl-9 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                                    placeholder="https://myportfolio.com"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">CV / Resume (PDF, DOC)</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={e => setCvFile(e.target.files?.[0] || null)}
                                                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">3</div>
                                    Bio & Experience
                                </h3>
                                <div className="space-y-4 flex-1 flex flex-col">
                                    <div className="flex-1 flex flex-col">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Professional Experience *</label>
                                        <textarea
                                            required
                                            value={formData.experience}
                                            onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                            className="w-full flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none min-h-[100px]"
                                            placeholder="Describe background, expertise, domains..."
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Previous Notable Work</label>
                                        <textarea
                                            value={formData.previous_work}
                                            onChange={e => setFormData({ ...formData, previous_work: e.target.value })}
                                            className="w-full flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none min-h-[100px]"
                                            placeholder="Links or titles of published articles, books..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsRegisterOpen(false)}
                                className="px-6 py-3 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 bg-slate-900 border border-slate-700/50 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    : <CheckCircle size={14} className="text-indigo-400" />}
                                Register Author
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Authors;
