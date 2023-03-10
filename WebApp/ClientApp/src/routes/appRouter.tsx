import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

import { FullScreenLoading } from "../components/fullScreenLoading";
import { RequireAdmin } from "./helpers/requireAdmin";
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
    const JoinTeamPage = lazy(() => import("../pages/joinTeamPage"));
    const HomePage = lazy(() => import("../pages/protected/homePage"));
    const ContestsPage = lazy(() => import("../pages/protected/contestsPage"));
    const TeamsPage = lazy(() => import("../pages/protected/teamsPage"));
    const TeamPage = lazy(() => import("../pages/protected/teamPage"));
    const UsersPage = lazy(() => import("../pages/protected/usersPage"));
    const ContestEntriesPage = lazy(() => import("../pages/protected/admin/contestEntriesPage"));

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
                            <Route path="/teams" element={<TeamsPage />} />
                            <Route path="/team/:teamId" element={<TeamPage />} />
                            <Route path="/users" element={<UsersPage />} />
                            <Route element={<RequireAdmin />}>
                                <Route path="/contest/:id/entries" element={<ContestEntriesPage />} />
                            </Route>
                        </Route>
                    </Route>
                    <Route element={<RequireUnconfirmedEmail />}>
                        <Route path="/auth/unconfirmedEmail" element={<UnconfirmedEmailPage />} />
                    </Route>
                </Route>
                <Route path="/auth/confirmEmail" element={<ConfirmEmailPage />} />
                <Route path="/joinTeam" element={<JoinTeamPage />} />
            </Routes>
        </Suspense>
    );
};
