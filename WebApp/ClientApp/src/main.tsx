import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

import { AppRouter } from "./routes/appRouter";
import { BrowserRouter } from "react-router-dom";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import ReactDOM from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App = () => {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: "colorScheme",
        defaultValue: "light",
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = () => {
        setColorScheme(colorScheme === "dark" ? "light" : "dark");
    };

    useHotkeys([["mod+J", () => toggleColorScheme()]]);

    const queryClient = new QueryClient();

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <QueryClientProvider client={queryClient}>
                <MantineProvider
                    theme={{
                        colorScheme,
                    }}
                    withGlobalStyles={true}
                    withNormalizeCSS={true}
                >
                    <ModalsProvider>
                        <NotificationsProvider>
                            <AppRouter />
                        </NotificationsProvider>
                    </ModalsProvider>
                </MantineProvider>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ColorSchemeProvider>
    );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
);
