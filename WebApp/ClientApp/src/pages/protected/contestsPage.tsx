import { ActionIcon, Box, Button, Drawer, FileInput, Group, NumberInput, SimpleGrid, Text, TextInput, Title, createStyles, useMantineTheme } from "@mantine/core";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { closeAllModals, openModal } from "@mantine/modals";
import { useGetApiContests, usePostApiContests } from "../../api/client/contests/contests";

import { ContestCard } from "../../components/contestCard";
import { DatePicker } from "@mantine/dates";
import { FullScreenLoading } from "../../components/fullScreenLoading";
import { IconFilter } from "@tabler/icons-react";
import { PostApiContestsBody } from "../../api/client/model";
import { ValidationError } from "../../utils/api";
import { camelize } from "../../utils/string";
import { useForm } from "@mantine/form";
import { useGetApiAuthUser } from "../../api/client/auth/auth";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import { useState } from "react";

const useStyles = createStyles((theme) => ({}));

const CreateContestModalContent = ({ contestsKey }: { contestsKey: QueryKey }): JSX.Element => {
    const queryClient = useQueryClient();

    const createContest = usePostApiContests();

    const form = useForm({
        initialValues: {
            Topic: "",
            Description: "",
            MaxPoints: 0,
            Exercise: null,
            Thumbnail: null,
            StartDate: new Date(),
            EndDate: new Date(),
        },
    });

    const submit = form.onSubmit(async (values) => {
        try {
            const StartDate = values.StartDate.toISOString();
            const EndDate = values.EndDate.toISOString();
            await createContest.mutateAsync({ data: { ...values, StartDate, EndDate } as PostApiContestsBody });
            queryClient.invalidateQueries(contestsKey);
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
            form.setFieldError(validationError, message);
        }
    };

    return (
        <form onSubmit={submit}>
            <TextInput required={true} label="Téma" {...form.getInputProps("Topic")} mb="sm" />
            <TextInput required={true} label="Leírás" {...form.getInputProps("Description")} mb="sm" />
            <NumberInput required={true} label="Max pontszám" {...form.getInputProps("MaxPoints")} mb="sm" />
            <FileInput required={true} label="Feladat" {...form.getInputProps("Exercise")} mb="sm" />
            <FileInput clearable={true} label="Borítókép" {...form.getInputProps("Thumbnail")} mb="sm" />
            <DatePicker required={true} label="Kezdés dátuma" {...form.getInputProps("StartDate")} mb="sm" />
            <DatePicker required={true} label="Befejezés dátuma" {...form.getInputProps("EndDate")} mb="sm" />
            <Button type="submit">Létrehozás</Button>
        </form>
    );
};

const ContestsPage = (): JSX.Element => {
    const { classes } = useStyles();

    const user = useGetApiAuthUser();
    const isUserAdmin = useIsAdmin(user.data);

    const contests = useGetApiContests();
    const theme = useMantineTheme();

    const [filterOpened, setFilterOpened] = useState(false);

    const openCreateContestModal = () => {
        openModal({
            title: "Verseny létrehozása",
            size: "lg",
            children: <CreateContestModalContent contestsKey={contests.queryKey} />,
        });
    };

    if (user.isLoading || contests.isLoading) {
        return <FullScreenLoading />;
    }

    return (
        <>
            <Group position="apart" align="baseline">
                <Title mb="md">Versenyek</Title>
                <Group spacing="xs" align="flex-start">
                    {isUserAdmin && (
                        <Button onClick={openCreateContestModal}>Verseny létrehozása</Button>
                    )}
                    <ActionIcon size="lg" onClick={() => setFilterOpened(!filterOpened)}><IconFilter size={28} color={theme.colorScheme === "dark" ? "white" : "black"} /></ActionIcon>
                </Group>
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
                    <ContestCard key={contest.id} contest={contest} contestsKey={contests.queryKey} />
                ))}</SimpleGrid>
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

export default ContestsPage;
