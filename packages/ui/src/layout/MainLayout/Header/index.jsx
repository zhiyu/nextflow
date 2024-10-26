import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Avatar, Box, ButtonBase, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

// project imports
import LogoSection from '../LogoSection'
import NavBar from './NavBar'
import ProfileSection from './ProfileSection'

// assets
import { PiArrowLineLeftThin, PiArrowLineRightThin, PiMoon, PiSun } from 'react-icons/pi'

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
    }

    const signOutClicked = () => {
        localStorage.removeItem('username')
        localStorage.removeItem('password')
        navigate('/', { replace: true })
        navigate(0)
    }

    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 240,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box
                    component='span'
                    style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}
                    sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}
                >
                    <LogoSection />
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
                        onClick={handleLeftDrawerToggle}
                        color='inherit'
                    >
                        {drawerOpen && <PiArrowLineLeftThin size='1.2rem' />}
                        {!drawerOpen && <PiArrowLineRightThin size='1.2rem' />}
                    </Avatar>
                </ButtonBase>
            </Box>
            <Box>
                {isDark ? (
                    <ModeButton sx={{ color: theme.palette.primary.main }} onClick={changeDarkMode}>
                        <PiSun />
                    </ModeButton>
                ) : (
                    <ModeButton onClick={changeDarkMode}>
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
        </>
    )
}

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func,
    drawerOpen: PropTypes.bool
}

export default Header
