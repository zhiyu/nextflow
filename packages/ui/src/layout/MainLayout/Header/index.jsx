import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { drawerWidth } from '@/store/constant'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Avatar, Box, ButtonBase, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

// project imports
import LogoSection from '../LogoSection'
import NavBar from './NavBar'
import ProfileSection from './ProfileSection'

// assets
import { PiSidebarSimpleDuotone, PiSidebarSimple, PiMoon, PiSun } from 'react-icons/pi'

// store
import { SET_DARKMODE } from '@/store/actions'
import { color } from '@uiw/react-codemirror'

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const ModeButton = styled(IconButton)(({ theme }) => ({
    width: 32,
    height: 32
}))

const Header = ({ handleLeftDrawerToggle, drawerOpen }) => {
    const theme = useTheme()
    const navigate = useNavigate()

    const customization = useSelector((state) => state.customization)

    const [isDark, setIsDark] = useState(customization.isDarkMode)
    const dispatch = useDispatch()

    const changeDarkMode = () => {
        dispatch({ type: SET_DARKMODE, isDarkMode: !isDark })
        setIsDark((isDark) => !isDark)
        localStorage.setItem('isDarkMode', !isDark)
        localStorage.setItem('theme', isDark ? 'light' : 'dark')
    }

    const signOutClicked = () => {
        location.href = '/api/v1/user/logout'
    }

    return (
        <Box
            sx={{
                backgroundColor: customization.isDarkMode ? 'transparent' : theme.palette.common.white,
                borderBottom: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.06)'
            }}
            className='flex items-center p-2 px-4'
        >
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
                    onClick={handleLeftDrawerToggle}
                    color='inherit'
                >
                    {drawerOpen && <PiSidebarSimpleDuotone size='1.2rem' />}
                    {!drawerOpen && <PiSidebarSimple size='1.2rem' />}
                </Avatar>
            </ButtonBase>
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
            <Box sx={{ ml: 6 }}>
                <NavBar />
            </Box>
            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ ml: 4 }}>
                <Typography>{localStorage.getItem('username') ?? ''}</Typography>
            </Box>
            <Box sx={{ ml: 2 }}></Box>
            <ProfileSection handleLogout={signOutClicked} username={localStorage.getItem('username') ?? ''} />
        </Box>
    )
}

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func,
    drawerOpen: PropTypes.bool
}

export default Header
