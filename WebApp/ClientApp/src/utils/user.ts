import { UserResponse } from "../api/client/model";

export const isAdmin = (user: UserResponse): boolean => {
    if (user.roles.includes("Admin")) {
        return true;
    }
    return false;
};
