import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Building2, AlignLeft, List, CheckCircle, UploadCloud, Globe, Award, AlertCircle, Clock } from 'lucide-react';

interface JobFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        salary: '',
        industry: '',
        description: '',
        responsibilities: '',
        requirements: '',
        benefits: '',
        url: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing again
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5000/api/jobs/jobs-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to post job');
            }

            // Call the parent's onSubmit with the response data
            onSubmit(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full pl-10 pr-4 py-3 border border-blue-500/20 dark:border-blue-500/30 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 font-medium";
    const textAreaClass = "w-full pl-10 pr-4 py-3 border border-blue-500/20 dark:border-blue-500/30 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 resize-none font-medium";
    const labelClass = "block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-2";
    const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors h-4 w-4 pointer-events-none";
    const iconTextAreaClass = "absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors h-4 w-4 pointer-events-none";
    const inputWrapperClass = "relative group";

    return (
        <div className="relative p-1">
            {/* Ultra-Premium Loading Overlay */}
            {isSubmitting && (
                <div className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center rounded-3xl animate-in fade-in duration-500">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 border-4 border-indigo-500/10 rounded-full"></div>
                        <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_25px_rgba(79,70,229,0.4)]"></div>
                        <Briefcase className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-widest uppercase mb-2">Broadcasting Career</h3>
                    <p className="text-slate-500 dark:text-indigo-400 font-bold animate-pulse text-xs tracking-[0.2em] uppercase">Securing your listing...</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                {error && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in shake duration-500">
                        <div className="w-6 h-6 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center shrink-0">
                            <AlertCircle size={14} />
                        </div>
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Panel: Company Context */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-1.5 h-6 bg-sky-500 rounded-full"></div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Organization</h3>
                            </div>

                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Company Identity</label>
                                <div className="relative">
                                    <Building2 className={iconClass} />
                                    <input required name="company" value={formData.company} onChange={handleChange} className={inputClass} placeholder="e.g. Google" />
                                </div>
                            </div>

                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Industry Sector</label>
                                <div className="relative">
                                    <Globe className={iconClass} />
                                    <input name="industry" value={formData.industry} onChange={handleChange} className={inputClass} placeholder="e.g. Technology" />
                                </div>
                            </div>

                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Direct Link</label>
                                <div className="relative">
                                    <Globe className={iconClass} />
                                    <input name="url" type="url" value={formData.url} onChange={handleChange} className={inputClass} placeholder="https://careers.google.com/..." />
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-600/30 text-white space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <DollarSign size={20} />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight">Compensation</h3>
                            </div>
                            <div className={inputWrapperClass}>
                                <label className="block text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-2 ml-2">Salary Estimate</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 h-4 w-4 pointer-events-none" />
                                    <input name="salary" value={formData.salary} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-2xl focus:ring-2 focus:ring-white focus:border-white outline-none text-white transition-all placeholder:text-white/30 font-bold" placeholder="$120k - $150k" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Role & Mission */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Section: Role Identity */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Role Identity</h3>
                            </div>
                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Professional Title</label>
                                <div className="relative">
                                    <Briefcase className={iconClass} />
                                    <input required name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g. Senior Frontend Engineer" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={inputWrapperClass}>
                                    <label className={labelClass}>Contract Type</label>
                                    <div className="relative">
                                        <Clock className={iconClass} />
                                        <select name="type" value={formData.type} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`}>
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={inputWrapperClass}>
                                    <label className={labelClass}>Primary Location</label>
                                    <div className="relative">
                                        <MapPin className={iconClass} />
                                        <input required name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="Addis Ababa / Remote" />
                                    </div>
                                </div>
                            </div>
                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Executive Summary</label>
                                <div className="relative">
                                    <AlignLeft className={iconTextAreaClass} />
                                    <textarea name="description" value={formData.description} rows={3} onChange={handleChange} className={textAreaClass} placeholder="High-level vision for this position..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Section: Mission Requirements */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Mission & Rewards</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={inputWrapperClass}>
                                    <label className={labelClass}>Core Responsibilities</label>
                                    <div className="relative">
                                        <List className={iconTextAreaClass} />
                                        <textarea name="responsibilities" value={formData.responsibilities} rows={5} onChange={handleChange} className={textAreaClass} placeholder="• Architecting systems&#10;• Leading teams"></textarea>
                                    </div>
                                </div>
                                <div className={inputWrapperClass}>
                                    <label className={labelClass}>Success Requirements</label>
                                    <div className="relative">
                                        <CheckCircle className={iconTextAreaClass} />
                                        <textarea name="requirements" value={formData.requirements} rows={5} onChange={handleChange} className={textAreaClass} placeholder="• 5+ years experience&#10;• React proficiency"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Employee Welfare & Benefits</label>
                                <div className="relative">
                                    <Award className={iconTextAreaClass} />
                                    <textarea name="benefits" value={formData.benefits} rows={3} onChange={handleChange} className={textAreaClass} placeholder="• Health Insurance&#10;• Mental health support"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/5 backdrop-blur-md p-8 rounded-[3rem]">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-10 py-4 text-slate-400 hover:text-rose-500 font-black text-xs uppercase tracking-[0.2em] transition-all"
                    >
                        Abort
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative px-14 py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-600/60 hover:-translate-y-1 transition-all disabled:opacity-50 active:scale-95 flex items-center overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center">
                            <UploadCloud size={18} className="mr-4 group-hover:rotate-12 transition-transform" />
                            {isSubmitting ? 'Syncing...' : 'Launch Listing'}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobForm;