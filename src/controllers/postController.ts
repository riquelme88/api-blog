import { Response } from "express";
import * as postService from '../services/posts'
import { ExtendedRequest } from "../types/extendedType";
import { findUserByEmail } from "../services/user";
import { newPostSchema, updatePostSchema, updateQueryPostSchema } from "../validations/postSchema";
import { Types } from "mongoose";
import { userSchema } from "../validations/authSchema";


export const getPosts = async (req: ExtendedRequest, res: Response) => {
    const { page } = req.query

    try {
        const posts = await postService.getPosts(parseInt(page as string))
        res.json(posts)
    } catch (error) {
        res.status(400).json({ error: 'Ocorreu algum error' })
    }
}

export const getPostsUser = async (req: ExtendedRequest, res: Response) => {
    const { page } = req.query
    const safeData = userSchema.safeParse(req.params)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const posts = await postService.getPostsbyUser(safeData.data.name, parseInt(page as string))
        res.json(posts)
    } catch (error) {

    }
}

export const newPost = async (req: ExtendedRequest, res: Response) => {
    const safeData = newPostSchema.safeParse(req.body)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const user = await findUserByEmail(req.userEmail)
        const post = await postService.newPost({
            author: user?.name as string,
            body: safeData.data.body,
            title: safeData.data.title,
            userId: user?.id as Types.ObjectId,
        })

        res.status(201).json({ post })
    } catch (error) {
        res.status(400).json({ error: 'Ocorreu algum error' })
    }
}

//Melhorar codigo de update dps!
export const updatePost = async (req: ExtendedRequest, res: Response) => {
    const safeData = updatePostSchema.safeParse(req.body)
    const safeDataQuery = updateQueryPostSchema.safeParse(req.query)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }
    if (!safeDataQuery.success) {
        return res.status(400).json({ error: safeDataQuery.error.flatten().fieldErrors })
    }
    try {
        const user = await findUserByEmail(req.userEmail)
        const post = await postService.updatePost(user?.id, safeDataQuery.data?.title as string, safeData.data.body as string, safeData.data.titleBody as string)
        res.status(202).json(post)
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Ocorreu algum error' })
    }
}

export const deletePost = async (req: ExtendedRequest, res: Response) => {
    const safeDataQuery = updateQueryPostSchema.safeParse(req.query)
    if (!safeDataQuery.success) {
        return res.status(400).json({ error: safeDataQuery.error.flatten().fieldErrors })
    }

    try {
        const user = await findUserByEmail(req.userEmail)
        const postDelete = await postService.deletePost(safeDataQuery.data.title, user?.id)
        res.json({ delete: postDelete })
    } catch (error) {
        res.status(400).json({ error: 'Ocorreu algum erro' })
    }
}