// assets
import {
    PiCode,
    PiKey,
    PiDatabase,
    PiChatsCircle,
    PiAppStoreLogo,
    PiRobot,
    PiHammer,
    PiFingerprintSimple,
    PiOpenAiLogo
} from 'react-icons/pi'

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = [
    {
        id: 'studio',
        title: '工作台',
        type: 'group',
        children: [
            {
                id: 'assistants',
                title: '智能助手',
                type: 'item',
                url: '/assistants',
                icon: PiOpenAiLogo,
                breadcrumbs: true
            },
            {
                id: 'chatflows',
                title: '对话编排',
                type: 'item',
                url: '/chatflows',
                icon: PiChatsCircle,
                breadcrumbs: true
            },
            {
                id: 'agentflows',
                title: '智能体编排',
                type: 'item',
                url: '/agentflows',
                icon: PiRobot,
                breadcrumbs: true,
                isBeta: false
            },
            {
                id: 'marketplaces',
                title: '模板库',
                type: 'item',
                url: '/marketplaces',
                icon: PiAppStoreLogo,
                breadcrumbs: true
            }
        ]
    },
    {
        id: 'studio2',
        title: '知识库 & 工具',
        type: 'group',
        children: [
            {
                id: 'document-stores',
                title: '知识库',
                type: 'item',
                url: '/document-stores',
                icon: PiDatabase,
                breadcrumbs: true
            },
            {
                id: 'tools',
                title: '工具箱',
                type: 'item',
                url: '/tools',
                icon: PiHammer,
                breadcrumbs: true
            }
        ]
    },
    {
        id: 'settings',
        title: '设置',
        type: 'group',
        children: [
            {
                id: 'credentials',
                title: '访问凭证',
                type: 'item',
                url: '/credentials',
                icon: PiFingerprintSimple,
                breadcrumbs: true
            },
            {
                id: 'variables',
                title: '全局变量',
                type: 'item',
                url: '/variables',
                icon: PiCode,
                breadcrumbs: true
            },
            {
                id: 'apikey',
                title: 'API Keys',
                type: 'item',
                url: '/apikey',
                icon: PiKey,
                breadcrumbs: true
            }
        ]
    }
]

export default dashboard
