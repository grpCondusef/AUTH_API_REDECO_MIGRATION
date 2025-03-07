import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { pool } from '../../infrastructure/database/authDb';

interface DecodedToken {
    uid: string;
    username: string;
    institucionid: string;
    institucionClave: string;
    denominacion_social: string;
    sectorid: string;
    sector: string;
    exp: number;
};

type ValidationError = { field: string; message: string };

export const validarJWT = async (request: Request, response: Response, next: NextFunction) => {
    const token = request.header('Authorization');
    const errors: ValidationError[] = [];

    // Verificar que el token exista en la petición
    if (!token) {
        errors.push({ field: 'Authorization', message: `La key proporcionada no es válida.` });
        return response.status(401).json({
            status: "error",
            message: "Validation failed.",
            errors: errors
        });
    }

    try {
        // Verificar el token y obtener los datos decodificados
        const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY || '') as DecodedToken;

        // Validar si el token ha expirado
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime >= decoded.exp) {
            errors.push({ field: 'Authorization', message: `El token ha expirado, se tiene que realizar la renovación.` });
        }
        if (errors.length > 0) {
            return response.status(400).json({
                status: "error",
                message: "Validation failed.",
                errors: errors
            });
        }
        // Añadir los datos del token a una propiedad personalizada del request
        request.body.user = {
            uid: decoded.uid,
            username: decoded.username,
            institucionid: decoded.institucionid,
            institucionClave: decoded.institucionClave,
            denominacion_social: decoded.denominacion_social,
            sectorid: decoded.sectorid,
            sector: decoded.sector,
        };

        // Verificar si el usuario está activo en la base de datos
        const userQuery = `
            SELECT * 
            FROM public.users 
            WHERE userid = $1
        `;
        const userData = await pool.query(userQuery, [decoded.uid]);

        const user = userData.rows[0];
        
        if (!user?.is_active) {
            errors.push({ field: 'username', message: `El usuario no está activo.` });
        }
        if (errors.length > 0) {
            return response.status(400).json({
                status: "error",
                message: "Validation failed.",
                errors: errors
            });
        }

        // Adjuntar información del usuario a una propiedad personalizada del request
        request.body.user = { ...request.body.user, ...user };

        // Continuar con la ejecución de la ruta
        next();
    } catch (error) {
        return response.status(500).json({
            status: "error",
            message: "Internal server error."
        });
    }
};
