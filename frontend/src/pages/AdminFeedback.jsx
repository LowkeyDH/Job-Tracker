import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeedback } from '../api/feedback';

export default function AdminFeedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeedback()
      .then((res) => setFeedback(res.data))
      .finally(() => setLoading(false));
  }, []);

  const avg = feedback.length
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : null;

  const stars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8">
      <div className="max-w-3xl mx-auto">

        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-6 transition">
          ← Back
        </button>

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
          User Feedback
        </h1>
        <p className="text-slate-400 text-sm mb-8">All feedback submitted by users.</p>

        {/* Summary */}
        {feedback.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Total</p>
              <p className="text-4xl font-bold text-white">{feedback.length}</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Avg Rating</p>
              <p className="text-4xl font-bold text-amber-400">{avg} <span className="text-2xl">★</span></p>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <p className="text-slate-400 animate-pulse">Loading...</p>
        ) : feedback.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p className="text-4xl mb-4">💬</p>
            <p>No feedback yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.map((f) => (
              <div key={f.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-amber-400 text-lg tracking-wider">{stars(f.rating)}</span>
                  <span className="text-slate-500 text-xs">
                    {new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                {f.message && (
                  <p className="text-slate-300 text-sm leading-relaxed">{f.message}</p>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
