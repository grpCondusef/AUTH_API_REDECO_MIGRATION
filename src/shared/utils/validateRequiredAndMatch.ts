export const validateRequiredField = (field: string, fieldName: string, errors: any) => {
    if (!field) {
        errors.push({ field: fieldName, message: `El campo ${fieldName} es obligatorio.` } );
        return true;
    }
    return false;
};

export const validateFieldsMatch = (field1:string, field2:string, fieldName1: string, fieldName2: string, errors: any) => {
    if (field1 && field2 && field1 !== field2) {
        errors.push( { field: fieldName1, message: `Los campos ${fieldName1} y ${fieldName2} no coinciden.` });
        return true;
    }
    return false;
};