import { useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '../types';

// ============================================================
// Toast 管理 Hook
// 统一管理应用中的所有 Toast 通知
// ============================================================

/**
 * Toast 管理 Hook
 * @returns toasts 数组、添加 Toast 的方法、移除 Toast 的方法
 */
export const useToast = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    /**
     * 添加一个新的 Toast 通知
     * @param message - 通知消息
     * @param type - 通知类型（SUCCESS/ERROR/INFO）
     */
    const addToast = useCallback((message: string, type: ToastType = ToastType.SUCCESS) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    /**
     * 移除一个 Toast 通知
     * @param id - Toast ID
     */
    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return {
        toasts,
        addToast,
        removeToast,
    };
};
