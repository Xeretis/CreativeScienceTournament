import { Button, Center, Group, Text, Title, createStyles } from "@mantine/core";
import { useDeleteApiAuthLogout, usePostApiAuthResendEmailConfirmation } from "../../api/client/auth/auth";

import { useApiStore } from "../../stores/apiStore";

const useStyles = createStyles(() => ({
    container: {
        height: "100vh",
        flexDirection: "column",
    },
}));

const UnconfirmedEmailPage = (): JSX.Element => {
    const { classes } = useStyles();

    const resendEmail = usePostApiAuthResendEmailConfirmation();

    const setIsAuthenticated = useApiStore((state) => state.setIsAuthenticated);
    const logoutMutation = useDeleteApiAuthLogout();

    const logout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } finally {
            setIsAuthenticated(false);
        }
    };

    return (
        <Center className={classes.container} p="xl">
            <Title align="center">Kérlerk erősítsd meg az e-mail címed!</Title>
            <Text align="center" color="dimmed">Az e-mail cím megerősítése kötelező, hogy elkezdhetsd az oldal használatát! Ha megvagy, gyere vissza és frissíts rá erre az oldalra!</Text>
            <Text align="center" color="dimmed">(Ha nem találod az e-mailt mindenképp nézd meg a spam mappádat is)</Text>
            <Group mt="lg">
                <Button variant="outline" onClick={async () => await resendEmail.mutateAsync({ params: {  confirmUrl: `${document.location.origin}/auth/confirmEmail` } })}>Megerősítési link újraküldése</Button>
                <Button variant="outline" color="red" onClick={logout}>Más fiók használata</Button>
            </Group>
        </Center>
    );
};

export default UnconfirmedEmailPage;
