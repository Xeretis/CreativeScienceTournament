import { Badge, Box, Card, Group, Text, createStyles } from "@mantine/core";

import { IconUserCheck } from "@tabler/icons-react";
import { UserResponseTeamUser } from "../api/client/model";

const useStyles = createStyles((theme) => ({}));

export const TeamMemberCard = ({ teamMember, teamCreator }: { teamMember: UserResponseTeamUser, teamCreator: string }): JSX.Element => {
    const { classes } = useStyles();

    return (
        <Card shadow="sm" p="md" radius="md">
            <Group position="apart">
                <Group position="apart" spacing="xs">
                    <Text size="xl" weight={600} truncate={true}>{teamMember.userName}</Text>
                    {teamMember.id === teamCreator && <Badge color="green">Létrehozó</Badge>}
                </Group>
                <IconUserCheck />
            </Group>
        </Card>
    );
};
