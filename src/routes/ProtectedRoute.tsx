import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { GetToken, GetUser } from 'constants/Global';
import React, { useEffect } from 'react';

interface ProtectedRouteProps {
    children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = GetUser();
    const token = GetToken();
    const location = useLocation();

    useEffect(() => {
        if (!user || !token) {
            localStorage.clear();
        }
    }, [user, token]);

    if (!user || !token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;