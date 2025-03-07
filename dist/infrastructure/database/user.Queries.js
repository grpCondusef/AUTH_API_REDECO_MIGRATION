"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstitutiones = exports.addUser = void 0;
const authDb_1 = require("../../infrastructure/database/authDb");
//CREAMOS EL REGISTRO EN BASE DE DATOS
const addUser = (userid, username, hashedPassword, institucionid, is_active, simpleProfileId, systemId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `INSERT INTO public.users (userid, username, "password", institucionid, is_active, profileid, date, system) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7) RETURNING *
        `;
    const result = yield authDb_1.pool.query(query, [userid, username, hashedPassword, institucionid, is_active, simpleProfileId, systemId]);
    return result.rows[0];
});
exports.addUser = addUser;
const getInstitutiones = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        SELECT institucionid
        FROM public.instituciones_financieras
        WHERE institucionid = $1
    `;
    const result = yield authDb_1.pool.query(query, [key]);
    return result.rows[0];
});
exports.getInstitutiones = getInstitutiones;
