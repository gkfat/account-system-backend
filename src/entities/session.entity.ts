import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Index, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Session extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt: Date | null = null;

    @DeleteDateColumn({ nullable: true })
    deletedAt: Date | null = null;

    @Column({ type: 'datetime', nullable: true })
    lastLoggedIn!: Date | null;

    @Column('longtext', { nullable: true })
    accessToken!: string;

    @ManyToOne((type) => User, {
        createForeignKeyConstraints: true
    })
    user!: User;
}