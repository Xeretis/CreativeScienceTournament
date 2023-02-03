import { ActionIcon, Box, Drawer, Group, SimpleGrid, Text, Title, createStyles, useMantineTheme } from "@mantine/core";

import { ContestCard } from "../../components/contestCard";
import { FullScreenLoading } from "../../components/fullScreenLoading";
import { IconFilter } from "@tabler/icons-react";
import { useGetApiAuthUser } from "../../api/client/auth/auth";
import { useGetApiContests } from "../../api/client/contests/contests";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import { useState } from "react";

const useStyles = createStyles((theme) => ({}));

const UsersPage = (): JSX.Element => {
    const contests = useGetApiContests();
    const theme = useMantineTheme();

    const [filterOpened, setFilterOpened] = useState(false);

    if (contests.isLoading) {
        return <FullScreenLoading />;
    }

    return (
        <>
            <Group position="apart" align="baseline">
                <Title mb="md">Versenyek</Title>
                <ActionIcon size="lg" onClick={() => setFilterOpened(!filterOpened)}><IconFilter size={28} color={theme.colorScheme === "dark" ? "white" : "black"} /></ActionIcon>
            </Group>
            {contests.data.length === 0 && (
                <Text color="dimmed">
                   Úgy néz ki nincs a keresésednek megfelő verseny. Gyere vissza később, hátha akkor lesz.
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
            >{contests.data.map((contest) => (
                    <ContestCard key={contest.id} contest={contest} />
                ))}</SimpleGrid>
            <Drawer
                opened={filterOpened}
                onClose={() => setFilterOpened(false)}
                title="Szűrés"
                padding="lg"
                size="lg"
                position="right"
            >
                {/* Drawer content */}
            </Drawer>
        </>
    );
};

const ContestsPage = (): JSX.Element => {
    const { classes } = useStyles();

    const user = useGetApiAuthUser();
    const isUserAdmin = useIsAdmin(user.data);

    if (user.isLoading) {
        return <FullScreenLoading />;
    }

    return isUserAdmin ? <Box /> : <UsersPage />;
};

export default ContestsPage;
