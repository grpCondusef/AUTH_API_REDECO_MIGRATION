import axios from 'axios';

export const createUserInKeycloak = async (
    keycloalCreateUserURL: string,
    key: string,
    password: string,
    username: string,
    institucionClave: string,
    institucionid: string,
    token: string
) => {
    try {
        const response = await axios.post(keycloalCreateUserURL, {
            attributes: { key },
            credentials: [
                {
                    temporary: false,
                    type: "password",
                    value: password, // La contraseña del nuevo usuario
                }
            ],
            username,  // Nombre de usuario
            firstName: institucionClave, // Primer nombre
            lastName: institucionid, // Apellido
            email: "testadmin1test@gmail.com", // Correo electrónico
            enabled: true,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const locationHeader = response.headers.location;
        const idUserKeycloak = locationHeader.split('/').pop();

        return idUserKeycloak;
    } catch (error) {
        console.error('Error inesperado:', error);
        throw new Error("Error al crear al usuario en Keycloak");
    }
};
