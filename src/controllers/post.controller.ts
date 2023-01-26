import {
    CreatePostInput,
    UpdatePostInput,
    FetchPostsInput
} from '../schemas/post.schema';
import { Request, Response } from 'express';
import { Post } from '../entities/post.entity';
import PostService, { FetchPostsQuery, FetchPostsResult } from '../services/post.service';
import UserService from '../services/user.service';

async function createPostHandler(req: Request<{}, {}, CreatePostInput>, res: Response) {
    const { title, content, description, authorId, categoryId } = req.body;
    const postService = new PostService();
    const userService = new UserService();

    const findUser = await userService.findUserById(authorId);

    if (!findUser) {
        return res.status(400).send({
            data: null,
            message: 'Create post failed!'
        });
    }

    if (categoryId === 1 && findUser.roleLevel === 0) {
        return res.status(403).send({
            data: null,
            message: 'Role level not permitted!'
        });
    }

    const newPost = new Post();
    newPost.title = title;
    newPost.content = content;
    newPost.description = description;
    newPost.categoryId = categoryId;
    newPost.author = findUser;

    await postService.savePost(newPost);

    return res.send({
        data: newPost,
        message: 'Create post success!'
    });
}

async function updatePostHandler(req: Request<{}, {}, UpdatePostInput>, res: Response) {
    const { id, title, description, content, categoryId } = req.body;
    const postService = new PostService();

    const findPost = await postService.findPostById(id);

    if (!findPost) {
        return res.status(400).send({
            data: null,
            message: 'Post not created!'
        });
    }

    // Users can only edit theirs own posts
    const user = res.locals.user.payload;
    if (findPost.author.id !== user.id) {
        return res.status(400).send({
            data: null,
            message: 'User mismatch the author!'
        });
    }

    findPost.title = title;
    findPost.description = description;
    findPost.content = content;
    findPost.categoryId = categoryId;
    await postService.savePost(findPost);

    return res.send({
        data: findPost,
        message: 'Update post success!'
    });
}

async function fetchPostsHandler(req: Request<{}, {}, FetchPostsInput>, res: Response) {
    const postService = new PostService();
    const query: FetchPostsQuery = req.body;
    const result: FetchPostsResult = await postService.findPosts(query);
    return res.send({
        message: 'Fetch posts success!',
        data: result
    });
}

export {
    createPostHandler,
    updatePostHandler,
    fetchPostsHandler
};