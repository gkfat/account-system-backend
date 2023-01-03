import { SendMailOptions } from 'nodemailer';
import { privateFields } from '../entities/user.entity';
import argon2 from 'argon2';
import sendEmail from '../utils/mailer';
import logger from '../utils/logger';
import config from 'config';
import crypto from 'crypto';
import db from '../utils/connectToDb';
import { User } from '../entities/user.entity';
import { omit } from 'lodash';
import { Session } from '../entities/session.entity';

export type FetchUsersQuery = {
    ids: number[];
    page: number;
    take: number;
    order: {
        by: string;
        order: number;
    }
}

export type FetchUsersResult = {
    users: FindUsersResult,
    activeUsersToday: FindUsersResult,
    averageUsersLast7Days: FindUsersResult
}

export type FindUsersResult = {
    data: User[];
    count: number;
}

export default class UserService {

    public async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    public omitPrivateField(user: User): User {
        const partialUser = omit<{[key: string]: any}>(user, privateFields);
        const keys = Object.keys(partialUser);
        const result = new User();
        keys.forEach(key => {
            result[key] = partialUser[key];
        })
        return result;
    }

    public createVerificationCode(): string {
        return crypto.randomBytes(6).toString('base64');
    }

    public async sendVerifyMail(user: User): Promise<boolean> {
        const domain = config.get<string>('domain');
        const verifyLink = `${domain}/verify?id=${user.id}&verificationCode=${user.verificationCode}`;
        logger.info(`Verify mail send to user id: ${user.id}, name: ${user.firstName} ${user.lastName}, verifyLink: ${verifyLink}`);
        // const payload: AWS.SES.SendEmailRequest = {
        //     Source: config.get('smtp.sender'),
        //     Destination: {
        //         ToAddresses: [user.email]
        //     },
        //     Message: {
        //         Body: {
        //             Html: {
        //                 Data: `
        //                 <p>Dear ${user.firstName} ${user.lastName}</p>
        //                 <p>Please click the link to verify your account:
        //                     <a href="${verifyLink}">${verifyLink}</a>
        //                 </p>
        //                 `
        //             }
        //         },
        //         Subject: {
        //             Data: 'Please verify your account'
        //         }
        //     }
        // }
        const payload: SendMailOptions = {
            from: config.get('smtp.sender'),
            to: user.email,
            subject: 'Please verify your account',
            html: `
            <p>Dear ${user.firstName} ${user.lastName}</p>
            <p>Please click the link to verify your account:
                <a href="${verifyLink}">${verifyLink}</a>
            </p>
            `
        }
        return await sendEmail(payload);
    }

    public async validatePassword(user: User, candidatePassword: string): Promise<boolean> {
        return await argon2.verify(user.password, candidatePassword);
    }

    public async saveUser(user: User): Promise<User> {
        return await User.save(user);
    }

    public async findUserById(id: number): Promise<User | null> {
        return await User.findOneBy({ id: id });
    }

    public async findUserByEmail(email: string): Promise<User | null> {
        return await User.findOneBy({ email: email });
    }

    public async findUsers(query: FetchUsersQuery): Promise<FindUsersResult> {
        const take = query.take || 15;
        const page = query.page || 1;
        const skip = (page-1) * take;
        const dataSource = db.getDataSource();

        const queryResult = await dataSource.createQueryBuilder(User, 'user')
                                    .leftJoinAndSelect('session', 'session', 'session.userId = user.id')
                                    .take(take)
                                    .skip(skip)
                                    .orderBy(`user.${query.order.by}`, query.order.order === 1 ? 'ASC' : 'DESC')
                                    .getManyAndCount();
        queryResult[0].forEach((user, i) => {
            dataSource.createQueryBuilder(Session, 'session')
                .where('session.userId = :id', { id: user.id })
                .getMany().then(sessions => {
                    user.sessions = sessions;
                    queryResult[0][i] = this.omitPrivateField(user);
                });
        })
        return {
            data: queryResult[0],
            count: queryResult[1]
        }
    }

    public async findActiveUsersToday(): Promise<FindUsersResult> {
        const startDate = new Date();
        const d1 = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDate = new Date();
        endDate.setTime(new Date().getTime() + (1 * 24 * 60 * 60 * 1000));
        const d2 = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        const dataSource = db.getDataSource();
        const queryResult = await dataSource.createQueryBuilder(User, 'user')
                                    .leftJoinAndSelect('session', 'session', 'session.userId = user.id')
                                    .where('session.accessToken != :s', { s: '' })
                                    .andWhere('session.lastLoggedIn >= :d1 AND session.lastLoggedIn <= :d2', { d1: d1, d2: d2 })
                                    .getManyAndCount()
        return {
            data: queryResult[0].map(user => this.omitPrivateField(user)),
            count: queryResult[1]
        }
    }

    public async findAverageUsersLast7Days(): Promise<FindUsersResult> {
        const today = new Date();
        const startDate = new Date().setTime(today.getTime() - (7 * 24 * 60 * 60 * 1000));

        const dataSource = db.getDataSource();
        const queryResult = await dataSource.createQueryBuilder(User, 'user')
                                    .leftJoinAndSelect('session', 'session', 'session.userId = user.id')
                                    .where('session.lastLoggedIn >= :d', { d: startDate })
                                    .getManyAndCount()
        return {
            data: queryResult[0].map(user => this.omitPrivateField(user)),
            count: queryResult[1]
        }
    }

}