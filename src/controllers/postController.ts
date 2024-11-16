import { RequestHandler } from "express";
import * as postService from '../services/posts'


export const getPosts: RequestHandler = async (req, res) => {
    const { page } = req.query

    try {
        const posts = await postService.getPosts(parseInt(page as string))
        res.json(posts)
    } catch (error) {
        res.status(400).json({ error: 'Ocorreu algum error' })
    }
}