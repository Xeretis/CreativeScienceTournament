import { PersistOptions, persist } from "zustand/middleware";

import { StateCreator } from "zustand";
import { UserResponse } from "../api/client/model";
import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";

export interface ApiState {
    isAuthenticated?: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

type ApiStorePersist = (config: StateCreator<ApiState>, options: PersistOptions<ApiState>) => StateCreator<ApiState>;

export const useApiStore = create<ApiState>(
    ((persist as unknown) as ApiStorePersist)(
        (set) => ({
            isAuthenticated: false,
            setIsAuthenticated: (isAuthenticated) => set((state) => ({ ...state, isAuthenticated })),
        }),
        { name: "apiStore" }
    )
);

if (process.env.NODE_ENV === "development") {
    mountStoreDevtool("ApiStore", useApiStore);
}