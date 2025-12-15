import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, AlignLeft, Image as ImageIcon, UploadCloud, Map, Type, Tag, CheckCircle, XCircle, AlertCircle, X, Loader, Sparkles, Check } from 'lucide-react';

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
    images: [] as File[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // New states for categories
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // New states for loading animation
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingSteps = [
    "Validating business information",
    "Uploading images to cloud",
    "Processing business details",
    "Finalizing your listing"
  ];

  // New state for success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch('http://localhost:5000/api/b2b/businesses-catagories');
        const result = await response.json();

        if (result.success) {
          const categoryNames = result.data.map((item: any) => item.name);
          setCategories(categoryNames);
        } else {
          setCategoriesError('Failed to load categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoriesError('Error loading categories');
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Simulate loading progress when submitting
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let stepTimeout: NodeJS.Timeout;

    if (isSubmitting) {
      setLoadingProgress(0);
      setLoadingStep(0);

      progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      stepTimeout = setTimeout(() => {
        const stepInterval = setInterval(() => {
          setLoadingStep(prev => {
            if (prev >= loadingSteps.length - 1) {
              clearInterval(stepInterval);
              return prev;
            }
            return prev + 1;
          });
        }, 800);

        return () => clearInterval(stepInterval);
      }, 500);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (stepTimeout) clearTimeout(stepTimeout);
    };
  }, [isSubmitting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));

      const newPreviews: string[] = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });

      if (fieldErrors.images) {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.images;
          return newErrors;
        });
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
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

    if (formData.images.length < 2) {
      errors.images = 'Please select at least 2 images';
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
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('category', formData.category);
      dataToSend.append('email', formData.email);
      dataToSend.append('phone', formData.phone);
      dataToSend.append('address', formData.address);
      dataToSend.append('mapPin', formData.mapPin);
      dataToSend.append('website', formData.website);
      dataToSend.append('description', formData.description);

      formData.images.forEach((image, index) => {
        dataToSend.append(`image_${index}`, image);
      });

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
          images: []
        });
        setImagePreviews([]);

        // Show success popup
        setShowSuccessPopup(true);

        // Call parent onSubmit with the result
        onSubmit(result);
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || result.error || 'Failed to submit business listing');

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

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setSubmitStatus('idle');
  };

  const inputWrapperClass = "relative group";
  const inputClass = (fieldName: string) => `w-full pl-10 pr-4 py-3 border ${fieldErrors[fieldName]
    ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-blue-500/30 dark:border-blue-500/40 focus:ring-blue-500 focus:border-blue-500'
    } rounded-xl focus:ring-2 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400`;

  const textAreaClass = (fieldName: string) => `w-full pl-10 pr-4 py-3 border ${fieldErrors[fieldName]
    ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-blue-500/30 dark:border-blue-500/40 focus:ring-blue-500 focus:border-blue-500'
    } rounded-xl focus:ring-2 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 resize-none`;

  const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";
  const iconTextAreaClass = "absolute left-3 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";
  const errorClass = "text-xs text-red-500 dark:text-red-400 mt-1 flex items-center";

  return (
    <div className="relative p-6">
      {/* Enhanced Cool Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 bg-gradient-to-br from-slate-50/95 to-white/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-xl flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-500">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gradient-to-r from-blue-400/10 to-indigo-400/10 dark:from-blue-500/10 dark:to-indigo-500/10"
                style={{
                  width: `${Math.random() * 100 + 20}px`,
                  height: `${Math.random() * 100 + 20}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float${i % 3 + 1} ${Math.random() * 10 + 10}s infinite ease-in-out`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center shadow-lg">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_20px_rgba(37,99,235,0.6)]"></div>
                  <Building2 className="absolute inset-0 m-auto text-blue-600 dark:text-blue-400 animate-pulse" size={28} />
                </div>
              </div>

              <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-ping" size={20} />
              <Sparkles className="absolute -bottom-2 -left-2 text-indigo-400 animate-ping" size={16} style={{ animationDelay: '0.5s' }} />
            </div>

            <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2 text-center">
              Submitting Your Business
            </h3>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-center mb-8">
              {loadingSteps[loadingStep]}
            </p>

            <div className="w-full mb-6">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span>Processing</span>
                <span>{loadingProgress}%</span>
              </div>
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-center space-x-2 mb-8">
              {loadingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index <= loadingStep
                    ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                    : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                />
              ))}
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
              Please wait while we process your business listing. This usually takes less than a minute.
            </p>
          </div>

          <style>{`
            @keyframes float1 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(10px, -15px) rotate(5deg); }
              50% { transform: translate(5px, -10px) rotate(-5deg); }
              75% { transform: translate(-5px, -20px) rotate(3deg); }
            }
            @keyframes float2 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(-15px, 10px) rotate(-3deg); }
              50% { transform: translate(-10px, 5px) rotate(5deg); }
              75% { transform: translate(15px, 5px) rotate(-5deg); }
            }
            @keyframes float3 {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(5px, 15px) rotate(3deg); }
              50% { transform: translate(-10px, 10px) rotate(-3deg); }
              75% { transform: translate(10px, -5px) rotate(5deg); }
            }
          `}</style>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-2xl"></div>

            {/* Success icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Check className="text-green-600 dark:text-green-400" size={40} />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center animate-ping">
                    <Check className="text-white" size={14} />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                Business Listed Successfully!
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Your business has been submitted and is now under review. You'll receive a confirmation email shortly.
              </p>
            </div>

            {/* Business details summary */}
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6">
              <div className="flex items-center mb-2">
                <Building2 className="text-blue-500 mr-2" size={16} />
                <span className="font-medium text-slate-800 dark:text-white">{formData.name || 'Business Name'}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                <Tag className="mr-2" size={14} />
                <span>{formData.category || 'Category'}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeSuccessPopup}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all"
              >
                Done
              </button>
              <button
                onClick={() => {
                  closeSuccessPopup();
                  onCancel();
                }}
                className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Add Another Business
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Message */}
      {submitStatus !== 'idle' && !showSuccessPopup && (
        <div className={`mb-6 p-4 rounded-xl flex items-center ${submitStatus === 'success'
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
                disabled={isLoadingCategories}
              >
                <option value="">Select Category</option>
                {isLoadingCategories ? (
                  <option disabled>Loading categories...</option>
                ) : categoriesError ? (
                  <option disabled>Error loading categories</option>
                ) : (
                  categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))
                )}
              </select>
            </div>
            {fieldErrors.category && (
              <div className={errorClass}>
                <AlertCircle size={12} className="mr-1" />
                {fieldErrors.category}
              </div>
            )}
            {categoriesError && (
              <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                {categoriesError}
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
          <label className={labelClass}>Business Images (at least 2) *</label>
          <div className="mt-1 flex items-center px-4 py-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
            <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4 group-hover:scale-110 transition-transform">
              <ImageIcon size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Select Images</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-0 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-transparent file:text-indigo-600 dark:file:text-indigo-400 cursor-pointer"
              />
            </div>
          </div>

          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Image Previews ({imagePreviews.length} selected)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden group">
                    <img
                      src={preview}
                      alt={`Business preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                      Image {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {fieldErrors.images && (
            <div className={errorClass}>
              <AlertCircle size={12} className="mr-1" />
              {fieldErrors.images}
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