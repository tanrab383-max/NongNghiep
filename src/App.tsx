import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import PricePrediction from './pages/PricePrediction';
import DiseaseDetection from './pages/DiseaseDetection';
import Chat from './pages/Chat';
import Subscription from './pages/Subscription';
import Admin from './pages/Admin';

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, token, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
  </div>;
  if (!token) return <Navigate to="/auth" />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
}

function AppContent() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/prices" element={<PrivateRoute><PricePrediction /></PrivateRoute>} />
          <Route path="/disease" element={<PrivateRoute><DiseaseDetection /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><Admin /></PrivateRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
