import { ActionIcon, Box, Drawer, Group, SimpleGrid, Text, Title, createStyles, useMantineTheme } from "@mantine/core";

import { FullScreenLoading } from "../../components/fullScreenLoading";
import { IconFilter } from "@tabler/icons-react";
import { TeamCard } from "../../components/teamCard";
import { useGetApiTeams } from "../../api/client/teams/teams";
import { useState } from "react";

const useStyles = createStyles((theme) => ({}));

const TeamsPage = (): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const [filterOpened, setFilterOpened] = useState(false);

    const teams = useGetApiTeams({ Sorts: "-Points" });

    if (teams.isLoading) {
        return <FullScreenLoading />;
    }

    return (
        <>
            <Group position="apart" align="baseline" mb="md">
                <Title>Csapatok</Title>
                <ActionIcon size="lg" onClick={() => setFilterOpened(!filterOpened)}><IconFilter size={28} color={theme.colorScheme === "dark" ? "white" : "black"} /></ActionIcon>
            </Group>
            <SimpleGrid
                cols={4}
                spacing="lg"
                breakpoints={[
                    { maxWidth: 1524, cols: 3, spacing: "md" },
                    { maxWidth: 1184, cols: 2, spacing: "sm" },
                    { maxWidth: 784, cols: 1, spacing: "sm" },
                ]}
            >
                {teams.data.map((team, index) => (
                    <TeamCard key={team.id} team={team} medal={index < 3} />
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
        </>);
};

export default TeamsPage;
