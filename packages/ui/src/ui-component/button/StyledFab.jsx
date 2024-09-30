import { styled } from '@mui/material/styles'
import { Fab } from '@mui/material'

export const StyledFab = styled(Fab)(({ theme, color = 'primary' }) => ({
    color: theme.palette.grey[700],
    backgroundColor: 'transparent',
    '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: 'transparent'
    }
}))
