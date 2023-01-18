import {
    CreateUserInput,
    FetchUsersInput,
    VerifyUserInput,
    ResetPasswordInput,
    UpdateUserInput,
    ResendVerifyInput,
    EnumVerifyState,
    passwordRule
} from '../schemas/user.schema';
import { Request, Response } from 'express';
import { User } from '../entities/user.entity';
import UserService, { FetchUsersQuery, FetchUsersResult }  from '../services/user.service';
import logger from '../utils/logger';
import AuthService from '../services/auth.service';
import { verifyToken } from '../utils/jwt';

async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    const userService = new UserService();
    const { email, firstName, lastName, password, socialSignUp } = req.body;
    const newUser = new User();
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.verificationCode = userService.generateVerificationCode();
    newUser.verified = false;
    newUser.loggedInTimes = 0;

    let createdUser!: User;

    const checkUserExist = await userService.findUserByEmail(email);
    if (checkUserExist) {
        return res.status(409).send({
            message: 'Invalid email.',
            data: ''
        });
    }

    // If not sign up by social, then must verify password format
    if (!socialSignUp) {
        const validPassword = new RegExp(passwordRule).test(password);
        if (!validPassword) {
            return res.status(400).send({
                message: 'Password must contains at least one character, one digit character, and at least 8 characters.',
                data: ''
            })
        }
        newUser.password = await userService.hashPassword(password);

        // Try create user
        try {
            createdUser = await userService.saveUser(newUser);
        } catch (err: any) {
            logger.info(err);
            return res.status(400).send({
                message: `Failed creating user ${newUser.email}`,
                data: err
            });
        }

        // Send verify email
        await userService.sendVerifyMail(createdUser);
    }
    
    // If social sign up, then doesn't need to verify email
    if (socialSignUp) {
        newUser.verified = true;
        createdUser = await userService.saveUser(newUser);
    }

    const result = userService.omitPrivateField(createdUser);
    return res.send({
        data: result,
        message: 'Sign up success!'
    });
}

async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
    const id = parseInt(req.params.id);
    const verificationCode = req.params.verificationCode;
    const userService = new UserService();
    const findUser = await userService.findUserById(id);

    if (!findUser)  {
        return res.status(404).send({
            data: {
                verifyState: EnumVerifyState.VerifyFailed
            },
            message: 'User not created'
        });
    }

    if (findUser.verified) {
        return res.status(400).send({
            data: {
                verifyState: EnumVerifyState.AlreadyVerified
            },
            message: 'User already verified'
        });
    }

    if (findUser.verificationCode === verificationCode) {
        findUser.verified = true;
        await userService.saveUser(findUser);
        return res.send({
            data: {
                verifyState: EnumVerifyState.SuccessfullyVerified
            },
            message: 'User successfully verified'
        });
    }

    return res.status(400).send({
        data: {
            verifyState: EnumVerifyState.VerifyFailed
        },
        message: 'Could not verify user'
    });
}

async function resendVerifyHandler(req: Request<{}, {}, ResendVerifyInput>, res: Response) {
    const email = req.body.email;
    const userService = new UserService();
    const user = await userService.findUserByEmail(email);

    if (!user) {
        return res.status(400).send({
            data: {
                verifyState: EnumVerifyState.VerifyFailed
            },
            message: 'User not created'
        });
    }

    if (user.verified) {
        return res.status(400).send({
            data: {
                verifyState: EnumVerifyState.AlreadyVerified
            },
            message: 'User already verified'
        });
    }

    await userService.sendVerifyMail(user);
    return res.send({
        data: {
            verifyState: EnumVerifyState.SuccessfullyResendVerify
        },
        message: 'Verify mail resent successfully!'
    });
}

async function fetchUsersHandler(req: Request<{}, {}, FetchUsersInput>, res: Response) {
    const userService = new UserService();
    const query: FetchUsersQuery = req.body;
    const result: FetchUsersResult = await userService.findUsers(query);
    return res.send({
        message: '',
        data: result
    });
}

async function resetPasswordHandler(req: Request<{}, {}, ResetPasswordInput>, res: Response) {
    const userService = new UserService();
    const authService = new AuthService();
    const { id, oldPassword, newPassword, newPasswordConfirm } = req.body;
    const findUser = await userService.findUserById(id);

    if (!findUser)  {
        return res.status(404).send(`User id: ${id} not created`);
    }

    if (!findUser.verified) {
        return res.status(400).send(`User id: ${id} not verified`);
    }

    const verifyOldPassword = await userService.hashPassword(oldPassword) === findUser.password;
    if (!verifyOldPassword) {
        return res.status(400).send(`Invalid old password`);
    }

    findUser.password = await userService.hashPassword(newPassword);
    await userService.saveUser(findUser);

    const findSession = await authService.findSessionByUser(id);
    if (findSession) {
        authService.revokeSession(findSession);
        res.locals.user = null;
    }

    return res.status(200).send({
        data: '',
        message: 'Reset password success! Please login with new password.'
    });
}

async function updateUserHandler(req: Request<{}, {}, UpdateUserInput>, res: Response) {
    const userService = new UserService();
    const authService = new AuthService();
    const { id, firstName, lastName, nickName, avatarId, frameId } = req.body;
    const findUser = await userService.findUserById(id);

    if ( !findUser )  {
        return res.status(404).send({
            data: null,
            message: 'User not existed'
        });
    }

    if ( !findUser.verified ) {
        return res.status(403).send({
            data: null,
            message: 'User not verified'
        });
    }

    // TODO: Check if user has avatarId or frameId permission
    // if ( findUser.avatarId !== avatarId || findUser.frameId !== frameId ) {
    //     return res.status(400).send({
    //         data: null,
    //         message: 'No avatar or frame permission'
    //     });
    // }

    findUser.firstName = firstName;
    findUser.lastName = lastName;
    findUser.nickName = nickName;
    findUser.avatarId = avatarId;
    findUser.frameId = frameId;
    const updatedUser = await userService.saveUser(findUser);

    // Sign a new token with updated user data
    const { accessToken } = await authService.signAccessToken(updatedUser);

    return res.send({
        message: 'Update user success!',
        data: {
            accessToken
        }
    });
}

async function getCurrentUserHandler(req: Request, res: Response) {
    const user = res.locals.user || null;
    return res.send({
        message: '',
        data: user
    });
}

export {
    createUserHandler,
    verifyUserHandler,
    resendVerifyHandler,
    fetchUsersHandler,
    updateUserHandler,
    resetPasswordHandler,
    getCurrentUserHandler
};