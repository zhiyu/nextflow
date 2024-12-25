import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// material-ui
import {
    Box,
    Stack,
    Badge,
    ToggleButton,
    FormControl,
    Checkbox,
    Skeleton,
    FormControlLabel,
    ToggleButtonGroup,
    MenuItem,
    Button,
    TextField,
    Tabs,
    Tab
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import { IconX } from '@tabler/icons-react'

import { PiGridFour, PiListDashes, PiX } from 'react-icons/pi'

import ItemCard from '@/ui-component/cards/ItemCard'
import WorkflowEmptySVG from '@/assets/images/workflow_empty.svg'
import ToolDialog from '@/views/tools/ToolDialog'
import { MarketplaceTable } from '@/ui-component/table/MarketplaceTable'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import ErrorBoundary from '@/ErrorBoundary'
import { TabPanel } from '@/ui-component/tabs/TabPanel'
import { closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction } from '@/store/actions'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'

// API
import marketplacesApi from '@/api/marketplaces'

// Hooks
import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'

// const
import { baseURL } from '@/store/constant'
import { gridSpacing } from '@/store/constant'
import useNotifier from '@/utils/useNotifier'

const types = {
    Chatflow: '对话工作流',
    Agentflow: '智能体工作流',
    Tool: '工具'
}

import { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup'
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    [`& .${toggleButtonGroupClasses.grouped}`]: {
        border: 0,
        borderRadius: 4,
        [`&.${toggleButtonGroupClasses.disabled}`]: {
            border: 0
        }
    }
}))

// ==============================|| Marketplace ||============================== //

const Marketplace = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useNotifier()

    const theme = useTheme()

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [showToolDialog, setShowToolDialog] = useState(false)
    const [toolDialogProps, setToolDialogProps] = useState({})

    const [view, setView] = React.useState(localStorage.getItem('mpDisplayStyle') || 'card')
    const [search, setSearch] = useState('')
    const [badgeFilter, setBadgeFilter] = useState([])
    const [typeFilter, setTypeFilter] = useState([])

    const getAllCustomTemplatesApi = useApi(marketplacesApi.getAllCustomTemplates)
    const [templateImages, setTemplateImages] = useState({})
    const [templateUsecases, setTemplateUsecases] = useState([])
    const [eligibleTemplateUsecases, setEligibleTemplateUsecases] = useState([])
    const [selectedTemplateUsecases, setSelectedTemplateUsecases] = useState([])
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))
    const { confirm } = useConfirm()

    const handleTabChange = (event, newValue) => {
        if (newValue === 1 && !getAllCustomTemplatesApi.data) {
            getAllCustomTemplatesApi.request()
        }
        setActiveTabValue(newValue)
    }

    const clearAllUsecases = () => {
        setSelectedTemplateUsecases([])
    }

    const handleFilterChange = (event, filter) => {
        const {
            target: { value }
        } = event

        switch (filter) {
            case 'badge':
                setBadgeFilter(typeof value === 'string' ? value.split(',') : value)
                break
            case 'type':
                setTypeFilter(typeof value === 'string' ? value.split(',') : value)
                break
            default:
                break
        }
    }

    useEffect(() => {
        const data = getAllCustomTemplatesApi.data

        var params = {
            typeFilter,
            badgeFilter,
            search
        }
        geteligibleTemplateUsecases(data, params)
    }, [badgeFilter, typeFilter, search])

    const handleChange = (event, nextView) => {
        if (nextView === null) return
        localStorage.setItem('mpDisplayStyle', nextView)
        setView(nextView)
    }

    const onSearchChange = (event) => {
        setSearch(event.target.value)
        const data = getAllCustomTemplatesApi.data

        geteligibleTemplateUsecases(data, { typeFilter, badgeFilter, search: event.target.value })
    }

    const onDeleteCustomTemplate = async (template) => {
        const confirmPayload = {
            title: `Delete`,
            description: `Delete Custom Template ${template.name}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                const deleteResp = await marketplacesApi.deleteCustomTemplate(template.id)
                if (deleteResp.data) {
                    enqueueSnackbar({
                        message: 'Custom Template deleted successfully!',
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
                    getAllCustomTemplatesApi.request()
                }
            } catch (error) {
                enqueueSnackbar({
                    message: `Failed to delete custom template: ${
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

    function filterFlows(data) {
        return (
            (data.categories ? data.categories.join(',') : '').toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            data.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            (data.description && data.description.toLowerCase().indexOf(search.toLowerCase()) > -1)
        )
    }

    function filterByBadge(data) {
        return badgeFilter.length > 0 ? badgeFilter.includes(data.badge) : true
    }

    function filterByType(data) {
        return typeFilter.length > 0 ? typeFilter.includes(data.type) : true
    }

    function filterByUsecases(data) {
        return selectedTemplateUsecases.length > 0 ? (data.usecases || []).some((item) => selectedTemplateUsecases.includes(item)) : true
    }

    const geteligibleTemplateUsecases = (data, filter) => {
        if (!data) return

        let filteredData = data

        if (filter.badgeFilter.length > 0) filteredData = filteredData.filter((data) => filter.badgeFilter.includes(data.badge))
        if (filter.typeFilter != '') {
            filteredData = filteredData.filter((data) => filter.typeFilter.includes(data.type))
        }
        if (filter.search) {
            filteredData = filteredData.filter(
                (data) =>
                    (data.categories ? data.categories.join(',') : '').toLowerCase().indexOf(filter.search.toLowerCase()) > -1 ||
                    data.name.toLowerCase().indexOf(filter.search.toLowerCase()) > -1 ||
                    (data.description && data.description.toLowerCase().indexOf(filter.search.toLowerCase()) > -1)
            )
        }

        const usecases = []
        for (let i = 0; i < filteredData.length; i += 1) {
            if (filteredData[i].flowData) {
                usecases.push(...filteredData[i].usecases)
            }
        }
        setEligibleTemplateUsecases(Array.from(new Set(usecases)).sort())
    }

    const onUseTemplate = (selectedTool) => {
        const dialogProp = {
            title: 'Add New Tool',
            type: 'IMPORT',
            cancelButtonName: 'Cancel',
            confirmButtonName: 'Add',
            data: selectedTool
        }
        setToolDialogProps(dialogProp)
        setShowToolDialog(true)
    }

    const goToTool = (selectedTool) => {
        const dialogProp = {
            title: selectedTool.name,
            type: 'TEMPLATE',
            data: selectedTool
        }
        setToolDialogProps(dialogProp)
        setShowToolDialog(true)
    }

    const goToCanvas = (selectedChatflow) => {
        navigate(`/marketplace/${selectedChatflow.id}`, { state: selectedChatflow })
    }

    useEffect(() => {
        getAllCustomTemplatesApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllCustomTemplatesApi.loading)
    }, [getAllCustomTemplatesApi.loading])

    useEffect(() => {
        if (getAllCustomTemplatesApi.data) {
            try {
                const flows = getAllCustomTemplatesApi.data
                const usecases = []
                const images = {}
                for (let i = 0; i < flows.length; i += 1) {
                    if (flows[i].flowData) {
                        const flowDataStr = flows[i].flowData
                        const flowData = JSON.parse(flowDataStr)
                        usecases.push(...flows[i].usecases)
                        const nodes = flowData.nodes || []
                        images[flows[i].id] = []
                        for (let j = 0; j < nodes.length; j += 1) {
                            const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                            if (!images[flows[i].id].includes(imageSrc)) {
                                images[flows[i].id].push(imageSrc)
                            }
                        }
                    }
                }
                setTemplateImages(images)
                setTemplateUsecases(Array.from(new Set(usecases)).sort())
                setEligibleTemplateUsecases(Array.from(new Set(usecases)).sort())
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllCustomTemplatesApi.data])

    useEffect(() => {
        if (getAllCustomTemplatesApi.error) {
            setError(getAllCustomTemplatesApi.error)
        }
    }, [getAllCustomTemplatesApi.error])

    useEffect(() => {
        setLoading(getAllCustomTemplatesApi.loading)
    }, [getAllCustomTemplatesApi.loading])

    useEffect(() => {
        if (getAllCustomTemplatesApi.data) {
            try {
                const flows = getAllCustomTemplatesApi.data
                const usecases = []
                const tImages = {}
                for (let i = 0; i < flows.length; i += 1) {
                    if (flows[i].flowData) {
                        const flowDataStr = flows[i].flowData
                        const flowData = JSON.parse(flowDataStr)
                        usecases.push(...flows[i].usecases)
                        const nodes = flowData.nodes || []
                        tImages[flows[i].id] = []
                        for (let j = 0; j < nodes.length; j += 1) {
                            const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                            if (!tImages[flows[i].id].includes(imageSrc)) {
                                tImages[flows[i].id].push(imageSrc)
                            }
                        }
                    }
                }
                setTemplateImages(tImages)
                setTemplateUsecases(Array.from(new Set(usecases)).sort())
                setEligibleTemplateUsecases(Array.from(new Set(usecases)).sort())
            } catch (e) {
                console.error(e)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getAllCustomTemplatesApi.data])

    useEffect(() => {
        if (getAllCustomTemplatesApi.error) {
            setError(getAllCustomTemplatesApi.error)
        }
    }, [getAllCustomTemplatesApi.error])

    return (
        <>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column'>
                    <ViewHeader
                        filters={
                            <>
                                <FormControl
                                    sx={{
                                        borderRadius: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'end',
                                        minWidth: 120
                                    }}
                                >
                                    <TextField
                                        select
                                        multiple
                                        label='类型'
                                        value={typeFilter}
                                        onChange={(e) => {
                                            handleFilterChange(e, 'type')
                                        }}
                                        size='small'
                                        sx={{ '& .MuiInputBase-input': { padding: '8px 12px !important' } }}
                                    >
                                        <MenuItem key='' value={Object.keys(types).join(',')}>
                                            全部
                                        </MenuItem>
                                        {Object.keys(types).map((i) => (
                                            <MenuItem key={i} value={i}>
                                                {types[i]}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>
                            </>
                        }
                        onSearchChange={onSearchChange}
                        search={true}
                        searchPlaceholder='搜索...'
                        title='我的模版'
                    >
                        <StyledToggleButtonGroup
                            sx={{
                                ml: 6,
                                maxHeight: 36
                            }}
                            className='shadow-lg'
                            value={view}
                            exclusive
                            onChange={handleChange}
                        >
                            <ToggleButton value='card' title='Card View'>
                                <PiGridFour size='1.2rem' />
                            </ToggleButton>
                            <ToggleButton value='list' title='List View'>
                                <PiListDashes size='1.2rem' />
                            </ToggleButton>
                        </StyledToggleButtonGroup>
                    </ViewHeader>

                    <TabPanel value={1} index={1}>
                        <Stack
                            direction='row'
                            sx={{
                                background: theme.palette.card.main,
                                borderRadius: 1,
                                gap: 0,
                                mb: 3,
                                mt: 1,
                                p: 2,
                                alignItems: 'center',
                                flexWrap: 'wrap'
                            }}
                            className='shadow-card'
                        >
                            {templateUsecases.map((usecase, index) => (
                                <FormControlLabel
                                    key={index}
                                    sx={{ ml: '-4px', mr: '24px' }}
                                    control={
                                        <Checkbox
                                            size='small'
                                            sx={{ p: '10px 4px' }}
                                            disabled={
                                                eligibleTemplateUsecases.length === 0 ? true : !eligibleTemplateUsecases.includes(usecase)
                                            }
                                            checked={selectedTemplateUsecases.includes(usecase)}
                                            onChange={(event) => {
                                                setSelectedTemplateUsecases(
                                                    event.target.checked
                                                        ? [...selectedTemplateUsecases, usecase]
                                                        : selectedTemplateUsecases.filter((item) => item !== usecase)
                                                )
                                            }}
                                        />
                                    }
                                    label={usecase}
                                />
                            ))}
                            {selectedTemplateUsecases.length > 0 && (
                                <FormControlLabel
                                    sx={{ ml: '-4px', mr: '24px' }}
                                    control={
                                        <Button
                                            size='small'
                                            variant='text'
                                            onClick={() => clearAllUsecases()}
                                            startIcon={<PiX size='0.8rem' />}
                                        >
                                            清除筛选条件
                                        </Button>
                                    }
                                />
                            )}
                        </Stack>

                        {!view || view === 'card' ? (
                            <>
                                {isLoading ? (
                                    <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                        <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                                        <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                                        <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                                    </Box>
                                ) : (
                                    <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                        {getAllCustomTemplatesApi.data
                                            ?.filter(filterByBadge)
                                            .filter(filterByType)
                                            .filter(filterFlows)
                                            .filter(filterByUsecases)
                                            .map((data, index) => (
                                                <Box key={index}>
                                                    {data.badge && (
                                                        <Badge
                                                            sx={{
                                                                width: '100%',
                                                                height: '100%',
                                                                '& .MuiBadge-badge': {
                                                                    right: 20
                                                                }
                                                            }}
                                                            badgeContent={data.badge}
                                                            color={data.badge === 'POPULAR' ? 'primary' : 'error'}
                                                        >
                                                            {(data.type === 'Chatflow' || data.type === 'Agentflow') && (
                                                                <ItemCard
                                                                    onClick={() => goToCanvas(data)}
                                                                    data={data}
                                                                    images={templateImages[data.id]}
                                                                />
                                                            )}
                                                            {data.type === 'Tool' && (
                                                                <ItemCard data={data} onClick={() => goToTool(data)} />
                                                            )}
                                                        </Badge>
                                                    )}
                                                    {!data.badge && (data.type === 'Chatflow' || data.type === 'Agentflow') && (
                                                        <ItemCard
                                                            onClick={() => goToCanvas(data)}
                                                            data={data}
                                                            images={templateImages[data.id]}
                                                        />
                                                    )}
                                                    {!data.badge && data.type === 'Tool' && (
                                                        <ItemCard data={data} onClick={() => goToTool(data)} />
                                                    )}
                                                </Box>
                                            ))}
                                    </Box>
                                )}
                            </>
                        ) : (
                            <MarketplaceTable
                                data={getAllCustomTemplatesApi.data}
                                filterFunction={filterFlows}
                                filterByType={filterByType}
                                filterByBadge={filterByBadge}
                                filterByUsecases={filterByUsecases}
                                goToTool={goToTool}
                                goToCanvas={goToCanvas}
                                isLoading={isLoading}
                                setError={setError}
                                onDelete={onDeleteCustomTemplate}
                            />
                        )}
                        {!isLoading && (!getAllCustomTemplatesApi.data || getAllCustomTemplatesApi.data.length === 0) && (
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                                <Box sx={{ p: 2, height: 'auto' }}>
                                    <img
                                        style={{ objectFit: 'cover', height: '25vh', width: 'auto' }}
                                        src={WorkflowEmptySVG}
                                        alt='WorkflowEmptySVG'
                                    />
                                </Box>
                                <div>No Saved Custom Templates</div>
                            </Stack>
                        )}
                    </TabPanel>
                </Stack>
            )}
            <ToolDialog
                show={showToolDialog}
                dialogProps={toolDialogProps}
                onCancel={() => setShowToolDialog(false)}
                onConfirm={() => setShowToolDialog(false)}
                onUseTemplate={(tool) => onUseTemplate(tool)}
            ></ToolDialog>
            <ConfirmDialog />
        </>
    )
}

export default Marketplace
