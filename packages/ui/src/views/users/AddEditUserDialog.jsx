import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'

// Material
import {
    Button,
    Dialog,
    FormControl,
    InputLabel,
    TextField,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Typography
} from '@mui/material'

// Project imports
import { StyledButton } from '@/ui-component/button/StyledButton'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'

// Icons
import { IconX, IconUser } from '@tabler/icons-react'

// API
import usersApi from '@/api/users'

// Hooks

// utils
import useNotifier from '@/utils/useNotifier'

// const
import { HIDE_CANVAS_DIALOG, SHOW_CANVAS_DIALOG } from '@/store/actions'

const AddEditUserDialog = ({ show, dialogProps, onCancel, onConfirm, setError }) => {
    const portalElement = document.getElementById('portal')

    const dispatch = useDispatch()

    // ==============================|| Snackbar ||============================== //

    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [dialogType, setDialogType] = useState('ADD')
    const [user, setUser] = useState({})

    useEffect(() => {
        if (dialogProps.type === 'EDIT' && dialogProps.data) {
            setUserName(dialogProps.data.name)
            setUserPassword(dialogProps.data.value)
            setDialogType('EDIT')
            setUser(dialogProps.data)
        } else if (dialogProps.type === 'ADD') {
            setUserName('')
            setUserPassword('')
            setDialogType('ADD')
            setUser({})
        }

        return () => {
            setUserName('')
            setUserPassword('')
            setDialogType('ADD')
            setUser({})
        }
    }, [dialogProps])

    useEffect(() => {
        if (show) dispatch({ type: SHOW_CANVAS_DIALOG })
        else dispatch({ type: HIDE_CANVAS_DIALOG })
        return () => dispatch({ type: HIDE_CANVAS_DIALOG })
    }, [show, dispatch])

    const addNewUser = async () => {
        try {
            const obj = {
                name: userName,
                password: userPassword
            }
            const createResp = await usersApi.createUser(obj)
            if (createResp.data) {
                enqueueSnackbar({
                    message: 'New User added',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        action: (key) => (
                            <Button style={{ color: 'white', minWidth: 'fit-content' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                onConfirm(createResp.data.id)
            }
        } catch (err) {
            if (setError) setError(err)
            enqueueSnackbar({
                message: `Failed to add new User: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    action: (key) => (
                        <Button style={{ color: 'white', minWidth: 'fit-content' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            onCancel()
        }
    }

    const saveUser = async () => {
        try {
            const saveObj = {
                username: userName,
                password: userPassword
            }

            const saveResp = await usersApi.updateUser(user.id, saveObj)
            if (saveResp.data) {
                enqueueSnackbar({
                    message: 'User saved',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        action: (key) => (
                            <Button style={{ color: 'white', minWidth: 'fit-content' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                onConfirm(saveResp.data.id)
            }
        } catch (error) {
            if (setError) setError(err)
            enqueueSnackbar({
                message: `Failed to save User: ${
                    typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                }`,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    action: (key) => (
                        <Button style={{ color: 'white', minWidth: 'fit-content' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
            onCancel()
        }
    }

    const component = show ? (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={show}
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                <div style={{ display: 'flex', alignItems: 'center' }}>{dialogProps.type === 'ADD' ? '添加用户' : '编辑用户'}</div>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    <TextField
                        required
                        fullWidth
                        label='用户名'
                        defaultPassword=''
                        key='username'
                        onChange={(e) => setUserName(e.target.value)}
                        value={userName ?? ''}
                    />
                </Box>
                <Box sx={{ p: 2 }}>
                    <TextField
                        required
                        fullWidth
                        label='密码'
                        defaultPassword=''
                        key='password'
                        onChange={(e) => setUserPassword(e.target.value)}
                        value={password ?? ''}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <StyledButton
                    disabled={!userName || !userPassword}
                    variant='text'
                    onClick={() => (dialogType === 'ADD' ? addNewUser() : saveUser())}
                    id='btn_confirmAddingNewUser'
                >
                    {dialogProps.confirmButtonName}
                </StyledButton>
            </DialogActions>
            <ConfirmDialog />
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

AddEditUserDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    setError: PropTypes.func
}

export default AddEditUserDialog
