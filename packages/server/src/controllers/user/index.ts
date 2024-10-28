import { Request, Response, NextFunction } from 'express'
import toolsService from '../../services/tools'
import { InternalFlowiseError } from '../../errors/internalFlowiseError'
import { StatusCodes } from 'http-status-codes'

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('authjs.session-token')
        res.redirect('/account/login')
    } catch (error) {
        next(error)
    }
}

export default {
    logout
}
