import { Routes, Route } from 'react-router-dom';
import PublicSite from './PublicSite';
import AdminApp from './admin/AdminApp';

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<PublicSite />} />
    </Routes>
  );
}
