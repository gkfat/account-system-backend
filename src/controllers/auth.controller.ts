import { Request, Response } from 'express';
import logger from '../utils/logger';
import config from 'config';
import { CreateSessionInput } from '../schemas/auth.schema';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import { get } from 'lodash';
import { verifyJwt } from '../utils/jwt';

async function createSessionHandler(req: Request<{}, {}, CreateSessionInput>, res: Response) {
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

    // If socialLogin === false, then log user with password
    if (!socialLogin) {
        // Check user verified
        if (!user.verified) {
            return res.status(401).send({
                message: 'Please verify your email',
                data: ''
            });
        }
        const isValid = await userService.validatePassword(user, password);
        if (!isValid) {
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

    const accessToken = await authService.signAccessToken(user);

    // Update user's logged in times
    user.loggedInTimes += 1;
    await userService.saveUser(user);

    // res.cookie('accountSystemAccessToken', accessToken, { signed: true });

    return res
        .cookie('accessToken', accessToken)
        .send({
            message: '',
            data: {
                accessToken
            }
        })
}

async function logOutHandler(req: Request, res: Response) {
    const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');
    const authService = new AuthService();
    const findSession = await authService.findSessionByToken(accessToken);

    if ( findSession ) {
        findSession.accessToken = '';
        await authService.saveSession(findSession);
        res.locals.user = null;
    }
    
    return res
        .clearCookie('accessToken')
        .send({
            message: 'Log out success',
            data: null
        });
}

export {
    createSessionHandler,
    logOutHandler
};