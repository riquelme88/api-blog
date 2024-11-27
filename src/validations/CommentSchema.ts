import { z } from "zod";

export const commentSchema = z.object({
    comment: z.string({ message: 'Mande um comentario' }).min(2, { message: 'O comentário deve ter no minimo 2 caracteres' })
})

export const commentIdSchema = z.object({
    id: z.string({ message: 'Mande o id do comentario' })
})