import { Router } from 'express'
import * as postController from '../controllers/postController'
import * as userController from '../controllers/authcontroller'
import { midleware } from '../midleware/jwt'

export const router = Router()

router.post('/auth/signup', userController.registerUser)
router.post('/auth/signin', userController.loginUser)

router.get('/post/:name', midleware, postController.getPostsUser)
router.post('/post', midleware, postController.newPost)
router.get('/category/posts', midleware, postController.getPostsCategory)
router.patch('/post', midleware, postController.updatePost)
router.delete('/post/:id', midleware, postController.deletePost)
router.get('/posts', midleware, postController.getPosts)
router.post('/post/like/:id', midleware, postController.toogleLikePost)
router.post('/post/comment/:id', midleware, postController.addComment)
router.delete('/post/comment/:id', midleware, postController.removeComment)