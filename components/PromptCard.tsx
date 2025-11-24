import React, { useState } from 'react';
import { Prompt } from '../types';
import { PencilIcon, TrashIcon, ClipboardIcon } from './Icons';
import { UI_CONSTANTS } from '../config/constants';

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onCopy: (content: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onEdit,
  onDelete,
  onCopy,
  isSelected,
  onToggleSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = prompt.tags.length > UI_CONSTANTS.TAG_DISPLAY_LIMIT && !isExpanded;
  const displayTags = shouldTruncate ? prompt.tags.slice(0, UI_CONSTANTS.TAG_DISPLAY_LIMIT) : prompt.tags;
  const hiddenCount = prompt.tags.length - UI_CONSTANTS.TAG_DISPLAY_LIMIT;

  return (
    <div
      className={`
        group relative flex flex-col bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-1
        ${isSelected
          ? 'border-slate-800 shadow-lg ring-1 ring-slate-800'
          : 'border-slate-200 hover:shadow-xl hover:shadow-slate-200/50'
        }
      `}
    >
      {/* Selection Overlay/Indicator */}
      <div
        className="absolute top-5 right-5 z-20 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(prompt.id);
        }}
        title={isSelected ? "Deselect" : "Select"}
      >
        <div className={`
          w-6 h-6 rounded-full border transition-all duration-300 flex items-center justify-center
          ${isSelected
            ? 'bg-slate-900 border-slate-900 scale-100'
            : 'bg-transparent border-slate-300 hover:border-slate-400 group-hover:bg-white'
          }
        `}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${isSelected ? 'scale-100' : 'scale-0'}`}
          >
            <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div
        className="p-7 flex flex-col h-full cursor-pointer"
        onClick={() => onEdit(prompt)}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4 pr-10">
          <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
            {prompt.title}
          </h3>
        </div>

        {/* Content Preview */}
        <div className="mb-8 flex-grow">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/80 group-hover:border-slate-200 transition-colors">
            <div className="max-h-16 overflow-y-auto text-slate-600 text-sm leading-relaxed font-mono custom-scrollbar">
              {prompt.content}
            </div>
          </div>
        </div>

        {/* Tags & Footer */}
        <div className="mt-auto pt-5 border-t border-slate-100 flex items-end justify-between min-h-[2.5rem]">
          {/* Tags Container */}
          <div className="flex flex-wrap items-center gap-2 flex-1 mr-2">
            {prompt.tags.length > 0 ? (
              <>
                {displayTags.map((tag, i) => (
                  <span key={`${tag}-${i}`} className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold bg-slate-100 text-slate-600 rounded-md border border-slate-200/50 whitespace-nowrap">
                    {tag.trim()}
                  </span>
                ))}
                {shouldTruncate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(true);
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200/50 transition-colors whitespace-nowrap"
                  >
                    +{hiddenCount}
                  </button>
                )}
                {isExpanded && prompt.tags.length > UI_CONSTANTS.TAG_DISPLAY_LIMIT && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(false);
                    }}
                    className="px-2 py-1 text-[10px] font-medium text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap ml-1"
                  >
                    Show less
                  </button>
                )}
              </>
            ) : (
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-300">No tags</span>
            )}
          </div>

          {/* Actions */}
          <div
            className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 flex-shrink-0 bg-white pl-2 pb-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopy(prompt.content);
              }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Copy"
            >
              <ClipboardIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(prompt);
              }}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(prompt.id);
              }}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;