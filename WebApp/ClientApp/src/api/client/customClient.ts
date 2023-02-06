import { handleApiErrors } from "./../../utils/api";
import { useApiStore } from "../../stores/apiStore";

type CustomClient<T> = (data: {
    url: string;
    method: "get" | "post" | "put" | "delete" | "patch";
    params?: Record<string, any>;
    headers?: Record<string, any>;
    data?: BodyType<any>;
    signal?: AbortSignal;
}) => Promise<T>;

export const useCustomClient = <T>(): CustomClient<T> => {
    return async ({ url, method, params, data }) => {
        try {
            const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
                method: method.toUpperCase(),
                headers: { ...data?.headers, Accept: "application/json" },
                ...(data ? { body: data instanceof FormData ? data : JSON.stringify(data) } : {}),

            });

            if (!response.ok) {
                const res = { status: response.status, data: await response.json() };
                throw res;
            }

            try {
                return await response.json();
            } catch (error) {
                return;
            }
        } catch (error) {
            if (error.status === 401) {
                useApiStore.setState({ isAuthenticated: false });
            }
            handleApiErrors(error);
            throw error;
        }
    };
};

export default useCustomClient;

export type ErrorType<ErrorData> = ErrorData;

export type BodyType<BodyData> = BodyData & { headers?: any };
