import { Box, Card, Group, Text, createStyles, useMantineTheme } from "@mantine/core";

import { IconMedal } from "@tabler/icons-react";
import { IndexTeamsResponse } from "../api/client/model";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
    textContainer: {
        maxWidth: "72%",
    },
}));

export const TeamCard = ({ team, medal }: { team: IndexTeamsResponse, medal: boolean }): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    return (
        <Card component={Link} to={`/team/${team.id}`} shadow="sm" p="md" radius="md" withBorder={theme.colorScheme !== "dark"}>
            <Group position="apart">
                <Box className={classes.textContainer}>
                    <Text size="xl" weight={600} truncate={true}>{team.name}</Text>
                </Box>
                <Group spacing="xs">
                    <Text component="span">{team.points}</Text>
                    {medal && <IconMedal />}
                </Group>
            </Group>
        </Card>
    );
};
