import { pool } from './authDb';

export const getUserProfile = async (uid: string) => {
    return await pool.query(
        `SELECT profileid, is_active FROM public.users WHERE userid = $1`,
        [uid]
    );
};

export const getUserByUsername = async (username: string) => {
    return await pool.query(
        `SELECT username, profileid FROM public.users WHERE username = $1`,
        [username]
    );
};

export const deleteUser = async (username: string) => {
    return await pool.query(
        `DELETE FROM public.users WHERE username = $1`,
        [username]
    );
};

export const getUsersByInstitution = async (institucionid: string) => {
    return await pool.query(
        `SELECT profileid FROM public.users WHERE profileid = '1' and institucionid = $1`,
        [institucionid]
    );
};

export const getKeyForInstitution = async (denominacion_social: string) => {
    return await pool.query(
        `SELECT k."key", i.institucionid, i.denominacion_social
         FROM public.instituciones_financieras i
         INNER JOIN public.used_keys k 
         ON i.redeco_key = k."key"
         WHERE i.denominacion_social = $1`,
        [denominacion_social]
    );
};

export const deleteUsedKey = async (key: string) => {
    return await pool.query(
        `DELETE FROM public.used_keys WHERE "key" = $1`,
        [key]
    );
};

