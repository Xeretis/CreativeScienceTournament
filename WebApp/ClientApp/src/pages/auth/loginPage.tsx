import { Anchor, Button, Center, PasswordInput, Text, TextInput, Title, createStyles } from "@mantine/core";

import { Link } from "react-router-dom";
import { ValidationError } from "../../utils/api";
import { camelize } from "../../utils/string";
import { useApiStore } from "../../stores/apiStore";
import { useForm } from "@mantine/form";
import { usePostApiAuthLogin } from "../../api/client/auth/auth";

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

const LoginPage = (): JSX.Element => {
    const { classes } = useStyles();

    const setIsAuthenticated = useApiStore((state) => state.setIsAuthenticated);
    const login = usePostApiAuthLogin();

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
    });

    const submit = form.onSubmit(async (values) => {
        try {
            await login.mutateAsync({ data: values });
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
                    Belépés
                </Title>
                <TextInput label="E-mail" required={true} type="email" {...form.getInputProps("email")} mb="sm" />
                <PasswordInput label="Jelszó" required={true} {...form.getInputProps("password")} mb="md" />
                <Button type="submit" loading={login.isLoading} mb="sm">Belépés</Button>
                <Text align="center">Még nincs fiókod? <Anchor component={Link} to="/auth/register">Regisztrálj itt</Anchor></Text>
                <Anchor align="center" component={Link} to="/">Vissza a kezdőlapra</Anchor>
            </form>
        </Center>
    );
};

export default LoginPage;
