import { Box, Button, Card, Group, NumberInput, Text, TextInput, createStyles, useMantineTheme } from "@mantine/core";
import { IconCheck, IconChevronRight } from "@tabler/icons-react";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { closeAllModals, openModal } from "@mantine/modals";
import { useGetApiContestEntriesIdSolution, usePutApiContestEntriesIdCorrect } from "../api/client/contest-entries/contest-entries";

import { IndexContestEntriesResponse } from "../api/client/model";
import { ValidationError } from "../utils/api";
import { camelize } from "../utils/string";
import { useForm } from "@mantine/form";

const useStyles = createStyles((theme) => ({
    card: {
        cursor: "pointer",
    },
    textContainer: {
        maxWidth: "72%",
    },
}));

const ViewContestEntryModalContent = ({ entry, queryKey }: { entry: IndexContestEntriesResponse, queryKey: QueryKey }): JSX.Element => {
    const { classes } = useStyles();

    const queryClient = useQueryClient();

    const downloadSloution = useGetApiContestEntriesIdSolution(entry.id, { query: { enabled: false } });

    const updateContestEntryCorrection = usePutApiContestEntriesIdCorrect();

    const downloadSolutionFile = () => {
        downloadSloution.refetch();
        downloadSloution.remove();
    };

    const form = useForm({
        initialValues: {
            points: entry.correction?.points ?? 0,
            comment: entry.correction?.comment ?? "",
        },
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await updateContestEntryCorrection.mutateAsync({ id: entry.id, data: values });
            queryClient.invalidateQueries(queryKey);
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
        <>
            <Group position="apart" mb="sm">
                <Text>Csapat: </Text>
                <Text weight={600}>{entry.team.name}</Text>
            </Group>
            <Button fullWidth={true} variant="outline" onClick={downloadSolutionFile} mb="sm">Megoldás letöltése</Button>
            <form onSubmit={submit}>
                <NumberInput required={true} label="Pontszám" {...form.getInputProps("points")} mb="sm" />
                <TextInput required={true} label="Megjegyzés" {...form.getInputProps("comment")} mb="sm" />
                <Button fullWidth={true} type="submit">Mentés</Button>
            </form>
        </>
    );
};

export const ContestEntryCard = ({ entry, queryKey }: { entry: IndexContestEntriesResponse, queryKey: QueryKey }): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const openViewContestEntryModal = () => {
        openModal({
            title: "Megoldás megtekintése",
            size: "lg",
            children: <ViewContestEntryModalContent entry={entry} queryKey={queryKey} />,
        });
    };

    return (
        <Card onClick={openViewContestEntryModal} shadow="sm" p="md" radius="md" withBorder={theme.colorScheme !== "dark"} className={classes.card}>
            <Group position="apart">
                <Box className={classes.textContainer}>
                    <Text size="xl" weight={600} truncate={true}>{entry.team.name}</Text>
                </Box>
                <Group spacing="xs">
                    {entry.correction && <IconCheck stroke={1.5} />}
                    <IconChevronRight stroke={1.5} />
                </Group>
            </Group>
        </Card>
    );
};
