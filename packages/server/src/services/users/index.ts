import { StatusCodes } from 'http-status-codes'
import { getRunningExpressApp } from '../../utils/getRunningExpressApp'
import { User } from '../../database/entities/User'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { getErrorMessage } from '../../errors/utils'

const createUser = async (newUser: User) => {
    try {
        const appServer = getRunningExpressApp()
        const user = await appServer.AppDataSource.getRepository(User).create(newUser)
        const dbResponse = await appServer.AppDataSource.getRepository(User).save(user)
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: usersServices.createUser - ${getErrorMessage(error)}`)
    }
}

const deleteUser = async (userId: string): Promise<any> => {
    try {
        const appServer = getRunningExpressApp()
        const dbResponse = await appServer.AppDataSource.getRepository(User).delete({ id: userId })
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: usersServices.deleteUser - ${getErrorMessage(error)}`)
    }
}

const getAllUsers = async () => {
    try {
        const appServer = getRunningExpressApp()
        const dbResponse = await appServer.AppDataSource.getRepository(User).find()
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: usersServices.getAllUsers - ${getErrorMessage(error)}`)
    }
}

const getUserById = async (userId: string) => {
    try {
        const appServer = getRunningExpressApp()
        const dbResponse = await appServer.AppDataSource.getRepository(User).findOneBy({
            id: userId
        })
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: usersServices.getUserById - ${getErrorMessage(error)}`)
    }
}

const updateUser = async (user: User, updatedUser: User) => {
    try {
        const appServer = getRunningExpressApp()
        const tmpUpdatedUser = await appServer.AppDataSource.getRepository(User).merge(user, updatedUser)
        const dbResponse = await appServer.AppDataSource.getRepository(User).save(tmpUpdatedUser)
        return dbResponse
    } catch (error) {
        throw new InternalFlowiseError(StatusCodes.INTERNAL_SERVER_ERROR, `Error: usersServices.updateUser - ${getErrorMessage(error)}`)
    }
}

export default {
    createUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser
}
