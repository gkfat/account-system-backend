import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import { verifyToken } from '../utils/jwt';

async function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');
    const authService = new AuthService();

    if (!accessToken) {
        return next();
    }

    // If accessToken not expired, return decoded data
    const { payload, expired } = verifyToken(accessToken, 'accessTokenSecret');
    if (payload) {
        res.locals.user = payload;
        return next();
    }

    // If accessToken expired, and has refreshToken, then check if refreshToken valid
    // const refresh = expired && refreshToken ? verifyToken(refreshToken, 'refreshTokenSecret').payload : null;
    // if (!refresh) {
    //     return next();
    // }

    // If refresh = true, then generate and update new accessToken
    // const findSession = await authService.findSessionByToken(refreshToken);
    // if (!findSession) {
    //     return next();
    // }

    // const newAccessToken = await authService.signAccessToken(res.locals.user).accessToken;
    // findSession.accessToken = newAccessToken;
    // await authService.saveSession(findSession);

    // res.locals.user = verifyToken(accessToken, 'accessTokenSecret').payload;
    return next();
}

export default authenticateToken;