import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../api/jobs';

export default function AddJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ company: '', title: '', status: 'applied', url: '', notes: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createJob(form);
    navigate('/');
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-500/60 transition";
  const labelClass = "block text-sm font-medium text-slate-400 mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8 flex items-center justify-center">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-6 transition"
          >
            ← Back to list
          </button>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Add New Job
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Track your next opportunity</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm p-8 shadow-2xl shadow-purple-900/30">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className={labelClass}>Company</label>
              <input name="company" value={form.company} onChange={handleChange} required
                className={inputClass} placeholder="e.g. Google" />
            </div>

            <div>
              <label className={labelClass}>Job Title</label>
              <input name="title" value={form.title} onChange={handleChange} required
                className={inputClass} placeholder="e.g. Software Engineer I" />
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className={inputClass}>
                <option value="applied"   className="bg-slate-800">Applied</option>
                <option value="interview" className="bg-slate-800">Interview</option>
                <option value="offer"     className="bg-slate-800">Offer</option>
                <option value="rejected"  className="bg-slate-800">Rejected</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Job URL</label>
              <input name="url" value={form.url} onChange={handleChange}
                className={inputClass} placeholder="https://..." />
            </div>

            <div>
              <label className={labelClass}>Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                className={inputClass} placeholder="Recruiter name, salary range, next steps..." />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/30">
                Save Job
              </button>
              <button type="button" onClick={() => navigate('/')}
                className="flex-1 bg-white/5 border border-white/10 text-slate-300 py-3 rounded-xl font-semibold hover:bg-white/10 transition">
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
