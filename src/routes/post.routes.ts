import {
    createPostSchema,
    fetchPostsSchema,
    updatePostSchema,
    deletePostSchema
} from '../schemas/post.schema';
import express from 'express';
import validateResource from '../middleware/validateResource';
import {
    createPostHandler,
    updatePostHandler,
    fetchPostsHandler,
    deletePostHandler
} from '../controllers/post.controller';
import requireUser from '../middleware/requireUser';

const router = express.Router();

/**
 * @openapi
 * /posts:
 *  post:
 *      tags:
 *          - Post
 *      summary: Create a new post
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreatePostInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreatePostResponse'
 *          400:
 *              description: Bad request
 *          
 */
router.post(
    '/posts',
    requireUser,
    validateResource(createPostSchema),
    createPostHandler
);


/**
 * @openapi
 * /posts:
 *  put:
 *      tags:
 *          - Post
 *      summary: Update a post
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdatePostInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreatePostResponse'
 *          400:
 *              description: Bad request
 *          
 */
router.put(
    '/posts',
    requireUser,
    validateResource(updatePostSchema),
    updatePostHandler
);

/**
 * @openapi
 * /posts/fetch:
 *  post:
 *      tags:
 *          - Post
 *      summary: Delete a post
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeletePostResponse'
 *          400:
 *              description: Bad request
 *
 */
router.post(
    '/posts/delete',
    requireUser,
    validateResource(deletePostSchema),
    deletePostHandler
)

/**
 * @openapi
 * /posts/delete:
 *  get:
 *      tags:
 *          - Post
 *      summary: Fetch posts
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/FetchPostsResponse'
 *          400:
 *              description: Bad request
 *
 */
router.post(
    '/posts/fetch',
    validateResource(fetchPostsSchema),
    fetchPostsHandler
)

export default router;