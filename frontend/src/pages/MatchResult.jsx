import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchResume } from '../api/match';

export default function MatchResult() {
  const { resumeId, jobId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    matchResume(resumeId, jobId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Match failed'));
  }, [resumeId, jobId]);

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
      <p className="text-rose-400">{error}</p>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
      <p className="text-slate-400 animate-pulse">Analyzing match...</p>
    </div>
  );

  const scoreColor = data.score >= 70
    ? 'from-emerald-500 to-cyan-500'
    : data.score >= 40
    ? 'from-amber-500 to-orange-500'
    : 'from-rose-500 to-pink-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8">
      <div className="max-w-3xl mx-auto">

        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-6 transition">
          ← Back to list
        </button>

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-8">
          Match Result
        </h1>

        {/* Score */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm mb-6 flex items-center gap-8">
          <div className={`text-7xl font-extrabold bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`}>
            {data.score}
          </div>
          <div>
            <p className="text-white font-semibold text-lg">Match Score</p>
            <p className="text-slate-400 text-sm mt-1">{data.recommendation}</p>
          </div>
        </div>

        {/* Matching Skills */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mb-4">
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="text-emerald-400">✓</span> Matching Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.matching_skills?.map((skill, i) => (
              <span key={i} className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="text-rose-400">✗</span> Missing Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.missing_skills?.map((skill, i) => (
              <span key={i} className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
