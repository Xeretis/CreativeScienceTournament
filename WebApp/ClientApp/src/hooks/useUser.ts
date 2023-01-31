import { useApiStore } from "./../stores/apiStore";

export const useIsAuthenticated = () => {
    const isAuthenticated = useApiStore((state) => state.isAuthenticated);

    return isAuthenticated;
};