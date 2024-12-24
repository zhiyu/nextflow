import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import { tableCellClasses } from '@mui/material/TableCell'
import {
    Button,
    Link,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme
} from '@mui/material'

export const ToolsTable = ({ data, isLoading, onSelect }) => {
    const theme = useTheme()
    return (
        <>
            <TableContainer component={Paper} className='py-4'>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '200px' }}>名称</TableCell>
                            <TableCell>描述</TableCell>
                            <TableCell>&nbsp;</TableCell>
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
                                </TableRow>
                            </>
                        ) : (
                            <>
                                {data?.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>
                                            {row.iconSrc ? (
                                                <>
                                                    <div
                                                        style={{
                                                            width: 35,
                                                            height: 35,
                                                            display: 'flex',
                                                            flexShrink: 0,
                                                            marginRight: 10,
                                                            borderRadius: '50%',
                                                            backgroundImage: `url(${row.iconSrc})`,
                                                            backgroundSize: 'contain',
                                                            backgroundRepeat: 'no-repeat',
                                                            backgroundPosition: 'center center'
                                                        }}
                                                    ></div>
                                                </>
                                            ) : (
                                                <></>
                                            )}

                                            <Typography
                                                sx={{
                                                    display: '-webkit-box',
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden',
                                                    color: theme.palette.primary.main
                                                }}
                                            >
                                                <Link
                                                    onClick={() => onSelect(row)}
                                                    sx={{ textAlign: 'left' }}
                                                    style={{ cursor: 'pointer', textDecoration: 'none' }}
                                                >
                                                    {row.templateName || row.name}
                                                </Link>
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>
                                                {row.description || ''}
                                            </Typography>
                                        </TableCell>
                                        <TableCell key='3'></TableCell>
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

ToolsTable.propTypes = {
    data: PropTypes.array,
    isLoading: PropTypes.bool,
    onSelect: PropTypes.func
}
