import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Calendar, Clock, Users, DollarSign, Trash2, User, Ticket, Eye, EyeOff, CheckCircle, Circle, Search, Loader2, AlertCircle, Globe, Tag } from 'lucide-react';
import Modal from '../../components/Modal';
import EventForm from '../../components/forms/EventForm';
import { Event } from '../../types';

// 1. Define your API Base URL
const API_BASE_URL = 'http://localhost:5000/api/events';

const Events: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'guests'>('details');
    const [searchTerm, setSearchTerm] = useState('');

    // Helper function to format date and time
    const formatDateTime = (dateString: string, timeString?: string) => {
        if (!dateString) return 'Date TBD';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';

        // Format date part
        const dateOptions: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const formattedDate = date.toLocaleDateString(undefined, dateOptions);

        // Format time part if available
        if (timeString) {
            const [hours, minutes] = timeString.split(':');
            if (hours && minutes) {
                const timeDate = new Date(date);
                timeDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));

                const timeOptions: Intl.DateTimeFormatOptions = {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                };
                const formattedTime = timeDate.toLocaleTimeString(undefined, timeOptions);
                return `${formattedDate} at ${formattedTime}`;
            }
        }

        return formattedDate;
    };

    // Helper function to format time only
    const formatTime = (timeString?: string) => {
        if (!timeString) return 'TBA';

        const [hours, minutes] = timeString.split(':');
        if (!hours || !minutes) return timeString;

        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10));

        return date.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // 2. Helper function to construct the full image URL
    const getImageUrl = (imagePath: string | undefined | null) => {
        if (!imagePath) {
            // Return a default placeholder if no image exists
            return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000';
        }
        // If it's already a full URL (e.g., from Unsplash), return it as is
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        // Otherwise, prepend the API_BASE_URL to the relative path
        // Example: converts "/uploads/123.jpg" to "http://localhost:5000/uploads/123.jpg"
        return `${API_BASE_URL}${imagePath}`;
    };

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/events-get`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch events');

            const data = await response.json();

            const mappedEvents = data.map((evt: any) => ({
                ...evt,
                attendeeList: evt.attendeeList || []
            }));

            setEvents(mappedEvents);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/events-delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete event');
            setEvents(events.filter(ev => ev.id !== id));
            if (selectedEvent?.id === id) setSelectedEvent(null);
        } catch (err: any) {
            alert(`Error deleting event: ${err.message}`);
        }
    };

    const handleToggleStatus = async () => {
        if (!selectedEvent) return;
        const newStatus = selectedEvent.status === 'visible' ? 'hidden' : 'visible';

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/events/${selectedEvent.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            const updatedEvent = { ...selectedEvent, status: newStatus } as Event;
            setSelectedEvent(updatedEvent);
            setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        } catch (err: any) {
            alert(`Error updating status: ${err.message}`);
        }
    };

    const filteredEvents = events.filter(evt =>
        evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Community Events</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage meetups, conferences, and gatherings.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-3 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                    >
                        <Plus size={14} className="mr-2" /> Add Event
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-blue-600" size={16} />
                </div>
            )}

            {error && !isLoading && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center mb-3">
                    <AlertCircle size={14} className="mr-2" />
                    <span>{error}</span>
                    <button onClick={fetchEvents} className="ml-auto text-sm font-bold underline hover:no-underline">Retry</button>
                </div>
            )}

            {!isLoading && !error && (
                <div className="space-y-4">
                    {filteredEvents.map((evt) => (
                        <div
                            key={evt.id}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex flex-col md:flex-row gap-3 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden"
                            onClick={() => { setSelectedEvent(evt); setActiveTab('details'); }}
                        >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${evt.status === 'visible' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>

                            <div className="shrink-0 w-12 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-center">
                                <span className="text-xs font-bold text-red-500 uppercase">{new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-lg font-bold text-slate-800 dark:text-white">{new Date(evt.date).getDate()}</span>
                                <span className="text-[10px] text-slate-400 font-bold">{new Date(evt.date).getFullYear()}</span>
                            </div>

                            <div className="shrink-0 w-full md:w-48 h-32 rounded-xl overflow-hidden">
                                {/* 3. Use getImageUrl in List View */}
                                <img
                                    src={getImageUrl(evt.image)}
                                    alt={evt.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        // Fallback if image fails to load
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000';
                                    }}
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{evt.title}</h3>
                                        {evt.category && (
                                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                                                {evt.category}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${evt.status === 'visible' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'}`}>
                                        {evt.status}
                                    </span>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                        <Clock size={14} className="mr-2 text-blue-500" /> {formatTime(evt.time)}
                                    </div>
                                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                                        <MapPin size={14} className="mr-2 text-red-500" />
                                        {evt.city && <span className="font-bold mr-1">{evt.city},</span>} {evt.location}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-3 w-full md:w-40">
                                <div className="text-right hidden md:block">
                                    <div className="text-xs text-slate-400 uppercase font-bold">Tickets</div>
                                    <div className="text-lg font-bold text-slate-800 dark:text-white">{evt.attendees || 0}</div>
                                </div>
                                <div className="flex justify-end mt-auto">
                                    <button
                                        onClick={(e) => handleDelete(evt.id, e)}
                                        className="p-2.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                                        title="Delete Event"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredEvents.length === 0 && (
                        <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                            No events found.
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Create Event" maxWidth="max-w-4xl">
                <EventForm onSubmit={() => { setIsFormOpen(false); fetchEvents(); }} onCancel={() => setIsFormOpen(false)} />
            </Modal>

            <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)} title="" maxWidth="max-w-6xl">
                {selectedEvent && (
                    <div className="flex flex-col h-[85vh] bg-slate-50 dark:bg-slate-950 overflow-hidden rounded-2xl">
                        {/* 1. ULTRA-MODERN HERO SECTION */}
                        <div className="relative h-72 sm:h-80 w-full shrink-0 group">
                            <img
                                src={getImageUrl(selectedEvent.image)}
                                alt={selectedEvent.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000';
                                }}
                            />
                            {/* Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                            <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>

                            {/* Floating Status Badge */}
                            <div className="absolute top-6 left-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border ${selectedEvent.status === 'visible'
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                    : 'bg-slate-500/20 text-slate-300 border-white/10'
                                    }`}>
                                    {selectedEvent.status}
                                </span>
                            </div>

                            {/* Content Over Image */}
                            <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col md:flex-row justify-between items-end gap-6">
                                <div className="flex-1 animate-in fade-in slide-in-from-left-4 duration-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg shadow-indigo-600/40 uppercase tracking-widest">
                                            {selectedEvent.price || 'Free Entry'}
                                        </span>
                                        {selectedEvent.category && (
                                            <span className="bg-white/10 border border-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest leading-none">
                                                {selectedEvent.category}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight leading-none drop-shadow-2xl">
                                        {selectedEvent.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm font-bold">
                                        <div className="flex items-center bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/5">
                                            <User size={16} className="mr-2 text-indigo-400" />
                                            By {selectedEvent.organizer || 'Habesha Expat'}
                                        </div>
                                        <div className="flex items-center bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/5">
                                            <Globe size={16} className="mr-2 text-sky-400" />
                                            {selectedEvent.city || 'Multilingual'}
                                        </div>
                                    </div>
                                </div>

                                <div className="shrink-0 flex gap-4 animate-in fade-in slide-in-from-right-4 duration-700">
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-[2rem] text-center min-w-[100px] shadow-2xl">
                                        <div className="text-3xl font-black text-white leading-none mb-1">{selectedEvent.attendees || 0}</div>
                                        <div className="text-[10px] uppercase tracking-widest font-black text-slate-400">Attending</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. NAVIGATION & CONTENT AREA */}
                        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                            {/* Left Sidebar Nav */}
                            <div className="w-full md:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col shrink-0">
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`w-full flex items-center px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'details'
                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-[1.02]'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg mr-4 ${activeTab === 'details' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                            <Calendar size={18} />
                                        </div>
                                        Event Info
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('guests')}
                                        className={`w-full flex items-center px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'guests'
                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-[1.02]'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg mr-4 ${activeTab === 'guests' ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                            <Ticket size={18} />
                                        </div>
                                        Guest List
                                        <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === 'guests' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                                            }`}>
                                            {selectedEvent.attendeeList?.length || 0}
                                        </span>
                                    </button>
                                </div>

                                {/* Quick Tools Section */}
                                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Quick Actions</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleToggleStatus}
                                            className={`flex-1 p-3 rounded-xl border transition-all flex items-center justify-center gap-2 font-bold text-xs ${selectedEvent.status === 'visible'
                                                ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-600 border-amber-200 dark:border-amber-800/50 hover:bg-amber-100'
                                                : 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100'
                                                }`}
                                        >
                                            {selectedEvent.status === 'visible' ? <EyeOff size={16} /> : <Eye size={16} />}
                                            {selectedEvent.status === 'visible' ? 'Hide' : 'Show'}
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(selectedEvent.id, e)}
                                            className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/10 text-rose-600 border border-rose-200 dark:border-rose-800/50 hover:bg-rose-100 transition-all flex items-center justify-center"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Main Scrollable Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
                                {activeTab === 'details' && (
                                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                { label: 'Date', icon: Calendar, val: formatDateTime(selectedEvent.date).split('at')[0], color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                                { label: 'Time', icon: Clock, val: formatTime(selectedEvent.time), color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                                { label: 'City', icon: Globe, val: selectedEvent.city || 'Anywhere', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                                { label: 'Category', icon: Tag, val: selectedEvent.category || 'General', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                                            ].map((item, idx) => (
                                                <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                                    <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                                                        <item.icon size={20} />
                                                    </div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                                                    <div className="text-sm font-black text-slate-900 dark:text-white truncate">{item.val}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Description Section */}
                                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">About this Event</h3>
                                            </div>
                                            <div className="prose prose-indigo dark:prose-invert max-w-none">
                                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-lg italic border-l-4 border-slate-100 dark:border-slate-800 pl-6 mb-8">
                                                    "{selectedEvent.title}" – Hosted by {selectedEvent.organizer}.
                                                </p>
                                                <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base font-medium">
                                                    {selectedEvent.description}
                                                </div>
                                            </div>

                                            <div className="mt-10 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl flex items-center justify-center">
                                                        <MapPin size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precise Location</div>
                                                        <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{selectedEvent.location}</div>
                                                    </div>
                                                </div>
                                                <button className="px-6 py-2.5 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                                                    View on Maps
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'guests' && (
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Registered Attendees</h3>
                                                <p className="text-sm text-slate-500 font-medium">{selectedEvent.attendeeList?.length || 0} participants confirmed</p>
                                            </div>
                                            <button className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                                                Download CSV
                                            </button>
                                        </div>

                                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendee</th>
                                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket</th>
                                                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                                        <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    {selectedEvent.attendeeList && selectedEvent.attendeeList.length > 0 ? (
                                                        selectedEvent.attendeeList.map((attendee) => (
                                                            <tr key={attendee.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <img className="h-10 w-10 rounded-xl object-cover ring-2 ring-white dark:ring-slate-800" src={attendee.avatar} alt="" />
                                                                        <div>
                                                                            <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{attendee.name}</div>
                                                                            <div className="text-xs text-slate-400 font-mono">{attendee.email}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${attendee.ticketType === 'VIP'
                                                                        ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                                                                        }`}>
                                                                        {attendee.ticketType}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                                                                    {attendee.purchaseDate}
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/20">
                                                                        <CheckCircle size={10} /> Confirmed
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={4} className="px-6 py-20 text-center">
                                                                <div className="flex flex-col items-center gap-3">
                                                                    <Users size={48} className="text-slate-200 dark:text-slate-800" />
                                                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No tickets sold yet</p>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Events;