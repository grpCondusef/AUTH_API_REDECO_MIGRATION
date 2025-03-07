import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { generateJWT } from '../../shared/utils/generateJTW';
import { encriptPassword } from '../../shared/utils/encriptPassword';
import { getKeyFromUsedKeys, getInstitutionByKey, createUser, addUsedKey } from '../../infrastructure/database/superUser.Queries';
import { validateRequiredField, validateFieldsMatch } from '../../shared/utils/validateRequiredAndMatch';
import { redecokey } from '../../shared/utils/redeco_key'; // ⚠️ No es necesario llamar loadKeys() aquí, ya se ejecutó en app.ts

type CreateSuperUserRequestBody = {
    key: string;
    username: string;
    password: string;
    confirm_password: string;
    system_key: number;
};

type ValidationError = { field: string; message: string };

export const createSuperUser = async (request: Request, response: Response) => {
    const { key, username, password, confirm_password } = request.body as CreateSuperUserRequestBody;
    const errors: ValidationError[] = [];

    try {
        // Validaciones iniciales
        validateRequiredField(key, 'key', errors);
        validateRequiredField(username, 'username', errors);
        validateRequiredField(password, 'password', errors);
        validateRequiredField(confirm_password, 'confirm_password', errors);
        validateFieldsMatch(password, confirm_password, 'password', 'confirm_password', errors);

        const institution = await getInstitutionByKey(key);
        if (key && (!institution || !key)) {
            errors.push({ field: 'key', message: `La key proporcionada no es válida.` });
        }

        const existingKey = await getKeyFromUsedKeys(key);
        if (key && existingKey) {
            errors.push({ field: 'key', message: `Ya fue creado un súper usuario utilizando esta key.` });
        }
        
        if (errors.length > 0) {
            return response.status(400).json({
                status: "error",
                message: "Validation failed.",
                errors: errors
            });
        }

        const userid = uuidv4();
        const keyid = uuidv4();
        const is_active = true;
        const profileid = '2';

        console.log("🔹 Validando key en redecokey:", redecokey,
            key
        );
        redecokey.push(key)
        const systemId = redecokey.includes(key) ? 'REDECO' : 'REUNE';

        const hashedPassword = encriptPassword(password);

        const newUser = await createUser(
            userid,
            username,
            hashedPassword,
            institution.institucionid,
            is_active,
            profileid,
            systemId
        );

        await addUsedKey(keyid, key, systemId);

        const institucionid = institution.institucionid;
        const institucionClave = institution.originalid;
        const denominacion_social = institution.denominacion_social;
        const sectorid = institution.sectorid;
        const sector = institution.sector;

        const token_access = await generateJWT(
            userid,
            username,
            institucionid,
            institucionClave,
            denominacion_social,
            sectorid,
            sector,
            systemId,
            key
        );

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
