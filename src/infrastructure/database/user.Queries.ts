import { pool } from "../../infrastructure/database/authDb";

//CREAMOS EL REGISTRO EN BASE DE DATOS
export const addUser = async (userid: string, username: string, hashedPassword: string, institucionid: string, is_active: boolean, simpleProfileId: string, systemId: string ) => {
    const query = 
        `INSERT INTO public.users (userid, username, "password", institucionid, is_active, profileid, date, system) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7) RETURNING *
        `;
    const result = await pool.query(query, [userid, username, hashedPassword, institucionid, is_active, simpleProfileId, systemId]);
    return result.rows[0];
};

export const getInstitutiones = async (key: string) => {
    
    const query = `
        SELECT *
        FROM public.instituciones_financieras
        WHERE institucionid = $1
    `;
    const result = await pool.query(query, [key]);   
    return result.rows[0];
}; 