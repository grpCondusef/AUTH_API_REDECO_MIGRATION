import { Request, Response } from 'express';
import { getUserProfile,getUserByUsername, deleteUser, getUsersByInstitution, getKeyForInstitution, deleteUsedKey } from '../../infrastructure/database/delete.Queries'

type DeleteUserRequestBody = {
    username: string;
}; 

type ValidationError = { field: string; message: string };

export const deleteUSer = async (request: Request, response: Response) => {
    const { uid, denominacion_social, institucionid } = request.body.user;
    const { username } = request.body as DeleteUserRequestBody;
    const errors: ValidationError[] = [];

    try {
        // ====================== VALIDAR AL SUPER USUARIO ====================== 
        const superUserValidation = await getUserProfile(uid);
        if (superUserValidation.rows.length === 0) {
            errors.push({ field: 'username', message: `El usuario no existe.` });
        }

        const profileid: string = superUserValidation.rows[0].profileid;

        // VERIFICAR QUE EL USUARIO TIENE EL PERFIL PARA EDITAR EL ESTATUS DE UN USUARIO NORMAL
        if (profileid !== "2") {
            errors.push({ field: 'username', message: `El usuario no tiene permisos para realizar esta acción.` });
        }

        // ====================== VALIDAR AL USUARIO QUE VA A SER ELIMINAR ====================== 
        const userExists = await getUserByUsername(username);
        if (userExists.rows.length === 0) {
            errors.push({ field: 'username', message: `El usuario no existe.` });
        }

        if (errors.length > 0) {
            return response.status(400).json({
                status: "error",
                message: "Validation failed.",
                errors: errors
            });
        }

        const perfilUser: number = userExists.rows[0].profileid;

        //eliminacion de usuario
        if (perfilUser==1){
        await deleteUser(username);
        return response.status(200).json({
            status: "success",
            message: `Se ha dado de baja al usuario ${username} de forma correcta.`,
        });
    } else {

    //Eliminacion de superusuario
    if (perfilUser==2){
        
        const nUsuarios = await getUsersByInstitution(institucionid);

        if(!nUsuarios.rows[0]){
            const keyDelete = await getKeyForInstitution(denominacion_social);
            await deleteUser(username);
            await deleteUsedKey(keyDelete.rows[0].key);
        return response.status(200).json({
            status: "success",
            message: `Se ha dado de baja al superusuario ${username} de forma correcta.`,
        });
        
        }else{
            errors.push({ field: 'username', message: `Antes de eliminar el superusuario debe eliminar todos sus usuarios.` });
            return response.status(400).json({
                status: "error",
                message: "Validation failed.",
                errors: errors
            });
        }
    }
}

    } catch (error) {
        return response.status(500).json({
            status: "error",
            message: "Internal server error."
        });
    }
};
