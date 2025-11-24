import { useState } from 'react';

// ============================================================
// 选择管理 Hook
// 管理多选功能的状态
// ============================================================

/**
 * 选择管理 Hook
 * @returns 选中的 ID 集合和相关操作方法
 */
export const useSelection = () => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    /**
     * 切换单个项的选择状态
     */
    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    /**
     * 清除所有选择
     */
    const clearSelection = () => {
        setSelectedIds(new Set());
    };

    /**
     * 删除项目时同步清除选择
     */
    const removeFromSelection = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    return {
        selectedIds,
        toggleSelection,
        clearSelection,
        removeFromSelection,
    };
};
