import React from 'react';
import { Prompt } from '../../types';
import PromptCard from '../PromptCard';
import { SparklesIcon } from '../Icons';

// ============================================================
// Prompt 网格组件
// 显示 Prompt 卡片网格或空状态
// ============================================================

interface PromptGridProps {
    prompts: Prompt[];
    searchTerm: string;
    selectedTag: string | null;
    selectedIds: Set<string>;
    onEdit: (prompt: Prompt) => void;
    onDelete: (id: string) => void;
    onCopy: (content: string) => void;
    onToggleSelect: (id: string) => void;
    onCreateNew: () => void;
}

export const PromptGrid: React.FC<PromptGridProps> = ({
    prompts,
    searchTerm,
    selectedTag,
    selectedIds,
    onEdit,
    onDelete,
    onCopy,
    onToggleSelect,
    onCreateNew,
}) => {
    if (prompts.length > 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {prompts.map(prompt => (
                    <PromptCard
                        key={prompt.id}
                        prompt={prompt}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onCopy={onCopy}
                        isSelected={selectedIds.has(prompt.id)}
                        onToggleSelect={onToggleSelect}
                    />
                ))}
            </div>
        );
    }

    // Empty State
    return (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100/60 shadow-sm border-dashed">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6">
                <SparklesIcon className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">No prompts found</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                {searchTerm || selectedTag
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Your collection is empty. Create your first prompt to get started."}
            </p>
            {(!searchTerm && !selectedTag) && (
                <button
                    onClick={onCreateNew}
                    className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95"
                >
                    Create new prompt
                </button>
            )}
        </div>
    );
};
