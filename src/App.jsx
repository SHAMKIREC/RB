import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Calculator from './pages/Calculator';
import Reviews from './pages/Reviews';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import AdminOrders from './pages/AdminOrders';
import AdminProjects from './pages/AdminProjects';
import AdminReviews from './pages/AdminReviews';
import AdminServicePhotos from './pages/AdminServicePhotos';
import AdminBackup from './pages/AdminBackup';
import Documentation from './pages/Documentation';
import About from './pages/About';
import ScrollToTop from './components/ScrollToTop';
import PageSeo from './components/PageSeo';
import Privacy from './pages/Privacy';

const LegacyCategoryRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/services?category=${slug}`} replace />;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/about" element={<About />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/reviews/new" element={<Navigate to="/reviews" replace />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetail />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/service-photos" element={<AdminServicePhotos />} />
        <Route path="/admin/backup" element={<AdminBackup />} />
        <Route path="/category/:slug" element={<LegacyCategoryRedirect />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <PageSeo />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
