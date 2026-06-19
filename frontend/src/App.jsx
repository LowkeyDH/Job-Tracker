import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JobList from './pages/JobList';
import AddJob from './pages/AddJob';
import UploadResume from './pages/UploadResume';
import ResumeResult from './pages/ResumeResult';
import MatchResult from './pages/MatchResult';
import CareerMatch from './pages/CareerMatch';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/add" element={<AddJob />} />
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/resume/:id" element={<ResumeResult />} />
        <Route path="/match/:resumeId/:jobId" element={<MatchResult />} />
        <Route path="/career/:resumeId" element={<CareerMatch />} />
      </Routes>
    </BrowserRouter>
  );
}
