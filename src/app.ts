import config from 'config';
import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes';
import logger from './utils/logger';
import swaggerDocs from './utils/swagger';
import db from './utils/connectToDb';
import authenticateToken from './middleware/authenticateToken';
import cookieParser from 'cookie-parser';

// Init express app
const app: Express = express();

// Server config
const PORT = process.env.port || config.get<string>('port');

app.listen(PORT, () => {
    // Initial database connection
    db.init();

    // API config
    app.use(express.json({ limit: '50mb' }));
    app.use(cookieParser('GKProject'));
    app.use(authenticateToken);
    app.use(morgan('common'));
    app.use(cors());
    app.use(router);

    logger.info(`Server running on http://localhost:${PORT}`)

    // Init swagger doc
    swaggerDocs(app, PORT);
});