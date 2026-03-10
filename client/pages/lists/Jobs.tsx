import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, MapPin, DollarSign, Clock, Search, Eye, Trash2, EyeOff, FileText, CheckCircle, XCircle, ExternalLink, AlertCircle, List, Award } from 'lucide-react';
import Modal from '../../components/Modal';
import JobForm from '../../components/forms/JobForm';
import { Job } from '../../types';

const Jobs: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to format ISO date strings
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/jobs/jobs-get', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDeleteJob = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:5000/api/jobs/jobs-delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to delete job');

        setJobs(jobs.filter(j => j.id !== id));
        if (selectedJob?.id === id) setSelectedJob(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete job');
      }
    }
  };

  const handleToggleStatus = async (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = job.status === 'visible' ? 'hidden' : 'visible';

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/jobs/jobs/${job.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const updatedJob = { ...job, status: newStatus } as Job;
      setJobs(jobs.map(j => j.id === job.id ? updatedJob : j));
      if (selectedJob?.id === job.id) setSelectedJob(updatedJob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job status');
    }
  };

  const handleJobSubmit = async (data: any) => {
    try {
      // After successful submission, refetch jobs to get the updated list
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/jobs/jobs-get', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch updated jobs');
      const updatedJobs = await response.json();
      setJobs(updatedJobs);
      setIsFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh jobs');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      {/* Error Display */}
      {error && (
        <div className="mb-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={14} />
          <div>
            <h4 className="font-medium text-red-800 dark:text-red-200">Error</h4>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Job Listings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your job postings.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-3 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
          >
            <Plus size={14} className="mr-2" /> Post Job
          </button>
        </div>
      </div>

      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredJobs.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center gap-3 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* Status Bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${job.status === 'visible' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>

                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Briefcase size={16} />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${job.status === 'visible' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center"><Briefcase size={14} className="mr-1.5" /> {job.company}</span>
                    <span className="flex items-center"><MapPin size={14} className="mr-1.5" /> {job.location}</span>
                    <span className="flex items-center"><Clock size={14} className="mr-1.5" /> {formatDate(job.postedDate)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-100 dark:border-slate-700 pt-3 md:pt-0">
                  <div className="text-right mr-4 hidden md:block">
                    <div className="text-xs font-bold text-slate-400 uppercase">Applicants</div>
                    <div className="text-lg font-bold text-slate-800 dark:text-white">12</div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteJob(job.id, e)}
                    className="p-2.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {filteredJobs.length === 0 && (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                No job listings found.
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Job Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Create Job Listing" maxWidth="max-w-4xl">
        <JobForm onSubmit={handleJobSubmit} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      {/* Job Details Modal */}
      <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title="Career Opportunity" maxWidth="max-w-6xl">
        {selectedJob && (
          <div className="bg-slate-950 text-slate-300 rounded-[2.5rem] overflow-hidden flex flex-col relative border border-slate-800 shadow-2xl">
            {/* Branded Hero Section */}
            <div className="relative p-10 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-950 border-b border-slate-800">
              <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                <Briefcase size={200} className="text-white rotate-12" />
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-sky-400 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo-600/40 shrink-0 transform hover:scale-105 transition-transform cursor-default">
                  {selectedJob.company.substring(0, 1).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      {selectedJob.company}
                    </span>
                    <span className="px-4 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-sky-400">
                      {selectedJob.industry}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${selectedJob.status === 'visible' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      Listing: {selectedJob.status}
                    </span>
                  </div>

                  <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                    {selectedJob.title}
                  </h2>

                  <div className="flex flex-wrap gap-8 items-center text-slate-400">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 rounded-xl border border-slate-800"><MapPin size={18} className="text-sky-400" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Location</p>
                        <p className="font-bold text-white">{selectedJob.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 rounded-xl border border-slate-800"><DollarSign size={18} className="text-emerald-400" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Salary Range</p>
                        <p className="font-bold text-white">{selectedJob.salary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 rounded-xl border border-slate-800"><Clock size={18} className="text-indigo-400" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Posted</p>
                        <p className="font-bold text-white">{formatDate(selectedJob.postedDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row bg-slate-950 min-h-[500px]">
              {/* Left Side: Details */}
              <div className="flex-1 p-10 lg:pr-6 space-y-12 overflow-y-auto custom-scrollbar max-h-[1000px]">
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Executive Summary</h3>
                  </div>
                  <p className="text-lg leading-relaxed text-slate-400 font-medium whitespace-pre-wrap">
                    {selectedJob.description}
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-indigo-600/10 rounded-xl"><List size={20} className="text-indigo-400" /></div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">Key Responsibilities</h3>
                    </div>
                    <ul className="space-y-4">
                      {selectedJob.responsibilities.map((res, idx) => (
                        <li key={idx} className="flex items-start gap-3 group text-slate-400 hover:text-white transition-colors">
                          <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className="font-medium">{res}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-8 duration-900">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-sky-600/10 rounded-xl"><Award size={20} className="text-sky-400" /></div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">Success Requirements</h3>
                    </div>
                    <ul className="space-y-4">
                      {selectedJob.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3 group text-slate-400 hover:text-white transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-2"></div>
                          <span className="font-medium">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <section className="bg-emerald-600/5 border border-emerald-600/10 p-8 rounded-[2rem] animate-in fade-in slide-in-from-bottom-10 duration-1000">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-600/20 rounded-xl"><CheckCircle size={20} className="text-emerald-400" /></div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Incentives & Benefits</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedJob.benefits.map((ben, idx) => (
                      <div key={idx} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/50 flex items-center gap-3 group hover:border-emerald-500/30 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold group-hover:scale-110 transition-transform">
                          +
                        </div>
                        <span className="font-bold text-slate-300 group-hover:text-white">{ben}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Side: Sidebar Actions */}
              <div className="w-full lg:w-80 p-10 lg:pl-4 bg-slate-950 border-l border-slate-900">
                <div className="sticky top-0 space-y-6">
                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] text-center shadow-xl">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Contract Type</div>
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-600/20">
                      <Briefcase size={14} /> {selectedJob.type}
                    </div>
                  </div>

                  {selectedJob.url && (
                    <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-2xl shadow-indigo-600/40 text-center group hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-4 relative z-10">Application Hub</div>
                      <p className="text-emerald-300 font-black mb-6 text-xs truncate relative z-10">{selectedJob.url}</p>
                      <a
                        href={selectedJob.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white text-indigo-700 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl hover:bg-slate-100 transition-colors relative z-10"
                      >
                        Launch Portal <ExternalLink size={16} />
                      </a>
                    </div>
                  )}

                  
                </div>
              </div>
            </div>

            {/* Admin Action Footer */}
            <div className="bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 p-8 flex flex-col sm:flex-row justify-between items-center gap-6 sticky bottom-0 z-50">
              <div className="flex items-center group">
                <div className={`w-3 h-3 rounded-full mr-4 ${selectedJob.status === 'visible' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}></div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Control Panel</p>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">Active Campaign Mode</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={(e) => handleDeleteJob(selectedJob.id, e)}
                  className="px-8 py-4 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete Listing
                </button>

                <button
                  onClick={(e) => handleToggleStatus(selectedJob, e)}
                  className={`flex-1 sm:flex-none px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-2 ${selectedJob.status === 'visible'
                    ? 'bg-slate-800 text-slate-300 hover:bg-rose-600 hover:text-white'
                    : 'bg-indigo-600 text-white shadow-indigo-600/30 hover:shadow-indigo-600/50'
                    }`}
                >
                  {selectedJob.status === 'visible' ? (
                    <> <EyeOff size={16} /> Take Offline </>
                  ) : (
                    <> <Eye size={16} /> Deploy Live </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Jobs;