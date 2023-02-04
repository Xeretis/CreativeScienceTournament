import { Button, Center, Text, Title, createStyles } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

import { ValidationError } from "../../utils/api";
import { showNotification } from "@mantine/notifications";
import { usePostApiAuthConfirmEmail } from "../../api/client/auth/auth";
import { useSearchParams } from "react-router-dom";

const useStyles = createStyles(() => ({
    container: {
        height: "100vh",
        flexDirection: "column",
    },
}));

const ConfirmEmailPage = (): JSX.Element => {
    const { classes } = useStyles();

    const [params] = useSearchParams();

    const confirmEmail = usePostApiAuthConfirmEmail();

    const confirm = async () => {
        try {
            await confirmEmail.mutateAsync({ params: { token: encodeURIComponent(params.get("token")), userId: params.get("userId") } });
            showNotification({
                title: "Siker",
                color: "green",
                icon: <IconCheck />,
                message: "Sikeresen megerősítetted az e-mail címed!",
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                showNotification({
                    title: "Hiba",
                    color: "red",
                    icon: <IconX />,
                    message: "Hiba történt a megerősítés során. Kérlek próbáld újra egy új megerősítési kóddal.",
                });
            }
        }
    };


    if (!params.get("token") || !params.get("userId")) {
        return (<Center className={classes.container} p="xl">
            <Title color="red" align="center">Hibás megerősítési URL</Title>
            <Text color="red" align="center">Kérlek ellenőrizd az oldal URL címét, hogy biztos jó-e!</Text>
        </Center>);
    }

    return (
        <Center className={classes.container} p="xl">
            <Title align="center">E-mail megerősítése</Title>
            <Text align="center" color="dimmed">Kérlek kattints az alábbi gombra az e-mail címed megerősítéséhez!</Text>
            <Button variant="outline" mt="lg" onClick={confirm}>E-mail cím megerősítése</Button>
        </Center>
    );
};

export default ConfirmEmailPage;
