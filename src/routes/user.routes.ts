import express from 'express';
import validateResource from '../middleware/validateResource';
import {
    createUserSchema,
    fetchUsersSchema,
    verifyUserSchema,
    resetPasswordSchema,
    updateUserSchema,
    resendVerifySchema
} from '../schemas/user.schema';
import {
    createUserHandler,
    fetchUsersHandler,
    resetPasswordHandler,
    getCurrentUserHandler,
    updateUserHandler,
    verifyUserHandler,
    resendVerifyHandler
} from '../controllers/user.controller';
import requireUser from '../middleware/requireUser';

const router = express.Router();

/**
 * @openapi
 * /api/users:
 *  post:
 *      tags:
 *          - User
 *      summary: Create a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateUserInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateUserResponse'
 *          400:
 *              description: Bad request
 *          
 */
router.post(
    '/api/users',
    validateResource(createUserSchema),
    createUserHandler
);

/**
 * @openapi
 * /api/users/fetch:
 *  post:
 *      tags:
 *          - User
 *      summary: Fetch users
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/FetchUsersInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/FetchUsersResponse'
 *          400:
 *              description: Bad request
 */
router.post(
    '/api/users/fetch',
    requireUser,
    validateResource(fetchUsersSchema),
    fetchUsersHandler
);

/**
 * @openapi
 * /api/users/verify/{id}/{verificationCode}:
 *  get:
 *      tags:
 *          - User
 *      summary: Verify user account by verificationCode
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            description: User id
 *          - in: path
 *            name: verificationCode
 *            schema:
 *              type: string
 *            description: Generate randomly when create a user, could be receive in email
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VerifyResponse'
 *          400:
 *              description: Bad request
 *          
 */
router.get(
    '/api/users/verify/:id/:verificationCode',
    validateResource(verifyUserSchema),
    verifyUserHandler
);

/**
 * @openapi
 * /api/users/resendVerify:
 *  post:
 *      tags:
 *          - User
 *      summary: Resend verify mail
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ResendVerifyInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/VerifyResponse'
 *          400:
 *              description: Bad request
 *          
 */
router.post(
    '/api/users/resendVerify',
    validateResource(resendVerifySchema),
    resendVerifyHandler
);

/**
 * @openapi
 * /api/users/me:
 *  get:
 *      tags:
 *          - User
 *      summary: Fetch current user by access token
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateUserResponse'
 *          400:
 *              description: Bad request
 *          
 */
router.get(
    '/api/users/me',
    requireUser,
    getCurrentUserHandler
);

/**
 * @openapi
 * /api/users/me:
 *  put:
 *      tags:
 *          - User
 *      summary: Update user's data
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateUserInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateUserResponse'
 *          400:
 *              description: Bad request
 *          
 */
router.put(
    '/api/users/me',
    requireUser,
    validateResource(updateUserSchema),
    updateUserHandler
);

/**
 * @openapi
 * /api/users/resetPassword:
 *  post:
 *      tags:
 *          - User
 *      summary: Reset user's password
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ResetPasswordInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ResetPasswordResponse'
 *          400:
 *              description: Bad request
 *          
 */
router.post(
    '/api/users/resetPassword',
    requireUser,
    validateResource(resetPasswordSchema),
    resetPasswordHandler
);

export default router;