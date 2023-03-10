import "dayjs/locale/hu";

import {
    AspectRatio,
    BackgroundImage,
    Badge,
    Button,
    Card,
    FileInput,
    Group,
    LoadingOverlay,
    NumberInput,
    Text,
    TextInput,
    createStyles,
    useMantineTheme
} from "@mantine/core";
import { IndexContestsResponse, PatchApiContestsIdBody } from "../api/client/model";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { closeAllModals, openConfirmModal, openModal } from "@mantine/modals";
import {
    useDeleteApiContestsId,
    useDeleteApiContestsIdLeave,
    useGetApiContestsIdTeamStatus,
    usePatchApiContestsId,
    usePostApiContestsIdJoin
} from "../api/client/contests/contests";
import { useEffect, useState } from "react";

import { DatePicker } from "@mantine/dates";
import { IconCheck } from "@tabler/icons-react";
import { ValidationError } from "../utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useGetApiAuthUser } from "../api/client/auth/auth";
import { useIsAdmin } from "../hooks/useIsAdmin";
import { useIsTeamFull } from "../hooks/useIsTeamFull";
import { useNavigate } from "react-router-dom";

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

const ViewContestModal = ({
    contest,
    contestsKey
}: { contest: IndexContestsResponse, contestsKey: QueryKey }): JSX.Element => {
    const theme = useMantineTheme();

    const queryClient = useQueryClient();

    const user = useGetApiAuthUser();
    const isAdmin = useIsAdmin(user.data);
    const isTeamFull = useIsTeamFull(user.data);

    const [joined, setJoined] = useState(false);
    const [didSetJoined, setDidSetJoined] = useState(false);

    const teamStatus = useGetApiContestsIdTeamStatus(contest.id, { query: { enabled: false } });

    const joinContest = usePostApiContestsIdJoin();
    const leaveContest = useDeleteApiContestsIdLeave();
    const updateContest = usePatchApiContestsId();
    const deleteContest = useDeleteApiContestsId();

    const navigate = useNavigate();

    const form = useForm({
        initialValues: {
            Topic: contest.topic,
            Description: contest.description,
            MaxPoints: 0,
            Exercise: undefined,
            TopicHelp: undefined,
            Thumbnail: undefined,
            StartDate: new Date(contest.startDate),
            EndDate: new Date(contest.endDate),
        },
    });

    const submit = form.onSubmit(async (values) => {
        try {
            const StartDate = values.StartDate.toISOString();
            const EndDate = values.EndDate.toISOString();
            await updateContest.mutateAsync({
                id: contest.id,
                data: { ...values, StartDate, EndDate } as PatchApiContestsIdBody
            });
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

    const openConfirmDeleteModal = async () => {
        openConfirmModal({
            title: "Biztosan t??r??lni szeretn??d a versenyt?",
            children: (
                <Text size="sm">
                    Biztos, hogy t??r??lni akarod ezt a versenyt? Ez a m??velet nem visszavonhat??.
                </Text>
            ),
            labels: { confirm: "Verseny t??rl??se", cancel: "M??gse" },
            onConfirm: async () => {
                await deleteContest.mutateAsync({ id: contest.id });
                queryClient.invalidateQueries(contestsKey);
                closeAllModals();
            },
        });
    };

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
                message: "Sikeresen kil??pt??l a versenyb??l",
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
                message: "Sikeresen bel??pt??l a versenybe",
            });
        }
    };

    useEffect(() => {
        if (user.data && !didSetJoined && isTeamFull) {
            teamStatus.refetch();
        }
        if (teamStatus.data && !didSetJoined) {
            setJoined(teamStatus.data.joined);
            setDidSetJoined(true);
            teamStatus.remove();
        }
    }, [teamStatus.data, didSetJoined, user, isTeamFull, teamStatus]);

    return (
        <>
            <LoadingOverlay visible={user.isLoading || teamStatus.isInitialLoading} />
            <Text color="dimmed">{contest.description}</Text>
            <Group position="apart" mb="sm">
                <Text>{dayjs().isBefore(contest.startDate) ? "Kezdete" : "V??ge"}</Text>
                <Text
                    weight={600}>{dayjs().isBefore(contest.startDate) ? dayjs(contest.startDate).locale("hu").fromNow() : dayjs(contest.endDate).locale("hu").fromNow()}</Text>
            </Group>
            {isAdmin && (
                <form onSubmit={submit}>
                    <TextInput label="T??ma" {...form.getInputProps("Topic")} mb="sm" />
                    <TextInput label="Le??r??s" {...form.getInputProps("Description")} mb="sm" />
                    <NumberInput required={true} label="Max pontsz??m" {...form.getInputProps("MaxPoints")} mb="sm" />
                    <FileInput clearable={true} label="??j feladat" {...form.getInputProps("Exercise")} mb="sm" />
                    <FileInput clearable={true} label="??j seg??dlet" {...form.getInputProps("TopicHelp")} mb="sm" />
                    <FileInput clearable={true} label="??j bor??t??k??p"
                        placeholder={contest.thumbnailUrl} {...form.getInputProps("Thumbnail")} mb="sm" />
                    <DatePicker locale="hu" required={true} styles={{ weekday: { textTransform: "lowercase" } }} label="Kezd??s d??tuma" {...form.getInputProps("StartDate")} mb="sm" />
                    <DatePicker locale="hu" required={true} styles={{ weekday: { textTransform: "lowercase" } }} label="Befejez??s d??tuma" {...form.getInputProps("EndDate")} mb="sm" />
                    <Group grow={true} position="apart" mb="sm">
                        <Button fullWidth={true} type="submit">Ment??s</Button>
                        <Button fullWidth={true} color="red" onClick={openConfirmDeleteModal}>Verseny t??rl??se</Button>
                    </Group>
                    <Button fullWidth={true} variant="outline" onClick={() => {
                        closeAllModals();
                        navigate(`/contest/${contest.id}/entries`);
                    }} mb="sm">Megold??sok kezel??se</Button>
                </form>
            )}
            <Button fullWidth={true} color={joined ? "red" : theme.primaryColor}
                onClick={joinOrLeave}
                disabled={dayjs().isBefore(contest.startDate) || dayjs().isAfter(contest.endDate)}
                loading={joinContest.isLoading || leaveContest.isLoading}>{joined ? "Kil??p??s" : "Bel??p??s"}</Button>
        </>
    );
};

export const ContestCard = ({
    contest,
    contestsKey
}: { contest: IndexContestsResponse, contestsKey: QueryKey }): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const isBefore = dayjs().isBefore(dayjs(contest.endDate));
    const isLive = isBefore && dayjs().isAfter(dayjs(contest.startDate));

    const openViewContestModal = () => {
        openModal({
            title: contest.topic,
            size: "lg",
            children: <ViewContestModal contest={contest} contestsKey={contestsKey} />,
        });
    };

    return (
        <Card onClick={openViewContestModal} className={classes.card} radius="md" shadow="sm"
            withBorder={theme.colorScheme !== "dark"}>
            <Card.Section>
                <AspectRatio ratio={16 / 9}>
                    <BackgroundImage src={contest.thumbnailUrl}>
                        <Badge className={classes.badge} variant="filled"
                            color={isLive ? "green" : (isBefore ? "yellow" : "red")}>{isLive ? "Folyamatban" : (isBefore ? "Hamarosan" : "V??get ??rt")}</Badge>
                    </BackgroundImage>
                </AspectRatio>
            </Card.Section>
            <Card.Section p="sm">
                <Text size="xl" weight={600} truncate={true}>{contest.topic}</Text>
                <Text size="sm" color="dimmed" truncate={true}> {contest.description}</Text>
                <Text
                    size="sm">{dayjs(contest.startDate).format("YYYY. MM. DD.")} - {dayjs(contest.endDate).format("YYYY. MM. DD.")}</Text>
            </Card.Section>
        </Card>
    );
};
