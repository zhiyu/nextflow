import PropTypes from 'prop-types'

import { useState } from 'react'
import { useSelector } from 'react-redux'

// material-ui
import { useTheme } from '@mui/material/styles'
import { Divider, List, Typography, Collapse } from '@mui/material'

// project imports
import NavItem from '../NavItem'
import NavCollapse from '../NavCollapse'

import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
    const theme = useTheme()

    const [open, setOpen] = useState(true)
    const handleClick = () => {
        setOpen(!open)
        // setSelected(!selected ? menu.id : null)
    }

    // menu list collapse & items
    const items = item.children?.map((menu) => {
        switch (menu.type) {
            case 'collapse':
                return <NavCollapse key={menu.id} menu={menu} level={1} />
            case 'item':
                return <NavItem key={menu.id} item={menu} level={1} navType='MENU' />
            default:
                return (
                    <Typography key={menu.id} variant='h6' color='error' align='center'>
                        Menu Items Error
                    </Typography>
                )
        }
    })

    return (
        <>
            <List
                subheader={
                    item.title && (
                        <Typography
                            onClick={handleClick}
                            variant='caption'
                            sx={{ ...theme.typography.menuCaption }}
                            display='block'
                            gutterBottom
                        >
                            <Typography sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {item.title}
                                {open ? (
                                    <IconChevronUp stroke={1.5} size='1rem' style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                                ) : (
                                    <IconChevronDown stroke={1.5} size='1rem' style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                                )}
                            </Typography>

                            {item.caption && (
                                <Typography variant='caption' sx={{ ...theme.typography.subMenuCaption }} display='block' gutterBottom>
                                    {item.caption}
                                </Typography>
                            )}
                        </Typography>
                    )
                }
                sx={{ py: '0px' }}
            >
                <Collapse in={open} timeout='auto' unmountOnExit>
                    {items}
                </Collapse>
            </List>

            {/* group divider */}
            {/* <Divider sx={{ mt: 0.25, mb: 1.25 }} /> */}
        </>
    )
}

NavGroup.propTypes = {
    item: PropTypes.object
}

export default NavGroup
