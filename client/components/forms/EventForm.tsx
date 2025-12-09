import React, { useState } from 'react';
import { MapPin, Calendar, Type, AlignLeft, Users, Image as ImageIcon, UploadCloud, Clock, DollarSign, User as UserIcon, X } from 'lucide-react';

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
    description: ''
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
        const response = await fetch('http://localhost:5000/api/events/events-post', { // Update with your actual API Port
            method: 'POST',
            // Note: Do NOT set 'Content-Type': 'multipart/form-data'. 
            // The browser sets this automatically with the correct boundary.
            body: data, 
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Failed to create event');
        }

        // Success simulation delay just for the UI effect
        setTimeout(() => {
            setIsSubmitting(false);
            if (onSuccess) onSuccess(result);
            alert('Event created successfully!');
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
    <div className="relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-300">
            <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                <Calendar className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">Creating Event...</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Uploading data to server</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                <Calendar className="mr-2 text-blue-500" size={20} /> Event Details
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Basic information about the gathering.</p>
        </div>

        {error && (
            <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
            </div>
        )}

        <div className={inputWrapperClass}>
            <label className={labelClass}>Event Title</label>
            <div className="relative">
                <Type className={iconClass} />
                <input required name="title" onChange={handleChange} className={inputClass} placeholder="e.g. Grand Run 2025" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={inputWrapperClass}>
                <label className={labelClass}>Date</label>
                <div className="relative">
                    <Calendar className={iconClass} />
                    <input required type="date" name="date" onChange={handleChange} className={inputClass} />
                </div>
            </div>
            <div className={inputWrapperClass}>
                <label className={labelClass}>Time</label>
                <div className="relative">
                    <Clock className={iconClass} />
                    <input type="time" name="time" onChange={handleChange} className={inputClass} />
                </div>
            </div>
        </div>

        <div className={inputWrapperClass}>
            <label className={labelClass}>Location</label>
            <div className="relative">
                <MapPin className={iconClass} />
                <input required name="location" onChange={handleChange} className={inputClass} placeholder="e.g. Meskel Square, Addis Ababa" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className={inputWrapperClass}>
                <label className={labelClass}>Capacity</label>
                <div className="relative">
                    <Users className={iconClass} />
                    <input type="number" name="attendees" onChange={handleChange} className={inputClass} placeholder="0" />
                </div>
            </div>
            <div className={inputWrapperClass}>
                <label className={labelClass}>Ticket Price</label>
                <div className="relative">
                    <DollarSign className={iconClass} />
                    <input name="price" onChange={handleChange} className={inputClass} placeholder="Free or $25.00" />
                </div>
            </div>
            <div className={inputWrapperClass}>
                <label className={labelClass}>Organizer</label>
                <div className="relative">
                    <UserIcon className={iconClass} />
                    <input name="organizer" onChange={handleChange} className={inputClass} placeholder="Host Name" />
                </div>
            </div>
        </div>

        <div>
            <label className={labelClass}>Event Banner</label>
            <div className={`mt-1 flex items-center px-4 py-4 border-2 border-dashed ${selectedImage ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'} rounded-xl transition-colors relative`}>
                
                {previewUrl ? (
                    <div className="flex items-center w-full">
                        <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-slate-300 shadow-sm" />
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-bold text-slate-700 dark:text-white truncate">{selectedImage?.name}</p>
                            <p className="text-xs text-blue-500">Image selected</p>
                        </div>
                        <button type="button" onClick={removeImage} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500">
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4">
                            <ImageIcon size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Upload Image</p>
                            <input 
                                type="file" 
                                name="image" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-0 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-transparent file:text-indigo-600 dark:file:text-indigo-400 cursor-pointer"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>

        <div className={inputWrapperClass}>
            <label className={labelClass}>Description</label>
            <div className="relative">
                <AlignLeft className={iconTextAreaClass} />
                <textarea name="description" rows={4} onChange={handleChange} className={textAreaClass} placeholder="Event agenda and details..."></textarea>
            </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed">
                <UploadCloud size={18} className="mr-2" /> 
                {isSubmitting ? 'Uploading...' : 'Create Event'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;