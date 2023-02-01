import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import { FullScreenLoading } from "../components/fullScreenLoading";
import { RequireAuth } from "./helpers/requireAuth";
import { RequireNoAuth } from "./helpers/requireNoAuth";

export const AppRouter = () => {
    const IndexPage = lazy(() => import("../pages/indexPage"));
    const LoginPage = lazy(() => import("../pages/auth/loginPage"));
    const ConfirmEmailPage = lazy(() => import("../pages/auth/confirmEmail"));
    const RegisterPage = lazy(() => import("../pages/auth/registerPage"));
    const HomePage = lazy(() => import("../pages/protected/homePage"));

    return (
        <Suspense fallback={<FullScreenLoading />}>
            <Routes>
                <Route element={<RequireNoAuth />}>
                    <Route path="/" element={<IndexPage />} />
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                </Route>
                <Route element={<RequireAuth />}>
                    <Route path="/home" element={<HomePage />} />
                </Route>
                <Route path="/auth/confirmEmail" element={<ConfirmEmailPage />} />
            </Routes>
        </Suspense>
    );
};