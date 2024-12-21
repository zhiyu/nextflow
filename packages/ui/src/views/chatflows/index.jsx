import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { Breadcrumbs, Link, Typography, Box, Button, Skeleton, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import ItemCard from '@/ui-component/cards/ItemCard'
import { gridSpacing } from '@/store/constant'
import WorkflowEmptySVG from '@/assets/images/workflow_empty.svg'
import ConfirmDialog from '@/ui-component/dialog/ConfirmDialog'
import { FlowListTable } from '@/ui-component/table/FlowListTable'
import { StyledButton } from '@/ui-component/button/StyledButton'
import ViewHeader from '@/layout/MainLayout/ViewHeader'
import ErrorBoundary from '@/ErrorBoundary'

// API
import chatflowsApi from '@/api/chatflows'

// Hooks
import useApi from '@/hooks/useApi'

// const
import { baseURL } from '@/store/constant'

// icons
import { PiPlus, PiGridFour, PiListDashes } from 'react-icons/pi'

import { styled } from '@mui/material/styles'
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

// ==============================|| CHATFLOWS ||============================== //

const Chatflows = () => {
    const navigate = useNavigate()
    const theme = useTheme()

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [images, setImages] = useState({})
    const [search, setSearch] = useState('')

    const getAllChatflowsApi = useApi(chatflowsApi.getAllChatflows)
    const [view, setView] = useState(localStorage.getItem('flowDisplayStyle') || 'card')

    const handleChange = (event, nextView) => {
        if (nextView === null) return
        localStorage.setItem('flowDisplayStyle', nextView)
        setView(nextView)
    }

    const onSearchChange = (event) => {
        setSearch(event.target.value)
    }

    function filterFlows(data) {
        return (
            data.name.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
            (data.category && data.category.toLowerCase().indexOf(search.toLowerCase()) > -1) ||
            data.id.toLowerCase().indexOf(search.toLowerCase()) > -1
        )
    }

    const addNew = () => {
        navigate('/canvas')
    }

    const goToCanvas = (selectedChatflow) => {
        navigate(`/canvas/${selectedChatflow.id}`)
    }

    useEffect(() => {
        getAllChatflowsApi.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllChatflowsApi.loading)
    }, [getAllChatflowsApi.loading])

    useEffect(() => {
        if (getAllChatflowsApi.data) {
            try {
                const chatflows = getAllChatflowsApi.data
                const images = {}
                for (let i = 0; i < chatflows.length; i += 1) {
                    const flowDataStr = chatflows[i].flowData
                    const flowData = JSON.parse(flowDataStr)
                    const nodes = flowData.nodes || []
                    images[chatflows[i].id] = []
                    for (let j = 0; j < nodes.length; j += 1) {
                        const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                        if (!images[chatflows[i].id].includes(imageSrc)) {
                            images[chatflows[i].id].push(imageSrc)
                        }
                    }
                }
                setImages(images)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllChatflowsApi.data])

    return (
        <>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 3 }}>
                    {/* <Breadcrumbs separator='›' aria-label='breadcrumb'>
                        <Typography color='inherit'>工作台</Typography>
                        <Link underline='hover' color='inherit' href='/'>
                            对话流
                        </Link>
                    </Breadcrumbs> */}
                    <ViewHeader onSearchChange={onSearchChange} search={true} searchPlaceholder='搜索...' title='对话编排'>
                        <Button variant='contained' color='primary' onClick={addNew} startIcon={<PiPlus size='0.8em' />}>
                            创建对话
                        </Button>
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
                    {!view || view === 'card' ? (
                        <>
                            {isLoading && !getAllChatflowsApi.data ? (
                                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                    <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                                    <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                                    <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                                </Box>
                            ) : (
                                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                    {getAllChatflowsApi.data?.filter(filterFlows).map((data, index) => (
                                        <ItemCard key={index} onClick={() => goToCanvas(data)} data={data} images={images[data.id]} />
                                    ))}
                                </Box>
                            )}
                        </>
                    ) : (
                        <FlowListTable
                            data={getAllChatflowsApi.data}
                            images={images}
                            isLoading={isLoading}
                            filterFunction={filterFlows}
                            updateFlowsApi={getAllChatflowsApi}
                            setError={setError}
                        />
                    )}
                    {!isLoading && (!getAllChatflowsApi.data || getAllChatflowsApi.data.length === 0) && (
                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                            <Box sx={{ p: 2, height: 'auto' }}>
                                <img
                                    style={{ objectFit: 'cover', height: '25vh', width: 'auto' }}
                                    src={WorkflowEmptySVG}
                                    alt='WorkflowEmptySVG'
                                />
                            </Box>
                            <div>No Chatflows Yet</div>
                        </Stack>
                    )}
                </Stack>
            )}

            <ConfirmDialog />
        </>
    )
}

export default Chatflows
