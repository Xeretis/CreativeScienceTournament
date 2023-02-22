import { Navigate, Outlet, useLocation } from "react-router-dom";

import { FullScreenLoading } from "../../components/fullScreenLoading";
import { useGetApiAuthUser } from "../../api/client/auth/auth";
import { useIsAdmin } from "../../hooks/useIsAdmin";

export const RequireAdmin = ({ redirect }: { redirect?: string }) => {
    const user = useGetApiAuthUser();
    const location = useLocation();
    const isAdmin = useIsAdmin(user.data);

    if (user.isLoading) {
        return <FullScreenLoading />;
    }

    if (user.isError) {
        return <Navigate to={redirect ?? "/auth/login"} state={{ from: location }} replace={true} />;
    }

    return isAdmin ? <Outlet /> : <Navigate to={redirect ?? "/home"} state={{ from: location }} replace={true} />;
};
