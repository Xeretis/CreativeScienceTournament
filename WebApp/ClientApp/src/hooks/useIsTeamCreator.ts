import { UserResponse } from "../api/client/model";
import { useMemo } from "react";

export const useIsTeamCreator = (user?: UserResponse): boolean => {
    const isTeamCreator = useMemo(() => {
        if (user?.team) {
            return user.team.creatorId === user.id;
        }
        return false;
    }, [user]);
    return isTeamCreator;
};
