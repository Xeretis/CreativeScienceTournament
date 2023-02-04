import { Box, Button, Center, Text, Title, createStyles } from "@mantine/core";

import { IconCheck } from "@tabler/icons-react";
import { NotFoundError } from "../utils/api";
import { showNotification } from "@mantine/notifications";
import { usePostApiTeamsJoin } from "../api/client/teams/teams";
import { useSearchParams } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    container: {
        height: "100vh",
        flexDirection: "column",
    },
}));

const JoinTeamPage = (): JSX.Element => {
    const { classes } = useStyles();

    const [params] = useSearchParams();

    const joinTeam = usePostApiTeamsJoin();

    const join = async () => {
        try {
            await joinTeam.mutateAsync({ params: { token: encodeURIComponent(params.get("token")) } });
            showNotification({
                title: "Siker",
                color: "green",
                icon: <IconCheck />,
                message: "Sikeresen elfogadtad a meghívót!",
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                showNotification({
                    title: "Hiba (404)",
                    color: "red",
                    message: "A csapat vagy a felhasználó akire a meghívó vonatkozik már nem létezik.",
                });
            }
        }
    };

    if (!params.get("token")) {
        return (<Center className={classes.container} p="xl">
            <Title color="red" align="center">Hibás meghívó URL</Title>
            <Text color="red" align="center">Kérlek ellenőrizd az oldal URL címét, hogy biztos jó-e!</Text>
        </Center>);
    }

    return (
        <Center className={classes.container} p="xl">
            <Title align="center">Meghívó elfogadása</Title>
            <Text align="center" color="dimmed">Kérlek kattints az alábbi gombra a meghívó elfogadásához!</Text>
            <Button variant="outline" mt="lg" onClick={join}>Meghívó elfogadása</Button>
        </Center>
    );
};

export default JoinTeamPage;
