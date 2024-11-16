import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { findUserByEmail } from '../services/user'

export const jsonWebSign = (email: string) => {
    return jwt.sign(email, process.env.SECRET_KEY as string)
}

export const midleware: RequestHandler = (req, res, next) => {
    const header = req.headers['authorization']
    if (!header) return res.status(401).json({ error: 'Mande um header' })
    const token = header.split(' ')[1]

    try {
        jwt.verify(token, process.env.SECRET_KEY as string)
        next()
    } catch (error) {
        return res.json({ error: 'Token inválido' })
    }
}