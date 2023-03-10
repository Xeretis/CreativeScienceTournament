import "dayjs/locale/hu";

import { Box, Button, Card, FileInput, Group, LoadingOverlay, Text, Title, createStyles } from "@mantine/core";
import { IconCheck, IconChevronRight } from "@tabler/icons-react";
import { IndexContestsResponse, PostApiContestEntriesContestIdBody } from "../api/client/model";
import { closeAllModals, openConfirmModal, openModal } from "@mantine/modals";
import { useDeleteApiContestEntriesContestIdOwn, useGetApiContestEntriesContestIdOwn, usePostApiContestEntriesContestId } from "../api/client/contest-entries/contest-entries";
import { useGetApiContestsIdExercise, useGetApiContestsIdTopicHelp } from "../api/client/contests/contests";

import { ValidationError } from "../utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";

dayjs.extend(relativeTime);

const useStyles = createStyles((theme) => ({
    card: {
        cursor: "pointer",
    },
    textContainer: {
        maxWidth: "75%",
    },
}));

const ViewJoinedContestModalContent = ({ contest }: { contest: IndexContestsResponse }): JSX.Element => {
    const downloadExercise = useGetApiContestsIdExercise(contest.id, { query: { enabled: false } });
    const downloadTopicHelp = useGetApiContestsIdTopicHelp(contest.id, { query: { enabled: false } });
    const ownSolution = useGetApiContestEntriesContestIdOwn(contest.id, { query: { retry: false } });

    const createSolution = usePostApiContestEntriesContestId();
    const deleteSolution = useDeleteApiContestEntriesContestIdOwn();

    const downloadExerciseFile = () => {
        downloadExercise.refetch();
        downloadExercise.remove();
    };

    const downloadTopicHelpFile = () => {
        downloadTopicHelp.refetch();
        downloadTopicHelp.remove();
    };

    const form = useForm({
        initialValues: {
            Solution: null
        },
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await createSolution.mutateAsync({
                contestId: contest.id,
                data: values as unknown as PostApiContestEntriesContestIdBody,
            });
            ownSolution.refetch();
            showNotification({
                title: "Sikeres bek??ld??s",
                color: "green",
                icon: <IconCheck />,
                message: "A megold??s sikeresen bek??ldve",
            });
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
            form.setFieldError(validationError, message);
        }
    };

    const openConfirmDeleteModal = async () => {
        openConfirmModal({
            title: "Biztosan t??r??lni szeretn??d a megold??st?",
            children: (
                <Text size="sm">
                Biztos, hogy t??r??lni akarod a m??r bek??ld??tt megold??sadat? Ez a m??velet nem visszavonhat??, de ha meg van m??g a f??jl, akkor bek??ldheted ??jra.
                </Text>
            ),
            labels: { confirm: "Megold??s t??rl??se", cancel: "M??gse" },
            onConfirm: async () => {
                await deleteSolution.mutateAsync({ contestId: contest.id });
                ownSolution.remove();
                ownSolution.refetch();
                closeAllModals();
            },
        });
    };

    return (
        <>
            <LoadingOverlay visible={ownSolution.isLoading} />
            <Text color="dimmed" mb="sm">{contest.description}</Text>
            <Button fullWidth={true} onClick={downloadExerciseFile} mb="sm">Feladat let??lt??se</Button>
            <Button fullWidth={true} variant="outline" onClick={downloadTopicHelpFile} mb="sm">Seg??dlet let??lt??se</Button>
            {ownSolution.data ? (
                <Button fullWidth={true} color="red" onClick={openConfirmDeleteModal}>Megold??s t??rl??se</Button>
            ) : (
                <form onSubmit={submit}>
                    <FileInput label="Megold??s" required={true} {...form.getInputProps("Solution")} mb="sm" />
                    <Button fullWidth={true} type="submit">Bek??ld??s</Button>
                </form>
            )}
        </>
    );
};

export const JoinedContestCard = ({ contest }: { contest: IndexContestsResponse }): JSX.Element => {
    const { classes } = useStyles();

    const openViewJoinedContestModal = () => {
        openModal({
            title: contest.topic,
            size: "lg",
            children: <ViewJoinedContestModalContent contest={contest} />,
        });
    };

    return (
        <Card onClick={openViewJoinedContestModal} shadow="sm" p="md" radius="md" className={classes.card}>
            <Group position="apart">
                <Box className={classes.textContainer}>
                    <Title order={4} truncate={true}>{contest.topic}</Title>
                    <Text color="dimmed" size="sm" truncate={true}>
                        {contest.description}
                    </Text>
                    <Text size="sm" truncate={true}>
                        V??get ??r <Text component="span" weight="bold">{dayjs(contest.endDate).locale("hu").fromNow()}</Text>
                    </Text>
                </Box>
                <IconChevronRight />
            </Group>
        </Card>
    );
};
