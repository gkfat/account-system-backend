import { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import logger from './logger';

function swaggerDocs(app: Express, PORT: string) {
    // Swagger API documentation config
    const options: swaggerJSDoc.Options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Account System API',
                version: '1.0.0',
                description: 'API documents about Account System'
            },
            components: {
                securitySchemas: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            security: [
                {
                    bearerAuth: []
                }
            ]
        },
        apis: ['./src/routes/*.ts', './src/schemas/*.ts']
    }
    const specs = swaggerJSDoc(options);
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

    logger.info(`API docs avalaible on http://localhost:${PORT}/api-docs`);
}

export default swaggerDocs;