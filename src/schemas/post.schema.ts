import { object, string, number, TypeOf, array, boolean } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *      CreatePostInput:
 *          type: object
 *          required:
 *              - title
 *              - description
 *              - content
 *              - categoryId
 *              - authorId
 *          properties:
 *              title:
 *                  type: string
 *                  default: New post
 *              description:
 *                  type: string
 *                  default: Here are description!
 *              content:
 *                  type: string
 *                  default: Here are contents!
 *              categoryId:
 *                  type: number
 *                  default: 0
 *              authorId:
 *                  type: number
 *      CreatePostResponse:
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
 *              title:
 *                  type: string
 *              content:
 *                  type: string
 *              categoryId:
 *                  type: number
 *              author:
 *                  type: object
 */
export const createPostSchema = object({
    body: object({
        title: string({
            required_error: 'Title is required'
        }),
        description: string({
            required_error: 'Description is required'
        }),
        content: string({
            required_error: 'Content is required'
        }),
        categoryId: number({
            required_error: 'CategoryId is required'
        }),
        authorId: number({
            required_error: 'AuthorId is required'
        }),
    })
});

/**
 * @openapi
 * components:
 *  schemas:
 *      FetchPostsInput:
 *          type: object
 *          properties:
 *              ids:
 *                  type: integer array
 *                  description: an array of user post id
 *                  default: []
 *              withContent:
 *                  type: boolean
 *                  description: Determine api result includes post's contents or not
 *                  default: false
 *              categoryIds:
 *                  type: integer array
 *                  description: an array of category id
 *                  default: []
 *              authorIds:
 *                  type: integer array
 *                  description: an array of author id
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
 *      FetchPostsResponse:
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
export const fetchPostsSchema = object({
    body: object({
        ids: array(number()),
        authorIds: array(number()),
        withContent: boolean(),
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
 *      UpdatePostInput:
 *          type: object
 *          required:
 *              - id
 *              - title
 *              - content
 *              - categoryId
 *          properties:
 *              id:
 *                  type: number
 *              title:
 *                  type: string
 *                  default: New post
 *              description:
 *                  type: string
 *              content:
 *                  type: string
 *                  default: Here are contents!
 *              categoryId:
 *                  type: number
 *      CreatePostResponse:
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
 *              title:
 *                  type: string
 *              content:
 *                  type: string
 *              categoryId:
 *                  type: number
 *              author:
 *                  type: object
 */
export const updatePostSchema = object({
    body: object({
        id: number({
            required_error: 'Id is required'
        }),
        title: string({
            required_error: 'Title is required'
        }),
        description: string({
            required_error: 'Description is required'
        }),
        content: string({
            required_error: 'Content is required'
        }),
        categoryId: number({
            required_error: 'CategoryId is required'
        })
    })
});

/**
 * @openapi
 * components:
 *  schemas:
 *      DeletePostInput:
 *          type: object
 *          required:
 *              - id
 *          properties:
 *              id:
 *                  type: number
 *      DeletePostResponse:
 *          type: object
 *          properties:
 */
export const deletePostSchema = object({
    body: object({
        id: number({
            required_error: 'Id is required'
        })
    })
});


export type CreatePostInput = TypeOf<typeof createPostSchema>['body'];
export type FetchPostsInput = TypeOf<typeof fetchPostsSchema>['body'];
export type UpdatePostInput = TypeOf<typeof updatePostSchema>['body'];
export type DeletePostInput = TypeOf<typeof deletePostSchema>['body'];