import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Box, CssBaseline, Avatar, ButtonBase, Toolbar, useMediaQuery } from '@mui/material'

// project imports
import Sidebar from './Sidebar'
import { SET_MENU } from '@/store/actions'

// assets
import { PiSidebarSimpleDuotone, PiSidebarSimple, PiMoon, PiSun } from 'react-icons/pi'

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        transition: theme.transitions.create('all', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    }),
    ...(open && {
        transition: theme.transitions.create('all', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}))

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme()
    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'))

    // Handle left drawer
    const drawerOpen = useSelector((state) => state.customization.opened)
    const dispatch = useDispatch()
    const handleLeftDrawerToggle = () => {
        dispatch({ type: SET_MENU, opened: !drawerOpen })
    }

    useEffect(() => {
        setTimeout(() => dispatch({ type: SET_MENU, opened: !matchDownMd }), 0)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownMd])

    return (
        <Box
            sx={
                {
                    // background:'linear-gradient(100deg, rgba(192, 132, 252, 0) 20.79%, rgb(241 170 252 / 26%) 40.92%, rgba(204, 171, 238, 0) 70.35%)'
                }
            }
            className='flex relative'
        >
            <CssBaseline />
            {/* drawer */}
            <Sidebar drawerOpen={drawerOpen} drawerToggle={handleLeftDrawerToggle} />
            {/* main content */}
            <Main theme={theme} open={drawerOpen} className='relative'>
                <Outlet />
                {!drawerOpen && (
                    <ButtonBase sx={{ borderRadius: '8px', overflow: 'hidden' }} className='fixed bottom-2 left-4'>
                        <Avatar
                            variant='rounded'
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.primary.light,
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    background: theme.palette.primary.main,
                                    color: theme.palette.primary.light
                                }
                            }}
                            onClick={handleLeftDrawerToggle}
                            color='inherit'
                        >
                            {drawerOpen && <PiSidebarSimpleDuotone size='1.2rem' />}
                            {!drawerOpen && <PiSidebarSimple size='1.2rem' />}
                        </Avatar>
                    </ButtonBase>
                )}
            </Main>
        </Box>
    )
}

export default MainLayout
