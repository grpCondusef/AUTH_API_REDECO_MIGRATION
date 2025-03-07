import { pool } from '../database/authDb'

export const userExistQuery = async (username: string) => {
    const query = `
    SELECT userid, username, institucionid, is_active, profileid 
    FROM public.users 
    WHERE LOWER(username) = LOWER($1)
    `;
    const result = await pool.query(query, [username]);
    return result.rows[0]; 
};
