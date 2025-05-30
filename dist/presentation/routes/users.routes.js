"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const superUser_controllers_1 = require("../../presentation/controllers/superUser.controllers");
const userExists_1 = require("../middlewares/userExists");
const users_controllers_1 = require("../../presentation/controllers/users.controllers");
const validateJWT_1 = require("../../presentation/middlewares/validateJWT");
const router = (0, express_1.Router)();
router.post('/users/create-super-user/', userExists_1.userExists, superUser_controllers_1.createSuperUser);
router.post('/users/create-user/', validateJWT_1.validarJWT, userExists_1.userExists, users_controllers_1.createUser);
exports.default = router;
