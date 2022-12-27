import { object, string, number, TypeOf, array, boolean } from 'zod';

/**
 * @openapi
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 * security:
 *  - bearerAuth: []
 */

/**
 * @openapi
 * components:
 *  schemas:
 *      CreateSessionInput:
 *          type: object
 *          required:
 *              - email
 *              - password
 *              - socialLogin
 *          properties:
 *              email:
 *                  type: string
 *                  default: john.doe@fakemail.com
 *              password:
 *                  type: string
 *                  default: stringPassword123!
 *              socialLogin:
 *                  type: boolean
 *                  default: false
 *      CreateSessionResponse:
 *          type: object
 *          properties:
 *              accessToken:
 *                  type: string
 */
const passwordRule = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export const createSessionSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required'
        }).email('Invalid email or password'),
        password: string(),
        // password: string({
        //     required_error: 'Password is required'
        // }).min(8, 'Invalid email or password').regex(
        //     passwordRule,
        //     'Invalid email or password'
        // ),
        socialLogin: boolean()
    })
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>['body'];