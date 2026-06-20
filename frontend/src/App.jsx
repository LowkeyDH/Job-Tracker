import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import JobList from './pages/JobList';
import AddJob from './pages/AddJob';
import UploadResume from './pages/UploadResume';
import ResumeResult from './pages/ResumeResult';
import MatchResult from './pages/MatchResult';
import CareerMatch from './pages/CareerMatch';
import ATSAnalyzer from './pages/ATSAnalyzer';
import JobSearch from './pages/JobSearch';
import AdminFeedback from './pages/AdminFeedback';
import Login from './pages/Login';
import FeedbackButton from './components/FeedbackButton';

function PrivateRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuth } = useAuth();
  return (
    <>
      <Routes>
        <Route path="/login" element={isAuth ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<PrivateRoute><JobList /></PrivateRoute>} />
        <Route path="/add" element={<PrivateRoute><AddJob /></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><UploadResume /></PrivateRoute>} />
        <Route path="/resume/:id" element={<PrivateRoute><ResumeResult /></PrivateRoute>} />
        <Route path="/match/:resumeId/:jobId" element={<PrivateRoute><MatchResult /></PrivateRoute>} />
        <Route path="/career/:resumeId" element={<PrivateRoute><CareerMatch /></PrivateRoute>} />
        <Route path="/ats/:resumeId" element={<PrivateRoute><ATSAnalyzer /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><JobSearch /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminFeedback /></PrivateRoute>} />
      </Routes>
      {isAuth && <FeedbackButton />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
