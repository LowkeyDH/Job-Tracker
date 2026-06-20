import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllJobs, deleteJob, updateJob } from '../api/jobs';

const statusConfig = {
  applied:   { label: 'Applied',   classes: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  interview: { label: 'Interview', classes: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
  offer:     { label: 'Offer',     classes: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
  rejected:  { label: 'Rejected',  classes: 'bg-rose-500/20 text-rose-300 border border-rose-500/30' },
};

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getAllJobs().then((res) => setJobs(res.data));
  }, []);

  const handleDelete = async (id) => {
    await deleteJob(id);
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const handleStatusChange = async (job, newStatus) => {
    await updateJob(job.id, { ...job, status: newStatus });
    setJobs(jobs.map((j) => j.id === job.id ? { ...j, status: newStatus } : j));
  };

  const counts = {
    applied:   jobs.filter(j => j.status === 'applied').length,
    interview: jobs.filter(j => j.status === 'interview').length,
    offer:     jobs.filter(j => j.status === 'offer').length,
    rejected:  jobs.filter(j => j.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8">

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Job Smart Tracker
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Built with Claude Agent SDK </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/search"
              className="bg-white/5 border border-white/10 text-slate-300 px-5 py-2.5 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Search Jobs
            </Link>
            <Link
              to="/upload"
              className="bg-white/5 border border-white/10 text-slate-300 px-5 py-2.5 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Upload Resume
            </Link>
            <Link
              to="/add"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/30"
            >
              + Add Job
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-5xl mx-auto grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Applied',   count: counts.applied,   color: 'from-blue-600 to-blue-400' },
          { label: 'Interview', count: counts.interview, color: 'from-amber-600 to-amber-400' },
          { label: 'Offer',     count: counts.offer,     color: 'from-emerald-600 to-emerald-400' },
          { label: 'Rejected',  count: counts.rejected,  color: 'from-rose-600 to-rose-400' },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
              {s.count}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="max-w-5xl mx-auto">
        {jobs.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-lg">No jobs yet. Add your first one!</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-widest">
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr
                    key={job.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                  >
                    <td className="px-6 py-4 font-semibold text-white">{job.company}</td>
                    <td className="px-6 py-4 text-slate-300">{job.title}</td>
                    <td className="px-6 py-4">
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-transparent border-0 cursor-pointer focus:outline-none ${statusConfig[job.status]?.classes}`}
                      >
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-rose-400 hover:text-rose-300 text-sm font-medium transition hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
