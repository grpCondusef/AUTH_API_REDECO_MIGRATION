import axios from 'axios';
import { keycloakConfig } from '../../infrastructure/config/keycloakConfig';
import { validateRequiredField } from '../../shared/utils/validateRequiredAndMatch';
import { Request, Response } from 'express';

type CreateTokenKeycloakRequestBody = {
    username: string;
    password: string;
};

type ValidationError = { field: string; message: string };

// Función para obtener un token de Keycloak
export const getTokenFromKeycloak = async (request: Request, response: Response) => {
    const { username, password } = request.body as CreateTokenKeycloakRequestBody;
    const errors: ValidationError[] = [];
    
    // Validaciones iniciales
    validateRequiredField(username, 'username', errors);
    validateRequiredField(password, 'password', errors);

    if (errors.length > 0) {
        return response.status(400).json({
            status: "error",
            message: "Validation failed.",
            errors: errors
        });
    }

    // URL de autenticación de Keycloak
    const tokenUrl = `${keycloakConfig.authServerUrl.replace('/protocol/openid-connect/auth', '')}/protocol/openid-connect/token`;

    try {
        const keycloakResponse = await axios.post(
            tokenUrl,
            new URLSearchParams({
                client_id: keycloakConfig.clientId,
                client_secret: keycloakConfig.clientSecret,
                grant_type: 'password',
                username,
                password,
                scope: 'openid' // Agregar este scope para poder acceder a userinfo
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.status(200).json({
            status: "success",
            message: "Successfully generated Token.",
            data: {
                token: keycloakResponse.data.access_token
            }
        });

    } catch (error: any) {
        // Manejar el error si las credenciales no son válidas (invalid_grant)
        if (error.response && error.response.data && error.response.data.error === 'invalid_grant') {
            errors.push({ field: 'username o password', message: `Username does not exist or incorrect password.` });
        }
        if (errors.length > 0) {
            return response.status(401).json({
                status: "error",
                message: "Validation failed.",
                errors: errors
            });
        }

        // Si es otro tipo de error, como un problema interno, responder con el código 500
        return response.status(500).json({
            status: "error",
            message: "Internal server error."
            //details: error.response?.data || error.message || error
        });
    }
};
