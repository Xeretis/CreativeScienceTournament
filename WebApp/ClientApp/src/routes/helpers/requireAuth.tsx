import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useIsAuthenticated } from "../../hooks/useUser";

export const RequireAuth = ({ redirect }: { redirect?: string }) => {
    const user = useIsAuthenticated();
    const location = useLocation();

    return user ? <Outlet /> : <Navigate to={redirect ?? "/auth/login"} state={{ from: location }} replace={true} />;
};