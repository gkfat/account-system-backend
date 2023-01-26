import { Decorator, DecoratorEntity } from './../entities/decorator.entity';
import db from '../utils/connectToDb';
import UserService, { FetchUsersQuery } from './user.service';
import { In, UpdateResult } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

export type FetchDecoratorsQuery = {
    ids: number[];
    categoryIds: number[];
    page: number;
    take: number;
    order: {
        by: string;
        order: number;
    }
}

export type FetchDecoratorsResult = {
    data: Decorator[];
    count: number;
}

export default class DecoratorService {
    public async saveDecorator(decorator: Decorator): Promise<Decorator> {
        const dataSource = db.getDataSource();
        return await dataSource.getRepository<Decorator>(DecoratorEntity).save(decorator);
    }

    public async findDecoratorById(id: number): Promise<Decorator | null> {
        const dataSource = db.getDataSource();
        return await dataSource.getRepository<Decorator>(DecoratorEntity).findOne({
            where: { id: id }
        });
    }

    public async deleteDecoratorById(id: number): Promise<UpdateResult> {
        const dataSource = db.getDataSource();
        return await dataSource.getRepository<Decorator>(DecoratorEntity).softDelete({
            id: id
        })
    }

    public async findDecorators(query: FetchDecoratorsQuery): Promise<FetchDecoratorsResult> {
        const take = query.take || 15;
        const page = query.page || 1;
        const skip = (page-1) * take;
        const dataSource = db.getDataSource();
        const userService = new UserService();

        let where: object[] = [];
        where = query.ids.length > 0 ? [...where, { id: In(query.ids) }] : where;
        where = query.categoryIds.length > 0 ? [...where, { categoryId: In(query.categoryIds) }] : where;

        const queryResult = await dataSource.createQueryBuilder(DecoratorEntity, 'decorator')
                                    .take(take)
                                    .skip(skip)
                                    .where(where)
                                    .orderBy(`decorator.${query.order.by}`, query.order.order === 1 ? 'ASC' : 'DESC')
                                    .getManyAndCount()
        // queryResult[0].forEach(async d => {
        //     d.users = [];
        //     const findUsers = await dataSource.createQueryBuilder(UserEntity, 'user')
        //                                 .take(take)
        //                                 .skip(skip)
        //                                 .where('user.avatarId = :id or user.frameId = :id', { id: d.id })
        //                                 .orderBy('user.id', 'DESC')
        //                                 .getMany();
        //     findUsers.forEach(u => d.users.push(userService.omitPrivateField(u)));
        // })

        return {
            data: queryResult[0],
            count: queryResult[1]
        }
    }
}