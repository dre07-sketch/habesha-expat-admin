
import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, AlignLeft, Image as ImageIcon, UploadCloud, Map, Type, Tag } from 'lucide-react';

interface B2BFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const B2BForm: React.FC<B2BFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    email: '',
    phone: '',
    address: '',
    mapPin: '',
    website: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
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
                <Building2 className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">Submitting Listing...</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Verifying business details</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                <Building2 className="mr-2 text-blue-500" size={20} /> Business Details
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enter the core information for the business listing.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={inputWrapperClass}>
                <label className={labelClass}>Business Name</label>
                <div className="relative">
                    <Type className={iconClass} />
                    <input required name="name" onChange={handleChange} className={inputClass} placeholder="e.g. Habesha Coffee" />
                </div>
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Category</label>
                <div className="relative">
                    <Tag className={iconClass} />
                    <select name="category" onChange={handleChange} className={`${inputClass} appearance-none`}>
                        <option value="">Select Category</option>
                        <option value="Food & Drink">Food & Drink</option>
                        <option value="Technology">Technology</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Retail">Retail</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={inputWrapperClass}>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                    <Mail className={iconClass} />
                    <input type="email" name="email" onChange={handleChange} className={inputClass} placeholder="contact@business.com" />
                </div>
            </div>
            <div className={inputWrapperClass}>
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                    <Phone className={iconClass} />
                    <input type="tel" name="phone" onChange={handleChange} className={inputClass} placeholder="+251 911 000 000" />
                </div>
            </div>
        </div>

        <div className={inputWrapperClass}>
            <label className={labelClass}>Address</label>
            <div className="relative">
                <MapPin className={iconClass} />
                <input required name="address" onChange={handleChange} className={inputClass} placeholder="Street address, City" />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={inputWrapperClass}>
                <label className={labelClass}>Website Link</label>
                <div className="relative">
                    <Globe className={iconClass} />
                    <input type="url" name="website" onChange={handleChange} className={inputClass} placeholder="https://example.com" />
                </div>
            </div>
            <div className={inputWrapperClass}>
                <label className={labelClass}>Map Pin (Coordinates)</label>
                <div className="relative">
                    <Map className={iconClass} />
                    <input name="mapPin" onChange={handleChange} className={inputClass} placeholder="Lat, Long" />
                </div>
            </div>
        </div>

        <div>
            <label className={labelClass}>Business Image</label>
            <div className="mt-1 flex items-center px-4 py-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4 group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} />
                </div>
                <div className="flex-1">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Select an Image</p>
                    <input type="file" accept="image/*" className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-0 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-transparent file:text-indigo-600 dark:file:text-indigo-400 cursor-pointer"/>
                </div>
            </div>
        </div>

        <div className={inputWrapperClass}>
            <label className={labelClass}>Description</label>
            <div className="relative">
                <AlignLeft className={iconTextAreaClass} />
                <textarea name="description" rows={4} onChange={handleChange} className={textAreaClass} placeholder="Describe the business services and offerings..."></textarea>
            </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
            </button>
            <button type="submit" className="px-8 py-2.5 text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all flex items-center">
                <UploadCloud size={18} className="mr-2" /> Submit Listing
            </button>
        </div>
      </form>
    </div>
  );
};

export default B2BForm;
