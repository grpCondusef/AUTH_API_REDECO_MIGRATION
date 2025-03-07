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
exports.userExists = void 0;
const userExists_Queries_1 = require("../../infrastructure/database/userExists.Queries");
const userExists = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = request.body;
    console.log(username);
    const users = yield (0, userExists_Queries_1.userExistQuery)(username);
    if (users) {
        return response.status(401).json({ error: 'Ya existe un usuario con este username.' });
    }
    next();
});
exports.userExists = userExists;
