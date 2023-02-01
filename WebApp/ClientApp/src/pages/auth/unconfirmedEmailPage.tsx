import { Box, Button, Center, Text, Title, createStyles } from "@mantine/core";

import { usePostApiAuthResendEmailConfirmation } from "../../api/client/auth/auth";

const useStyles = createStyles((theme) => ({
    container: {
        height: "100vh",
        flexDirection: "column",
    },
}));

const UnconfirmedEmailPage = (): JSX.Element => {
    const { classes } = useStyles();

    const resendEmail = usePostApiAuthResendEmailConfirmation();

    return (
        <Center className={classes.container} p="xl">
            <Title align="center">Kérlerk erősítsd meg az e-mail címed!</Title>
            <Text align="center" color="dimmed">Az e-mail cím megerősítése kötelező, hogy elkezdhetsd az oldal használatást! Ha megvagy, gyere vissza és frissíts rá erre az oldalra!</Text>
            <Button variant="outline" mt="lg" onClick={async () => await resendEmail.mutateAsync({ params: {  confirmUrl: document.location.origin + "/auth/confirmEmail" } })}>Megerősítési link újraküldése</Button>
        </Center>
    );
}

export default UnconfirmedEmailPage;