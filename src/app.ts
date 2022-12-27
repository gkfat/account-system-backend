import config from 'config';
import express, { Express } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes';
import logger from './utils/logger';
import swaggerDocs from './utils/swagger';
import ConnectToDb from './utils/connectToDb';
import deserializeUser from './middleware/deserializeUser';
import db from './utils/connectToDb';

// Init express app
const app: Express = express();

// Server config
const PORT = process.env.port || config.get<string>('port');

app.listen(PORT, () => {
    // Initial database connection
    db.init();

    // API config
    app.use(express.json());
    app.use(cookieParser('accountSystemProject'));
    app.use(deserializeUser);
    app.use(morgan('common'));
    app.use(cors({
        origin: ['https://localhost:4200', 'http://localhost:4200'],
        credentials: true
    }));
    app.use(router);

    logger.info(`Server running on http://localhost:${PORT}`)

    // Init swagger doc
    swaggerDocs(app, PORT);
});