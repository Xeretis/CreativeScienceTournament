import "dayjs/locale/hu";

import { AspectRatio, BackgroundImage, Badge, Box, Button, Card, Group, Image, LoadingOverlay, Text, Title, createStyles, useMantineTheme } from "@mantine/core";
import { useDeleteApiContestsIdLeave, useGetApiContestsIdTeamStatus, usePostApiContestsIdJoin } from "../api/client/contests/contests";
import { useEffect, useState } from "react";

import { IconCheck } from "@tabler/icons-react";
import { IndexContestsResponse } from "../api/client/model";
import dayjs from "dayjs";
import { openModal } from "@mantine/modals";
import relativeTime from "dayjs/plugin/relativeTime";
import { showNotification } from "@mantine/notifications";

dayjs.extend(relativeTime);

const useStyles = createStyles((theme) => ({
    card: {
        cursor: "pointer",
    },
    badge: {
        position: "absolute",
        bottom: theme.spacing.xs,
        right: theme.spacing.xs,
    }
}));

const ViewContestModal = ({ contest }: { contest: IndexContestsResponse }): JSX.Element => {
    const theme = useMantineTheme();

    const [joined, setJoined] = useState(false);
    const [didSetJoined, setDidSetJoined] = useState(false);

    const teamStatus = useGetApiContestsIdTeamStatus(contest.id);

    const joinContest = usePostApiContestsIdJoin();
    const leaveContest = useDeleteApiContestsIdLeave();

    const joinOrLeave = async () => {
        if (joined) {
            await leaveContest.mutateAsync({ id: contest.id });
            setDidSetJoined(false);
            teamStatus.remove();
            teamStatus.refetch();
            showNotification({
                title: "Siker",
                color: "green",
                icon: <IconCheck />,
                message: "Sikeresen kiléptél a versenyből",
            });
        } else {
            await joinContest.mutateAsync({ id: contest.id });
            setDidSetJoined(false);
            teamStatus.remove();
            teamStatus.refetch();
            showNotification({
                title: "Siker",
                color: "green",
                icon: <IconCheck />,
                message: "Sikeresen beléptél a versenybe",
            });
        }
    };

    useEffect(() => {
        if (teamStatus.data && !didSetJoined) {
            setJoined(teamStatus.data.joined);
            setDidSetJoined(true);
        }
    }, [teamStatus.data, didSetJoined]);

    return (
        <>
            <LoadingOverlay visible={teamStatus.isLoading} />
            <Text color="dimmed">{contest.description}</Text>
            <Group position="apart" mb="sm">
                <Text>{dayjs().isBefore(contest.startDate) ? "Kezdete" : "Vége"}</Text>
                <Text weight={600}>{dayjs().isBefore(contest.startDate) ? dayjs(contest.startDate).locale("hu").fromNow() : dayjs(contest.endDate).locale("hu").fromNow()}</Text>
            </Group>
            <Button fullWidth={true} color={joined ? "red" : theme.primaryColor}
                onClick={joinOrLeave}
                disabled={dayjs().isBefore(contest.startDate) || dayjs().isAfter(contest.endDate)}
                loading={joinContest.isLoading || leaveContest.isLoading}>{joined ? "Kilépés" : "Belépés"}</Button>
        </>
    );
};

export const ContestCard = ({ contest }: { contest: IndexContestsResponse }): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const isBefore = dayjs().isBefore(dayjs(contest.endDate));
    const isLive = isBefore && dayjs().isAfter(dayjs(contest.startDate));

    const openViewContestModal = () => {
        openModal({
            title: contest.topic,
            size: "lg",
            children: <ViewContestModal contest={contest} />,
        });
    };

    return (
        <Card onClick={openViewContestModal} className={classes.card} radius="md" shadow="sm" withBorder={theme.colorScheme !== "dark"}>
            <Card.Section>
                <AspectRatio ratio={16 / 9}>
                    <BackgroundImage src={contest.thumbnailUrl}>
                        <Badge className={classes.badge} variant="filled" color={isLive ? "green" : (isBefore ? "yellow" : "red")}>{isLive ? "Folyamatban" : (isBefore ? "Hamarosan" : "Véget ért")}</Badge>
                    </BackgroundImage>
                </AspectRatio>
            </Card.Section>
            <Card.Section p="sm">
                <Text size="xl" weight={600} truncate={true}>{contest.topic}</Text>
                <Text size="sm" color="dimmed" truncate={true}> {contest.description}</Text>
                <Text size="sm">{dayjs(contest.startDate).format("YYYY. MM. DD.")} - {dayjs(contest.endDate).format("YYYY. MM. DD.")}</Text>
            </Card.Section>
        </Card>
    );
};
