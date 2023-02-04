import { UserResponse } from "../api/client/model";
import { useMemo } from "react";

export const useIsTeamFull = (user?: UserResponse): boolean => {
    const isTeamFull = useMemo(() => {
        if (user?.team) {
            return user.team.members.length === 3;
        }
        return false;
    }, [user]);
    return isTeamFull;
};
