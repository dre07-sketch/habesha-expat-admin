import React, { useState, useEffect } from 'react';
import { Plus, Eye, CheckCircle, XCircle, MapPin, Globe, Phone, Mail, Calendar, ExternalLink, Map, Hash, Clock, ShieldCheck, Star, MessageSquare, ThumbsUp, Filter, Search, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Modal from '../../components/Modal';
import B2BForm from '../../components/forms/B2BForm';
import { Business } from '../../types';
import axios from 'axios';

const B2B: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  // New states for image gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // New states for ratings and comments
  const [businessDetails, setBusinessDetails] = useState<{
    business: Business;
    averageRating: number;
    totalReviews: number;
    comments: Array<{
      id: number;
      rating: number;
      comment: string;
      created_at: string;
      user_id: number;
      user_name: string;
      user_avatar: string;
    }>;
  } | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api/b2b';

  // Fetch businesses from API
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/businesses-get`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Transform the response to rename 'mappin' to 'mapPin'
        const transformedData = response.data.map((biz: any) => ({
          ...biz,
          mapPin: biz.mappin || biz.mapPin // Handle case sensitivity
        }));

        setBusinesses(transformedData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch businesses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Fetch business details including ratings and comments
  useEffect(() => {
    let isMounted = true;

    if (selectedBusiness) {
      const fetchBusinessDetails = async () => {
        setDetailsLoading(true);
        setDetailsError(null);
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.get(`${API_BASE_URL}/business-rating-comment/${selectedBusiness.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (isMounted) {
            if (response.data.success) {
              const avgRating = response.data.averageRating ? parseFloat(response.data.averageRating) : 0;
              const totalReviews = response.data.totalReviews ? parseInt(response.data.totalReviews) : 0;

              setBusinessDetails({
                business: response.data.business,
                averageRating: isNaN(avgRating) ? 0 : avgRating,
                totalReviews: isNaN(totalReviews) ? 0 : totalReviews,
                comments: response.data.comments || []
              });
            } else {
              setDetailsError(response.data.message || 'Failed to fetch business details');
            }
          }
        } catch (err) {
          if (isMounted) {
            console.error('Failed to fetch business details:', err);
            setDetailsError('Failed to fetch business details');
          }
        } finally {
          if (isMounted) {
            setDetailsLoading(false);
          }
        }
      };

      fetchBusinessDetails();
    }

    return () => {
      isMounted = false;
    };
  }, [selectedBusiness]);

  // Update business status
  const updateBusinessStatus = async (id: number, status: 'approved' | 'rejected' | 'pending') => {
    setUpdatingStatus(id);
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_BASE_URL}/businesses/${id}/status`, { status }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setBusinesses(prev =>
        prev.map(biz =>
          biz.id === id ? { ...biz, status } : biz
        )
      );

      if (selectedBusiness?.id === id) {
        setSelectedBusiness(null);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update business status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    try {
      // Note: B2BForm handles the actual POST request with FormData
      // We only need to refresh the list here
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/businesses-get`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const transformedData = response.data.map((biz: any) => ({
        ...biz,
        mapPin: biz.mappin || biz.mapPin
      }));

      setBusinesses(transformedData);
      // setIsFormOpen(false); // Removed to allow B2BForm to show success popup
    } catch (err) {
      console.error('Failed to refresh businesses:', err);
    }
  };

  // Format website URL
  const formatWebsiteUrl = (url: string) => {
    if (!url || url.trim() === '') return '#';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  // Parse map_pin data
  const parseMapPinData = (mapPin: string) => {
    if (!mapPin || mapPin.trim() === '') return null;

    if (mapPin.startsWith('https://www.google.com/maps')) {
      return { url: mapPin, isUrl: true };
    }

    const coordinatesRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const coordinatesMatch = mapPin.match(coordinatesRegex);

    if (coordinatesMatch) {
      return { lat: parseFloat(coordinatesMatch[1]), lng: parseFloat(coordinatesMatch[2]), isUrl: false };
    }

    const simpleCoordsRegex = /^(-?\d+\.\d+),(-?\d+\.\d+)$/;
    const simpleCoordsMatch = mapPin.match(simpleCoordsRegex);

    if (simpleCoordsMatch) {
      return { lat: parseFloat(simpleCoordsMatch[1]), lng: parseFloat(simpleCoordsMatch[2]), isUrl: false };
    }

    return { place: mapPin, isUrl: false };
  };

  // Get Google Maps URL
  const getGoogleMapsUrl = (mapPin: string) => {
    const parsedData = parseMapPinData(mapPin);
    if (!parsedData) return '#';
    if (parsedData.isUrl) return parsedData.url;
    if (parsedData.lat !== undefined && parsedData.lng !== undefined) {
      return `https://www.google.com/maps/search/?api=1&query=${parsedData.lat},${parsedData.lng}`;
    }
    if (parsedData.place) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parsedData.place)}`;
    }
    return '#';
  };

  // Open website
  const openWebsite = (url: string) => {
    const formattedUrl = formatWebsiteUrl(url);
    if (formattedUrl !== '#') {
      window.open(formattedUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Open Google Maps
  const openGoogleMaps = (mapPin: string) => {
    const parsedData = parseMapPinData(mapPin);
    if (!parsedData) return;

    let mapsUrl;
    if (parsedData.isUrl) {
      mapsUrl = parsedData.url;
    } else if (parsedData.lat !== undefined && parsedData.lng !== undefined) {
      mapsUrl = `https://www.google.com/maps/place/${parsedData.lat},${parsedData.lng}/@${parsedData.lat},${parsedData.lng},14z`;
    } else if (parsedData.place) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parsedData.place)}`;
    }

    if (mapsUrl && mapsUrl !== '#') {
      window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedBusiness(null);
    setBusinessDetails(null);
    setDetailsLoading(false);
    setDetailsError(null);
  };

  // Filter businesses
  const filteredBusinesses = businesses.filter(biz =>
    biz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    biz.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    biz.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate rating distribution
  const calculateRatingDistribution = () => {
    if (!businessDetails || businessDetails.comments.length === 0) {
      return [0, 0, 0, 0, 0];
    }

    const ratingCounts = [0, 0, 0, 0, 0];
    businessDetails.comments.forEach(comment => {
      const rating = Math.floor(comment.rating);
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating - 1]++;
      }
    });

    const reversedRatingCounts = [...ratingCounts].reverse();
    const total = businessDetails.totalReviews || 1;
    return reversedRatingCounts.map(count => Math.round((count / total) * 100));
  };

  // Open image gallery
  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  // Navigate to next image in gallery
  const nextImage = () => {
    if (selectedBusiness && selectedBusiness.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === selectedBusiness.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // Navigate to previous image in gallery
  const prevImage = () => {
    if (selectedBusiness && selectedBusiness.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? selectedBusiness.images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }

        @keyframes ping-slow {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">B2B Requests</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and approve business listings for the directory.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
          >
            <Plus size={20} className="mr-2" /> Add Business
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400">Loading businesses...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-8 text-center">
          <div className="text-red-500 text-lg font-medium mb-2">Error Loading Data</div>
          <p className="text-slate-500 dark:text-slate-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Business Table */}
      {!loading && !error && (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/60">
              <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Business Info</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800/0 divide-y divide-slate-200 dark:divide-slate-700/60">
                {filteredBusinesses.map((biz) => (
                  <tr key={biz.id} className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors duration-200">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="h-12 w-12 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 group-hover:border-blue-500/50 transition-colors">
                            <img className="h-full w-full object-cover" src={biz.image || '/placeholder-business.jpg'} alt={biz.name} />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white dark:border-slate-800 rounded-full ${biz.status === 'approved' ? 'bg-emerald-500' : biz.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{biz.name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-0.5">
                            <Mail size={12} className="mr-1" /> {biz.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        {biz.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {updatingStatus === biz.id ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                          <span className="text-xs text-slate-500">Updating...</span>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold uppercase tracking-wide rounded-full ${biz.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : biz.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                          }`}>
                          {biz.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedBusiness(biz)}
                        className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBusinesses.length === 0 && (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No businesses found matching your search.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Form Popup */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add New Business">
        <B2BForm onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      {/* Details Popup */}
      <Modal isOpen={!!selectedBusiness} onClose={closeModal} title="Business Profile" maxWidth="max-w-5xl">
        {selectedBusiness && (
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden flex flex-col">
            {/* Hero Section */}
            <div className="relative h-64 w-full group shrink-0">
              <img
                src={selectedBusiness.image || '/placeholder-business.jpg'}
                alt={selectedBusiness.name}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => selectedBusiness.images && selectedBusiness.images.length > 0 && openGallery(0)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>

              {/* Image indicator */}
              {selectedBusiness.images && selectedBusiness.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center shadow-lg border border-white/10 backdrop-blur-sm">
                  <span className="font-medium">{selectedBusiness.images.length} Photos</span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 w-full p-8">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wide shadow-lg">{selectedBusiness.category}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide shadow-lg text-white ${selectedBusiness.status === 'approved' ? 'bg-emerald-600' : 'bg-amber-600'}`}>
                        {selectedBusiness.status}
                      </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-1 tracking-tight shadow-black drop-shadow-md">{selectedBusiness.name}</h2>
                    <div className="flex items-center text-slate-300 text-sm font-medium">
                      <Calendar size={14} className="mr-1.5" /> Added on Oct 24, 2025
                    </div>
                  </div>
                  {businessDetails && (
                    <div className="hidden sm:flex bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex-col items-center">
                      <div className="flex items-center space-x-1">
                        <Star className="text-yellow-400 fill-yellow-400" size={24} />
                        <span className="text-3xl font-bold text-white">
                          {Number(businessDetails.averageRating || 0).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-white/80 font-medium">Overall Rating</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Gallery Preview */}
            {selectedBusiness.images && selectedBusiness.images.length > 1 && (
              <div className="bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                  Gallery Preview
                </h3>
                <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
                  {selectedBusiness.images.map((img, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all shadow-sm"
                      onClick={() => openGallery(index)}
                    >
                      <img
                        src={img}
                        alt={`${selectedBusiness.name} image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Content */}
            <div className="p-8 bg-slate-50 dark:bg-[#0B1121] space-y-8 flex-1 overflow-y-auto">
              {/* Top Section: Contact Info & Map */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Contact & Metadata */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Contact Info Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <h3 className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 flex items-center relative z-10">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                      Contact Information
                    </h3>

                    <div className="space-y-5 relative z-10">
                      {/* Email Item */}
                      <div className="flex items-center group">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
                          <Mail size={18} />
                        </div>
                        <div className="ml-4 overflow-hidden">
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                          <p className="text-sm text-slate-900 dark:text-white font-medium truncate">{selectedBusiness.email}</p>
                        </div>
                      </div>

                      {/* Phone Item */}
                      <div className="flex items-center group">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shrink-0">
                          <Phone size={18} />
                        </div>
                        <div className="ml-4 overflow-hidden">
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                          <p className="text-sm text-slate-900 dark:text-white font-medium truncate">{selectedBusiness.phone}</p>
                        </div>
                      </div>

                      {/* Website Item */}
                      <div className="flex items-center group">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shrink-0">
                          <Globe size={18} />
                        </div>
                        <div className="ml-4 overflow-hidden flex-1">
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">Website</p>
                          {selectedBusiness.website_url && selectedBusiness.website_url.trim() !== '' ? (
                            <button
                              onClick={() => openWebsite(selectedBusiness.website_url)}
                              className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate hover:underline flex items-center w-full text-left"
                            >
                              Visit Website <ExternalLink size={10} className="ml-1" />
                            </button>
                          ) : (
                            <span className="text-sm text-slate-400 italic">No website provided</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Location & Map */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm h-full flex flex-col">
                    <div className="p-5 pb-2">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
                        <MapPin size={16} className="text-red-500 mr-2" />
                        Location Details
                      </h3>
                      <p className="text-xl text-slate-800 dark:text-slate-200 leading-relaxed font-medium pl-6">{selectedBusiness.address}</p>
                    </div>

                    {/* Map View */}
                    <div className="flex-1 p-2">
                      <div
                        className={`relative w-full h-64 lg:h-full rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 shadow-inner min-h-[250px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-400 ${selectedBusiness.mapPin && selectedBusiness.mapPin.trim() !== ''
                          ? 'bg-slate-100 dark:bg-slate-800'
                          : 'bg-slate-200 dark:bg-slate-900'
                          }`}
                        onClick={() => {
                          if (selectedBusiness.mapPin && selectedBusiness.mapPin.trim() !== '') {
                            openGoogleMaps(selectedBusiness.mapPin);
                          }
                        }}
                      >
                        {selectedBusiness.mapPin && selectedBusiness.mapPin.trim() !== '' ? (
                          <>
                            {/* Enhanced Map Preview Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                              {/* Animated gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse-slow"></div>

                              {/* Grid pattern overlay */}
                              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiNmZmZmZmYyMCIgc3Ryb2tlLXdpZHRoPSIwLjUiPgogICAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIvPgogIDwvZz4KPC9zdmc+')] opacity-10 dark:opacity-20"></div>

                              {/* Floating particles */}
                              <div className="absolute inset-0">
                                {[...Array(20)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="absolute rounded-full bg-white/20 dark:bg-white/10"
                                    style={{
                                      top: `${Math.random() * 100}%`,
                                      left: `${Math.random() * 100}%`,
                                      width: `${Math.random() * 10 + 2}px`,
                                      height: `${Math.random() * 10 + 2}px`,
                                      animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                                      animationDelay: `${Math.random() * 5}s`,
                                      opacity: Math.random() * 0.5 + 0.2
                                    }}
                                  ></div>
                                ))}
                              </div>

                              {/* Animated map lines */}
                              <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse-slow"></div>
                                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                                <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

                                <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse-slow"></div>
                                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                                <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-pink-400 to-transparent animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                              </div>
                            </div>

                            {/* Enhanced Map Pin Marker */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                              {/* Pulsing rings */}
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-red-500/30 animate-ping-slow"></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-red-500/50 animate-ping-slow" style={{ animationDelay: '0.5s' }}></div>

                              {/* Main pin */}
                              <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/30 transform transition-transform hover:scale-110">
                                  <MapPin className="text-white" size={28} />
                                </div>
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rotate-45"></div>
                              </div>
                            </div>

                            {/* Enhanced Location Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 backdrop-blur-sm">
                              <div className="flex items-center text-white">
                                <div className="p-2 bg-red-500/20 rounded-lg mr-3">
                                  <MapPin className="text-red-400" size={20} />
                                </div>
                                <div>
                                  <p className="text-xs text-slate-300 font-medium">LOCATION</p>
                                  <p className="font-bold truncate max-w-md">{selectedBusiness.address}</p>
                                </div>
                              </div>
                            </div>

                            {/* Enhanced Click Hint */}
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full flex items-center shadow-lg border border-white/10 transition-all hover:bg-black/80 hover:scale-105">
                              <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                              <span>Click to open map</span>
                              <ExternalLink size={14} className="ml-2" />
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                            <div className="relative">
                              <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-4">
                                <Map className="text-slate-400 dark:text-slate-500" size={48} />
                              </div>
                              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold animate-bounce">
                                !
                              </div>
                            </div>
                            <p className="text-xl font-medium mb-2">No location data</p>
                            <p className="text-sm max-w-xs text-center">Add map coordinates to enable this feature</p>
                          </div>
                        )}
                      </div>

                      {/* Map Link Button */}
                      {selectedBusiness.mapPin && selectedBusiness.mapPin.trim() !== '' && (
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openGoogleMaps(selectedBusiness.mapPin);
                            }}
                            className="inline-flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                          >
                            <ExternalLink size={16} className="mr-2" />
                            Open in Google Maps
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ratings & Reviews Section */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                    <Star className="text-yellow-500 mr-2" fill="currentColor" size={24} /> Ratings & Reviews
                  </h3>
                  <div className="flex gap-2">
                    <button className="flex items-center text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                      <Filter size={14} className="mr-1.5" /> Filter
                    </button>
                  </div>
                </div>

                {detailsLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : detailsError ? (
                  <div className="text-center py-12">
                    <div className="text-red-500 text-lg font-medium mb-2">Error Loading Reviews</div>
                    <p className="text-slate-500 dark:text-slate-400">{detailsError}</p>
                  </div>
                ) : businessDetails ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Left: Summary Stats */}
                    <div className="lg:col-span-1 space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                        <div className="text-5xl font-extrabold text-slate-800 dark:text-white mb-2">
                          {Number(businessDetails.averageRating || 0).toFixed(1)}
                        </div>
                        <div className="flex justify-center space-x-1 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={20}
                              className={s <= Math.round(Number(businessDetails.averageRating || 0))
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-300 dark:text-slate-600"}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                          Based on {businessDetails.totalReviews} reviews
                        </p>
                      </div>

                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((stars, index) => {
                          const ratingPercentages = calculateRatingDistribution();
                          const percent = ratingPercentages[index] || 0;
                          return (
                            <div key={stars} className="flex items-center text-sm">
                              <span className="w-8 font-bold text-slate-600 dark:text-slate-400 flex items-center">
                                {stars} <Star size={10} className="ml-0.5 text-slate-400" />
                              </span>
                              <div className="flex-1 mx-3 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{ width: `${percent}%` }}
                                ></div>
                              </div>
                              <span className="w-8 text-right text-slate-400 text-xs">{percent}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Reviews List */}
                    <div className="lg:col-span-2">
                      <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                        Latest Feedback
                      </h4>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                        {businessDetails.comments.length > 0 ? (
                          businessDetails.comments.map((comment) => {
                            const review = {
                              id: comment.id,
                              user: comment.user_name || `User ${comment.user_id}`,
                              avatar: comment.user_avatar || '/placeholder-avatar.jpg',
                              date: new Date(comment.created_at).toLocaleDateString(),
                              rating: comment.rating,
                              comment: comment.comment
                            };

                            return (
                              <div key={review.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center">
                                    <img
                                      src={review.avatar}
                                      alt={review.user}
                                      className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-600"
                                    />
                                    <div className="ml-3">
                                      <div className="font-bold text-slate-800 dark:text-white text-sm">{review.user}</div>
                                      <div className="text-xs text-slate-500 dark:text-slate-400">{review.date}</div>
                                    </div>
                                  </div>
                                  <div className="flex bg-yellow-50 dark:bg-yellow-900/10 px-2 py-1 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star
                                        key={s}
                                        size={12}
                                        className={s <= review.rating
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-slate-300 dark:text-slate-600"}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                                  {review.comment}
                                </p>
                                <div className="flex items-center space-x-4">
                                  <button className="flex items-center text-xs text-slate-400 hover:text-blue-500 transition-colors font-medium">
                                    <ThumbsUp size={12} className="mr-1" /> Helpful
                                  </button>
                                  <button className="flex items-center text-xs text-slate-400 hover:text-blue-500 transition-colors font-medium">
                                    <MessageSquare size={12} className="mr-1" /> Reply
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                            <Star size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                            <p className="text-slate-500 dark:text-slate-400 font-medium">No reviews yet.</p>
                            <p className="text-xs text-slate-400 mt-1">Be the first to leave a review!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">No rating data available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="bg-white dark:bg-slate-800 p-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 sticky bottom-0 z-20">
              <div className="flex items-center text-slate-500 text-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                Reviewing listing for approval...
              </div>
              <div className="flex space-x-4 w-full sm:w-auto">
                <button
                  onClick={() => updateBusinessStatus(selectedBusiness.id, 'rejected')}
                  className="flex-1 sm:flex-none py-3 px-6 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 rounded-xl font-bold transition-all flex items-center justify-center"
                >
                  <XCircle size={18} className="mr-2" /> Reject
                </button>
                <button
                  onClick={() => updateBusinessStatus(selectedBusiness.id, 'approved')}
                  className="flex-1 sm:flex-none py-3 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center transform hover:-translate-y-0.5"
                >
                  <CheckCircle size={18} className="mr-2" /> Approve Listing
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Image Gallery Modal */}
      {isGalleryOpen && selectedBusiness && selectedBusiness.images && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="relative max-w-5xl w-full max-h-[90vh]">
            {/* Close button */}
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Navigation buttons */}
            {selectedBusiness.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {selectedBusiness.images.length}
            </div>

            {/* Main image */}
            <div className="flex items-center justify-center h-full">
              <img
                src={selectedBusiness.images[currentImageIndex]}
                alt={`${selectedBusiness.name} image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>

            {/* Thumbnail strip */}
            {selectedBusiness.images.length > 1 && (
              <div className="absolute bottom-16 left-0 right-0 flex justify-center">
                <div className="flex space-x-2 overflow-x-auto max-w-md px-4 py-2 bg-black/30 rounded-lg">
                  {selectedBusiness.images.map((img, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${index === currentImageIndex ? 'border-white' : 'border-transparent'}`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default B2B;