import React, { useState, useEffect } from 'react';
import {
    Users, Search, ShieldCheck, UserX, Clock,
    MoreVertical, CheckCircle, XCircle, User,
    ShieldAlert, Activity, Globe
} from 'lucide-react';

interface LoungeMember {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
    status: 'Authorized' | 'Dismissed' | string;
    is_online: boolean;
    joined_at: string;
    last_seen: string;
}

const LoungeMembers: React.FC = () => {
    const [members, setMembers] = useState<LoungeMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isProcessing, setIsProcessing] = useState<number | null>(null);

    const token = () => localStorage.getItem('authToken') || '';
    const API_BASE = 'http://localhost:5000/api/lounge';

    const fetchMembers = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${API_BASE}/members`, {
                headers: { Authorization: `Bearer ${token()}` }
            });
            const data = await res.json();
            if (data.success) setMembers(data.data);
        } catch (e) {
            console.error('fetchMembers error', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleUpdateStatus = async (userId: number, newStatus: 'Authorized' | 'Dismissed') => {
        try {
            setIsProcessing(userId);
            const res = await fetch(`${API_BASE}/status/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token()}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setMembers(prev => prev.map(m =>
                    m.user_id === userId ? { ...m, status: newStatus } : m
                ));
            } else {
                alert(data.message || 'Failed to update status');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(null);
        }
    };

    const filteredMembers = members.filter(m =>
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAvatar = (name: string, url?: string) =>
        url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

    const formatDateTime = (d: string) => {
        if (!d) return 'Never';
        return new Date(d).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Globe className="text-indigo-500" size={32} />
                        Lounge Members
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase rounded-full border border-indigo-500/20">
                            {members.length} Total
                        </span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
                        Manage user permissions and access levels for the community lounge.
                    </p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700/60">
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Member</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Access Status</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Activity</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Permissions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Directory...</p>
                                    </td>
                                </tr>
                            ) : filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Users size={48} className="text-slate-200 dark:text-slate-700 mb-4" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No members found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredMembers.map(member => (
                                    <tr key={member.user_id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all duration-300">
                                        {/* Member Info */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img
                                                        src={getAvatar(`${member.first_name} ${member.last_name}`, member.avatar_url)}
                                                        alt=""
                                                        className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-700"
                                                    />
                                                    {member.is_online && (
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 shadow-sm" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                                                        {member.first_name} {member.last_name}
                                                    </div>
                                                    <div className="text-xs text-slate-400 font-mono">
                                                        {member.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${member.status === 'Authorized'
                                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                    : member.status === 'Dismissed'
                                                        ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                }`}>
                                                {member.status === 'Authorized' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                                                {member.status || 'Pending'}
                                            </span>
                                        </td>

                                        {/* Activity */}
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-bold">
                                                    <Activity size={12} className={member.is_online ? 'text-emerald-500' : 'text-slate-400'} />
                                                    {member.is_online ? 'Currently Active' : 'Offline'}
                                                </div>
                                                <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                                                    <Clock size={10} />
                                                    Last seen: {formatDateTime(member.last_seen)}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Joined */}
                                        <td className="px-6 py-5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                                            {formatDateTime(member.joined_at)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                {member.status !== 'Authorized' && (
                                                    <button
                                                        disabled={isProcessing === member.user_id}
                                                        onClick={() => handleUpdateStatus(member.user_id, 'Authorized')}
                                                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50"
                                                    >
                                                        {isProcessing === member.user_id ? 'Wait...' : 'Authorize'}
                                                    </button>
                                                )}
                                                {member.status !== 'Dismissed' && (
                                                    <button
                                                        disabled={isProcessing === member.user_id}
                                                        onClick={() => handleUpdateStatus(member.user_id, 'Dismissed')}
                                                        className="px-4 py-2 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all active:scale-95 disabled:opacity-50"
                                                    >
                                                        {isProcessing === member.user_id ? 'Wait...' : 'Dismiss'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LoungeMembers;
