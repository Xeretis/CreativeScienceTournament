import { Box, Button, Group, SimpleGrid, Text, TextInput, Title, createStyles, useMantineTheme } from "@mantine/core";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { UpdateTeamRequest, ViewTeamResponse } from "../../api/client/model";
import { closeAllModals, openConfirmModal, openModal } from "@mantine/modals";
import { useDeleteApiTeamsId, useGetApiTeamsId, usePatchApiTeamsId } from "../../api/client/teams/teams";
import { useNavigate, useParams } from "react-router-dom";

import { FullScreenLoading } from "../../components/fullScreenLoading";
import { TeamMemberCard } from "../../components/teamMemberCard";
import { ValidationError } from "../../utils/api";
import { camelize } from "../../utils/string";
import { useForm } from "@mantine/form";
import { useGetApiAuthUser } from "../../api/client/auth/auth";
import { useIsAdmin } from "../../hooks/useIsAdmin";

const useStyles = createStyles((theme) => ({
    teamName: {
        maxWidth: "90%",

        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            maxWidth: "80%",
        },

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            maxWidth: "75%",
        },

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            maxWidth: "50%",
        }
    },
    pointsContainer: {
        width: "100%",
    },
}));

const UpdateTeamModalContent = ({ team, teamKey }: { team: ViewTeamResponse, teamKey: QueryKey }): JSX.Element => {
    const queryClient = useQueryClient();

    const updateTeam = usePatchApiTeamsId();

    const form = useForm<UpdateTeamRequest>({
        initialValues: {
            name: team.name,
        },
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await updateTeam.mutateAsync({ id: team.id, data: values });
            queryClient.invalidateQueries(teamKey);
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

export const TeamPage = (): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const { teamId } = useParams<{ teamId: string }>();

    const user = useGetApiAuthUser();
    const team = useGetApiTeamsId(+teamId);

    const deleteTeam = useDeleteApiTeamsId();

    const isAdmin = useIsAdmin(user.data);

    const navigate = useNavigate();

    const openConfirmDeleteModal = () => {
        openConfirmModal({
            title: "Csapat t??rl??se",
            children: (
                <Text size="sm">
                Biztos, hogy t??r??lni akarod ezt a csapatot? Ez a m??velet nem visszavonhat??.
                </Text>
            ),
            labels: { confirm: "Csapat t??rl??se", cancel: "M??gse" },
            confirmProps: { color: "red" },
            onConfirm: async () => {
                await deleteTeam.mutateAsync({ id: team.data.id });
                navigate(-1);
            },
        });
    };

    const openUpdateTeamModal = () => {
        openModal({
            title: "Csapat m??dos??t??sa",
            size: "lg",
            children: <UpdateTeamModalContent team={team.data} teamKey={team.queryKey} />,
        });
    };

    if (team.isLoading || user.isLoading) {
        return <FullScreenLoading />;
    }

    return (
        <>
            <Group position="apart" align="start" mb="md">
                <Title truncate={true} className={classes.teamName}>{team.data.name}</Title>
                <Group position="apart" spacing="xs" mt={6}>
                    {isAdmin && <Button onClick={openUpdateTeamModal}>M??dos??t??s</Button>}
                    {isAdmin && <Button color="red" onClick={openConfirmDeleteModal}>T??rl??s</Button>}
                    <Button variant="outline" onClick={() => navigate(-1)}>Vissza</Button>
                </Group>
            </Group>
            <Box p="xl" className={classes.pointsContainer}>
                <Text size={theme.fontSizes.xl * 2} weight="bolder" align="center" inline={true}>{team.data.points}</Text>
                <Text size="sm" color="dimmed" align="center">pont</Text>
            </Box>
            <Group position="apart">
                <Text>??llapot</Text>
                <Text weight={600}>{team.data.members.length === 3 ? "Teljes" : "Hi??nyos"}</Text>
            </Group>
            <Text mb="xs">Csapattagok:</Text>
            <SimpleGrid
                cols={4}
                spacing="lg"
                breakpoints={[
                    { maxWidth: 1524, cols: 3, spacing: "md" },
                    { maxWidth: 1184, cols: 2, spacing: "sm" },
                    { maxWidth: 784, cols: 1, spacing: "sm" },
                ]}
            >
                {team.data.members.map((member) => (
                    <TeamMemberCard key={member.id} teamMember={member} teamCreator={team.data.creatorId} />
                ))}
            </SimpleGrid>
        </>
    );
};

export default TeamPage;
