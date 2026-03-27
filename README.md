# 🦈 Shark Sphere - NST E-Cell Platform

A modern, full-stack platform for NST students to turn ideas into real companies. Built with structured validation, mentorship, and eligibility for StartX seed funding up to ₹1 Cr.

## ✨ Features

- **Idea Management**: Post, browse, and vote on startup ideas
- **User Authentication**: Secure JWT-based authentication
- **Admin & Moderation**: Dedicated admin panel for content moderation and platform analytics
- **Voting System**: Upvote ideas to help the best ones rise
- **User Profiles**: Track your ideas and engagement
- **Modern UI**: Premium dark theme with purple accents, built with React + TailwindCSS
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Smooth animations and transitions with Framer Motion

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **Prisma** - ORM for database management
- **MySQL** - Database (via Railway)
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Joi** - Input validation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Ecell3/
├── src/                    # Frontend source code
│   ├── api/               # API client functions
│   ├── components/        # Reusable React components
│   ├── context/           # React Context providers
│   ├── pages/             # Page components
│   ├── router/            # Route configuration
│   └── utils/             # Utility functions
├── server/                 # Backend source code
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── utils/             # Backend utilities
│   ├── config/            # Configuration files
│   └── prisma/            # Prisma schema and migrations
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL database (or use Railway/cloud database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ecell3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Frontend URL
   VITE_API_URL=https://sharkssphere-backend.onrender.com
   FRONTEND_URL=http://localhost:5173

   # Database Configuration
   DATABASE_URL="mysql://user:password@host:port/database"

   # JWT Configuration
   JWT_SECRET="your-secret-key-here"
   JWT_EXPIRE="7d"

   # Email Configuration (Gmail with App Password)
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASSWORD="your-app-password"
   ```

4. **Set up the database**
   ```bash
   cd server
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the development servers**

   **Backend** (in one terminal):
   ```bash
   npm run server:start
   ```

   **Frontend** (in another terminal):
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: https://sharksphere.onrender.com

## 📝 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run server:start` - Start backend server
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Ideas
- `GET /api/ideas` - Get all ideas
- `GET /api/ideas/:id` - Get idea by ID
- `POST /api/ideas` - Create new idea (protected)
- `PUT /api/ideas/:id` - Update idea (protected, author only)
- `DELETE /api/ideas/:id` - Delete idea (protected, author only)

### Votes
- `POST /api/ideas/:id/vote` - Toggle vote on idea (protected)

### Admin & Moderation
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/ideas` - Get ideas for moderation
- `PUT /api/admin/ideas/:id/status` - Approve/reject ideas (Admin only)
- `POST /api/admin/email` - Send manual email notifications (Admin only)

## 🎨 Design System

The platform uses a strict dark theme design system:

- **Primary Background**: `#0D0D0D`
- **Card Background**: `#151515`
- **Borders**: `#262626`
- **Heading Text**: `#FFFFFF`
- **Body Text**: `#CCCCCC`
- **Muted Text**: `#8A8A8A`
- **Accent Color**: `#7B5FFF` (Purple)

## 🚢 Deployment

### Frontend (Vercel/Render)

1. Push code to GitHub
2. Connect repository to Vercel or Render
3. Set environment variable: `VITE_API_URL=https://sharkssphere-backend.onrender.com`
4. Deploy!

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd server && npm install && npx prisma generate`
4. Set start command: `cd server && node app.js`
5. Add all environment variables from `.env`
6. Deploy!

**Important**: Make sure to update CORS settings in `server/app.js` to allow your frontend domain.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-Based Access Control (RBAC) for Admin features
- Protected routes
- Input validation with Joi
- CORS configuration
- Environment variable protection

## 📱 Pages

- **Landing Page** (`/`) - Homepage with platform overview
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration
- **Ideas** (`/dashboard`) - Browse and vote on ideas
- **Create Idea** (`/create-idea`) - Submit new startup ideas
- **Profile** (`/profile`) - User profile and submitted ideas
- **Admin Dashboard** (`/admin`) - Content moderation and platform statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and belongs to NST E-Cell.

## 👥 Contact

For questions or support, contact: ecell@nst.edu.in

---

**Built with ❤️ for NST E-Cell - Shark Sphere**
