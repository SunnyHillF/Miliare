import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import BusinessPage from './pages/dashboard/BusinessPage';
import LearnPage from './pages/dashboard/LearnPage';
import ReferPage from './pages/dashboard/ReferPage';
import PartnerDetailPage from './pages/dashboard/PartnerDetailPage';
import TeamPage from './pages/dashboard/TeamPage';
import AdminPage from './pages/dashboard/AdminPage';
import { Toaster } from './components/ui/Toaster';

// Protected route component
const ProtectedRoute = ({ children, requiredGroup }: { children: React.ReactNode; requiredGroup?: string }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    requiredGroup &&
    !user?.groups?.includes(requiredGroup) &&
    !user?.groups?.includes('admin')
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<BusinessPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="refer" element={<ReferPage />} />
          <Route path="team" element={
            <ProtectedRoute requiredGroup="teamLead">
              <TeamPage />
            </ProtectedRoute>
          } />
          <Route path="admin" element={
            <ProtectedRoute requiredGroup="admin">
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="partners/:partnerId" element={<PartnerDetailPage />} />
        </Route>
        
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 404 route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
