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

const settings = {
    id: 'settings',
    title: '',
    type: 'group',
    children: [
        {
            id: 'viewMessages',
            title: 'View Messages',
            type: 'item',
            url: '',
            icon: icons.PiChatText
        },
        {
            id: 'viewLeads',
            title: 'View Leads',
            type: 'item',
            url: '',
            icon: icons.PiUsers
        },
        {
            id: 'viewUpsertHistory',
            title: 'Upsert History',
            type: 'item',
            url: '',
            icon: icons.PiDatabase
        },
        {
            id: 'chatflowConfiguration',
            title: 'Configuration',
            type: 'item',
            url: '',
            icon: icons.PiFadersHorizontal
        },
        {
            id: 'saveAsTemplate',
            title: '保存为模版',
            type: 'item',
            url: '',
            icon: icons.PiBookmarks
        },
        {
            id: 'duplicateChatflow',
            title: '复制 Chatflow',
            type: 'item',
            url: '',
            icon: icons.PiCopy
        },
        {
            id: 'loadChatflow',
            title: '加载 Chatflow',
            type: 'item',
            url: '',
            icon: icons.PiUpload
        },
        {
            id: 'exportChatflow',
            title: '导出 Chatflow',
            type: 'item',
            url: '',
            icon: icons.PiExport
        },
        {
            id: 'deleteChatflow',
            title: '删除 Chatflow',
            type: 'item',
            url: '',
            icon: icons.PiTrash
        }
    ]
}

export default settings
