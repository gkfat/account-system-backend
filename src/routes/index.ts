import express, { Request, Response } from 'express';
import user from './user.routes';
import auth from './auth.routes';
import post from './post.routes';
import decorator from './decorator.routes';

const router = express.Router();

/**
 * @openapi
 * /healthcheck:
 *   get:
 *      tags:
 *          - Healthcheck
 *      description: Response 200 ok if the app is up and running
 *      responses:
 *          200:
 *              description: App is up and running
 */
router.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));

router.use(user);
router.use(auth);
router.use(post);
router.use(decorator);

export default router;