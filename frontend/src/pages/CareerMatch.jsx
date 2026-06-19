import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyzeCareer } from '../api/career';

export default function CareerMatch() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    analyzeCareer(resumeId)
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
        <p className="text-slate-400 animate-pulse text-lg mb-2">Analyzing your career fit...</p>
        <p className="text-slate-600 text-sm">This may take a few seconds</p>
      </div>
    </div>
  );

  const getBarColor = (pct) => {
    if (pct >= 75) return 'from-emerald-500 to-cyan-500';
    if (pct >= 50) return 'from-amber-500 to-orange-400';
    return 'from-purple-500 to-pink-500';
  };

  const sorted = [...data.careers].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8">
      <div className="max-w-3xl mx-auto">

        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-6 transition">
          ← Back
        </button>

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Career Fit Analysis
        </h1>
        <p className="text-slate-400 text-sm mb-8">Based on your skills, experience, and education — here are the best career paths for you.</p>

        <div className="space-y-4">
          {sorted.map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-white font-semibold text-base">{item.career}</h2>
                <span className={`text-2xl font-extrabold bg-gradient-to-r ${getBarColor(item.percentage)} bg-clip-text text-transparent`}>
                  {item.percentage}%
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${getBarColor(item.percentage)} transition-all duration-700`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <p className="text-slate-400 text-sm">{item.reason}</p>
            </div>
          ))}
        </div>

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
