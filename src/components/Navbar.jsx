import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Button from './Button.jsx';
import favicon from '../assets/favicon.jpeg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-50 glass-strong border-b border-border/50 relative"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group" onClick={closeMobileMenu}>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden shadow-glow-purple flex-shrink-0"
            >
              <img src={favicon} alt="NST E-Cell Logo" className="w-full h-full object-cover" />
            </motion.div>
            <div className="hidden xs:block">
              <div className="text-base sm:text-lg font-bold text-text-heading leading-tight">NST E-Cell</div>
              <div className="text-[9px] sm:text-[10px] text-purple-neon font-semibold tracking-wider uppercase leading-tight">Shark Sphere</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {user ? (
              <>
                <NavLink to="/" isActive={isActive('/')}>
                  Home
                </NavLink>
                <NavLink to="/dashboard" isActive={isActive('/dashboard')}>
                  Ideas
                </NavLink>
                <NavLink to="/create-idea" isActive={isActive('/create-idea')}>
                  Create
                </NavLink>
                <NavLink to="/profile" isActive={isActive('/profile')}>
                  Profile
                </NavLink>
                {user.role === 'ADMIN' && (
                  <NavLink to="/admin" isActive={isActive('/admin')}>
                    Admin
                  </NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 lg:px-4 py-2 text-sm font-medium text-text-body hover:text-text-heading hover:bg-bg-secondary/50 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" isActive={isActive('/login')}>
                  Login
                </NavLink>
                <Link to="/signup" className="ml-2">
                  <Button size="sm" variant="neon">Register</Button>
                </Link>
              </>
            )}
            {/* <button
              onClick={toggleTheme}
              className="ml-2 p-2 sm:p-2.5 rounded-lg hover:bg-bg-secondary/50 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-text-body" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-text-body" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-bg-secondary/50 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-text-heading" />
            ) : (
              <Menu className="w-6 h-6 text-text-heading" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] md:hidden"
              style={{ top: '64px' }}
            />
            {/* Menu Panel */}
            <motion.div
              key="menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-16 sm:top-20 right-0 bottom-0 w-72 sm:w-80 bg-bg-secondary border-l-2 border-border-light z-[110] md:hidden overflow-y-auto shadow-2xl"
              style={{
                backgroundColor: '#13131A',
                minHeight: 'calc(100vh - 64px)'
              }}
            >
              <div className="flex flex-col p-6 gap-3">
                {user ? (
                  <>
                    <MobileNavLink to="/" isActive={isActive('/')} onClick={closeMobileMenu}>
                      Home
                    </MobileNavLink>
                    <MobileNavLink to="/dashboard" isActive={isActive('/dashboard')} onClick={closeMobileMenu}>
                      Ideas
                    </MobileNavLink>
                    <MobileNavLink to="/create-idea" isActive={isActive('/create-idea')} onClick={closeMobileMenu}>
                      Create
                    </MobileNavLink>
                    <MobileNavLink to="/profile" isActive={isActive('/profile')} onClick={closeMobileMenu}>
                      Profile
                    </MobileNavLink>
                    {user.role === 'ADMIN' && (
                      <MobileNavLink to="/admin" isActive={isActive('/admin')} onClick={closeMobileMenu}>
                        Admin
                      </MobileNavLink>
                    )}
                    <button
                      onClick={handleLogout}
                      className="px-4 py-3 text-left text-sm font-medium text-text-body hover:text-text-heading hover:bg-bg-tertiary rounded-lg transition-all duration-200 mt-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavLink to="/login" isActive={isActive('/login')} onClick={closeMobileMenu}>
                      Login
                    </MobileNavLink>
                    <Link to="/signup" onClick={closeMobileMenu} className="w-full mt-2">
                      <Button variant="neon" className="w-full">Register</Button>
                    </Link>
                  </>
                )}
                <div className="pt-4 mt-4 border-t border-border-light">
                  {/* <button
                    onClick={toggleTheme}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-text-body hover:text-text-heading hover:bg-bg-tertiary rounded-lg transition-all duration-200 flex items-center gap-3"
                  >
                    {theme === 'dark' ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Light Mode
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        Dark Mode
                      </>
                    )}
                  </button> */}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavLink = ({ to, isActive, children }) => {
  return (
    <Link
      to={to}
      className={`relative px-3 lg:px-4 py-2 sm:py-2.5 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
        ? 'text-purple-neon'
        : 'text-text-body hover:text-text-heading'
        }`}
    >
      {isActive && (
        <motion.div
          layoutId="navbarTabBase"
          className="absolute inset-0 bg-bg-secondary/80 backdrop-blur-sm border border-purple-accent/30 rounded-lg -z-10 shadow-glow-purple"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </Link>
  );
};

const MobileNavLink = ({ to, isActive, onClick, children }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg ${isActive
        ? 'text-purple-neon bg-bg-tertiary border border-purple-accent/30'
        : 'text-text-body hover:text-text-heading hover:bg-bg-tertiary'
        }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
