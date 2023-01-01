import { Session } from './session.entity';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, Unique } from 'typeorm';

export const privateFields = [
    'password',
    'resetPasswordCode',
    'verificationCode'
];

@Entity()
@Unique('unique_email', ['email', 'deletedAt'])
export class User extends BaseEntity {
    [key: string]: any;

    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt: Date | null = null;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null = null;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ nullable: true })
    password!: string;

    @Column()
    verificationCode!: string;

    @Column({ default: false })
    verified!: boolean;

    @Column()
    loggedInTimes!: number;

    @Column()
    email!: string;

    @OneToMany((type) => User, user => user.id )
    sessions!: Session[];
}