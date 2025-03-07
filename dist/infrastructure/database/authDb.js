"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv")); // PARA TRABAJAR CON LAS VARIABLES DE ENTORNO
dotenv_1.default.config(); //PARA OBTENER LAS VARIABLES DE ENTORNO
const pg_1 = require("pg");
;
// CARGA DE CONFIGURACIÓN PARA VARIANLES DE ENTORNO EN AMBIENTE DEV
const dbConfig = {
    database: process.env.DB_NAME || "auth_y",
    user: process.env.adminauth || "adminauth",
    host: process.env.HOST || "10.33.1.249",
    password: process.env.PASSWORD || "0neOne$1",
    port: Number(process.env.DBPORT) || 5432 // El puerto por defecto de PostgreSQL es el 5432
};
exports.pool = new pg_1.Pool(dbConfig);
console.log(`Conectado a la base de datos ${dbConfig.database} en ${dbConfig.host}:${dbConfig.port}`);
