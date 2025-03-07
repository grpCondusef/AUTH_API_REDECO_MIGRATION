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
exports.userExistQuery = void 0;
const authDb_1 = require("../database/authDb");
const userExistQuery = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    SELECT userid, username, institucionid, is_active, profileid 
    FROM public.users 
    WHERE LOWER(username) = LOWER($1)
    `;
    const result = yield authDb_1.pool.query(query, [username]);
    return result.rows[0];
});
exports.userExistQuery = userExistQuery;
