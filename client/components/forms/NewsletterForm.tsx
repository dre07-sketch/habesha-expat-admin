import React, { useState, useRef } from 'react';
import { Mail, Type, Image as ImageIcon, Send, AlignLeft, Upload, X } from 'lucide-react';

interface NewsletterFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: '',
    content: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('content', formData.content);
      
      if (selectedFile) {
        formDataToSend.append('imageUrl', selectedFile);
      }

      // Send to backend
      const response = await fetch('http://localhost:5000/api/newsletters/send-newsletters', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send newsletter');
      }

      // Call onSubmit with the response data
      onSubmit(result);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputWrapperClass = "relative group";
  const inputClass = "w-full pl-10 pr-4 py-3 border border-blue-500/30 dark:border-blue-500/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400";
  const textAreaClass = "w-full pl-10 pr-4 py-3 border border-blue-500/30 dark:border-blue-500/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-all placeholder:text-slate-400 resize-none font-mono text-sm";
  const labelClass = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 ml-1";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";
  const iconTextAreaClass = "absolute left-3 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors h-4 w-4 pointer-events-none";

  return (
    <div className="relative">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          <div className="flex items-start">
            <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Error sending newsletter</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cool Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center rounded-xl animate-in fade-in duration-300">
            <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                <Send className="absolute inset-0 m-auto text-blue-600 animate-pulse" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">Sending Campaign...</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Queuing emails for delivery</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="pb-2 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                <Mail className="mr-2 text-blue-500" size={20} /> Campaign Details
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Compose your newsletter to reach all subscribers.</p>
        </div>

        <div className={inputWrapperClass}>
            <label className={labelClass}>Subject Line</label>
            <div className="relative">
                <Type className={iconClass} />
                <input 
                  required 
                  name="subject" 
                  onChange={handleChange} 
                  className={inputClass} 
                  placeholder="e.g. Weekly Digest: Top News" 
                  value={formData.subject}
                />
            </div>
        </div>

        <div>
            <label className={labelClass}>Featured Image</label>
            
            {previewUrl ? (
              <div className="mt-1 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="mt-1 flex items-center px-4 py-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-4 group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} />
                </div>
                <div className="flex-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Upload Banner</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-0 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-transparent file:text-indigo-600 dark:file:text-indigo-400 cursor-pointer"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                </div>
            </div>
            )}
            
            {selectedFile && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
        </div>

        <div className={inputWrapperClass}>
            <label className={labelClass}>Email Content (HTML Supported)</label>
            <div className="relative">
                <AlignLeft className={iconTextAreaClass} />
                <textarea 
                  name="content" 
                  rows={8} 
                  onChange={handleChange} 
                  className={textAreaClass} 
                  placeholder="Dear Subscriber..."
                  value={formData.content}
                ></textarea>
            </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end space-x-3">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 text-slate-700 dark:text-slate-300 font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Cancel
            </button>
            <button type="submit" className="px-8 py-2.5 text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all flex items-center">
                <Send size={18} className="mr-2" /> Send to All Subscribers
            </button>
        </div>
      </form>
    </div>
  );
};

export default NewsletterForm;