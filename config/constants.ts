// ============================================================
// 应用配置常量
// 统一管理应用中的所有魔法数字和配置项
// ============================================================

/**
 * UI 相关常量
 */
export const UI_CONSTANTS = {
    /**
     * 标签过滤器中直接显示的标签数量限制
     * 超过此数量的标签将收起到下拉框中
     */
    FILTER_TAG_LIMIT: 5,

    /**
     * PromptCard 中直接显示的标签数量限制
     * 超过此数量的标签将被隐藏，显示"+N"按钮
     */
    TAG_DISPLAY_LIMIT: 2,

    /**
     * Toast 通知自动关闭的时间（毫秒）
     */
    TOAST_DURATION: 3000,

    /**
     * 搜索输入防抖延迟（毫秒）
     */
    SEARCH_DEBOUNCE_MS: 300,
} as const;

// ============================================================
// 种子数据
// 应用首次启动时的默认提示词数据
// ============================================================

import type { Prompt } from '../types';

export const SEED_PROMPTS: Prompt[] = [
    {
        id: '1',
        title: 'Code Refactor Expert',
        content: 'Act as a senior software engineer. Review the following code for performance, readability, and security vulnerabilities. Suggest specific refactoring steps and explain your reasoning.',
        tags: ['coding', 'review'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFavorite: false,
    },
    {
        id: '2',
        title: 'Blog Post Generator',
        content: 'Write a comprehensive blog post about [TOPIC]. Include an engaging introduction, 3 main sections with subheadings, and a conclusion with a call to action. Tone should be professional yet accessible.',
        tags: ['writing', 'marketing'],
        createdAt: Date.now() - 100000,
        updatedAt: Date.now() - 100000,
        isFavorite: true,
    }
];
