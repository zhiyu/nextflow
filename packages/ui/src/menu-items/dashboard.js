// assets
import {
    PiCodeDuotone,
    PiKeyDuotone,
    PiDatabaseDuotone,
    PiChatsCircleDuotone,
    PiAppStoreLogoDuotone,
    PiRobotDuotone,
    PiHammerDuotone,
    PiFingerprintSimpleDuotone,
    PiOpenAiLogoDuotone
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
                title: 'OpenAI 助手',
                type: 'item',
                url: '/assistants',
                icon: PiOpenAiLogoDuotone,
                breadcrumbs: true
            },
            {
                id: 'chatflows',
                title: '对话编排',
                type: 'item',
                url: '/chatflows',
                icon: PiChatsCircleDuotone,
                breadcrumbs: true
            },
            {
                id: 'agentflows',
                title: '智能体编排',
                type: 'item',
                url: '/agentflows',
                icon: PiRobotDuotone,
                breadcrumbs: true,
                isBeta: false
            },
            {
                id: 'marketplaces',
                title: '模板库',
                type: 'item',
                url: '/marketplaces',
                icon: PiAppStoreLogoDuotone,
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
