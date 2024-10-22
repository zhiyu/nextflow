import { styled } from '@mui/material/styles'
import { Fab } from '@mui/material'

export const StyledFab = styled(Fab)(({ theme, color = 'primary' }) => ({
    color: theme.palette.grey[100],
    backgroundColor: theme.palette.primary.dark,
    '&:hover': {
        color: theme.palette.grey[100],
        backgroundColor: theme.palette.secondary.main
    }
}))
