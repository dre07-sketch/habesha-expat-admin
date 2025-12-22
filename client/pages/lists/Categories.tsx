import React, { useState, useEffect } from 'react';
import { Plus, Tag, Layers, Trash2, Hash, FileText, Mic, Video, Briefcase, ChevronRight, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import Modal from '../../components/Modal';
import CategoryForm from '../../components/forms/CategoryForm';
import { Category } from '../../types';

// Define a type for category usage
interface CategoryUsage {
  name: string;
  count: number;
  source: 'articles' | 'podcasts' | 'videos' | 'businesses';
}

const Categories: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryUsage, setCategoryUsage] = useState<CategoryUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState<number | null>(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch categories
      // Fetch categories
      const token = localStorage.getItem('authToken');
      const categoriesResponse = await fetch('http://localhost:5000/api/categories/categories-get', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories');
      }

      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);

      // Fetch category usage
      // Fetch category usage
      const usageResponse = await fetch('http://localhost:5000/api/categories/categories/usage', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!usageResponse.ok) {
        throw new Error('Failed to fetch category usage');
      }

      const usageData = await usageResponse.json();
      setCategoryUsage(usageData.usedCategories || []);

    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching categories');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle category deletion
  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this category? Content tagged with it may be affected.')) {
      try {
        setDeleteInProgress(id);
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5000/api/categories/categories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete category');
        }

        // Update local state to remove the deleted category
        setCategories(categories.filter(c => c.id !== id));
      } catch (err: any) {
        setError(err.message || 'An error occurred while deleting the category');
        console.error('Error deleting category:', err);
      } finally {
        setDeleteInProgress(null);
      }
    }
  };

  // Get total count for a specific category
  const getCategoryTotalCount = (categoryName: string) => {
    return categoryUsage
      .filter(item => item.name === categoryName)
      .reduce((total, item) => total + item.count, 0);
  };

  // Get count for a specific type within a category
  const getCategoryTypeCount = (categoryName: string, type: string) => {
    const usageItem = categoryUsage.find(item =>
      item.name === categoryName && item.source === type
    );
    return usageItem ? usageItem.count : 0;
  };

  // Helper to get icon and color based on type
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'Article': return { icon: FileText, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' };
      case 'Podcast': return { icon: Mic, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' };
      case 'Video': return { icon: Video, color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800' };
      case 'Business': return { icon: Briefcase, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' };
      default: return { icon: Layers, color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' };
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Content Categories</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organize your platform's taxonomy and tags.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus size={20} className="mr-2" /> Add Category
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-xl mb-6 flex items-center">
          <AlertCircle size={20} className="mr-3" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Cool List View */}
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/20 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <div className="w-5/12 pl-4">Category Name</div>
          <div className="w-3/12">Content Type</div>
          <div className="w-2/12">Usage</div>
          <div className="w-2/12 text-right pr-4 flex items-center justify-end">
            {isLoading ? (
              <RefreshCw size={16} className="animate-spin text-slate-400" />
            ) : (
              <>
                Actions
                <button
                  onClick={fetchCategories}
                  className="ml-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Refresh categories"
                >
                  <RefreshCw size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw size={24} className="animate-spin text-slate-400" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Tag size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <p>No categories found. Create your first category to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {categories.map((cat) => {
              const style = getTypeConfig(cat.type);
              const Icon = style.icon;
              const totalCount = getCategoryTotalCount(cat.name);

              return (
                <div
                  key={cat.id}
                  className="group flex items-center p-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {/* Name & Icon */}
                  <div className="w-5/12 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${style.color} shadow-sm`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.name}</h3>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                        <Hash size={10} className="mr-0.5" /> {cat.name.toLowerCase().replace(/\s+/g, '-')}
                      </div>
                    </div>
                  </div>

                  {/* Content Type */}
                  <div className="w-3/12">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${style.color.replace('bg-', 'border-').replace('text-', 'border-').split(' ')[0]} bg-opacity-10`}>
                      {cat.type}
                    </span>
                  </div>

                  {/* Usage Stats */}
                  <div className="w-2/12">
                    <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                      <Layers size={16} className="mr-2 text-slate-400" /> {totalCount} Items
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="w-2/12 flex justify-end items-center pr-2 space-x-2">
                    <button
                      onClick={(e) => handleDelete(cat.id, e)}
                      disabled={deleteInProgress === cat.id}
                      className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete Category"
                    >
                      {deleteInProgress === cat.id ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                    <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="New Category" maxWidth="max-w-2xl">
        <CategoryForm
          onSuccess={() => {
            setIsFormOpen(false);
            fetchCategories(); // Refresh categories after adding a new one
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Immersive Details Modal */}
      <Modal isOpen={!!selectedCategory} onClose={() => setSelectedCategory(null)} title="Category Insight" maxWidth="max-w-3xl">
        {selectedCategory && (
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
            {/* Header Gradient */}
            <div className={`h-40 w-full bg-gradient-to-r relative overflow-hidden flex items-center px-8 ${selectedCategory.type === 'Article' ? 'from-indigo-600 to-blue-600' :
                selectedCategory.type === 'Video' ? 'from-sky-600 to-cyan-600' :
                  selectedCategory.type === 'Podcast' ? 'from-rose-600 to-pink-600' :
                    'from-emerald-600 to-green-600'
              }`}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white/10 to-transparent"></div>

              <div className="relative z-10 flex items-center w-full">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl text-white shadow-xl border border-white/20 mr-6">
                  {React.createElement(getTypeConfig(selectedCategory.type).icon, { size: 40 })}
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-white/80 text-xs font-bold uppercase tracking-widest border border-white/30 px-2 py-0.5 rounded-full">{selectedCategory.type}</span>
                    <span className="text-white/60 text-xs flex items-center"><Hash size={12} className="mr-0.5" /> ID: {selectedCategory.id}</span>
                  </div>
                  <h2 className="text-4xl font-bold text-white shadow-black drop-shadow-md">{selectedCategory.name}</h2>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
                  <Layers className="text-blue-500 mb-2" size={24} />
                  <span className="text-2xl font-bold text-slate-800 dark:text-white">{getCategoryTotalCount(selectedCategory.name)}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Total Items</span>
                </div>

                {selectedCategory.type === 'Article' && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
                    <FileText className="text-indigo-500 mb-2" size={24} />
                    <span className="text-2xl font-bold text-slate-800 dark:text-white">{getCategoryTypeCount(selectedCategory.name, 'articles')}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Articles</span>
                  </div>
                )}

                {selectedCategory.type === 'Podcast' && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
                    <Mic className="text-rose-500 mb-2" size={24} />
                    <span className="text-2xl font-bold text-slate-800 dark:text-white">{getCategoryTypeCount(selectedCategory.name, 'podcasts')}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Podcasts</span>
                  </div>
                )}

                {selectedCategory.type === 'Video' && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
                    <Video className="text-sky-500 mb-2" size={24} />
                    <span className="text-2xl font-bold text-slate-800 dark:text-white">{getCategoryTypeCount(selectedCategory.name, 'videos')}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Videos</span>
                  </div>
                )}

                {selectedCategory.type === 'Business' && (
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
                    <Briefcase className="text-emerald-500 mb-2" size={24} />
                    <span className="text-2xl font-bold text-slate-800 dark:text-white">{getCategoryTypeCount(selectedCategory.name, 'businesses')}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Businesses</span>
                  </div>
                )}

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center text-center">
                  <BarChart3 className="text-emerald-500 mb-2" size={24} />
                  <span className="text-2xl font-bold text-slate-800 dark:text-white">12.5k</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Monthly Views</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Categories;