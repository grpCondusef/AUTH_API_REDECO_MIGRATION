import jwt from 'jsonwebtoken';

interface DecodedToken {
    "allowed-origins"?: string[];
    sub?: string;
    "preferred_username"?: string[];
}

export const validateTokenKeycloak = async (token: string) => {
    const EXPECTED_ORIGIN = "http://10.33.21.86:8090/";
    try {
        const decoded = jwt.decode(token) as DecodedToken | null;
        
        if (!decoded || !decoded["allowed-origins"] || !decoded["allowed-origins"].includes(EXPECTED_ORIGIN)) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
};
