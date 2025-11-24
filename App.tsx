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
  const { prompts, createPrompt, updatePrompt, deletePrompt } = usePrompts();
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

  const handleCreateOrUpdate = (data: PromptFormData) => {
    const tagsArray = parseTags(data.tags);

    if (currentPrompt) {
      // Update
      updatePrompt(currentPrompt.id, {
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
      createPrompt(newPrompt);
      addToast('New prompt created');
    }
  };

  // Trigger modal
  const initiateDelete = (id: string) => {
    setPromptToDelete(id);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (promptToDelete) {
      deletePrompt(promptToDelete);
      removeFromSelection(promptToDelete);
      addToast('Prompt deleted');
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

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedPrompts, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `promptly-export-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    addToast(`${selectedPrompts.length} prompts downloaded`);
    clearSelection();
  };



  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans pb-24 sm:pb-12">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={clearSelection}>
            <div className="bg-slate-900 text-white p-1.5 rounded-lg shadow-sm">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Promptly</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openCreateModal}
              className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95"
            >
              <PlusIcon className="w-5 h-5" />
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