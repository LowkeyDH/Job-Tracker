import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchJobs } from '../api/jobSearch';
import { createJob } from '../api/jobs';

const COUNTRIES = [
  { code: 'au', label: 'Australia' },
  { code: 'us', label: 'United States' },
  { code: 'gb', label: 'United Kingdom' },
  { code: 'ca', label: 'Canada' },
  { code: 'de', label: 'Germany' },
  { code: 'sg', label: 'Singapore' },
];

const LEVELS = [
  { value: '', label: 'Any Level' },
  { value: 'entry level', label: 'Entry Level' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid level', label: 'Mid-level' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead / Manager' },
];

export default function JobSearch() {
  const navigate = useNavigate();
  const [what, setWhat] = useState('');
  const [where, setWhere] = useState('');
  const [country, setCountry] = useState('us');
  const [level, setLevel] = useState('');
  const [internship, setInternship] = useState(false);
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState({});
  const [saving, setSaving] = useState({});

  const PER_PAGE = 10;

  const runSearch = async (pageNum) => {
    setLoading(true);
    setError('');
    setResults([]);
    setSaved({});
    try {
      const res = await searchJobs({ what: what.trim(), where: where.trim(), country, level, internship, page: pageNum });
      setResults(res.data.jobs);
      setTotalCount(res.data.count);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!what.trim()) return;
    setPage(1);
    runSearch(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    runSearch(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = totalCount ? Math.min(Math.ceil(totalCount / PER_PAGE), 100) : 0;

  const handleSave = async (job, index) => {
    setSaving((prev) => ({ ...prev, [index]: true }));
    try {
      await createJob({
        company: job.company,
        title: job.title,
        status: 'applied',
        notes: `${job.location ? job.location + ' | ' : ''}${job.salary ? job.salary + ' | ' : ''}${job.url}`,
      });
      setSaved((prev) => ({ ...prev, [index]: true }));
    } catch {
      setSaving((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">

        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-6 transition">
          ← Back to Tracker
        </button>

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Search Real Jobs
        </h1>
        <p className="text-slate-400 text-sm mb-8">Powered by Adzuna — find live job listings and save them to your tracker.</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mb-8">
          {/* Row 1: Title + Location + Country */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-widest mb-1.5 block">Job Title *</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer"
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-widest mb-1.5 block">Location</label>
              <input
                type="text"
                placeholder="e.g. Sydney"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition"
              />
            </div>
            <div>
              <label className="text-slate-400 text-xs uppercase tracking-widest mb-1.5 block">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 text-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Level + Internship toggle */}
          <div className="flex flex-wrap items-end gap-4 mb-5">
            <div className="flex-1 min-w-[160px]">
              <label className="text-slate-400 text-xs uppercase tracking-widest mb-1.5 block">Experience Level</label>
              <select
                value={internship ? '' : level}
                onChange={(e) => setLevel(e.target.value)}
                disabled={internship}
                className="w-full bg-slate-800 border border-white/10 text-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition disabled:opacity-40"
              >
                {LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Internship toggle */}
            <button
              type="button"
              onClick={() => {
                setInternship(!internship);
                if (!internship) setLevel('');
              }}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border font-semibold text-sm transition ${
                internship
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
              }`}
            >
              <span className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                internship ? 'bg-cyan-500 border-cyan-500' : 'border-slate-500'
              }`}>
                {internship && <span className="text-white text-xs font-bold">✓</span>}
              </span>
              Internship Only
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/30 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search Jobs'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl px-5 py-3 text-rose-300 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-slate-400 animate-pulse text-lg">Fetching live jobs...</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm">
                Page <span className="text-white font-semibold">{page}</span> of{' '}
                <span className="text-white font-semibold">{totalPages.toLocaleString()}</span>
                <span className="text-slate-500"> ({totalCount?.toLocaleString()} total)</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                {/* Page number pills */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const p = start + i;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                        p === page
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {results.map((job, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/[0.08] transition">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-base mb-1 truncate">{job.title}</h3>
                      <p className="text-purple-300 text-sm mb-1">{job.company}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.location && (
                          <span className="text-xs text-slate-400 bg-white/5 px-2.5 py-1 rounded-full">
                            📍 {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            {job.salary}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{job.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center bg-white/5 border border-white/10 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition whitespace-nowrap"
                      >
                        View Job ↗
                      </a>
                      <button
                        onClick={() => handleSave(job, i)}
                        disabled={saved[i] || saving[i]}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                          saved[i]
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                            : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90 shadow-lg shadow-purple-500/20 disabled:opacity-50'
                        }`}
                      >
                        {saved[i] ? '✓ Saved' : saving[i] ? 'Saving...' : 'Save to Tracker'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="text-slate-400 text-sm px-3">Page {page} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </>
        )}

        {/* Empty state after search */}
        {!loading && totalCount === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-4">🔍</p>
            <p>No jobs found. Try different keywords or location.</p>
          </div>
        )}

      </div>
    </div>
  );
}
