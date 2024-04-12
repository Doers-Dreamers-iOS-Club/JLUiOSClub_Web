import {LocalSearchTranslations} from "vitepress/types/local-search";
import {DefaultTheme} from "vitepress";

export const themeTranslations: DefaultTheme.Config = {
    docFooter: {
        prev: '上一篇',
        next: '下一篇'
    },
    outline: {
        label: '页内导航'
    },
    lastUpdated: {
        text: '最后更新于',
        formatOptions: {
            forceLocale: true
        }
    },
    editLink: {
        text: '在 GitHub 上编辑此页',
        pattern: 'https://github.com/AQiu-2003/JLUiOSClub_Web/edit/main/docs/:path'
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
}

export const searchTranslations: LocalSearchTranslations = {
    button: {
        // buttonText: '搜索站点',
        buttonAriaLabel: '搜索站点'
    },
    modal: {
        displayDetails: '显示详情',
        resetButtonTitle: '清除查询条件',
        backButtonTitle: '返回',
        noResultsText: '无法找到以下内容的相关结果：',
        footer: {
            selectText: '选择',
            selectKeyAriaLabel: '选择',
            navigateText: '切换',
            navigateUpKeyAriaLabel: '上一个',
            navigateDownKeyAriaLabel: '下一个',
            closeText: '关闭',
            closeKeyAriaLabel: '关闭',
        }
    }
}