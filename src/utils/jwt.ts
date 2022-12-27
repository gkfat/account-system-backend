import jwt from 'jsonwebtoken';
import config from 'config';

function signJwt(object: Object, keyName: 'accessTokenPrivateKey', options?: jwt.SignOptions | undefined) {
    const signInKey = Buffer.from(config.get<string>(keyName), 'base64').toString();
    return jwt.sign(object, signInKey, {
        ...(options && options),
        algorithm: 'RS256'
    });
}

function verifyJwt<T>(token: string, keyName: 'accessTokenPublicKey'): T | null {
    const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString();
    try {
        // Return user data
        const decoded = jwt.verify(token, publicKey) as T;
        return decoded;
    } catch (err) {
        return null;
    }
}

export {
    signJwt,
    verifyJwt
}