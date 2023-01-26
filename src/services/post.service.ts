import db from '../utils/connectToDb';
import { Post, PostEntity } from '../entities/post.entity';
import UserService from './user.service';
import { In } from 'typeorm';

export type FetchPostsQuery = {
    ids: number[];
    authorIds: number[];
    withContent: boolean;
    categoryIds: number[];
    page: number;
    take: number;
    order: {
        by: string;
        order: number;
    }
}

export type FetchPostsResult = {
    data: Post[];
    count: number;
}

export default class PostService {
    public async savePost(post: Post): Promise<Post> {
        const dataSource = db.getDataSource();
        return await dataSource.getRepository<Post>(PostEntity).save(post);
    }

    public async findPostById(id: number): Promise<Post | null> {
        const dataSource = db.getDataSource();
        return await dataSource.getRepository<Post>(PostEntity).findOne({
            where: { id: id },
            relations: ['author']
        });
    }

    public async findPosts(query: FetchPostsQuery): Promise<FetchPostsResult> {
        const withContent = query.withContent;
        const take = query.take || 15;
        const page = query.page || 1;
        const skip = (page-1) * take;
        const dataSource = db.getDataSource();
        const userService = new UserService();

        let where: object[] = [];
        where = query.ids.length > 0 ? [...where, { id: In(query.ids) }] : where;
        where = query.categoryIds.length > 0 ? [...where, { categoryId: In(query.categoryIds) }] : where;
        where = query.authorIds.length > 0 ? [...where, { author: { id: In(query.authorIds) } }] : where;

        const queryResult = await dataSource.createQueryBuilder(PostEntity, 'post')
                                    .leftJoinAndSelect('post.author', 'author')
                                    .take(take)
                                    .skip(skip)
                                    .where(where)
                                    .orderBy(`post.${query.order.by}`, query.order.order === 1 ? 'ASC' : 'DESC')
                                    .getManyAndCount();
        
        // Omit user's private fields
        queryResult[0].forEach(async post => {
            post.author = await userService.omitField(post.author, 'public');
            if ( !withContent ) {
                post.content = '';
            }
        })
        return {
            data: queryResult[0],
            count: queryResult[1]
        }
    }
}