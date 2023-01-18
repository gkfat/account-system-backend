import { EntitySchema } from 'typeorm';
import { User } from './user.entity';
import { BaseSchema } from './base.entity';

export class Session {
    id!: number;
    lastLoggedIn!: Date | null;
    accessToken!: string;
    refreshToken!: string;
    user!: User;
}

export const SessionEntity = new EntitySchema<Session>({
    name: 'Session',
    columns: {
        ...BaseSchema,
        lastLoggedIn: {
            type: 'datetime',
            nullable: true
        },
        accessToken: {
            type: 'longtext',
            nullable: true
        },
        refreshToken: {
            type: 'longtext',
            nullable: true
        }
    },
    relations: {
        user: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: true
        }
    }
})

// @Entity()
// export class Session extends BaseEntity {
//     @PrimaryGeneratedColumn()
//     id!: number;

//     @CreateDateColumn()
//     createdAt!: Date;

//     @UpdateDateColumn({ nullable: true })
//     updatedAt!: Date | null;

//     @DeleteDateColumn({ nullable: true })
//     deletedAt!: Date | null;

//     @Column({ type: 'datetime', nullable: true })
//     lastLoggedIn!: Date | null;

//     @Column({ type: 'longtext', nullable: true })
//     accessToken!: string;

//     @ManyToOne((type) => User, {
//         createForeignKeyConstraints: true
//     })
//     user!: User;
// }