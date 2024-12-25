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

const badges = ['POPULAR', 'NEW']

const types = {
    Chatflow: '对话工作流',
    Agentflow: '智能体工作流',
    Tool: '工具'
}
const framework = {
    Langchain: 'Lang Chain',
    LlamaIndex: 'Llama Index'
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
    const [images, setImages] = useState({})
    const [usecases, setUsecases] = useState([])
    const [eligibleUsecases, setEligibleUsecases] = useState([])
    const [selectedUsecases, setSelectedUsecases] = useState([])

    const [showToolDialog, setShowToolDialog] = useState(false)
    const [toolDialogProps, setToolDialogProps] = useState({})

    const getAllTemplatesMarketplacesApi = useApi(marketplacesApi.getAllTemplatesFromMarketplaces)

    const [view, setView] = React.useState(localStorage.getItem('mpDisplayStyle') || 'card')
    const [search, setSearch] = useState('')
    const [badgeFilter, setBadgeFilter] = useState([])
    const [typeFilter, setTypeFilter] = useState([])
    const [frameworkFilter, setFrameworkFilter] = useState([])

    const clearAllUsecases = () => {
        setSelectedUsecases([])
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
            case 'framework':
                setFrameworkFilter(typeof value === 'string' ? value.split(',') : value)
                break
            default:
                break
        }
    }

    useEffect(() => {
        const data = getAllTemplatesMarketplacesApi.data

        var params = {
            typeFilter,
            badgeFilter,
            frameworkFilter,
            search
        }
        getEligibleUsecases(data, params)
    }, [badgeFilter, typeFilter, frameworkFilter, search])

    const handleChange = (event, nextView) => {
        if (nextView === null) return
        localStorage.setItem('mpDisplayStyle', nextView)
        setView(nextView)
    }

    const onSearchChange = (event) => {
        setSearch(event.target.value)
        const data = getAllTemplatesMarketplacesApi.data

        getEligibleUsecases(data, { typeFilter, badgeFilter, frameworkFilter, search: event.target.value })
    }

    function filterFlows(data) {
        return (
            (data.categories ? data.categories.join(',') : '').toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            data.templateName.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            (data.description && data.description.toLowerCase().indexOf(search.toLowerCase()) > -1)
        )
    }

    function filterByBadge(data) {
        return badgeFilter.length > 0 ? badgeFilter.includes(data.badge) : true
    }

    function filterByType(data) {
        return typeFilter.length > 0 ? typeFilter.includes(data.type) : true
    }

    function filterByFramework(data) {
        return frameworkFilter.length > 0 ? (data.framework || []).some((item) => frameworkFilter.includes(item)) : true
    }

    function filterByUsecases(data) {
        return selectedUsecases.length > 0 ? (data.usecases || []).some((item) => selectedUsecases.includes(item)) : true
    }

    const getEligibleUsecases = (data, filter) => {
        if (!data) return

        let filteredData = data
        if (filter.badgeFilter.length > 0) filteredData = filteredData.filter((data) => filter.badgeFilter.includes(data.badge))
        if (filter.typeFilter != '') {
            filteredData = filteredData.filter((data) => filter.typeFilter.includes(data.type))
        }
        if (filter.frameworkFilter.length > 0)
            filteredData = filteredData.filter((data) => (data.framework || []).some((item) => filter.frameworkFilter.includes(item)))
        if (filter.search) {
            filteredData = filteredData.filter(
                (data) =>
                    (data.categories ? data.categories.join(',') : '').toLowerCase().indexOf(filter.search.toLowerCase()) > -1 ||
                    data.templateName.toLowerCase().indexOf(filter.search.toLowerCase()) > -1 ||
                    (data.description && data.description.toLowerCase().indexOf(filter.search.toLowerCase()) > -1)
            )
        }

        const usecases = []
        for (let i = 0; i < filteredData.length; i += 1) {
            if (filteredData[i].flowData) {
                usecases.push(...filteredData[i].usecases)
            }
        }
        setEligibleUsecases(Array.from(new Set(usecases)).sort())
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
            title: selectedTool.templateName,
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
        getAllTemplatesMarketplacesApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllTemplatesMarketplacesApi.loading)
    }, [getAllTemplatesMarketplacesApi.loading])

    useEffect(() => {
        if (getAllTemplatesMarketplacesApi.data) {
            try {
                const flows = getAllTemplatesMarketplacesApi.data
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
                setImages(images)
                setUsecases(Array.from(new Set(usecases)).sort())
                setEligibleUsecases(Array.from(new Set(usecases)).sort())
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllTemplatesMarketplacesApi.data])

    useEffect(() => {
        if (getAllTemplatesMarketplacesApi.error) {
            setError(getAllTemplatesMarketplacesApi.error)
        }
    }, [getAllTemplatesMarketplacesApi.error])

    return (
        <>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column'>
                    <ViewHeader
                        filters={
                            <>
                                {/* <FormControl
                                        sx={{
                                            minWidth: 120
                                        }}
                                    >
                                        <InputLabel size='small' id='filter-badge-label'>
                                            标签
                                        </InputLabel>
                                        <Select
                                            labelId='filter-badge-label'
                                            id='filter-badge-checkbox'
                                            size='small'
                                            multiple
                                            value={badgeFilter}
                                            onChange={(e) => {
                                                handleFilterChange(e, 'badge')
                                            }}
                                            input={<OutlinedInput label='Badge' />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                            sx={SelectStyles}
                                        >
                                            {badges.map((name) => (
                                                <MenuItem key={name} value={name} sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Checkbox size='small' checked={badgeFilter.indexOf(name) > -1} sx={{ p: 0 }} />
                                                    &nbsp;
                                                    <ListItemText primary={name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl> */}
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
                                        label='开发框架'
                                        value={frameworkFilter}
                                        onChange={(e) => {
                                            handleFilterChange(e, 'framework')
                                        }}
                                        size='small'
                                        sx={{ '& .MuiInputBase-input': { padding: '8px 12px !important' } }}
                                    >
                                        <MenuItem key='' value={Object.keys(framework).join(',')}>
                                            全部
                                        </MenuItem>
                                        {Object.keys(framework).map((i) => (
                                            <MenuItem key={i} value={i}>
                                                {framework[i]}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>
                            </>
                        }
                        onSearchChange={onSearchChange}
                        search={true}
                        searchPlaceholder='搜索...'
                        title='共享模版'
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
                    <TabPanel value={0} index={0}>
                        {isLoading ? (
                            <Box display='grid' sx={{ mb: 2, mt: 1 }}>
                                <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                            </Box>
                        ) : (
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
                                {usecases.map((usecase, index) => {
                                    return (
                                        <FormControlLabel
                                            key={index}
                                            sx={{ ml: '-4px', mr: '24px' }}
                                            control={
                                                <Checkbox
                                                    size='small'
                                                    sx={{ p: '10px 4px' }}
                                                    disabled={eligibleUsecases.length === 0 ? true : !eligibleUsecases.includes(usecase)}
                                                    checked={selectedUsecases.includes(usecase)}
                                                    onChange={(event) => {
                                                        setSelectedUsecases(
                                                            event.target.checked
                                                                ? [...selectedUsecases, usecase]
                                                                : selectedUsecases.filter((item) => item !== usecase)
                                                        )
                                                    }}
                                                />
                                            }
                                            label={usecase}
                                        />
                                    )
                                })}

                                {selectedUsecases.length > 0 && (
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
                        )}

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
                                        {getAllTemplatesMarketplacesApi.data
                                            ?.filter(filterByBadge)
                                            .filter(filterByType)
                                            .filter(filterFlows)
                                            .filter(filterByFramework)
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
                                                            // badgeContent={data.badge}
                                                            color={data.badge === 'POPULAR' ? 'primary' : 'error'}
                                                        >
                                                            {(data.type === 'Chatflow' || data.type === 'Agentflow') && (
                                                                <ItemCard
                                                                    onClick={() => goToCanvas(data)}
                                                                    data={data}
                                                                    images={images[data.id]}
                                                                />
                                                            )}
                                                            {data.type === 'Tool' && (
                                                                <ItemCard data={data} onClick={() => goToTool(data)} />
                                                            )}
                                                        </Badge>
                                                    )}
                                                    {!data.badge && (data.type === 'Chatflow' || data.type === 'Agentflow') && (
                                                        <ItemCard onClick={() => goToCanvas(data)} data={data} images={images[data.id]} />
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
                                data={getAllTemplatesMarketplacesApi.data}
                                filterFunction={filterFlows}
                                filterByType={filterByType}
                                filterByBadge={filterByBadge}
                                filterByFramework={filterByFramework}
                                filterByUsecases={filterByUsecases}
                                goToTool={goToTool}
                                goToCanvas={goToCanvas}
                                isLoading={isLoading}
                                setError={setError}
                            />
                        )}

                        {!isLoading && (!getAllTemplatesMarketplacesApi.data || getAllTemplatesMarketplacesApi.data.length === 0) && (
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                                <Box sx={{ p: 2, height: 'auto' }}>
                                    <img
                                        style={{ objectFit: 'cover', height: '25vh', width: 'auto' }}
                                        src={WorkflowEmptySVG}
                                        alt='WorkflowEmptySVG'
                                    />
                                </Box>
                                <div>No Marketplace Yet</div>
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
