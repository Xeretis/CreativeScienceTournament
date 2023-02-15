import "dayjs/locale/hu";

import { ActionIcon, Box, Button, Card, FileInput, Group, LoadingOverlay, Text, Title, createStyles } from "@mantine/core";
import { IconCheck, IconChevronRight } from "@tabler/icons-react";
import { IndexContestsResponse, PostApiContestEntriesContestIdBody } from "../api/client/model";
import { closeAllModals, openConfirmModal, openModal } from "@mantine/modals";
import { useDeleteApiContestEntriesContestIdOwn, useGetApiContestEntriesContestIdOwn, usePostApiContestEntriesContestId } from "../api/client/contest-entries/contest-entries";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { ValidationError } from "../utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useGetApiContestsIdExercise } from "../api/client/contests/contests";

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
    const ownSolution = useGetApiContestEntriesContestIdOwn(contest.id, { query: { retry: false } });

    const createSolution = usePostApiContestEntriesContestId();
    const deleteSolution = useDeleteApiContestEntriesContestIdOwn();

    const downloadExerciseFile = () => {
        downloadExercise.refetch();
        downloadExercise.remove();
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
                title: "Sikeres beküldés",
                color: "green",
                icon: <IconCheck />,
                message: "A megoldás sikeresen beküldve",
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
            title: "Biztosan törölni szeretnéd a megoldást?",
            children: (
                <Text size="sm">
                Biztos, hogy törölni akarod a már beküldött megoldásadat? Ez a művelet nem visszavonható, de ha meg van még a fájl, akkor beküldheted újra.
                </Text>
            ),
            labels: { confirm: "Megoldás törlése", cancel: "Mégse" },
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
            <Button fullWidth={true} onClick={downloadExerciseFile} mb="sm">Feladat letöltése</Button>
            {ownSolution.data ? (
                <Button fullWidth={true} color="red" onClick={openConfirmDeleteModal}>Megoldás törlése</Button>
            ) : (
                <form onSubmit={submit}>
                    <FileInput label="Megoldás" required={true} {...form.getInputProps("Solution")} mb="sm" />
                    <Button fullWidth={true} type="submit">Beküldés</Button>
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
                        Véget ér <Text component="span" weight="bold">{dayjs(contest.endDate).locale("hu").fromNow()}</Text>
                    </Text>
                </Box>
                <IconChevronRight />
            </Group>
        </Card>
    );
};
