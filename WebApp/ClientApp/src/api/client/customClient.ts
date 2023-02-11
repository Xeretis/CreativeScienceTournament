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
            let headers;
            if (data instanceof FormData) {
                headers = { Accept: "application/json" };
            } else {
                headers = { ...data?.headers, "Content-Type": "application/json", Accept: "application/json" };
            }

            const response = await fetch(`${url}?${new URLSearchParams(params)}`, {
                method: method.toUpperCase(),
                headers,
                ...(data ? { body: data instanceof FormData ? data : JSON.stringify(data) } : {}),

            });

            if (!response.ok) {
                const res = { status: response.status, data: await response.json() };
                throw res;
            }

            try {
                if (response.headers.get("Content-Type")?.includes("application/json")) {
                    return await response.json();
                }
                const a = document.createElement("a");
                const file = window.URL.createObjectURL(await response.blob());
                a.href = file;
                const header = response.headers.get("Content-Disposition");
                const parts = header!.split(";");
                const filename = parts[1].split("=")[1];
                a.download = filename;
                a.click();
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
