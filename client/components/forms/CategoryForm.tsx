
import React, { useState } from 'react';
import { Tag, Layers, Type, PlusCircle } from 'lucide-react';

interface CategoryFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Article'
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
    }, 1500);
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
                <Tag className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">Creating Tag...</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Organizing content structure</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                <Layers className="mr-2 text-blue-500" size={20} /> Category Details
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Define a new classification for your content.</p>
        </div>

        <div className={inputWrapperClass}>
            <label className={labelClass}>Category Name</label>
            <div className="relative">
                <Type className={iconClass} />
                <input required name="name" onChange={handleChange} className={inputClass} placeholder="e.g. Technology" />
            </div>
        </div>

        <div className={inputWrapperClass}>
            <label className={labelClass}>Content Type</label>
            <div className="relative">
                <Tag className={iconClass} />
                <select name="type" onChange={handleChange} className={`${inputClass} appearance-none`}>
                    <option value="Article">Article</option>
                    <option value="Podcast">Podcast</option>
                    <option value="Video">Video</option>
                    <option value="Business">Business</option>
                </select>
            </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
            </button>
            <button type="submit" className="px-8 py-2.5 text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all flex items-center">
                <PlusCircle size={18} className="mr-2" /> Create Category
            </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
