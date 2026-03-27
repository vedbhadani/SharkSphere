import axios from 'axios';

// In development, use Vite proxy to avoid CORS issues
// In production, use VITE_API_URL if set
const getBaseURL = () => {
  // Check if we're in development mode
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  if (isDev) {
    // Development: use Vite proxy to localhost:3000
    return '/api';
  }
  // Production: use environment variable or default
  const apiUrl = import.meta.env.VITE_API_URL || 'https://sharksphere-myqq.onrender.com';
  const baseURL = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
  return baseURL;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout for production (Render free tier can be slow to wake up)
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug logging (always log in production for troubleshooting)
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      env: import.meta.env.MODE,
      isDev: import.meta.env.DEV
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Retry logic for timeout errors in production (Render free tier cold starts)
    if (error.code === 'ECONNABORTED' && !import.meta.env.DEV && error.config) {
      error.config.__retryCount = error.config.__retryCount || 0;
      const maxRetries = 1; // Retry once

      if (error.config.__retryCount < maxRetries) {
        error.config.__retryCount += 1;
        console.log(`Retrying request (attempt ${error.config.__retryCount}/${maxRetries})...`);
        // Wait 3 seconds before retry to give backend time to wake up
        await new Promise(resolve => setTimeout(resolve, 3000));
        return api.request(error.config);
      }
    }

    // Log errors (always log in production for troubleshooting, skip timeout in dev)
    if (error.code !== 'ECONNABORTED' || !import.meta.env.DEV) {
      console.error('API Error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          fullURL: `${error.config?.baseURL}${error.config?.url}`,
        },
        env: import.meta.env.MODE,
        isDev: import.meta.env.DEV
      });
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

