import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, MapPin, Calendar, Users, Globe, Save, Image as ImageIcon } from 'lucide-react';

export default function TravelForm({ isOpen, onClose, initialData, onSuccess }) {
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
        highlights: [], // jsonb
        itinerary: [], // jsonb
        status: 'active', // Added status field
        // Files are now handled separately
        hero_image: null, // Will be a File object
        gallery: [] // Will be an array of File objects
    };

    const [formData, setFormData] = useState(defaultState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // State for image previews
    const [heroPreview, setHeroPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    // Ref for the hidden gallery file input
    const galleryFileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || defaultState);
            // Reset previews when form opens with new data
            setHeroPreview(null);
            setGalleryPreviews([]);
        }
    }, [isOpen, initialData]);

    // Clean up object URLs to avoid memory leaks
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

    // --- Dynamic Field Handlers (Highlights & Itinerary remain the same) ---
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

    // --- File Handlers ---
    const handleHeroImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, hero_image: file }));
            setHeroPreview(URL.createObjectURL(file));
        } else {
            setFormData(prev => ({ ...prev, hero_image: null }));
            setHeroPreview(null);
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files) as File[];
            setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...files] }));
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index) => {
        // Revoke object URL to free up memory
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
            // Create FormData object for file upload
            const formDataToSubmit = new FormData();

            // Append all text fields
            formDataToSubmit.append('slug', formData.slug);
            formDataToSubmit.append('name', formData.name);
            formDataToSubmit.append('title', formData.title);
            formDataToSubmit.append('description', formData.description);
            formDataToSubmit.append('price', formData.price);
            formDataToSubmit.append('rating', formData.rating);
            formDataToSubmit.append('location', formData.location);
            formDataToSubmit.append('duration', formData.duration);
            formDataToSubmit.append('group_size', formData.group_size);
            formDataToSubmit.append('languages', formData.languages);
            formDataToSubmit.append('status', formData.status);

            // Append JSON fields
            formDataToSubmit.append('highlights', JSON.stringify(formData.highlights));
            formDataToSubmit.append('itinerary', JSON.stringify(formData.itinerary));

            // Append files
            if (formData.hero_image) {
                formDataToSubmit.append('hero_image', formData.hero_image);
            }

            if (formData.gallery && formData.gallery.length > 0) {
                formData.gallery.forEach(file => {
                    formDataToSubmit.append('gallery', file); // 'gallery' matches the name in multer
                });
            }

            const response = await fetch('/api/travel-destinations/travel-destinations-post', { // Adjusted endpoint
                method: 'POST',
                // Do NOT set the 'Content-Type' header. The browser does it automatically for FormData.
                body: formDataToSubmit,
            });

            const result = await response.json();

            if (result.success) {
                if (onSuccess) onSuccess(result.data);
                onClose();
                // You might want to show a success notification here
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 rounded-t-2xl z-10 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {initialData ? 'Edit Destination' : 'New Destination'}
                    </h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1: General Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-2">General Information</h3>
                            {/* ... (Name, Title, Slug, Price inputs remain the same) ... */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Destination Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Marketing Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Slug</label>
                                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} required
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Price</label>
                                    <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="$2,400"
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                            </div>
                        </div>

                        {/* Section 2: Details & Stats */}
                        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-2">Details & Logistics</h3>
                            {/* ... (Location, Duration, Group Size, Languages, Rating inputs remain the same) ... */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Location</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                                        <input type="text" name="location" value={formData.location} onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Duration</label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                                        <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="7 Days"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Group Size</label>
                                    <div className="relative">
                                        <Users size={16} className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                                        <input type="text" name="group_size" value={formData.group_size} onChange={handleChange} placeholder="Max 12"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Languages</label>
                                    <div className="relative">
                                        <Globe size={16} className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                                        <input type="text" name="languages" value={formData.languages} onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Rating (1-5)</label>
                                <input type="number" step="0.1" max="5" name="rating" value={formData.rating} onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>

                        {/* Section 3: Media - REVISED */}
                        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-2">Media</h3>

                            {/* Hero Image Upload */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Hero Image</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 cursor-pointer">
                                        <input type="file" name="hero_image" onChange={handleHeroImageChange} accept="image/*" className="hidden" />
                                        <div className="bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                                            {heroPreview ? (
                                                <img src={heroPreview} alt="Hero preview" className="h-32 mx-auto object-cover rounded" />
                                            ) : (
                                                <div className="text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
                                                    <ImageIcon size={24} />
                                                    <span className="text-sm">Click to upload hero image</span>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Gallery Upload */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase">Gallery Images</label>
                                <input
                                    type="file"
                                    ref={galleryFileInputRef}
                                    onChange={handleGalleryChange}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {galleryPreviews.map((preview, idx) => (
                                        <div key={idx} className="relative group">
                                            <img src={preview} alt={`Gallery preview ${idx + 1} `} className="w-full h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => galleryFileInputRef.current.click()}
                                        className="w-full h-24 bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: JSON Data (Highlights & Itinerary) - REMAINS THE SAME */}
                        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <h3 className="text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold mb-2">Experience Details</h3>
                            {/* Highlights */}
                            <div>
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase">Highlights</label>
                                <div className="space-y-2">
                                    {(formData.highlights || []).map((hl, idx) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <span className="text-xs text-slate-500 dark:text-slate-600 w-4">{idx + 1}.</span>
                                            <input type="text" value={hl} onChange={(e) => updateHighlight(idx, e.target.value)}
                                                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 outline-none" />
                                            <button type="button" onClick={() => removeHighlight(idx)} className="text-slate-500 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addHighlight} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center gap-1 mt-2">
                                        <Plus size={14} /> Add Highlight
                                    </button>
                                </div>
                            </div>
                            {/* Itinerary */}
                            <div className="pt-4">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase">Itinerary</label>
                                <div className="space-y-4">
                                    {(formData.itinerary || []).map((item, idx) => (
                                        <div key={idx} className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded">Day {idx + 1}</span>
                                                <button type="button" onClick={() => removeItinerary(idx)} className="text-slate-500 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <input type="text" placeholder="Day Title (e.g. Arrival in Addis)"
                                                value={item.title} onChange={(e) => updateItinerary(idx, 'title', e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded mb-2 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 outline-none" />
                                            <textarea placeholder="Description of activities..." rows={2}
                                                value={item.description} onChange={(e) => updateItinerary(idx, 'description', e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 outline-none resize-none" />
                                        </div>
                                    ))}
                                    <button type="button" onClick={addItineraryItem} className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex justify-center items-center gap-2">
                                        <Plus size={18} /> Add Day to Itinerary
                                    </button>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-200 dark:border-slate-800 p-6 bg-white/50 dark:bg-slate-900/50 rounded-b-2xl flex justify-end gap-3 z-10 backdrop-blur-md">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                        <Save size={18} />
                        {isSubmitting ? 'Saving...' : (initialData ? 'Update Destination' : 'Create Destination')}
                    </button>
                </div>

            </div>
        </div>
    );
}