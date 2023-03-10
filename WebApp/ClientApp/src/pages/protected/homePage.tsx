import { Box, Button, Center, Group, Paper, SimpleGrid, Stack, Text, TextInput, Title, createStyles, useMantineTheme } from "@mantine/core";
import { CreateTeamRequest, UpdateTeamRequest } from "../../api/client/model";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { closeAllModals, openConfirmModal, openModal } from "@mantine/modals";
import { useDeleteApiTeamsId, usePatchApiTeamsId, usePostApiTeams, usePostApiTeamsLeave } from "../../api/client/teams/teams";
import { useEffect, useState } from "react";

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
import { useIsTeamFull } from "../../hooks/useIsTeamFull";

const useStyles = createStyles((theme) => ({
    grid: {
        minHeight: "100%",
    },
    emptyXContainer: {
        minHeight: "100%",
        flexDirection: "column",

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            flex: 1,
            minHeight: "unset",
        }
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
            <TextInput label="Csapatn??v" {...form.getInputProps("name")} mb="sm" />
            <Button type="submit" fullWidth={true}>
                L??trehoz??s
            </Button>
        </form>
    );
};

const UpdateTeamModalContent = ({ teamId, userKey }: { teamId: number, userKey: QueryKey }): JSX.Element => {
    const queryClient = useQueryClient();

    const updateTeam = usePatchApiTeamsId();

    const form = useForm<UpdateTeamRequest>({
        initialValues: {
            name: "",
        },
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await updateTeam.mutateAsync({ id: teamId, data: values });
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
            <TextInput label="Csapatn??v" {...form.getInputProps("name")} mb="sm" />
            <Button type="submit" fullWidth={true}>
                Ment??s
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
    const isTeamFull = useIsTeamFull(user.data);

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
            title: "Csapat t??rl??se",
            children: (
                <Text size="sm">
                Biztos, hogy t??r??lni akarod a csapatodat? Ez a m??velet nem visszavonhat??.
                </Text>
            ),
            labels: { confirm: "Csapat t??rl??se", cancel: "M??gse" },
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
            title: "Csapat elhagy??sa",
            children: (
                <Text size="sm">
                Biztos, hogy el akarod hagyni a csapatodat? Ez a m??velet nem visszavonhat??.
                </Text>
            ),
            labels: { confirm: "Csapat elhagy??sa", cancel: "M??gse" },
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
            title: "Csapat l??trehoz??sa",
            size: "lg",
            children: <CreateTeamModalContent userKey={user.queryKey} />,
        });
    };

    const openUpdateTeamModal = () => {
        openModal({
            title: "Csapat szerkeszt??se",
            size: "lg",
            children: <UpdateTeamModalContent teamId={user.data.team.id} userKey={user.queryKey} />,
        });
    };

    return (
        <>
            <SimpleGrid cols={2} className={classes.grid} breakpoints={[
                { maxWidth: 784, cols: 1, spacing: "sm" },
            ]}>
                <Paper radius="md" p="lg" className={classes.sectionContainer}>
                    <Title order={2} mb={joinedContests.data.length > 0 ? "md" : 0}>A versenyeid</Title>
                    {joinedContests.data.length === 0 && (
                        <Center className={classes.emptyXContainer} p="xl">
                            <Text pb="xs" align="center">
                                M??g nem csatlakozt??l folyamatban lev?? versenyhez.
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
                                ??gy t??nik, hogy m??g nem csatlakozt??l csapathoz. Csatlakozz egy csapathoz, vagy hozz l??tre egyet!
                            </Text>
                            <Button onClick={openCreateTeamModal}>
                                Csapat l??trehoz??sa
                            </Button>
                        </Center>
                    )}
                    {user.data.team && (
                        <>
                            <Box p="xl" className={classes.pointsContainer}>
                                <Text size={theme.fontSizes.xl * 2} weight="bolder" align="center" inline={true}>{user.data.team.points}</Text>
                                <Text size="sm" color="dimmed" align="center">pont</Text>
                            </Box>
                            <Group position="apart">
                                <Text>A csapatod ??llapota:</Text>
                                <Text weight="bold">{isTeamFull ? "Teljes" : "Hi??nyos"}</Text>
                            </Group>
                            <Text mb="md">Csapattagok:</Text>
                            <Stack spacing="md" mb="md">
                                {user.data.team.members.map((member) => (
                                    <TeamMemberCard key={member.id} teamMember={member} teamCreator={user.data.team.creatorId} />
                                ))}
                                {inviteCards()}
                            </Stack>
                            {isTeamCreator && (
                                <Group grow={true}>
                                    <Button  fullWidth={true} onClick={openUpdateTeamModal}>Csapat szerkeszt??se</Button>
                                    <Button color="red" fullWidth={true} onClick={openConfirmDeleteModal}>Csapat t??rl??se</Button>
                                </Group>
                            )}
                            {!isTeamCreator && (
                                <Button color="red" fullWidth={true} onClick={openConfirmLeaveModal}>Csapat elhagy??sa</Button>
                            )}
                        </>
                    )}
                </Paper>
            </SimpleGrid>
        </>
    );
};

export default HomePage;
