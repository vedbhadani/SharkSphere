import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/authRoutes.js';
import ideaRoutes from './routes/ideaRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config({ path: '../.env' });

// CORS configuration - Allow requests from frontend domains
// const allowedOrigins = [
//   'http://localhost:5173', // Local frontend
//   'https://sharksphere.onrender.com', // Local backend
// ];
// by gpt
const allowedOrigins = ["http://localhost:5173",
  "https://shark-sphere-phi.vercel.app"
];


app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin matches any allowed origin (string or regex)
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', router);
app.use('/api/ideas', ideaRoutes);
app.use('/api/ideas', voteRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Entrepreneurship Club API is running!' });
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});