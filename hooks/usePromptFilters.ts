import { useState, useMemo } from 'react';
import { Prompt } from '../types';

// ============================================================
// Prompt 过滤 Hook
// 管理搜索和标签过滤逻辑
// ============================================================

/**
 * Prompt 过滤 Hook
 * @param prompts - 原始提示词数组
 * @returns 过滤后的提示词、搜索词、选中的标签、以及相关方法
 */
export const usePromptFilters = (prompts: Prompt[]) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // 计算所有唯一标签
    const allTags = useMemo(() => {
        return Array.from(new Set(prompts.flatMap(p => p.tags))).sort();
    }, [prompts]);

    // 过滤后的提示词
    const filteredPrompts = useMemo(() => {
        return prompts.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.content.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTag = selectedTag ? p.tags.includes(selectedTag) : true;
            return matchesSearch && matchesTag;
        });
    }, [prompts, searchTerm, selectedTag]);

    /**
     * 切换标签选择
     */
    const toggleTagSelection = (tag: string) => {
        setSelectedTag(prev => prev === tag ? null : tag);
    };

    /**
     * 清除所有过滤条件
     */
    const clearFilters = () => {
        setSearchTerm('');
        setSelectedTag(null);
    };

    return {
        searchTerm,
        setSearchTerm,
        selectedTag,
        setSelectedTag,
        toggleTagSelection,
        clearFilters,
        allTags,
        filteredPrompts,
    };
};
