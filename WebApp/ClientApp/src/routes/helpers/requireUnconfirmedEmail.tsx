import { Navigate, Outlet, useLocation } from "react-router-dom";

import { FullScreenLoading } from "../../components/fullScreenLoading";
import { useGetApiAuthUser } from "../../api/client/auth/auth";

export const RequireUnconfirmedEmail = ({ redirect }: { redirect?: string }) => {
    const user = useGetApiAuthUser();
    const location = useLocation();

    if (user.isLoading) {
        return <FullScreenLoading />;
    }

    if (user.isError) {
        return <Navigate to={redirect ?? "/home"} state={{ from: location }} replace={true} />;
    }

    return user.data.emailConfirmed ? <Navigate to={redirect ?? "/home"} state={{ from: location }} replace={true} /> : <Outlet />;
};