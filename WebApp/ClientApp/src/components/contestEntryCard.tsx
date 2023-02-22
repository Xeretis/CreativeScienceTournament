import { Box, Card, Group, Text, createStyles, useMantineTheme } from "@mantine/core";

import { IconChevronRight } from "@tabler/icons-react";
import { IndexContestEntriesResponse } from "../api/client/model";

const useStyles = createStyles((theme) => ({
    textContainer: {
        maxWidth: "72%",
    },
}));

export const ContestEntryCard = ({ entry }: { entry: IndexContestEntriesResponse }): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    return (
        <Card shadow="sm" p="md" radius="md" withBorder={theme.colorScheme !== "dark"}>
            <Group position="apart">
                <Box className={classes.textContainer}>
                    <Text size="xl" weight={600} truncate={true}>{entry.team.name}</Text>
                </Box>
                <IconChevronRight stroke={1.5} />
            </Group>
        </Card>
    );
};
