import { Request, Response, NextFunction } from 'express';

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user.payload.roleLevel !== 1) {
        return res.status(403).send({
            message: 'Admin required'
        });
    }
    return next();
}

export default requireAdmin;