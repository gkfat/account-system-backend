import { Request, Response, NextFunction } from 'express';

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user['roleLevel'] !== 1) {
        return res.sendStatus(403);
    }
    return next();
}

export default requireAdmin;