import axios from 'axios';

export const assignARoleKC = async (
    idUserKeycloak: string,
    token: string
): Promise<void> => {
    try {
        await axios.post(
            `http://10.33.200.72:8180/admin/realms/API_REDECO/users/${idUserKeycloak}/role-mappings/clients/b7687aaf-c575-432f-83da-17613490feb8`,
            [
                {
                    "id": "c1d04bc1-c4d7-44ae-b466-ea18f954975e",
                    "name": "super_user",
                    "description": "",
                    "composite": false,
                    "clientRole": true,
                    "containerId": "b7687aaf-c575-432f-83da-17613490feb8"
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
