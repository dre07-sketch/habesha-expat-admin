import React, { useState } from 'react';
import { MapPin, Calendar, Type, AlignLeft, Users, Image as ImageIcon, UploadCloud, Clock, DollarSign, User as UserIcon, X, Globe, Tag } from 'lucide-react';

interface EventFormProps {
    onCancel: () => void;
    // We updated this signature because the fetch happens inside now, 
    // or you can pass the response data up after success.
    onSuccess?: (response: any) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onCancel, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        attendees: '', // Changed to string to handle empty input easier
        price: '',
        organizer: '',
        description: '',
        city: '',
        category: ''
    });

    // New state for the file
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Specific handler for file input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            // Create a local preview URL
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // 1. Create FormData object (Required for Multer)
        const data = new FormData();

        // 2. Append text fields
        Object.keys(formData).forEach(key => {
            // @ts-ignore
            data.append(key, formData[key]);
        });

        // 3. Append the file
        // 'image' must match the backend upload.single('image')
        if (selectedImage) {
            data.append('image', selectedImage);
        }

        try {
            // 4. Send Request
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5000/api/events/events-post', { // Update with your actual API Port
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                // Note: Do NOT set 'Content-Type': 'multipart/form-data'. 
                // The browser sets this automatically with the correct boundary.
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || 'Failed to create event');
            }

            // Success simulation delay just for the UI effect
            setTimeout(() => {
                setIsSubmitting(false);
                if (onSuccess) onSuccess(result);

                onCancel(); // Close form
            }, 1500);

        } catch (err: any) {
            setIsSubmitting(false);
            setError(err.message);
        }
    };

    const inputWrapperClass = "relative group";
    const inputClass = "w-full pl-10 pr-4 py-3 border border-blue-500/30 dark:border-blue-500/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400";
    const textAreaClass = "w-full pl-10 pr-4 py-3 border border-blue-500/30 dark:border-blue-500/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 resize-none";
    const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1";
    const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";
    const iconTextAreaClass = "absolute left-3 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";

    return (
        <div className="relative p-1">
            {/* Loading Overlay - More Premium */}
            {isSubmitting && (
                <div className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center rounded-3xl animate-in fade-in duration-500">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 border-4 border-indigo-500/10 rounded-full"></div>
                        <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_20px_rgba(79,70,229,0.3)]"></div>
                        <UploadCloud className="absolute inset-0 m-auto text-indigo-600 animate-bounce" size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-widest uppercase mb-2">Publishing Event</h3>
                    <p className="text-slate-500 dark:text-indigo-400 font-bold animate-pulse text-xs tracking-widest uppercase">Syncing with secure server...</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3">
                        <div className="w-6 h-6 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center shrink-0">
                            <X size={14} />
                        </div>
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Image Upload & Basics */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="group relative">
                            <label className={labelClass}>Event Banner</label>
                            <div className={`mt-2 h-64 rounded-[2rem] border-2 border-dashed transition-all duration-500 relative overflow-hidden flex flex-col items-center justify-center group ${selectedImage
                                    ? 'border-indigo-500 bg-indigo-50/10'
                                    : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-900/50'
                                }`}>
                                {previewUrl ? (
                                    <>
                                        <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                            <button type="button" onClick={removeImage} className="bg-rose-600 text-white p-3 rounded-2xl shadow-xl hover:bg-rose-700 transition-all active:scale-90">
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:scale-110 transition-all mx-auto mb-4 border border-slate-100 dark:border-slate-700">
                                            <ImageIcon size={28} />
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Upload Photo</div>
                                        <p className="text-[9px] text-slate-500 mb-4 px-4 font-bold">1200x630 highly recommended</p>
                                        <label className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 inline-block">
                                            Pick Image
                                            <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Pricing & Host</p>
                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Ticket Price</label>
                                <div className="relative">
                                    <DollarSign className={iconClass} />
                                    <input name="price" value={formData.price} onChange={handleChange} className={inputClass} placeholder="e.g. $25.00" />
                                </div>
                            </div>
                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Organizer</label>
                                <div className="relative">
                                    <UserIcon className={iconClass} />
                                    <input name="organizer" value={formData.organizer} onChange={handleChange} className={inputClass} placeholder="Host Name" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Key Details */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Section 1: Identity */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Identity</h3>
                            </div>
                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Event Title</label>
                                <div className="relative">
                                    <Type className={iconClass} />
                                    <input required name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g. Tech Conference 2025" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={inputWrapperClass}>
                                    <label className={labelClass}>Category</label>
                                    <div className="relative">
                                        <Tag className={iconClass} />
                                        <input required name="category" value={formData.category} onChange={handleChange} className={inputClass} placeholder="e.g. Networking" />
                                    </div>
                                </div>
                                <div className={inputWrapperClass}>
                                    <label className={labelClass}>Guest Capacity</label>
                                    <div className="relative">
                                        <Users className={iconClass} />
                                        <input type="number" name="attendees" value={formData.attendees} onChange={handleChange} className={inputClass} placeholder="0" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Logistics */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-sky-400 rounded-full"></div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Logistics</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={inputWrapperClass}>
                                    <label className={labelClass}>Date</label>
                                    <div className="relative">
                                        <Calendar className={iconClass} />
                                        <input required type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                                <div className={inputWrapperClass}>
                                    <label className={labelClass}>Time</label>
                                    <div className="relative">
                                        <Clock className={iconClass} />
                                        <input type="time" name="time" value={formData.time} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={inputWrapperClass}>
                                    <label className={labelClass}>City</label>
                                    <div className="relative">
                                        <Globe className={iconClass} />
                                        <input required name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="Addis Ababa" />
                                    </div>
                                </div>
                                <div className={inputWrapperClass}>
                                    <label className={labelClass}>Address Detail</label>
                                    <div className="relative">
                                        <MapPin className={iconClass} />
                                        <input required name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="e.g. Hilton Hotel" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Description */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-6 bg-emerald-400 rounded-full"></div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Narrative</h3>
                            </div>
                            <div className={inputWrapperClass}>
                                <label className={labelClass}>Agenda & Details</label>
                                <div className="relative">
                                    <AlignLeft className={iconTextAreaClass} />
                                    <textarea name="description" value={formData.description} rows={5} onChange={handleChange} className={textAreaClass} placeholder="What should people expect from this event?"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/5 backdrop-blur-md p-6 rounded-[2rem]">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-3 text-slate-500 hover:text-rose-500 font-black text-xs uppercase tracking-widest transition-all"
                    >
                        Dismiss
                    </button>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative px-10 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1 transition-all disabled:opacity-50 active:scale-95 flex items-center overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center">
                                <UploadCloud size={18} className="mr-3 group-hover:animate-bounce" />
                                {isSubmitting ? 'Uploading...' : 'Publish Event'}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EventForm;