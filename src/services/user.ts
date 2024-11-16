import { error } from "console"
import user, { UserType } from "../models/user"
import bcrypt from 'bcrypt'


export const findUserByEmail = async (email: string) => {
    const userEmail = await user.findOne({ email })
    return userEmail
}


export const addUser = async (data: UserType) => {
    const password = await bcrypt.hash(data.password, 10)

    const newUser = user.create({
        email: data.email,
        name: data.name,
        password
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