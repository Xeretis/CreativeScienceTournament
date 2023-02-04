import { ActionIcon, Box, Button, Card, Group, PasswordInput, Text, TextInput, createStyles, useMantineTheme } from "@mantine/core";
import { IconCheck, IconEdit, IconUserCheck } from "@tabler/icons-react";
import { IndexUsersResponse, UpdateUserRequest } from "../api/client/model";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { closeAllModals, openModal } from "@mantine/modals";
import { useForm, zodResolver } from "@mantine/form";

import { ValidationError } from "../utils/api";
import { camelize } from "../utils/string";
import { showNotification } from "@mantine/notifications";
import { usePatchApiUsersId } from "../api/client/users/users";
import { z } from "zod";

const useStyles = createStyles((theme) => ({
    textContainer: {
        maxWidth: "72%",
    },
}));

const UpdateUserModalContent = ({ user, usersKey }: { user: IndexUsersResponse, usersKey: QueryKey }) => {
    const updateUser = usePatchApiUsersId();

    const querClient = useQueryClient();

    const form = useForm<UpdateUserRequest>({
        initialValues: {
            userName: user.userName,
            email: "",
            newPassword: "",
            confirmNewPassword: "",
            currentPassword: "",
        },
        validate: zodResolver(z.object({
            newPassword: z.union([z.string().min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie"), z.string().length(0)]),
            confirmNewPassword: z.union([z.string().min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie"), z.string().length(0)]),
        }).refine((data) => data.newPassword === data.confirmNewPassword, { message: "A megadott jelszavak nem egyeznek", path: ["confirmNewPassword"] }))
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await updateUser.mutateAsync({
                id: user.id,
                data: values,
            });
            querClient.invalidateQueries(usersKey);
            showNotification({
                title: "Sikeres módosítás",
                color: "green",
                icon: <IconCheck />,
                message: "A fiókod adatai sikeresen módosításra kerültek",
            });
            closeAllModals();
        } catch(error) {
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
        <form onSubmit={submit}>
            <TextInput label="Felhasználónév" required={true} {...form.getInputProps("userName")} mb="sm" />
            <TextInput label="Új e-mail" {...form.getInputProps("email")} mb="sm" />
            <PasswordInput label="Új jelszó" {...form.getInputProps("newPassword")} mb="sm" />
            <PasswordInput label="Új jelszó megerősítése" {...form.getInputProps("confirmNewPassword")} mb="sm" />
            <Button type="submit" fullWidth={true} loading={updateUser.isLoading}>Mentés</Button>
        </form>
    );
};

export const UserCard = ({ user, adminControls, usersKey }: { user: IndexUsersResponse, adminControls: boolean, usersKey: QueryKey }): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const openUpdateUserModal = () => {
        openModal({
            title: "Felhasználó módosítása",
            size: "lg",
            children: <UpdateUserModalContent user={user} usersKey={usersKey} />,
        });
    };

    return (
        <Card shadow="sm" p="md" radius="md" withBorder={theme.colorScheme !== "dark"}>
            <Group position="apart">
                <Box className={classes.textContainer}>
                    <Text size="xl" weight={600} truncate={true}>{user.userName}</Text>
                </Box>
                <Group spacing="xs">
                    {user.teamId && <IconUserCheck />}
                    {adminControls && <ActionIcon onClick={openUpdateUserModal}><IconEdit stroke={1.5} /></ActionIcon>}
                </Group>
            </Group>
        </Card>
    );
};
