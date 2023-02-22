import { ActionIcon, Box, Center, Drawer, Group, SimpleGrid, Text, Title, createStyles, useMantineTheme } from "@mantine/core";

import { ContestEntryCard } from "../../../components/contestEntryCard";
import { FullScreenLoading } from "../../../components/fullScreenLoading";
import { IconFilter } from "@tabler/icons-react";
import { NotFoundError } from "../../../utils/api";
import { useGetApiContestEntriesContestId } from "../../../api/client/contest-entries/contest-entries";
import { useGetApiContestsId } from "../../../api/client/contests/contests";
import { useParams } from "react-router-dom";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
    errorContainer: {
        height: "100vh",
        flexDirection: "column",
    },
}));

const ContestEntriesPage = (): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const { id } = useParams<{ id: string }>();

    const [filterOpened, setFilterOpened] = useState(false);

    const contest = useGetApiContestsId(+id);
    const contestEntries = useGetApiContestEntriesContestId(+id);

    if (contestEntries.isLoading || contest.isLoading)
        return <FullScreenLoading />;

    if (contestEntries.error || contest.error)
        return (
            <Center className={classes.errorContainer} p="xl">
                <Title color="red" align="center">
                    Hiba ({contestEntries.error instanceof NotFoundError ? "404" : contest.error instanceof NotFoundError ? "404" : contestEntries.error?.status || contest.error?.status})
                </Title>
                <Text color="red" align="center">
                    Amennyiben ez egy 404-es hiba, akkor a verseny nem létezik. Amennyiben nem, akkor kérlek próbáld újra később.
                </Text>
            </Center>
        );

    return (
        <>
            <Group position="apart" align="baseline" mb="md">
                <Title>Megoldások a(z) {contest.data.topic} versenyhez</Title>
                <ActionIcon size="lg" onClick={() => setFilterOpened(!filterOpened)}><IconFilter size={28} color={theme.colorScheme === "dark" ? "white" : "black"} /></ActionIcon>
            </Group>
            {contestEntries.data.length === 0 && (
                <Text color="dimmed">
                   Úgy néz ki nincs a keresésednek megfelő megoldás. Gyere vissza később, hátha akkor lesz.
                </Text>
            )}
            <SimpleGrid
                cols={4}
                spacing="lg"
                breakpoints={[
                    { maxWidth: 1524, cols: 3, spacing: "md" },
                    { maxWidth: 1184, cols: 2, spacing: "sm" },
                    { maxWidth: 784, cols: 1, spacing: "sm" },
                ]}
            >
                {contestEntries.data.map((contestEntry, index) => (
                    <ContestEntryCard entry={contestEntry} key={contestEntry.id} />
                ))}
            </SimpleGrid>
            <Drawer
                opened={filterOpened}
                onClose={() => setFilterOpened(false)}
                title="Szűrés"
                padding="lg"
                size="xl"
                position="right"
            >
                <Text color="dimmed">Ez a funkció hamarosan elérhető lesz</Text>
            </Drawer>
        </>
    );
};

export default ContestEntriesPage;
