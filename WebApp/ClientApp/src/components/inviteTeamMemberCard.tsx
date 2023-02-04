import { Box, Button, Card, Group, LoadingOverlay, Select, Text, createStyles } from "@mantine/core";
import { IconCheck, IconUserPlus } from "@tabler/icons-react";
import { closeAllModals, openModal } from "@mantine/modals";
import { useEffect, useState } from "react";

import { showNotification } from "@mantine/notifications";
import { useDebouncedValue } from "@mantine/hooks";
import { useGetApiUsers } from "../api/client/users/users";
import { usePostApiTeamsInviteUserId } from "../api/client/teams/teams";

const useStyles = createStyles((theme) => ({
    card: {
        border: `1px dashed ${theme.colorScheme  === "dark" ? theme.colors.dark[0] : theme.colors.dark[9]}`,
        backgroundColor: "transparent !important",
        cursor: "pointer",
    }
}));

const InviteMemberModalContent = (): JSX.Element => {
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch] = useDebouncedValue(search, 300);

    const [value, setValue] = useState<string>(null);
    const [error, setError] = useState<string>(null);

    const users = useGetApiUsers({ Filters: `UserName@=*${search}` }, { query: { enabled: false, initialData: [] } });

    const inviteUser = usePostApiTeamsInviteUserId();

    const usersData = users.data.map((user) => ({
        label: user.userName,
        value: user.id,
    }));

    useEffect(() => {
        if (debouncedSearch !== "" && search !== "" && !value) {
            users.refetch();
        }
    }, [debouncedSearch]);

    const invite = async () => {
        if (!value) {
            setError("Kötelező felhasználót választani");
            return;
        }
        setError(null);
        try {
            await inviteUser.mutateAsync({ userId: value, params: { inviteUrl: `${document.location.origin}/invite` } });
            showNotification({
                title: "Siker",
                color: "green",
                icon: <IconCheck />,
                message: "A meghítót már el is küldtük e-mailben!",
            });
            closeAllModals();
        } catch (e) {
            // ignore
        }
    };

    return (
        <Box>
            <LoadingOverlay visible={users.isLoading} />
            <Select error={error} data={usersData} value={value} onChange={setValue} searchable={true} searchValue={search} onSearchChange={setSearch} nothingFound="Nincs találat" mb="sm" clearable={true} />
            <Button fullWidth={true} onClick={invite}>Meghívás</Button>
        </Box>
    );
};

export const InviteTeamMemberCard = (): JSX.Element => {
    const { classes } = useStyles();

    const openInviteMemberModal = () => {
        openModal({
            title: "Csapattag meghívása",
            size: "lg",
            children: <InviteMemberModalContent />
        });
    };

    return (
        <Card onClick={openInviteMemberModal} p="md" radius="md" className={classes.card}>
            <Group position="apart">
                <Text size="xl" weight={600} truncate={true}>Tag meghívása</Text>
                <IconUserPlus />
            </Group>
        </Card>
    );
};
