import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useIsAuthenticated } from "../../hooks/useUser";

export const RequireNoAuth = ({ redirect }: { redirect?: string }) => {
    const isAuthenticated = useIsAuthenticated();
    const location = useLocation();

    return isAuthenticated ? <Navigate to={redirect ?? "/home"} state={{ from: location }} replace={true} /> : <Outlet />;
};