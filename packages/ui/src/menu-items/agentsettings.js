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
            id: 'chatflowConfiguration',
            title: 'Configuration',
            type: 'item',
            url: '',
            icon: icons.PiFadersHorizontal
        },
        {
            id: 'saveAsTemplate',
            title: 'Save As Template',
            type: 'item',
            url: '',
            icon: icons.PiBookmarks
        },
        {
            id: 'duplicateChatflow',
            title: 'Duplicate Agents',
            type: 'item',
            url: '',
            icon: icons.PiCopy
        },
        {
            id: 'loadChatflow',
            title: 'Load Agents',
            type: 'item',
            url: '',
            icon: icons.PiUpload
        },
        {
            id: 'exportChatflow',
            title: 'Export Agents',
            type: 'item',
            url: '',
            icon: icons.PiExport
        },
        {
            id: 'deleteChatflow',
            title: 'Delete Agents',
            type: 'item',
            url: '',
            icon: icons.PiTrash
        }
    ]
}

export default agent_settings
