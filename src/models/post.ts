import { connection, Model, model, Schema, Types } from "mongoose"
import comments from "./comments"

export type PostsType = {
    title: string,
    author: string,
    body: string,
    userId: String,
    comments?: [Types.ObjectId],
    likes?: [Types.ObjectId],
    category: string
}

const postSchema = new Schema<PostsType>({
    title: { type: String, required: true },
    author: { type: String, ref: 'User', required: true },
    body: { type: String, required: true },
    userId: { type: String, required: true, ref: 'User' },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Like'
    }],
    category: String
})

const modelPostName = "Post"

export default (connection && connection.models[modelPostName]) ?
    connection.models[modelPostName] as Model<PostsType> :
    model<PostsType>(modelPostName, postSchema)