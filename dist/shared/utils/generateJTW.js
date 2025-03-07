"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
const generateJWT = (uid = '', username = '', institucionid = '', institucionClave = '', denominacion_social = '', sectorid = '', sector = '', system = '', key = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid, username, institucionid, institucionClave, denominacion_social, sectorid, sector, system };
        jsonwebtoken_1.default.sign(payload, process.env.SECRETORPRIVATEKEY || '', {
            expiresIn: '30d'
        }, (error, token) => {
            if (error) {
                console.log(error);
                reject('No se pudo generar el JWT.');
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generateJWT = generateJWT;
