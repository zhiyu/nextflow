// material-ui
import { Typography } from '@mui/material'

// project imports
import NavGroup from './NavGroup'
import menuItems from '@/menu-items'

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = ({ drawerOpen }) => {
    const navItems = menuItems.items.map((item) => {
        return <NavGroup key={item.id} item={item} />
    })

    return <>{navItems}</>
}

export default MenuList
