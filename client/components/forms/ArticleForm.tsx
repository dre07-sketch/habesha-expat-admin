import React, { useState, useRef, useEffect } from 'react';
import { Type, Link as LinkIcon, Image as ImageIcon, Video, AlignLeft, User, Calendar, Tag, FileText, UploadCloud, X } from 'lucide-react';

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
  author_name: string;
  publish_date: string;
  status: string;
  tags: string[];
  url?: string;
  video_url?: string;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    author_name: '',
    publish_date: '',
    status: 'draft',
    tags: [],
    url: '',
    video_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoOption, setVideoOption] = useState<'file' | 'url'>('file');
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(['Business', 'Culture', 'Tech', 'News']);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [currentTag, setCurrentTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories from server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/articles/articles-catagories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setCategories(data.data.map((cat: any) => cat.name));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle file selection and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle video file selection and preview
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviewUrl(reader.result as string);
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

  // Remove selected video
  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreviewUrl(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
    // Also clear video URL if it exists
    setFormData(prev => ({ ...prev, video_url: '' }));
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [previewUrl, videoPreviewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle tag input with automatic # prefix
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Automatically add # at the beginning if not present
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }
    
    setCurrentTag(value);
  };

  // Add tag when Enter or comma is pressed
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && currentTag === '#' && formData.tags.length > 0) {
      // Remove last tag if input is just # and backspace is pressed
      const newTags = [...formData.tags];
      newTags.pop();
      setFormData(prev => ({ ...prev, tags: newTags }));
    }
  };

  // Add tag to the list
  const addTag = () => {
    if (currentTag.trim() !== '' && currentTag !== '#') {
      // Ensure tag starts with #
      let tagToAdd = currentTag.trim();
      if (!tagToAdd.startsWith('#')) {
        tagToAdd = '#' + tagToAdd;
      }
      
      const newTags = [...formData.tags, tagToAdd];
      setFormData(prev => ({ ...prev, tags: newTags }));
      setCurrentTag('#'); // Reset to # for next tag
    }
  };

  // Remove a specific tag
  const removeTag = (index: number) => {
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  // Handle video option change
  const handleVideoOptionChange = (option: 'file' | 'url') => {
    setVideoOption(option);
    // Clear existing video data when switching options
    if (option === 'file') {
      setFormData(prev => ({ ...prev, video_url: '' }));
    } else {
      setVideoFile(null);
      setVideoPreviewUrl(null);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Append all form fields with explicit type casting
      (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
        if (key === 'tags') {
          // Convert tags array to comma-separated string
          formDataToSend.append('tags', formData[key].join(','));
        } else {
          formDataToSend.append(key, formData[key] || '');
        }
      });

      // Append image if exists
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      // Append video if exists (either file or URL)
      if (videoOption === 'file' && videoFile) {
        formDataToSend.append('video', videoFile);
      } else if (videoOption === 'url' && formData.video_url) {
        formDataToSend.append('video_url', formData.video_url);
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

          {/* Article URL Field */}
          <div className={inputWrapperClass}>
            <label className={labelClass}>Article URL</label>
            <div className="relative">
              <LinkIcon className={iconClass} />
              <input
                name="url"
                value={formData.url || ''}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://example.com/article"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              External URL for this article (optional)
            </p>
          </div>

          <div className={inputWrapperClass}>
            <label className={labelClass}>Category</label>
            <div className="relative">
              <Tag className={iconClass} />
              <select
                name="category"
                onChange={handleChange}
                className={`${inputClass} appearance-none ${isLoadingCategories ? 'opacity-70' : ''}`}
                disabled={isLoadingCategories}
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              {isLoadingCategories && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          {/* Tags Input with automatic # */}
          <div className={inputWrapperClass}>
            <label className={labelClass}>Tags</label>
            <div className="relative">
              <Tag className={iconClass} />
              <input
                type="text"
                value={currentTag}
                onChange={handleTagChange}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                className={inputClass}
                placeholder="Add tags (press Enter or comma to add)"
              />
            </div>
            {/* Display tags as chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={inputWrapperClass}>
            <label className={labelClass}>Author</label>
            <div className="relative">
              <User className={iconClass} />
              <input 
                name="author_name"
                onChange={handleChange} 
                className={inputClass} 
                placeholder="Author Name" 
              />
            </div>
          </div>

          <div className={inputWrapperClass}>
            <label className={labelClass}>Publish Date</label>
            <div className="relative">
              <Calendar className={iconClass} />
              <input 
                type="datetime-local" 
                name="publish_date"
                onChange={handleChange} 
                className={inputClass} 
              />
            </div>
          </div>

          {/* Video Section with Upload or URL Options */}
          <div>
            <label className={labelClass}>Featured Video</label>
            <div className="flex space-x-2 mb-3">
              <button
                type="button"
                onClick={() => handleVideoOptionChange('file')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center ${
                  videoOption === 'file'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <UploadCloud size={14} className="mr-1" /> Upload Video
              </button>
              <button
                type="button"
                onClick={() => handleVideoOptionChange('url')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center ${
                  videoOption === 'url'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <LinkIcon size={14} className="mr-1" /> Video URL
              </button>
            </div>

            {videoOption === 'file' ? (
              <div>
                <div className="mt-1 flex items-center px-4 py-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                  <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4 group-hover:scale-110 transition-transform">
                    <Video size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Upload Video</p>
                    <input
                      type="file"
                      accept="video/*"
                      ref={videoInputRef}
                      onChange={handleVideoFileChange}
                      className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-0 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-transparent file:text-indigo-600 dark:file:text-indigo-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Video Preview */}
                {videoPreviewUrl && (
                  <div className="mt-4 relative">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="max-w-full h-auto rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={inputWrapperClass}>
                <div className="relative">
                  <Video className={iconClass} />
                  <input
                    name="video_url"
                    value={formData.video_url || ''}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Enter a YouTube, Vimeo, or other video URL
                </p>
              </div>
            )}
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