import PropTypes from 'prop-types'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Box, Dialog, DialogContent, DialogTitle, Tabs, Tab } from '@mui/material'
import { tabsClasses } from '@mui/material/Tabs'
import SpeechToText from '@/ui-component/extended/SpeechToText'
import Security from '@/ui-component/extended/Security'
import ChatFeedback from '@/ui-component/extended/ChatFeedback'
import AnalyseFlow from '@/ui-component/extended/AnalyseFlow'
import StarterPrompts from '@/ui-component/extended/StarterPrompts'
import Leads from '@/ui-component/extended/Leads'
import FollowUpPrompts from '@/ui-component/extended/FollowUpPrompts'
import FileUpload from '@/ui-component/extended/FileUpload'

const CHATFLOW_CONFIGURATION_TABS = [
    {
        label: '安全',
        id: 'security'
    },
    {
        label: '启动提示词',
        id: 'conversationStarters'
    },
    {
        label: 'Follow-up Prompts',
        id: 'followUpPrompts'
    },
    {
        label: '语音转文本',
        id: 'speechToText'
    },
    {
        label: '聊天反馈',
        id: 'chatFeedback'
    },
    {
        label: '数据分析',
        id: 'analyseChatflow'
    },
    {
        label: '潜在客户',
        id: 'leads'
    },
    {
        label: '文件上传',
        id: 'fileUpload'
    }
]

function TabPanel(props) {
    const { children, value, index, ...other } = props
    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`chatflow-config-tabpanel-${index}`}
            aria-labelledby={`chatflow-config-tab-${index}`}
            style={{ width: '100%', paddingTop: '1rem' }}
            {...other}
        >
            {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
}

function a11yProps(index) {
    return {
        id: `chatflow-config-tab-${index}`,
        'aria-controls': `chatflow-config-tabpanel-${index}`
    }
}

const ChatflowConfigurationDialog = ({ show, dialogProps, onCancel }) => {
    const portalElement = document.getElementById('portal')
    const [tabValue, setTabValue] = useState(0)

    const component = show ? (
        <Dialog
            onClose={onCancel}
            open={show}
            fullWidth
            maxWidth={'lg'}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1.25rem' }} id='alert-dialog-title'>
                {dialogProps.title}
            </DialogTitle>
            <DialogContent>
                <Tabs
                    sx={{
                        position: 'relative',
                        minHeight: '40px',
                        height: '40px',
                        [`& .${tabsClasses.scrollButtons}`]: {
                            '&.Mui-disabled': { opacity: 0.3 }
                        }
                    }}
                    value={tabValue}
                    onChange={(event, value) => setTabValue(value)}
                    aria-label='tabs'
                    variant='scrollable'
                    scrollButtons='auto'
                >
                    {CHATFLOW_CONFIGURATION_TABS.map((item, index) => (
                        <Tab
                            sx={{ minHeight: '40px', height: '40px', textAlign: 'left', display: 'flex', mb: 1 }}
                            key={index}
                            label={item.label}
                            {...a11yProps(index)}
                        ></Tab>
                    ))}
                </Tabs>
                {CHATFLOW_CONFIGURATION_TABS.map((item, index) => (
                    <TabPanel key={index} value={tabValue} index={index}>
                        {item.id === 'security' && <Security dialogProps={dialogProps} />}
                        {item.id === 'conversationStarters' ? <StarterPrompts dialogProps={dialogProps} /> : null}
                        {item.id === 'followUpPrompts' ? <FollowUpPrompts dialogProps={dialogProps} /> : null}
                        {item.id === 'speechToText' ? <SpeechToText dialogProps={dialogProps} /> : null}
                        {item.id === 'chatFeedback' ? <ChatFeedback dialogProps={dialogProps} /> : null}
                        {item.id === 'analyseChatflow' ? <AnalyseFlow dialogProps={dialogProps} /> : null}
                        {item.id === 'leads' ? <Leads dialogProps={dialogProps} /> : null}
                        {item.id === 'fileUpload' ? <FileUpload dialogProps={dialogProps} /> : null}
                    </TabPanel>
                ))}
            </DialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

ChatflowConfigurationDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func
}

export default ChatflowConfigurationDialog
