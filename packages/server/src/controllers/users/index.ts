import { Request, Response, NextFunction } from 'express'
import usersService from '../../services/users'
import { User } from '../../database/entities/User'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { StatusCodes } from 'http-status-codes'

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.body === 'undefined') {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, `Error: usersController.createUser - body not provided!`)
        }
        const body = req.body
        const newUser = new User()
        Object.assign(newUser, body)
        const apiResponse = await usersService.createUser(newUser)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.id) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, 'Error: usersController.deleteUser - id not provided!')
        }
        const apiResponse = await usersService.deleteUser(req.params.id)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiResponse = await usersService.getAllUsers()
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params === 'undefined' || !req.params.id) {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, 'Error: usersController.updateUser - id not provided!')
        }
        if (typeof req.body === 'undefined') {
            throw new InternalFlowiseError(StatusCodes.PRECONDITION_FAILED, 'Error: usersController.updateUser - body not provided!')
        }
        const variable = await usersService.getUserById(req.params.id)
        if (!variable) {
            return res.status(404).send(`User ${req.params.id} not found in the database`)
        }
        const body = req.body
        const updatedUser = new User()
        Object.assign(updatedUser, body)
        const apiResponse = await usersService.updateUser(variable, updatedUser)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    createUser,
    deleteUser,
    getAllUsers,
    updateUser
}
