import { AspectRatio, BackgroundImage, Badge, Box, Card, Image, Text, Title, createStyles } from "@mantine/core";

import { IndexContestsResponse } from "../api/client/model";
import dayjs from "dayjs";

const useStyles = createStyles((theme) => ({
    badge: {
        position: "absolute",
        bottom: theme.spacing.xs,
        right: theme.spacing.xs,
    }
}));

export const ContestCard = ({ contest }: { contest: IndexContestsResponse }): JSX.Element => {
    const { classes } = useStyles();

    return (
        <Card radius="md" shadow="sm">
            <Card.Section>
                <AspectRatio ratio={16 / 9}>
                    <BackgroundImage src={contest.thumbnailUrl}>
                        <Badge className={classes.badge}>Folyamatban</Badge>
                    </BackgroundImage>
                </AspectRatio>
            </Card.Section>
            <Card.Section p="sm">
                <Text size="xl" weight={600} truncate={true}>{contest.topic}</Text>
                <Text size="sm" color="dimmed" truncate={true}> {contest.description}</Text>
                <Text size="sm">{dayjs(contest.startDate).format("YYYY. MM. DD.")} - {dayjs(contest.endDate).format("YYYY. MM. DD.")} </Text>
            </Card.Section>
        </Card>
    );
};
