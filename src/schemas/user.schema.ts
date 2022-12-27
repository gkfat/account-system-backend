import { object, string, number, TypeOf, array, boolean } from 'zod';

export enum EnumVerifyState {
    ResendVerify,
    SuccessfullyResendVerify,
    SuccessfullyVerified,
    AlreadyVerified,
    VerifyFailed
};

/**
 * @openapi
 * components:
 *  schemas:
 *      CreateUserInput:
 *          type: object
 *          required:
 *              - email
 *              - firstName
 *              - lastName
 *              - password
 *              - passwordConfirm
 *              - socialSignUp
 *          properties:
 *              email:
 *                  type: string
 *                  default: john.doe@fakemail.com
 *              firstName:
 *                  type: string
 *                  default: John
 *              lastName:
 *                  type: string
 *                  default: Doe
 *              password:
 *                  type: string
 *                  default: stringPassword123!
 *              passwordConfirm:
 *                  type: string
 *                  default: stringPassword123!
 *              socialSignUp:
 *                  type: boolean
 *                  defaul: false
 *      CreateUserResponse:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *              createdAt:
 *                  type: string
 *              updatedAt:
 *                  type: string
 *              deletedAt:
 *                  type: string
 *              email:
 *                  type: string
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: string
 */
const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: 'First name is required'
        }),
        lastName: string({
            required_error: 'Last name is required'
        }),
        password: string(),
        passwordConfirm: string(),
        email: string({
            required_error: 'Email is required'
        }).email('Not a valid email'),
        socialSignUp: boolean({
            required_error: 'SocialSignUp is required'
        })
    }).refine((data) => data.password === data.passwordConfirm, {
        message: 'Passwords do not match password confirm',
        path: ['passwordConfirm']
    })
});

/**
 * @openapi
 * components:
 *  schemas:
 *      FetchUsersInput:
 *          type: object
 *          properties:
 *              ids:
 *                  type: integer array
 *                  description: an array of user id
 *                  default: []
 *              page:
 *                  type: number
 *                  description: which page to query
 *                  default: 1
 *              take:
 *                  type: number
 *                  description: how many results
 *                  default: 15
 *              order:
 *                  type: object
 *                  description: query order
 *                  properties:
 *                      by:
 *                          type: string
 *                          description: could by "id", "createdAt"
 *                          default: id
 *                      order:
 *                          type: number
 *                          description: desc -1, asc 1
 *                          default: -1
 *      FetchUsersResponse:
 *          type: object
 *          properties:
 *             users:
 *                 type: object
 *                 properties:
 *                     data:
 *                         type: array
 *                     count:
 *                         type: number
 *             activeUsersToday:
 *                 type: object
 *                 properties:
 *                     data:
 *                         type: array
 *                     count:
 *                         type: number
 *             averageUsersLast7Days:
 *                 type: object
 *                 properties:
 *                     data:
 *                         type: array
 *                     count:
 *                         type: number
 */

export const fetchUsersSchema = object({
    body: object({
        ids: array(number()),
        page: number(),
        take: number(),
        order: object({
            by: string(),
            order: number()
        })
    })
});

/**
 * @openapi
 * components:
 *  schemas:
 *      ResendVerifyInput:
 *          type: object
 *          required:
 *              - email
 *          properties:
 *              email:
 *                  type: string
 *                  default: john.doe@fakemail.com
 *      VerifyResponse:
 *          type: object
 *          properties:
 *              verifyState:
 *                  type: number
 */
export const verifyUserSchema = object({
    params: object({
        id: string(number()),
        verificationCode: string()
    })
});

export const resendVerifySchema = object({
    body: object({
        email: string({
            required_error: 'Email is required'
        })
    })
});

/**
 * @openapi
 * components:
 *  schemas:
 *      UpdateUserInput:
 *          type: object
 *          required:
 *              - id
 *              - firstName
 *              - lastName
 *          properties:
 *              id:
 *                  type: number
 *                  default: 1
 *              firstName:
 *                  type: string
 *                  default: John
 *              lastName:
 *                  type: string
 *                  default: Doe
 *      UpdateUserResponse:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *              createdAt:
 *                  type: string
 *              updatedAt:
 *                  type: string
 *              deletedAt:
 *                  type: string
 *              email:
 *                  type: string
 *              firstName:
 *                  type: string
 *              lastName:
 *                  type: string
 */
export const updateUserSchema = object({
    body: object({
        id: number(),
        firstName: string(),
        lastName: string()
    })
});

/**
 * @openapi
 * components:
 *  schemas:
 *      ResetPasswordInput:
 *          type: object
 *          required:
 *              - id
 *              - oldPassword
 *              - newPassword
 *              - newPasswordConfirm
 *          properties:
 *              id:
 *                type: number
 *                default: 1
 *              oldPassword:
 *                type: string
 *                default: stringPassword123!
 *              newPassword:
 *                type: string
 *                default: PasswordString321#
 *              newPasswordConfirm:
 *                type: string
 *                default: PasswordString321#
 *      ResetPasswordResponse:
 *          type: string
 */
export const resetPasswordSchema = object({
    body: object({
        id: number(),
        oldPassword: string({
            required_error: 'Password is required'
        }),
        newPassword: string({
            required_error: 'Password is required'
        }).min(8, 'Password must be at least 8 characters').regex(
            passwordRule,
            'Password must contains at least one lower character, one upper character, one digit character, one special character'
        ),
        newPasswordConfirm: string({
            required_error: 'Password confirm is required'
        }),
    })
});


export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type FetchUsersInput = TypeOf<typeof fetchUsersSchema>['body'];
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params'];
export type ResendVerifyInput = TypeOf<typeof resendVerifySchema>['body'];
export type UpdateUserInput = TypeOf<typeof updateUserSchema>['body'];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>['body'];