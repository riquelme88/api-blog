import { Types } from "mongoose"
import post, { PostsType } from "../models/post"
import { findUserByName } from "./user"
import user from "../models/user"

export const getPosts = async (page: number) => {
    const validPage = isNaN(page) || page < 1 ? 1 : page;

    const posts = await post.aggregate([
        {
            $skip: (validPage - 1) * 4
        },
        {
            $limit: 4
        },
        {
            $addFields: {
                likes: { $size: "$likes" },
            }
        },
        {
            $lookup: {
                from: 'comments',
                localField: 'comments',
                foreignField: '_id',
                as: 'comment'
            }
        },
        {
            $project: {
                _id: 0,
                userId: 0,
                __v: 0,
                comment: {
                    _id: 0,
                    postId: 0,
                    userId: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0
                },
                comments: 0
            }
        }
    ])


    if (!posts) {
        throw new Error('not found posts')
    }

    return posts
}

export const findPostByName = async (title: string) => {
    const postName = await post.findOne({ title })

    if (!postName) {
        throw new Error('not possible find the post')
    }

    return postName
}

export const findPostsByCategory = async (category: string, page: number) => {
    const validPage = isNaN(page) || page < 1 ? 1 : page;

    const posts = await post.aggregate([
        { $match: { category } },
        {
            $lookup: { // pesquisar o comments
                from: 'comments',
                localField: 'comments',
                foreignField: '_id',
                as: 'comment'
            }
        },
        {
            $addFields: { likes: { $size: "$likes" }, }
        },
        {
            $project: {
                _id: 0,
                userId: 0,
                comments: 0,
                __v: 0,
                comment: {
                    _id: 0,
                    postId: 0,
                    userId: 0,
                    __v: 0,
                    createdAt: 0
                }
            }
        },
        { $skip: (validPage - 1) * 4 },
        { $limit: 4 }
    ])

    if (!posts) {
        throw new Error('Not found posts!')
    }

    return posts
}

export const findPostById = async (id: string) => {
    const posts = await post.findById(id)

    return posts
}

export const getPostsbyUser = async (name: string, page: number) => {
    const oneUser = await findUserByName(name)
    if (!oneUser) {
        throw new Error('not exist this User')
    }

    const validPage = isNaN(page) || page < 1 ? 1 : page;
    const posts = await post.aggregate([
        { $match: { userId: oneUser.id } },
        {
            $lookup: {
                from: "comments", // Nome da coleção de comentários
                localField: "comments", // Campo no postSchema que contém os IDs dos comentários
                foreignField: "_id",    // Campo na coleção de comentários que corresponde
                as: "comment",   // Nome do campo que será criado com os detalhes
            },
        },
        {
            $project: {
                _id: 0,
                userId: 0,
                __v: 0,
                comment: {
                    _id: 0,
                    postId: 0,
                    userId: 0,
                    createdAt: 0,
                    updatedAt: 0,
                    __v: 0
                },
                comments: 0
            },
        },
        {
            $addFields: {
                likes: { $size: "$likes" },
            }
        },
        { $skip: (validPage - 1) * 4 },
        { $limit: 4 },
    ]);


    if (!posts) {
        throw new Error('not found posts')
    }

    return posts
}

export const newPost = async (data: PostsType) => {
    const newPost = await post.create({
        author: data.author,
        body: data.body,
        title: data.title,
        userId: data.userId,
        category: data.category
    })

    if (!newPost) {
        throw new Error('Not possible create a user')
    }

    await user.findByIdAndUpdate(
        data.userId,
        { $push: { posts: newPost._id } }, // Adiciona o ID do novo post no array 'posts'
        { new: true }
    );

    return newPost
}

export const updatePost = async (userId: Types.ObjectId, id: string, body: string, titleBody: string) => {
    const query = { _id: id, userId }

    const postUpdate = await post.findOneAndUpdate(query, { body, title: titleBody }, { new: true })

    if (!postUpdate) {
        throw new Error('not possible update this post')
    }

    return postUpdate
}

export const deletePost = async (id: string, userId: Types.ObjectId) => {
    const query = { id, userId }
    const postDelete = await post.findOneAndDelete({
        _id: query.id,
        userId: query.userId
    })

    if (!postDelete) {
        throw new Error('Not possible delete this post')
    }

    await user.findByIdAndUpdate(
        userId,
        { $pull: { posts: postDelete.id } }
    )

    return postDelete
}
