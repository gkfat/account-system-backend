import { privateFields } from '../entities/user.entity';
import { Session } from '../entities/session.entity';
import { User } from '../entities/user.entity';
import ConnectToDb from '../utils/connectToDb';
import { signJwt } from '../utils/jwt';
import { omit } from 'lodash';
import UserService from './user.service';

export default class AuthService {

    public async signAccessToken(user: User): Promise<string> {
        const payload = omit(user, privateFields);
        const accessToken = signJwt(
            payload, 'accessTokenPrivateKey', {
            expiresIn: '3d'
        });
        
        // If no session then create one, if exist session then refresh access token
        const existSession = await this.findSessionByUser(user.id);

        if (!existSession) {
            const newSession = new Session();
            newSession.user = user;
            newSession.accessToken = accessToken;
            newSession.lastLoggedIn = new Date();
            await this.saveSession(newSession);
        } else {
            existSession.accessToken = accessToken;
            existSession.lastLoggedIn = new Date();
            await this.saveSession(existSession);
        }
        return accessToken;
    }

    public async saveSession(newSession: Session): Promise<Session> {
        return await Session.save(newSession);
    }

    public async findSessionByToken(token: string): Promise<Session | null> {
        return await Session.findOneBy({ accessToken: token });
    }

    public async findSessionByUser(id: number): Promise<Session | null> {
        return await Session.findOneBy({ user: { id: id } });
    }

}