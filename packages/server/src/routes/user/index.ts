import express from 'express'
import userController from '../../controllers/user'

const router = express.Router()

// logout
router.get('/logout', userController.logout)

export default router
