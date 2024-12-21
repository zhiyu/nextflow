import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

// material-ui
import { styled } from '@mui/material/styles'
import { Box, Grid, Typography, useTheme } from '@mui/material'

// project imports
import MainCard from '@/ui-component/cards/MainCard'

const CardWrapper = styled(MainCard)(({ theme }) => ({
    background: theme.palette.card.main,
    color: theme.darkTextPrimary,
    overflow: 'auto',
    position: 'relative',
    border: 'none !important',
    cursor: 'pointer',
    minHeight: '120px',
    maxHeight: '300px',
    width: '100%',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-line'
}))

const ItemCard = ({ data, images, onClick }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    return (
        <CardWrapper
            content={false}
            className='rounded shadow-card transition ease-in-out hover:-translate-y-1 hover:shadow-lg duration-300'
            onClick={onClick}
        >
            <Box className='p-4' sx={{ height: '100%' }}>
                <Box sx={{ height: '100%' }} className='flex flex-col justify-between'>
                    <Box>
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                overflow: 'hidden'
                            }}
                        >
                            {data.iconSrc && (
                                <div
                                    style={{
                                        width: 35,
                                        height: 35,
                                        display: 'flex',
                                        flexShrink: 0,
                                        marginRight: 10,
                                        borderRadius: '50%',
                                        backgroundImage: `url(${data.iconSrc})`,
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center center'
                                    }}
                                ></div>
                            )}
                            {!data.iconSrc && data.color && (
                                <div
                                    style={{
                                        width: 35,
                                        height: 35,
                                        display: 'flex',
                                        flexShrink: 0,
                                        marginRight: 10,
                                        borderRadius: '50%',
                                        background: data.color
                                    }}
                                ></div>
                            )}
                            <Typography
                                sx={{
                                    display: '-webkit-box',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    color: theme.palette.primary.main
                                }}
                            >
                                {data.templateName || data.name}
                            </Typography>
                        </div>
                        {data.description && (
                            <div
                                style={{
                                    display: '-webkit-box',
                                    overflowWrap: 'break-word',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden'
                                }}
                                className='mt-4'
                            >
                                {data.description}
                            </div>
                        )}
                    </Box>
                    {images && (
                        <Box className='flex items-center jusitify-start gap-2 mt-8'>
                            {images.slice(0, images.length > 3 ? 3 : images.length).map((img) => (
                                <Box
                                    key={img}
                                    sx={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: `${customization.borderRadius}px`,
                                        backgroundColor: customization.isDarkMode
                                            ? theme.palette.common.white
                                            : theme.palette.grey[300] + 75
                                    }}
                                >
                                    <img style={{ width: '100%', height: '100%', padding: 5, objectFit: 'contain' }} alt='' src={img} />
                                </Box>
                            ))}
                            {images.length > 3 && (
                                <Typography sx={{ alignItems: 'center', display: 'flex', fontSize: '.9rem', fontWeight: 200 }}>
                                    + {images.length - 3} 更多
                                </Typography>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </CardWrapper>
    )
}

ItemCard.propTypes = {
    data: PropTypes.object,
    images: PropTypes.array,
    onClick: PropTypes.func
}

export default ItemCard
