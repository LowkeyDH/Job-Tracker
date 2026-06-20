import { useState } from 'react';
import { submitFeedback } from '../api/feedback';

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    try {
      await submitFeedback(rating, message);
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setRating(0);
        setMessage('');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2.5 rounded-full font-semibold shadow-lg shadow-purple-500/30 hover:opacity-90 transition z-50 text-sm"
      >
        Feedback
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">

            {submitted ? (
              <div className="text-center py-6">
                <p className="text-3xl mb-3">🎉</p>
                <p className="text-white font-semibold text-lg">Thank you!</p>
                <p className="text-slate-400 text-sm mt-1">Your feedback has been submitted.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-white font-semibold text-lg">Share your feedback</h2>
                  <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition text-xl leading-none">✕</button>
                </div>

                {/* Star rating */}
                <p className="text-slate-400 text-sm mb-2">How would you rate this app?</p>
                <div className="flex gap-2 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="text-3xl transition"
                    >
                      <span className={(hover || rating) >= star ? 'text-amber-400' : 'text-slate-600'}>
                        ★
                      </span>
                    </button>
                  ))}
                </div>

                {/* Message */}
                <p className="text-slate-400 text-sm mb-2">Any comments? (optional)</p>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What do you think? Any suggestions?"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition resize-none mb-5"
                />

                <button
                  onClick={handleSubmit}
                  disabled={!rating || loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
