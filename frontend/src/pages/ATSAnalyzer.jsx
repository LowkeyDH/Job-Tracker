import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyzeATS } from '../api/ats';

export default function ATSAnalyzer() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    analyzeATS(resumeId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Analysis failed'));
  }, [resumeId]);

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
      <p className="text-rose-400">{error}</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400 animate-pulse text-lg mb-2">Checking ATS compatibility...</p>
        <p className="text-slate-600 text-sm">Analyzing keywords, formatting, and achievements</p>
      </div>
    </div>
  );

  const scoreColor = data.score >= 75
    ? 'from-emerald-500 to-cyan-500'
    : data.score >= 50
    ? 'from-amber-500 to-orange-400'
    : 'from-rose-500 to-pink-500';

  const categoryColors = {
    'Keywords': 'text-purple-300 bg-purple-500/20 border-purple-500/30',
    'Achievements': 'text-amber-300 bg-amber-500/20 border-amber-500/30',
    'Formatting': 'text-cyan-300 bg-cyan-500/20 border-cyan-500/30',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8">
      <div className="max-w-3xl mx-auto">

        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-6 transition">
          ← Back
        </button>

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
          ATS Score
        </h1>
        <p className="text-slate-400 text-sm mb-8">How well your resume passes Applicant Tracking Systems.</p>

        {/* Score */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm mb-6">
          <div className="flex items-center gap-8">
            <div className={`text-7xl font-extrabold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
              {data.score}
            </div>
            <div className="flex-1">
              <div className="w-full bg-white/5 rounded-full h-3 mb-3">
                <div
                  className={`h-3 rounded-full bg-gradient-to-r ${scoreColor}`}
                  style={{ width: `${data.score}%` }}
                />
              </div>
              <p className="text-slate-300 text-sm">{data.summary}</p>
            </div>
          </div>
        </div>

        {/* Issues */}
        {data.issues?.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mb-4">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-rose-400">✗</span> Issues to Fix
            </h2>
            <div className="space-y-4">
              {data.issues.map((issue, i) => (
                <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${categoryColors[issue.category] || 'text-slate-300 bg-white/5 border-white/10'}`}>
                      {issue.category}
                    </span>
                  </div>
                  <p className="text-rose-300 text-sm mb-1">{issue.problem}</p>
                  <p className="text-slate-400 text-sm">→ {issue.fix}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths */}
        {data.strengths?.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Strengths
            </h2>
            <div className="space-y-2">
              {data.strengths.map((s, i) => (
                <p key={i} className="text-emerald-300 text-sm flex items-start gap-2">
                  <span className="mt-0.5">•</span> {s}
                </p>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate(`/resume/${resumeId}`)}
          className="mt-8 w-full bg-white/5 border border-white/10 text-slate-300 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
        >
          ← Back to Resume Analysis
        </button>

      </div>
    </div>
  );
}
