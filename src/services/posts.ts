import { Types } from "mongoose"
import post, { PostsType } from "../models/post"
import { findUserByEmail, findUserByName } from "./user"
import { title } from "process"

export const getPosts = async (page: number) => {
    const posts = await post.find().select({ userId: 0 }).limit(4).skip((page - 1) * 4)

    if (!posts) {
        throw new Error('not found posts')
    }

    return posts
}

export const getPostsbyUser = async (name: string, page: number) => {
    const oneUser = await findUserByName(name)
    if (!oneUser) {
        throw new Error('not existing this User')
    }
    const posts = await post.find({ userId: oneUser.id }).select({ id: 0, userId: 0 }).limit(4).skip((page - 1) * 4)
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
        userId: data.userId
    })

    if (!newPost) {
        throw new Error('Not possible create a user')
    }

    return newPost
}

export const updatePost = async (userId: Types.ObjectId, title: string, body: string, titleBody: string) => {
    const query = { title, userId }

    const postUpdate = await post.findOneAndUpdate(query, { body, title: titleBody })

    if (!postUpdate) {
        throw new Error('not possible update this post')
    }

    return postUpdate
}

export const deletePost = async (title: string, userId: Types.ObjectId) => {
    const query = { title, userId }
    const postDelete = post.findOneAndDelete(query)

    if (!postDelete) {
        throw new Error('Not possible delete this post')
    }

    return postDelete
}