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
            title: "Biztosan törölni szeretnéd a versenyt?",
            children: (
                <Text size="sm">
                    Biztos, hogy törölni akarod ezt a versenyt? Ez a művelet nem visszavonható.
                </Text>
            ),
            labels: { confirm: "Verseny törlése", cancel: "Mégse" },
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
                <Text>{dayjs().isBefore(contest.startDate) ? "Kezdete" : "Vége"}</Text>
                <Text
                    weight={600}>{dayjs().isBefore(contest.startDate) ? dayjs(contest.startDate).locale("hu").fromNow() : dayjs(contest.endDate).locale("hu").fromNow()}</Text>
            </Group>
            {isAdmin && (
                <form onSubmit={submit}>
                    <TextInput label="Téma" {...form.getInputProps("Topic")} mb="sm" />
                    <TextInput label="Leírás" {...form.getInputProps("Description")} mb="sm" />
                    <NumberInput required={true} label="Max pontszám" {...form.getInputProps("MaxPoints")} mb="sm" />
                    <FileInput clearable={true} label="Új feladat" {...form.getInputProps("Exercise")} mb="sm" />
                    <FileInput clearable={true} label="Új segédlet" {...form.getInputProps("TopicHelp")} mb="sm" />
                    <FileInput clearable={true} label="Új borítókép"
                        placeholder={contest.thumbnailUrl} {...form.getInputProps("Thumbnail")} mb="sm" />
                    <DatePicker required={true} label="Kezdés dátuma" {...form.getInputProps("StartDate")} mb="sm" />
                    <DatePicker required={true} label="Befejezés dátuma" {...form.getInputProps("EndDate")} mb="sm" />
                    <Group grow={true} position="apart" mb="sm">
                        <Button fullWidth={true} type="submit">Mentés</Button>
                        <Button fullWidth={true} color="red" onClick={openConfirmDeleteModal}>Verseny törlése</Button>
                    </Group>
                    <Button fullWidth={true} variant="outline" onClick={() => {
                        closeAllModals();
                        navigate(`/contest/${contest.id}/entries`);
                    }} mb="sm">Megoldások kezelése</Button>
                </form>
            )}
            <Button fullWidth={true} color={joined ? "red" : theme.primaryColor}
                onClick={joinOrLeave}
                disabled={dayjs().isBefore(contest.startDate) || dayjs().isAfter(contest.endDate)}
                loading={joinContest.isLoading || leaveContest.isLoading}>{joined ? "Kilépés" : "Belépés"}</Button>
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
                            color={isLive ? "green" : (isBefore ? "yellow" : "red")}>{isLive ? "Folyamatban" : (isBefore ? "Hamarosan" : "Véget ért")}</Badge>
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
