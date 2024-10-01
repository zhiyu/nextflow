import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

// assets
import { PiArrowDown, PiCaretDown, PiCaretDownDuotone } from 'react-icons/pi'

export default function NavBar() {
    const handleChange = (event) => {}

    return (
        <FormControl variant='standard' sx={{ ml: 6, minWidth: 100 }}>
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
                <MenuItem disabled value={0} sx={{ fontSize: 12 }}>
                    <em>切换开发平台</em>
                </MenuItem>
                <MenuItem value={1}>大数据开发</MenuItem>
                <MenuItem value={2}>模型开发</MenuItem>
                <MenuItem value={3}>智能体开发</MenuItem>
            </Select>
        </FormControl>
    )
}
