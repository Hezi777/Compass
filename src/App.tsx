import { Navigate, Route, Routes } from 'react-router-dom';
import Overview from './screens/Overview';
import PRs from './screens/PRs';
import Builds from './screens/Builds';
import Releases from './screens/Releases';
import Bugs from './screens/Bugs';
import Retrospect from './screens/Retrospect';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="/overview" element={<Overview />} />
      <Route path="/prs" element={<PRs />} />
      <Route path="/builds" element={<Builds />} />
      <Route path="/releases" element={<Releases />} />
      <Route path="/bugs" element={<Bugs />} />
      <Route path="/retrospect" element={<Retrospect />} />
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  );
}
