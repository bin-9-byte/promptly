import React from 'react';
import { UI_CONSTANTS } from '../../config/constants';

// ============================================================
// 标签过滤器组件
// ============================================================

interface TagFilterProps {
    allTags: string[];
    selectedTag: string | null;
    onClearTag: () => void;
    onSelectTag: (tag: string) => void;
    isDropdownOpen: boolean;
    onToggleDropdown: () => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
    allTags,
    selectedTag,
    onClearTag,
    onSelectTag,
    isDropdownOpen,
    onToggleDropdown,
}) => {
    const inlineTags = allTags.slice(0, UI_CONSTANTS.FILTER_TAG_LIMIT);
    const hasMoreTags = allTags.length > UI_CONSTANTS.FILTER_TAG_LIMIT;
    const isHiddenTagSelected = selectedTag && !inlineTags.includes(selectedTag);

    return (
        <div className="relative flex flex-wrap gap-2 items-center justify-start md:justify-end z-20">
            {/* Backdrop for dropdown */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-30 bg-transparent"
                    onClick={onToggleDropdown}
                />
            )}

            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Filter</span>

            {/* All Button */}
            <button
                onClick={onClearTag}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${!selectedTag ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
            >
                All
            </button>

            {/* Inline Tags */}
            {inlineTags.map(tag => (
                <button
                    key={tag}
                    onClick={() => onSelectTag(tag)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${selectedTag === tag ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                >
                    #{tag}
                </button>
            ))}

            {/* Expand Dropdown Trigger */}
            {hasMoreTags && (
                <div className="relative">
                    <button
                        onClick={onToggleDropdown}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors flex items-center gap-1 z-40 relative
              ${isDropdownOpen || isHiddenTagSelected
                                ? 'bg-slate-800 text-white shadow-md shadow-slate-800/20'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                        title="Show all tags"
                    >
                        {isDropdownOpen ? 'Close' : `+${allTags.length - UI_CONSTANTS.FILTER_TAG_LIMIT}`}
                    </button>

                    {/* Floating Dropdown Window */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">All Tags</h4>
                                <span className="text-xs text-slate-300 font-mono">{allTags.length} total</span>
                            </div>
                            <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            onSelectTag(tag);
                                            onToggleDropdown();
                                        }}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${selectedTag === tag
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/10'
                                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
