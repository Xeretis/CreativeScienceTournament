import { AppShell, Button, Center, Indicator, LoadingOverlay, Navbar, PasswordInput, Stack, TextInput, Tooltip, UnstyledButton, createStyles, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import {
    IconAtom,
    IconCheck,
    IconHome2,
    IconLogout,
    IconPaint,
    IconTrophy,
    IconUser,
    IconUserSearch,
    IconUsers,
    TablerIconsProps
} from "@tabler/icons-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { closeAllModals, openModal } from "@mantine/modals";
import { useDeleteApiAuthLogout, useGetApiAuthUser } from "../../api/client/auth/auth";
import { useEffect, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";

import { UpdateUserRequest } from "../../api/client/model";
import { ValidationError } from "../../utils/api";
import { camelize } from "../../utils/string";
import { showNotification } from "@mantine/notifications";
import { useApiStore } from "../../stores/apiStore";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import { usePatchApiUsersId } from "../../api/client/users/users";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const useStyles = createStyles((theme) => ({
    link: {
        width: 50,
        height: 50,
        borderRadius: theme.radius.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[0],
        },
    },

    active: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({ variant: "light", color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: "light", color: theme.primaryColor }).color,
        },
    },

    logoutLink: {
        width: 50,
        height: 50,
        borderRadius: theme.radius.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.fn.rgba(theme.colors.red[7], 0.1) : theme.colors.red[1],
        },
    },
}));

interface NavbarLinkProps {
  icon: React.ComponentType<TablerIconsProps>;
  label: string;
  active?: boolean;
  path: string;
}

const NavbarLink = ({ icon: Icon, label, active, path }: NavbarLinkProps) => {
    const { classes, cx } = useStyles();
    const navigate = useNavigate();

    return (
        <Tooltip label={label} position="right" transitionDuration={0}>
            <UnstyledButton onClick={() => navigate(path)} className={cx(classes.link, { [classes.active]: active })}>
                <Icon stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
};

const data = [
    { icon: IconHome2, label: "Kezdőlap", path: "/home" },
    { icon: IconTrophy, label: "Versenyek", path: "/contests" },
    { icon: IconUsers, label: "Csapatok", path: "/teams" },
    { icon: IconUserSearch, label: "Felhasználók", path: "/users" },
];

const UpdateUserModalContent = () => {
    const user = useGetApiAuthUser();

    const isUserAdmin = useIsAdmin(user.data);

    const updateUser = usePatchApiUsersId();

    const querClient = useQueryClient();

    const form = useForm<UpdateUserRequest>({
        initialValues: {
            userName: "",
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
    const [didSetInitialValues, setDidSetInitialValues] = useState(false);

    useEffect(() => {
        if (!didSetInitialValues && user.data) {
            form.setValues({
                userName: user.data.userName,
                email: user.data.email,
                newPassword: "",
                confirmNewPassword: "",
                currentPassword: "",
            });
            setDidSetInitialValues(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, didSetInitialValues]);

    const submit = form.onSubmit(async (values) => {
        try {
            if (user.data) {
                await updateUser.mutateAsync({
                    id: user.data.id,
                    data: values,
                });
                querClient.invalidateQueries(user.queryKey);
                showNotification({
                    title: "Sikeres módosítás",
                    color: "green",
                    icon: <IconCheck />,
                    message: "A fiókod adatai sikeresen módosításra kerültek",
                });
                closeAllModals();
            }
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
            <LoadingOverlay visible={user.isLoading} />
            <TextInput label="Felhasználónév" required={true} {...form.getInputProps("userName")} mb="sm" />
            <TextInput label="E-mail" required={true} {...form.getInputProps("email")} mb="sm" />
            <PasswordInput label="Új jelszó" {...form.getInputProps("newPassword")} mb="sm" />
            <PasswordInput label="Új jelszó megerősítése" {...form.getInputProps("confirmNewPassword")} mb="sm" />
            {!isUserAdmin && <PasswordInput label="Jelenlegi jelszó" required={true} {...form.getInputProps("currentPassword")} mb="md" />}
            <Button type="submit" fullWidth={true} loading={updateUser.isLoading}>Mentés</Button>
        </form>
    );
};

const ProtectedNavbar = () => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const { toggleColorScheme } = useMantineColorScheme();

    const [active, setActive] = useState(0);

    const location = useLocation();

    useEffect(() => {
        if (location.pathname) {
            for (let i = 0; i < data.length; i++) {
                if (location.pathname.startsWith(data[i].path)) {
                    setActive(i);
                    break;
                }
            }
        }
    }, [location]);

    const user = useGetApiAuthUser();
    const isUserAdmin = useIsAdmin(user.data);

    const setIsAuthenticated = useApiStore((state) => state.setIsAuthenticated);
    const logoutMutation = useDeleteApiAuthLogout();

    const logout = async () => {
        try {
            await logoutMutation.mutateAsync();
        } finally {
            setIsAuthenticated(false);
        }
    };

    const openUpdateUserModal = () => {
        openModal({
            title: "Fiók kezelése",
            size: "lg",
            children: <UpdateUserModalContent />,
        });
    };

    const links = data.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            path={link.path}
        />
    ));

    return (
        <Navbar width={{ base: 80 }} p="md">
            <Center>
                <IconAtom size={32} />
            </Center>
            <Navbar.Section grow={true} mt="xl">
                <Stack justify="center" spacing={0}>
                    {links}
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <Stack justify="center" spacing={0}>
                    <Tooltip label="Téma váltás" position="right" transitionDuration={0}>
                        <UnstyledButton onClick={() => toggleColorScheme()} className={classes.link}>
                            <IconPaint stroke={1.5} />
                        </UnstyledButton>
                    </Tooltip>
                    <Tooltip label="Fiók" position="right" transitionDuration={0}>
                        <UnstyledButton onClick={openUpdateUserModal} className={classes.link}>
                            <Indicator disabled={!isUserAdmin}>
                                <IconUser stroke={1.5} />
                            </Indicator>
                        </UnstyledButton>
                    </Tooltip>
                    <Tooltip label="Kilépés" position="right" transitionDuration={0}>
                        <UnstyledButton onClick={logout} className={classes.logoutLink}>
                            <IconLogout stroke={1.5} color={theme.colors.red[6]} />
                        </UnstyledButton>
                    </Tooltip>
                </Stack>
            </Navbar.Section>
        </Navbar>
    );
};

const ProtectedLayout = () => {
    return (
        <AppShell navbar={<ProtectedNavbar />}>
            <Outlet />
        </AppShell>
    );
};

export default ProtectedLayout;
