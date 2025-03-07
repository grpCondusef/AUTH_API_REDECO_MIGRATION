import { Request } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            uid: string;
            username: string;
            institucionid: string;
            institucionClave: string;
            denominacion_social: string;
            sectorid: string;
            sector: string;
            [key: string]: any; // Para permitir campos adicionales
        };
    }
}
