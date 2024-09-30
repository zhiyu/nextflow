import { useTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'

import { PiInfinityDuotone } from 'react-icons/pi'

// ==============================|| LOGO ||============================== //

const Logo = () => {
    const customization = useSelector((state) => state.customization)
    const theme = useTheme()

    return (
        <div
            style={{
                color: customization.isDarkMode ? '' : theme.palette.primary.main,
                fontSize: '1rem',
                fontWeight: 600,
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <PiInfinityDuotone
                style={{ width: '36px', height: '36px', color: customization.isDarkMode ? '' : theme.palette.primary.main }}
            />
            &nbsp;&nbsp;agentake
        </div>
    )
}

export default Logo
