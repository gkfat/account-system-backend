import { logInSchema } from '../schemas/auth.schema';
import express from 'express';
import validateResource from '../middleware/validateResource';
import { logInHandler, logOutHandler } from '../controllers/auth.controller';
import requireUser from '../middleware/requireUser';

const router = express.Router();

/**
 * @openapi
 * /sessions/logIn:
 *  post:
 *      tags:
 *          - Session
 *      summary: Log in and get token
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/logInInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/logInResponse'
 *          400:
 *              description: Bad request
 *          
 */
router.post(
    '/sessions/logIn',
    validateResource(logInSchema),
    logInHandler
);

/**
 * @openapi
 * /sessions/logOut:
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
    '/sessions/logOut',
    requireUser,
    logOutHandler
)

export default router;