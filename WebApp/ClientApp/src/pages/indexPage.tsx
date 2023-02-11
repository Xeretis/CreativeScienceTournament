import { Box, Button, Group, Text, Title, createStyles, keyframes, useMantineTheme } from "@mantine/core";

import { ColorSchemeToggle } from "../components/colorSchemeToggle";
import { IconAtom } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const float = keyframes({
    "0%": {
        transform: "translate(25%, 45%)"
    },
    "50%": {
        transform: "translate(25%, 55%)",
    },
    "100%": {
        transform: "translate(25%, 45%)"
    }
});

const useStyles = createStyles((theme) => ({
    header: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
    },
    title: {
        wordSpacing: "100vw",
        fontSize: "8vw",

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            fontSize: "10vw",
            textAlign: "center",
        }
    },
    titleContainer: {
        display: "flex",
        justifyContent: "felx-start",
        alignItems: "center",
        height: "100vh",
    },
    icon: {
        position: "fixed",
        right: "20%",
        bottom: "50%",
        height: "auto",
        width: "30vw",
        color: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3],
        animation: `${float} 6s ease-in-out infinite`,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            display: "none",
        }
    }
}));

const IndexPage = (): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    return (
        <>
            <Box className={classes.header} p="sm">
                <Group position="apart">
                    <ColorSchemeToggle />
                    <Group>
                        <Button component={Link} to="/auth/login">Belépés</Button>
                        <Button component={Link} to="/auth/register">Regisztrálás</Button>
                    </Group>
                </Group>
            </Box>
            <Box className={classes.titleContainer} p="xl">
                <Title order={1} className={classes.title}><Text inherit={true} component="span" color={theme.primaryColor}>K</Text>reatív <Text inherit={true} component="span" color={theme.primaryColor}>T</Text>ermészet- <Text inherit={true} component="span" color={theme.primaryColor}>T</Text>udományi <Text inherit={true} component="span" color={theme.primaryColor}>V</Text>etélkedő</Title>
            </Box>
            <IconAtom stroke={1.5} className={classes.icon} />
        </>
    );
};

export default IndexPage;
