import { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { styled } from '@mui/material/styles'
import {
    Box,
    Chip,
    Paper,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material'
import FlowListMenu from '../button/FlowListMenu'
import { Link } from 'react-router-dom'

const getLocalStorageKeyName = (name, isAgentCanvas) => {
    return (isAgentCanvas ? 'agentcanvas' : 'chatflowcanvas') + '_' + name
}

export const FlowListTable = ({ data, images, isLoading, filterFunction, updateFlowsApi, setError, isAgentCanvas }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const localStorageKeyOrder = getLocalStorageKeyName('order', isAgentCanvas)
    const localStorageKeyOrderBy = getLocalStorageKeyName('orderBy', isAgentCanvas)

    const [order, setOrder] = useState(localStorage.getItem(localStorageKeyOrder) || 'desc')
    const [orderBy, setOrderBy] = useState(localStorage.getItem(localStorageKeyOrderBy) || 'updatedDate')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        const newOrder = isAsc ? 'desc' : 'asc'
        setOrder(newOrder)
        setOrderBy(property)
        localStorage.setItem(localStorageKeyOrder, newOrder)
        localStorage.setItem(localStorageKeyOrderBy, property)
    }

    const sortedData = data
        ? [...data].sort((a, b) => {
              if (orderBy === 'name') {
                  return order === 'asc' ? (a.name || '').localeCompare(b.name || '') : (b.name || '').localeCompare(a.name || '')
              } else if (orderBy === 'updatedDate') {
                  return order === 'asc'
                      ? new Date(a.updatedDate) - new Date(b.updatedDate)
                      : new Date(b.updatedDate) - new Date(a.updatedDate)
              }
              return 0
          })
        : []

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell scope='row' key='0'>
                                <TableSortLabel active={orderBy === 'name'} direction={order} onClick={() => handleRequestSort('name')}>
                                    名称
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{ width: '210px' }} key='1'>
                                标签
                            </TableCell>
                            <TableCell style={{ width: '30%' }} key='2'>
                                节点
                            </TableCell>
                            <TableCell style={{ width: '200px' }} key='3'>
                                <TableSortLabel
                                    active={orderBy === 'updatedDate'}
                                    direction={order}
                                    onClick={() => handleRequestSort('updatedDate')}
                                >
                                    最后更新
                                </TableSortLabel>
                            </TableCell>
                            <TableCell style={{ width: '120px' }} key='4'>
                                操作
                            </TableCell>
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
                                {sortedData.filter(filterFunction).map((row, index) => (
                                    <TableRow hover key={index}>
                                        <TableCell key='0'>
                                            <Tooltip title={row.templateName || row.name}>
                                                <Typography
                                                    sx={{
                                                        display: '-webkit-box',
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        textOverflow: 'ellipsis',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <Link
                                                        to={`/${isAgentCanvas ? 'agentcanvas' : 'canvas'}/${row.id}`}
                                                        style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                                                    >
                                                        {row.templateName || row.name}
                                                    </Link>
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell key='1'>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    flexWrap: 'wrap',
                                                    marginTop: 5
                                                }}
                                            >
                                                &nbsp;
                                                {row.category &&
                                                    row.category
                                                        .split(';')
                                                        .map((tag, index) => (
                                                            <Chip key={index} label={tag} style={{ marginRight: 5, marginBottom: 5 }} />
                                                        ))}
                                            </div>
                                        </TableCell>
                                        <TableCell key='2'>
                                            {images[row.id] && (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'start',
                                                        gap: 1
                                                    }}
                                                >
                                                    {images[row.id]
                                                        .slice(0, images[row.id].length > 5 ? 5 : images[row.id].length)
                                                        .map((img) => (
                                                            <Box
                                                                key={img}
                                                                sx={{
                                                                    width: 30,
                                                                    height: 30,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: customization.isDarkMode
                                                                        ? theme.palette.common.white
                                                                        : theme.palette.grey[300] + 75
                                                                }}
                                                            >
                                                                <img
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        padding: 5,
                                                                        objectFit: 'contain'
                                                                    }}
                                                                    alt=''
                                                                    src={img}
                                                                />
                                                            </Box>
                                                        ))}
                                                    {images[row.id].length > 5 && (
                                                        <Typography
                                                            sx={{
                                                                alignItems: 'center',
                                                                display: 'flex',
                                                                fontSize: '.9rem',
                                                                fontWeight: 200
                                                            }}
                                                        >
                                                            + {images[row.id].length - 5} More
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </TableCell>
                                        <TableCell key='3'>{moment(row.updatedDate).format('MMMM Do, YYYY')}</TableCell>
                                        <TableCell key='4'>
                                            <Stack
                                                direction={{ xs: 'column', sm: 'row' }}
                                                spacing={1}
                                                justifyContent='center'
                                                alignItems='center'
                                            >
                                                <FlowListMenu
                                                    isAgentCanvas={isAgentCanvas}
                                                    chatflow={row}
                                                    setError={setError}
                                                    updateFlowsApi={updateFlowsApi}
                                                />
                                            </Stack>
                                        </TableCell>
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

FlowListTable.propTypes = {
    data: PropTypes.array,
    images: PropTypes.object,
    isLoading: PropTypes.bool,
    filterFunction: PropTypes.func,
    updateFlowsApi: PropTypes.object,
    setError: PropTypes.func,
    isAgentCanvas: PropTypes.bool
}
