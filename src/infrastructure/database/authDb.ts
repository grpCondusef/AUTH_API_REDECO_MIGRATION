import  dotenv  from 'dotenv'; // PARA TRABAJAR CON LAS VARIABLES DE ENTORNO
dotenv.config() //PARA OBTENER LAS VARIABLES DE ENTORNO
import { Pool } from 'pg';


// DECLARACIÓN DE VARIABLES PARA LA CONEXIÓN
interface DatabaseConfig {
database: string;
user: string;
host: string;
password: string;
port: number;
};

// CARGA DE CONFIGURACIÓN PARA VARIANLES DE ENTORNO EN AMBIENTE DEV
const dbConfig: DatabaseConfig = {
    database: process.env.DB_NAME || "auth_y",
    user: process.env.adminauth || "adminauth",
    host: process.env.HOST || "10.33.1.251",
    password: process.env.PASSWORD || "0neOne$1",
    port: Number(process.env.DBPORT) || 5432 // El puerto por defecto de PostgreSQL es el 5432
};

export const pool = new Pool(dbConfig);
console.log(`Conectado a la base de datos ${dbConfig.database} en ${dbConfig.host}:${dbConfig.port}`);