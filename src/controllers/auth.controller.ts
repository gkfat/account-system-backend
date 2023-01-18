import { Request, Response } from 'express';
import { logInInput } from '../schemas/auth.schema';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import { User } from '../entities/user.entity';
import { Session } from '../entities/session.entity';
import moment from 'moment';

async function logInHandler(req: Request<{}, {}, logInInput>, res: Response) {
    const { email, password, socialLogin } = req.body;
    const userService = new UserService();
    const authService = new AuthService();
    const user = await userService.findUserByEmail(email);
    const message = 'Invalid email or password';

    if (!user) {
        return res.status(400).send({
            message: message,
            data: ''
        });
    }

    // If not socialLogin, then log user with password
    if (!socialLogin) {
        // Check user verified
        if (!user.verified) {
            return res.status(401).send({
                message: 'Please verify your email',
                data: ''
            });
        }
        const passwordIsValid = await userService.validatePassword(user, password);
        if (!passwordIsValid) {
            return res.status(400).send({
                message: message,
                data: ''
            });
        }
    } else {
        // If Social Login, but email not verified, then directly verify user
        if (!user.verified) {
            user.verified = true;
            await userService.saveUser(user);
        }
    }

    // Create token
    const { accessToken } = await authService.signAccessToken(user);
    // const { refreshToken } = await authService.signRefreshToken(accessToken);

    // Create session
    const newSession = new Session();
    newSession.accessToken = accessToken;
    // newSession.refreshToken = refreshToken;
    newSession.lastLoggedIn = moment().toDate();
    newSession.user = user;
    await authService.saveSession(newSession);

    return res.send({
                message: 'Log in success!',
                data: {
                    accessToken,
                    // refreshToken
                }
            })
}

async function logOutHandler(req: Request, res: Response) {
    // const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');
    const user: User = res.locals.user;
    const authService = new AuthService();
    const findSession = await authService.findSessionByUser(user.id);

    if ( findSession ) {
        authService.revokeSession(findSession);
        res.locals.user = null;
    }
    
    return res.send({
                message: 'Log out success',
                data: null
            });
}

export {
    logInHandler,
    logOutHandler
};