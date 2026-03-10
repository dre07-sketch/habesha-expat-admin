import React, { useState, useEffect } from 'react';
import {
    Eye, MoreVertical, Shield, Mail, CheckCircle, XCircle,
    Activity, User as UserIcon, Search, UserPlus, Edit2, Save
} from 'lucide-react';
import Modal from '../../components/Modal';
import { User } from '../../types';

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);

    // ─────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────
    const token = () => localStorage.getItem('authToken') || '';

    const getAvatar = (name: string, avatarUrl?: string) =>
        avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    // ─────────────────────────────────────────────
    // Fetch users
    // ─────────────────────────────────────────────
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const res = await fetch('http://localhost:5000/api/users/users-roles', {
                    headers: { Authorization: `Bearer ${token()}` }
                });
                if (!res.ok) throw new Error('Failed to fetch users');
                const data = await res.json();
                if (data.success) setUsers(data.data);
                else setError(data.message || 'Failed to fetch users');
            } catch (err: any) {
                setError(err.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // ─────────────────────────────────────────────
    // Toggle ban / activate
    // ─────────────────────────────────────────────
    const handleToggleStatus = async (userId: string) => {
        try {
            setIsTogglingStatus(true);
            const res = await fetch(`http://localhost:5000/api/users/toggle-status/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token()}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: data.status } : u));
                if (selectedUser?.id === userId) {
                    setSelectedUser(prev => prev ? { ...prev, status: data.status } : null);
                }
            } else {
                setError(data.message || 'Failed to update status');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsTogglingStatus(false);
        }
    };

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setIsEditingRole(false);
        setSelectedRole(user.role);
    };

    const handleSaveRole = () => {
        if (!selectedUser) return;
        setIsUpdatingRole(true);
        setTimeout(() => {
            setSelectedUser(prev => prev ? { ...prev, role: selectedRole as any } : null);
            setIsUpdatingRole(false);
            setIsEditingRole(false);
        }, 1000);
    };

    const filteredUsers = users.filter(u =>
        (u.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (u.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    // ─────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────
    return (
        <div className="animate-in fade-in duration-500">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                        <UserIcon size={22} className="text-blue-500" />
                        User Management
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase rounded-md border border-blue-500/20">
                            {users.length} total
                        </span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                        View, search and manage platform users. Ban or activate accounts.
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search by name, email or role..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm text-sm"
                    />
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/60">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Active</th>
                                <th className="px-4 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center">
                                        <div className="flex justify-center mb-3">
                                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                        <p className="text-slate-400 text-sm">Loading users...</p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-red-400 text-sm">{error}</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-slate-400 text-sm">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors duration-200">
                                        {/* User */}
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getAvatar(user.name, user.avatar_url)}
                                                    alt=""
                                                    className="w-10 h-10 rounded-xl border-2 border-white dark:border-slate-700 shadow-sm object-cover"
                                                />
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role */}
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${user.role === 'Premium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
                                                    user.role === 'Author' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' :
                                                        user.role === 'User' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                                                            'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                {user.status === 'Active'
                                                    ? <CheckCircle size={13} className="text-emerald-500" />
                                                    : <XCircle size={13} className="text-red-500" />}
                                                <span className={`text-sm font-medium ${user.status === 'Active' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                                                    {user.status}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Last active */}
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">
                                            {formatDate(user.updated_at)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={e => { e.stopPropagation(); handleToggleStatus(user.id); }}
                                                    disabled={isTogglingStatus}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${user.status === 'Active'
                                                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-900/10 dark:border-red-800'
                                                            : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800'
                                                        } ${isTogglingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {isTogglingStatus
                                                        ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        : user.status === 'Active' ? <XCircle size={13} /> : <CheckCircle size={13} />}
                                                    {user.status === 'Active' ? 'Ban' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={e => { e.stopPropagation(); handleUserClick(user); }}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-slate-600 transition-all border border-slate-200 dark:border-slate-600"
                                                >
                                                    <Eye size={13} /> View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                USER DETAIL MODAL
            ══════════════════════════════════════════ */}
            <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Profile" maxWidth="max-w-3xl">
                {selectedUser && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
                        {/* Hero */}
                        <div className="absolute top-0 left-0 w-full h-40 bg-slate-950 -z-0">
                            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                        </div>

                        <div className="relative px-6 pt-16 pb-4 flex flex-col md:flex-row items-center md:items-end gap-6">
                            <div className="relative shrink-0">
                                <div className="w-28 h-28 rounded-xl bg-slate-800 border border-slate-700/50 p-1 shadow-2xl overflow-hidden">
                                    <img
                                        src={getAvatar(selectedUser.name, selectedUser.avatar_url)}
                                        alt={selectedUser.name}
                                        className="w-full h-full rounded-lg object-cover"
                                    />
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center ${selectedUser.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                    {selectedUser.status === 'Active'
                                        ? <CheckCircle size={10} className="text-white" />
                                        : <XCircle size={10} className="text-white" />}
                                </div>
                            </div>

                            <div className="flex-1 mb-2 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center gap-2 mb-1">
                                    <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{selectedUser.name}</h2>
                                    {isEditingRole ? (
                                        <div className="flex items-center bg-slate-800 rounded-lg border border-blue-500/30 p-1">
                                            <select
                                                value={selectedRole}
                                                onChange={e => setSelectedRole(e.target.value)}
                                                className="text-[10px] font-bold uppercase bg-transparent border-none outline-none text-blue-400 px-2 py-0.5"
                                            >
                                                <option value="User">User</option>
                                                <option value="Premium">Premium</option>
                                                <option value="Author">Author</option>
                                            </select>
                                            <button onClick={handleSaveRole} disabled={isUpdatingRole} className="text-emerald-400 hover:text-emerald-300 p-1">
                                                {isUpdatingRole
                                                    ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    : <Save size={12} />}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center group/role">
                                            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${selectedUser.role === 'Premium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                    selectedUser.role === 'Author' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                }`}>{selectedUser.role}</span>
                                            <button onClick={() => setIsEditingRole(true)} className="ml-2 opacity-0 group-hover/role:opacity-100 transition-opacity text-slate-500 hover:text-blue-400">
                                                <Edit2 size={10} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-center md:justify-start text-slate-400 text-sm">
                                    <Mail size={13} className="mr-2 text-blue-500" />
                                    {selectedUser.email}
                                </div>
                            </div>
                        </div>

                        {/* Info grid */}
                        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                                <div className="flex justify-between mb-4 border-b border-slate-800 pb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Details</span>
                                    <span className="text-[10px] text-blue-500 font-bold uppercase">Public Profile</span>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Joined</span>
                                        <span className="text-slate-200">{formatDate(selectedUser.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Authentication</span>
                                        <span className="text-emerald-400 font-bold text-xs uppercase">Verified</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Location</span>
                                        <span className="text-slate-200">{selectedUser.location || 'Not set'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                                <div className="flex justify-between mb-4 border-b border-slate-800 pb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activity</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Live</span>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">User ID</span>
                                        <span className="text-slate-200 font-mono text-xs">#{selectedUser.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Last Online</span>
                                        <span className="text-slate-300">{formatDate(selectedUser.updated_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-slate-950 border-t border-slate-800 p-5 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => handleToggleStatus(selectedUser.id)}
                                disabled={isTogglingStatus}
                                className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${selectedUser.status === 'Active'
                                        ? 'bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500/10'
                                        : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'
                                    } ${isTogglingStatus ? 'opacity-50' : ''}`}
                            >
                                {isTogglingStatus
                                    ? <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />Processing...</>
                                    : selectedUser.status === 'Active'
                                        ? <><XCircle size={15} /> Ban User Account</>
                                        : <><CheckCircle size={15} /> Activate User Account</>}
                            </button>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-6 py-3.5 bg-slate-800 text-slate-400 text-xs uppercase font-bold rounded-xl border border-slate-700 hover:bg-slate-700 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Users;