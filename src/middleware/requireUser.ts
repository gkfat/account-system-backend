import { Request, Response, NextFunction } from 'express';

async function requireUser(req: Request, res: Response, next: NextFunction) {
    if (!res.locals.user) {
        return res.sendStatus(403);
    }
    return next();
}

export default requireUser;