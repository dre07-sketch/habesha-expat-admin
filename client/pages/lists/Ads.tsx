import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Megaphone, Calendar, ExternalLink, Eye, Trash2, PlayCircle, Monitor, Smartphone, Layout, EyeOff, Search } from 'lucide-react';
import Modal from '../../components/Modal';
import AdForm from '../../components/forms/AdForm';
import { Ad } from '../../types';

const Ads: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
    const [ads, setAds] = useState<Ad[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<{ [key: number]: boolean }>({});

    // Fetch ads from API
    useEffect(() => {
        const fetchAds = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5000/api/ads/ads-get');

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const data = await response.json();
                setAds(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching ads:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch ads');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAds();
    }, []);

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!window.confirm('Are you sure you want to delete this ad?')) {
            return;
        }

        try {
            setActionLoading(prev => ({ ...prev, [id]: true }));

            const response = await fetch(`http://localhost:5000/api/ads/ads/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            // Update local state
            setAds(ads.filter(a => a.id !== id));

            // Close modal if the deleted ad was selected
            if (selectedAd && selectedAd.id === id) {
                setSelectedAd(null);
            }
        } catch (err) {
            console.error('Error deleting ad:', err);
            alert(err instanceof Error ? err.message : 'Failed to delete ad');
        } finally {
            setActionLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleToggleStatus = async () => {
        if (!selectedAd) return;

        try {
            setActionLoading(prev => ({ ...prev, [selectedAd.id]: true }));

            const newStatus = selectedAd.status === 'active' ? 'inactive' : 'active';

            const response = await fetch(`http://localhost:5000/api/ads/ads/${selectedAd.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const updatedAd: Ad = { ...selectedAd, status: newStatus };

            // Update the modal view
            setSelectedAd(updatedAd);

            // Update the list view
            setAds(prevAds => prevAds.map(a => a.id === updatedAd.id ? updatedAd : a));
        } catch (err) {
            console.error('Error toggling ad status:', err);
            alert(err instanceof Error ? err.message : 'Failed to update ad status');
        } finally {
            setActionLoading(prev => ({ ...prev, [selectedAd.id]: false }));
        }
    };

    const handleFormSubmit = () => {
        // Refresh ads list after form submission
        const fetchAds = async () => {
            try {
                const response = await fetch('/api/ads-get');

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const data = await response.json();
                setAds(data);
            } catch (err) {
                console.error('Error fetching ads after form submission:', err);
            }
        };

        fetchAds();
        setIsFormOpen(false);
    };

    const filteredAds = ads.filter(ad =>
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.placement.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper function to get the full image URL
    const getImageUrl = (mediaFile: string | null | undefined) => {
        if (!mediaFile || mediaFile === 'banner.jpg') {
            return 'https://picsum.photos/400/200';
        }
        return mediaFile;
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Ad Campaigns</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage banners, promotions, and sponsorships.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search ads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                        />
                    </div>
                    <button onClick={() => setIsFormOpen(true)} className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap">
                        <Plus size={20} className="mr-2" /> Create Campaign
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
                    <p className="text-red-800 dark:text-red-200 font-medium">Error: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Cool List View */}
            {!isLoading && !error && (
                <div className="space-y-4">
                    {filteredAds.map((ad) => (
                        <div
                            key={ad.id}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-col md:flex-row gap-6 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden"
                            onClick={() => setSelectedAd(ad)}
                        >
                            {/* Status Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${ad.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>

                            {/* Media Preview */}
                            <div className="shrink-0 w-full md:w-48 h-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 relative border border-slate-200 dark:border-slate-700">
                                {ad.type === 'Video' ? (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <PlayCircle size={32} />
                                    </div>
                                ) : (
                                    <img src={getImageUrl(ad.mediaFile)} alt="Ad" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                )}
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center">
                                    {ad.type === 'Video' ? <PlayCircle size={10} className="mr-1" /> : <ImageIcon size={10} className="mr-1" />}
                                    {ad.type}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-center py-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{ad.title}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${ad.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'}`}>
                                        {ad.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center">
                                        <Layout size={14} className="mr-2 text-blue-500" /> {ad.placement}
                                    </div>
                                    <div className="flex items-center">
                                        <ExternalLink size={14} className="mr-2 text-slate-400" />
                                        <span className="truncate max-w-[150px]">{ad.url}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats & Action */}
                            <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-6 w-full md:w-40">
                                <div className="text-right hidden md:block">
                                    <div className="text-xs text-slate-400 uppercase font-bold flex items-center justify-end"><Calendar size={10} className="mr-1" /> Duration</div>
                                    <div className="text-lg font-bold text-slate-800 dark:text-white">{ad.durationDays} <span className="text-xs font-medium text-slate-500">Days</span></div>
                                </div>
                                <div className="flex justify-end mt-auto">
                                    <button
                                        onClick={(e) => handleDelete(ad.id, e)}
                                        disabled={actionLoading[ad.id]}
                                        className="p-2.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Delete Campaign"
                                    >
                                        {actionLoading[ad.id] ? (
                                            <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 border-t-red-600 rounded-full animate-spin"></div>
                                        ) : (
                                            <Trash2 size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredAds.length === 0 && (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                            No ad campaigns found.
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Create Campaign" maxWidth="max-w-3xl">
                <AdForm onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
            </Modal>

            {/* Immersive Details Modal */}
            <Modal isOpen={!!selectedAd} onClose={() => setSelectedAd(null)} title="Campaign Details" maxWidth="max-w-4xl">
                {selectedAd && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden flex flex-col">
                        {/* Preview Area */}
                        <div className="w-full bg-slate-100 dark:bg-black border-b border-slate-200 dark:border-slate-800 p-8 flex items-center justify-center min-h-[300px] relative group">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,#0000000d_25%,transparent_25%,transparent_75%,#0000000d_75%,#0000000d),linear-gradient(45deg,#0000000d_25%,transparent_25%,transparent_75%,#0000000d_75%,#0000000d)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] opacity-20 pointer-events-none"></div>

                            <div className="relative max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden ring-4 ring-white dark:ring-slate-700">
                                {selectedAd.type === 'Video' ? (
                                    <div className="w-[500px] aspect-video bg-black flex items-center justify-center">
                                        <PlayCircle size={48} className="text-white opacity-50" />
                                    </div>
                                ) : (
                                    <img src={getImageUrl(selectedAd.mediaFile)} alt="Ad Preview" className="max-w-full h-auto object-contain" />
                                )}
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide backdrop-blur-sm">
                                    Preview Mode
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 block">Campaign Name</span>
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{selectedAd.title}</h2>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide flex items-center ${selectedAd.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${selectedAd.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                    {selectedAd.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2 flex items-center"><Layout size={14} className="mr-1.5" /> Placement</div>
                                    <div className="font-bold text-slate-800 dark:text-white text-lg">{selectedAd.placement}</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2 flex items-center"><Calendar size={14} className="mr-1.5" /> Duration</div>
                                    <div className="font-bold text-slate-800 dark:text-white text-lg">{selectedAd.durationDays} Days</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-2 flex items-center"><ExternalLink size={14} className="mr-1.5" /> Target</div>
                                    <a href={selectedAd.url} target="_blank" rel="noreferrer" className="font-bold text-blue-600 dark:text-blue-400 text-sm hover:underline truncate block">{selectedAd.url}</a>
                                </div>
                            </div>

                            {/* Analytics Mockup */}
                            <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-4">Performance Overview</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-blue-50/50 dark:bg-slate-800/30 rounded-xl">
                                        <div className="text-2xl font-bold text-slate-800 dark:text-white">12.5k</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mt-1">Impressions</div>
                                    </div>
                                    <div className="text-center p-4 bg-emerald-50/50 dark:bg-slate-800/30 rounded-xl">
                                        <div className="text-2xl font-bold text-slate-800 dark:text-white">482</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mt-1">Clicks</div>
                                    </div>
                                    <div className="text-center p-4 bg-indigo-50/50 dark:bg-slate-800/30 rounded-xl">
                                        <div className="text-2xl font-bold text-slate-800 dark:text-white">3.8%</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mt-1">CTR</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action Bar */}
                        <div className="bg-slate-50 dark:bg-slate-800 p-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center sticky bottom-0 z-20">
                            <div className="flex items-center">
                                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium mr-3">Status:</span>
                                <span className={`flex items-center text-sm font-bold px-3 py-1 rounded-full ${selectedAd.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                                    {selectedAd.status === 'active' ? <Eye size={14} className="mr-1.5" /> : <EyeOff size={14} className="mr-1.5" />}
                                    {selectedAd.status}
                                </span>
                            </div>
                            <button
                                onClick={handleToggleStatus}
                                disabled={actionLoading[selectedAd.id]}
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${selectedAd.status === 'active' ? 'bg-slate-200 hover:bg-red-100 text-slate-700 hover:text-red-600 dark:bg-slate-700 dark:hover:bg-red-900/20 dark:text-slate-300 dark:hover:text-red-400 border border-transparent dark:border-slate-600 hover:border-red-200 dark:hover:border-red-800' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'}`}
                            >
                                {actionLoading[selectedAd.id] ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                        Updating...
                                    </>
                                ) : selectedAd.status === 'active' ? (
                                    <> <EyeOff size={16} className="mr-2" /> Take Down Ad </>
                                ) : (
                                    <> <Eye size={16} className="mr-2" /> Make Visible </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Ads;