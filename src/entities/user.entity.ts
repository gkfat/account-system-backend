import { Decorator } from './decorator.entity';
import { Session } from './session.entity';
import { EntitySchema, EntitySchemaRelationOptions } from 'typeorm';
import { BaseSchema } from './base.entity';

export const privateFields = {
    private: [
        'password',
        'resetPasswordCode',
        'verificationCode'
    ],
    public: [
        'email',
        'firstName',
        'lastName',
        'password',
        'resetPasswordCode',
        'verificationCode'
    ]
}

export class User {
    [key: string]: any;
    
    email!: string;
    roleLevel!: number;
    firstName!: string | null;
    lastName!: string | null;
    nickName!: string;
    level!: number;
    experience!: number;
    avatarId!: number;
    frameId!: number;
    password!: string | null;
    verificationCode!: string | null;
    verified!: boolean;
    sessions!: Session[];
}

export const UserEntity = new EntitySchema<User>({
    name: 'User',
    columns: {
        ...BaseSchema,
        email: {
            type: 'varchar',
            length: 100
        },
        firstName: {
            type: 'varchar',
            length: 100,
            nullable: true
        },
        lastName: {
            type: 'varchar',
            length: 100,
            nullable: true
        },
        nickName: {
            type: 'varchar',
            length: 100,
            nullable: true
        },
        roleLevel: {
            type: 'int',
            default: 0
        },
        level: {
            type: 'int',
            default: 1
        },
        experience: {
            type: 'int',
            default: 0
        },
        avatarId: {
            type: 'int',
            default: 1
        },
        frameId: {
            type: 'int',
            default: 1
        },
        password: {
            type: 'varchar',
            length: 100,
            nullable: true
        },
        verificationCode: {
            type: 'longtext',
            nullable: true
        },
        verified: {
            type: 'boolean',
            default: false
        }
    },
    relations: {
        sessions: {
            target: 'Session',
            type: 'one-to-many',
            inverseSide: 'User'
        },
    },
    indices: [
        {
            name: 'unique_email',
            unique: true,
            columns: ['email', 'deletedAt']
        }
    ]
})