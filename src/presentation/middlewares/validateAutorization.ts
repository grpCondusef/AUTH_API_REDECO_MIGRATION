import { Request, Response, NextFunction } from 'express';
import { validateTokenKeycloak } from '../middlewares/validateTkeycloak';

export const validateAuthorizationHeader = async (request: Request, response: Response, next: NextFunction) => {
    type ValidationError = { field: string; message: string };
    const errors: ValidationError[] = [];

    try {
        const clientToken = request.headers.authorization?.split(' ')[1];
        if (!clientToken) {
            errors.push({ field: 'Authorization', message: `Token no proporcionado en la cabecera Authorization.` });
            return response.status(400).json({
                status: "error",
                message: "Validation failed.",
                errors: errors
            });
        }
    
        const isTokenValid = await validateTokenKeycloak(clientToken);
            if (!isTokenValid) {
                errors.push({ field: 'Authorization', message: `El Token no es válido en Keycloak.` });
                return response.status(400).json({
                    status: "error",
                    message: "Validation failed.",
                    errors: errors
                });
            }
        request.body.clientToken = clientToken; // Pasar el token a la request para su uso posterior
        next();
    } catch (error) {
        return response.status(500).json({
            status: "error",
            message: "Internal server error."
        });
    }
};
