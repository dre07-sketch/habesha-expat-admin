import React, { useState, useEffect } from 'react';
import { Save, Power, User, Lock, Mail, ShieldAlert, Globe, AlertTriangle, CheckCircle, LayoutDashboard, Loader2 } from 'lucide-react';
import { MOCK_SYSTEM_STATUS } from '../../constants';

const Settings: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [adminId, setAdminId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [systemStatus, setSystemStatus] = useState(MOCK_SYSTEM_STATUS);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [togglingService, setTogglingService] = useState<number | null>(null);

    // Get auth token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    // Fetch admin data on component mount
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    throw new Error('Authentication required');
                }

                const response = await fetch('http://localhost:5000/api/login/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch admin data');
                }
                const data = await response.json();
                setEmail(data.email);
                setAdminId(data.id);
            } catch (err) {
                setError(err.message || 'Failed to load admin data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        // Validate passwords if provided
        if (password && password !== confirmPassword) {
            setError('Passwords do not match');
            setIsSaving(false);
            return;
        }

        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            // Prepare data for API
            const updateData = {
                email,
                ...(password && { password }) // Only include password if provided
            };

            // Make API call to update account settings
            const response = await fetch('http://localhost:5000/api/login/settings/account', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update account settings');
            }

            const result = await response.json();

            setIsSaving(false);
            setSaveSuccess(true);
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update settings. Please try again.');
            setIsSaving(false);
        }
    };

    const toggleService = async (id: number) => {
        setTogglingService(id);
        setError('');
        
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Authentication required');
            }

            const response = await fetch(`http://localhost:5000/api/system/system-status/${id}/toggle`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to toggle service status');
            }

            const result = await response.json();
            
            // Update the local state with the response from the API
            setSystemStatus(prev => prev.map(service =>
                service.id === id ? { 
                    ...service, 
                    status: result.service.status,
                    maintenanceMessage: result.service.maintenanceMessage 
                } : service
            ));
        } catch (err) {
            setError(err.message || 'Failed to toggle service status. Please try again.');
        } finally {
            setTogglingService(null);
        }
    };

    const inputClass = "w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all";
    const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2";

    // Show loading state while fetching admin data
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-8">
            {/* Error display for initial fetch */}
            {error && !isSaving && !togglingService && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl">
                    {error}
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Platform Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your admin credentials and critical system configurations.</p>
            </div>

            {/* Account Information Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">

                {/* Cool Loading Overlay */}
                {isSaving && (
                    <div className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <div className="relative mb-6">
                            <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                            <User className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">Saving Changes...</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Updating account profile</p>
                    </div>
                )}

                {/* Success Overlay */}
                {saveSuccess && (
                    <div className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">Saved Successfully</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Your profile has been updated</p>
                    </div>
                )}

                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                        <User className="mr-2 text-blue-500" size={20} /> Account Information
                    </h2>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full uppercase">Super Admin</span>
                </div>
                <div className="p-8">
                    <form className="space-y-6" onSubmit={handleSave}>
                        <div>
                            <label className={labelClass}>Admin Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClass}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={inputClass}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={inputClass}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error message display */}
                        {error && (
                            <div className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                                {error}
                            </div>
                        )}

                        <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <button
                                type="submit"
                                className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSaving || !adminId}
                            >
                                <Save size={18} className="mr-2" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Danger Zone: Emergency Shutdown */}
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(220,38,38,0.03)_25%,transparent_25%,transparent_50%,rgba(220,38,38,0.03)_50%,rgba(220,38,38,0.03)_75%,transparent_75%,transparent_100%)] bg-[length:24px_24px]"></div>

                <div className="p-8 relative z-10">
                    <div className="flex items-start space-x-5 mb-10">
                        <div className="p-3.5 bg-red-50 dark:bg-slate-800/80 rounded-2xl border border-red-200 dark:border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)] backdrop-blur-sm">
                            <AlertTriangle className="text-red-600 dark:text-red-500" size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Emergency Shutdown Zone</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">Restricted Area. Actions here have immediate global impact on system availability.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {systemStatus.filter(service => service.serviceName !== 'Admin Panel').map((service) => (
                            <div key={service.id} className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-lg flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        {service.serviceName === 'Public Website' ? (
                                            <Globe className={`text-${service.status === 'activated' ? 'emerald' : 'slate'}-500`} size={22} />
                                        ) : (
                                            <LayoutDashboard className={`text-${service.status === 'activated' ? 'emerald' : 'slate'}-500`} size={22} />
                                        )}
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{service.serviceName}</h3>
                                    </div>

                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                        {service.serviceName === 'Public Website'
                                            ? <span className="text-slate-700 dark:text-slate-300 font-mono">www.habeshaexpat.com</span>
                                            : <span className="text-slate-700 dark:text-slate-300 font-mono">admin.habeshaexpat.com</span>
                                        }
                                    </p>
                                    {service.status === 'deactivated' && (
                                        <p className="text-red-500 text-xs mt-2 font-bold italic">
                                            Maintenance Mode Active: "{service.maintenanceMessage}"
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    {togglingService === service.id ? (
                                        <div className="flex items-center justify-center w-12 h-7">
                                            <Loader2 className="animate-spin text-blue-500" size={20} />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => toggleService(service.id)}
                                            disabled={togglingService !== null}
                                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${service.status === 'activated' ? 'bg-emerald-500 focus:ring-emerald-500' : 'bg-slate-200 dark:bg-slate-700 focus:ring-slate-500'}`}
                                        >
                                            <span className={`${service.status === 'activated' ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm`}>
                                                <Power size={10} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${service.status === 'activated' ? 'text-emerald-600' : 'text-slate-400'}`} />
                                            </span>
                                        </button>
                                    )}

                                    <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border w-fit ${service.status === 'activated' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${service.status === 'activated' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
                                        {service.status === 'activated' ? 'System Online' : 'System Offline'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;