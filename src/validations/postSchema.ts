import { string, z } from "zod";

export const newPostSchema = z.object({
    body: z.string({ message: 'Mande um corpo' }),
    title: z.string({ message: 'Mande um titulo' }).min(2, { message: 'O titulo deve conte rno minimo 2 caracteres' }),
})

export const updatePostSchema = z.object({
    body: z.string().optional(),
    titleBody: z.string().optional()
})

export const updateQueryPostSchema = z.object({
    title: z.string({ message: 'Mande um titulo de pesquisa' })
})