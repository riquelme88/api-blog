import { connection, Model, model, Schema, Types } from "mongoose"

export type LikesType = {
    userName: string,
    postId: Types.ObjectId,
    user: Types.ObjectId,
    liked: boolean
}

const likeSchema = new Schema<LikesType>({
    userName: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    liked: { type: Boolean, default: false }
}, { timestamps: true })


const modelPostName = "Like"

export default (connection && connection.models[modelPostName]) ?
    connection.models[modelPostName] as Model<LikesType> :
    model<LikesType>(modelPostName, likeSchema)