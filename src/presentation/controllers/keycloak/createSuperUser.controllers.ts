import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import { generateJWT } from '../../../shared/utils/generateJTW';
import { encriptPassword } from '../../../shared/utils/encriptPassword';
import { getKeyFromUsedKeys, getInstitutionByKey, createUser, addUsedKey } from '../../../infrastructure/database/superUser.Queries';
import { validateRequiredField, validateFieldsMatch } from '../../../shared/utils/validateRequiredAndMatch';
import { redecokey } from '../../../shared/utils/redeco_key'; // ⚠️ No es necesario llamar loadKeys() aquí, ya se ejecutó en app.ts
import { AxiosError } from 'axios'; // Importa AxiosError
import { createUserInKeycloak } from '../KeyCloakServices/createUserKeyCloak'
import { assignARoleKC } from '../KeyCloakServices/assignRoleKC';
import { keycloakConfig } from '../../../infrastructure/config/keycloakConfig';

// Definir los tipos necesarios
type CreateSuperUserRequestBody = {
    key: string;
    username: string;
    password: string;
    confirm_password: string;
    system_key: number; // Este campo se menciona en la validación pero no se utiliza en el cuerpo de la solicitud.
};

type ValidationError = { field: string; message: string };

type Role = {
    id: string;
    name: string;
    composite: boolean;
    clientRole: boolean;
    containerId: string;
};




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
            errors.push({ field: 'key', message: `Ya fue creado un súper usuario utilizando esta key. cambio jenkins 26/03/25` });
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

        redecokey.push(key);
        const systemId = redecokey.includes(key) ? 'REDECO' : 'REDECO';

        const hashedPassword = encriptPassword(password);

        await addUsedKey(keyid, key, systemId);

        const institucionid = institution.institucionid;
        const institucionClave = institution.originalid;
        const denominacion_social = institution.denominacion_social;
        const sectorid = institution.sectorid;
        const sector = institution.sector;

        // Obtener token de Keycloak
        const tokenResponse = await axios.post(keycloakConfig.tokenUrl, new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: keycloakConfig.clientId,
            client_secret: keycloakConfig.clientSecret,
        }));

        const token = tokenResponse.data.access_token;


        // Crear usuario en Keycloak
        const idUserKeycloak = await createUserInKeycloak(
            keycloakConfig.adminUserUrl,
            key,
            password,
            username,
            institucionClave,
            institucionid,
            token
        );


        // Asignar rol al usuario creado
        await assignARoleKC(idUserKeycloak, token);
        console.log("prueba jenkins")



        // Agregar el usuario en la base de datos
        const newUser = await createUser(
            userid,
            username,
            hashedPassword,
            institution.institucionid,
            is_active,
            profileid,
            systemId
        );

        const userTokenResponse = await axios.post(keycloakConfig.tokenUrl, new URLSearchParams({
            grant_type: 'password',
            client_id: keycloakConfig.clientId,
            client_secret: keycloakConfig.clientSecret,
            username: username,
            password: password
        }));

        const userAccessToken = userTokenResponse.data.access_token;

        return response.status(200).json({
            status: "success",
            message: '¡El usuario ha sido creado exitosamente!',
            access_token: userAccessToken
        });

    } catch (error) {
        return response.status(500).json({
            status: "error",
            message: "Internal server error."
        });
    }
};
