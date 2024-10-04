import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

// assets
import { PiArrowDown, PiCaretDown, PiCaretDownDuotone } from 'react-icons/pi'

export default function NavBar() {
    const handleChange = (event) => {}

    return (
        <FormControl variant='standard' sx={{ minWidth: 100 }}>
            <Select
                displayEmpty={true}
                value={0}
                sx={{
                    '&:before': {
                        display: 'none'
                    }
                }}
                IconComponent={PiCaretDownDuotone}
                onChange={handleChange}
            >
                <MenuItem disabled value={0} sx={{ fontSize: 12, display: 'none' }}>
                    <em>切换平台</em>
                </MenuItem>
                <MenuItem value={1}>算力平台</MenuItem>
                <MenuItem value={1}>大数据开发平台</MenuItem>
                <MenuItem value={2}>大模型开发平台</MenuItem>
                <MenuItem value={3}>智能体开发平台</MenuItem>
            </Select>
        </FormControl>
    )
}
