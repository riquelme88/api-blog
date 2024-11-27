import { Types } from "mongoose"
import comments, { CommentsType } from "../models/comments"
import post from "../models/post"
import user from "../models/user"

export const addComment = async (data: CommentsType) => {
    const comment = await comments.create({
        comment: data.comment,
        postId: data.postId,
        userId: data.userId,
        userName: data.userName
    })

    if (!comment) {
        throw new Error('Is Not possible comment')
    }

    await post.findByIdAndUpdate(
        data.postId,
        { $push: { comments: comment.id } },
        { new: true }
    )

    return comment
}

export const removeComment = async (id: String, userId: string) => {
    const hasComment = await comments.findOneAndDelete({ _id: id, userId })

    if (!hasComment) {
        throw new Error('Not found comment')
    }

    await post.findByIdAndUpdate(
        hasComment.postId,
        { $pull: { comments: hasComment.id } },
        { new: true }
    )

    return hasComment

}