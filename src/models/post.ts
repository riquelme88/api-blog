import { connection, Model, model, Schema, Types } from "mongoose"

export type PostsType = {
    title: string,
    author: string,
    body: string,
    likes?: number,
    userId: Types.ObjectId,
    comments?: [{
        userId: Types.ObjectId,
        comment: string
    }]
}

const postSchema = new Schema<PostsType>({
    title: { type: String, required: true },
    author: { type: String, ref: 'User', required: true },
    body: { type: String, required: true },
    likes: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    comments: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        comment: String
    }]
})

const modelPostName = "Post"

export default (connection && connection.models[modelPostName]) ?
    connection.models[modelPostName] as Model<PostsType> :
    model<PostsType>(modelPostName, postSchema)