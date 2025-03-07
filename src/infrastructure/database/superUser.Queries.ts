import { pool } from "../../infrastructure/database/authDb";

// Query para saber si una Key ya fue utilizada.
export const getKeyFromUsedKeys = async (key: string) => {
    const query = `
        SELECT "key"
        FROM public.used_keys
        WHERE "key" = $1
    `;
    const result = await pool.query(query, [key]);
    return result.rows[0];
};

// Query para saber si una Key es válida.
export const getInstitutionByKey = async (key: string) => {
    
    const query = `
        SELECT institucionid, originalid, denominacion_social, sectorid, sector
        FROM public.instituciones_financieras
        WHERE redeco_key = $1
    `;
    const result = await pool.query(query, [key]);
    return result.rows[0];
};

// Query para agregar el usuario creado.
export const createUser = async (userid: string, username: string, hashedPassword: string, institucionid: string, is_active: true, profileid: string, systemId: string) => {
    const query = `
        INSERT INTO public.users
        (userid, username, "password", institucionid, is_active, profileid, date, system)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7) RETURNING *
    `;
    const result = await pool.query(query, [userid, username, hashedPassword, institucionid, is_active, profileid, systemId]);
    return result.rows[0];
    
};


// Query para agregar la key usada.
export const addUsedKey = async (keyid: string, key: string, systemId: string) => {
    const query = `
        INSERT INTO public.used_keys
        (usedkeyid, "key", date, system)
        VALUES ($1, $2, NOW(), $3) RETURNING *
    `;
    const result = await pool.query(query, [keyid, key, systemId]);
    return result.rows[0];
};

