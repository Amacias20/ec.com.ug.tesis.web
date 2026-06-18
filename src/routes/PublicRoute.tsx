import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { GetToken, GetUser } from 'constants/Global';
import React from 'react';

interface PublicRouteProps {
    children?: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
    const user = GetUser();
    const token = GetToken();
    const location = useLocation();
    
    if (user && token) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute; 