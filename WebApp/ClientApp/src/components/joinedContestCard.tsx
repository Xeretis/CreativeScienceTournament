import "dayjs/locale/hu";

import { ActionIcon, Box, Button, Card, Group, Text, Title, createStyles } from "@mantine/core";

import { IconChevronRight } from "@tabler/icons-react";
import { IndexContestsResponse } from "../api/client/model";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const useStyles = createStyles((theme) => ({
    textContainer: {
        maxWidth: "75%",
    },
}));

export const JoinedContestCard = ({ contest }: { contest: IndexContestsResponse }): JSX.Element => {
    const { classes } = useStyles();

    return (
        <Card shadow="sm" p="md" radius="md">
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
                <ActionIcon size="lg" component={Link} to={"#"} radius="md">
                    <IconChevronRight />
                </ActionIcon>
            </Group>
        </Card>
    );
};
