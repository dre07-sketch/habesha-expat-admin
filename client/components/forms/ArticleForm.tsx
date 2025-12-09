import React, { useState, useRef, useEffect } from 'react';
import { Type, Link as LinkIcon, Image as ImageIcon, AlignLeft, User, Calendar, Tag, FileText, UploadCloud, X } from 'lucide-react';

interface ArticleFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    publishDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData object to handle both file and text data
      const formDataToSend = new FormData();
      
      // Append all form fields with explicit type casting
      (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Append image if exists
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      // Send data to server
      const response = await fetch('http://localhost:5000/api/articles/articles-post', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to publish article');
      }

      const result = await response.json();
      onSubmit(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred while publishing the article');
    } finally {
      setIsSubmitting(false);
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
      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Cool Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-300">
            <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                <FileText className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">Publishing Article...</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Optimizing SEO and assets</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Content (Takes up 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    <FileText className="mr-2 text-blue-500" size={20} /> Article Content
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Write your story and details.</p>
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Article Title</label>
                <div className="relative">
                    <Type className={iconClass} />
                    <input required name="title" onChange={handleChange} className={inputClass} placeholder="Enter a compelling title" />
                </div>
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Excerpt (Summary)</label>
                <div className="relative">
                    <AlignLeft className={iconTextAreaClass} />
                    <textarea name="excerpt" rows={3} onChange={handleChange} className={textAreaClass} placeholder="Brief summary for search results..."></textarea>
                </div>
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Main Content</label>
                <div className="relative">
                    <AlignLeft className={iconTextAreaClass} />
                    <textarea name="content" rows={12} onChange={handleChange} className={`${textAreaClass} font-mono text-sm`} placeholder="Write your article here (Markdown supported)..."></textarea>
                </div>
            </div>
        </div>

        {/* Right Column: Meta & Assets */}
        <div className="space-y-6">
            <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    <Tag className="mr-2 text-indigo-500" size={20} /> Metadata & Media
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">SEO settings and cover image.</p>
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>URL Slug</label>
                <div className="relative">
                    <LinkIcon className={iconClass} />
                    <input required name="slug" onChange={handleChange} className={inputClass} placeholder="article-url-slug" />
                </div>
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Category</label>
                <div className="relative">
                    <Tag className={iconClass} />
                    <select name="category" onChange={handleChange} className={`${inputClass} appearance-none`}>
                        <option value="">Select Category</option>
                        <option value="Business">Business</option>
                        <option value="Culture">Culture</option>
                        <option value="Tech">Technology</option>
                        <option value="News">News</option>
                    </select>
                </div>
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Author</label>
                <div className="relative">
                    <User className={iconClass} />
                    <input name="author" onChange={handleChange} className={inputClass} placeholder="Author Name" />
                </div>
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Publish Date</label>
                <div className="relative">
                    <Calendar className={iconClass} />
                    <input type="datetime-local" name="publishDate" onChange={handleChange} className={inputClass} />
                </div>
            </div>

             {/* Image Upload */}
             <div>
                <label className={labelClass}>Featured Image</label>
                <div className="mt-1 flex items-center px-4 py-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                    <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4 group-hover:scale-110 transition-transform">
                        <ImageIcon size={24} />
                    </div>
                    <div className="flex-1">
                         <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Upload Cover</p>
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-0 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-transparent file:text-indigo-600 dark:file:text-indigo-400 cursor-pointer"
                        />
                    </div>
                </div>
                
                {/* Image Preview */}
                {previewUrl && (
                    <div className="mt-4 relative">
                        <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="max-w-full h-auto rounded-lg border border-slate-200 dark:border-slate-700"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="lg:col-span-3 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
            </button>
            <button type="submit" className="px-8 py-2.5 text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all flex items-center">
                <UploadCloud size={18} className="mr-2" /> Publish Article
            </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;