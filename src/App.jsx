import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Navigate, Route, Routes, useParams } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import PageSeo from './components/PageSeo';
import { getServiceSeoPath } from './lib/serviceSeoRoutes';

const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminProjects = lazy(() => import('./pages/AdminProjects'));
const AdminReviews = lazy(() => import('./pages/AdminReviews'));
const AdminServicePhotos = lazy(() => import('./pages/AdminServicePhotos'));
const AdminBackup = lazy(() => import('./pages/AdminBackup'));
const AdminRbPro = lazy(() => import('./pages/AdminRbPro'));
const AdminHome = lazy(() => import('./pages/AdminHome'));
const Documentation = lazy(() => import('./pages/Documentation'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));

const PageLoader = () => (
  <div className="flex min-h-[45vh] items-center justify-center" role="status" aria-live="polite">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
    <span className="sr-only">Загрузка страницы</span>
  </div>
);

const LegacyCategoryRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={getServiceSeoPath(slug)} replace />;
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
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceSlug" element={<Services />} />
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
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/rb-pro" element={<AdminRbPro />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/service-photos" element={<AdminServicePhotos />} />
          <Route path="/admin/backup" element={<AdminBackup />} />
          <Route path="/category/:slug" element={<LegacyCategoryRedirect />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
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
