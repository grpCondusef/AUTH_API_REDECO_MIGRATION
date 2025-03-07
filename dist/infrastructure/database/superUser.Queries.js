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
exports.addUsedKey = exports.createUser = exports.getInstitutionByKey = exports.getKeyFromUsedKeys = void 0;
const authDb_1 = require("../../infrastructure/database/authDb");
// Query para saber si una Key ya fue utilizada.
const getKeyFromUsedKeys = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        SELECT "key"
        FROM public.used_keys
        WHERE "key" = $1
    `;
    const result = yield authDb_1.pool.query(query, [key]);
    return result.rows[0];
});
exports.getKeyFromUsedKeys = getKeyFromUsedKeys;
// Query para saber si una Key es válida.
const getInstitutionByKey = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        SELECT institucionid, originalid, denominacion_social, sectorid, sector
        FROM public.instituciones_financieras
        WHERE redeco_key = $1
    `;
    const result = yield authDb_1.pool.query(query, [key]);
    return result.rows[0];
});
exports.getInstitutionByKey = getInstitutionByKey;
// Query para agregar el usuario creado.
const createUser = (userid, username, hashedPassword, institucionid, is_active, profileid, systemId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        INSERT INTO public.users
        (userid, username, "password", institucionid, is_active, profileid, date, system)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7) RETURNING *
    `;
    const result = yield authDb_1.pool.query(query, [userid, username, hashedPassword, institucionid, is_active, profileid, systemId]);
    return result.rows[0];
});
exports.createUser = createUser;
// Query para agregar la key usada.
const addUsedKey = (keyid, key, systemId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
        INSERT INTO public.used_keys
        (usedkeyid, "key", date, system)
        VALUES ($1, $2, NOW(), $3) RETURNING *
    `;
    const result = yield authDb_1.pool.query(query, [keyid, key, systemId]);
    return result.rows[0];
});
exports.addUsedKey = addUsedKey;
