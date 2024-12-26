import express from 'express'
import userController from '../../controllers/users'

const router = express.Router()

// CREATE
router.post('/', userController.createUser)

// READ
router.get('/', userController.getAllUsers)

// UPDATE
router.put(['/', '/:id'], userController.updateUser)

// DELETE
router.delete(['/', '/:id'], userController.deleteUser)

export default router
