import { Request, Response, NextFunction } from 'express';

async function requireUser(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.user) {
        return res.status(403).send({
            message: 'User required'
        });
    }
    return next();
}

export default requireUser;