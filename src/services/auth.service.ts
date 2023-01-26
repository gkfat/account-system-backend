import { Session, SessionEntity } from '../entities/session.entity';
import { User } from '../entities/user.entity';
import { generateToken, verifyToken } from '../utils/jwt';
import db from '../utils/connectToDb';
import UserService from './user.service';

export default class AuthService {

    public async signAccessToken(user: User): Promise<{ accessToken: string }> {
        const userService = new UserService();
        const omitUser = await userService.omitField(user, 'private');
        const accessToken = generateToken(omitUser, 'accessTokenSecret');
        return {
            accessToken
        };
    }

    // public async signRefreshToken(accessToken: string): Promise<{ refreshToken: string }> {
    //     const refreshToken = generateToken(accessToken, 'refreshTokenSecret');
    //     return {
    //         refreshToken
    //     };
    // }

    public async saveSession(newSession: Session): Promise<Session> {
        const dataSource = db.getDataSource();
        return await dataSource.getRepository<Session>(SessionEntity).save(newSession);
    }

    public async findSessionByToken(token: string): Promise<Session | null> {
        const dataSource = db.getDataSource();
        return await dataSource.getRepository<Session>(SessionEntity)
                .createQueryBuilder('session')
                .where('session.accessToken = :t OR session.refreshToken = :t', { t: token })
                .getOne();
    }

    public async findSessionByUser(id: number): Promise<Session | null> {
        const dataSource = db.getDataSource();
        return await dataSource.getRepository<Session>(SessionEntity).findOneBy({
            user: {
                id: id
            }
        });
    }

    public async revokeSession(session: Session) {
        session.accessToken = '';
        session.refreshToken = '';
        await this.saveSession(session);
    }

}