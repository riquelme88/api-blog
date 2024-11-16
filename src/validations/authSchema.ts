import { z } from "zod";

export const singupSchema = z.object({
    email: z.string({ message: 'Mande um Email' }).email('Mande um email válido'),
    name: z.string().min(2),
    password: z.string({ message: 'Mande uma senha' }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        { message: 'Senha deve conter uma letra minuscul, maiuscula, simbolo, numero e no minimo 8 caracteres' })
})

export const singinSchema = z.object({
    email: z.string({ message: 'Mande um Email' }).email('Mande um email válido'),
    password: z.string({ message: 'Mande uma senha' }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        { message: 'Senha deve conter uma letra minuscul, maiuscula, simbolo, numero e no minimo 8 caracteres' })
})