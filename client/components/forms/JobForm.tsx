import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Building2, AlignLeft, List, CheckCircle, UploadCloud, Globe } from 'lucide-react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 2000);
  };

  const inputWrapperClass = "relative group";
  const inputClass = "w-full pl-10 pr-4 py-3 border border-blue-500/30 dark:border-blue-500/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400";
  const textAreaClass = "w-full pl-10 pr-4 py-3 border border-blue-500/30 dark:border-blue-500/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 resize-none";
  const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";
  const iconTextAreaClass = "absolute left-3 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Cool Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-300">
            <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                <Briefcase className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">Publishing Job...</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Creating job listing</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                <Briefcase className="mr-2 text-blue-500" size={20} /> Job Details
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enter the details for the new job posting.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={inputWrapperClass}>
                <label className={labelClass}>Job Title</label>
                <div className="relative">
                    <Briefcase className={iconClass} />
                    <input required name="title" onChange={handleChange} className={inputClass} placeholder="e.g. Content Moderator" />
                </div>
            </div>
            <div className={inputWrapperClass}>
                <label className={labelClass}>Company Name</label>
                <div className="relative">
                    <Building2 className={iconClass} />
                    <input required name="company" onChange={handleChange} className={inputClass} placeholder="e.g. TechGlobal Solutions" />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={inputWrapperClass}>
                <label className={labelClass}>Job Type</label>
                <div className="relative">
                    <Briefcase className={iconClass} />
                    <select name="type" onChange={handleChange} className={`${inputClass} appearance-none`}>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
            </div>
            <div className={inputWrapperClass}>
                <label className={labelClass}>Location</label>
                <div className="relative">
                    <MapPin className={iconClass} />
                    <input required name="location" onChange={handleChange} className={inputClass} placeholder="e.g. Addis Ababa" />
                </div>
            </div>
            <div className={inputWrapperClass}>
                <label className={labelClass}>Salary</label>
                <div className="relative">
                    <DollarSign className={iconClass} />
                    <input name="salary" onChange={handleChange} className={inputClass} placeholder="e.g. $25 - $30 / hr" />
                </div>
            </div>
        </div>

        {/* Wider URL field with more padding */}
        <div className={inputWrapperClass}>
            <label className={labelClass}>Application URL</label>
            <div className="relative">
                <Globe className={iconClass} />
                <input 
                    name="url" 
                    type="url" 
                    onChange={handleChange} 
                    className="w-full pl-10 pr-6 py-5 border border-blue-500/30 dark:border-blue-500/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 text-lg" 
                    placeholder="https://example.com/apply" 
                />
            </div>
        </div>

        <div className={inputWrapperClass}>
            <label className={labelClass}>Description</label>
            <div className="relative">
                <AlignLeft className={iconTextAreaClass} />
                <textarea name="description" rows={3} onChange={handleChange} className={textAreaClass} placeholder="Brief overview of the role..."></textarea>
            </div>
        </div>

        {/* Wider text boxes with more padding */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className={inputWrapperClass}>
                <label className={labelClass}>Responsibilities (One per line)</label>
                <div className="relative">
                    <List className={iconTextAreaClass} />
                    <textarea 
                        name="responsibilities" 
                        rows={6} 
                        onChange={handleChange} 
                        className="w-full pl-10 pr-6 py-5 border border-blue-500/30 dark:border-blue-500/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 resize-none text-base" 
                        placeholder="- Task 1&#10;- Task 2"
                    ></textarea>
                </div>
            </div>
            <div className={inputWrapperClass}>
                <label className={labelClass}>Requirements (One per line)</label>
                <div className="relative">
                    <CheckCircle className={iconTextAreaClass} />
                    <textarea 
                        name="requirements" 
                        rows={6} 
                        onChange={handleChange} 
                        className="w-full pl-10 pr-6 py-5 border border-blue-500/30 dark:border-blue-500/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 resize-none text-base" 
                        placeholder="- Skill 1&#10;- Skill 2"
                    ></textarea>
                </div>
            </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
            </button>
            <button type="submit" className="px-8 py-2.5 text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all flex items-center">
                <UploadCloud size={18} className="mr-2" /> Post Job
            </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;