import { pool } from '../database/authDb'

export const userExists = async (username: string) => {
    const query = `
        SELECT U.userid, U.username, U."password", system, I.originalid, U.institucionid, U.is_active, I.denominacion_social, I.sectorid, I.sector
        FROM public.users U
        INNER JOIN public.instituciones_financieras I ON U.institucionid = I.institucionid
        WHERE username = $1
    `;
    const result = await pool.query(query, [username]);
    return result.rows[0];
    
};
