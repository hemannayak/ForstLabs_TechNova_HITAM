import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('user' | 'admin')[];
    redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles = ['user', 'admin'],
    redirectPath = '/login'
}) => {
    const { currentUser, isAuthenticated } = useApp();
    const location = useLocation();

    if (!isAuthenticated || !currentUser) {
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    const userRole = currentUser.isAdmin ? 'admin' : 'user';

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />; // Redirect to home if unauthorized
    }

    return <>{children}</>;
};

export default ProtectedRoute;
