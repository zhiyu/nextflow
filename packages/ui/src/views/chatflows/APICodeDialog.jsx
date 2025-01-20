import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import {
    Tabs,
    Tab,
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Stack,
    Card
} from '@mui/material'
import { CopyBlock, atomOneDark } from 'react-code-blocks'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTheme } from '@mui/material/styles'

// Project import
import { Dropdown } from '@/ui-component/dropdown/Dropdown'
import ShareChatbot from './ShareChatbot'
import EmbedChat from './EmbedChat'

// Const
import { baseURL } from '@/store/constant'
import { SET_CHATFLOW } from '@/store/actions'

// Images
import pythonSVG from '@/assets/images/python.svg'
import javascriptSVG from '@/assets/images/javascript.svg'
import cURLSVG from '@/assets/images/cURL.svg'
import EmbedSVG from '@/assets/images/embed.svg'
import ShareChatbotSVG from '@/assets/images/sharing.png'
import settingsSVG from '@/assets/images/settings.svg'
import { IconBulb, IconBox, IconVariable, IconExclamationCircle } from '@tabler/icons-react'

// API
import apiKeyApi from '@/api/apikey'
import chatflowsApi from '@/api/chatflows'
import configApi from '@/api/config'
import variablesApi from '@/api/variables'

// Hooks
import useApi from '@/hooks/useApi'
import { CheckboxInput } from '@/ui-component/checkbox/Checkbox'
import { TableViewOnly } from '@/ui-component/table/Table'

// Helpers
import { unshiftFiles, getConfigExamplesForJS, getConfigExamplesForPython, getConfigExamplesForCurl } from '@/utils/genericHelper'

function TabPanel(props) {
    const { children, value, index, ...other } = props
    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`attachment-tabpanel-${index}`}
            aria-labelledby={`attachment-tab-${index}`}
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
        id: `attachment-tab-${index}`,
        'aria-controls': `attachment-tabpanel-${index}`
    }
}

const APICodeDialog = ({ show, dialogProps, onCancel }) => {
    const portalElement = document.getElementById('portal')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const theme = useTheme()
    const chatflow = useSelector((state) => state.canvas.chatflow)
    const apiConfig = chatflow?.apiConfig ? JSON.parse(chatflow.apiConfig) : {}
    const overrideConfigStatus = apiConfig?.overrideConfig?.status !== undefined ? apiConfig.overrideConfig.status : false

    const codes = ['嵌入网页', 'Python', 'JavaScript', 'cURL', '分享链接']
    const [value, setValue] = useState(0)
    const [keyOptions, setKeyOptions] = useState([])
    const [apiKeys, setAPIKeys] = useState([])
    const [chatflowApiKeyId, setChatflowApiKeyId] = useState('')
    const [selectedApiKey, setSelectedApiKey] = useState({})
    const [checkboxVal, setCheckbox] = useState(false)
    const [nodeConfig, setNodeConfig] = useState({})
    const [nodeConfigExpanded, setNodeConfigExpanded] = useState({})
    const [nodeOverrides, setNodeOverrides] = useState(apiConfig?.overrideConfig?.nodes ?? null)
    const [variableOverrides, setVariableOverrides] = useState(apiConfig?.overrideConfig?.variables ?? [])

    const getAllAPIKeysApi = useApi(apiKeyApi.getAllAPIKeys)
    const updateChatflowApi = useApi(chatflowsApi.updateChatflow)
    const getIsChatflowStreamingApi = useApi(chatflowsApi.getIsChatflowStreaming)
    const getConfigApi = useApi(configApi.getConfig)
    const getAllVariablesApi = useApi(variablesApi.getAllVariables)

    const onCheckBoxChanged = (newVal) => {
        setCheckbox(newVal)
        if (newVal) {
            getConfigApi.request(dialogProps.chatflowid)
            getAllVariablesApi.request()
        }
    }

    const onApiKeySelected = (keyValue) => {
        if (keyValue === 'addnewkey') {
            navigate('/apikey')
            return
        }
        setChatflowApiKeyId(keyValue)
        setSelectedApiKey(apiKeys.find((key) => key.id === keyValue))
        const updateBody = {
            apikeyid: keyValue
        }
        updateChatflowApi.request(dialogProps.chatflowid, updateBody)
    }

    const groupByNodeLabel = (nodes) => {
        const result = {}
        const newNodeOverrides = {}
        const seenNodes = new Set()

        nodes.forEach((item) => {
            const { node, nodeId, label, name, type } = item
            seenNodes.add(node)

            if (!result[node]) {
                result[node] = {
                    nodeIds: [],
                    params: []
                }
            }

            if (!newNodeOverrides[node]) {
                // If overrideConfigStatus is true, copy existing config for this node
                newNodeOverrides[node] = overrideConfigStatus ? [...(nodeOverrides[node] || [])] : []
            }

            if (!result[node].nodeIds.includes(nodeId)) result[node].nodeIds.push(nodeId)

            const param = { label, name, type }

            if (!result[node].params.some((existingParam) => JSON.stringify(existingParam) === JSON.stringify(param))) {
                result[node].params.push(param)
                const paramExists = newNodeOverrides[node].some(
                    (existingParam) => existingParam.label === label && existingParam.name === name && existingParam.type === type
                )
                if (!paramExists) {
                    newNodeOverrides[node].push({ ...param, enabled: false })
                }
            }
        })

        // Sort the nodeIds array
        for (const node in result) {
            result[node].nodeIds.sort()
        }
        setNodeConfig(result)

        if (!overrideConfigStatus) {
            setNodeOverrides(newNodeOverrides)
        } else {
            const updatedNodeOverrides = { ...nodeOverrides }

            Object.keys(updatedNodeOverrides).forEach((node) => {
                if (!seenNodes.has(node)) {
                    delete updatedNodeOverrides[node]
                }
            })

            seenNodes.forEach((node) => {
                if (!updatedNodeOverrides[node]) {
                    updatedNodeOverrides[node] = newNodeOverrides[node]
                }
            })

            setNodeOverrides(updatedNodeOverrides)
        }
    }

    const groupByVariableLabel = (variables) => {
        const newVariables = []
        const seenVariables = new Set()

        variables.forEach((item) => {
            const { id, name, type } = item
            seenVariables.add(id)

            const param = { id, name, type }

            // If overrideConfigStatus is true, look for existing variable config
            // Otherwise, create new default config
            if (overrideConfigStatus) {
                const existingVariable = variableOverrides?.find((existingParam) => existingParam.id === id)
                if (existingVariable) {
                    if (!newVariables.some((variable) => variable.id === id)) {
                        newVariables.push({ ...existingVariable })
                    }
                } else {
                    if (!newVariables.some((variable) => variable.id === id)) {
                        newVariables.push({ ...param, enabled: false })
                    }
                }
            } else {
                // When no override config exists, create default values
                if (!newVariables.some((variable) => variable.id === id)) {
                    newVariables.push({ ...param, enabled: false })
                }
            }
        })

        // If overrideConfigStatus is true, clean up any variables that no longer exist
        if (overrideConfigStatus && variableOverrides) {
            variableOverrides.forEach((existingVariable) => {
                if (!seenVariables.has(existingVariable.id)) {
                    const index = newVariables.findIndex((newVariable) => newVariable.id === existingVariable.id)
                    if (index !== -1) {
                        newVariables.splice(index, 1)
                    }
                }
            })
        }

        setVariableOverrides(newVariables)
    }

    const handleAccordionChange = (nodeLabel) => (event, isExpanded) => {
        const accordianNodes = { ...nodeConfigExpanded }
        accordianNodes[nodeLabel] = isExpanded
        setNodeConfigExpanded(accordianNodes)
    }

    useEffect(() => {
        if (updateChatflowApi.data) {
            dispatch({ type: SET_CHATFLOW, chatflow: updateChatflowApi.data })
        }
    }, [updateChatflowApi.data, dispatch])

    useEffect(() => {
        if (getConfigApi.data) {
            groupByNodeLabel(getConfigApi.data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getConfigApi.data])

    useEffect(() => {
        if (getAllVariablesApi.data) {
            groupByVariableLabel(getAllVariablesApi.data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getAllVariablesApi.data])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const getCode = (codeLang) => {
        if (codeLang === 'Python') {
            return `import requests

API_URL = "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}"

def query(payload):
    response = requests.post(API_URL, json=payload)
    return response.json()
    
output = query({
    "question": "Hey, how are you?",
})
`
        } else if (codeLang === 'JavaScript') {
            return `async function query(data) {
    const response = await fetch(
        "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

query({"question": "Hey, how are you?"}).then((response) => {
    console.log(response);
});
`
        } else if (codeLang === 'cURL') {
            return `curl ${baseURL}/api/v1/prediction/${dialogProps.chatflowid} \\
     -X POST \\
     -d '{"question": "Hey, how are you?"}' \\
     -H "Content-Type: application/json"`
        }
        return ''
    }

    const getCodeWithAuthorization = (codeLang) => {
        if (codeLang === 'Python') {
            return `import requests

API_URL = "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}"
headers = {"Authorization": "Bearer ${selectedApiKey?.apiKey}"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()
    
output = query({
    "question": "Hey, how are you?",
})
`
        } else if (codeLang === 'JavaScript') {
            return `async function query(data) {
    const response = await fetch(
        "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}",
        {
            headers: {
                Authorization: "Bearer ${selectedApiKey?.apiKey}",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

query({"question": "Hey, how are you?"}).then((response) => {
    console.log(response);
});
`
        } else if (codeLang === 'cURL') {
            return `curl ${baseURL}/api/v1/prediction/${dialogProps.chatflowid} \\
     -X POST \\
     -d '{"question": "Hey, how are you?"}' \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer ${selectedApiKey?.apiKey}"`
        }
        return ''
    }

    const getLang = (codeLang) => {
        if (codeLang === 'Python') {
            return 'python'
        } else if (codeLang === 'JavaScript') {
            return 'javascript'
        } else if (codeLang === 'cURL') {
            return 'bash'
        }
        return 'python'
    }

    const getSVG = (codeLang) => {
        if (codeLang === 'Python') {
            return pythonSVG
        } else if (codeLang === 'JavaScript') {
            return javascriptSVG
        } else if (codeLang === '嵌入网页') {
            return EmbedSVG
        } else if (codeLang === 'cURL') {
            return cURLSVG
        } else if (codeLang === '分享链接') {
            return ShareChatbotSVG
        } else if (codeLang === 'Configuration') {
            return settingsSVG
        }
        return pythonSVG
    }

    // ----------------------------CONFIG FORM DATA --------------------------//

    const getConfigCodeWithFormData = (codeLang, configData) => {
        if (codeLang === 'Python') {
            configData = unshiftFiles(configData)
            let fileType = configData[0].type
            if (fileType.includes(',')) fileType = fileType.split(',')[0]
            return `import requests

API_URL = "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}"

# use form data to upload files
form_data = {
    "files": ${`('example${fileType}', open('example${fileType}', 'rb'))`}
}
body_data = {${getConfigExamplesForPython(configData, 'formData')}}

def query(form_data):
    response = requests.post(API_URL, files=form_data, data=body_data)
    return response.json()

output = query(form_data)
`
        } else if (codeLang === 'JavaScript') {
            return `// use FormData to upload files
let formData = new FormData();
${getConfigExamplesForJS(configData, 'formData')}
async function query(formData) {
    const response = await fetch(
        "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}",
        {
            method: "POST",
            body: formData
        }
    );
    const result = await response.json();
    return result;
}

query(formData).then((response) => {
    console.log(response);
});
`
        } else if (codeLang === 'cURL') {
            return `curl ${baseURL}/api/v1/prediction/${dialogProps.chatflowid} \\
     -X POST \\${getConfigExamplesForCurl(configData, 'formData')} \\
     -H "Content-Type: multipart/form-data"`
        }
        return ''
    }

    // ----------------------------CONFIG FORM DATA with AUTH--------------------------//

    const getConfigCodeWithFormDataWithAuth = (codeLang, configData) => {
        if (codeLang === 'Python') {
            configData = unshiftFiles(configData)
            let fileType = configData[0].type
            if (fileType.includes(',')) fileType = fileType.split(',')[0]
            return `import requests

API_URL = "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}"
headers = {"Authorization": "Bearer ${selectedApiKey?.apiKey}"}

# use form data to upload files
form_data = {
    "files": ${`('example${fileType}', open('example${fileType}', 'rb'))`}
}
body_data = {${getConfigExamplesForPython(configData, 'formData')}}

def query(form_data):
    response = requests.post(API_URL, headers=headers, files=form_data, data=body_data)
    return response.json()

output = query(form_data)
`
        } else if (codeLang === 'JavaScript') {
            return `// use FormData to upload files
let formData = new FormData();
${getConfigExamplesForJS(configData, 'formData')}
async function query(formData) {
    const response = await fetch(
        "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}",
        {
            headers: { Authorization: "Bearer ${selectedApiKey?.apiKey}" },
            method: "POST",
            body: formData
        }
    );
    const result = await response.json();
    return result;
}

query(formData).then((response) => {
    console.log(response);
});
`
        } else if (codeLang === 'cURL') {
            return `curl ${baseURL}/api/v1/prediction/${dialogProps.chatflowid} \\
     -X POST \\${getConfigExamplesForCurl(configData, 'formData')} \\
     -H "Content-Type: multipart/form-data" \\
     -H "Authorization: Bearer ${selectedApiKey?.apiKey}"`
        }
        return ''
    }

    // ----------------------------CONFIG JSON--------------------------//

    const getConfigCode = (codeLang, configData) => {
        if (codeLang === 'Python') {
            return `import requests

API_URL = "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}"

def query(payload):
    response = requests.post(API_URL, json=payload)
    return response.json()

output = query({
    "question": "Hey, how are you?",
    "overrideConfig": {${getConfigExamplesForPython(configData, 'json')}
    }
})
`
        } else if (codeLang === 'JavaScript') {
            return `async function query(data) {
    const response = await fetch(
        "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

query({
  "question": "Hey, how are you?",
  "overrideConfig": {${getConfigExamplesForJS(configData, 'json')}
  }
}).then((response) => {
    console.log(response);
});
`
        } else if (codeLang === 'cURL') {
            return `curl ${baseURL}/api/v1/prediction/${dialogProps.chatflowid} \\
     -X POST \\
     -d '{"question": "Hey, how are you?", "overrideConfig": {${getConfigExamplesForCurl(configData, 'json')}}' \\
     -H "Content-Type: application/json"`
        }
        return ''
    }

    // ----------------------------CONFIG JSON with AUTH--------------------------//

    const getConfigCodeWithAuthorization = (codeLang, configData) => {
        if (codeLang === 'Python') {
            return `import requests

API_URL = "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}"
headers = {"Authorization": "Bearer ${selectedApiKey?.apiKey}"}

def query(payload):
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

output = query({
    "question": "Hey, how are you?",
    "overrideConfig": {${getConfigExamplesForPython(configData, 'json')}
    }
})
`
        } else if (codeLang === 'JavaScript') {
            return `async function query(data) {
    const response = await fetch(
        "${baseURL}/api/v1/prediction/${dialogProps.chatflowid}",
        {
            headers: {
                Authorization: "Bearer ${selectedApiKey?.apiKey}",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

query({
  "question": "Hey, how are you?",
  "overrideConfig": {${getConfigExamplesForJS(configData, 'json')}
  }
}).then((response) => {
    console.log(response);
});
`
        } else if (codeLang === 'cURL') {
            return `curl ${baseURL}/api/v1/prediction/${dialogProps.chatflowid} \\
     -X POST \\
     -d '{"question": "Hey, how are you?", "overrideConfig": {${getConfigExamplesForCurl(configData, 'json')}}' \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer ${selectedApiKey?.apiKey}"`
        }
        return ''
    }

    const getMultiConfigCodeWithFormData = (codeLang) => {
        if (codeLang === 'Python') {
            return `# Specify multiple values for a config parameter by specifying the node id
body_data = {
    "openAIApiKey": {
        "chatOpenAI_0": "sk-my-openai-1st-key",
        "openAIEmbeddings_0": "sk-my-openai-2nd-key"
    }
}`
        } else if (codeLang === 'JavaScript') {
            return `// Specify multiple values for a config parameter by specifying the node id
formData.append("openAIApiKey[chatOpenAI_0]", "sk-my-openai-1st-key")
formData.append("openAIApiKey[openAIEmbeddings_0]", "sk-my-openai-2nd-key")`
        } else if (codeLang === 'cURL') {
            return `-F "openAIApiKey[chatOpenAI_0]=sk-my-openai-1st-key" \\
-F "openAIApiKey[openAIEmbeddings_0]=sk-my-openai-2nd-key" \\`
        }
    }

    const getMultiConfigCode = () => {
        return `{
    "overrideConfig": {
        "openAIApiKey": {
            "chatOpenAI_0": "sk-my-openai-1st-key",
            "openAIEmbeddings_0": "sk-my-openai-2nd-key"
        }
    }
}`
    }

    useEffect(() => {
        if (getAllAPIKeysApi.data) {
            const options = [
                {
                    label: '无需授权',
                    name: ''
                }
            ]
            for (const key of getAllAPIKeysApi.data) {
                options.push({
                    label: key.keyName,
                    name: key.id
                })
            }
            options.push({
                label: '- Add New Key -',
                name: 'addnewkey'
            })
            setKeyOptions(options)
            setAPIKeys(getAllAPIKeysApi.data)

            if (dialogProps.chatflowApiKeyId) {
                setChatflowApiKeyId(dialogProps.chatflowApiKeyId)
                setSelectedApiKey(getAllAPIKeysApi.data.find((key) => key.id === dialogProps.chatflowApiKeyId))
            }
        }
    }, [dialogProps, getAllAPIKeysApi.data])

    useEffect(() => {
        if (show) {
            getAllAPIKeysApi.request()
            getIsChatflowStreamingApi.request(dialogProps.chatflowid)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    const component = show ? (
        <Dialog
            open={show}
            fullWidth
            maxWidth='md'
            onClose={onCancel}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title' className='flex justify-between items-center'>
                {dialogProps.title}
                <Box className='flex items-center w-60 -mt-2'>
                    <Dropdown
                        name='SelectKey'
                        disableClearable={true}
                        options={keyOptions}
                        onSelect={(newValue) => onApiKeySelected(newValue)}
                        value={dialogProps.chatflowApiKeyId ?? chatflowApiKeyId ?? 'Choose an API key'}
                    />
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box className='flex '>
                    <Tabs orientation='vertical' value={value} onChange={handleChange} aria-label='tabs' className='w-40 mr-4 mt-6'>
                        {codes.map((codeLang, index) => (
                            <Tab
                                className='flex items-center justify-start min-h-8 p-0 mb-2'
                                icon={<img style={{ objectFit: 'cover', height: 20, width: 'auto' }} src={getSVG(codeLang)} alt='code' />}
                                iconPosition='start'
                                key={index}
                                label={codeLang}
                                {...a11yProps(index)}
                            ></Tab>
                        ))}
                    </Tabs>
                    <Box className='grow'>
                        {codes.map((codeLang, index) => (
                            <TabPanel key={index} value={value} index={index} sx={{}}>
                                {(codeLang === '嵌入网页' || codeLang === '分享链接') && chatflowApiKeyId && (
                                    <>
                                        <p>You cannot use API key while embedding/sharing chatbot.</p>
                                        <p>
                                            Please select <b>&quot;No Authorization&quot;</b> from the dropdown at the top right corner.
                                        </p>
                                    </>
                                )}
                                {codeLang === '嵌入网页' && !chatflowApiKeyId && <EmbedChat chatflowid={dialogProps.chatflowid} />}
                                {codeLang !== '嵌入网页' && codeLang !== '分享链接' && codeLang !== 'Configuration' && (
                                    <Box className='mt-6'>
                                        <CopyBlock
                                            theme={atomOneDark}
                                            text={chatflowApiKeyId ? getCodeWithAuthorization(codeLang) : getCode(codeLang)}
                                            language={getLang(codeLang)}
                                            showLineNumbers={false}
                                            wrapLines
                                        />
                                        <CheckboxInput label='显示可配置参数' value={checkboxVal} onChange={onCheckBoxChanged} />
                                        {checkboxVal && getConfigApi.data && getConfigApi.data.length > 0 && (
                                            <>
                                                <Typography sx={{ mt: 2, mb: 3 }}>
                                                    您可以使用overrideConfig属性覆盖现有的配置参数。
                                                </Typography>
                                                <Stack direction='column' spacing={2} sx={{ width: '100%', my: 2 }}>
                                                    <Box>
                                                        <Stack
                                                            sx={{ mt: 1, mb: 2, ml: 1, alignItems: 'center' }}
                                                            direction='row'
                                                            spacing={2}
                                                        >
                                                            <IconBox />
                                                            <Typography variant='h4'>Nodes</Typography>
                                                        </Stack>
                                                        {Object.keys(nodeConfig)
                                                            .sort()
                                                            .map((nodeLabel) => (
                                                                <Accordion
                                                                    expanded={nodeConfigExpanded[nodeLabel] || false}
                                                                    onChange={handleAccordionChange(nodeLabel)}
                                                                    key={nodeLabel}
                                                                    disableGutters
                                                                    className='shadow-none'
                                                                >
                                                                    <AccordionSummary
                                                                        expandIcon={<ExpandMoreIcon />}
                                                                        aria-controls={`nodes-accordian-${nodeLabel}`}
                                                                        id={`nodes-accordian-header-${nodeLabel}`}
                                                                    >
                                                                        <Stack
                                                                            flexDirection='row'
                                                                            sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}
                                                                        >
                                                                            <Typography variant='h5'>{nodeLabel}</Typography>
                                                                            {nodeConfig[nodeLabel].nodeIds.length > 0 &&
                                                                                nodeConfig[nodeLabel].nodeIds.map((nodeId, index) => (
                                                                                    <div
                                                                                        key={index}
                                                                                        style={{
                                                                                            display: 'flex',
                                                                                            flexDirection: 'row',
                                                                                            width: 'max-content',
                                                                                            borderRadius: 15,
                                                                                            background: 'rgb(254,252,191)',
                                                                                            padding: 5,
                                                                                            paddingLeft: 10,
                                                                                            paddingRight: 10
                                                                                        }}
                                                                                    >
                                                                                        <span
                                                                                            style={{
                                                                                                color: 'rgb(116,66,16)',
                                                                                                fontSize: '0.825rem'
                                                                                            }}
                                                                                        >
                                                                                            {nodeId}
                                                                                        </span>
                                                                                    </div>
                                                                                ))}
                                                                        </Stack>
                                                                    </AccordionSummary>
                                                                    <AccordionDetails>
                                                                        <TableViewOnly
                                                                            rows={nodeOverrides[nodeLabel]}
                                                                            columns={
                                                                                nodeOverrides[nodeLabel].length > 0
                                                                                    ? Object.keys(nodeOverrides[nodeLabel][0])
                                                                                    : []
                                                                            }
                                                                        />
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            ))}
                                                    </Box>
                                                    <Box>
                                                        <Stack
                                                            sx={{ mt: 1, mb: 2, ml: 1, alignItems: 'center' }}
                                                            direction='row'
                                                            spacing={2}
                                                        >
                                                            <IconVariable />
                                                            <Typography variant='h4'>Variables</Typography>
                                                        </Stack>
                                                        <TableViewOnly rows={variableOverrides} columns={['name', 'type', 'enabled']} />
                                                    </Box>
                                                </Stack>
                                                <CopyBlock
                                                    theme={atomOneDark}
                                                    text={
                                                        chatflowApiKeyId
                                                            ? dialogProps.isFormDataRequired
                                                                ? getConfigCodeWithFormDataWithAuth(codeLang, getConfigApi.data)
                                                                : getConfigCodeWithAuthorization(codeLang, getConfigApi.data)
                                                            : dialogProps.isFormDataRequired
                                                            ? getConfigCodeWithFormData(codeLang, getConfigApi.data)
                                                            : getConfigCode(codeLang, getConfigApi.data)
                                                    }
                                                    language={getLang(codeLang)}
                                                    showLineNumbers={false}
                                                    wrapLines
                                                />
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        marginTop: 10,
                                                        marginBottom: 10
                                                    }}
                                                >
                                                    <div className='flex items-center mb-2 mt-2'>
                                                        <IconBulb size='1.2rem' color='#2d6a4f' />
                                                        <span style={{ color: '#2d6a4f', marginLeft: 5, fontWeight: 500 }}>
                                                            您还可以通过指定节点id为配置参数指定多个值
                                                        </span>
                                                    </div>
                                                    <CopyBlock
                                                        theme={atomOneDark}
                                                        text={
                                                            dialogProps.isFormDataRequired
                                                                ? getMultiConfigCodeWithFormData(codeLang)
                                                                : getMultiConfigCode()
                                                        }
                                                        language={getLang(codeLang)}
                                                        showLineNumbers={false}
                                                        wrapLines
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {getIsChatflowStreamingApi.data?.isStreaming && (
                                            <p>
                                                查看&nbsp;
                                                <a
                                                    rel='noreferrer'
                                                    target='_blank'
                                                    href='https://docs.flowiseai.com/using-flowise/streaming'
                                                >
                                                    这里
                                                </a>
                                                &nbsp;了解应用程序如何接收流式响应。
                                            </p>
                                        )}
                                    </Box>
                                )}
                                {codeLang === '分享链接' && !chatflowApiKeyId && (
                                    <ShareChatbot isSessionMemory={dialogProps.isSessionMemory} isAgentCanvas={dialogProps.isAgentCanvas} />
                                )}
                            </TabPanel>
                        ))}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

APICodeDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onCancel: PropTypes.func
}

export default APICodeDialog
