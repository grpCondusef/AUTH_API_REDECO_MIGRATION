import axios from 'axios';

export const assignARoleKC = async (
    idUserKeycloak: string,
    token: string
): Promise<void> => {
    try {
        await axios.post(
            `http://10.33.21.86:8090/admin/realms/API_REDECO/users/${idUserKeycloak}/role-mappings/clients/673b301d-72cd-4025-abfa-c24992ebeba5`,
            [
                {
                    id: "38e000ef-24c6-483e-9314-cfbbba06796a",
                    name: "super_user_role",
                    composite: false,
                    clientRole: true,
                    containerId: "673b301d-72cd-4025-abfa-c24992ebeba5",
                },
            ],
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('Error inesperado al asignar rol:', error);
        throw new Error(`Error al asignar un rol al usuario en Keycloak`);
    }
};
