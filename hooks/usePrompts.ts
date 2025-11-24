import { useState, useEffect } from 'react';
import { Prompt } from '../types';
import { SEED_PROMPTS } from '../config/constants';

// ============================================================
// Prompts CRUD Hook
// 管理提示词的增删改查和本地存储
// ============================================================

const STORAGE_KEY = 'promptly_data';

/**
 * Prompts 管理 Hook
 * @returns prompts 数组和 CRUD 操作方法
 */
export const usePrompts = () => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);

    // 从 localStorage 加载数据
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setPrompts(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved prompts", e);
                setPrompts(SEED_PROMPTS);
            }
        } else {
            setPrompts(SEED_PROMPTS);
        }
    }, []);

    // 保存到 localStorage
    useEffect(() => {
        if (prompts.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
        }
    }, [prompts]);

    /**
     * 创建新的提示词
     */
    const createPrompt = (prompt: Prompt) => {
        setPrompts(prev => [prompt, ...prev]);
    };

    /**
     * 更新现有提示词
     */
    const updatePrompt = (id: string, updates: Partial<Prompt>) => {
        setPrompts(prev => prev.map(p =>
            p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
        ));
    };

    /**
     * 删除提示词
     */
    const deletePrompt = (id: string) => {
        setPrompts(prev => prev.filter(p => p.id !== id));
    };

    return {
        prompts,
        createPrompt,
        updatePrompt,
        deletePrompt,
    };
};
