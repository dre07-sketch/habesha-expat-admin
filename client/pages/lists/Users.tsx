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
    const [error, setError] = useState<string | null>(null);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);

    // State for Role Editing inside the profile modal
    const [isEditingRole, setIsEditingRole] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5000/api/users/users-roles');

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
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call to register Admin/User
        setTimeout(() => {
            setIsSubmitting(false);
            setIsAddUserOpen(false);
        }, 2000);
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
            
            const response = await fetch(`http://localhost:5000/api/users/toggle-status/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">User Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage user accounts, roles, and permissions.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsAddUserOpen(true)}
                        className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                    >
                        <Plus size={20} className="mr-2" /> Add User
                    </button>
                </div>
            </div>

            {/* Modern Table List */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/60">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User Profile</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Active</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800/0 divide-y divide-slate-200 dark:divide-slate-700/60">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                        <p className="mt-2 text-slate-500 dark:text-slate-400">Loading users...</p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <p className="text-red-500 dark:text-red-400">Error: {error}</p>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-700 shadow-sm" src={getAvatar(user.name, user.avatar_url)} alt="" />
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user.name}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
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
                                        <td className="px-6 py-4 whitespace-nowrap">
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">
                                            {formatDate(user.updated_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
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

            {/* Add User Modal */}
            <Modal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} title="Register New User" maxWidth="max-w-2xl">
                <div className="relative">
                    {isSubmitting && (
                        <div className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-300">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                                <UserPlus className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">Creating Account...</h3>
                        </div>
                    )}
                    <form onSubmit={handleAddUser} className="space-y-6">
                        <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                                <UserIcon className="mr-2 text-blue-500" size={20} /> Account Details
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Manually register a new user, admin, or author.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Full Name</label>
                                <input required className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Email Address</label>
                                <input required type="email" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">Password</label>
                                <input required type="password" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">System Role</label>
                                <select className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer">
                                    <option value="User">User</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Author">Author</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
                            <button type="button" onClick={() => setIsAddUserOpen(false)} className="px-6 py-2.5 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="px-8 py-2.5 text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all flex items-center">
                                <UserPlus size={18} className="mr-2" /> Create User
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* User Profile Modal with Status Toggle */}
            <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Profile" maxWidth="max-w-3xl">
                {selectedUser && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden relative">
                        {/* Decorative Background Blur */}
                        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
                        </div>

                        {/* Header Content */}
                        <div className="relative px-8 pt-20 pb-6 flex flex-col md:flex-row items-end md:items-end gap-6">
                            <div className="relative group shrink-0">
                                <div className="w-32 h-32 rounded-3xl bg-white dark:bg-slate-800 p-1.5 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                    <img
                                        src={getAvatar(selectedUser.name, selectedUser.avatar_url)}
                                        alt={selectedUser.name}
                                        className="w-full h-full rounded-2xl object-cover"
                                    />
                                </div>
                                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${selectedUser.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                    {selectedUser.status === 'Active' ? <CheckCircle size={14} className="text-white" /> : <XCircle size={14} className="text-white" />}
                                </div>
                            </div>

                            <div className="flex-1 mb-2">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{selectedUser.name}</h2>

                                    {/* Role Badge / Editor */}
                                    {isEditingRole ? (
                                        <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg shadow-lg p-1 animate-in fade-in zoom-in duration-200 border border-slate-200 dark:border-slate-700">
                                            <select
                                                value={selectedRole}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                className="text-xs font-bold uppercase bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 px-2 py-1 cursor-pointer"
                                            >
                                                <option value="User">User</option>
                                                <option value="Premium">Premium</option>
                                                <option value="Author">Author</option>
                                            </select>
                                            <button
                                                onClick={handleSaveRole}
                                                disabled={isUpdatingRole}
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded ml-1 transition-colors disabled:opacity-50"
                                            >
                                                {isUpdatingRole ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle size={12} />}
                                            </button>
                                            <button
                                                onClick={() => setIsEditingRole(false)}
                                                className="bg-slate-200 dark:bg-slate-700 hover:bg-red-500 hover:text-white text-slate-500 p-1 rounded ml-1 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center group/role">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${selectedUser.role === 'Premium' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                                                    selectedUser.role === 'Author' ? 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20' :
                                                        selectedUser.role === 'User' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                                                            'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20'
                                                }`}>
                                                {selectedUser.role}
                                            </span>
                                            <button
                                                onClick={() => setIsEditingRole(true)}
                                                className="ml-2 opacity-0 group-hover/role:opacity-100 transition-opacity text-slate-400 hover:text-blue-500 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                                title="Edit Role"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center text-slate-500 dark:text-slate-400 font-medium">
                                    <Mail size={16} className="mr-2" /> {selectedUser.email}
                                </div>
                            </div>

                            <div className="flex gap-3 mb-2">
                                <button className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-slate-800 hover:dark:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Stats */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 h-full">
                                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Account Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                                <Calendar size={18} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Joined</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(selectedUser.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                                <Shield size={18} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Verification</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">Verified</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                                <MapPin size={18} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white text-right">{selectedUser.location || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 h-full">
                                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Contact</h3>
                                <div className="flex items-center gap-3 mb-3">
                                    <Mail size={16} className="text-slate-400" />
                                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{selectedUser.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions with Status Toggle */}
                        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => handleToggleStatus(selectedUser.id)}
                                disabled={isTogglingStatus}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center justify-center ${
                                    selectedUser.status === 'Active'
                                        ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20'
                                        : 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
                                } ${isTogglingStatus ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isTogglingStatus ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                                        {selectedUser.status === 'Active' ? 'Banning...' : 'Activating...'}
                                    </>
                                ) : selectedUser.status === 'Active' ? (
                                    <>
                                        <XCircle size={16} className="mr-2" />
                                        Ban Account
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} className="mr-2" />
                                        Activate Account
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Users;