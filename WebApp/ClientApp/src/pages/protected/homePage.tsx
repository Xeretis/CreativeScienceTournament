import { Box, Button, Center, Group, Paper, SimpleGrid, Stack, Text, TextInput, Title, createStyles, useMantineTheme } from "@mantine/core";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { closeAllModals, openConfirmModal, openModal } from "@mantine/modals";
import { useDeleteApiTeamsId, usePostApiTeams, usePostApiTeamsLeave } from "../../api/client/teams/teams";
import { useEffect, useState } from "react";

import { CreateTeamRequest } from "../../api/client/model";
import { FullScreenLoading } from "../../components/fullScreenLoading";
import { InviteTeamMemberCard } from "../../components/inviteTeamMemberCard";
import { JoinedContestCard } from "../../components/joinedContestCard";
import { Link } from "react-router-dom";
import { TeamMemberCard } from "../../components/teamMemberCard";
import { ValidationError } from "../../utils/api";
import { camelize } from "../../utils/string";
import { useForm } from "@mantine/form";
import { useGetApiAuthUser } from "../../api/client/auth/auth";
import { useGetApiContests } from "../../api/client/contests/contests";
import { useIsTeamCreator } from "../../hooks/useIsTeamCreator";

const useStyles = createStyles((theme) => ({
    grid: {
        minHeight: "100%",
    },
    emptyXContainer: {
        height: "100%",
        flexDirection: "column",
    },
    pointsContainer: {
        width: "100%",
    },
    sectionContainer: {
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        flex: 1,
    },
}));

const CreateTeamModalContent = ({ userKey }: { userKey: QueryKey }): JSX.Element => {
    const queryClient = useQueryClient();

    const createTeam = usePostApiTeams();

    const form = useForm<CreateTeamRequest>({
        initialValues: {
            name: "",
        },
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await createTeam.mutateAsync({ data: values });
            queryClient.invalidateQueries(userKey);
            closeAllModals();
        } catch (error) {
            if (error instanceof ValidationError) {
                handleValidationErrors(error);
            }
        }
    });

    const handleValidationErrors = (error: ValidationError) => {
        for (const validationError in error.errors) {
            let message = "";
            for (const err of error.errors[validationError]) {
                message += `${err}\n`;
            }
            form.setFieldError(camelize(validationError), message);
        }
    };

    return (
        <form onSubmit={submit}>
            <TextInput label="Csapatnév" {...form.getInputProps("name")} mb="sm" />
            <Button type="submit" fullWidth={true}>
                Létrehozás
            </Button>
        </form>
    );
};

const HomePage = (): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const queryClient = useQueryClient();

    const user = useGetApiAuthUser();
    const joinedContests = useGetApiContests({ Filters: `JoinedBy==${user.data?.team?.id ?? 0}` });

    const leaveTeam = usePostApiTeamsLeave();
    const deleteTeam = useDeleteApiTeamsId();

    const isTeamCreator = useIsTeamCreator(user.data);

    const [fetchedJoinedContests, setFetchedJoinedContests] = useState(false);

    useEffect(() => {
        if (user.data && !fetchedJoinedContests) {
            joinedContests.refetch();
            setFetchedJoinedContests(true);
        }
    }, [user, joinedContests, fetchedJoinedContests]);

    if (user.isLoading || joinedContests.isLoading) {
        return <FullScreenLoading />;
    }

    const inviteCards = () => {
        const cards = [];
        for (let i = 0; i < 3 - user.data.team.members.length; i++) {
            cards.push(<InviteTeamMemberCard key={i} />);
        }
        return cards;
    };

    const openConfirmDeleteModal = () => {
        openConfirmModal({
            title: "Csapat törlése",
            children: (
                <Text size="sm">
                Biztos, hogy törölni akarod a csapatodat? Ez a művelet nem visszavonható.
                </Text>
            ),
            labels: { confirm: "Csapat törlése", cancel: "Mégse" },
            confirmProps: { color: "red" },
            onConfirm: async () => {
                await deleteTeam.mutateAsync({ id: user.data.team.id });
                queryClient.invalidateQueries(user.queryKey);
                await joinedContests.refetch();
            },
        });
    };

    const openConfirmLeaveModal = () => {
        openConfirmModal({
            title: "Csapat elhagyása",
            children: (
                <Text size="sm">
                Biztos, hogy el akarod hagyni a csapatodat? Ez a művelet nem visszavonható.
                </Text>
            ),
            labels: { confirm: "Csapat elhagyása", cancel: "Mégse" },
            confirmProps: { color: "red" },
            onConfirm: async () => {
                await leaveTeam.mutateAsync();
                queryClient.invalidateQueries(user.queryKey);
                await joinedContests.refetch();
            },
        });
    };

    const openCreateTeamModal = () => {
        openModal({
            title: "Csapat létrehozása",
            size: "lg",
            children: <CreateTeamModalContent userKey={user.queryKey} />,
        });
    };

    return (
        <>
            <SimpleGrid cols={2} className={classes.grid} breakpoints={[
                { maxWidth: 784, cols: 1, spacing: "sm" },
            ]}>
                <Paper radius="md" p="lg" className={classes.sectionContainer}>
                    <Title order={2} mb={joinedContests.data.length > 0 ? "md" : 0}>Folyamatban levő versenyeid</Title>
                    {joinedContests.data.length === 0 && (
                        <Center className={classes.emptyXContainer} p="xl">
                            <Text pb="xs" align="center">
                                Nincs folyamatban lévő versenyed.
                            </Text>
                            <Button component={Link} to="/contests" variant="light">
                                Versenyek
                            </Button>
                        </Center>
                    )}
                    {joinedContests.data.map((contest) => (
                        <JoinedContestCard key={contest.id} contest={contest} />
                    ))}
                </Paper>
                <Paper radius="md" p="lg" className={classes.sectionContainer}>
                    <Title order={2} mb={user.data.team ? "md" : 0}>A csapatod <Text component="span" weight="normal">{user.data.team && `- ${user.data.team.name}`}</Text></Title>
                    {!user.data.team && (
                        <Center className={classes.emptyXContainer} p="xl">
                            <Text pb="xs" align="center">
                                Úgy tűnik, hogy még nem csatlakoztál csapathoz. Csatlakozz egy csapathoz, vagy hozz létre egyet!
                            </Text>
                            <Button onClick={openCreateTeamModal}>
                                Csapat létrehozása
                            </Button>
                        </Center>
                    )}
                    {user.data.team && (
                        <>
                            <Box p="xl" className={classes.pointsContainer}>
                                <Text size={theme.fontSizes.xl * 2} weight="bolder" align="center" inline={true}>{user.data.team.points}</Text>
                                <Text size="sm" color="dimmed" align="center">pont</Text>
                            </Box>
                            <Group position="apart" mb="md">
                                <Text>A csapatod állapota:</Text>
                                <Text weight="bold">{user.data.team.members.length === 3 ? "Teljes" : "Hiányos"}</Text>
                            </Group>
                            <Stack spacing="md" mb="md">
                                {user.data.team.members.map((member) => (
                                    <TeamMemberCard key={member.id} teamMember={member} teamCreator={user.data.team.creatorId} />
                                ))}
                                {inviteCards()}
                            </Stack>
                            {isTeamCreator && (
                                <Button color="red" fullWidth={true} onClick={openConfirmDeleteModal}>Csapat törlése</Button>
                            )}
                            {!isTeamCreator && (
                                <Button color="red" fullWidth={true} onClick={openConfirmLeaveModal}>Csapat elhagyása</Button>
                            )}
                        </>
                    )}
                </Paper>
            </SimpleGrid>
        </>
    );
};

export default HomePage;
