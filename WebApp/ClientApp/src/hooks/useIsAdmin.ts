import { UserResponse } from "./../api/client/model/userResponse";
import { isAdmin } from "../utils/user";
import { useMemo } from "react";

export const useIsAdmin = (user?: UserResponse): boolean => {
    const isUserAdmin = useMemo(() => {
        if (user) {
            return isAdmin(user);
        }
        return false;
    }, [user]);
    return isUserAdmin;
};
