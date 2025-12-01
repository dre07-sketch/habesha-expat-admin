
import React, { useState } from 'react';
import { Megaphone, Link as LinkIcon, Layout, Clock, UploadCloud, Image as ImageIcon } from 'lucide-react';

interface AdFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AdForm: React.FC<AdFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Image',
    placement: 'Homepage Hero',
    url: '',
    durationValue: '7',
    durationUnit: 'Days'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";

  return (
    <div className="relative">
        {/* Cool Loading Overlay */}
        {isSubmitting && (
            <div className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-300">
                <div className="relative mb-6">
                    <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                    <Megaphone className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">Launching Campaign...</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Scheduling banner placement</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    <Megaphone className="mr-2 text-blue-500" size={20} /> Campaign Information
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Setup ad details and targeting.</p>
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Ad Title</label>
                <div className="relative">
                    <Megaphone className={iconClass} />
                    <input required name="title" onChange={handleChange} className={inputClass} placeholder="Enter ad title" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={inputWrapperClass}>
                    <label className={labelClass}>Type</label>
                    <div className="relative">
                        <ImageIcon className={iconClass} />
                        <select name="type" onChange={handleChange} className={`${inputClass} appearance-none`}>
                            <option value="Image">Image Banner</option>
                            <option value="Video">Video Ad</option>
                        </select>
                    </div>
                </div>
                <div className={inputWrapperClass}>
                    <label className={labelClass}>Placement</label>
                    <div className="relative">
                        <Layout className={iconClass} />
                        <select name="placement" onChange={handleChange} className={`${inputClass} appearance-none`}>
                            <option value="Homepage Hero">Homepage Hero</option>
                            <option value="Sidebar">Sidebar</option>
                            <option value="Article Body">Article Body</option>
                            <option value="Footer">Footer</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Ad URL</label>
                <div className="relative">
                    <LinkIcon className={iconClass} />
                    <input required type="url" name="url" onChange={handleChange} className={inputClass} placeholder="https://example.com/destination" />
                </div>
            </div>

            {/* Custom Duration Selector matching user request */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-blue-500/20">
                <label className={labelClass}>Campaign Duration</label>
                <div className="flex gap-4 mt-1">
                    <div className="w-1/2">
                        <input 
                            required 
                            type="number" 
                            name="durationValue" 
                            value={formData.durationValue} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="w-1/2 relative">
                        <select 
                            name="durationUnit" 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 border border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-950 text-slate-900 dark:text-white appearance-none cursor-pointer"
                        >
                            <option value="Days">Days</option>
                            <option value="Weeks">Weeks</option>
                            <option value="Months">Months</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </div>
                <div className="flex items-center mt-3 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <Clock size={12} className="mr-1.5 text-blue-500" />
                    Your ad will run for <strong className="text-slate-700 dark:text-slate-300 mx-1">{formData.durationValue} {formData.durationUnit}</strong> and then automatically deactivate
                </div>
            </div>

            <div>
                <label className={labelClass}>Media File</label>
                <div className="mt-1 flex items-center px-4 py-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                    <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4 group-hover:scale-110 transition-transform">
                        <UploadCloud size={24} />
                    </div>
                    <div className="flex-1">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Click to upload or drag and drop</p>
                        <input type="file" className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-0 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-transparent file:text-indigo-600 dark:file:text-indigo-400 cursor-pointer"/>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="px-6 py-2.5 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Cancel
                </button>
                <button type="submit" className="px-8 py-2.5 text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all flex items-center">
                    <Megaphone size={18} className="mr-2" /> Activate Campaign
                </button>
            </div>
        </form>
    </div>
  );
};

export default AdForm;
