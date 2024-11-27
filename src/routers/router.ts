import { Router } from 'express'
import * as postController from '../controllers/postController'
import * as userController from '../controllers/authcontroller'
import { midleware } from '../midleware/jwt'

export const router = Router()

// Authentication
router.post('/auth/signup', userController.registerUser)
router.post('/auth/signin', userController.loginUser)

//Posts
router.get('/posts', midleware, postController.getPosts)
router.get('/post/:name', midleware, postController.getPostsUser)
router.get('/category/posts', midleware, postController.getPostsCategory)
router.post('/post', midleware, postController.newPost)
router.patch('/post/:id', midleware, postController.updatePost)
router.delete('/post/:id', midleware, postController.deletePost)

//Likes
router.post('/post/like/:id', midleware, postController.toogleLikePost)

//Comments
router.post('/post/comment/:id', midleware, postController.addComment)
router.delete('/post/comment/:id', midleware, postController.removeComment)
router.patch('/post/comment/:id', midleware, postController.updateComment)