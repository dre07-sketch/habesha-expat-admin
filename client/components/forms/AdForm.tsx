import React, { useState, useRef } from 'react';
import { Megaphone, Link as LinkIcon, Layout, Clock, UploadCloud, Image as ImageIcon, Video } from 'lucide-react';

interface AdFormProps {
    onSubmit?: (data: FormData) => void;
    onCancel: () => void;
}

const AdForm: React.FC<AdFormProps> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Image',
        placement: 'Homepage - Top Header',
        url: '',
        durationValue: '7',
        durationUnit: 'Days'
    });
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<string>('');
    const [submitError, setSubmitError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name);

            // Auto-detect type based on file
            if (selectedFile.type.startsWith('video/')) {
                setFormData(prev => ({ ...prev, type: 'Video' }));
            } else if (selectedFile.type.startsWith('image/')) {
                setFormData(prev => ({ ...prev, type: 'Image' }));
            }
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        setSubmitError('');

        try {
            // Create FormData for file upload
            const data = new FormData();
            data.append('title', formData.title);
            data.append('type', formData.type);
            data.append('placement', formData.placement);
            data.append('url', formData.url);
            data.append('durationValue', formData.durationValue);
            data.append('durationUnit', formData.durationUnit);

            if (file) {
                data.append('mediaFile', file);
            }

            // Debug: Log FormData contents
            console.log('Submitting form with data:');
            for (let [key, value] of data.entries()) {
                console.log(`${key}:`, value);
            }

            // Make API call to your backend
            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5000/api/ads/ads-post', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data,
                // Don't set Content-Type header when using FormData, browser will set it with boundary
            });

            // Check if response is OK
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            const result = await response.json();
            console.log('Server response:', result);

            if (result.success) {
                setSubmitMessage(`Ad campaign created successfully with ID: ${result.id}`);
                // Reset form after successful submission
                setFormData({
                    title: '',
                    type: 'Image',
                    placement: 'Homepage - Top Header',
                    url: '',
                    durationValue: '7',
                    durationUnit: 'Days'
                });
                setFile(null);
                setFileName('');

                // Call onSubmit prop if provided
                if (onSubmit) {
                    onSubmit(data);
                }
            } else {
                throw new Error(result.error || 'Failed to create ad campaign');
            }
        } catch (error) {
            console.error('Error submitting ad:', error);
            setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
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
                    <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Uploading media and scheduling banner placement</p>
                </div>
            )}

            {/* Success Message */}
            {submitMessage && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <p className="text-green-800 dark:text-green-200 font-medium">{submitMessage}</p>
                </div>
            )}

            {/* Error Message */}
            {submitError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-red-800 dark:text-red-200 font-medium">{submitError}</p>
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
                        <input required name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="Enter ad title" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={inputWrapperClass}>
                        <label className={labelClass}>Type</label>
                        <div className="relative">
                            {formData.type === 'Image' ? (
                                <ImageIcon className={iconClass} />
                            ) : (
                                <Video className={iconClass} />
                            )}
                            <select name="type" value={formData.type} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                <option value="Image">Image Banner</option>
                                <option value="Video">Video Ad</option>
                            </select>
                        </div>
                    </div>
                    <div className={inputWrapperClass}>
                        <label className={labelClass}>Placement</label>
                        <div className="relative">
                            <Layout className={iconClass} />
                            <select name="placement" value={formData.placement} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                {/* Homepage Options */}
                                <optgroup label="Homepage">
                                    <option value="Homepage - Top Header">Top Header</option>
                                    <option value="Homepage - Section Divider 1">Section Divider 1</option>
                                    <option value="Homepage - Side Ad Banner 1">Side Ad Banner 1</option>
                                    <option value="Homepage - Section Divider 2">Section Divider 2</option>
                                </optgroup>

                                {/* Inside Article Options */}
                                <optgroup label="Inside Article">
                                    <option value="Inside Article - Top Header">Top Header</option>
                                    <option value="Inside Article - Section Divider 1">Section Divider 1</option>
                                    <option value="Inside Article - Side Ad Banner 1">Side Ad Banner 1</option>
                                    <option value="Inside Article - Footer">Footer</option>
                                </optgroup>

                                {/* Business Options */}
                                <optgroup label="Business">
                                    <option value="Business - Top Header">Top Header</option>
                                    <option value="Business - Side Ad Banner">Side Ad Banner</option>
                                </optgroup>

                                {/* Business Detail Options */}
                                <optgroup label="Business Detail">
                                    <option value="Business Detail - Top Header">Top Header</option>
                                    <option value="Business Detail - Side Ad Banner">Side Ad Banner</option>
                                </optgroup>

                                {/* Jobs Options */}
                                <optgroup label="Jobs">
                                    <option value="Jobs - Top Header">Top Header</option>
                                    <option value="Jobs - Side Ad Banner">Side Ad Banner</option>
                                </optgroup>

                                {/* Events Options */}
                                <optgroup label="Events">
                                    <option value="Events - Top Header">Top Header</option>
                                    <option value="Events - Bottom Footer Ad Banner">Bottom Footer Ad Banner</option>
                                </optgroup>

                                {/* Podcast Options */}
                                <optgroup label="Podcast">
                                    <option value="Podcast - Top Header">Top Header</option>
                                    <option value="Podcast - Bottom Footer Ad Banner">Bottom Footer Ad Banner</option>
                                </optgroup>

                                {/* Podcast Detail Options */}
                                <optgroup label="Podcast Detail">
                                    <option value="Podcast Detail - Top Header">Top Header</option>
                                    <option value="Podcast Detail - Side Ad Banner">Side Ad Banner</option>
                                </optgroup>

                                {/* Video Options */}
                                <optgroup label="Video">
                                    <option value="Video - Header">Header</option>
                                </optgroup>

                                {/* Video Detail Options */}
                                <optgroup label="Video Detail">
                                    <option value="Video Detail - Top Header">Top Header</option>
                                    <option value="Video Detail - Side Ad Banner">Side Ad Banner</option>
                                </optgroup>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={inputWrapperClass}>
                    <label className={labelClass}>Ad URL</label>
                    <div className="relative">
                        <LinkIcon className={iconClass} />
                        <input required type="url" name="url" value={formData.url} onChange={handleChange} className={inputClass} placeholder="https://example.com/destination" />
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
                                value={formData.durationUnit}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-950 text-slate-900 dark:text-white appearance-none cursor-pointer"
                            >
                                <option value="Days">Days</option>
                                <option value="Weeks">Weeks</option>
                                <option value="Months">Months</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
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
                    <div
                        className="mt-1 flex items-center px-4 py-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                        onClick={triggerFileInput}
                    >
                        <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4 group-hover:scale-110 transition-transform">
                            <UploadCloud size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                                {formData.type === 'Image' ? 'Upload Image' : 'Upload Video'}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                {fileName || 'No file chosen'}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                {formData.type === 'Image'
                                    ? 'JPG, PNG, GIF up to 10MB'
                                    : 'MP4, WebM up to 50MB'}
                            </p>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept={formData.type === 'Image' ? "image/*" : "video/*"}
                        />
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