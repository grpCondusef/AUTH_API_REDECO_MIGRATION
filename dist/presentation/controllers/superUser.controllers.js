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
exports.createSuperUser = void 0;
const uuid_1 = require("uuid");
const generateJTW_1 = require("../../shared/utils/generateJTW");
const encriptPassword_1 = require("../../shared/utils/encriptPassword");
const generateDates_1 = require("../../shared/utils/generateDates");
const superUser_Queries_1 = require("../../infrastructure/database/superUser.Queries");
const validateRequiredAndMatch_1 = require("../../shared/utils/validateRequiredAndMatch");
const redeco_key_1 = require("../../presentation/controllers/redeco_key");
const createSuperUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, username, password, confirm_password, system_key } = request.body;
    const errors = [];
    try {
        // Validaciones
        (0, validateRequiredAndMatch_1.validateRequiredField)(key, 'key', errors);
        (0, validateRequiredAndMatch_1.validateRequiredField)(username, 'username', errors);
        (0, validateRequiredAndMatch_1.validateRequiredField)(password, 'password', errors);
        (0, validateRequiredAndMatch_1.validateRequiredField)(confirm_password, 'confirm_password', errors);
        (0, validateRequiredAndMatch_1.validateFieldsMatch)(password, confirm_password, 'password', 'confirm_password', errors);
        const institution = yield (0, superUser_Queries_1.getInstitutionByKey)(key);
        if (key && (!institution || !key)) {
            errors.push({ field: key, message: `La key proporcionada no es válida.` });
        }
        const existingKey = yield (0, superUser_Queries_1.getKeyFromUsedKeys)(key);
        if (key && existingKey) {
            errors.push({ field: key, message: `Ya fue creado un súper usuario utilizando esta key.` });
        }
        if (errors.length > 0) {
            const errorMessages = errors.map(error => error.message);
            return response.status(400).json({ errors: errorMessages });
        }
        const userid = (0, uuid_1.v4)();
        const keyid = (0, uuid_1.v4)();
        const is_active = true;
        const profileid = '2';
        const date = (0, generateDates_1.getTodayDate)();
        const system_key = 1;
        const systemId = redeco_key_1.redecokey.includes(key) ? 'REDECO' : 'REUNE';
        const hashedPassword = (0, encriptPassword_1.encriptPassword)(password);
        const newUser = yield (0, superUser_Queries_1.createUser)(userid, username, hashedPassword, institution.institucionid, is_active, profileid, 
        //date,
        systemId);
        yield (0, superUser_Queries_1.addUsedKey)(keyid, key, systemId);
        const institucionid = institution.institucionid;
        const institucionClave = institution.originalid;
        const denominacion_social = institution.denominacion_social;
        const sectorid = institution.sectorid;
        const sector = institution.sector;
        const token_access = yield (0, generateJTW_1.generateJWT)(userid, username, institucionid, institucionClave, denominacion_social, sectorid, sector, systemId, key);
        return response.status(200).json({
            message: '¡El usuario ha sido creado exitosamente!',
            data: Object.assign(Object.assign({}, newUser), { token_access }),
        });
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ errors: 'Parece que ha habido un error al intentar crear un súper usuario.' });
    }
});
exports.createSuperUser = createSuperUser;
