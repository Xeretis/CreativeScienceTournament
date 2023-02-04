import { Badge, Box, Card, Group, Text, createStyles, useMantineTheme } from "@mantine/core";
import { IconTools, IconUserCheck } from "@tabler/icons-react";

import { UserResponseTeamUser } from "../api/client/model";

const useStyles = createStyles((theme) => ({}));

export const TeamMemberCard = ({ teamMember, teamCreator }: { teamMember: UserResponseTeamUser, teamCreator: string }): JSX.Element => {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    return (
        <Card shadow="sm" p="md" radius="md" withBorder={theme.colorScheme !== "dark"}>
            <Group position="apart">
                <Group position="apart" spacing="xs">
                    <Text size="xl" weight={600} truncate={true}>{teamMember.userName}</Text>
                    {teamMember.id === teamCreator && <IconTools stroke={1.5} />}
                </Group>
                <IconUserCheck />
            </Group>
        </Card>
    );
};
