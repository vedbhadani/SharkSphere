import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { register as registerApi } from '../api/auth.js';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import favicon from '../assets/favicon.jpeg';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Frontend validation
    /*
    if (!email.endsWith('@adypu.edu.in')) {
      setError('Email must be from @adypu.edu.in domain');
      setLoading(false);
      return;
    }
    */

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      setLoading(false);
      return;
    }

    try {
      const response = await registerApi(email, password, name);
      if (response.success) {
        setSuccess(response.message || 'Registration successful!'); // Commented out email verification message
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response data:', err.response?.data);

      // Handle timeout/network errors
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        const isProduction = !import.meta.env.DEV;
        if (isProduction) {
          setError('The backend server is taking too long to respond. This might be because it\'s waking up from sleep (Render free tier). Please wait a moment and try again. The first request after inactivity can take up to 60 seconds.');
        } else {
          setError('Connection timeout. The backend server may not be running or is taking too long to respond. Please check if the server is running at https://sharksphere.onrender.com and try again.');
        }
      } else if (err.response?.status === 400) {
        // 400 Bad Request - usually validation errors
        const errorData = err.response?.data;

        if (errorData?.errors && Array.isArray(errorData.errors)) {
          // Backend validation errors array
          setError(errorData.errors.join('. '));
        } else if (errorData?.errors && typeof errorData.errors === 'string') {
          // Single error string
          setError(errorData.errors);
        } else if (errorData?.message) {
          // Error message
          setError(errorData.message);
        } else if (errorData?.error) {
          // Error field
          setError(Array.isArray(errorData.error) ? errorData.error.join('. ') : String(errorData.error));
        } else {
          // Fallback for 400 errors
          setError('Validation failed. Please check your input: Email must be from @adypu.edu.in domain, password must be at least 8 characters with uppercase, lowercase, and a number.');
        }
      } else if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Show validation errors from backend
        setError(err.response.data.errors.join('. '));
      } else if (err.response?.data?.message) {
        // Show error message from backend
        setError(err.response.data.message);
      } else if (err.response?.data) {
        // Try to extract any error information
        const errorData = err.response.data;
        if (errorData.errors) {
          setError(Array.isArray(errorData.errors) ? errorData.errors.join('. ') : String(errorData.errors));
        } else {
          setError(errorData.message || 'Registration failed. Please check your input and try again.');
        }
      } else {
        setError('Registration failed. Please check if the backend server is running and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-20 sm:pt-24 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-purple-DEFAULT/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-purple-neon/10 rounded-full blur-3xl"
        />
        <div className="bg-dots-soft" />
        <div className="bg-circuits" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shadow-glow-neon flex-shrink-0"
            >
              <img src={favicon} alt="NST E-Cell Logo" className="w-full h-full object-cover" />
            </motion.div>
            <div className="text-left">
              <div className="text-xl sm:text-2xl font-bold text-text-heading">NST E-Cell</div>
              <div className="text-[10px] sm:text-xs text-purple-neon font-semibold tracking-wider uppercase">Shark Sphere</div>
            </div>
          </div>
          <h1 className="text-h1 font-bold mb-2 sm:mb-3 text-text-heading">Create Account</h1>
          <p className="text-body sm:text-body-lg text-text-body">Start your entrepreneurial journey today</p>
        </div>

        <Card glass hover={false} className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm"
              >
                {success}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={50}
              pattern="[a-zA-Z\s]+"
              placeholder="John Doe"
              helperText="2-50 characters, letters and spaces only"
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              helperText="ADYPU domain restricted (Disabled for testing)"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Create a strong password"
              helperText="Minimum 8 characters with uppercase, lowercase, and number"
            />

            <Button type="submit" loading={loading} variant="neon" className="w-full">
              Sign Up
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-text-body">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-neon hover:text-purple-accent font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
