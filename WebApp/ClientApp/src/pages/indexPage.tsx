import { Button, Center, createStyles } from "@mantine/core";

import { Link } from "react-router-dom";

const useStyles = createStyles(() => ({
    container: {
        height: "100vh",
    }
}));

const IndexPage = (): JSX.Element => {
    const { classes } = useStyles();

    return (
        <Center className={classes.container}>
            <Button component={Link} to="/auth/login">
                Login
            </Button>
            <Button component={Link} to="/auth/register">
                Register
            </Button>
        </Center>
    );
};

export default IndexPage;
