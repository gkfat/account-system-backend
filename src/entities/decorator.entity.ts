import { EntitySchema } from 'typeorm';
import { BaseSchema } from './base.entity';
import { User } from './user.entity';


export class Decorator {
    [key: string]: any;

    categoryId!: number;
    name!: string;
    levelLimit!: number;
    content!: string;
    users!: User[];
}

export const DecoratorEntity = new EntitySchema<Decorator>({
    name: 'Decorator',
    columns: {
        ...BaseSchema,
        categoryId: {
            type: 'int',
            default: 0
        },
        name: {
            type: 'varchar',
            length: 100,
            nullable: true
        },
        levelLimit: {
            type: 'int',
            default: 1
        },
        content: {
            type: 'longtext'
        },
    },
})