import { useTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'

import { PiInfinity } from 'react-icons/pi'

import nextflow from '@/assets/images/nextflow.svg'
import nextflowDark from '@/assets/images/nextflow_dark.svg'

// ==============================|| LOGO ||============================== //

const Logo = () => {
    const customization = useSelector((state) => state.customization)
    const theme = useTheme()

    return (
        <div className='flex items-center'>
            {/* <PiInfinity size='2em' style={{ color: customization.isDarkMode ? '#ffffff' : '#000000' }} /> */}
            {customization.isDarkMode ? <img src={nextflowDark} className='h-10 mb-1' /> : <img src={nextflow} className='h-10 mb-1' />}
        </div>
    )
}

export default Logo
