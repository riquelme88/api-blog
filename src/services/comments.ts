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

export const updateComment = async (id: string, userId: string, commentText: string) => {
    const comment = await comments.findOne({
        _id: id, userId
    })

    if (!comment) {
        throw new Error('Not found comment')
    }

    const commentUpdate = await comments.findByIdAndUpdate(comment.id, { comment: commentText }, { new: true })
    if (!commentUpdate) {
        throw new Error('It´s not possible comment')
    }


    return commentUpdate
}