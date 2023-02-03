import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import { FullScreenLoading } from "../components/fullScreenLoading";
import { RequireAuth } from "./helpers/requireAuth";
import { RequireConfirmedEmail } from "./helpers/requireConfirmedEmail";
import { RequireNoAuth } from "./helpers/requireNoAuth";
import { RequireUnconfirmedEmail } from "./helpers/requireUnconfirmedEmail";

export const AppRouter = () => {
    const ProtectedLayout = lazy(() => import("./layouts/protectedLayout"));

    const IndexPage = lazy(() => import("../pages/indexPage"));
    const LoginPage = lazy(() => import("../pages/auth/loginPage"));
    const ConfirmEmailPage = lazy(() => import("../pages/auth/confirmEmailPage"));
    const UnconfirmedEmailPage = lazy(() => import("../pages/auth/unconfirmedEmailPage"));
    const RegisterPage = lazy(() => import("../pages/auth/registerPage"));
    const HomePage = lazy(() => import("../pages/protected/homePage"));
    const ContestsPage = lazy(() => import("../pages/protected/contestsPage"));

    return (
        <Suspense fallback={<FullScreenLoading />}>
            <Routes>
                <Route element={<RequireNoAuth />}>
                    <Route path="/" element={<IndexPage />} />
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                </Route>
                <Route element={<RequireAuth />}>
                    <Route element={<RequireConfirmedEmail />}>
                        <Route element={<ProtectedLayout />}>
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/contests" element={<ContestsPage />} />
                        </Route>
                    </Route>
                    <Route element={<RequireUnconfirmedEmail />}>
                        <Route path="/auth/unconfirmedEmail" element={<UnconfirmedEmailPage />} />
                    </Route>
                </Route>
                <Route path="/auth/confirmEmail" element={<ConfirmEmailPage />} />
            </Routes>
        </Suspense>
    );
};
