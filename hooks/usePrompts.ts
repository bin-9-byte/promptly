import { useState, useEffect } from 'react';
import { Prompt } from '../types';
import { SEED_PROMPTS } from '../config/constants';
import { db, migrateFromLocalStorage } from '../db/promptsDB';
import { liveQuery } from 'dexie';

// ============================================================
// Prompts CRUD Hook
// 管理提示词的增删改查（使用 IndexedDB）
// ============================================================

/**
 * Prompts 管理 Hook
 * @returns prompts 数组和 CRUD 操作方法
 */
export const usePrompts = () => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);

    // 初始化：迁移数据 + 加载 prompts
    useEffect(() => {
        const initDatabase = async () => {
            try {
                // 1. 执行数据迁移（如果需要）
                await migrateFromLocalStorage();

                // 2. 检查数据库是否为空
                const count = await db.prompts.count();
                if (count === 0) {
                    // 数据库为空，插入种子数据
                    console.log('[usePrompts] Database is empty, inserting seed data');
                    await db.prompts.bulkAdd(SEED_PROMPTS);
                }

                // 3. 订阅 prompts 变化（Dexie 的 liveQuery）
                const subscription = liveQuery(() =>
                    db.prompts
                        .orderBy('createdAt')
                        .reverse()
                        .toArray()
                ).subscribe({
                    next: (prompts) => {
                        setPrompts(prompts);
                        setLoading(false);
                    },
                    error: (error) => {
                        console.error('[usePrompts] Error loading prompts:', error);
                        setLoading(false);
                    }
                });

                return () => subscription.unsubscribe();
            } catch (error) {
                console.error('[usePrompts] Error initializing database:', error);
                setLoading(false);
            }
        };

        initDatabase();
    }, []);

    /**
     * 创建新的提示词
     */
    const createPrompt = async (prompt: Prompt) => {
        try {
            await db.prompts.add(prompt);
        } catch (error) {
            console.error('[usePrompts] Error creating prompt:', error);
            throw error;
        }
    };

    /**
     * 更新现有提示词
     */
    const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
        try {
            await db.prompts.update(id, {
                ...updates,
                updatedAt: Date.now()
            });
        } catch (error) {
            console.error('[usePrompts] Error updating prompt:', error);
            throw error;
        }
    };

    /**
     * 删除提示词
     */
    const deletePrompt = async (id: string) => {
        try {
            await db.prompts.delete(id);
        } catch (error) {
            console.error('[usePrompts] Error deleting prompt:', error);
            throw error;
        }
    };

    /**
     * 批量导入提示词
     * @param importedPrompts - 要导入的 prompts 数组
     * @param mode - 导入模式：'merge'（合并）或 'replace'（替换）
     */
    const importPrompts = async (
        importedPrompts: Prompt[],
        mode: 'merge' | 'replace' = 'merge'
    ) => {
        try {
            if (mode === 'replace') {
                // 替换模式：清空现有数据再导入
                await db.prompts.clear();
                await db.prompts.bulkAdd(importedPrompts);
            } else {
                // 合并模式：为导入的 prompts 生成新 ID，作为新条目添加
                // 这样可以避免 ID 冲突，并允许导入重复内容的副本
                const promptsToImport = importedPrompts.map(p => ({
                    ...p,
                    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    createdAt: Date.now(), // 更新为当前时间，使其显示在列表顶部
                    updatedAt: Date.now()
                }));

                if (promptsToImport.length > 0) {
                    await db.prompts.bulkAdd(promptsToImport);
                }

                return promptsToImport.length;
            }

            return importedPrompts.length;
        } catch (error) {
            console.error('[usePrompts] Error importing prompts:', error);
            throw error;
        }
    };

    return {
        prompts,
        loading,
        createPrompt,
        updatePrompt,
        deletePrompt,
        importPrompts,
    };
};
