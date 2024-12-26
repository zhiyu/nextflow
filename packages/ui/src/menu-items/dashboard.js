// assets
import {
    PiCode,
    PiKey,
    PiDatabase,
    PiChatsCircle,
    PiRobot,
    PiHammer,
    PiFingerprintSimple,
    PiOpenAiLogo,
    PiFolders,
    PiFolderSimpleUser,
    PiFunction,
    PiFunctionDuotone,
    PiHash,
    PiMagicWand,
    PiPassword,
    PiPercent,
    PiUsers,
    PiUserCheck,
    PiCurrencyDollar,
    PiStack,
    PiBookOpen
} from 'react-icons/pi'

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = [
    {
        id: 'console',
        title: '工作台',
        type: 'group',
        children: [
            {
                id: 'assistants',
                title: '智能助手',
                type: 'item',
                url: '/assistants',
                icon: PiMagicWand,
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
            }
        ]
    },
    {
        id: 'templates',
        title: '模板库',
        type: 'group',
        children: [
            {
                id: 'marketplaces',
                title: '共享模版',
                type: 'item',
                url: '/marketplaces',
                icon: PiFolders,
                breadcrumbs: true
            },
            {
                id: 'mytemplates',
                title: '我的模版',
                type: 'item',
                url: '/mytemplates',
                icon: PiFolderSimpleUser,
                breadcrumbs: true
            }
        ]
    },
    {
        id: 'knowledge',
        title: '知识库 & 工具',
        type: 'group',
        children: [
            {
                id: 'document-stores',
                title: '知识库',
                type: 'item',
                url: '/document-stores',
                icon: PiBookOpen,
                breadcrumbs: true
            },
            {
                id: 'tools',
                title: '工具',
                type: 'item',
                url: '/tools',
                icon: PiCode,
                breadcrumbs: true
            },

            {
                id: 'variables',
                title: '全局变量',
                type: 'item',
                url: '/variables',
                icon: PiCurrencyDollar,
                breadcrumbs: true
            }
        ]
    },
    {
        id: 'settings',
        title: '访问控制',
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
                id: 'apikey',
                title: 'API Keys',
                type: 'item',
                url: '/apikey',
                icon: PiKey,
                breadcrumbs: true
            }
        ]
    },
    {
        id: 'users-workspaces',
        title: '用户 & 工作区',
        type: 'group',
        children: [
            {
                id: 'roles',
                title: '角色',
                type: 'item',
                url: '#',
                icon: PiUserCheck,
                breadcrumbs: true
            },
            {
                id: 'users',
                title: '用户',
                type: 'item',
                url: '#',
                icon: PiUsers,
                breadcrumbs: true
            },
            {
                id: 'workspaces',
                title: '工作区',
                type: 'item',
                url: '#',
                icon: PiStack,
                breadcrumbs: true
            }
        ]
    }
]

export default dashboard
