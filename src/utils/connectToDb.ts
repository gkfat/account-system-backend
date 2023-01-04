import config from 'config';
import logger from './logger';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Session } from '../entities/session.entity';

class ConnectToDb {
    public dataSource!: DataSource;
    // Private config
    private appDataSource = new DataSource({
        type: 'mysql',
        host: config.get<string>('db.host'),
        database: config.get<string>('db.database'),
        port: config.get<number>('db.port'),
        username: config.get<string>('db.username'),
        password: config.get<string>('db.password'),
        synchronize: true,
        logging: false,
        poolSize: 20,
        entities: [
            User,
            Session
        ],
        extra: {
            connectionLimit: 10
        }
    });

    // Initial connect
    public async init() {
        await this.appDataSource.initialize().then(dataSource => {
            logger.info('Connected to DB successfully!');
            this.dataSource = dataSource;
        }).catch(err => {
            logger.error('Error connecting to DB', err);
            process.exit(1);
        });
    }

    public getDataSource(): DataSource {
        return this.dataSource;
    }
}

// Export only one instance
const db = new ConnectToDb();
export default db;