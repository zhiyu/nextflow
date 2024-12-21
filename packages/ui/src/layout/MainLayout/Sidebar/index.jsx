import PropTypes from 'prop-types'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, Drawer, useMediaQuery } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { Avatar, ButtonBase, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'
import { BrowserView, MobileView } from 'react-device-detect'

import ProfileSection from '../Header/ProfileSection'

// project imports
import MenuList from './MenuList'
import LogoSection from '../LogoSection'
import { drawerWidth, headerHeight } from '@/store/constant'

// assets
import { PiSidebarSimpleDuotone, PiSidebarSimple, PiMoon, PiSun } from 'react-icons/pi'

import { SET_DARKMODE } from '@/store/actions'

const ModeButton = styled(IconButton)(({ theme }) => ({
    width: 32,
    height: 32
}))

const signOutClicked = () => {
    location.href = '/api/v1/user/logout'
}

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const [isDark, setIsDark] = useState(customization.isDarkMode)
    const dispatch = useDispatch()

    const changeDarkMode = () => {
        dispatch({ type: SET_DARKMODE, isDarkMode: !isDark })
        setIsDark((isDark) => !isDark)
        localStorage.setItem('isDarkMode', !isDark)
        localStorage.setItem('theme', isDark ? 'light' : 'dark')
    }

    const drawer = (
        <Box>
            <Box
                className='fixed pt-3 px-5 z-10'
                sx={{
                    height: headerHeight,
                    width: drawerWidth
                }}
            >
                <LogoSection />
            </Box>
            <Box className='pt-14'>
                <BrowserView>
                    <PerfectScrollbar component='div' className='h-full'>
                        <MenuList drawerOpen={drawerOpen} />
                    </PerfectScrollbar>
                </BrowserView>
                <MobileView>
                    <Box sx={{ px: 2 }}>
                        <MenuList />
                    </Box>
                </MobileView>
            </Box>
            <Box
                className='fixed bottom-0 flex items-center justify-between px-4'
                sx={{
                    height: headerHeight,
                    width: drawerWidth - 1,
                    backgroundColor: isDark ? 'transparent' : theme.palette.common.white
                }}
            >
                <ProfileSection handleLogout={signOutClicked} username={localStorage.getItem('username') ?? ''} />
                <Box>
                    {isDark ? (
                        <ModeButton
                            sx={{
                                borderRadius: '8px',
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    background: theme.palette.primary.main,
                                    color: theme.palette.primary.light
                                }
                            }}
                            onClick={changeDarkMode}
                        >
                            <PiSun />
                        </ModeButton>
                    ) : (
                        <ModeButton
                            sx={{
                                borderRadius: '8px',
                                '&:hover': {
                                    background: theme.palette.primary.main,
                                    color: theme.palette.primary.light
                                }
                            }}
                            onClick={changeDarkMode}
                        >
                            <PiMoon />
                        </ModeButton>
                    )}
                </Box>
                <ButtonBase sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                    <Avatar
                        variant='rounded'
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: 'none',
                            color: theme.palette.text.primary,
                            '&:hover': {
                                background: theme.palette.primary.main,
                                color: theme.palette.primary.light
                            }
                        }}
                        onClick={drawerToggle}
                        color='inherit'
                    >
                        {drawerOpen && <PiSidebarSimpleDuotone size='1.2rem' />}
                        {!drawerOpen && <PiSidebarSimple size='1.2rem' />}
                    </Avatar>
                </ButtonBase>
            </Box>
        </Box>
    )

    const container = window !== undefined ? () => window.document.body : undefined

    return (
        <Box
            component='nav'
            sx={{
                flexShrink: { md: 0 },
                width: drawerOpen ? drawerWidth : 'auto'
            }}
            className='z-10 shadow-card'
        >
            <Drawer
                container={container}
                variant={drawerOpen ? 'persistent' : 'temporary'}
                anchor='left'
                open={drawerOpen}
                onClose={drawerToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        // background:'linear-gradient(145deg, rgba(192, 132, 252, 0) 20%, rgb(243 180 252 / 26%) 40%, rgba(204, 171, 238, 0) 60%)',
                        background: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        // [theme.breakpoints.up('md')]: {
                        //     top: `${headerHeight + 1}px`
                        // },
                        borderRight: drawerOpen ? '1px solid' : 'none',
                        borderColor: drawerOpen ? 'rgba(0, 0, 0, 0.06)' : 'transparent',
                        paddingBottom: `${headerHeight + 1}px`
                    }
                }}
                ModalProps={{ keepMounted: true }}
                color='inherit'
            >
                {drawer}
            </Drawer>
        </Box>
    )
}

Sidebar.propTypes = {
    drawerOpen: PropTypes.bool,
    drawerToggle: PropTypes.func,
    window: PropTypes.object
}

export default Sidebar
