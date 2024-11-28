import comments, { CommentsType } from "../models/comments"
import post from "../models/post"

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
    const query = { _id: id, userId }

    const comment = await comments.findOneAndUpdate(query, { comment: commentText }, { new: true })

    if (!comment) {
        throw new Error('Not found comment')
    }
    return comment
}