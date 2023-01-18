import { object, string, number, TypeOf, array, boolean } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *      CreateDecoratorsInput:
 *          type: object
 *          required:
 *              - categoryId
 *              - content
 *              - levelLimit
 *          properties:
 *              categoryId:
 *                  type: number
 *                  default: 0
 *              name:
 *                  type: string
 *              content:
 *                  type: string
 *              levelLimit:
 *                  type: number
 *      CreateDecoratorsResponse:
 *          type: object
 */
export const createDecoratorsSchema = object({
    body: object({
        data: array(object({
            categoryId: number({
                required_error: 'CategoryId is required'
            }),
            name: string(),
            levelLimit: number({
                required_error: 'levelLimit is required'
            }),
            content: string({
                required_error: 'Content is required'
            })
        }))
    })
});

/**
 * @openapi
 * components:
 *  schemas:
 *      FetchDecoratorsInput:
 *          type: object
 *          properties:
 *              ids:
 *                  type: integer array
 *                  description: an array of user post id
 *                  default: []
 *              categoryIds:
 *                  type: integer array
 *                  description: an array of category id
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
 *      FetchDecoratorsResponse:
 *          type: object
 *          properties:
 *             users:
 *                 type: object
 *                 properties:
 *                     data:
 *                         type: array
 *                     count:
 *                         type: number
 */
export const fetchDecoratorsSchema = object({
    body: object({
        ids: array(number()),
        categoryIds: array(number()),
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
 *      UpdateDecoratorsInput:
 *          type: object
 *          required:
 *              - id
 *          properties:
 *              id:
 *                  type: number
 *              name:
 *                  type: string
 *              levelLimit:
 *                  type: number
 *              content:
 *                  type: string
 *      UpdateDecoratorsResponse:
 *          type: object
 */
export const updateDecoratorsSchema = object({
    body: object({
        data: array(object({
            id: number({
                required_error: 'Id us required'
            }),
            name: string(),
            levelLimit: number(),
            content: string()
        }))
    })
});

/**
 * @openapi
 * components:
 *  schemas:
 *      DeleteDecoratorInput:
 *          type: object
 *          required:
 *              - id
 *          properties:
 *              id:
 *                  type: number
 *      DeleteDecoratorResponse:
 *          type: object
 */
export const deleteDecoratorSchema = object({
    params: object({
        id: string(),
    })
});


export type CreateDecoratorsInput = TypeOf<typeof createDecoratorsSchema>['body'];
export type FetchDecoratorsInput = TypeOf<typeof fetchDecoratorsSchema>['body'];
export type UpdateDecoratorsInput = TypeOf<typeof updateDecoratorsSchema>['body'];
export type DeleteDecoratorInput = TypeOf<typeof deleteDecoratorSchema>['params'];