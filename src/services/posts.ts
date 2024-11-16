import post from "../models/post"

export const getPosts = async (page: number) => {
    const posts = await post.find().select({ userId: 0 }).limit(4).skip(page * 4)

    if (!posts) {
        throw new Error('not found posts')
    }

    return posts
}