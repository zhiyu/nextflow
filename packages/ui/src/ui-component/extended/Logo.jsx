import { useTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'

import { PiInfinity } from 'react-icons/pi'

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
            <PiInfinity size='2rem' style={{ color: customization.isDarkMode ? '' : theme.palette.primary.main }} />
            &nbsp;&nbsp;FlowiseNext
        </div>
    )
}

export default Logo
