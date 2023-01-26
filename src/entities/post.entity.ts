import { Session } from './session.entity';
import { EntitySchema } from 'typeorm';
import { BaseSchema } from './base.entity';
import { User } from './user.entity';

export class Post {
    [key: string]: any;
    
    title!: string;
    description!: string;
    content!: string;
    categoryId!: number;
    author!: User;
}

export const PostEntity = new EntitySchema<Post>({
    name: 'Post',
    columns: {
        ...BaseSchema,
        title: {
            type: 'varchar',
            length: 100
        },
        description: {
            type: 'varchar',
            length: 150
        },
        content: {
            type: 'longtext',
            nullable: true
        },
        categoryId: {
            type: 'int',
            default: 0
        },
    },
    relations: {
        author: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: true
        }
    }
})
