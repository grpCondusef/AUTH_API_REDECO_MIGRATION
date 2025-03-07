import jwt from 'jsonwebtoken';
/**
 * Genera un token JWT con un payload específico.
 * @param uid - ID del usuario.
 * @param username - Nombre del usuario.
 * @param institucionid - ID de la institución.
 * @param institucionClave - Clave de la institución.
 * @param denominacion_social - Denominación social de la institución.
 * @param sectorid - ID del sector.
 * @param sector - Nombre del sector.
 * @param system - Sistema asociado.
 * @param key - Clave del sistema.
 * @returns Una promesa que resuelve con el token JWT.
 */
export const generateJWT = (
    uid: string = '',
    username: string = '',
    institucionid: string = '',
    institucionClave: string = '',
    denominacion_social: string = '',
    sectorid: string = '',
    sector: string = '',
    system: string = '',
    key: string = ''
):Promise<string> => {
    return new Promise((resolve, reject) => {

        const payload = { uid, username, institucionid, institucionClave, denominacion_social, sectorid, sector, system }
        
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY|| '', {
            expiresIn: '30d'
        }, (error, token) => {

            if (error) {
                console.log(error)
                reject('No se pudo generar el JWT.')
            } else {
                resolve(token as string)
            }
        })
    })
}
