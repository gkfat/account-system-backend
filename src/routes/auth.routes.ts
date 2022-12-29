import { createSessionSchema } from '../schemas/auth.schema';
import express from 'express';
import validateResource from '../middleware/validateResource';
import { createSessionHandler, logOutHandler } from '../controllers/auth.controller';
import deserializeUser from '../middleware/deserializeUser';

const router = express.Router();

/**
 * @openapi
 * /sessions:
 *  post:
 *      tags:
 *          - Session
 *      summary: Login and get token
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateSessionInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateSessionResponse'
 *          400:
 *              description: Bad request
 *          
 */
router.post(
    '/sessions',
    validateResource(createSessionSchema),
    createSessionHandler
);

/**
 * @openapi
 * /sessions/logout:
 *  get:
 *      tags:
 *          - Session
 *      summary: Log out and clear session
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          400:
 *              description: Bad request
 *
 */
router.get(
    '/sessions/logout',
    deserializeUser,
    logOutHandler
)

export default router;