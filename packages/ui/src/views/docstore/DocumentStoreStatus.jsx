import { useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

const DocumentStoreStatus = ({ status, isTableView }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)

    const getColor = (status) => {
        switch (status) {
            case 'STALE':
                return customization.isDarkMode
                    ? [theme.palette.grey[400], theme.palette.grey[600], theme.palette.grey[700]]
                    : [theme.palette.grey[300], theme.palette.grey[500], theme.palette.grey[700]]
            case 'EMPTY':
                return ['#aaaaaa', '#aaaaaa', '#aaaaaa']
            case 'SYNCING':
            case 'UPSERTING':
                return ['#fff8e1', '#ffe57f', '#ffc107']
            case 'SYNC':
            case 'UPSERTED':
                return ['#cdf5d8', '#00e676', '#00c853']
            case 'NEW':
                return ['#e3f2fd', '#2196f3', '#1e88e5']
            default:
                return customization.isDarkMode
                    ? [theme.palette.grey[300], theme.palette.grey[500], theme.palette.grey[700]]
                    : [theme.palette.grey[300], theme.palette.grey[500], theme.palette.grey[700]]
        }
    }

    return (
        <>
            {!isTableView && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignContent: 'center',
                        alignItems: 'center',
                        paddingTop: '3px',
                        paddingBottom: '3px',
                        paddingLeft: '0px',
                        paddingRight: '0px'
                    }}
                >
                    <div
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: status === 'EMPTY' ? 'transparent' : getColor(status)[1],
                            border: status === 'EMPTY' ? '3px solid' : 'none',
                            borderColor: status === 'EMPTY' ? getColor(status)[1] : 'transparent'
                        }}
                    />
                    <span style={{ fontSize: '0.7rem', color: getColor(status)[2], marginLeft: 5 }}>{status}</span>
                </div>
            )}
            {isTableView && (
                <div
                    style={{
                        display: 'flex',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: status === 'EMPTY' ? 'transparent' : getColor(status)[1],
                        border: status === 'EMPTY' ? '3px solid' : 'none',
                        borderColor: status === 'EMPTY' ? getColor(status)[1] : 'transparent'
                    }}
                    title={status}
                ></div>
            )}
        </>
    )
}

DocumentStoreStatus.propTypes = {
    status: PropTypes.string,
    isTableView: PropTypes.bool
}

export default DocumentStoreStatus
