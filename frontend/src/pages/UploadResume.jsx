import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume } from '../api/resume';

export default function UploadResume() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const res = await uploadResume(file);
      navigate(`/resume/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-8 flex items-center justify-center">
      <div className="w-full max-w-lg">

        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white text-sm flex items-center gap-1 mb-6 transition">
          ← Back to list
        </button>

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Resume Agent
        </h1>
        <p className="text-slate-400 text-sm mb-8">Upload your resume and let AI extract your skills, experience, and education.</p>

        <form onSubmit={handleSubmit}>
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current.click()}
            className="border-2 border-dashed border-purple-500/40 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-400/70 hover:bg-white/5 transition mb-6"
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {file ? (
              <div>
                <p className="text-2xl mb-2">📄</p>
                <p className="text-white font-semibold">{file.name}</p>
                <p className="text-slate-400 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-3">⬆️</p>
                <p className="text-slate-300 font-medium">Drop your resume here</p>
                <p className="text-slate-500 text-sm mt-1">or click to browse — .pdf, .docx</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing with AI...' : 'Analyze Resume'}
          </button>
        </form>
      </div>
    </div>
  );
}
