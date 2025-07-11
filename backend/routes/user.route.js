import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { singleUpload } from '../middlewares/mutler.js'
import {
    register,
    login,
    logout,
    updateProfile,
    getOtherUser,
} from '../controllers/user.controller.js'

const router = express.Router()

router.post('/register', singleUpload, register)
router.post('/login', login)
router.get('/logout', logout)
router.post(
    '/profile/update',
    isAuthenticated,
    singleUpload,
    updateProfile
)
router.get('/', isAuthenticated, getOtherUser)

export default router