import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './lib/auth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';
import AnimatedBackground from './components/AnimatedBackground';
import { useLocation as useLocationHook } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Skills = lazy(() => import('./pages/Skills'));
const Experience = lazy(() => import('./pages/Experience'));
const Projects = lazy(() => import('./pages/Projects'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-brand-400/20 border-t-brand-400 animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!session) return <Navigate to="/admin/login" replace />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocationHook();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Suspense fallback={<PageLoader />}><Home /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
          <Route path="/skills" element={<Suspense fallback={<PageLoader />}><Skills /></Suspense>} />
          <Route path="/experience" element={<Suspense fallback={<PageLoader />}><Experience /></Suspense>} />
          <Route path="/projects" element={<Suspense fallback={<PageLoader />}><Projects /></Suspense>} />
          <Route path="/services" element={<Suspense fallback={<PageLoader />}><Services /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
          <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </>
  );
}

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <AnimatedBackground />
      <div className="noise" />
      {!isAdmin && <Navbar />}
      <AppRoutes />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SmoothScroll>
          <CustomCursor />
          <AppShell />
        </SmoothScroll>
      </AuthProvider>
    </BrowserRouter>
  );
}
