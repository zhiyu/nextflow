// assets
import {
    PiCodeDuotone,
    PiLockDuotone,
    PiKeyDuotone,
    PiDatabaseDuotone,
    PiChatsCircleDuotone,
    PiShoppingCartSimpleDuotone,
    PiRobotDuotone,
    PiHammerDuotone,
    PiFingerprintSimpleDuotone
} from 'react-icons/pi'

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = [
    {
        id: 'dashboard',
        title: '探索',
        caption: '',
        type: 'group',
        children: [
            {
                id: 'marketplaces',
                title: '模版市场',
                type: 'item',
                url: '/marketplaces',
                icon: PiShoppingCartSimpleDuotone,
                breadcrumbs: true
            }
        ]
    },
    {
        id: 'studio',
        title: '工作台',
        type: 'group',
        children: [
            {
                id: 'chatflows',
                title: '对话流',
                type: 'item',
                url: '/chatflows',
                icon: PiChatsCircleDuotone,
                breadcrumbs: true
            },
            {
                id: 'agentflows',
                title: '智能体',
                type: 'item',
                url: '/agentflows',
                icon: PiRobotDuotone,
                breadcrumbs: true,
                isBeta: false
            },
            {
                id: 'document-stores',
                title: '知识库',
                type: 'item',
                url: '/document-stores',
                icon: PiDatabaseDuotone,
                breadcrumbs: true
            },
            {
                id: 'tools',
                title: '工具箱',
                type: 'item',
                url: '/tools',
                icon: PiHammerDuotone,
                breadcrumbs: true
            }
            // {
            //     id: 'assistants',
            //     title: '助手',
            //     type: 'item',
            //     url: '/assistants',
            //     icon: GoInfinity,
            //     breadcrumbs: true
            // }
        ]
    },
    {
        id: 'security',
        title: '设置',
        type: 'group',
        children: [
            {
                id: 'credentials',
                title: '凭证',
                type: 'item',
                url: '/credentials',
                icon: PiFingerprintSimpleDuotone,
                breadcrumbs: true
            },
            {
                id: 'variables',
                title: '全局变量',
                type: 'item',
                url: '/variables',
                icon: PiCodeDuotone,
                breadcrumbs: true
            },
            {
                id: 'apikey',
                title: 'API Keys',
                type: 'item',
                url: '/apikey',
                icon: PiKeyDuotone,
                breadcrumbs: true
            }
        ]
    }
]

export default dashboard
