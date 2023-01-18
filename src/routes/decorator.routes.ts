import {
    createDecoratorsSchema,
    fetchDecoratorsSchema,
    updateDecoratorsSchema,
    deleteDecoratorSchema
} from '../schemas/decorator.schema';
import express from 'express';
import validateResource from '../middleware/validateResource';
import {
    createDecoratorsHandler,
    updateDecoratorsHandler,
    fetchDecoratorsHandler,
    deleteDecoratorHandler
} from '../controllers/decorator.controller';
import requireUser from '../middleware/requireUser';
import requireAdmin from '../middleware/requireAdmin';

const router = express.Router();

/**
 * @openapi
 * /decorators:
 *  post:
 *      tags:
 *          - Decorator
 *      summary: Create new decorators
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateDecoratorsInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateDecoratorsResponse'
 *          400:
 *              description: Bad request
 *          
 */
router.post(
    '/decorators',
    requireUser,
    requireAdmin,
    validateResource(createDecoratorsSchema),
    createDecoratorsHandler
);

/**
 * @openapi
 * /decorators:
 *  put:
 *      tags:
 *          - Decorator
 *      summary: Update a decorator
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateDecoratorInput'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UpdateDecoratorResponse'
 *          400:
 *              description: Bad request
 *          
 */
router.put(
    '/decorators',
    requireUser,
    requireAdmin,
    validateResource(updateDecoratorsSchema),
    updateDecoratorsHandler
);

/**
 * @openapi
 * /decorators/fetch:
 *  post:
 *      tags:
 *          - Decorator
 *      summary: Fetch decorators
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/FetchDecoratorsResponse'
 *          400:
 *              description: Bad request
 *
 */
router.post(
    '/decorators/fetch',
    requireUser,
    validateResource(fetchDecoratorsSchema),
    fetchDecoratorsHandler
);

/**
 * @openapi
 * /decorators/{id}:
 *  delete:
 *      tags:
 *          - Decorator
 *      summary: Delete a decorator
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            description: Decorator id
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/DeleteDecoratorResponse'
 *          400:
 *              description: Bad request
 *
 */
router.delete(
    '/decorators/:id',
    requireUser,
    requireAdmin,
    validateResource(deleteDecoratorSchema),
    deleteDecoratorHandler
);

export default router;