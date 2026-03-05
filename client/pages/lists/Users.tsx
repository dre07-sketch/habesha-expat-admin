import React, { useState, useEffect } from 'react';
import { Eye, MoreVertical, Shield, Mail, Calendar, CheckCircle, XCircle, Activity, User as UserIcon, Search, Monitor, Lock, MapPin, Plus, UserPlus, Edit2, Save, X } from 'lucide-react';
import Modal from '../../components/Modal';
import { User } from '../../types';

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [eligibleUsers, setEligibleUsers] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [authorFormData, setAuthorFormData] = useState({
        user_id: '',
        portfolio_url: '',
        experience: '',
        previous_work: ''
    });
    const [cvFile, setCvFile] = useState<File | null>(null);

    // State for Role Editing inside the profile modal
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);

    // Fetch eligible users for author promotion
    const fetchEligibleUsers = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5000/api/users/eligible-authors', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setEligibleUsers(data.data);
        } catch (err) {
            console.error('Error fetching eligible users:', err);
        }
    };

    useEffect(() => {
        if (isAddUserOpen) {
            fetchEligibleUsers();
        }
    }, [isAddUserOpen]);

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('authToken');
                const response = await fetch('http://localhost:5000/api/users/users-roles', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });


                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();

                if (data.success) {
                    setUsers(data.data);
                } else {
                    setError(data.message || 'Failed to fetch users');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching users');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Helper to get avatar
    const getAvatar = (name: string, avatarUrl?: string) => {
        if (avatarUrl) {
            return avatarUrl;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('user_id', authorFormData.user_id);
            formData.append('portfolio_url', authorFormData.portfolio_url);
            formData.append('experience', authorFormData.experience);
            formData.append('previous_work', authorFormData.previous_work);
            if (cvFile) {
                formData.append('cv', cvFile);
            }

            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5000/api/users/create-author', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setIsAddUserOpen(false);
                // Refresh list
                const res = await fetch('http://localhost:5000/api/users/users-roles', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const listData = await res.json();
                if (listData.success) setUsers(listData.data);
                // Reset form
                setAuthorFormData({
                    user_id: '',
                    portfolio_url: '',
                    experience: '',
                    previous_work: ''
                });
                setCvFile(null);
            } else {
                alert(data.message || 'Failed to create author');
            }
        } catch (err) {
            console.error('Error adding author:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setIsEditingRole(false); // Reset edit state
        setSelectedRole(user.role);
    };

    const handleSaveRole = () => {
        if (!selectedUser) return;
        setIsUpdatingRole(true);
        setTimeout(() => {
            // Update local state to reflect change (in a real app, this would update the DB)
            const updatedUser = { ...selectedUser, role: selectedRole as any };
            setSelectedUser(updatedUser);
            // Update list (mock)
            // setFilteredUsers... 
            setIsUpdatingRole(false);
            setIsEditingRole(false);
        }, 1500);
    };

    // Function to toggle user status
    const handleToggleStatus = async (userId: string) => {
        try {
            setIsTogglingStatus(true);

            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:5000/api/users/toggle-status/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const data = await response.json();

            if (data.success) {
                // Update the users list with the new status
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === userId ? { ...user, status: data.status } : user
                    )
                );

                // Update the selected user if it's the one being modified
                if (selectedUser && selectedUser.id === userId) {
                    setSelectedUser({ ...selectedUser, status: data.status });
                }
            } else {
                setError(data.message || 'Failed to update user status');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while updating user status');
        } finally {
            setIsTogglingStatus(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">User Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage user accounts, roles, and permissions.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-5 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsAddUserOpen(true)}
                        className="bg-slate-900 border border-slate-700/50 text-white px-3 py-3 rounded-xl flex items-center font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Promote to Author <UserPlus size={14} className="ml-2 text-blue-500" />
                    </button>
                </div>
            </div>

            {/* Modern Table List */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/60">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-3 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User Profile</th>
                                <th className="px-3 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="px-3 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Active</th>
                                <th className="px-3 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800/0 divide-y divide-slate-200 dark:divide-slate-700/60">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-3 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                        <p className="mt-2 text-slate-500 dark:text-slate-400">Loading users...</p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="px-3 py-12 text-center">
                                        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-3 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors duration-200">
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" src={getAvatar(user.name, user.avatar_url)} alt="" />
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user.name}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold border ${user.role === 'Premium'
                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                                : user.role === 'Author'
                                                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                                    : user.role === 'User'
                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                                        : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {user.status === 'Active' ? (
                                                    <CheckCircle size={14} className="text-emerald-500 mr-1.5" />
                                                ) : (
                                                    <XCircle size={14} className="text-red-500 mr-1.5" />
                                                )}
                                                <span className={`text-sm font-medium ${user.status === 'Active' ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                                                    {user.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">
                                            {formatDate(user.updated_at)}
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleStatus(user.id);
                                                }}
                                                disabled={isTogglingStatus}
                                                className={`mr-2 text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 ${isTogglingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {user.status === 'Active' ? (
                                                    <XCircle size={18} className="text-red-500" />
                                                ) : (
                                                    <CheckCircle size={18} className="text-emerald-500" />
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUserClick(user);
                                                }}
                                                className="text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Author Promotion Modal */}
            <Modal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title="Promote User to Author" maxWidth="max-w-4xl">
                <div className="relative p-6">
                    {isSubmitting && (
                        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-white font-bold tracking-widest uppercase text-xs">Finalizing Profile...</p>
                        </div>
                    )}

                    <form onSubmit={handleAddUser} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column: Core Identity */}
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                                        <UserIcon className="mr-2 text-blue-500" size={14} /> Step 1: Identity Selection
                                    </h3>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Select Active User</label>
                                        <select
                                            required
                                            value={authorFormData.user_id}
                                            onChange={(e) => setAuthorFormData({ ...authorFormData, user_id: e.target.value })}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                                        >
                                            <option value="">Select a user account...</option>
                                            {eligibleUsers.map(user => (
                                                <option key={user.id} value={user.id}>{user.first_name} {user.last_name} ({user.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                                        <Monitor className="mr-2 text-indigo-500" size={14} /> Step 2: Professional Links
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Portfolio or Website URL</label>
                                            <input
                                                type="url"
                                                value={authorFormData.portfolio_url}
                                                onChange={(e) => setAuthorFormData({ ...authorFormData, portfolio_url: e.target.value })}
                                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                                placeholder="https://portfolio.me"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">CV / Resume File</label>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)}
                                                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Experience/Work */}
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-full flex flex-col">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center">
                                        <Edit2 className="mr-2 text-emerald-500" size={14} /> Step 3: Bio & Experience
                                    </h3>
                                    <div className="space-y-4 flex-1 flex flex-col">
                                        <div className="space-y-1 flex-1 flex flex-col">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Professional Experience</label>
                                            <textarea
                                                required
                                                value={authorFormData.experience}
                                                onChange={(e) => setAuthorFormData({ ...authorFormData, experience: e.target.value })}
                                                className="w-full flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none min-h-[120px]"
                                                placeholder="Describe your writing background and expertise..."
                                            />
                                        </div>
                                        <div className="space-y-1 flex-1 flex flex-col">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Previous Notable Work</label>
                                            <textarea
                                                value={authorFormData.previous_work}
                                                onChange={(e) => setAuthorFormData({ ...authorFormData, previous_work: e.target.value })}
                                                className="w-full flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm resize-none min-h-[120px]"
                                                placeholder="Links or descriptions of published articles/books..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsAddUserOpen(false)}
                                className="px-6 py-3 text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-slate-900 border border-slate-700/50 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
                            >
                                Confirm Promotion
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* User Profile Modal with Status Toggle */}
            <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Profile" maxWidth="max-w-3xl">
                {selectedUser && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden relative">
                        {/* Professional Code-Inspired Header */}
                        <div className="absolute top-0 left-0 w-full h-40 bg-slate-950">
                            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                        </div>

                        {/* Header Content */}
                        <div className="relative px-6 pt-16 pb-4 flex flex-col md:flex-row items-center md:items-end gap-6">
                            <div className="relative group shrink-0">
                                <div className="w-28 h-28 rounded-xl bg-slate-800 border border-slate-700/50 p-1 shadow-2xl relative overflow-hidden transition-all duration-300">
                                    <img
                                        src={getAvatar(selectedUser.name, selectedUser.avatar_url)}
                                        alt={selectedUser.name}
                                        className="w-full h-full rounded-lg object-cover grayscale-[0.2] hover:grayscale-0 transition-all"
                                    />
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center ${selectedUser.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}>
                                    {selectedUser.status === 'Active' ? <CheckCircle size={10} className="text-white" /> : <XCircle size={10} className="text-white" />}
                                </div>
                            </div>

                            <div className="flex-1 mb-2 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center md:items-center gap-2 mb-2">
                                    <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{selectedUser.name}</h2>
                                    <span className="text-slate-600 font-medium hidden md:inline">•</span>
                                    {/* Role Editor */}
                                    {isEditingRole ? (
                                        <div className="flex items-center bg-slate-800 rounded-lg border border-blue-500/30 p-1 animate-in fade-in duration-200">
                                            <select
                                                value={selectedRole}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                className="text-[10px] font-bold uppercase bg-transparent border-none outline-none text-blue-400 px-2 py-0.5 cursor-pointer"
                                            >
                                                <option value="User">User</option>
                                                <option value="Premium">Premium</option>
                                                <option value="Author">Author</option>
                                            </select>
                                            <button onClick={handleSaveRole} disabled={isUpdatingRole} className="text-emerald-400 hover:text-emerald-300 p-1 transition-colors">
                                                {isUpdatingRole ? <div className="w-2 h-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <Save size={12} />}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center group/role">
                                            <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${selectedUser.role === 'Premium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                selectedUser.role === 'Author' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                                                }`}>
                                                {selectedUser.role}
                                            </span>
                                            <button onClick={() => setIsEditingRole(true)} className="ml-2 opacity-0 group-hover/role:opacity-100 transition-opacity text-slate-500 hover:text-blue-400">
                                                <Edit2 size={10} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center justify-center md:justify-start text-slate-400 text-sm">
                                    <Mail size={14} className="mr-2 text-blue-500" />
                                    <span>{selectedUser.email}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 mb-2">
                                <button className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-slate-800 hover:dark:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm">
                                    <MoreVertical size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Details Content */}
                        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Account Details */}
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                                <div className="flex justify-between mb-4 border-b border-slate-800 pb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Details</span>
                                    <span className="text-[10px] text-blue-500 font-bold uppercase">Public Profile</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Joined Date</span>
                                        <span className="text-slate-200">{formatDate(selectedUser.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Authentication</span>
                                        <span className="text-emerald-400 font-bold text-xs uppercase">Verified</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Location</span>
                                        <span className="text-slate-200">{selectedUser.location || 'Not Set'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Info */}
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
                                <div className="flex justify-between mb-4 border-b border-slate-800 pb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activity Status</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Live</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Reference ID</span>
                                        <span className="text-slate-200">#{selectedUser.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-medium">Last Online</span>
                                        <span className="text-slate-300">{formatDate(selectedUser.updated_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-slate-950 border-t border-slate-800 p-6 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => handleToggleStatus(selectedUser.id)}
                                disabled={isTogglingStatus}
                                className={`flex-1 py-4 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center justify-center ${selectedUser.status === 'Active'
                                    ? 'bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500/10'
                                    : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'
                                    } ${isTogglingStatus ? 'opacity-50' : ''}`}
                            >
                                {isTogglingStatus ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {selectedUser.status === 'Active' ? <XCircle size={16} className="mr-2" /> : <CheckCircle size={16} className="mr-2" />}
                                        {selectedUser.status === 'Active' ? 'Ban User Account' : 'Activate User Account'}
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-6 py-4 bg-slate-800 text-slate-400 text-xs uppercase font-bold rounded-lg border border-slate-700 hover:bg-slate-700 transition-all"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Users;