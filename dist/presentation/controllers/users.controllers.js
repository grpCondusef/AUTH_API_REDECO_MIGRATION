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
exports.createUser = void 0;
const uuid_1 = require("uuid");
const user_Queries_1 = require("../../infrastructure/database/user.Queries");
const generateJTW_1 = require("../../shared/utils/generateJTW");
const encriptPassword_1 = require("../../shared/utils/encriptPassword");
const generateDates_1 = require("../../shared/utils/generateDates");
const validateRequiredAndMatch_1 = require("../../shared/utils/validateRequiredAndMatch");
const createUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { institucionid, profileid, system } = request.body;
    const { username, password, confirm_password, } = request.body;
    const errors = [];
    // Validar campos
    (0, validateRequiredAndMatch_1.validateRequiredField)(username, 'username', errors);
    (0, validateRequiredAndMatch_1.validateRequiredField)(password, 'password', errors);
    (0, validateRequiredAndMatch_1.validateRequiredField)(confirm_password, 'confirm_password', errors);
    (0, validateRequiredAndMatch_1.validateFieldsMatch)(password, confirm_password, 'password', 'confirm_password', errors);
    // Si hay errores de validación, retornarlos
    if (errors.length > 0) {
        return response.status(400).json({ errors });
    }
    ;
    // Validar permisos del usuario autenticado
    if (profileid !== "2") {
        return response.status(401).json({
            error: 'Su usuario no cuenta con los permisos requeridos para crear un nuevo usuario.',
        });
    }
    ;
    // Crear el usuario en la base de datos
    try {
        // Generar UUID y otros valores
        const userid = (0, uuid_1.v4)();
        const is_active = true;
        const simpleProfileId = "1";
        const date = (0, generateDates_1.getTodayDate)();
        // Encriptar contraseña
        const hashedPassword = (0, encriptPassword_1.encriptPassword)(password);
        // Crear el usuario en la base de datos
        const newUser = yield (0, user_Queries_1.addUser)(userid, username, hashedPassword, institucionid, is_active, simpleProfileId, 
        //date,
        system);
        // Consultar detalles de la institución
        const institution = yield (0, user_Queries_1.getInstitutiones)(institucionid);
        // Validar si la institución existe
        if (!institution) {
            return response.status(404).json({
                error: 'No se encontró la institución financiera asociada.',
            });
        }
        // Extraer datos de la institución
        const express = institution.originalid;
        const denominacion_social = institution.denominacion_social;
        const sectorid = institution.sectorid;
        const sector = institution.sector;
        // Generar token JWT
        const token_access = yield (0, generateJTW_1.generateJWT)(userid, username, institucionid, express, denominacion_social, sectorid, sector, system);
        // Responder con el nuevo usuario y el token
        return response.status(201).json({
            message: '¡El usuario ha sido creado exitosamente!',
            data: Object.assign(Object.assign({}, newUser), { token_access }),
        });
    }
    catch (error) {
        console.error('Error al crear el usuario:', error);
        return response.status(500).json({
            error: 'Hubo un error al intentar crear el usuario',
        });
    }
});
exports.createUser = createUser;
