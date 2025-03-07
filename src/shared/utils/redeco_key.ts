import { pool } from "../../infrastructure/database/authDb";

// Definir el array de keys
export const redecokey: string[] = [];

// Función para cargar las keys al array
export const loadKeys = async () => {
    try {
        const query = `
            SELECT "key"
            FROM public.used_keys
        `;
        const result = await pool.query(query);

        // Limpiar el array y llenarlo con las nuevas keys
        redecokey.length = 0; // Asegurar que el array no tenga datos previos
        result.rows.forEach((row: { key: string }) => {
            redecokey.push(row.key);
        });

        console.log("✅ Keys cargadas exitosamente");
    } catch (error) {
        console.error(" Error al cargar las keys:", error);
    }
};

// Llamar a la función cuando se importa el archivo
loadKeys();
