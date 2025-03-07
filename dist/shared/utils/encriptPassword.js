"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encriptPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Encripta una contraseña utilizando bcryptjs.
 * @param password - La contraseña en texto plano que será encriptada.
 * @returns La contraseña encriptada como un string.
 */
const encriptPassword = (password) => {
    //ENCRIPTAR LA CONTRASEÑA DEL USUARIO
    const salt = bcryptjs_1.default.genSaltSync(10);
    const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
    return hashedPassword;
};
exports.encriptPassword = encriptPassword;
