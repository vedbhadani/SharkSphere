import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminGuard = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <div className="w-12 h-12 border-4 border-purple-neon border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AdminGuard;
