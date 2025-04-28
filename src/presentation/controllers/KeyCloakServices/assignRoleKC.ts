import axios from 'axios';

export const assignARoleKC = async (
    idUserKeycloak: string,
    token: string
): Promise<void> => {
    try {
        await axios.post(
            `http://10.33.200.72:8180/admin/realms/API_REDECO/users/${idUserKeycloak}/role-mappings/clients/1a3b7e4a-a0c5-44bb-9ad5-12887365d19a`,
            [
                {
                    "id": "92f33122-9ee3-4205-82b9-c1aca5774a45",
                    "name": "superUser",
                    "description": "",
                    "composite": false,
                    "clientRole": true,
                    "containerId": "1a3b7e4a-a0c5-44bb-9ad5-12887365d19a"
                }
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
