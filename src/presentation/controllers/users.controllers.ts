import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { addUser, getInstitutiones } from '../../infrastructure/database/user.Queries';
import { generateJWT } from '../../shared/utils/generateJTW';
import { encriptPassword } from '../../shared/utils/encriptPassword';
import { validateRequiredField, validateFieldsMatch } from '../../shared/utils/validateRequiredAndMatch';

type CreateUserRequestBody = {
    username: string;
    password: string;
    confirm_password: string;
}; 

type ValidationError = { field: string; message: string };

export const createUser = async (request: Request, response: Response) => {
    
    const { institucionid, profileid, system } = request.body.user;
    const { username, password, confirm_password } = request.body as CreateUserRequestBody;
    const errors: ValidationError[] = [];
    
    // Validar campos
    validateRequiredField(username, 'username', errors);
    validateRequiredField(password, 'password', errors);
    validateRequiredField(confirm_password, 'confirm_password', errors);
    validateFieldsMatch(password, confirm_password, 'password', 'confirm_password', errors);

    // Si hay errores de validación, retornarlos
    if (errors.length > 0) {
        return response.status(400).json({
            status: "error",
            message: "Validation failed.",
            errors: errors
        });
    };

    // Validar permisos del usuario autenticado
    if (profileid !== "2") {
        errors.push({ field: 'key', message: `Su usuario no cuenta con los permisos requeridos para crear un nuevo usuario.` });
        return response.status(400).json({
                status: "error",
                message: "Validation failed.",
                errors: errors
            });
    };
    
    // Crear el usuario en la base de datos
    try {
        // Generar UUID y otros valores
        const userid = uuidv4();
        const is_active = true;
        const simpleProfileId = "1";

        // Encriptar contraseña
        const hashedPassword = encriptPassword(password);

        // Crear el usuario en la base de datos
        const newUser = await addUser(
            userid,
            username,
            hashedPassword,
            institucionid,
            is_active,
            simpleProfileId,
            system
        );

        // Consultar detalles de la institución
        const institution = await getInstitutiones(institucionid);

        // Validar si la institución existe
        if (!institution) {
            errors.push({ field: 'key', message: `No se encontró la institución financiera asociada.` });
            return response.status(400).json({
                status: "error",
                message: "Validation failed.",
                errors: errors
            });
        }

        // Extraer datos de la institución
        //const institucionid = institution.institucionid
        const institucionClave = institution.originalid
        const denominacion_social = institution.denominacion_social
        const sectorid = institution.sectorid
        const sector = institution.sector

        // Generar token JWT
        const token_access = await generateJWT(
            userid,
            username,
            institucionid,
            institucionClave,
            denominacion_social,
            sectorid,
            sector,
            system
        );

        // Responder con el nuevo usuario y el token
        return response.status(200).json({
            status: "success",
            message: '¡El usuario ha sido creado exitosamente!',
            data: {
                ...newUser,
                token_access,
            },
        });
    } catch (error) {
        return response.status(500).json({
            status: "error",
            message: "Internal server error."
        });
    }
};