import { createTheme } from '@mui/material/styles'

// assets
import colors from '@/assets/scss/_themes-vars.module.scss'

// project imports
import componentStyleOverrides from './compStyleOverride'
import themePalette from './palette'
import themeTypography from './typography'

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter object
 */

export const theme = (customization) => {
    const _options = customization.isDarkMode
        ? {
              colors: colors,
              heading: colors.paper,
              paper: colors.darkPrimaryLight,
              backgroundDefault: colors.darkPaper,
              background: colors.darkPrimaryLight,
              darkTextPrimary: colors.paper,
              darkTextSecondary: colors.paper,
              textDark: colors.paper,
              menuSelected: colors.darkSecondaryDark,
              menuSelectedBack: colors.darkSecondaryLight,
              divider: colors.darkPaper,
              customization
          }
        : {
              colors: colors,
              heading: colors.grey900,
              paper: colors.paper,
              backgroundDefault: colors.paper,
              background: colors.primaryLight,
              darkTextPrimary: colors.grey700,
              darkTextSecondary: colors.grey500,
              textDark: colors.grey900,
              menuSelected: colors.primaryMain,
              menuSelectedBack: colors.primaryLight,
              divider: colors.grey200,
              customization
          }

    const options = {
        direction: 'ltr',
        mixins: {
            toolbar: {
                minHeight: '24px',
                height: '54px',
                '@media (min-width: 600px)': {
                    minHeight: '24px'
                }
            }
        },
        palette: themePalette(_options),
        typography: themeTypography(_options),
        components: componentStyleOverrides(_options)
    }

    return createTheme(options)
}

export default theme
