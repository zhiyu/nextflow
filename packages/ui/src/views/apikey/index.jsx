import * as PropTypes from 'prop-types'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction } from '@/store/actions'

// material-ui
import {
    Button,
    Box,
    Chip,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Popover,
    Collapse,
    Typography
} from '@mui/material'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { useTheme, styled } from '@mui/material/styles'

// project imports
import APIKeyDialog from './APIKeyDialog'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import ErrorBoundary from '@/ErrorBoundary'

// API
import apiKeyApi from '@/api/apikey'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'

// utils
import useNotifier from '@/utils/useNotifier'

// Icons
import APIEmptySVG from '@/assets/images/api_empty.svg'
import UploadJSONFileDialog from '@/views/apikey/UploadJSONFileDialog'
import {
    PiPlus,
    PiTrash,
    PiNotePencil,
    PiUpload,
    PiCopy,
    PiEyeClosed,
    PiEye,
    PiCaretDoubleDown,
    PiCaretDoubleUp,
    PiX
} from 'react-icons/pi'

// ==============================|| APIKey ||============================== //
function APIKeyRow(props) {
    const [open, setOpen] = useState(false)
    const theme = useTheme()

    return (
        <>
            <TableRow>
                <TableCell scope='row' style={{ width: '15%' }}>
                    {props.apiKey.keyName}
                </TableCell>
                <TableCell>
                    {props.showApiKeys.includes(props.apiKey.apiKey)
                        ? props.apiKey.apiKey
                        : `${props.apiKey.apiKey.substring(0, 2)}${'•'.repeat(18)}${props.apiKey.apiKey.substring(
                              props.apiKey.apiKey.length - 5
                          )}`}
                    <IconButton title='Copy' onClick={props.onCopyClick} className='ml-2'>
                        <PiCopy size={'1rem'} />
                    </IconButton>
                    <IconButton title='Show' color='inherit' onClick={props.onShowAPIClick}>
                        {props.showApiKeys.includes(props.apiKey.apiKey) ? <PiEye size={'1rem'} /> : <PiEyeClosed size={'1rem'} />}
                    </IconButton>
                    <Popover
                        open={props.open}
                        anchorEl={props.anchorEl}
                        onClose={props.onClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left'
                        }}
                    >
                        <Typography sx={{ p: 1, color: 'white', background: props.theme.palette.success.dark }}>已复制!</Typography>
                    </Popover>
                </TableCell>
                <TableCell>
                    {props.apiKey.chatFlows.length}{' '}
                    {props.apiKey.chatFlows.length > 0 && (
                        <IconButton aria-label='expand row' size='small' color='inherit' onClick={() => setOpen(!open)}>
                            {props.apiKey.chatFlows.length > 0 && open ? (
                                <PiCaretDoubleUp size={'1rem'} />
                            ) : (
                                <PiCaretDoubleDown size={'1rem'} />
                            )}
                        </IconButton>
                    )}
                </TableCell>
                <TableCell>{moment(props.apiKey.createdAt).format('MMMM Do, YYYY')}</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>
                    <IconButton title='Edit' color='primary' onClick={props.onEditClick}>
                        <PiNotePencil size='1.2rem' />
                    </IconButton>
                    <IconButton title='Delete' onClick={props.onDeleteClick}>
                        <PiTrash size='1.2rem' />
                    </IconButton>
                </TableCell>
            </TableRow>
            {open && (
                <TableRow>
                    <TableCell sx={{ p: 2 }} colSpan={6}>
                        <Collapse in={open} timeout='auto' unmountOnExit>
                            <Box>
                                <Table aria-label='chatflow table' size='small'>
                                    <TableHead sx={{ height: 48 }}>
                                        <TableRow>
                                            <TableCell sx={{ width: '30%' }}>Chatflow Name</TableCell>
                                            <TableCell sx={{ width: '20%' }}>Modified On</TableCell>
                                            <TableCell sx={{ width: '50%' }}>Category</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {props.apiKey.chatFlows.map((flow, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{flow.flowName}</TableCell>
                                                <TableCell>{moment(flow.updatedDate).format('MMMM Do, YYYY')}</TableCell>
                                                <TableCell>
                                                    &nbsp;
                                                    {flow.category &&
                                                        flow.category
                                                            .split(';')
                                                            .map((tag, index) => (
                                                                <Chip key={index} label={tag} style={{ marginRight: 5, marginBottom: 5 }} />
                                                            ))}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}

APIKeyRow.propTypes = {
    apiKey: PropTypes.any,
    showApiKeys: PropTypes.arrayOf(PropTypes.any),
    onCopyClick: PropTypes.func,
    onShowAPIClick: PropTypes.func,
    open: PropTypes.bool,
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    theme: PropTypes.any,
    onEditClick: PropTypes.func,
    onDeleteClick: PropTypes.func
}
const APIKey = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const dispatch = useDispatch()
    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogProps, setDialogProps] = useState({})
    const [apiKeys, setAPIKeys] = useState([])
    const [anchorEl, setAnchorEl] = useState(null)
    const [showApiKeys, setShowApiKeys] = useState([])
    const openPopOver = Boolean(anchorEl)

    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [uploadDialogProps, setUploadDialogProps] = useState({})

    const [search, setSearch] = useState('')
    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }
    function filterKeys(data) {
        return data.keyName.toLowerCase().indexOf(search.toLowerCase()) > -1
    }

    const { confirm } = useConfirm()

    const getAllAPIKeysApi = useApi(apiKeyApi.getAllAPIKeys)

    const onShowApiKeyClick = (apikey) => {
        const index = showApiKeys.indexOf(apikey)
        if (index > -1) {
            //showApiKeys.splice(index, 1)
            const newShowApiKeys = showApiKeys.filter(function (item) {
                return item !== apikey
            })
            setShowApiKeys(newShowApiKeys)
        } else {
            setShowApiKeys((prevkeys) => [...prevkeys, apikey])
        }
    }

    const handleClosePopOver = () => {
        setAnchorEl(null)
    }

    const addNew = () => {
        const dialogProp = {
            title: '添加 API Key',
            type: 'ADD',
            cancelButtonName: '取消',
            confirmButtonName: '添加',
            customBtnId: 'btn_confirmAddingApiKey'
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const edit = (key) => {
        const dialogProp = {
            title: '编辑 API Key',
            type: 'EDIT',
            cancelButtonName: '取消',
            confirmButtonName: '保存',
            customBtnId: 'btn_confirmEditingApiKey',
            key
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const uploadDialog = () => {
        const dialogProp = {
            type: 'ADD',
            cancelButtonName: '取消',
            confirmButtonName: '导入',
            data: {}
        }
        setUploadDialogProps(dialogProp)
        setShowUploadDialog(true)
    }

    const deleteKey = async (key) => {
        const confirmPayload = {
            title: `删除`,
            description:
                key.chatFlows.length === 0
                    ? `确定要删除 "${key.keyName}" ? `
                    : `有 ${key.chatFlows.length}个 chatflows 在使用"${key.keyName}"，确定要删除?`,
            confirmButtonName: '删除',
            cancelButtonName: '取消',
            customBtnId: 'btn_initiateDeleteApiKey'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                const deleteResp = await apiKeyApi.deleteAPI(key.id)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'API key deleted',
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                            anchorOrigin: { vertical: 'top', horizontal: 'center' },
                            action: (key) => (
                                <Button style={{ color: 'white', minWidth: 'fit-content' }} onClick={() => closeSnackbar(key)}>
                                    <PiX />
                                </Button>
                            )
                        }
                    })
                    onConfirm()
                }
            } catch (error) {
                enqueueSnackbar({
                    message: `Failed to delete API key: ${
                        typeof error.response.data === 'object' ? error.response.data.message : error.response.data
                    }`,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        action: (key) => (
                            <Button style={{ color: 'white', minWidth: 'fit-content' }} onClick={() => closeSnackbar(key)}>
                                <PiX />
                            </Button>
                        )
                    }
                })
                onCancel()
            }
        }
    }

    const onConfirm = () => {
        setShowDialog(false)
        setShowUploadDialog(false)
        getAllAPIKeysApi.request()
    }

    useEffect(() => {
        getAllAPIKeysApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllAPIKeysApi.loading)
    }, [getAllAPIKeysApi.loading])

    useEffect(() => {
        if (getAllAPIKeysApi.data) {
            setAPIKeys(getAllAPIKeysApi.data)
        }
    }, [getAllAPIKeysApi.data])

    useEffect(() => {
        if (getAllAPIKeysApi.error) {
            setError(getAllAPIKeysApi.error)
        }
    }, [getAllAPIKeysApi.error])

    return (
        <>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 3 }}>
                    <ViewHeader onSearchChange={onSearchChange} search={true} searchPlaceholder='搜索...' title='API Keys'>
                        <Button variant='contained' onClick={addNew} startIcon={<PiPlus size='0.8em' />}>
                            添加 Key
                        </Button>
                        <Button
                            color='secondary'
                            variant='contained'
                            onClick={uploadDialog}
                            startIcon={<PiUpload size='0.8em' />}
                            id='btn_importApiKeys'
                        >
                            导入
                        </Button>
                    </ViewHeader>
                    {!isLoading && apiKeys.length <= 0 ? (
                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                            <Box sx={{ p: 2, height: 'auto' }}>
                                <img style={{ objectFit: 'cover', height: '20vh', width: 'auto' }} src={APIEmptySVG} alt='APIEmptySVG' />
                            </Box>
                            <div>No API Keys Yet</div>
                        </Stack>
                    ) : (
                        <TableContainer component={Paper} className='py-4'>
                            <Table aria-label='simple table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Key 名称</TableCell>
                                        <TableCell>Key 值</TableCell>
                                        <TableCell style={{ width: '100px' }}>使用情况</TableCell>
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
                                            {apiKeys.filter(filterKeys).map((key, index) => (
                                                <APIKeyRow
                                                    key={index}
                                                    apiKey={key}
                                                    showApiKeys={showApiKeys}
                                                    onCopyClick={(event) => {
                                                        navigator.clipboard.writeText(key.apiKey)
                                                        setAnchorEl(event.currentTarget)
                                                        setTimeout(() => {
                                                            handleClosePopOver()
                                                        }, 1500)
                                                    }}
                                                    onShowAPIClick={() => onShowApiKeyClick(key.apiKey)}
                                                    open={openPopOver}
                                                    anchorEl={anchorEl}
                                                    onClose={handleClosePopOver}
                                                    theme={theme}
                                                    onEditClick={() => edit(key)}
                                                    onDeleteClick={() => deleteKey(key)}
                                                />
                                            ))}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Stack>
            )}
            <APIKeyDialog
                show={showDialog}
                dialogProps={dialogProps}
                onCancel={() => setShowDialog(false)}
                onConfirm={onConfirm}
                setError={setError}
            ></APIKeyDialog>
            {showUploadDialog && (
                <UploadJSONFileDialog
                    show={showUploadDialog}
                    dialogProps={uploadDialogProps}
                    onCancel={() => setShowUploadDialog(false)}
                    onConfirm={onConfirm}
                ></UploadJSONFileDialog>
            )}
            <ConfirmDialog />
        </>
    )
}

export default APIKey
