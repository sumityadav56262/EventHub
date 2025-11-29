import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect to their appropriate dashboard if they try to access a route not for them
        if (user?.role === 'student') return <Navigate to="/student/dashboard" replace />;
        if (user?.role === 'club') return <Navigate to="/club/dashboard" replace />;
        if (user?.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;

        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
