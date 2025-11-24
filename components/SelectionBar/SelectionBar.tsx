import React from 'react';
import { DownloadIcon } from '../Icons';

// ============================================================
// 选择栏组件
// 底部浮动的选择工具栏
// ============================================================

interface SelectionBarProps {
    selectedCount: number;
    onCancel: () => void;
    onExport: () => void;
}

export const SelectionBar: React.FC<SelectionBarProps> = ({
    selectedCount,
    onCancel,
    onExport,
}) => {
    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] transform transition-transform duration-300 ${selectedCount > 0 ? 'translate-y-0' : 'translate-y-full'}`}
        >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 bg-slate-900 text-white text-xs rounded-full">
                            {selectedCount}
                        </span>
                        Selected
                    </span>
                    <button
                        onClick={onCancel}
                        className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Export JSON
                </button>
            </div>
        </div>
    );
};
