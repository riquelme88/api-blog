import { RequestHandler } from "express"
import { singinSchema, singupSchema } from "../validations/authSchema"
import * as userService from '../services/user'
import { jsonWebSign } from "../midleware/jwt"

export const registerUser: RequestHandler = async (req, res) => {
    const safeData = singupSchema.safeParse(req.body)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    const hasUser = await userService.findUserByEmail(safeData.data.email)
    if (hasUser) return res.status(400).json({ error: 'Usuario já existente' })
    try {
        const token = jsonWebSign(safeData.data.email)

        const newUser = await userService.addUser({
            email: safeData.data.email,
            name: safeData.data.name,
            password: safeData.data.password,
            token
        })
        res.status(201).json({ data: newUser })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: "Ocorreu algum error" })
    }
}

export const loginUser: RequestHandler = async (req, res) => {
    const safeData = singinSchema.safeParse(req.body)
    if (!safeData.success) {
        return res.status(400).json({ error: safeData.error.flatten().fieldErrors })
    }

    try {
        const user = await userService.userLogin(safeData.data.email, safeData.data.password)
        res.json({ data: { userEmail: user.email, userName: user.name, token: user.token } })
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Email/senha incorreta' })
    }
}