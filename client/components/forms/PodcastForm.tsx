
import React, { useState } from 'react';
import { UploadCloud, Mic, FileAudio, Image as ImageIcon, Type, Link as LinkIcon, Tag } from 'lucide-react';

interface PodcastFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PodcastForm: React.FC<PodcastFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    host: '',
    slug: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request/upload
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
                    <Mic className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">Publishing Episode...</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Uploading audio files and assets</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Episode Details */}
        <div className="space-y-6">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    <Mic className="mr-2 text-blue-500" size={20} /> Episode Information
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Basic details about the podcast episode.</p>
            </div>

            <div className={inputWrapperClass}>
            <label className={labelClass}>Episode Title</label>
            <div className="relative">
                <Type className={iconClass} />
                <input required name="title" onChange={handleChange} className={inputClass} placeholder="e.g. The Future of Tech" />
            </div>
            </div>

            <div className={inputWrapperClass}>
            <label className={labelClass}>Host Name</label>
            <div className="relative">
                <Mic className={iconClass} />
                <input required name="host" onChange={handleChange} className={inputClass} placeholder="e.g. Sarah Jones" />
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className={inputWrapperClass}>
                    <label className={labelClass}>Category</label>
                    <div className="relative">
                        <Tag className={iconClass} />
                        <select name="category" onChange={handleChange} className={`${inputClass} appearance-none`}>
                            <option value="">Select...</option>
                            <option value="News">News</option>
                            <option value="Culture">Culture</option>
                            <option value="Business">Business</option>
                            <option value="Tech">Tech</option>
                        </select>
                    </div>
                </div>
                <div className={inputWrapperClass}>
                    <label className={labelClass}>URL Slug</label>
                    <div className="relative">
                        <LinkIcon className={iconClass} />
                        <input required name="slug" onChange={handleChange} className={inputClass} placeholder="the-future-of-tech" />
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Media Assets */}
        <div className="space-y-6">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    <UploadCloud className="mr-2 text-indigo-500" size={20} /> Media Assets
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Upload cover art and audio files.</p>
            </div>

            {/* Cover Image Upload */}
            <div>
                <label className={labelClass}>Cover Image (Square)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group">
                    <div className="space-y-1 text-center">
                        <div className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors">
                            <ImageIcon className="h-full w-full" />
                        </div>
                        <div className="flex text-sm text-slate-600 dark:text-slate-400">
                            <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input type="file" className="sr-only" accept="image/*" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                </div>
            </div>

            {/* Audio File Upload */}
            <div>
                <label className={labelClass}>Audio File (MP3/WAV)</label>
                <div className="mt-1 flex items-center px-4 py-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                        <FileAudio size={20} />
                    </div>
                    <div className="flex-1">
                        <input type="file" accept="audio/*" className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"/>
                    </div>
                </div>
            </div>

        </div>

        {/* Footer Actions */}
        <div className="col-span-1 lg:col-span-2 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
            </button>
            <button type="submit" className="px-8 py-2.5 text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all">
                Publish Episode
            </button>
        </div>
        </form>
    </div>
  );
};

export default PodcastForm;
