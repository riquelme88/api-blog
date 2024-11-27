import { string, z } from "zod";

export const newPostSchema = z.object({
    body: z.string({ message: 'Mande um corpo' }),
    title: z.string({ message: 'Mande um titulo' }).min(2, { message: 'O titulo deve conte rno minimo 2 caracteres' }),
    category: z.string({ message: 'Mande uma categoria' }).min(2, { message: 'A categoria deve conter' })
})

export const updatePostSchema = z.object({
    body: z.string().optional(),
    titleBody: z.string().optional()
})

export const updateQueryPostSchema = z.object({
    title: z.string({ message: 'Mande um titulo de pesquisa' })
})

export const PostSchema = z.object({
    id: z.string({ message: 'Mande o id' })
})

export const commentSchema = z.object({
    comment: z.string({ message: 'Mande um comentario' }).min(2, { message: 'No minimo 2 caracteres no comentario' })
})

export const deletePostSchema = z.object({
    id: z.string({ message: 'Mande o id' })
})

export const categoryPostSchema = z.object({
    category: z.string({ message: 'Mande a categoria' })
})