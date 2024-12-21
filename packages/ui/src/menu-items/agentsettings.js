// assets
import { PiChatText, PiUsers, PiExport, PiUpload, PiTrash, PiCopy, PiBookmarks, PiDatabase, PiFadersHorizontal } from 'react-icons/pi'

const icons = {
    PiChatText,
    PiUsers,
    PiDatabase,
    PiFadersHorizontal,
    PiBookmarks,
    PiCopy,
    PiExport,
    PiUpload,
    PiTrash
}

// ==============================|| SETTINGS MENU ITEMS ||============================== //

const agent_settings = {
    id: 'settings',
    title: '',
    type: 'group',
    children: [
        {
            id: 'viewMessages',
            title: '消息记录',
            type: 'item',
            url: '',
            icon: icons.PiChatText
        },
        {
            id: 'viewLeads',
            title: '潜在客户',
            type: 'item',
            url: '',
            icon: icons.PiUsers
        },
        {
            id: 'chatflowConfiguration',
            title: '参数设置',
            type: 'item',
            url: '',
            icon: icons.PiFadersHorizontal
        },
        {
            id: 'saveAsTemplate',
            title: '存为模版',
            type: 'item',
            url: '',
            icon: icons.PiBookmarks
        },
        {
            id: 'duplicateChatflow',
            title: '复制',
            type: 'item',
            url: '',
            icon: icons.PiCopy
        },
        {
            id: 'loadChatflow',
            title: '加载',
            type: 'item',
            url: '',
            icon: icons.PiUpload
        },
        {
            id: 'exportChatflow',
            title: '导出',
            type: 'item',
            url: '',
            icon: icons.PiExport
        },
        {
            id: 'deleteChatflow',
            title: '删除',
            type: 'item',
            url: '',
            icon: icons.PiTrash
        }
    ]
}

export default agent_settings
