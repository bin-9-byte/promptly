import React, { useState, useEffect, useRef } from 'react';
import { Prompt, PromptFormData } from '../types';
import { SparklesIcon, XMarkIcon, HashtagIcon } from './Icons';
import { optimizePrompt } from '../services/geminiService';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PromptFormData) => void;
  initialData?: Prompt | null;
  availableTags?: string[];
}

const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose, onSave, initialData, availableTags = [] }) => {
  const [formData, setFormData] = useState<Omit<PromptFormData, 'tags'>>({
    title: '',
    content: ''
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title,
          content: initialData.content,
        });
        setTags(initialData.tags);
      } else {
        setFormData({ title: '', content: '' });
        setTags([]);
      }
      setTagInput('');
      checkApiKey();
    }
  }, [isOpen, initialData]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkApiKey = async () => {
      // @ts-ignore
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
          // @ts-ignore
           const hasKey = await window.aistudio.hasSelectedApiKey();
           setHasApiKey(hasKey);
      }
  }

  const handleSelectKey = async () => {
       // @ts-ignore
       if (window.aistudio && window.aistudio.openSelectKey) {
          // @ts-ignore
           await window.aistudio.openSelectKey();
           checkApiKey();
       }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptimize = async () => {
    if (!formData.content.trim()) return;
    
    setIsOptimizing(true);
    try {
      const optimized = await optimizePrompt(formData.content);
      setFormData(prev => ({ ...prev, content: optimized }));
    } catch (error) {
      alert("Failed to optimize prompt. Ensure you have selected an API key.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: tags.join(', ') // Convert back to string format for PromptFormData
    });
    onClose();
  };

  // Tag Handling Logic
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
    setShowSuggestions(true);
  };

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const filteredSuggestions = availableTags.filter(
    t => !tags.includes(t) && t.toLowerCase().includes(tagInput.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100/80">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            {initialData ? 'Edit Prompt' : 'Create New Prompt'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          <form id="prompt-form" onSubmit={handleSubmit} className="contents">
            
            {/* Title - Large Input */}
            <div className="group">
              <label htmlFor="title" className="sr-only">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Untitled Prompt"
                className="w-full px-0 py-2 text-2xl font-bold text-slate-900 placeholder-slate-300 border-0 border-b-2 border-slate-100 focus:border-indigo-500 focus:ring-0 transition-colors bg-transparent placeholder:font-bold"
                required
              />
            </div>

            {/* Content - Main Area */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="content" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  Prompt Content
                </label>
                
                {/* AI Button - Pill style */}
                {hasApiKey ? (
                   <button
                      type="button"
                      onClick={handleOptimize}
                      disabled={isOptimizing || !formData.content}
                      className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all shadow-sm
                      ${isOptimizing 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md'}`}
                      >
                      <SparklesIcon className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-pulse' : ''}`} />
                      {isOptimizing ? 'Optimizing...' : 'AI Optimize'}
                  </button>
                ) : (
                  <button
                      type="button"
                      onClick={handleSelectKey}
                       className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                       Unlock AI Features
                  </button>
                )}
              </div>

              <div className="relative group">
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Type your prompt here..."
                  rows={10}
                  className="w-full px-5 py-4 rounded-xl bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 font-mono text-sm leading-relaxed resize-none text-slate-700"
                  required
                />
              </div>
            </div>

            {/* Tags - Rich Input */}
            <div className="relative" ref={wrapperRef}>
              <label htmlFor="tags" className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tags</label>
              
              <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all min-h-[46px]">
                <div className="pl-1 flex items-center pointer-events-none">
                   <HashtagIcon className="w-4 h-4 text-slate-400" />
                </div>
                
                {tags.map((tag, index) => (
                  <span key={index} className="flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="text-slate-400 hover:text-red-500 focus:outline-none"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={tags.length === 0 ? "Add tags (press Enter)..." : ""}
                  className="flex-grow min-w-[120px] bg-transparent outline-none text-sm py-1 pl-1 placeholder:text-slate-400"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-100 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10 custom-scrollbar">
                  {filteredSuggestions.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-between group"
                    >
                      <span>{tag}</span>
                      <span className="opacity-0 group-hover:opacity-100 text-xs text-slate-400">Add</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="prompt-form"
            className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all active:scale-95"
          >
            {initialData ? 'Save Changes' : 'Create Prompt'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;