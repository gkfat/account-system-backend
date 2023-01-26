import { User } from './../entities/user.entity';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from 'config';

function generateToken(payload: object, keyName: 'accessTokenSecret' | 'refreshTokenSecret'): string {
    const tokenSecret = config.get<{
        key: string;
        expires: string;
    }>(keyName);
    // Never expired
    const expiresIn = tokenSecret.expires;
    return jwt.sign({payload}, tokenSecret.key);
}

function verifyToken(token: string, keyName: 'accessTokenSecret' | 'refreshTokenSecret'): {
    payload: User | null,
    expired: boolean
} {
    const tokenSecret = config.get<{
        key: string;
        expires: string;
    }>(keyName);

    try {
        const decoded = jwt.verify(token, tokenSecret.key) as any;
        return {
            payload: decoded,
            expired: false
        };
    } catch (err: any) {
        return {
            payload: null,
            expired: true
        }
    }
}

export {
    generateToken,
    verifyToken
}