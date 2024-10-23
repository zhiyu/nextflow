import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

// material-ui
import {
    Box,
    Stack,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Menu,
    MenuItem,
    Divider,
    Button,
    Skeleton
} from '@mui/material'
import { alpha, styled, useTheme } from '@mui/material/styles'

import AddDocStoreDialog from '@/views/docstore/AddDocStoreDialog'
import { BackdropLoader } from '@/ui-component/loading/BackdropLoader'
import DocumentLoaderListDialog from '@/views/docstore/DocumentLoaderListDialog'
import ErrorBoundary from '@/ErrorBoundary'
import { StyledButton } from '@/ui-component/button/StyledButton'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import DeleteDocStoreDialog from './DeleteDocStoreDialog'

// API
import documentsApi from '@/api/documentstore'

// Hooks
import useApi from '@/hooks/useApi'
import useNotifier from '@/utils/useNotifier'

// icons
import { IconPlus, IconRefresh, IconX, IconVectorBezier2, IconZoomScan } from '@tabler/icons-react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import doc_store_details_emptySVG from '@/assets/images/doc_store_details_empty.svg'

// store
import { closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction } from '@/store/actions'
import { PiPlus, PiTrash, PiFilesLight, PiRowsPlusTopLight, PiEyeLight } from 'react-icons/pi'

// ==============================|| DOCUMENTS ||============================== //

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0'
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5)
            },
            '&:active': {
                backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
            }
        }
    }
}))

const DocumentStoreDetails = () => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const getSpecificDocumentStore = useApi(documentsApi.getSpecificDocumentStore)

    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [isBackdropLoading, setBackdropLoading] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [documentStore, setDocumentStore] = useState({})
    const [dialogProps, setDialogProps] = useState({})
    const [showDocumentLoaderListDialog, setShowDocumentLoaderListDialog] = useState(false)
    const [documentLoaderListDialogProps, setDocumentLoaderListDialogProps] = useState({})
    const [showDeleteDocStoreDialog, setShowDeleteDocStoreDialog] = useState(false)
    const [deleteDocStoreDialogProps, setDeleteDocStoreDialogProps] = useState({})

    const URLpath = document.location.pathname.toString().split('/')
    const storeId = URLpath[URLpath.length - 1] === 'document-stores' ? '' : URLpath[URLpath.length - 1]

    const openPreviewSettings = (id) => {
        navigate('/document-stores/' + storeId + '/' + id)
    }

    const showStoredChunks = (id) => {
        navigate('/document-stores/chunks/' + storeId + '/' + id)
    }

    const showVectorStoreQuery = (id) => {
        navigate('/document-stores/query/' + id)
    }

    const onDocLoaderSelected = (docLoaderComponentName) => {
        setShowDocumentLoaderListDialog(false)
        navigate('/document-stores/' + storeId + '/' + docLoaderComponentName)
    }

    const showVectorStore = (id) => {
        navigate('/document-stores/vector/' + id)
    }

    const listLoaders = () => {
        const dialogProp = {
            title: '请选择文档加载器'
        }
        setDocumentLoaderListDialogProps(dialogProp)
        setShowDocumentLoaderListDialog(true)
    }

    const deleteVectorStoreDataFromStore = async (storeId) => {
        try {
            await documentsApi.deleteVectorStoreDataFromStore(storeId)
        } catch (error) {
            console.error(error)
        }
    }

    const onDocStoreDelete = async (type, file, removeFromVectorStore) => {
        setBackdropLoading(true)
        setShowDeleteDocStoreDialog(false)
        if (type === 'STORE') {
            if (removeFromVectorStore) {
                await deleteVectorStoreDataFromStore(storeId)
            }
            try {
                const deleteResp = await documentsApi.deleteDocumentStore(storeId)
                setBackdropLoading(false)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'Store, Loader and associated document chunks deleted',
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                            action: (key) => (
                                <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                    <IconX />
                                </Button>
                            )
                        }
                    })
                    navigate('/document-stores/')
                }
            } catch (error) {
                setBackdropLoading(false)
                setError(error)
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar({
                    message: `Failed to delete loader: ${errorData}`,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            }
        } else if (type === 'LOADER') {
            try {
                const deleteResp = await documentsApi.deleteLoaderFromStore(storeId, file.id)
                setBackdropLoading(false)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'Loader and associated document chunks deleted',
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: 'success',
                            action: (key) => (
                                <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                    <IconX />
                                </Button>
                            )
                        }
                    })
                    onConfirm()
                }
            } catch (error) {
                setError(error)
                setBackdropLoading(false)
                const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
                enqueueSnackbar({
                    message: `Failed to delete loader: ${errorData}`,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        action: (key) => (
                            <Button style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            }
        }
    }

    const onLoaderDelete = (file, vectorStoreConfig, recordManagerConfig) => {
        const props = {
            title: `Delete`,
            description: `Delete Loader ${file.loaderName} ? This will delete all the associated document chunks.`,
            vectorStoreConfig,
            recordManagerConfig,
            type: 'LOADER',
            file
        }

        setDeleteDocStoreDialogProps(props)
        setShowDeleteDocStoreDialog(true)
    }

    const onStoreDelete = (vectorStoreConfig, recordManagerConfig) => {
        const props = {
            title: `删除`,
            description: `Delete Store ${getSpecificDocumentStore.data?.name} ? This will delete all the associated loaders and document chunks.`,
            vectorStoreConfig,
            recordManagerConfig,
            type: 'STORE'
        }

        setDeleteDocStoreDialogProps(props)
        setShowDeleteDocStoreDialog(true)
    }

    const onEditClicked = () => {
        const data = {
            name: documentStore.name,
            description: documentStore.description,
            id: documentStore.id
        }
        const dialogProp = {
            title: '编辑知识库',
            type: 'EDIT',
            cancelButtonName: '取消',
            confirmButtonName: '更新',
            data: data
        }
        setDialogProps(dialogProp)
        setShowDialog(true)
    }

    const onConfirm = () => {
        setShowDialog(false)
        getSpecificDocumentStore.request(storeId)
    }

    useEffect(() => {
        getSpecificDocumentStore.request(storeId)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (getSpecificDocumentStore.data) {
            setDocumentStore(getSpecificDocumentStore.data)
            // total the chunks and chars
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificDocumentStore.data])

    useEffect(() => {
        if (getSpecificDocumentStore.error) {
            setError(getSpecificDocumentStore.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificDocumentStore.error])

    useEffect(() => {
        setLoading(getSpecificDocumentStore.loading)
    }, [getSpecificDocumentStore.loading])

    return (
        <>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 3 }}>
                    <ViewHeader
                        isBackButton={true}
                        isEditButton={true}
                        search={false}
                        title={documentStore?.name}
                        description={documentStore?.description}
                        onBack={() => navigate('/document-stores')}
                        onEdit={() => onEditClicked()}
                    >
                        <Button
                            variant='contained'
                            color='error'
                            startIcon={<PiTrash size='0.8em' />}
                            onClick={() => onStoreDelete(documentStore.vectorStoreConfig, documentStore.recordManagerConfig)}
                        >
                            删除知识库
                        </Button>
                        <Button variant='contained' color='primary' startIcon={<PiPlus size='0.8em' />} onClick={listLoaders}>
                            添加文档加载器
                        </Button>
                        {(documentStore?.status === 'STALE' || documentStore?.status === 'UPSERTING') && (
                            <Button variant='text' sx={{ mr: 2 }} startIcon={<IconRefresh />} onClick={onConfirm}>
                                刷新
                            </Button>
                        )}
                        {documentStore?.status === 'UPSERTING' && (
                            <Chip
                                variant='raised'
                                label='Upserting to Vector Store'
                                color='warning'
                                sx={{ borderRadius: 2, height: '100%' }}
                            />
                        )}
                        {documentStore?.totalChunks > 0 && documentStore?.status !== 'UPSERTING' && (
                            <>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    startIcon={<PiFilesLight size='0.8em' />}
                                    onClick={() => showStoredChunks('all')}
                                >
                                    查看 Chunks
                                </Button>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    startIcon={<PiRowsPlusTopLight size='0.8em' />}
                                    onClick={() => showVectorStore(documentStore.id)}
                                >
                                    插入或更新配置
                                </Button>
                            </>
                        )}
                        {documentStore?.totalChunks > 0 && documentStore?.status === 'UPSERTED' && (
                            <Button
                                variant='contained'
                                sx={{
                                    backgroundImage: `linear-gradient(to right, #3f5efb, #fc466b)`,
                                    '&:hover': {
                                        backgroundImage: `linear-gradient(to right, #2b4efb, #fe2752)`
                                    }
                                }}
                                startIcon={<IconZoomScan />}
                                onClick={() => showVectorStoreQuery(documentStore.id)}
                            >
                                Retrieval Query
                            </Button>
                        )}
                    </ViewHeader>
                    {getSpecificDocumentStore.data?.whereUsed?.length > 0 && (
                        <Stack flexDirection='row' sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                            <div
                                style={{
                                    paddingLeft: '15px',
                                    paddingRight: '15px',
                                    paddingTop: '10px',
                                    paddingBottom: '10px',
                                    fontSize: '0.9rem',
                                    width: 'max-content',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <IconVectorBezier2 style={{ marginRight: 5 }} size={17} />
                                Chatflows Used:
                            </div>
                            {getSpecificDocumentStore.data.whereUsed.map((chatflowUsed, index) => (
                                <Chip
                                    key={index}
                                    clickable
                                    style={{
                                        width: 'max-content',
                                        borderRadius: '25px',
                                        boxShadow: customization.isDarkMode
                                            ? '0 2px 14px 0 rgb(255 255 255 / 10%)'
                                            : '0 2px 14px 0 rgb(32 40 45 / 10%)'
                                    }}
                                    label={chatflowUsed.name}
                                    onClick={() => navigate('/canvas/' + chatflowUsed.id)}
                                ></Chip>
                            ))}
                        </Stack>
                    )}
                    {!isLoading && documentStore && !documentStore?.loaders?.length ? (
                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                            <Box sx={{ p: 2, height: 'auto' }}>
                                <img
                                    style={{ objectFit: 'cover', height: '16vh', width: 'auto' }}
                                    src={doc_store_details_emptySVG}
                                    alt='doc_store_details_emptySVG'
                                />
                            </Box>
                            <div>No Document Added Yet</div>
                            <StyledButton variant='contained' startIcon={<IconPlus />} onClick={listLoaders}>
                                添加文档加载器
                            </StyledButton>
                        </Stack>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>&nbsp;</TableCell>
                                        <TableCell>加载器</TableCell>
                                        <TableCell>Splitter</TableCell>
                                        <TableCell>数据源</TableCell>
                                        <TableCell>Chunks</TableCell>
                                        <TableCell>Chars</TableCell>
                                        <TableCell style={{ width: '120px' }}>操作</TableCell>
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
                                                <TableCell>
                                                    <Skeleton variant='text' />
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ) : (
                                        <>
                                            {documentStore?.loaders &&
                                                documentStore?.loaders.length > 0 &&
                                                documentStore?.loaders.map((loader, index) => (
                                                    <LoaderRow
                                                        key={index}
                                                        index={index}
                                                        loader={loader}
                                                        theme={theme}
                                                        onEditClick={() => openPreviewSettings(loader.id)}
                                                        onViewChunksClick={() => showStoredChunks(loader.id)}
                                                        onDeleteClick={() =>
                                                            onLoaderDelete(
                                                                loader,
                                                                documentStore?.vectorStoreConfig,
                                                                documentStore?.recordManagerConfig
                                                            )
                                                        }
                                                    />
                                                ))}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    {getSpecificDocumentStore.data?.status === 'STALE' && (
                        <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                            <Typography color='warning' style={{ color: 'darkred', fontWeight: 500, fontStyle: 'italic', fontSize: 12 }}>
                                Some files are pending processing. Please Refresh to get the latest status.
                            </Typography>
                        </div>
                    )}
                </Stack>
            )}
            {showDialog && (
                <AddDocStoreDialog
                    dialogProps={dialogProps}
                    show={showDialog}
                    onCancel={() => setShowDialog(false)}
                    onConfirm={onConfirm}
                />
            )}
            {showDocumentLoaderListDialog && (
                <DocumentLoaderListDialog
                    show={showDocumentLoaderListDialog}
                    dialogProps={documentLoaderListDialogProps}
                    onCancel={() => setShowDocumentLoaderListDialog(false)}
                    onDocLoaderSelected={onDocLoaderSelected}
                />
            )}
            {showDeleteDocStoreDialog && (
                <DeleteDocStoreDialog
                    show={showDeleteDocStoreDialog}
                    dialogProps={deleteDocStoreDialogProps}
                    onCancel={() => setShowDeleteDocStoreDialog(false)}
                    onDelete={onDocStoreDelete}
                />
            )}
            {isBackdropLoading && <BackdropLoader open={isBackdropLoading} />}
        </>
    )
}

function LoaderRow(props) {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const formatSources = (source) => {
        if (source && typeof source === 'string' && source.startsWith('[') && source.endsWith(']')) {
            return JSON.parse(source).join(', ')
        }
        return source
    }

    return (
        <>
            <TableRow hover key={props.index}>
                <TableCell onClick={props.onViewChunksClick} scope='row' style={{ width: '5%' }}>
                    <div
                        style={{
                            display: 'flex',
                            width: '10px',
                            height: '10px',
                            backgroundColor: props.loader?.status === 'SYNC' ? '#00e676' : '#ffe57f',
                            borderRadius: '50%'
                        }}
                    ></div>
                </TableCell>
                <TableCell onClick={props.onViewChunksClick} scope='row'>
                    {props.loader.loaderName}
                </TableCell>
                <TableCell onClick={props.onViewChunksClick}>{props.loader.splitterName ?? 'None'}</TableCell>
                <TableCell onClick={props.onViewChunksClick}>{formatSources(props.loader.source)}</TableCell>
                <TableCell onClick={props.onViewChunksClick}>
                    {props.loader.totalChunks && <Chip variant='outlined' size='small' label={props.loader.totalChunks.toLocaleString()} />}
                </TableCell>
                <TableCell onClick={props.onViewChunksClick}>
                    {props.loader.totalChars && <Chip variant='outlined' size='small' label={props.loader.totalChars.toLocaleString()} />}
                </TableCell>
                <TableCell>
                    <div>
                        <Button
                            id='document-store-action-button'
                            aria-controls={open ? 'document-store-action-customized-menu' : undefined}
                            aria-haspopup='true'
                            aria-expanded={open ? 'true' : undefined}
                            disableElevation
                            onClick={(e) => handleClick(e)}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            请选择
                        </Button>
                        <StyledMenu
                            id='document-store-actions-customized-menu'
                            MenuListProps={{
                                'aria-labelledby': 'document-store-actions-customized-button'
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={props.onEditClick} disableRipple>
                                <PiEyeLight />
                                &nbsp;预览 & 处理
                            </MenuItem>
                            <MenuItem onClick={props.onViewChunksClick} disableRipple>
                                <PiFilesLight />
                                &nbsp;查看 & 编辑 Chunks
                            </MenuItem>
                            <Divider sx={{ my: 0.5 }} />
                            <MenuItem onClick={props.onDeleteClick} disableRipple>
                                <PiTrash />
                                &nbsp;删除
                            </MenuItem>
                        </StyledMenu>
                    </div>
                </TableCell>
            </TableRow>
        </>
    )
}

LoaderRow.propTypes = {
    loader: PropTypes.any,
    index: PropTypes.number,
    open: PropTypes.bool,
    theme: PropTypes.any,
    onViewChunksClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onDeleteClick: PropTypes.func
}
export default DocumentStoreDetails
