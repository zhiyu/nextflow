import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// material-ui
import { Button, Box, OutlinedInput, Typography } from '@mui/material'
import { IconX } from '@tabler/icons-react'

// Project import
import { StyledButton } from '@/ui-component/button/StyledButton'
import { SwitchInput } from '@/ui-component/switch/Switch'

// store
import { enqueueSnackbar as enqueueSnackbarAction, closeSnackbar as closeSnackbarAction, SET_CHATFLOW } from '@/store/actions'
import useNotifier from '@/utils/useNotifier'

// API
import chatflowsApi from '@/api/chatflows'

const formTitle = `Hey 👋 thanks for your interest!
Let us know where we can reach you`

const endTitle = `Thank you!
What can I do for you?`

const Leads = ({ dialogProps }) => {
    const dispatch = useDispatch()

    useNotifier()

    const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args))
    const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args))

    const [leadsConfig, setLeadsConfig] = useState({})
    const [chatbotConfig, setChatbotConfig] = useState({})

    const handleChange = (key, value) => {
        setLeadsConfig({
            ...leadsConfig,
            [key]: value
        })
    }

    const onSave = async () => {
        try {
            let value = {
                leads: leadsConfig
            }
            chatbotConfig.leads = value.leads
            const saveResp = await chatflowsApi.updateChatflow(dialogProps.chatflow.id, {
                chatbotConfig: JSON.stringify(chatbotConfig)
            })
            if (saveResp.data) {
                enqueueSnackbar({
                    message: 'Leads configuration Saved',
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: 'success',
                        anchorOrigin: { vertical: 'top', horizontal: 'center' },
                        action: (key) => (
                            <Button style={{ color: 'white', minWidth: 'fit-content' }} onClick={() => closeSnackbar(key)}>
                                <IconX />
                            </Button>
                        )
                    }
                })
                dispatch({ type: SET_CHATFLOW, chatflow: saveResp.data })
            }
        } catch (error) {
            const errorData = error.response.data || `${error.response.status}: ${error.response.statusText}`
            enqueueSnackbar({
                message: `Failed to save Leads configuration: ${errorData}`,
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

    useEffect(() => {
        if (dialogProps.chatflow && dialogProps.chatflow.chatbotConfig) {
            let chatbotConfig = JSON.parse(dialogProps.chatflow.chatbotConfig)
            setChatbotConfig(chatbotConfig || {})
            if (chatbotConfig.leads) {
                setLeadsConfig(chatbotConfig.leads)
            }
        }

        return () => {}
    }, [dialogProps])

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: 'start',
                    gap: 3,
                    mb: 2
                }}
            >
                <SwitchInput label='启用潜在客户捕获' onChange={(value) => handleChange('status', value)} value={leadsConfig.status} />
                {leadsConfig && leadsConfig['status'] && (
                    <>
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                            <Typography>问候语</Typography>
                            <OutlinedInput
                                id='form-title'
                                type='text'
                                fullWidth
                                multiline={true}
                                minRows={4}
                                value={leadsConfig.title}
                                placeholder={formTitle}
                                name='form-title'
                                size='small'
                                onChange={(e) => {
                                    handleChange('title', e.target.value)
                                }}
                            />
                        </Box>
                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                            <Typography>结束语</Typography>
                            <OutlinedInput
                                id='success-message'
                                type='text'
                                fullWidth
                                multiline={true}
                                minRows={4}
                                value={leadsConfig.successMessage}
                                placeholder={endTitle}
                                name='form-title'
                                size='small'
                                onChange={(e) => {
                                    handleChange('successMessage', e.target.value)
                                }}
                            />
                        </Box>
                        <Typography variant='h4'>表单项</Typography>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
                                <SwitchInput label='姓名' onChange={(value) => handleChange('name', value)} value={leadsConfig.name} />
                                <SwitchInput label='邮箱' onChange={(value) => handleChange('email', value)} value={leadsConfig.email} />
                                <SwitchInput label='电话' onChange={(value) => handleChange('phone', value)} value={leadsConfig.phone} />
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
            <StyledButton
                disabled={!leadsConfig['name'] && !leadsConfig['phone'] && !leadsConfig['email'] && leadsConfig['status']}
                style={{ marginBottom: 10, marginTop: 10 }}
                variant='contained'
                size='small'
                onClick={onSave}
            >
                保存
            </StyledButton>
        </>
    )
}

Leads.propTypes = {
    dialogProps: PropTypes.object
}

export default Leads
