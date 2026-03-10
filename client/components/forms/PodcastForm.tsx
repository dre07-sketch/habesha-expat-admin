import React, { useState, useEffect } from 'react';
import { UploadCloud, Mic, FileAudio, Image as ImageIcon, Type, Link as LinkIcon, Tag, X, Music, User, Globe, Hash } from 'lucide-react';

interface PodcastFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const PodcastForm: React.FC<PodcastFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    host: '',
    slug: '',
    category: '',
    audioUrl: '',
    description: '',
    tags: [] as string[],
    duration: '00:00'
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/categories/categories/type/Podcast', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);

    if (value.endsWith(' ')) {
      const words = value.trim().split(' ');
      const lastWord = words[words.length - 1];

      if (lastWord && !lastWord.startsWith('#')) {
        const newTag = `#${lastWord}`;
        if (!formData.tags.includes(newTag)) {
          setFormData({
            ...formData,
            tags: [...formData.tags, newTag]
          });
        }
        setTagInput('');
      }
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const words = tagInput.trim().split(/[\s,]+/);
      const lastWord = words[words.length - 1];

      if (lastWord) {
        const newTag = lastWord.startsWith('#') ? lastWord : `#${lastWord}`;
        if (!formData.tags.includes(newTag)) {
          setFormData({
            ...formData,
            tags: [...formData.tags, newTag]
          });
        }
        setTagInput('');
      }
    } else if (e.key === 'Backspace' && tagInput === '' && formData.tags.length > 0) {
      const newTags = [...formData.tags];
      newTags.pop();
      setFormData({
        ...formData,
        tags: newTags
      });
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    setFormData({
      ...formData,
      tags: newTags
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const data = new FormData();
      data.append('title', formData.title);
      data.append('host', formData.host);
      data.append('slug', formData.slug);
      data.append('category', formData.category);
      data.append('audioUrl', formData.audioUrl);
      data.append('description', formData.description);
      data.append('duration', formData.duration);
      data.append('tags', JSON.stringify(formData.tags));
      if (coverImage) {
        data.append('image', coverImage);
      }

      const response = await fetch('/api/podcasts/podcasts-post', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        const result = await response.json();
        onSubmit(result.data);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to create podcast'}`);
      }
    } catch (error) {
      console.error('Error submitting podcast:', error);
      alert('An error occurred while submitting the podcast.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputWrapperClass = "relative group";
  const inputClass = "w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600";
  const labelClass = "block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1";
  const iconClass = "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors h-4 w-4 pointer-events-none";

  return (
    <div className="relative p-6">
      {isSubmitting && (
        <div className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl animate-in fade-in duration-300">
          <div className="w-10 h-10 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Publishing Session</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Core Content */}
        <div className="space-y-4">
          <div className={inputWrapperClass}>
            <label className={labelClass}>Session Title</label>
            <div className="relative">
              <Type className={iconClass} />
              <input required name="title" onChange={handleChange} className={inputClass} placeholder="Enter episode name..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={inputWrapperClass}>
              <label className={labelClass}>Host / Speaker</label>
              <div className="relative">
                <User className={iconClass} />
                <input required name="host" onChange={handleChange} className={inputClass} placeholder="Who is speaking?" />
              </div>
            </div>
            <div className={inputWrapperClass}>
              <label className={labelClass}>Primary Category</label>
              <div className="relative">
                <Tag className={iconClass} />
                <select
                  required
                  name="category"
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                  disabled={isLoadingCategories}
                >
                  <option value="">{isLoadingCategories ? 'Loading...' : 'Select Category'}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={inputWrapperClass}>
            <label className={labelClass}>URL Identifier (Slug)</label>
            <div className="relative">
              <Globe className={iconClass} />
              <input required name="slug" onChange={handleChange} className={inputClass} placeholder="e.g. the-future-of-migration" />
            </div>
          </div>

          <div className={inputWrapperClass}>
            <label className={labelClass}>Description</label>
            <div className="relative">
              <textarea 
                name="description" 
                onChange={handleChange} 
                className={`${inputClass} min-h-[100px] py-4 pl-4`} 
                placeholder="Enter episode description..."
              />
            </div>
          </div>

          <div className={inputWrapperClass}>
            <label className={labelClass}>Metadata Tags</label>
            <div className="relative">
              <Hash className={iconClass} />
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                className={inputClass}
                placeholder="Press space or enter to add tags"
              />
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-xs font-bold">
                    <span>{tag}</span>
                    <button type="button" onClick={() => removeTag(index)} className="ml-2 text-slate-400 hover:text-rose-500 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section: Media Assets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className={labelClass}>Art Cover</label>
            <div className={`relative group cursor-pointer border-2 border-dashed ${imagePreview ? 'border-indigo-500' : 'border-slate-200 dark:border-slate-800'} rounded-2xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all overflow-hidden`}>
              <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" />
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <ImageIcon className="mx-auto h-8 w-8 text-slate-400 mb-2 group-hover:text-indigo-500" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Square Image</p>
                </>
              )}
            </div>
          </div>

          <div className={inputWrapperClass}>
            <label className={labelClass}>Audio File Link (URL)</label>
            <div className="relative">
              <LinkIcon className={iconClass} />
              <input
                required
                name="audioUrl"
                value={formData.audioUrl}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://youtu.be/... or Spotify link"
              />
            </div>
            <p className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">YouTube, Spotify, or direct .mp3 URL</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all"
          >
            Launch Episode
          </button>
        </div>
      </form>
    </div>
  );
};

export default PodcastForm;