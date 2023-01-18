import { SessionEntity } from './../entities/session.entity';
import { SendMailOptions } from 'nodemailer';
import { privateFields, UserEntity } from '../entities/user.entity';
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

    public generateVerificationCode(): string {
        return crypto.randomBytes(6).toString('hex');
    }

    public async sendVerifyMail(user: User): Promise<boolean> {
        const redirect_uri = config.get<string>('redirect_uri');
        const verifyLink = `${redirect_uri}/verify?id=${user.id}&verificationCode=${user.verificationCode}`;
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
        return await argon2.verify(user.password!, candidatePassword);
    }

    public async saveUser(user: User): Promise<User> {
        const dataSource = db.getDataSource();
        return await dataSource.getRepository<User>(UserEntity).save(user);
    }

    public async findUserById(id: number): Promise<User | null> {
        const dataSource = db.getDataSource();
        return await dataSource.getRepository<User>(UserEntity).findOneBy({
            id: id
        });
    }

    public async findUserByEmail(email: string): Promise<User | null> {
        const dataSource = db.getDataSource();
        return await dataSource.getRepository<User>(UserEntity).findOneBy({
            email: email
        });
    }

    public async findUsers(query: FetchUsersQuery): Promise<FetchUsersResult> {
        const take = query.take || 15;
        const page = query.page || 1;
        const skip = (page-1) * take;
        const dataSource = db.getDataSource();
        let where: object[] = [];
        where = query.ids.length > 0 ? [...where, { id: query.ids }] : where;

        const queryResult = await dataSource.createQueryBuilder(UserEntity, 'user')
                                    .take(take)
                                    .skip(skip)
                                    .where(where)
                                    .orderBy(`user.${query.order.by}`, query.order.order === 1 ? 'ASC' : 'DESC')
                                    .getManyAndCount();

        // Omit user's private fields
        queryResult[0].map(user => this.omitPrivateField(user));

        return {
            data: queryResult[0],
            count: queryResult[1]
        }
    }

}