import { Box, Button, Card, Group, Text, createStyles, useMantineTheme } from "@mantine/core";
import { IconCheck, IconChevronRight } from "@tabler/icons-react";

import { IndexContestEntriesResponse } from "../api/client/model";
import { openModal } from "@mantine/modals";
import { useGetApiContestEntriesIdSolution } from "../api/client/contest-entries/contest-entries";

const useStyles = createStyles((theme) => ({
    card: {
        cursor: "pointer",
    },
    textContainer: {
        maxWidth: "72%",
    },
}));

const ViewContestEntryModalContent = ({ entry }: { entry: IndexContestEntriesResponse }): JSX.Element => {
    const { classes } = useStyles();

    const downloadSloution = useGetApiContestEntriesIdSolution(entry.id, { query: { enabled: false } });

    const downloadSolutionFile = () => {
        downloadSloution.refetch();
        downloadSloution.remove();
    };

    return (
        <>
            <Group position="apart" mb="sm">
                <Text>Csapat: </Text>
                <Text weight={600}>{entry.team.name}</Text>
            </Group>
            <Button fullWidth={true} variant="outline" onClick={downloadSolutionFile}>Megoldás letöltése</Button>
        </>
    );
};

export const ContestEntryCard = ({ entry }: { entry: IndexContestEntriesResponse }): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const openViewContestEntryModal = () => {
        openModal({
            title: "Megoldás megtekintése",
            size: "lg",
            children: <ViewContestEntryModalContent entry={entry} />,
        });
    };

    return (
        <Card onClick={openViewContestEntryModal} shadow="sm" p="md" radius="md" withBorder={theme.colorScheme !== "dark"} className={classes.card}>
            <Group position="apart">
                <Box className={classes.textContainer}>
                    <Text size="xl" weight={600} truncate={true}>{entry.team.name}</Text>
                </Box>
                <Group>
                    {entry.correction && <IconCheck stroke={1.5} />}
                    <IconChevronRight stroke={1.5} />
                </Group>
            </Group>
        </Card>
    );
};
