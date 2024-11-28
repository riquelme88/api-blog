import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ExtendedRequest } from '../types/extendedType'
import { findUserByToken } from '../services/user'

export const jsonWebSign = (email: string) => {
    return jwt.sign(email, process.env.SECRET_KEY as string)
}

export const midleware = (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const header = req.headers['authorization']

    if (!header) return res.status(401).json({ error: 'Mande um header' })

    const token = header.split(' ')[1]

    const verify = jwt.verify(token, process.env.SECRET_KEY as string,
        async (error, decoded: any) => {
            if (error) return res.status(401).json({ error: 'Token inválido' })

            const user = await findUserByToken(token)
            if (!user) return res.status(401).json({ error: 'Acesso negado' })

            req.userEmail = user.email
            next()
        }
    )
}