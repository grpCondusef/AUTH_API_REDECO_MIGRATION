import bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import { userExists } from '../../infrastructure/database/updateToken.Queries';
import { validateRequiredField } from '../../shared/utils/validateRequiredAndMatch';
import { generateJWT } from '../../shared/utils/generateJTW';

type UpdateTokenBody = {
    username: string;
    password: string;
};

type ValidationError = { field: string; message: string };

export const updateToken = async (request: Request, response: Response) => {
    const { username, password } = request.body as UpdateTokenBody;
    const errors: ValidationError[] = [];

    try {
        // Validaciones iniciales
        validateRequiredField(username, 'username', errors);
        validateRequiredField(password, 'password', errors);
        
        const user = await userExists(username);
        if (!user) {
            errors.push({ field: 'username', message: `El usuario no existe para el sistema.` });
            return response.status(400).json({ errors });
        }
        
        if (errors.length > 0) {
            return response.status(400).json({
                status: "error",
                message: "Validation failed.",
                errors: errors
            });
        }

        const userDataFromDb = user;

        const { 
            userid: userId, 
            institucionid: institucionId, 
            originalid: express, 
            denominacion_social, 
            sectorid, 
            sector, 
            system, 
            password: hashedPassword 
        } = userDataFromDb;

        // ======================  VALIDAR LA CONTRASEÑA DEL USUARIO ====================== 
        const validPassword = bcryptjs.compareSync(password, hashedPassword);
        if (!validPassword) {
            errors.push({ field: 'password', message: `La contraseña es incorrecta.` });
            return response.status(400).json({ errors });
        }
        if (errors.length > 0) {
            return response.status(400).json({
                status: "error",
                message: "Validation failed.",
                errors: errors
            });
        }

        // ====================== GENERAR EL JWT ======================
        const token = await generateJWT(userId, username, institucionId, express, denominacion_social, sectorid, sector, system);

        const userData = {
            token_access: token,
            username: userDataFromDb.username
        };

        return response.status(200).json({
            status: "success",
            msg: 'Successful Token Renewal.',
            user: userData
        });

    } catch (error) {
        return response.status(500).json({
            status: "error",
            message: "Internal server error."
        });
    }
};
