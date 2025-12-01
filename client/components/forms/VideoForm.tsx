
import React, { useState } from 'react';
import { UploadCloud, Film, Type, Link as LinkIcon, AlignLeft, Tag, Image as ImageIcon } from 'lucide-react';

interface VideoFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
  const textAreaClass = "w-full pl-10 pr-4 py-3 border border-blue-500/30 dark:border-blue-500/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 resize-none";
  const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";
  const iconTextAreaClass = "absolute left-3 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";

  return (
    <div className="relative">
        {/* Cool Loading Overlay */}
        {isSubmitting && (
            <div className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-300">
                <div className="relative mb-6">
                    <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                    <Film className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">Processing Video...</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Encoding and uploading content</p>
            </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Video Details */}
        <div className="space-y-6">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    <Film className="mr-2 text-blue-500" size={20} /> Metadata & Info
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Details about the video content.</p>
            </div>

            <div className={inputWrapperClass}>
            <label className={labelClass}>Video Title</label>
            <div className="relative">
                <Type className={iconClass} />
                <input required name="title" onChange={handleChange} className={inputClass} placeholder="e.g. New Year Celebration" />
            </div>
            </div>

            <div className={inputWrapperClass}>
            <label className={labelClass}>URL Slug</label>
            <div className="relative">
                <LinkIcon className={iconClass} />
                <input required name="slug" onChange={handleChange} className={inputClass} placeholder="new-year-celebration" />
            </div>
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Category</label>
                <div className="relative">
                    <Tag className={iconClass} />
                    <select name="category" onChange={handleChange} className={`${inputClass} appearance-none`}>
                        <option value="">Select Category...</option>
                        <option value="Events">Events</option>
                        <option value="Interviews">Interviews</option>
                        <option value="Documentary">Documentary</option>
                        <option value="News">News</option>
                    </select>
                </div>
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Description</label>
                <div className="relative">
                    <AlignLeft className={iconTextAreaClass} />
                    <textarea name="description" rows={5} onChange={handleChange} className={textAreaClass} placeholder="Detailed description of the video content..."></textarea>
                </div>
            </div>
        </div>

        {/* Right Column: Media Assets */}
        <div className="space-y-6">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    <UploadCloud className="mr-2 text-indigo-500" size={20} /> Media Files
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Upload video file and thumbnail.</p>
            </div>

            {/* Video File Upload */}
            <div>
                <label className={labelClass}>Video File (MP4/MOV)</label>
                <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group bg-slate-50/30 dark:bg-slate-900/30">
                    <div className="space-y-2 text-center">
                        <div className="mx-auto h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center">
                            <Film className="h-6 w-6" />
                        </div>
                        <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                            <label className="relative cursor-pointer bg-transparent rounded-md font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                                <span>Upload Video</span>
                                <input type="file" className="sr-only" accept="video/*" />
                            </label>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">Max 500MB</p>
                    </div>
                </div>
            </div>

            {/* Thumbnail Image Upload */}
            <div>
                <label className={labelClass}>Thumbnail Image (16:9)</label>
                <div className="mt-1 flex items-center px-4 py-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900">
                    <div className="h-12 w-16 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4 overflow-hidden">
                        <ImageIcon size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Select Image</p>
                        <input type="file" accept="image/*" className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"/>
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
                Publish Video
            </button>
        </div>
        </form>
    </div>
  );
};

export default VideoForm;
