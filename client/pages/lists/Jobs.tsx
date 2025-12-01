

import React, { useState } from 'react';
import { Plus, Briefcase, MapPin, DollarSign, Clock, Search, Eye, Trash2, EyeOff, User, MoreHorizontal, FileText, CheckCircle, XCircle, Phone, Linkedin, Download, Mail } from 'lucide-react';
import Modal from '../../components/Modal';
import JobForm from '../../components/forms/JobForm';
import { MOCK_JOBS, MOCK_APPLICANTS } from '../../constants';
import { Job, JobApplicant } from '../../types';

const Jobs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<JobApplicant | null>(null);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [applicants, setApplicants] = useState<JobApplicant[]>(MOCK_APPLICANTS);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteJob = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this job listing?')) {
        setJobs(jobs.filter(j => j.id !== id));
        // Close modal if deleting the selected job
        if (selectedJob?.id === id) setSelectedJob(null);
    }
  };

  const handleToggleStatus = (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = job.status === 'visible' ? 'hidden' : 'visible';
    const updatedJob = { ...job, status: newStatus } as Job;
    setJobs(jobs.map(j => j.id === job.id ? updatedJob : j));
    if (selectedJob?.id === job.id) setSelectedJob(updatedJob);
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApplicants = applicants.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Jobs & Recruitment</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage listings and view incoming applications.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder={activeTab === 'jobs' ? "Search jobs..." : "Search applicants..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-800 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                />
            </div>
            <button 
                onClick={() => setIsFormOpen(true)} 
                className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
                <Plus size={20} className="mr-2" /> Post Job
            </button>
        </div>
      </div>

       {/* Navigation Tabs */}
       <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-xl mb-6 w-fit border border-slate-200 dark:border-slate-700/60">
            <button 
                onClick={() => setActiveTab('jobs')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === 'jobs' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
                <Briefcase size={16} className="mr-2" /> Job Listings
            </button>
            <button 
                onClick={() => setActiveTab('applicants')}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === 'applicants' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
                <User size={16} className="mr-2" /> Applicants
            </button>
      </div>

      {activeTab === 'jobs' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {filteredJobs.map(job => (
                <div 
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden"
                >
                    {/* Status Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${job.status === 'visible' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                    
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                        <Briefcase size={24} />
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h3>
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${job.status === 'visible' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'}`}>
                                {job.status}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center"><Briefcase size={14} className="mr-1.5"/> {job.company}</span>
                            <span className="flex items-center"><MapPin size={14} className="mr-1.5"/> {job.location}</span>
                            <span className="flex items-center"><Clock size={14} className="mr-1.5"/> {job.postedDate}</span>
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
                 <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    No job listings found.
                </div>
            )}
        </div>
      )}

      {activeTab === 'applicants' && (
         <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/60">
                    <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applicant</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applying For</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied Date</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-800/0">
                        {filteredApplicants.map(app => {
                            const jobTitle = jobs.find(j => j.id === app.jobId)?.title || 'Unknown Job';
                            return (
                                <tr 
                                    key={app.id} 
                                    className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors cursor-pointer"
                                    onClick={() => setSelectedApplicant(app)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full border border-slate-200 dark:border-slate-700" src={app.avatar} alt="" />
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-slate-900 dark:text-white">{app.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{app.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{jobTitle}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                        {app.appliedDate}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button className="text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                 {filteredApplicants.length === 0 && (
                     <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                        No applicants found.
                    </div>
                 )}
            </div>
         </div>
      )}

      {/* Create Job Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Create Job Listing" maxWidth="max-w-4xl">
        <JobForm onSubmit={() => setIsFormOpen(false)} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      {/* Job Details Modal - Matching Image 1 Design */}
      <Modal isOpen={!!selectedJob} onClose={() => setSelectedJob(null)} title="Job Details" maxWidth="max-w-5xl">
        {selectedJob && (
            <div className="bg-[#0f172a] text-slate-300 rounded-xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-8 border-b border-slate-800 flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shrink-0">
                            {selectedJob.company.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{selectedJob.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="flex items-center"><Briefcase size={14} className="mr-1.5"/> {selectedJob.company}</span>
                                <span className="flex items-center"><MapPin size={14} className="mr-1.5"/> {selectedJob.location}</span>
                                <span className="flex items-center"><Clock size={14} className="mr-1.5"/> Posted {selectedJob.postedDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Description */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-3">Job Description</h3>
                            <p className="leading-relaxed text-slate-400">{selectedJob.description}</p>
                        </div>

                        <div>
                            <h3 className="text-white font-bold text-lg mb-3">Key Responsibilities</h3>
                            <ul className="space-y-2">
                                {selectedJob.responsibilities.map((res, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <CheckCircle size={18} className="text-emerald-500 mr-3 mt-0.5 shrink-0" />
                                        <span>{res}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-white font-bold text-lg mb-3">Requirements</h3>
                            <ul className="space-y-2 list-disc pl-5 marker:text-slate-500">
                                {selectedJob.requirements.map((req, idx) => (
                                    <li key={idx}>{req}</li>
                                ))}
                            </ul>
                        </div>
                        
                         <div>
                            <h3 className="text-white font-bold text-lg mb-3">Benefits</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {selectedJob.benefits.map((ben, idx) => (
                                    <div key={idx} className="bg-slate-800/50 border border-slate-700 px-4 py-3 rounded-lg flex items-center">
                                        <CheckCircle size={16} className="text-emerald-500 mr-2" /> {ben}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                            <h3 className="text-white font-bold text-lg mb-6">Job Summary</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Salary</div>
                                    <div className="text-emerald-400 font-bold text-lg">{selectedJob.salary}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Job Type</div>
                                    <div className="text-blue-400 font-bold">{selectedJob.type}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Industry</div>
                                    <div className="text-purple-400 font-bold">{selectedJob.industry}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action Bar (Admin Controls) */}
                <div className="bg-slate-800 p-6 border-t border-slate-700 flex justify-between items-center sticky bottom-0 z-20">
                     <div className="flex items-center">
                        <span className="text-slate-400 text-sm font-medium mr-3">Listing Status:</span>
                        <span className={`flex items-center text-sm font-bold px-3 py-1 rounded-full ${selectedJob.status === 'visible' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400 border border-slate-600'}`}>
                            {selectedJob.status === 'visible' ? <Eye size={14} className="mr-1.5"/> : <EyeOff size={14} className="mr-1.5"/>}
                            {selectedJob.status}
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <button 
                             onClick={(e) => handleDeleteJob(selectedJob.id, e)}
                             className="text-red-400 hover:text-red-300 font-bold text-sm flex items-center px-4 py-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} className="mr-2" /> Delete Listing
                        </button>
                        <button 
                            onClick={(e) => handleToggleStatus(selectedJob, e)}
                            className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center ${selectedJob.status === 'visible' ? 'bg-slate-700 hover:bg-red-500/20 text-slate-300 hover:text-red-400' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'}`}
                        >
                            {selectedJob.status === 'visible' ? (
                                <> <EyeOff size={16} className="mr-2" /> Take Down </>
                            ) : (
                                <> <Eye size={16} className="mr-2" /> Make Visible </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </Modal>

      {/* Applicant Details Modal */}
      <Modal isOpen={!!selectedApplicant} onClose={() => setSelectedApplicant(null)} title={`Application Details: ${selectedApplicant?.name}`} maxWidth="max-w-3xl">
          {selectedApplicant && (
              <div className="bg-[#0f172a] p-8 text-slate-200 rounded-xl space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
                      Apply for {jobs.find(j => j.id === selectedApplicant.jobId)?.title || 'Job Position'}
                      <span className="block text-sm text-slate-500 font-normal mt-1">at {jobs.find(j => j.id === selectedApplicant.jobId)?.company} • Remote (Europe/US)</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Full Name *</label>
                          <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200">
                              {selectedApplicant.name}
                          </div>
                      </div>
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Email Address *</label>
                          <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 flex items-center">
                              <Mail size={16} className="mr-2 text-slate-500"/> {selectedApplicant.email}
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Phone Number *</label>
                          <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 flex items-center">
                              <Phone size={16} className="mr-2 text-slate-500"/> {selectedApplicant.phone}
                          </div>
                      </div>
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">LinkedIn Profile</label>
                          <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-blue-400 flex items-center cursor-pointer hover:underline">
                              <Linkedin size={16} className="mr-2"/> {selectedApplicant.linkedin || 'N/A'}
                          </div>
                      </div>
                  </div>

                  <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Resume/CV *</label>
                      <div className="bg-slate-800/30 border border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                          <FileText size={32} className="text-slate-500 mb-2" />
                          <span className="text-slate-300 font-medium mb-1">Resume_File.pdf</span>
                          <button className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center mt-2">
                              <Download size={12} className="mr-1.5" /> Download Resume
                          </button>
                      </div>
                  </div>

                  <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Cover Letter</label>
                      <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 min-h-[120px] whitespace-pre-wrap leading-relaxed">
                          {selectedApplicant.coverLetter || "No cover letter provided."}
                      </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                       <button onClick={() => setSelectedApplicant(null)} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center">
                           Close Application
                       </button>
                  </div>
              </div>
          )}
      </Modal>
    </div>
  );
};

export default Jobs;
