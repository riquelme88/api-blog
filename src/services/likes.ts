import { Types } from "mongoose"
import likes from "../models/likes"
import post from "../models/post"
import user from "../models/user"

export const checkIfPostLikedByUser = async (userId: Types.ObjectId, postId: string) => {
    const liked = await likes.findOne({
        user: userId,
        postId
    })

    return liked ? true : false
}
export const likePost = async (userId: Types.ObjectId, postId: string, userName: string) => {
    const like = await likes.create({
        user: userId,
        postId,
        userName
    })

    if (!like) {
        throw new Error('Unable to like post')
    }
    await post.findByIdAndUpdate(
        postId,
        { $push: { likes: like.id } },
        { new: true }
    )

    //Adiciona o update ao user

    await user.findByIdAndUpdate(
        userId,
        { $push: { likes: like.id } },
        { new: true }
    )

    return like
}

export const unlikePost = async (userId: Types.ObjectId, postId: string) => {
    const hasLiked = await likes.findOneAndDelete({
        user: userId,
        postId
    })

    if (!hasLiked) {
        throw new Error('Like not found');
    }

    await post.findByIdAndUpdate(
        postId,
        { $pull: { likes: hasLiked.id } },
        { new: true }
    )

    await user.findByIdAndUpdate(
        userId,
        { $pull: { likes: hasLiked.id } },
        { new: true }
    )

    return hasLiked
}
