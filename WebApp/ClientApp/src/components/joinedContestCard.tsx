import "dayjs/locale/hu";

import { ActionIcon, Box, Button, Card, Group, Text, Title, createStyles } from "@mantine/core";

import { IconChevronRight } from "@tabler/icons-react";
import { IndexContestsResponse } from "../api/client/model";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { openModal } from "@mantine/modals";
import relativeTime from "dayjs/plugin/relativeTime";
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

    const downloadExerciseFile = () => {
        downloadExercise.refetch();
        downloadExercise.remove();
    };

    return (
        <>
            <Text color="dimmed">{contest.description}</Text>
            <Button fullWidth={true} onClick={downloadExerciseFile} mt="md">Feladat letöltése</Button>
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
