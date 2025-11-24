import React, { useState } from 'react';
import { Prompt, PromptFormData } from './types';
import PromptModal from './components/PromptModal';
import ConfirmationModal from './components/ConfirmationModal';
import { PlusIcon, SparklesIcon } from './components/Icons';
import { Toast } from './components/Toast/Toast';
import { SearchBar } from './components/SearchBar/SearchBar';
import { TagFilter } from './components/TagFilter/TagFilter';
import { SelectionBar } from './components/SelectionBar/SelectionBar';
import { PromptGrid } from './components/PromptGrid/PromptGrid';
import { useToast } from './hooks/useToast';
import { usePrompts } from './hooks/usePrompts';
import { usePromptFilters } from './hooks/usePromptFilters';
import { useSelection } from './hooks/useSelection';
import { parseTags } from './utils/tagUtils';

// ============================================================
// 主应用组件
// ============================================================


const App: React.FC = () => {
  // Custom Hooks
  const { prompts, loading, createPrompt, updatePrompt, deletePrompt, importPrompts } = usePrompts();
  const { toasts, addToast, removeToast } = useToast();
  const {
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    toggleTagSelection,
    allTags,
    filteredPrompts,
  } = usePromptFilters(prompts);
  const { selectedIds, toggleSelection, clearSelection, removeFromSelection } = useSelection();

  // Local UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // ============================================================
  // 事件处理函数
  // ============================================================

  const handleCreateOrUpdate = async (data: PromptFormData) => {
    const tagsArray = parseTags(data.tags);

    try {
      if (currentPrompt) {
        // Update
        await updatePrompt(currentPrompt.id, {
          title: data.title,
          content: data.content,
          tags: tagsArray,
        });
        addToast('Prompt updated successfully');
      } else {
        // Create
        const newPrompt: Prompt = {
          id: Date.now().toString(),
          title: data.title,
          content: data.content,
          tags: tagsArray,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          isFavorite: false,
        };
        await createPrompt(newPrompt);
        addToast('New prompt created');
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      addToast('Failed to save prompt', 'error');
    }
  };

  // Trigger modal
  const initiateDelete = (id: string) => {
    setPromptToDelete(id);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (promptToDelete) {
      try {
        await deletePrompt(promptToDelete);
        removeFromSelection(promptToDelete);
        addToast('Prompt deleted');
      } catch (error) {
        console.error('Error deleting prompt:', error);
        addToast('Failed to delete prompt', 'error');
      }
      setPromptToDelete(null);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    addToast('Copied to clipboard');
  };

  const openCreateModal = () => {
    setCurrentPrompt(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prompt: Prompt) => {
    setCurrentPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleDownloadSelected = () => {
    const selectedPrompts = prompts.filter(p => selectedIds.has(p.id));
    if (selectedPrompts.length === 0) return;

    const blob = new Blob([JSON.stringify(selectedPrompts, null, 2)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.href = url;
    downloadAnchorNode.download = `promptly-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();

    // 稍微延迟移除，确保下载触发
    setTimeout(() => {
      document.body.removeChild(downloadAnchorNode);
      URL.revokeObjectURL(url);
    }, 100);

    addToast(`${selectedPrompts.length} prompts downloaded`);
    clearSelection();
  };

  /**
   * 处理导入 JSON 文件
   */
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const imported: Prompt[] = JSON.parse(content);

        // 验证导入数据格式
        if (!Array.isArray(imported)) {
          addToast('Invalid file format', 'error');
          return;
        }

        // 导入（合并模式）
        const count = await importPrompts(imported, 'merge');
        addToast(`Successfully imported ${count} new prompts`);
      } catch (error) {
        console.error('Error importing file:', error);
        addToast('Failed to import file', 'error');
      }
    };
    reader.readAsText(file);

    // 清空 input，允许重复导入同一文件
    event.target.value = '';
  };



  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans pb-24 sm:pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <SparklesIcon className="w-8 h-8 text-indigo-600" />
              Promptly
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage your AI prompts efficiently</p>
          </div>
          <div className="flex gap-3">
            {/* 隐藏的文件输入 */}
            <input
              type="file"
              id="import-input"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            {/* 导入按钮 */}
            <label
              htmlFor="import-input"
              className="cursor-pointer inline-flex items-center px-5 py-2.5 border border-slate-300 text-sm font-semibold text-slate-700 bg-white rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import
            </label>
            {/* 创建新 Prompt 按钮 */}
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              New Prompt
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 w-full">

        {/* Controls: Search & Tags */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

          <TagFilter
            allTags={allTags}
            selectedTag={selectedTag}
            onClearTag={() => setSelectedTag(null)}
            onSelectTag={toggleTagSelection}
            isDropdownOpen={isFilterDropdownOpen}
            onToggleDropdown={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
          />
        </div>

        {/* Grid */}
        <PromptGrid
          prompts={filteredPrompts}
          searchTerm={searchTerm}
          selectedTag={selectedTag}
          selectedIds={selectedIds}
          onEdit={openEditModal}
          onDelete={initiateDelete}
          onCopy={handleCopy}
          onToggleSelect={toggleSelection}
          onCreateNew={openCreateModal}
        />
      </main>

      {/* Floating Selection Bar */}
      <SelectionBar
        selectedCount={selectedIds.size}
        onCancel={clearSelection}
        onExport={handleDownloadSelected}
      />

      {/* Mobile Floating Action Button (Hide when selection is active) */}
      <button
        onClick={openCreateModal}
        className={`fixed bottom-8 right-8 sm:hidden bg-slate-900 text-white p-4 rounded-full shadow-xl shadow-slate-900/30 hover:bg-slate-800 transition-all duration-300 active:scale-95 z-30 ${selectedIds.size > 0 ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      <PromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateOrUpdate}
        initialData={currentPrompt}
        availableTags={allTags}
      />

      <ConfirmationModal
        isOpen={!!promptToDelete}
        onClose={() => setPromptToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Prompt?"
        message="Are you sure you want to delete this prompt? This action cannot be undone."
      />

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast message={toast} onClose={removeToast} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;