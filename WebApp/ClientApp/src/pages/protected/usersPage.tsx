import { ActionIcon, Box, Drawer, Group, SimpleGrid, Text, Title, createStyles, useMantineTheme } from "@mantine/core";

import { FullScreenLoading } from "../../components/fullScreenLoading";
import { IconFilter } from "@tabler/icons-react";
import { UserCard } from "../../components/userCard";
import { useGetApiAuthUser } from "../../api/client/auth/auth";
import { useGetApiUsers } from "../../api/client/users/users";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import { useState } from "react";

const useStyles = createStyles((theme) => ({}));

const UsersPage = (): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const user = useGetApiAuthUser();
    const users = useGetApiUsers({ Sorts: "UserName" });

    const isAdmin = useIsAdmin(user.data);

    const [filterOpened, setFilterOpened] = useState(false);

    if (users.isLoading || user.isLoading) {
        return <FullScreenLoading />;
    }

    return (
        <>
            <Group position="apart" align="baseline" mb="md">
                <Title>Felhasználók</Title>
                <ActionIcon size="lg" onClick={() => setFilterOpened(!filterOpened)}><IconFilter size={28} color={theme.colorScheme === "dark" ? "white" : "black"} /></ActionIcon>
            </Group>
            {users.data.length === 0 && (
                <Text color="dimmed">
                   Úgy néz ki nincs a keresésednek megfelő felhasználó. Gyere vissza később, hátha akkor lesz.
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
                {users.data.map((user, index) => (
                    <UserCard key={user.id} user={user} adminControls={isAdmin} usersKey={users.queryKey} />
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

export default UsersPage;
