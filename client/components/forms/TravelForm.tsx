import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, MapPin, Calendar, Users, Globe, Save, Image as ImageIcon, Layout, ListChecks, Map, AlertCircle, CheckCircle2, ChevronRight, Star } from 'lucide-react';

export default function TravelForm({ isOpen, onClose, initialData, onSuccess }) {
    const [activeTab, setActiveTab] = useState('general');
    
    // Default Initial State based on DB Schema
    const defaultState = {
        slug: '',
        name: '',
        title: '',
        description: '',
        price: '',
        rating: 5.0,
        location: '',
        duration: '',
        group_size: '',
        languages: 'English',
        highlights: [] as string[],
        itinerary: [] as { day: number; title: string; description: string }[],
        status: 'active',
        hero_image: null as File | string | null,
        gallery: [] as (File | string)[]
    };

    const [formData, setFormData] = useState(defaultState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [heroPreview, setHeroPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const galleryFileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || defaultState);
            setHeroPreview(null);
            setGalleryPreviews([]);
            setActiveTab('general');
            setError('');
        }
    }, [isOpen, initialData]);

    useEffect(() => {
        return () => {
            if (heroPreview) URL.revokeObjectURL(heroPreview);
            galleryPreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [heroPreview, galleryPreviews]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addHighlight = () => {
        setFormData(prev => ({ ...prev, highlights: [...(prev.highlights || []), ""] }));
    };
    
    const updateHighlight = (index, value) => {
        const newHighlights = [...(formData.highlights || [])];
        newHighlights[index] = value;
        setFormData(prev => ({ ...prev, highlights: newHighlights }));
    };
    
    const removeHighlight = (index) => {
        const newHighlights = [...(formData.highlights || [])];
        newHighlights.splice(index, 1);
        setFormData(prev => ({ ...prev, highlights: newHighlights }));
    };
    
    const addItineraryItem = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [...(prev.itinerary || []), { day: (prev.itinerary?.length || 0) + 1, title: "", description: "" }]
        }));
    };
    
    const updateItinerary = (index, field, value) => {
        const newItinerary = [...(formData.itinerary || [])];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };
    
    const removeItinerary = (index) => {
        const newItinerary = [...(formData.itinerary || [])];
        newItinerary.splice(index, 1);
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, hero_image: file }));
            setHeroPreview(URL.createObjectURL(file as Blob));
        } else {
            setFormData(prev => ({ ...prev, hero_image: null }));
            setHeroPreview(null);
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files: File[] = Array.from(e.target.files);
            setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...files] }));
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index) => {
        URL.revokeObjectURL(galleryPreviews[index]);
        const newGallery = [...formData.gallery];
        newGallery.splice(index, 1);
        setFormData(prev => ({ ...prev, gallery: newGallery }));
        const newPreviews = [...galleryPreviews];
        newPreviews.splice(index, 1);
        setGalleryPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const formDataToSubmit = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'highlights' || key === 'itinerary') {
                    formDataToSubmit.append(key, JSON.stringify(formData[key]));
                } else if (key !== 'hero_image' && key !== 'gallery') {
                    formDataToSubmit.append(key, formData[key]);
                }
            });

            if (formData.hero_image) formDataToSubmit.append('hero_image', formData.hero_image);
            if (formData.gallery && formData.gallery.length > 0) {
                formData.gallery.forEach(file => formDataToSubmit.append('gallery', file));
            }

            const token = localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5000/api/travel-destinations/travel-destinations-post', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formDataToSubmit,
            });

            const result = await response.json();
            if (result.success) {
                if (onSuccess) onSuccess(result.data);
                onClose();
            } else {
                setError(result.message || 'Failed to create destination');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'general', label: 'General', icon: Layout },
        { id: 'logistics', label: 'Logistics', icon: MapPin },
        { id: 'experience', label: 'Experience', icon: ListChecks },
        { id: 'media', label: 'Media', icon: ImageIcon }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-6xl h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {initialData ? 'Refine Destination' : 'Craft New Adventure'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Fill in the details to curate a unique travel experience.</p>
                    </div>
                    <button onClick={onClose} className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-64 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-6 flex flex-col gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                                }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {activeTab === tab.id && <ChevronRight size={14} className="ml-auto opacity-70" />}
                            </button>
                        ))}
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-10 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                        {error && (
                            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-4">
                                <AlertCircle size={20} />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} id="travel-form">
                            {activeTab === 'general' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <div className="grid grid-cols-2 gap-8 font-primary">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Destination Name</label>
                                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Historic Axum Tour"
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Marketing Headline</label>
                                            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Explore the ancient ruins and stelae"
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">URL Slug</label>
                                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required placeholder="historic-axum-tour"
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-mono text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Price Point</label>
                                            <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="$1,200"
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Narrative Description</label>
                                            <textarea name="description" value={formData.description} onChange={handleChange} rows={6} placeholder="Tell the story of this journey..."
                                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'logistics' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="group">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Base Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ethiopia • Amhara Region"
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-14 pr-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Total Duration</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                                <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="7 Days / 6 Nights"
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-14 pr-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Group Size</label>
                                            <div className="relative">
                                                <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                                <input type="text" name="group_size" value={formData.group_size} onChange={handleChange} placeholder="2 - 12 Guests"
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-14 pr-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Languages</label>
                                            <div className="relative">
                                                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                                <input type="text" name="languages" value={formData.languages} onChange={handleChange} placeholder="English, Amharic"
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl pl-14 pr-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Experience Rating</label>
                                            <div className="flex items-center gap-4">
                                                <input type="range" min="1" max="5" step="0.1" name="rating" value={formData.rating} onChange={handleChange}
                                                    className="flex-1 accent-yellow-500" />
                                                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-xl border border-yellow-200 dark:border-yellow-800/50 font-bold flex items-center gap-2">
                                                    <Star size={16} fill="currentColor" /> {formData.rating}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Publish Status</label>
                                            <div className="flex gap-4">
                                                {['active', 'inactive', 'draft'].map((status) => (
                                                    <button
                                                        key={status}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, status }))}
                                                        className={`flex-1 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
                                                            formData.status === status
                                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                                                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500'
                                                        }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'experience' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
                                    {/* Highlights Section */}
                                    <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                Highlights
                                            </h3>
                                            <button type="button" onClick={addHighlight} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                                                <Plus size={16} /> Add Highlight
                                            </button>
                                        </div>
                                        <div className="grid gap-4">
                                            {(formData.highlights || []).map((hl, idx) => (
                                                <div key={idx} className="group flex gap-3 animate-in zoom-in-95">
                                                    <div className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all">{idx + 1}</div>
                                                    <input type="text" value={hl} onChange={(e) => updateHighlight(idx, e.target.value)} placeholder="What makes this journey special?"
                                                        className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-sm text-slate-900 dark:text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                                                    <button type="button" onClick={() => removeHighlight(idx)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                            {formData.highlights?.length === 0 && (
                                                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-sm">No highlights added yet.</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Itinerary Section */}
                                    <div className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800 p-8">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                                    <Map size={20} />
                                                </div>
                                                The Itinerary
                                            </h3>
                                            <button type="button" onClick={addItineraryItem} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                                                <Plus size={16} /> Add New Day
                                            </button>
                                        </div>
                                        <div className="space-y-6">
                                            {(formData.itinerary || []).map((item, idx) => (
                                                <div key={idx} className="relative pl-12 pb-6 border-l-2 border-slate-100 dark:border-slate-800 group animate-in slide-in-from-left-4 last:pb-0 last:border-0">
                                                    <div className="absolute -left-[11px] top-0 w-5 h-5 bg-white dark:bg-slate-900 border-4 border-blue-500 rounded-full transition-transform group-hover:scale-125 group-hover:bg-blue-500" />
                                                    <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all">
                                                        <div className="flex justify-between items-center mb-4">
                                                            <span className="text-xs font-black text-blue-500 uppercase tracking-widest">Day {idx + 1}</span>
                                                            <button type="button" onClick={() => removeItinerary(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                        <input type="text" placeholder="Day Title (e.g. Arrival & Welcome Dinner)"
                                                            value={item.title} onChange={(e) => updateItinerary(idx, 'title', e.target.value)}
                                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white mb-3 focus:border-blue-500 outline-none" />
                                                        <textarea placeholder="Describe the day's events and highlights..." rows={3}
                                                            value={item.description} onChange={(e) => updateItinerary(idx, 'description', e.target.value)}
                                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-400 focus:border-blue-500 outline-none resize-none leading-relaxed" />
                                                    </div>
                                                </div>
                                            ))}
                                            {formData.itinerary?.length === 0 && (
                                                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 text-sm">No itinerary days mapped yet.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'media' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-right-4">
                                    {/* Hero Upload */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Hero Experience Image</label>
                                        <label className="relative group cursor-pointer block">
                                            <input type="file" onChange={handleHeroImageChange} accept="image/*" className="hidden" />
                                            <div className="w-full h-80 bg-slate-50 dark:bg-slate-800/50 border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group-hover:border-blue-500 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10 transition-all overflow-hidden">
                                                {heroPreview ? (
                                                    <img src={heroPreview} alt="Hero" className="w-full h-full object-cover" />
                                                ) : (
                                                    <>
                                                        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none text-blue-600 transition-transform group-hover:scale-110">
                                                            <ImageIcon size={40} />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-slate-900 dark:text-white font-bold">Select Hero Image</p>
                                                            <p className="text-slate-400 text-sm mt-1">PNG, JPG or WebP (Max 10MB)</p>
                                                        </div>
                                                    </>
                                                )}
                                                {heroPreview && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold backdrop-blur-sm transition-all">Replace Image</div>}
                                            </div>
                                        </label>
                                    </div>

                                    {/* Gallery Upload */}
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience Gallery</label>
                                            <button type="button" onClick={() => galleryFileInputRef.current.click()} className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-bold transition-transform hover:scale-105 active:scale-95">Add Images</button>
                                        </div>
                                        <input type="file" ref={galleryFileInputRef} onChange={handleGalleryChange} multiple accept="image/*" className="hidden" />
                                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                            {galleryPreviews.map((preview, idx) => (
                                                <div key={idx} className="relative group aspect-square">
                                                    <img src={preview} alt="Gallery" className="w-full h-full object-cover rounded-3xl border border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-105" />
                                                    <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 hover:scale-110 transition-all scale-75">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => galleryFileInputRef.current.click()} className="aspect-square bg-slate-50 dark:bg-slate-800/50 border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all group">
                                                <Plus size={24} className="group-hover:scale-125 transition-transform" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4 bg-white dark:bg-slate-900">
                    <button onClick={onClose} className="px-8 py-3.5 rounded-2xl text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
                    <button
                        type="submit"
                        form="travel-form"
                        disabled={isSubmitting}
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-50 disabled:translate-y-0"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Curating...</span>
                            </div>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>{initialData ? 'Update Experience' : 'Publish Adventure'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}