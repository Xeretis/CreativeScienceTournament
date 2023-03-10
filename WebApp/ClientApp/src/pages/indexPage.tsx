import { ActionIcon, Box, Button, Center, Group, Text, Title, createStyles, keyframes, useMantineTheme } from "@mantine/core";
import { IconAtom, IconBrandGithub } from "@tabler/icons-react";

import { ColorSchemeToggle } from "../components/colorSchemeToggle";
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
        position: "absolute",
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
    aboutContainer: {
        height: "100vh",
        flexDirection: "column",
        position: "relative",
    },
    icon: {
        position: "absolute",
        right: "20%",
        bottom: "50%",
        height: "auto",
        width: "30vw",
        color: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3],
        animation: `${float} 6s ease-in-out infinite`,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            display: "none",
        }
    },
    githubIcon: {
        position: "absolute",
        bottom: theme.spacing.sm,
        right: theme.spacing.sm,
    }
}));

const IndexPage = (): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const downloadAbout = async () => {
        const a = document.createElement("a");
        const file = window.URL.createObjectURL(await (await fetch(`${document.location.origin}/Static/versenyfelhivas.pdf`)).blob());
        a.href = file;
        a.download = "versenyfelhivas.pdf";
        a.click();
    };

    return (
        <>
            <Box className={classes.header} p="sm">
                <Group position="apart">
                    <ColorSchemeToggle />
                    <Group>
                        <Button component={Link} to="/auth/login">Bel??p??s</Button>
                        <Button component={Link} to="/auth/register">Regisztr??l??s</Button>
                    </Group>
                </Group>
            </Box>
            <Box className={classes.titleContainer} p="xl">
                <Title order={1} className={classes.title}><Text inherit={true} component="span" color={theme.primaryColor}>K</Text>reat??v <Text inherit={true} component="span" color={theme.primaryColor}>T</Text>erm??szet- <Text inherit={true} component="span" color={theme.primaryColor}>T</Text>udom??nyi <Text inherit={true} component="span" color={theme.primaryColor}>V</Text>et??lked??</Title>
            </Box>
            <IconAtom stroke={1.5} className={classes.icon} />
            <Center className={classes.aboutContainer} p="xl">
                <Title order={1} mb="sm">A KTTV-r??l</Title>
                <Text align="center" size="xl" mb="sm">Verseny??nkkel szeretn??nk lehet??s??get adni arra, hogy a tehets??ges, illetve a fizika ??s a k??mia ir??nt ??rdekl??d?? di??kok ??j tud??st szerezhessenek, a m??r megl??v?? tud??sukat elm??ly??thess??k ??s megmutathass??k. A verseny c??lja tov??bb?? az is, hogy csapatk??nt k??z??sen foglalkozzatok nem felt??tlen??l csak sz??m??t??si, vagy tesztk??rd??sszer?? feladatokkal, hanem olyan kreat??v feladatokkal is, amelyekben valamilyen k??s??rletet kell otthon elv??geznetek, valamit ki kell der??tenetek, vagy valami eg??szen m??s, term??szettudom??nnyal kapcsolatos jelens??get kell megfigyelnetek, dokument??lnotok.</Text>
                <Button variant="outline" onClick={downloadAbout}>Versenyfelh??v??s let??lt??se</Button>
                <ActionIcon className={classes.githubIcon} component="a" href="https://github.com/Xeretis/CreativeScienceTournament" target="_blank" variant="transparent">
                    <IconBrandGithub size={48} />
                </ActionIcon>
            </Center>
        </>
    );
};

export default IndexPage;
