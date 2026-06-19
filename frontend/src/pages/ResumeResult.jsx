import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalysis } from '../api/resume';
import { getAllJobs } from '../api/jobs';

export default function ResumeResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');

  useEffect(() => {
    getAnalysis(id).then((res) => setData(res.data));
    getAllJobs().then((res) => setJobs(res.data));
  }, [id]);

  if (!data) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
      <p className="text-slate-400 animate-pulse">Loading analysis...</p>
    </div>
  );

  const { analysis } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8">
      <div className="max-w-3xl mx-auto">

        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-6 transition">
          ← Back to list
        </button>

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Resume Analysis
        </h1>
        <p className="text-slate-400 text-sm mb-8">{data.filename}</p>

        <div className="space-y-6">

          {/* Skills */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-purple-400">⚡</span> Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {analysis.skills?.map((skill, i) => (
                <span key={i} className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-cyan-400">💼</span> Experience
            </h2>
            <div className="space-y-3">
              {analysis.experience?.map((exp, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-white font-medium">{exp.title}</p>
                    <p className="text-slate-400 text-sm">{exp.company}</p>
                  </div>
                  <span className="text-slate-500 text-sm">{exp.years}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-emerald-400">🎓</span> Education
            </h2>
            <div className="space-y-3">
              {analysis.education?.map((edu, i) => (
                <div key={i} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <p className="text-white font-medium">{edu.degree}</p>
                  <p className="text-slate-400 text-sm">{edu.school}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Match with Job */}
          {jobs.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="text-cyan-400">🎯</span> Match with a Job
              </h2>
              <div className="flex gap-3">
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 text-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/50"
                >
                  <option value="">Select a job...</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.company} — {job.title}
                    </option>
                  ))}
                </select>
                <button
                  disabled={!selectedJobId}
                  onClick={() => navigate(`/match/${id}/${selectedJobId}`)}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Match
                </button>
              </div>
            </div>
          )}

        </div>

        <button
          onClick={() => navigate(`/career/${id}`)}
          className="mt-8 w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/30"
        >
          Analyze Career Fit →
        </button>

        <button
          onClick={() => navigate('/upload')}
          className="mt-3 w-full bg-white/5 border border-white/10 text-slate-300 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
        >
          Upload Another Resume
        </button>
      </div>
    </div>
  );
}
