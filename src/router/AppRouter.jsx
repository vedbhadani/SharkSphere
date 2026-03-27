import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import Navbar from '../components/Navbar.jsx';
import Landing from '../pages/Landing.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import CreateIdea from '../pages/CreateIdea.jsx';
import Profile from '../pages/Profile.jsx';
import AdminGuard from '../components/AdminGuard.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-idea"
          element={
            <PrivateRoute>
              <CreateIdea />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const RouterContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-heading flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-purple-DEFAULT border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-text-body font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <AnimatedRoutes />
    </>
  );
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  );
};

export default AppRouter;

