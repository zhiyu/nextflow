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
import variablesApi from '@/api/variables'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'

// utils
import useNotifier from '@/utils/useNotifier'

// Icons
import { IconX, IconVariable } from '@tabler/icons-react'
import VariablesEmptySVG from '@/assets/images/variables_empty.svg'
import { PiPlus, PiTrash, PiNotePencil } from 'react-icons/pi'

// const
import AddEditVariableDialog from './AddEditVariableDialog'
import HowToUseVariablesDialog from './HowToUseVariablesDialog'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import ErrorBoundary from '@/ErrorBoundary'

// ==============================|| Credentials ||============================== //

const Variables = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()
    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showVariableDialog, setShowVariableDialog] = useState(false)
    const [variableDialogProps, setVariableDialogProps] = useState({})
    const [variables, setVariables] = useState([])
    const [showHowToDialog, setShowHowToDialog] = useState(false)

    const { confirm } = useConfirm()

    const getAllVariables = useApi(variablesApi.getAllVariables)

    const [search, setSearch] = useState('')
    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }
    function filterVariables(data) {
        return data.name.toLowerCase().indexOf(search.toLowerCase()) > -1
    }

    const addNew = () => {
        const dialogProp = {
            type: 'ADD',
            cancelButtonName: '取消',
            confirmButtonName: '添加',
            customBtnId: 'btn_confirmAddingVariable',
            data: {}
        }
        setVariableDialogProps(dialogProp)
        setShowVariableDialog(true)
    }

    const edit = (variable) => {
        const dialogProp = {
            type: 'EDIT',
            cancelButtonName: '取消',
            confirmButtonName: '保存',
            data: variable
        }
        setVariableDialogProps(dialogProp)
        setShowVariableDialog(true)
    }

    const deleteVariable = async (variable) => {
        const confirmPayload = {
            title: `Delete`,
            description: `Delete variable ${variable.name}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                const deleteResp = await variablesApi.deleteVariable(variable.id)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'Variable deleted',
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
                    message: `Failed to delete Variable: ${
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
        setShowVariableDialog(false)
        getAllVariables.request()
    }

    useEffect(() => {
        getAllVariables.request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllVariables.loading)
    }, [getAllVariables.loading])

    useEffect(() => {
        if (getAllVariables.error) {
            setError(getAllVariables.error)
        }
    }, [getAllVariables.error])

    useEffect(() => {
        if (getAllVariables.data) {
            setVariables(getAllVariables.data)
        }
    }, [getAllVariables.data])

    return (
        <>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 3 }}>
                    <ViewHeader onSearchChange={onSearchChange} search={true} searchPlaceholder='搜索...' title='全局变量'>
                        <Button color='primary' variant='contained' onClick={addNew} startIcon={<PiPlus size='0.8em' />}>
                            添加变量
                        </Button>
                        <Button color='secondary' variant='text' onClick={() => setShowHowToDialog(true)}>
                            如何使用变量
                        </Button>
                    </ViewHeader>
                    {!isLoading && variables.length === 0 ? (
                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                            <Box sx={{ p: 2, height: 'auto' }}>
                                <img
                                    style={{ objectFit: 'cover', height: '20vh', width: 'auto' }}
                                    src={VariablesEmptySVG}
                                    alt='VariablesEmptySVG'
                                />
                            </Box>
                            <div>No Variables Yet</div>
                        </Stack>
                    ) : (
                        <TableContainer component={Paper} className='py-4'>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: '200px' }}>变量名称</TableCell>
                                        <TableCell>变量值</TableCell>
                                        <TableCell style={{ width: '100px' }}>类型</TableCell>
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
                                                <TableCell>
                                                    <Skeleton variant='text' />
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ) : (
                                        <>
                                            {variables.filter(filterVariables).map((variable, index) => (
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
                                                                <IconVariable
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        borderRadius: '50%',
                                                                        objectFit: 'contain'
                                                                    }}
                                                                />
                                                            </div>
                                                            {variable.name}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{variable.value}</TableCell>
                                                    <TableCell>{variable.type}</TableCell>
                                                    <TableCell>{moment(variable.updatedDate).format('MMMM Do, YYYY')}</TableCell>
                                                    <TableCell>{moment(variable.createdDate).format('MMMM Do, YYYY')}</TableCell>
                                                    <TableCell sx={{ textAlign: 'right' }}>
                                                        <IconButton title='Edit' color='primary' onClick={() => edit(variable)}>
                                                            <PiNotePencil size='1.2rem' />
                                                        </IconButton>
                                                        <IconButton title='Delete' onClick={() => deleteVariable(variable)}>
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
            <AddEditVariableDialog
                show={showVariableDialog}
                dialogProps={variableDialogProps}
                onCancel={() => setShowVariableDialog(false)}
                onConfirm={onConfirm}
                setError={setError}
            ></AddEditVariableDialog>
            <HowToUseVariablesDialog show={showHowToDialog} onCancel={() => setShowHowToDialog(false)}></HowToUseVariablesDialog>
            <ConfirmDialog />
        </>
    )
}

export default Variables
