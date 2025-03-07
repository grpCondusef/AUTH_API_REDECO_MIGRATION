"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFieldsMatch = exports.validateRequiredField = void 0;
const validateRequiredField = (field, fieldName, errors) => {
    if (!field) {
        errors.push({ field: fieldName, message: `El campo ${fieldName} es obligatorio.` });
        return true;
    }
    return false;
};
exports.validateRequiredField = validateRequiredField;
const validateFieldsMatch = (field1, field2, fieldName1, fieldName2, errors) => {
    if (field1 && field2 && field1 !== field2) {
        errors.push({ field: fieldName1, message: `Los campos ${fieldName1} y ${fieldName2} no coinciden.` });
        return true;
    }
    return false;
};
exports.validateFieldsMatch = validateFieldsMatch;
