import PropTypes from 'prop-types'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Box, Drawer, useMediaQuery } from '@mui/material'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'
import { BrowserView, MobileView } from 'react-device-detect'

// project imports
import MenuList from './MenuList'
import LogoSection from '../LogoSection'
import { drawerWidth, headerHeight } from '@/store/constant'

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
    const theme = useTheme()
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))

    const drawer = (
        <>
            <Box
                className='fixed pt-1 px-5 z-10'
                sx={{
                    height: headerHeight,
                    width: drawerWidth
                }}
            >
                <LogoSection />
            </Box>
            <Box className='pt-10'>
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
        </>
    )

    const container = window !== undefined ? () => window.document.body : undefined

    return (
        <Box
            component='nav'
            sx={{
                flexShrink: { md: 0 },
                width: matchUpMd ? drawerWidth : 'auto'
            }}
        >
            <Drawer
                container={container}
                variant={matchUpMd ? 'persistent' : 'temporary'}
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
                        borderColor: drawerOpen ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
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
