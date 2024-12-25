import PropTypes from 'prop-types'
import {
    Button,
    Chip,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Stack,
    useTheme,
    IconButton
} from '@mui/material'
import { IconTrash } from '@tabler/icons-react'

import { PiTrash } from 'react-icons/pi'

const types = {
    Chatflow: '对话工作流',
    Agentflow: '智能体工作流',
    Tool: '工具'
}

export const MarketplaceTable = ({
    data,
    filterFunction,
    filterByBadge,
    filterByType,
    filterByFramework,
    filterByUsecases,
    goToCanvas,
    goToTool,
    isLoading,
    onDelete
}) => {
    const openTemplate = (selectedTemplate) => {
        if (selectedTemplate.flowData) {
            goToCanvas(selectedTemplate)
        } else {
            goToTool(selectedTemplate)
        }
    }

    return (
        <>
            <TableContainer component={Paper} className='py-4'>
                <Table sx={{ minWidth: 650 }} aria-label='a dense table'>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ minWidth: '250px' }} key='0'>
                                名称
                            </TableCell>
                            <TableCell sx={{ minWidth: '120px' }} key='1'>
                                类型
                            </TableCell>
                            <TableCell sx={{ minWidth: '120px' }} key='4'>
                                使用场景
                            </TableCell>
                            <TableCell key='2'>描述</TableCell>
                            {/* <TableCell key='5'>节点</TableCell> */}
                            <TableCell key='6'>标签</TableCell>
                            {onDelete && <TableCell key='7' style={{ width: '40px' }}></TableCell>}
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
                                    {/* <TableCell>
                                        <Skeleton variant='text' />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant='text' />
                                    </TableCell> */}
                                    {onDelete && (
                                        <TableCell>
                                            <Skeleton variant='text' />
                                        </TableCell>
                                    )}
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
                                    {/* <TableCell>
                                        <Skeleton variant='text' />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant='text' />
                                    </TableCell> */}
                                    {onDelete && (
                                        <TableCell>
                                            <Skeleton variant='text' />
                                        </TableCell>
                                    )}
                                </TableRow>
                            </>
                        ) : (
                            <>
                                {data
                                    ?.filter(filterByBadge)
                                    .filter(filterByType)
                                    .filter(filterFunction)
                                    .filter(filterByFramework)
                                    .filter(filterByUsecases)
                                    .map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell key='0'>
                                                <Button onClick={() => openTemplate(row)} sx={{ textAlign: 'left' }}>
                                                    {row.templateName || row.name}
                                                </Button>
                                            </TableCell>
                                            <TableCell key='1'>
                                                <Typography>{types[row.type]}</Typography>
                                            </TableCell>
                                            {/* <TableCell key='3'>
                                                <Stack flexDirection='row' sx={{ gap: 1, flexWrap: 'wrap' }}>
                                                    {row.framework &&
                                                        row.framework.length > 0 &&
                                                        row.framework.map((framework, index) => (
                                                            <span
                                                                variant='outlined'
                                                                key={index}
                                                                style={{ marginRight: 3, marginBottom: 3 }}
                                                            >
                                                                {framework}
                                                            </span>
                                                        ))}
                                                </Stack>
                                            </TableCell> */}
                                            <TableCell key='4'>
                                                <Stack flexDirection='row' sx={{ gap: 1, flexWrap: 'wrap' }}>
                                                    {row.usecases &&
                                                        row.usecases.length > 0 &&
                                                        row.usecases.map((usecase, index) => (
                                                            <span
                                                                variant='outlined'
                                                                key={index}
                                                                style={{ marginRight: 3, marginBottom: 3 }}
                                                            >
                                                                {usecase}
                                                            </span>
                                                        ))}
                                                </Stack>
                                            </TableCell>
                                            <TableCell key='2'>
                                                <Typography sx={{ overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>
                                                    {row.description || ''}
                                                </Typography>
                                            </TableCell>

                                            {/* <TableCell key='5'>
                                                <Stack flexDirection='row' sx={{ gap: 1, flexWrap: 'wrap' }}>
                                                    {row.categories &&
                                                        row.categories.map((tag, index) => (
                                                            <Chip
                                                                variant='outlined'
                                                                key={index}
                                                                size='small'
                                                                label={tag}
                                                                style={{ marginRight: 3, marginBottom: 3 }}
                                                            />
                                                        ))}
                                                </Stack>
                                            </TableCell> */}
                                            <TableCell key='6'>
                                                <Typography>
                                                    {row.badge &&
                                                        row.badge
                                                            .split(';')
                                                            .map((tag, index) => (
                                                                <Chip
                                                                    color={tag === 'POPULAR' ? 'primary' : 'error'}
                                                                    key={index}
                                                                    size='small'
                                                                    label={tag.toUpperCase()}
                                                                    style={{ marginRight: 5, marginBottom: 5 }}
                                                                />
                                                            ))}
                                                </Typography>
                                            </TableCell>
                                            {onDelete && (
                                                <TableCell key='7'>
                                                    <IconButton title='Delete' onClick={() => onDelete(row)}>
                                                        <PiTrash size='1.2rem' />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

MarketplaceTable.propTypes = {
    data: PropTypes.array,
    filterFunction: PropTypes.func,
    filterByBadge: PropTypes.func,
    filterByType: PropTypes.func,
    filterByFramework: PropTypes.func,
    filterByUsecases: PropTypes.func,
    goToTool: PropTypes.func,
    goToCanvas: PropTypes.func,
    isLoading: PropTypes.bool,
    onDelete: PropTypes.func
}
