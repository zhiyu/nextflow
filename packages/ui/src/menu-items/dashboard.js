// assets

import { GoArchive, GoDependabot, GoKey, GoLock, GoDatabase, GoTools, GoCode, GoCommentDiscussion, GoInfinity } from 'react-icons/go'

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = [
    {
        id: 'dashboard',
        title: '探索',
        type: 'group',
        children: [
            {
                id: 'marketplaces',
                title: '模版市场',
                type: 'item',
                url: '/marketplaces',
                icon: GoArchive,
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
                icon: GoCommentDiscussion,
                breadcrumbs: true
            },
            {
                id: 'agentflows',
                title: '智能体',
                type: 'item',
                url: '/agentflows',
                icon: GoDependabot,
                breadcrumbs: true,
                isBeta: false
            },
            {
                id: 'document-stores',
                title: '知识库',
                type: 'item',
                url: '/document-stores',
                icon: GoDatabase,
                breadcrumbs: true
            },
            {
                id: 'tools',
                title: '工具箱',
                type: 'item',
                url: '/tools',
                icon: GoInfinity,
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
                icon: GoLock,
                breadcrumbs: true
            },
            {
                id: 'variables',
                title: '全局变量',
                type: 'item',
                url: '/variables',
                icon: GoCode,
                breadcrumbs: true
            },
            {
                id: 'apikey',
                title: 'API Keys',
                type: 'item',
                url: '/apikey',
                icon: GoKey,
                breadcrumbs: true
            }
        ]
    }
]

export default dashboard
