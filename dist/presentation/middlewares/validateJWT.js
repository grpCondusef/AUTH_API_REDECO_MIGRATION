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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authDb_1 = require("../../infrastructure/database/authDb");
;
const validarJWT = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = request.header('Authorization');
    // Verificar que el token exista en la petición
    if (!token) {
        response.status(401).json({
            msg: 'Es necesario incluir un token en la petición.',
        });
        return;
    }
    try {
        // Verificar el token y obtener los datos decodificados
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRETORPRIVATEKEY || '');
        // Validar si el token ha expirado
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime >= decoded.exp) {
            response.status(400).json({
                error: 'El token ha expirado, se tiene que realizar la renovación.',
            });
            return;
        }
        // Añadir los datos del token a una propiedad personalizada del request
        request.body = {
            uid: decoded.uid,
            username: decoded.username,
            institucionid: decoded.institucionid,
            institucionClave: decoded.institucionClave,
            denominacion_social: decoded.denominacion_social,
            sectorid: decoded.sectorid,
            sector: decoded.sector,
        };
        // Verificar si el usuario está activo en la base de datos
        const userQuery = `
            SELECT * 
            FROM public.users 
            WHERE userid = $1
        `;
        const userData = yield authDb_1.pool.query(userQuery, [decoded.uid]);
        const user = userData.rows[0];
        if (!(user === null || user === void 0 ? void 0 : user.is_active)) {
            response.status(401).json({
                msg: 'El usuario no está activo',
            });
            return;
        }
        // Adjuntar información del usuario a una propiedad personalizada del request
        request.user = Object.assign(Object.assign({}, request.user), user);
        // Continuar con la ejecución de la ruta
        next();
    }
    catch (error) {
        console.error('Error al validar el token:', error);
        response.status(401).json({
            msg: 'Token no válido',
        });
    }
});
exports.validarJWT = validarJWT;
