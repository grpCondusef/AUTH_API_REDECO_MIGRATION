import bcryptjs from 'bcryptjs';

/**
 * Encripta una contraseña utilizando bcryptjs.
 * @param password - La contraseña en texto plano que será encriptada.
 * @returns La contraseña encriptada como un string.
 */

export const encriptPassword = (password:string):string => { 
    //ENCRIPTAR LA CONTRASEÑA DEL USUARIO
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    return hashedPassword
}