import { error } from "console"
import user, { UserType } from "../models/user"
import bcrypt from 'bcrypt'
import { jsonWebSign } from "../midleware/jwt"


export const findUserByEmail = async (email: string) => {
    const userEmail = await user.findOne({ email }).populate('posts')
    return userEmail
}

export const findUserByName = async (name: string) => {
    const oneUser = await user.findOne({ name })
    if (!oneUser) {
        throw new Error('Not existing this user')
    }

    return oneUser
}

export const findUserByToken = async (token: string) => {
    const userToken = await user.findOne({ token })
    if (!userToken) {
        throw new Error('No existing this user')
    }

    return userToken
}

export const addUser = async (data: UserType) => {
    const password = await bcrypt.hash(data.password, 10)

    const newUser = user.create({
        email: data.email,
        name: data.name,
        password,
        token: data.token
    })

    if (!newUser) {
        console.log(error)
        throw new Error('Not possible create user')
    }
    return newUser
}

export const userLogin = async (email: string, password: string) => {
    const hasUser = await findUserByEmail(email)

    if (!hasUser) {
        throw new Error('User not existing')
    }
    const passwordHash = await bcrypt.compare(password, hasUser.password)

    if (!passwordHash) {
        throw new Error('Password incorrectly ')
    }

    return hasUser

}