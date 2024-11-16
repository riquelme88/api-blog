import { Router } from 'express'
import * as postController from '../controllers/postController'
import * as userController from '../controllers/authcontroller'
import { midleware } from '../midleware/jwt'

export const router = Router()

router.post('/auth/signup', userController.registerUser)
router.post('/auth/signin', userController.loginUser)

router.get('/posts', midleware, postController.getPosts)