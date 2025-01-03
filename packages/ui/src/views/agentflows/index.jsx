import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { Box, Button, Skeleton, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// project imports
import ItemCard from '@/ui-component/cards/ItemCard'
import { gridSpacing } from '@/store/constant'
import AgentsEmptySVG from '@/assets/images/agents_empty.svg'
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

// ==============================|| AGENTS ||============================== //

const Agentflows = () => {
    const navigate = useNavigate()
    const theme = useTheme()

    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [images, setImages] = useState({})
    const [search, setSearch] = useState('')

    const getAllAgentflows = useApi(chatflowsApi.getAllAgentflows)
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
        navigate('/agentcanvas')
    }

    const goToCanvas = (selectedAgentflow) => {
        navigate(`/agentcanvas/${selectedAgentflow.id}`)
    }

    useEffect(() => {
        getAllAgentflows.request()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setLoading(getAllAgentflows.loading)
    }, [getAllAgentflows.loading])

    useEffect(() => {
        if (getAllAgentflows.data) {
            try {
                const agentflows = getAllAgentflows.data
                const images = {}
                for (let i = 0; i < agentflows.length; i += 1) {
                    const flowDataStr = agentflows[i].flowData
                    const flowData = JSON.parse(flowDataStr)
                    const nodes = flowData.nodes || []
                    images[agentflows[i].id] = []
                    for (let j = 0; j < nodes.length; j += 1) {
                        const imageSrc = `${baseURL}/api/v1/node-icon/${nodes[j].data.name}`
                        if (!images[agentflows[i].id].includes(imageSrc)) {
                            images[agentflows[i].id].push(imageSrc)
                        }
                    }
                }
                setImages(images)
            } catch (e) {
                console.error(e)
            }
        }
    }, [getAllAgentflows.data])

    return (
        <>
            {error ? (
                <ErrorBoundary error={error} />
            ) : (
                <Stack flexDirection='column' sx={{ gap: 3 }}>
                    <ViewHeader onSearchChange={onSearchChange} search={true} searchPlaceholder='搜索...' title='智能体编排'>
                        <Button variant='contained' color='primary' onClick={addNew} startIcon={<PiPlus size='0.8em' />}>
                            创建智能体
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
                            {isLoading && !getAllAgentflows.data ? (
                                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                    <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                                    <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                                    <Skeleton variant='rounded' height={160} sx={{ bgcolor: theme.palette.background.default }} />
                                </Box>
                            ) : (
                                <Box display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={gridSpacing}>
                                    {getAllAgentflows.data?.filter(filterFlows).map((data, index) => (
                                        <ItemCard key={index} onClick={() => goToCanvas(data)} data={data} images={images[data.id]} />
                                    ))}
                                </Box>
                            )}
                        </>
                    ) : (
                        <FlowListTable
                            isAgentCanvas={true}
                            data={getAllAgentflows.data}
                            images={images}
                            isLoading={isLoading}
                            filterFunction={filterFlows}
                            updateFlowsApi={getAllAgentflows}
                            setError={setError}
                        />
                    )}
                    {!isLoading && (!getAllAgentflows.data || getAllAgentflows.data.length === 0) && (
                        <Stack sx={{ alignItems: 'center', justifyContent: 'center' }} flexDirection='column'>
                            <Box sx={{ p: 2, height: 'auto' }}>
                                <img
                                    style={{ objectFit: 'cover', height: '12vh', width: 'auto' }}
                                    src={AgentsEmptySVG}
                                    alt='AgentsEmptySVG'
                                />
                            </Box>
                            <div>暂无数据</div>
                        </Stack>
                    )}
                </Stack>
            )}

            <ConfirmDialog />
        </>
    )
}

export default Agentflows
