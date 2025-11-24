import React, { useEffect } from 'react';
import { ToastMessage, ToastType } from '../../types';
import { UI_CONSTANTS } from '../../config/constants';

// ============================================================
// Toast 组件
// 单个 Toast 通知的 UI 组件
// ============================================================

interface ToastProps {
    message: ToastMessage;
    onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(message.id), UI_CONSTANTS.TOAST_DURATION);
        return () => clearTimeout(timer);
    }, [message.id, onClose]);

    const bgColors = {
        [ToastType.SUCCESS]: 'bg-slate-900 text-white',
        [ToastType.ERROR]: 'bg-red-500 text-white',
        [ToastType.INFO]: 'bg-blue-600 text-white',
    };

    return (
        <div className={`fixed bottom-6 right-6 px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 transform transition-all animate-fade-in-up z-50 ${bgColors[message.type]}`}>
            <span className="text-sm font-medium">{message.message}</span>
        </div>
    );
};
