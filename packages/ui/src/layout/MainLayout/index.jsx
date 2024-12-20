import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

// material-ui
import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material'

// project imports
import Header from './Header'
import Sidebar from './Sidebar'
import { drawerWidth, headerHeight } from '@/store/constant'
import { SET_MENU } from '@/store/actions'

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        transition: theme.transitions.create('all', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginRight: 0,
        [theme.breakpoints.up('md')]: {
            marginLeft: -drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`
        }
    }),
    ...(open && {
        transition: theme.transitions.create('all', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0,
        marginRight: 0,
        width: `calc(100% - ${drawerWidth}px)`
    })
}))

const HeaderWrapper = styled('HeaderWrapper', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    position: 'fixed',
    width: `calc(100%)`,
    left: drawerWidth,
    ...(!open && {
        transition: theme.transitions.create('all', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        left: '0px'
    }),
    ...(open && {
        transition: theme.transitions.create('all', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        left: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`
    })
}))

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme()
    const matchDownMd = useMediaQuery(theme.breakpoints.down('lg'))

    // Handle left drawer
    const leftDrawerOpened = useSelector((state) => state.customization.opened)
    const dispatch = useDispatch()
    const handleLeftDrawerToggle = () => {
        dispatch({ type: SET_MENU, opened: !leftDrawerOpened })
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
            <Sidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />
            {/* main content */}
            <Main theme={theme} open={leftDrawerOpened} className='relative'>
                <Outlet />
            </Main>
            <HeaderWrapper open={leftDrawerOpened}>
                <Header handleLeftDrawerToggle={handleLeftDrawerToggle} drawerOpen={leftDrawerOpened} />
            </HeaderWrapper>
        </Box>
    )
}

export default MainLayout
