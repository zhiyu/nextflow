import { useState } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { styled, alpha } from '@mui/material/styles'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { IconX } from '@tabler/icons-react'

import chatflowsApi from '@/api/chatflows'

import useApi from '@/hooks/useApi'
import useConfirm from '@/hooks/useConfirm'
import { uiBaseURL } from '@/store/constant'
import { closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction } from '@/store/actions'

import SaveChatflowDialog from '@/ui-component/dialog/SaveChatflowDialog'
import TagDialog from '@/ui-component/dialog/TagDialog'
import StarterPromptsDialog from '@/ui-component/dialog/StarterPromptsDialog'

import { generateExportFlowData } from '@/utils/genericHelper'
import useNotifier from '@/utils/useNotifier'
import ChatFeedbackDialog from '../dialog/ChatFeedbackDialog'
import AllowedDomainsDialog from '../dialog/AllowedDomainsDialog'
import SpeechToTextDialog from '../dialog/SpeechToTextDialog'
import ExportAsTemplateDialog from '@/ui-component/dialog/ExportAsTemplateDialog'

import {
    PiChatText,
    PiExport,
    PiUpload,
    PiTrash,
    PiCopy,
    PiNotePencil,
    PiMicrophone,
    PiTag,
    PiTerminalWindow,
    PiBookmarks,
    PiNotepad,
    PiCaretDown
} from 'react-icons/pi'

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 4,
        marginTop: theme.spacing(1),
        minWidth: 140,
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0'
        },
        '& .MuiMenuItem-root': {
            '& svg': {
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1)
            },
            '&:active': {
                backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
            }
        }
    }
}))

export default function FlowListMenu({ chatflow, isAgentCanvas, setError, updateFlowsApi }) {
    const { confirm } = useConfirm()
    const dispatch = useDispatch()
    const updateChatflowApi = useApi(chatflowsApi.updateChatflow)

    useNotifier()
    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [flowDialogOpen, setFlowDialogOpen] = useState(false)
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
    const [categoryDialogProps, setCategoryDialogProps] = useState({})
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [conversationStartersDialogOpen, setConversationStartersDialogOpen] = useState(false)
    const [conversationStartersDialogProps, setConversationStartersDialogProps] = useState({})
    const [chatFeedbackDialogOpen, setChatFeedbackDialogOpen] = useState(false)
    const [chatFeedbackDialogProps, setChatFeedbackDialogProps] = useState({})
    const [allowedDomainsDialogOpen, setAllowedDomainsDialogOpen] = useState(false)
    const [allowedDomainsDialogProps, setAllowedDomainsDialogProps] = useState({})
    const [speechToTextDialogOpen, setSpeechToTextDialogOpen] = useState(false)
    const [speechToTextDialogProps, setSpeechToTextDialogProps] = useState({})

    const [exportTemplateDialogOpen, setExportTemplateDialogOpen] = useState(false)
    const [exportTemplateDialogProps, setExportTemplateDialogProps] = useState({})

    const title = isAgentCanvas ? 'Agents' : 'Chatflow'

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleFlowRename = () => {
        setAnchorEl(null)
        setFlowDialogOpen(true)
    }

    const handleFlowStarterPrompts = () => {
        setAnchorEl(null)
        setConversationStartersDialogProps({
            title: '启动提示词 - ' + chatflow.name,
            chatflow: chatflow
        })
        setConversationStartersDialogOpen(true)
    }

    const handleExportTemplate = () => {
        setAnchorEl(null)
        setExportTemplateDialogProps({
            chatflow: chatflow
        })
        setExportTemplateDialogOpen(true)
    }

    const handleFlowChatFeedback = () => {
        setAnchorEl(null)
        setChatFeedbackDialogProps({
            title: 'Chat Feedback - ' + chatflow.name,
            chatflow: chatflow
        })
        setChatFeedbackDialogOpen(true)
    }

    const handleAllowedDomains = () => {
        setAnchorEl(null)
        setAllowedDomainsDialogProps({
            title: 'Allowed Domains - ' + chatflow.name,
            chatflow: chatflow
        })
        setAllowedDomainsDialogOpen(true)
    }

    const handleSpeechToText = () => {
        setAnchorEl(null)
        setSpeechToTextDialogProps({
            title: 'Speech To Text - ' + chatflow.name,
            chatflow: chatflow
        })
        setSpeechToTextDialogOpen(true)
    }

    const saveFlowRename = async (chatflowName) => {
        const updateBody = {
            name: chatflowName,
            chatflow
        }
        try {
            await updateChatflowApi.request(chatflow.id, updateBody)
            await updateFlowsApi.request()
        } catch (error) {
            if (setError) setError(error)
            enqueueSnackbar({
                message: typeof error.response.data === 'object' ? error.response.data.message : error.response.data,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    action: (key) => (
                        <Button style={{ color: 'white', minWidth: 'fit-content' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
        }
    }

    const handleFlowCategory = () => {
        setAnchorEl(null)
        if (chatflow.category) {
            setCategoryDialogProps({
                category: chatflow.category.split(';')
            })
        }
        setCategoryDialogOpen(true)
    }

    const saveFlowCategory = async (categories) => {
        setCategoryDialogOpen(false)
        // save categories as string
        const categoryTags = categories.join(';')
        const updateBody = {
            category: categoryTags,
            chatflow
        }
        try {
            await updateChatflowApi.request(chatflow.id, updateBody)
            await updateFlowsApi.request()
        } catch (error) {
            if (setError) setError(error)
            enqueueSnackbar({
                message: typeof error.response.data === 'object' ? error.response.data.message : error.response.data,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'error',
                    persist: true,
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    action: (key) => (
                        <Button style={{ color: 'white', minWidth: 'fit-content' }} onClick={() => closeSnackbar(key)}>
                            <IconX />
                        </Button>
                    )
                }
            })
        }
    }

    const handleDelete = async () => {
        setAnchorEl(null)
        const confirmPayload = {
            title: `Delete`,
            description: `Delete ${title} ${chatflow.name}?`,
            confirmButtonName: 'Delete',
            cancelButtonName: 'Cancel'
        }
        const isConfirmed = await confirm(confirmPayload)

        if (isConfirmed) {
            try {
                await chatflowsApi.deleteChatflow(chatflow.id)
                await updateFlowsApi.request()
            } catch (error) {
                if (setError) setError(error)
                enqueueSnackbar({
                    message: typeof error.response.data === 'object' ? error.response.data.message : error.response.data,
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'error',
                        persist: true,
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        action: (key) => (
                            <Button style={{ color: 'white', minWidth: 'fit-content' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
            }
        }
    }

    const handleDuplicate = () => {
        setAnchorEl(null)
        try {
            localStorage.setItem('duplicatedFlowData', chatflow.flowData)
            window.open(`${uiBaseURL}/${isAgentCanvas ? 'agentcanvas' : 'canvas'}`, '_blank')
        } catch (e) {
            console.error(e)
        }
    }

    const handleExport = () => {
        setAnchorEl(null)
        try {
            const flowData = JSON.parse(chatflow.flowData)
            let dataStr = JSON.stringify(generateExportFlowData(flowData), null, 2)
            //let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
            const blob = new Blob([dataStr], { type: 'application/json' })
            const dataUri = URL.createObjectURL(blob)

            let exportFileDefaultName = `${chatflow.name} ${title}.json`

            let linkElement = document.createElement('a')
            linkElement.setAttribute('href', dataUri)
            linkElement.setAttribute('download', exportFileDefaultName)
            linkElement.click()
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div>
            <Button
                id='demo-customized-button'
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                disableElevation
                onClick={handleClick}
                endIcon={<PiCaretDown size={'1rem'} />}
            >
                请选择
            </Button>
            <StyledMenu
                id='demo-customized-menu'
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button'
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleFlowRename} disableRipple>
                    <PiNotePencil size='1.2rem' />
                    重命名
                </MenuItem>
                <MenuItem onClick={handleDuplicate} disableRipple>
                    <PiCopy size='1.2rem' />
                    复制
                </MenuItem>
                <MenuItem onClick={handleExport} disableRipple>
                    <PiExport size='1.2rem' />
                    导出
                </MenuItem>
                <MenuItem onClick={handleExportTemplate} disableRipple>
                    <PiBookmarks size='1.2rem' />
                    存为模版
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleFlowStarterPrompts} disableRipple>
                    <PiTerminalWindow size='1.2rem' />
                    启动提示词
                </MenuItem>
                <MenuItem onClick={handleFlowChatFeedback} disableRipple>
                    <PiChatText size='1.2rem' />
                    聊天反馈
                </MenuItem>
                <MenuItem onClick={handleAllowedDomains} disableRipple>
                    <PiNotepad size='1.2rem' />
                    授权的域名
                </MenuItem>
                <MenuItem onClick={handleSpeechToText} disableRipple>
                    <PiMicrophone size='1.2rem' />
                    语音转文字
                </MenuItem>
                <MenuItem onClick={handleFlowCategory} disableRipple>
                    <PiTag size='1.2rem' />
                    更新标签
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleDelete} disableRipple>
                    <PiTrash />
                    删除
                </MenuItem>
            </StyledMenu>
            <SaveChatflowDialog
                show={flowDialogOpen}
                dialogProps={{
                    title: `Rename ${title}`,
                    confirmButtonName: 'Rename',
                    cancelButtonName: 'Cancel'
                }}
                onCancel={() => setFlowDialogOpen(false)}
                onConfirm={saveFlowRename}
            />
            <TagDialog
                isOpen={categoryDialogOpen}
                dialogProps={categoryDialogProps}
                onClose={() => setCategoryDialogOpen(false)}
                onSubmit={saveFlowCategory}
            />
            <StarterPromptsDialog
                show={conversationStartersDialogOpen}
                dialogProps={conversationStartersDialogProps}
                onCancel={() => setConversationStartersDialogOpen(false)}
            />
            <ChatFeedbackDialog
                show={chatFeedbackDialogOpen}
                dialogProps={chatFeedbackDialogProps}
                onCancel={() => setChatFeedbackDialogOpen(false)}
            />
            <AllowedDomainsDialog
                show={allowedDomainsDialogOpen}
                dialogProps={allowedDomainsDialogProps}
                onCancel={() => setAllowedDomainsDialogOpen(false)}
            />
            <SpeechToTextDialog
                show={speechToTextDialogOpen}
                dialogProps={speechToTextDialogProps}
                onCancel={() => setSpeechToTextDialogOpen(false)}
            />
            {exportTemplateDialogOpen && (
                <ExportAsTemplateDialog
                    show={exportTemplateDialogOpen}
                    dialogProps={exportTemplateDialogProps}
                    onCancel={() => setExportTemplateDialogOpen(false)}
                />
            )}
        </div>
    )
}

FlowListMenu.propTypes = {
    chatflow: PropTypes.object,
    isAgentCanvas: PropTypes.bool,
    setError: PropTypes.func,
    updateFlowsApi: PropTypes.object
}
