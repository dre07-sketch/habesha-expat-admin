import React, { useState, useEffect } from 'react';
import { Save, Power, User, Lock, Mail, ShieldAlert, Globe, AlertTriangle, CheckCircle, LayoutDashboard, Loader2, MessageCircle, Settings as SettingsIcon, Bell, Database, HardDrive, ShieldCheck } from 'lucide-react';

const Settings: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [adminId, setAdminId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [systemStatus, setSystemStatus] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [togglingService, setTogglingService] = useState<number | null>(null);

    // Get auth token from localStorage
    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    // Fetch admin data and system status on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    throw new Error('Authentication required');
                }

                // Fetch admin account info
                const adminResponse = await fetch('http://localhost:5000/api/login/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (adminResponse.ok) {
                    const adminData = await adminResponse.json();
                    setEmail(adminData.email);
                    setAdminId(adminData.id);
                }

                // Fetch real system statuses
                const statusResponse = await fetch('http://localhost:5000/api/system/system-status', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    setSystemStatus(statusData);
                }

            } catch (err) {
                setError(err.message || 'Failed to load platform data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        if (password && password !== confirmPassword) {
            setError('Passwords do not match');
            setIsSaving(false);
            return;
        }

        try {
            const token = getAuthToken();
            const updateData = { email, ...(password && { password }) };

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

            setIsSaving(false);
            setSaveSuccess(true);
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update settings');
            setIsSaving(false);
        }
    };

    const toggleService = async (id: number) => {
        setTogglingService(id);
        setError('');

        try {
            const token = getAuthToken();
            const response = await fetch(`http://localhost:5000/api/system/system-status/${id}/toggle`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to toggle service');
            }

            const result = await response.json();

            setSystemStatus(prev => prev.map(service =>
                service.id === id ? {
                    ...service,
                    status: result.service.status,
                    maintenanceMessage: result.service.maintenanceMessage
                } : service
            ));
        } catch (err) {
            setError(err.message || 'Failed to update system status');
        } finally {
            setTogglingService(null);
        }
    };

    const inputClass = "w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all font-bold shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600";
    const labelClass = "block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2";
    const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 group-focus-within:text-indigo-500 transition-colors h-5 w-5 pointer-events-none";

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Initializing Secure Core...</p>
            </div>
        );
    }

    const loungeService = systemStatus.find(s => s.serviceName === 'Lounge');
    const coreServices = systemStatus.filter(s => s.serviceName === 'Public Website' && s.id === 1);

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-2">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 text-white">
                            <SettingsIcon size={20} />
                        </div>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Control Center</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">Platform Configuration</h1>
                </div>
                <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-900/80 p-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 mb-1">
                    <ShieldCheck className="text-emerald-500" size={20} />
                    <div className="pr-4 border-r border-slate-200 dark:border-slate-800">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Security Level</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Encrypted / Root</p>
                    </div>
                    <div className="pl-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Admin</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{email}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Account & Lounge */}
                <div className="lg:col-span-12 space-y-8">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Account Info - Spans 2 cols */}
                        <div className="xl:col-span-2 bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 relative overflow-hidden group shadow-2xl transition-all">
                            {/* Loading Overlay */}
                            {isSaving && (
                                <div className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                                    <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                    <p className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em]">Syncing Credentials</p>
                                </div>
                            )}

                            {/* Success Overlay */}
                            {saveSuccess && (
                                <div className="absolute inset-0 z-50 bg-emerald-500/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300 text-white">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-widest">Saved Successfully</h3>
                                    <p className="font-bold opacity-80 mt-2">Core profile has been updated</p>
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Account Identity</h2>
                                    <p className="text-sm font-bold text-slate-500">Master access credentials for the platform</p>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="group relative">
                                    <label className={labelClass}>Operational Email</label>
                                    <div className="relative">
                                        <Mail className={iconClass} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={inputClass}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="group relative">
                                        <label className={labelClass}>New Secret Key</label>
                                        <div className="relative">
                                            <Lock className={iconClass} />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={inputClass}
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="group relative">
                                        <label className={labelClass}>Verify Secret Key</label>
                                        <div className="relative">
                                            <Lock className={iconClass} />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={inputClass}
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-6 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-2">
                                        <AlertTriangle size={24} />
                                        <p className="font-bold">{error}</p>
                                    </div>
                                )}

                                <div className="pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving || !adminId}
                                        className="px-12 py-5 bg-indigo-600 hover:bg-white text-white hover:text-indigo-600 rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 disabled:opacity-50 border-2 border-transparent hover:border-indigo-600 whitespace-nowrap"
                                    >
                                        Deploy Identity Update
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Lounge Control - Right Side Panel */}
                        <div className="xl:col-span-1 flex flex-col gap-8">
                            <div className="bg-indigo-600 p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-600/40 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                                    <MessageCircle size={120} className="rotate-12" />
                                </div>
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-white/20 rounded-2xl text-white">
                                            <MessageCircle size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Lounge Status</p>
                                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Group Chat</h2>
                                        </div>
                                    </div>

                                    <div className="my-8 flex-1">
                                        <div className={`p-6 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-black text-white uppercase tracking-widest">Real-time Comms</span>
                                                <div className={`w-3 h-3 rounded-full ${loungeService?.status === 'activated' ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-rose-500'}`}></div>
                                            </div>
                                            <p className="text-sm font-bold text-white/80 leading-relaxed mb-6">
                                                Control the availability of the global group chat lounge for all expatriate members.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => loungeService && toggleService(loungeService.id)}
                                        disabled={togglingService !== null}
                                        className={`w-full py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 ${loungeService?.status === 'activated'
                                            ? 'bg-rose-500 hover:bg-rose-400 text-white'
                                            : 'bg-emerald-500 hover:bg-emerald-400 text-white'
                                            }`}
                                    >
                                        {togglingService === loungeService?.id ? (
                                            <Loader2 className="animate-spin" size={18} />
                                        ) : loungeService?.status === 'activated' ? (
                                            <><Power size={18} /> Shutdown Lounge</>
                                        ) : (
                                            <><Globe size={18} /> Initialize Lounge</>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Notification Block */}
                            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-800 rounded-2xl text-slate-400"><Bell size={20} /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alerts</p>
                                        <p className="text-sm font-bold text-white">System Logs</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest underline cursor-pointer hover:text-white">View All</div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Shutdown Grid */}
                    <div className="bg-slate-950 rounded-[3rem] border border-slate-900 p-10 relative overflow-hidden">
                        {/* Danger Gradient */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-600 to-transparent opacity-50"></div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-rose-600/10 rounded-3xl border border-rose-600/20 text-rose-500">
                                    <ShieldAlert size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Emergency Kill Switches</h2>
                                    <p className="text-sm font-bold text-slate-500">Immediate global suspension of core platform services</p>
                                </div>
                            </div>
                            <div className="px-6 py-2 bg-rose-600/20 text-rose-500 rounded-full border border-rose-600/30 text-[10px] font-black uppercase tracking-widest">
                                Critical Access Only
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {coreServices.map((service) => (
                                <div key={service.id} className="bg-slate-900/40 border-2 border-slate-800 rounded-[2.5rem] p-8 flex items-center justify-between group hover:border-slate-700 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-3xl transition-colors ${service.status === 'activated' ? 'bg-emerald-600/10 text-emerald-500' : 'bg-rose-600/10 text-rose-500'}`}>
                                            {service.serviceName === 'Public Website' ? <Globe size={24} /> : <Database size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tight">{service.serviceName}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`w-2 h-2 rounded-full ${service.status === 'activated' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    {service.status === 'activated' ? 'Operational' : 'Offline'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleService(service.id)}
                                        disabled={togglingService !== null}
                                        className={`p-4 rounded-2xl transition-all shadow-lg active:scale-90 ${service.status === 'activated'
                                            ? 'bg-slate-800 text-rose-500 hover:bg-rose-600 hover:text-white'
                                            : 'bg-emerald-600 text-white shadow-emerald-600/20'
                                            }`}
                                    >
                                        {togglingService === service.id ? (
                                            <Loader2 className="animate-spin h-6 w-6" />
                                        ) : service.status === 'activated' ? (
                                            <Power size={24} />
                                        ) : (
                                            <CheckCircle size={24} />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-8 bg-slate-900/60 rounded-[2rem] border border-slate-800 flex items-start gap-4">
                            <AlertTriangle className="text-amber-500 mt-1 shrink-0" size={20} />
                            <div>
                                <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-wider italic">
                                    Warning: Suspending services will immediately disconnect active users and may lead to data inconsistency if not handled through proper maintenance windows.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;