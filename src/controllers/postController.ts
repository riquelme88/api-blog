import { Request, Response } from "express";
import * as postService from '../services/posts'
import * as likesService from '../services/likes'
import * as commentsService from '../services/comments'
import { ExtendedRequest } from "../types/extendedType";
import { findUserByEmail } from "../services/user";
import * as validationSchema from '../validations/postSchema'
import { userSchema } from "../validations/authSchema";
import { commentIdSchema } from "../validations/CommentSchema";


export const getPosts = async (req: ExtendedRequest, res: Response) => {
    const { page } = req.query

    try {
        const posts = await postService.getPosts(parseInt(page as string))
        res.json(posts)
    } catch (error) {
        console.log(error)
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
        res.status(400).json({ error: 'Ocorreu algum erro' })
        console.log(error)
    }
}

export const getPostsCategory = async (req: Request, res: Response) => {
    const safeData = validationSchema.categoryPostSchema.safeParse(req.query)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const posts = await postService.findPostsByCategory(safeData.data.category, parseInt(safeData.data.page as string))
        res.json(posts)
    } catch (error) {
        res.status(400).json({ error: 'Não encontrou nenhum post' })
    }
}

export const newPost = async (req: ExtendedRequest, res: Response) => {
    const safeData = validationSchema.newPostSchema.safeParse(req.body)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const user = await findUserByEmail(req.userEmail)
        const post = await postService.newPost({
            author: user?.name as string,
            body: safeData.data.body,
            title: safeData.data.title,
            userId: user?.id,
            category: safeData.data.category
        })

        res.status(201).json({ post })
    } catch (error) {
        res.status(400).json({ error: 'Ocorreu algum error' })
    }
}

export const updatePost = async (req: ExtendedRequest, res: Response) => {
    const safeData = validationSchema.PostSchema.safeParse(req.params)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }
    const safeDataBody = validationSchema.updatePostSchema.safeParse(req.body)
    if (!safeDataBody.success) {
        return res.status(400).json({ error: safeDataBody.error.flatten().fieldErrors })
    }
    try {
        const user = await findUserByEmail(req.userEmail)
        const post = await postService.updatePost(user?.id, safeData.data.id, safeDataBody.data.body as string, safeDataBody.data.titleBody as string)
        res.status(202).json(post)
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Ocorreu algum error' })
    }
}

export const deletePost = async (req: ExtendedRequest, res: Response) => {
    const safeData = validationSchema.deletePostSchema.safeParse(req.params)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const user = await findUserByEmail(req.userEmail)
        const postDelete = await postService.deletePost(safeData.data.id, user?.id)
        res.json({ delete: postDelete })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Ocorreu algum erro' })
    }
}

export const toogleLikePost = async (req: ExtendedRequest, res: Response) => {
    const safeData = validationSchema.PostSchema.safeParse(req.params)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const user = await findUserByEmail(req.userEmail)
        const liked = await likesService.checkIfPostLikedByUser(user?.id, safeData.data.id)
        if (!liked) {
            const like = await likesService.likePost(user?.id, safeData.data.id, user?.name as string)
            return res.status(201).json({ like })
        } else {
            const unlike = await likesService.unlikePost(user?.id, safeData.data.id)
            return res.json({ Desliked: true })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Não foi possivel curtir a postagem' })
    }
}

export const addComment = async (req: ExtendedRequest, res: Response) => {
    const safeDataPost = validationSchema.PostSchema.safeParse(req.params)
    const safeData = validationSchema.commentSchema.safeParse(req.body)
    if (!safeDataPost.success) {
        return res.status(400).json({ error: safeDataPost.error.flatten().fieldErrors })
    }
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const user = await findUserByEmail(req.userEmail)
        const post = await postService.findPostById(safeDataPost.data.id)
        const comment = await commentsService.addComment({
            comment: safeData.data.comment,
            postId: post?.id,
            userId: user?.id,
            userName: user?.name as string
        })

        res.json({ comment })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Ocorreu algum error' })
    }
}

export const removeComment = async (req: ExtendedRequest, res: Response) => {
    const safeData = commentIdSchema.safeParse(req.params)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const user = await findUserByEmail(req.userEmail)
        const comment = await commentsService.removeComment(safeData.data.id, user?.id)
        res.json({ comment })
    } catch (error) {
        res.status(400).json({ error: 'Ocorreu algum error' })
    }
}

export const updateComment = async (req: ExtendedRequest, res: Response) => {
    const safeData = commentIdSchema.safeParse(req.params)
    const safeDataComment = validationSchema.commentSchema.safeParse(req.body)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }
    if (!safeDataComment.success) {
        return res.status(400).json({ error: safeDataComment.error.flatten().fieldErrors })
    }

    try {
        const user = await findUserByEmail(req.userEmail)
        const newComment = await commentsService.updateComment(safeData.data.id, user?.id, safeDataComment.data.comment)
        res.json(newComment)

    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Não foi possivel atualizar o comentario' })
    }
}