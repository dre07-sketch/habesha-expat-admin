import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, AlignLeft, Image as ImageIcon, UploadCloud, Map, Type, Tag, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
    description: '',
    image: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear image error if exists
      if (fieldErrors.image) {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.image;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Business name is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('error');
      setSubmitMessage('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Create FormData to handle file upload
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('category', formData.category);
      dataToSend.append('email', formData.email);
      dataToSend.append('phone', formData.phone);
      dataToSend.append('address', formData.address);
      dataToSend.append('mapPin', formData.mapPin);
      dataToSend.append('website', formData.website);
      dataToSend.append('description', formData.description);
      
      if (formData.image) {
        dataToSend.append('image', formData.image);
      }

      const response = await fetch('http://localhost:5000/api/b2b/businesses-post', {
        method: 'POST',
        body: dataToSend
      });

      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage('Business listing submitted successfully!');
        // Reset form after successful submission
        setFormData({
          name: '',
          category: '',
          email: '',
          phone: '',
          address: '',
          mapPin: '',
          website: '',
          description: '',
          image: null
        });
        setImagePreview(null);
        
        // Call parent onSubmit with the result
        onSubmit(result);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || result.error || 'Failed to submit business listing');
        
        // Handle field-specific errors if returned
        if (result.message && result.message.includes("Name and category are required")) {
          if (!formData.name.trim()) {
            setFieldErrors(prev => ({ ...prev, name: 'Business name is required' }));
          }
          if (!formData.category) {
            setFieldErrors(prev => ({ ...prev, category: 'Category is required' }));
          }
        }
      }
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage('An error occurred while submitting the form');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputWrapperClass = "relative group";
  const inputClass = (fieldName: string) => `w-full pl-10 pr-4 py-3 border ${
    fieldErrors[fieldName] 
      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-blue-500/30 dark:border-blue-500/40 focus:ring-blue-500 focus:border-blue-500'
  } rounded-xl focus:ring-2 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400`;
  
  const textAreaClass = (fieldName: string) => `w-full pl-10 pr-4 py-3 border ${
    fieldErrors[fieldName] 
      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-blue-500/30 dark:border-blue-500/40 focus:ring-blue-500 focus:border-blue-500'
  } rounded-xl focus:ring-2 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 resize-none`;
  
  const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";
  const iconTextAreaClass = "absolute left-3 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";
  const errorClass = "text-xs text-red-500 dark:text-red-400 mt-1 flex items-center";

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

      {/* Success/Error Message */}
      {submitStatus !== 'idle' && (
        <div className={`mb-6 p-4 rounded-xl flex items-center ${
          submitStatus === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800/30' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800/30'
        }`}>
          {submitStatus === 'success' ? (
            <CheckCircle className="mr-3 text-green-500" size={20} />
          ) : (
            <XCircle className="mr-3 text-red-500" size={20} />
          )}
          <span className="font-medium">{submitMessage}</span>
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
                <label className={labelClass}>Business Name *</label>
                <div className="relative">
                    <Type className={iconClass} />
                    <input 
                      required 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className={inputClass('name')} 
                      placeholder="e.g. Habesha Coffee" 
                    />
                </div>
                {fieldErrors.name && (
                  <div className={errorClass}>
                    <AlertCircle size={12} className="mr-1" />
                    {fieldErrors.name}
                  </div>
                )}
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Category *</label>
                <div className="relative">
                    <Tag className={iconClass} />
                    <select 
                      required 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange} 
                      className={`${inputClass('category')} appearance-none`}
                    >
                        <option value="">Select Category</option>
                        <option value="Food & Drink">Food & Drink</option>
                        <option value="Technology">Technology</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Retail">Retail</option>
                    </select>
                </div>
                {fieldErrors.category && (
                  <div className={errorClass}>
                    <AlertCircle size={12} className="mr-1" />
                    {fieldErrors.category}
                  </div>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={inputWrapperClass}>
                <label className={labelClass}>Email Address *</label>
                <div className="relative">
                    <Mail className={iconClass} />
                    <input 
                      type="email" 
                      required 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className={inputClass('email')} 
                      placeholder="contact@business.com" 
                    />
                </div>
                {fieldErrors.email && (
                  <div className={errorClass}>
                    <AlertCircle size={12} className="mr-1" />
                    {fieldErrors.email}
                  </div>
                )}
            </div>
            <div className={inputWrapperClass}>
                <label className={labelClass}>Phone Number *</label>
                <div className="relative">
                    <Phone className={iconClass} />
                    <input 
                      type="tel" 
                      required 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className={inputClass('phone')} 
                      placeholder="+251 911 000 000" 
                    />
                </div>
                {fieldErrors.phone && (
                  <div className={errorClass}>
                    <AlertCircle size={12} className="mr-1" />
                    {fieldErrors.phone}
                  </div>
                )}
            </div>
        </div>

        <div className={inputWrapperClass}>
            <label className={labelClass}>Address *</label>
            <div className="relative">
                <MapPin className={iconClass} />
                <input 
                  required 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  className={inputClass('address')} 
                  placeholder="Street address, City" 
                />
            </div>
            {fieldErrors.address && (
              <div className={errorClass}>
                <AlertCircle size={12} className="mr-1" />
                {fieldErrors.address}
              </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={inputWrapperClass}>
                <label className={labelClass}>Website Link</label>
                <div className="relative">
                    <Globe className={iconClass} />
                    <input 
                      type="url" 
                      name="website" 
                      value={formData.website} 
                      onChange={handleChange} 
                      className={inputClass('website')} 
                      placeholder="https://example.com" 
                    />
                </div>
            </div>
            <div className={inputWrapperClass}>
                <label className={labelClass}>Map Pin (Coordinates)</label>
                <div className="relative">
                    <Map className={iconClass} />
                    <input 
                      name="mapPin" 
                      value={formData.mapPin} 
                      onChange={handleChange} 
                      className={inputClass('mapPin')} 
                      placeholder="Lat, Long" 
                    />
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
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-0 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-transparent file:text-indigo-600 dark:file:text-indigo-400 cursor-pointer"
                    />
                </div>
            </div>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Image Preview</p>
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Business preview" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            )}
        </div>

        <div className={inputWrapperClass}>
            <label className={labelClass}>Description *</label>
            <div className="relative">
                <AlignLeft className={iconTextAreaClass} />
                <textarea 
                  required 
                  name="description" 
                  rows={4} 
                  value={formData.description} 
                  onChange={handleChange} 
                  className={textAreaClass('description')} 
                  placeholder="Describe the business services and offerings..."
                ></textarea>
            </div>
            {fieldErrors.description && (
              <div className={errorClass}>
                <AlertCircle size={12} className="mr-1" />
                {fieldErrors.description}
              </div>
            )}
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all flex items-center disabled:opacity-70 disabled:cursor-not-allowed">
                <UploadCloud size={18} className="mr-2" /> Submit Listing
            </button>
        </div>
      </form>
    </div>
  );
};

export default B2BForm;