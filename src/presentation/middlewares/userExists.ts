import { Request, Response, NextFunction } from 'express';
import { userExistQuery } from '../../infrastructure/database/userExists.Queries';

export const userExists = async (request: Request, response: Response, next: NextFunction) => {

    type UserExistRequestBody = {
        username: string;
    };
    type ValidationError = { field: string; message: string };

    const { username } = request.body as UserExistRequestBody;
    const errors: ValidationError[] = [];
    
    const users = await userExistQuery(username);

        if (users) {
            errors.push({ field: 'username', message: `Ya existe un usuario con este username.` });
        }
        if (errors.length > 0) {
            return response.status(400).json({
                status: "error",
                message: "Validation failed.",
                errors: errors
            });
        }
    next()
};
