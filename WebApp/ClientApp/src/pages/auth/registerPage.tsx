import { Anchor, Button, Center, PasswordInput, Text, TextInput, Title, createStyles } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";

import { Link } from "react-router-dom";
import { ValidationError } from "../../utils/api";
import { camelize } from "../../utils/string";
import { useApiStore } from "../../stores/apiStore";
import { usePostApiAuthLogin } from "../../api/client/auth/auth";
import { usePostApiUsers } from "../../api/client/users/users";
import { z } from "zod";

const useStyles = createStyles((theme) => ({
    container: {
        height: "100vh",
    },
    form: {
        display: "flex",
        flexDirection: "column",

        width: "25vw",

        [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
            width: "35vw",
        },

        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            width: "45vw",
        },

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            width: "65vw",
        },

        [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
            width: "75vw",
        },
    },
}));

const RegisterPage = (): JSX.Element => {
    const { classes } = useStyles();

    const setIsAuthenticated = useApiStore((state) => state.setIsAuthenticated);
    const register = usePostApiUsers();
    const login = usePostApiAuthLogin();

    const form = useForm({
        initialValues: {
            email: "",
            userName: "",
            password: "",
            confirmPassword: "",
        },
        validate: zodResolver(z.object({
            password: z.string().min(8, "A jelszónak legalább 8 karakter hosszúnak kell lennie"),
            confirmPassword: z.string().min(8, "A jelszó megerősítésének legalább 8 karakter hosszúnak kell lennie"),
        }).refine((data) => data.password === data.confirmPassword, { message: "A megadott jelszavak nem egyeznek", path: ["confirmPassword"] }))
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await register.mutateAsync({ data: values, params: { confirmUrl: `${document.location.origin}/auth/confirmEmail` } });
            await login.mutateAsync({ data: { email: values.email, password: values.password } });

            setIsAuthenticated(true);
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
        <Center className={classes.container}>
            <form className={classes.form} onSubmit={submit}>
                <Title order={1} size="h2" align="center" mb="sm">
                    Regisztrálás
                </Title>
                <TextInput label="E-mail" required={true} type="email" {...form.getInputProps("email")} mb="sm" />
                <TextInput label="Felhasználónév" required={true} {...form.getInputProps("userName")} mb="sm" />
                <PasswordInput label="Jelszó" required={true} {...form.getInputProps("password")} mb="sm" />
                <PasswordInput label="Jelszó megerősítése" required={true} {...form.getInputProps("confirmPassword")} mb="md" />
                <Button type="submit" loading={register.isLoading} mb="sm">Regisztrálás</Button>
                <Text align="center">Már van fiókod? <Anchor component={Link} to="/auth/login">Lépj be itt</Anchor></Text>
                <Anchor align="center" component={Link} to="/">Vissza a kezdőlapra</Anchor>
            </form>
        </Center>
    );
};

export default RegisterPage;
