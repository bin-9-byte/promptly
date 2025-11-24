import Dexie, { Table } from 'dexie';
import { Prompt } from '../types';

// ============================================================
// Promptly IndexedDB 数据库定义
// 使用 Dexie.js 简化 IndexedDB 操作
// ============================================================

export class PromptsDatabase extends Dexie {
    // 声明表类型
    prompts!: Table<Prompt, string>;

    constructor() {
        super('PromptsDB');

        // 定义数据库 schema
        // 版本 1：初始 schema
        this.version(1).stores({
            // prompts 表：主键是 id，索引字段包括 tags, createdAt, isFavorite
            prompts: 'id, createdAt, updatedAt, isFavorite, *tags'
        });
    }
}

// 创建数据库实例（单例）
export const db = new PromptsDatabase();

// ============================================================
// 数据迁移工具函数
// 从 localStorage 迁移数据到 IndexedDB
// ============================================================

const LOCALSTORAGE_KEY = 'promptly_data';
const MIGRATION_FLAG_KEY = 'promptly_migrated_to_indexeddb';

/**
 * 从 localStorage 迁移数据到 IndexedDB
 * @returns 迁移的数据条数
 */
export const migrateFromLocalStorage = async (): Promise<number> => {
    // 检查是否已经迁移过
    if (localStorage.getItem(MIGRATION_FLAG_KEY)) {
        console.log('[Migration] Already migrated, skipping');
        return 0;
    }

    try {
        // 读取 localStorage 数据
        const savedData = localStorage.getItem(LOCALSTORAGE_KEY);
        if (!savedData) {
            console.log('[Migration] No data in localStorage');
            localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
            return 0;
        }

        // 解析数据
        const prompts: Prompt[] = JSON.parse(savedData);
        console.log(`[Migration] Found ${prompts.length} prompts in localStorage`);

        // 批量插入到 IndexedDB
        await db.prompts.bulkAdd(prompts);
        console.log(`[Migration] Successfully migrated ${prompts.length} prompts`);

        // 标记已迁移
        localStorage.setItem(MIGRATION_FLAG_KEY, 'true');

        // 可选：清除 localStorage 中的旧数据（保守起见，暂时保留）
        // localStorage.removeItem(LOCALSTORAGE_KEY);

        return prompts.length;
    } catch (error) {
        console.error('[Migration] Error during migration:', error);
        throw error;
    }
};
