import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'
import moment from 'moment'

// material-ui
import {
    Button,
    Box,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    useTheme
} from '@mui/material'

// project imports
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'

// API
import usersApi from '@/api/users'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'

// utils
import useNotifier from '@/utils/useNotifier'

// Icons
import { IconX, IconUser } from '@tabler/icons-react'
import UsersEmptySVG from '@/assets/images/users_empty.svg'
import { PiPlus, PiTrash, PiNotePencil } from 'react-icons/pi'

// const
import AddEditUserDialog from './AddEditUserDialog'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import ErrorBoundary from '@/ErrorBoundary'

// ==============================|| Credentials ||============================== //

const Users = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()
    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showUserDialog, setShowUserDialog] = useState(false)
    const [userDialogProps, setUserDialogProps] = useState({})
    const [users, setUsers] = useState([])
    const [showHowToDialog, setShowHowToDialog] = useState(false)

    const { confirm } = useConfirm()

    const getAllUsers = useApi(usersApi.getAllUsers)

    const [search, setSearch] = useState('')
    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }
    function filterUsers(data) {
        return data.username.toLowerCase().indexOf(search.toLowerCase()) > -1
    }

    const addNew = () => {
        const dialogProp = {
            type: 'ADD',
            cancelButtonName: '取消',
            confirmButtonName: '添加',
            customBtnId: 'btn_confirmAddingUser',
            data: {}
        }
        setUserDialogProps(dialogProp)
        setShowUserDialog(true)
    }

    const edit = (user) => {
        const dialogProp = {
            type: 'EDIT',
            cancelButtonName: '取消',
            confirmButtonName: '保存',
            data: user
        }
        setUserDialogProps(dialogProp)
        setShowUserDialog(true)
    }

    const deleteUser = async (user) => {
        const confirmPayload = {
            title: `Delete`,
            description: `Delete user ${user.username}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                const deleteResp = await usersApi.deleteUser(user.id)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'User deleted',
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
                    onConfirm()
                }
            } catch (error) {
                enqueueSnackbar({
                    message: `Failed to delete User: ${
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
            }
        }
    }

    const onConfirm = () => {
        setShowUserDialog(false)
        getAllUsers.request()
    }

    useEffect(() => {
        getAllUsers.request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllUsers.loading)
    }, [getAllUsers.loading])

    useEffect(() => {
        if (getAllUsers.error) {
            setError(getAllUsers.error)
        }
    }, [getAllUsers.error])

    useEffect(() => {
        if (getAllUsers.data) {
            setUsers(getAllUsers.data)
        }
    }, [getAllUsers.data])

    return (
        <>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 3 }}>
                    <ViewHeader onSearchChange={onSearchChange} search={true} searchPlaceholder='搜索...' title='用户'>
                        <Button color='primary' variant='contained' onClick={addNew} startIcon={<PiPlus size='0.8em' />}>
                            添加用户
                        </Button>
                    </ViewHeader>
                    {!isLoading && users.length === 0 ? (
                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                            <Box sx={{ p: 2, height: 'auto' }}>
                                <img
                                    style={{ objectFit: 'cover', height: '20vh', width: 'auto' }}
                                    src={UsersEmptySVG}
                                    alt='UsersEmptySVG'
                                />
                            </Box>
                            <div>No Users Yet</div>
                        </Stack>
                    ) : (
                        <TableContainer component={Paper} className='py-4'>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '200px' }}>用户名</TableCell>
                                        <TableCell>密码</TableCell>
                                        <TableCell style={{ width: '180px' }}>最后更新</TableCell>
                                        <TableCell style={{ width: '180px' }}>创建时间</TableCell>
                                        <TableCell style={{ width: '120px' }}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {isLoading ? (
                                        <>
                                            <TableRow>
                                                <TableCell>
                                                    <Skeleton variant='text' />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton variant='text' />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton variant='text' />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton variant='text' />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton variant='text' />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Skeleton variant='text' />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton variant='text' />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton variant='text' />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton variant='text' />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton variant='text' />
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ) : (
                                        <>
                                            {users.filter(filterUsers).map((user, index) => (
                                                <TableRow key={index} hover>
                                                    <TableCell scope='row'>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                alignItems: 'center'
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    width: 25,
                                                                    height: 25,
                                                                    marginRight: 10,
                                                                    borderRadius: '50%'
                                                                }}
                                                            >
                                                                <IconUser
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        borderRadius: '50%',
                                                                        objectFit: 'contain'
                                                                    }}
                                                                />
                                                            </div>
                                                            {user.username}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{user.password}</TableCell>
                                                    <TableCell>{moment(user.updatedDate).format('MMMM Do, YYYY')}</TableCell>
                                                    <TableCell>{moment(user.createdDate).format('MMMM Do, YYYY')}</TableCell>
                                                    <TableCell sx={{ textAlign: 'right' }}>
                                                        <IconButton title='Edit' color='primary' onClick={() => edit(user)}>
                                                            <PiNotePencil size='1.2rem' />
                                                        </IconButton>
                                                        <IconButton title='Delete' onClick={() => deleteUser(user)}>
                                                            <PiTrash size='1.2rem' />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Stack>
            )}
            <AddEditUserDialog
                show={showUserDialog}
                dialogProps={userDialogProps}
                onCancel={() => setShowUserDialog(false)}
                onConfirm={onConfirm}
                setError={setError}
            ></AddEditUserDialog>
            <ConfirmDialog />
        </>
    )
}

export default Users
