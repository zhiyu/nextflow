import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Typography,
    Box,
    MenuList,
    Paper,
    Popper,
    ClickAwayListener
} from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import Transitions from '@/ui-component/extended/Transitions'
import settings from '@/menu-items/settings'
import agentsettings from '@/menu-items/agentsettings'

// ==============================|| SETTINGS ||============================== //

const Settings = ({ chatflow, isSettingsOpen, anchorEl, isAgentCanvas, onSettingsItemClick, onUploadFile, onClose }) => {
    const theme = useTheme()
    const [settingsMenu, setSettingsMenu] = useState([])
    const customization = useSelector((state) => state.customization)
    const inputFile = useRef(null)
    const [open, setOpen] = useState(false)

    const handleFileUpload = (e) => {
        if (!e.target.files) return

        const file = e.target.files[0]

        const reader = new FileReader()
        reader.onload = (evt) => {
            if (!evt?.target?.result) {
                return
            }
            const { result } = evt.target
            onUploadFile(result)
        }
        reader.readAsText(file)
    }

    useEffect(() => {
        if (chatflow && !chatflow.id) {
            const menus = isAgentCanvas ? agentsettings : settings
            const settingsMenu = menus.children.filter((menu) => menu.id === 'loadChatflow')
            setSettingsMenu(settingsMenu)
        } else if (chatflow && chatflow.id) {
            const menus = isAgentCanvas ? agentsettings : settings
            const settingsMenu = menus.children
            setSettingsMenu(settingsMenu)
        }
    }, [chatflow, isAgentCanvas])

    useEffect(() => {
        setOpen(isSettingsOpen)
    }, [isSettingsOpen])

    // settings list items
    const items = settingsMenu.map((menu) => {
        const Icon = menu.icon
        const itemIcon = menu?.icon ? (
            <Icon size='1rem' />
        ) : (
            <FiberManualRecordIcon
                sx={{
                    width: customization.isOpen.findIndex((id) => id === menu?.id) > -1 ? 8 : 6,
                    height: customization.isOpen.findIndex((id) => id === menu?.id) > -1 ? 8 : 6
                }}
                fontSize={'inherit'}
            />
        )
        return (
            <MenuItem
                key={menu.id}
                disableRipple
                onClick={() => {
                    if (menu.id === 'loadChatflow' && inputFile) {
                        inputFile?.current.click()
                    } else {
                        onSettingsItemClick(menu.id)
                    }
                }}
            >
                <ListItemIcon sx={{ minWidth: '0px !important' }} className='mr-2'>
                    {itemIcon}
                </ListItemIcon>
                <Typography color='inherit'>{menu.title}</Typography>
            </MenuItem>
        )
    })

    return (
        <>
            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorEl}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 10]
                            }
                        }
                    ]
                }}
                sx={{ zIndex: 1000 }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={onClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                        <Box sx={{ p: 0 }}>
                                            <MenuList>{items}</MenuList>
                                        </Box>
                                    </PerfectScrollbar>
                                    <input
                                        type='file'
                                        hidden
                                        accept='.json'
                                        ref={inputFile}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileUpload(e)}
                                    />
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    )
}

Settings.propTypes = {
    chatflow: PropTypes.object,
    isSettingsOpen: PropTypes.bool,
    anchorEl: PropTypes.any,
    onSettingsItemClick: PropTypes.func,
    onUploadFile: PropTypes.func,
    onClose: PropTypes.func,
    isAgentCanvas: PropTypes.bool
}

export default Settings
