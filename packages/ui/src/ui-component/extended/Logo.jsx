import logo from '@/assets/images/flowise_logo.png'
import logoDark from '@/assets/images/flowise_logo_dark.png'
import { useTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'

import { FaSchlix } from 'react-icons/fa'
import { IoLogoXing } from 'react-icons/io5'

// ==============================|| LOGO ||============================== //

const Logo = () => {
    const customization = useSelector((state) => state.customization)
    const theme = useTheme()

    return (
        <div
            style={{
                color: customization.isDarkMode ? '' : theme.palette.secondary.dark,
                fontSize: '1.2em',
                fontWeight: 600,
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <IoLogoXing style={{ width: '32px', height: '32px', color: customization.isDarkMode ? '' : theme.palette.secondary.dark }} />{' '}
            &nbsp;agentune
        </div>
    )
}

export default Logo
