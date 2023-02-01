import { IconX } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";

export class ValidationError {
    public constructor(public readonly message: string, public readonly errors: { [key: string]: string[] }) {}
}

export class NotFoundError {
    public constructor(public readonly message: string) {}
}

export const handleApiErrors = (error: any) => {
    switch (error.status) {
    case 400:
        throw new ValidationError(error.data.message ?? "Validációs hiba történt", error.data.errors ?? []);
    case 401:
        showNotification({
            title: "Hiba (401)",
            color: "red",
            icon: <IconX />,
            message: "Lejárt a munkameneted. Kérlek lépj be újra.",
        });
        break;
    case 403:
        showNotification({
            title: "Hiba (403)",
            color: "red",
            icon: <IconX />,
            message: "Nincs jogosultságod a kérés végrehajtásához.",
        });
        break;
    case 404:
        throw new NotFoundError(error.message);
    case 429:
        showNotification({
            title: "Hiba (429)",
            color: "red",
            icon: <IconX />,
            message: "Túl sok kérés. Kérlek próbáld újra később.",
        });
        break;
    case 500:
        showNotification({
            title: "Hiba (500)",
            color: "red",
            icon: <IconX />,
            message: "Szerverhiba. Kérlek próbáld újra később.",
        });
        break;
    default:
        showNotification({
            title: "Hiba",
            color: "red",
            icon: <IconX />,
            message: "Egy ismeretlen hiba történt.",
        });
        break;
    }
};
