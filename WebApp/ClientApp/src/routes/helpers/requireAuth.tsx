import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useIsAuthenticated } from "../../hooks/useIsAuthenticated";

export const RequireAuth = ({ redirect }: { redirect?: string }) => {
    const isAuthenticated = useIsAuthenticated();
    const location = useLocation();

    return isAuthenticated ? <Outlet /> : <Navigate to={redirect ?? "/auth/login"} state={{ from: location }} replace={true} />;
};
