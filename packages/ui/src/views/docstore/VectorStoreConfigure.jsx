import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { cloneDeep } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment/moment'

// material-ui
import { Button, Stack, Grid, Box, Typography, IconButton, Stepper, Step, StepLabel } from '@mui/material'

// project imports
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import ComponentsListDialog from '@/views/docstore/ComponentsListDialog'
import DocStoreInputHandler from '@/views/docstore/DocStoreInputHandler'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import { BackdropLoader } from '@/ui-component/loading/BackdropLoader'
import ErrorBoundary from '@/ErrorBoundary'
import UpsertResultDialog from '@/views/vectorstore/UpsertResultDialog'
import UpsertHistorySideDrawer from './UpsertHistorySideDrawer'
import UpsertHistoryDetailsDialog from './UpsertHistoryDetailsDialog'

// API
import documentsApi from '@/api/documentstore'
import nodesApi from '@/api/nodes'

// Hooks
import useApi from '@/hooks/useApi'

// Store
import { closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction } from '@/store/actions'
import { baseURL } from '@/store/constant'

// icons
import { IconX, IconEditCircle } from '@tabler/icons-react'
import Embeddings from '@mui/icons-material/DynamicFeed'
import Storage from '@mui/icons-material/Storage'
import DynamicFeed from '@mui/icons-material/Filter1'

import { PiArrowCounterClockwiseLight, PiFloppyDiskBackLight, PiRowsPlusTopLight, PiClockCountdownLight } from 'react-icons/pi'

// utils
import { initNode } from '@/utils/genericHelper'
import useNotifier from '@/utils/useNotifier'

import { styled } from '@mui/material/styles'
import MainCard from '@/ui-component/cards/MainCard'

const CardWrapper = styled(MainCard)(({ theme }) => ({
    background: theme.palette.card.main,
    color: theme.darkTextPrimary,
    overflow: 'auto',
    position: 'relative',
    border: 'none !important',
    cursor: 'pointer',
    width: '100%',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-line'
}))

const VectorStoreConfigure = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useNotifier()
    const customization = useSelector((state) => state.customization)

    const { storeId, docId } = useParams()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const getSpecificDocumentStoreApi = useApi(documentsApi.getSpecificDocumentStore)
    const insertIntoVectorStoreApi = useApi(documentsApi.insertIntoVectorStore)
    const saveVectorStoreConfigApi = useApi(documentsApi.saveVectorStoreConfig)
    const getEmbeddingNodeDetailsApi = useApi(nodesApi.getSpecificNode)
    const getVectorStoreNodeDetailsApi = useApi(nodesApi.getSpecificNode)
    const getRecordManagerNodeDetailsApi = useApi(nodesApi.getSpecificNode)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const [documentStore, setDocumentStore] = useState({})
    const [dialogProps, setDialogProps] = useState({})

    const [showEmbeddingsListDialog, setShowEmbeddingsListDialog] = useState(false)
    const [selectedEmbeddingsProvider, setSelectedEmbeddingsProvider] = useState({})

    const [showVectorStoreListDialog, setShowVectorStoreListDialog] = useState(false)
    const [selectedVectorStoreProvider, setSelectedVectorStoreProvider] = useState({})

    const [showRecordManagerListDialog, setShowRecordManagerListDialog] = useState(false)
    const [selectedRecordManagerProvider, setSelectedRecordManagerProvider] = useState({})
    const [isRecordManagerUnavailable, setRecordManagerUnavailable] = useState(false)

    const [showUpsertHistoryDialog, setShowUpsertHistoryDialog] = useState(false)
    const [upsertResultDialogProps, setUpsertResultDialogProps] = useState({})

    const [showUpsertHistorySideDrawer, setShowUpsertHistorySideDrawer] = useState(false)
    const [upsertHistoryDrawerDialogProps, setUpsertHistoryDrawerDialogProps] = useState({})

    const [showUpsertHistoryDetailsDialog, setShowUpsertHistoryDetailsDialog] = useState(false)
    const [upsertDetailsDialogProps, setUpsertDetailsDialogProps] = useState({})

    const onEmbeddingsSelected = (component) => {
        const nodeData = cloneDeep(initNode(component, uuidv4()))
        if (!showEmbeddingsListDialog && documentStore.embeddingConfig) {
            nodeData.inputs = documentStore.embeddingConfig.config
            nodeData.credential = documentStore.embeddingConfig.config.credential
        }
        setSelectedEmbeddingsProvider(nodeData)
        setShowEmbeddingsListDialog(false)
    }

    const showEmbeddingsList = () => {
        const dialogProp = {
            title: '选择 Embeddings 服务'
        }
        setDialogProps(dialogProp)
        setShowEmbeddingsListDialog(true)
    }

    const onVectorStoreSelected = (component) => {
        const nodeData = cloneDeep(initNode(component, uuidv4()))
        if (!nodeData.inputAnchors.find((anchor) => anchor.name === 'recordManager')) {
            setRecordManagerUnavailable(true)
            setSelectedRecordManagerProvider({})
        } else {
            setRecordManagerUnavailable(false)
        }
        if (!showVectorStoreListDialog && documentStore.vectorStoreConfig) {
            nodeData.inputs = documentStore.vectorStoreConfig.config
            nodeData.credential = documentStore.vectorStoreConfig.config.credential
        }
        setSelectedVectorStoreProvider(nodeData)
        setShowVectorStoreListDialog(false)
    }

    const showVectorStoreList = () => {
        const dialogProp = {
            title: '选择向量存储服务'
        }
        setDialogProps(dialogProp)
        setShowVectorStoreListDialog(true)
    }

    const onRecordManagerSelected = (component) => {
        const nodeData = cloneDeep(initNode(component, uuidv4()))
        if (!showRecordManagerListDialog && documentStore.recordManagerConfig) {
            nodeData.inputs = documentStore.recordManagerConfig.config
            nodeData.credential = documentStore.recordManagerConfig.config.credential
        }
        setSelectedRecordManagerProvider(nodeData)
        setShowRecordManagerListDialog(false)
    }

    const showRecordManagerList = () => {
        const dialogProp = {
            title: '选择 Record Manager'
        }
        setDialogProps(dialogProp)
        setShowRecordManagerListDialog(true)
    }

    const showUpsertHistoryDrawer = () => {
        const dialogProp = {
            id: storeId
        }
        setUpsertHistoryDrawerDialogProps(dialogProp)
        setShowUpsertHistorySideDrawer(true)
    }

    const onSelectHistoryDetails = (history) => {
        const props = {
            title: moment(history.date).format('DD-MMM-YYYY, hh:mm:ss A'),
            numAdded: history.result.numAdded,
            numUpdated: history.result.numUpdated,
            numSkipped: history.result.numSkipped,
            numDeleted: history.result.numDeleted,
            flowData: history.flowData
        }
        setUpsertDetailsDialogProps(props)
        setShowUpsertHistoryDetailsDialog(true)
    }

    const checkMandatoryFields = () => {
        let canSubmit = true
        const inputParams = (selectedVectorStoreProvider?.inputParams ?? []).filter((inputParam) => !inputParam.hidden)
        for (const inputParam of inputParams) {
            if (!inputParam.optional && (!selectedVectorStoreProvider.inputs[inputParam.name] || !selectedVectorStoreProvider.credential)) {
                if (inputParam.type === 'credential' && !selectedVectorStoreProvider.credential) {
                    canSubmit = false
                    break
                } else if (inputParam.type !== 'credential' && !selectedVectorStoreProvider.inputs[inputParam.name]) {
                    canSubmit = false
                    break
                }
            }
        }

        const inputParams2 = (selectedEmbeddingsProvider?.inputParams ?? []).filter((inputParam) => !inputParam.hidden)
        for (const inputParam of inputParams2) {
            if (!inputParam.optional && (!selectedEmbeddingsProvider.inputs[inputParam.name] || !selectedEmbeddingsProvider.credential)) {
                if (inputParam.type === 'credential' && !selectedEmbeddingsProvider.credential) {
                    canSubmit = false
                    break
                } else if (inputParam.type !== 'credential' && !selectedEmbeddingsProvider.inputs[inputParam.name]) {
                    canSubmit = false
                    break
                }
            }
        }

        if (!canSubmit) {
            enqueueSnackbar({
                message: 'Please fill in all mandatory fields.',
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'warning',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    action: (key) => (
                        <Button style={{ color: 'white', minWidth: 'fit-content' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
        }
        return canSubmit
    }

    const prepareConfigData = () => {
        const data = {
            storeId: storeId,
            docId: docId
        }
        // Set embedding config
        if (selectedEmbeddingsProvider.inputs) {
            data.embeddingConfig = {}
            data.embeddingName = selectedEmbeddingsProvider.name
            Object.keys(selectedEmbeddingsProvider.inputs).map((key) => {
                if (key === 'FLOWISE_CREDENTIAL_ID') {
                    data.embeddingConfig['credential'] = selectedEmbeddingsProvider.inputs[key]
                } else {
                    data.embeddingConfig[key] = selectedEmbeddingsProvider.inputs[key]
                }
            })
        } else {
            data.embeddingConfig = null
            data.embeddingName = ''
        }

        // Set vector store config
        if (selectedVectorStoreProvider.inputs) {
            data.vectorStoreConfig = {}
            data.vectorStoreName = selectedVectorStoreProvider.name
            Object.keys(selectedVectorStoreProvider.inputs).map((key) => {
                if (key === 'FLOWISE_CREDENTIAL_ID') {
                    data.vectorStoreConfig['credential'] = selectedVectorStoreProvider.inputs[key]
                } else {
                    data.vectorStoreConfig[key] = selectedVectorStoreProvider.inputs[key]
                }
            })
        } else {
            data.vectorStoreConfig = null
            data.vectorStoreName = ''
        }

        // Set record manager config
        if (selectedRecordManagerProvider.inputs) {
            data.recordManagerConfig = {}
            data.recordManagerName = selectedRecordManagerProvider.name
            Object.keys(selectedRecordManagerProvider.inputs).map((key) => {
                if (key === 'FLOWISE_CREDENTIAL_ID') {
                    data.recordManagerConfig['credential'] = selectedRecordManagerProvider.inputs[key]
                } else {
                    data.recordManagerConfig[key] = selectedRecordManagerProvider.inputs[key]
                }
            })
        } else {
            data.recordManagerConfig = null
            data.recordManagerName = ''
        }

        return data
    }

    const tryAndInsertIntoStore = () => {
        if (checkMandatoryFields()) {
            setLoading(true)
            const data = prepareConfigData()
            insertIntoVectorStoreApi.request(data)
        }
    }

    const saveVectorStoreConfig = () => {
        setLoading(true)
        const data = prepareConfigData()
        saveVectorStoreConfigApi.request(data)
    }

    const resetVectorStoreConfig = () => {
        setSelectedEmbeddingsProvider({})
        setSelectedVectorStoreProvider({})
        setSelectedRecordManagerProvider({})
    }

    const getActiveStep = () => {
        if (selectedRecordManagerProvider && Object.keys(selectedRecordManagerProvider).length > 0) {
            return 3
        }
        if (selectedVectorStoreProvider && Object.keys(selectedVectorStoreProvider).length > 0) {
            return 2
        }
        if (selectedEmbeddingsProvider && Object.keys(selectedEmbeddingsProvider).length > 0) {
            return 1
        }
        return 0
    }

    const isRecordManagerDisabled = () => {
        return Object.keys(selectedVectorStoreProvider).length === 0 || isRecordManagerUnavailable
    }

    const isVectorStoreDisabled = () => {
        return Object.keys(selectedEmbeddingsProvider).length === 0
    }

    useEffect(() => {
        if (saveVectorStoreConfigApi.data) {
            setLoading(false)
            enqueueSnackbar({
                message: 'Configuration saved successfully',
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveVectorStoreConfigApi.data])

    useEffect(() => {
        if (insertIntoVectorStoreApi.data) {
            setLoading(false)
            setShowUpsertHistoryDialog(true)
            setUpsertResultDialogProps({ ...insertIntoVectorStoreApi.data, goToRetrievalQuery: true })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [insertIntoVectorStoreApi.data])

    useEffect(() => {
        if (insertIntoVectorStoreApi.error) {
            setLoading(false)
            setError(insertIntoVectorStoreApi.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [insertIntoVectorStoreApi.error])

    useEffect(() => {
        if (saveVectorStoreConfigApi.error) {
            setLoading(false)
            setError(saveVectorStoreConfigApi.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveVectorStoreConfigApi.error])

    useEffect(() => {
        getSpecificDocumentStoreApi.request(storeId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (getSpecificDocumentStoreApi.data) {
            const docStore = getSpecificDocumentStoreApi.data
            setDocumentStore(docStore)
            if (docStore.embeddingConfig) {
                getEmbeddingNodeDetailsApi.request(docStore.embeddingConfig.name)
            }
            if (docStore.vectorStoreConfig) {
                getVectorStoreNodeDetailsApi.request(docStore.vectorStoreConfig.name)
            }
            if (docStore.recordManagerConfig) {
                getRecordManagerNodeDetailsApi.request(docStore.recordManagerConfig.name)
            }
            setLoading(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificDocumentStoreApi.data])

    useEffect(() => {
        if (getEmbeddingNodeDetailsApi.data) {
            const node = getEmbeddingNodeDetailsApi.data
            onEmbeddingsSelected(node)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getEmbeddingNodeDetailsApi.data])

    useEffect(() => {
        if (getVectorStoreNodeDetailsApi.data) {
            const node = getVectorStoreNodeDetailsApi.data
            onVectorStoreSelected(node)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getVectorStoreNodeDetailsApi.data])

    useEffect(() => {
        if (getRecordManagerNodeDetailsApi.data) {
            const node = getRecordManagerNodeDetailsApi.data
            onRecordManagerSelected(node)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getRecordManagerNodeDetailsApi.data])

    useEffect(() => {
        if (getSpecificDocumentStoreApi.error) {
            setError(getSpecificDocumentStoreApi.error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getSpecificDocumentStoreApi.error])

    // showEmbeddingsList()

    return (
        <>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 2 }}>
                    <ViewHeader
                        isBackButton={true}
                        search={false}
                        title={getSpecificDocumentStoreApi.data?.name}
                        description='配置 Embeddings, Vector Store 和 Record Manager'
                        onBack={() => navigate(-1)}
                    >
                        {(Object.keys(selectedEmbeddingsProvider).length > 0 || Object.keys(selectedVectorStoreProvider).length > 0) && (
                            <Button
                                variant='contained'
                                color='error'
                                startIcon={<PiArrowCounterClockwiseLight size='0.8em' />}
                                onClick={() => resetVectorStoreConfig()}
                            >
                                重置
                            </Button>
                        )}
                        {(Object.keys(selectedEmbeddingsProvider).length > 0 || Object.keys(selectedVectorStoreProvider).length > 0) && (
                            <Button
                                variant='contained'
                                color='primary'
                                startIcon={<PiFloppyDiskBackLight size='0.8em' />}
                                onClick={() => saveVectorStoreConfig()}
                            >
                                保存配置
                            </Button>
                        )}
                        {Object.keys(selectedEmbeddingsProvider).length > 0 && Object.keys(selectedVectorStoreProvider).length > 0 && (
                            <Button
                                variant='contained'
                                startIcon={<PiRowsPlusTopLight size='0.8em' />}
                                onClick={() => tryAndInsertIntoStore()}
                            >
                                更新文档
                            </Button>
                        )}
                        <Button variant='contained' startIcon={<PiClockCountdownLight size='0.8em' />} onClick={showUpsertHistoryDrawer}>
                            操作记录
                        </Button>
                    </ViewHeader>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4} md={4}>
                            {Object.keys(selectedEmbeddingsProvider).length === 0 ? (
                                <Button
                                    onClick={showEmbeddingsList}
                                    fullWidth={true}
                                    sx={{
                                        color: customization?.isDarkMode ? 'white' : 'inherit',
                                        borderRadius: '10px',
                                        minHeight: '64px',
                                        backgroundImage: customization?.isDarkMode
                                            ? `linear-gradient(to right, #e654bc, #4b86e7)`
                                            : `linear-gradient(to right, #fadef2, #cfdcf1)`,
                                        '&:hover': {
                                            backgroundImage: customization?.isDarkMode
                                                ? `linear-gradient(to right, #de32ac, #2d73e7)`
                                                : `linear-gradient(to right, #f6c2e7, #b4cbf1)`
                                        }
                                    }}
                                    className='mt-10'
                                >
                                    选择 Embeddings
                                </Button>
                            ) : (
                                <Box>
                                    <Grid container spacing='2'>
                                        <Grid item xs={12} md={12} lg={12} sm={12}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        flexDirection: 'row'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignContent: 'center',
                                                            flexDirection: 'row'
                                                        }}
                                                    >
                                                        {Object.keys(selectedEmbeddingsProvider).length > 0 && (
                                                            <div className='flex items-center'>
                                                                <Typography variant='h4'>Embeddings</Typography>
                                                                <IconButton variant='outlined' color='primary' onClick={showEmbeddingsList}>
                                                                    <IconEditCircle />
                                                                </IconButton>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1 }}></div>
                                                    {selectedEmbeddingsProvider.label ? (
                                                        <img
                                                            style={{
                                                                width: 18,
                                                                height: 18,
                                                                objectFit: 'contain'
                                                            }}
                                                            alt={selectedEmbeddingsProvider.label ?? 'embeddings'}
                                                            src={`${baseURL}/api/v1/node-icon/${selectedEmbeddingsProvider?.name}`}
                                                        />
                                                    ) : (
                                                        <Embeddings color='black' />
                                                    )}
                                                    <span className='ml-1'>{selectedEmbeddingsProvider.label}</span>
                                                </Box>
                                                <CardWrapper className='shadow-card'>
                                                    {selectedEmbeddingsProvider &&
                                                        Object.keys(selectedEmbeddingsProvider).length > 0 &&
                                                        (selectedEmbeddingsProvider.inputParams ?? [])
                                                            .filter((inputParam) => !inputParam.hidden)
                                                            .map((inputParam, index) => (
                                                                <DocStoreInputHandler
                                                                    key={index}
                                                                    data={selectedEmbeddingsProvider}
                                                                    inputParam={inputParam}
                                                                    isAdditionalParams={inputParam.additionalParams}
                                                                />
                                                            ))}
                                                </CardWrapper>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            {Object.keys(selectedVectorStoreProvider).length === 0 ? (
                                <Button
                                    onClick={showVectorStoreList}
                                    fullWidth={true}
                                    sx={{
                                        color: customization?.isDarkMode ? 'white' : 'inherit',
                                        borderRadius: '10px',
                                        minHeight: '64px',
                                        opacity: isVectorStoreDisabled() ? 0.7 : 1,
                                        backgroundImage: customization?.isDarkMode
                                            ? `linear-gradient(to right, #4d8ef1, #f1de5c)`
                                            : `linear-gradient(to right, #b9d0f4, #fef9d7)`,
                                        '&:hover': {
                                            backgroundImage: customization?.isDarkMode
                                                ? `linear-gradient(to right, #2576f2, #f0d72e)`
                                                : `linear-gradient(to right, #9cbdf2, #fcf3b6)`
                                        }
                                    }}
                                    className='mt-10'
                                    disabled={isVectorStoreDisabled()}
                                >
                                    选择向量存储
                                </Button>
                            ) : (
                                <Box>
                                    <Grid container spacing='2'>
                                        <Grid item xs={12} md={12} lg={12} sm={12}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        flexDirection: 'row'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignContent: 'center',
                                                            flexDirection: 'row'
                                                        }}
                                                    >
                                                        {Object.keys(selectedVectorStoreProvider).length > 0 && (
                                                            <div className='flex items-center'>
                                                                <Typography variant='h4'>Vector Store</Typography>
                                                                <IconButton
                                                                    variant='outlined'
                                                                    sx={{ ml: 1 }}
                                                                    color='primary'
                                                                    onClick={showVectorStoreList}
                                                                >
                                                                    <IconEditCircle />
                                                                </IconButton>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1 }}></div>
                                                    {selectedVectorStoreProvider.label ? (
                                                        <img
                                                            style={{
                                                                width: 18,
                                                                height: 18,
                                                                objectFit: 'contain'
                                                            }}
                                                            alt={selectedVectorStoreProvider.label ?? 'embeddings'}
                                                            src={`${baseURL}/api/v1/node-icon/${selectedVectorStoreProvider?.name}`}
                                                        />
                                                    ) : (
                                                        <Embeddings color='black' />
                                                    )}
                                                    <span className='ml-1'>{selectedVectorStoreProvider.label}</span>
                                                </Box>
                                                <CardWrapper className='shadow-card'>
                                                    {selectedVectorStoreProvider &&
                                                        Object.keys(selectedVectorStoreProvider).length > 0 &&
                                                        (selectedVectorStoreProvider.inputParams ?? [])
                                                            .filter((inputParam) => !inputParam.hidden)
                                                            .map((inputParam, index) => (
                                                                <DocStoreInputHandler
                                                                    key={index}
                                                                    data={selectedVectorStoreProvider}
                                                                    inputParam={inputParam}
                                                                    isAdditionalParams={inputParam.additionalParams}
                                                                />
                                                            ))}
                                                </CardWrapper>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4} md={4}>
                            {Object.keys(selectedRecordManagerProvider).length === 0 ? (
                                <Button
                                    onClick={showRecordManagerList}
                                    fullWidth={true}
                                    sx={{
                                        color: customization?.isDarkMode ? 'white' : 'inherit',
                                        borderRadius: '10px',
                                        minHeight: '64px',
                                        opacity: isRecordManagerDisabled() ? 0.7 : 1,
                                        backgroundImage: customization?.isDarkMode
                                            ? `linear-gradient(to right, #f5db3f, #42daa7)`
                                            : `linear-gradient(to right, #f9f1c0, #c7f1e3)`,
                                        '&:hover': {
                                            backgroundImage: customization?.isDarkMode
                                                ? `linear-gradient(to right, #d9c238, #3dc295)`
                                                : `linear-gradient(to right, #f6e99b, #a0f2d7)`
                                        }
                                    }}
                                    className='mt-10'
                                    disabled={isRecordManagerDisabled()}
                                >
                                    {isRecordManagerUnavailable ? '选定的向量存储没有合适的Record Manager' : '选择 Record Manager'}
                                </Button>
                            ) : (
                                <Box>
                                    <Grid container spacing='2'>
                                        <Grid item xs={12} md={12} lg={12} sm={12}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        flexDirection: 'row'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignContent: 'center',
                                                            flexDirection: 'row'
                                                        }}
                                                    >
                                                        {Object.keys(selectedRecordManagerProvider).length > 0 && (
                                                            <div className='flex items-center'>
                                                                <Typography sx={{ ml: 1 }} variant='h4'>
                                                                    Record Manager
                                                                </Typography>
                                                                <IconButton
                                                                    variant='outlined'
                                                                    sx={{ ml: 1 }}
                                                                    color='primary'
                                                                    onClick={showRecordManagerList}
                                                                >
                                                                    <IconEditCircle />
                                                                </IconButton>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ flex: 1 }}></div>
                                                    {selectedRecordManagerProvider.label ? (
                                                        <img
                                                            style={{
                                                                width: 18,
                                                                height: 18,
                                                                objectFit: 'contain'
                                                            }}
                                                            alt={selectedRecordManagerProvider.label ?? 'embeddings'}
                                                            src={`${baseURL}/api/v1/node-icon/${selectedRecordManagerProvider?.name}`}
                                                        />
                                                    ) : (
                                                        <Embeddings color='black' />
                                                    )}
                                                    <span className='ml-1'>{selectedRecordManagerProvider.label}</span>
                                                </Box>
                                                <CardWrapper className='shadow-card'>
                                                    {selectedRecordManagerProvider &&
                                                        Object.keys(selectedRecordManagerProvider).length > 0 &&
                                                        (selectedRecordManagerProvider.inputParams ?? [])
                                                            .filter((inputParam) => !inputParam.hidden)
                                                            .map((inputParam, index) => (
                                                                <>
                                                                    <DocStoreInputHandler
                                                                        key={index}
                                                                        data={selectedRecordManagerProvider}
                                                                        inputParam={inputParam}
                                                                        isAdditionalParams={inputParam.additionalParams}
                                                                    />
                                                                </>
                                                            ))}
                                                </CardWrapper>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Stack>
            )}

            {showEmbeddingsListDialog && (
                <ComponentsListDialog
                    show={showEmbeddingsListDialog}
                    dialogProps={dialogProps}
                    onCancel={() => setShowEmbeddingsListDialog(false)}
                    apiCall={documentsApi.getEmbeddingProviders}
                    onSelected={onEmbeddingsSelected}
                />
            )}
            {showVectorStoreListDialog && (
                <ComponentsListDialog
                    show={showVectorStoreListDialog}
                    dialogProps={dialogProps}
                    onCancel={() => setShowVectorStoreListDialog(false)}
                    apiCall={documentsApi.getVectorStoreProviders}
                    onSelected={onVectorStoreSelected}
                />
            )}
            {showRecordManagerListDialog && (
                <ComponentsListDialog
                    show={showRecordManagerListDialog}
                    dialogProps={dialogProps}
                    onCancel={() => setShowRecordManagerListDialog(false)}
                    apiCall={documentsApi.getRecordManagerProviders}
                    onSelected={onRecordManagerSelected}
                />
            )}
            {showUpsertHistoryDialog && (
                <UpsertResultDialog
                    show={showUpsertHistoryDialog}
                    dialogProps={upsertResultDialogProps}
                    onCancel={() => {
                        setShowUpsertHistoryDialog(false)
                    }}
                    onGoToRetrievalQuery={() => navigate('/document-stores/query/' + storeId)}
                ></UpsertResultDialog>
            )}
            {showUpsertHistorySideDrawer && (
                <UpsertHistorySideDrawer
                    show={showUpsertHistorySideDrawer}
                    dialogProps={upsertHistoryDrawerDialogProps}
                    onClickFunction={() => setShowUpsertHistorySideDrawer(false)}
                    onSelectHistoryDetails={onSelectHistoryDetails}
                />
            )}
            {showUpsertHistoryDetailsDialog && (
                <UpsertHistoryDetailsDialog
                    show={showUpsertHistoryDetailsDialog}
                    dialogProps={upsertDetailsDialogProps}
                    onCancel={() => setShowUpsertHistoryDetailsDialog(false)}
                />
            )}
            <ConfirmDialog />
            {loading && <BackdropLoader open={loading} />}
        </>
    )
}

export default VectorStoreConfigure
