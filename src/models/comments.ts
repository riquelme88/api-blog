import { connection, Model, model, Schema, Types } from "mongoose"

export type CommentsType = {
    userId: Types.ObjectId,
    userName: String,
    comment: String,
    postId: Types.ObjectId
}

const commentSchema = new Schema<CommentsType>({
    userName: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    comment: { type: String, required: true, min: 2 }
}, { timestamps: true })


const modelPostName = "Comment"

export default (connection && connection.models[modelPostName]) ?
    connection.models[modelPostName] as Model<CommentsType> :
    model<CommentsType>(modelPostName, commentSchema)