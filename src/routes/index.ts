import express, { Request, Response } from 'express';
import user from './user.routes';
import auth from './auth.routes';

const router = express.Router();

/**
 * @openapi
 * /api/healthcheck:
 *   get:
 *      tags:
 *          - Healthcheck
 *      description: Response 200 ok if the app is up and running
 *      responses:
 *          200:
 *              description: App is up and running
 */
router.get('/api/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

router.use(user);
router.use(auth);

export default router;