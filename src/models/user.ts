import { Schema, model, connection, Types, Model } from 'mongoose'

export type UserType = {
    name: string,
    email: string,
    password: string
    posts?: [{
        id: Types.ObjectId
    }],
    token: string
}

const userSchema = new Schema<UserType>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'posts' }],
    token: { type: String, required: true }
})

const modelUserName = "User"

export default (connection && connection.models[modelUserName]) ?
    connection.models[modelUserName] as Model<UserType> :
    model<UserType>(modelUserName, userSchema)

