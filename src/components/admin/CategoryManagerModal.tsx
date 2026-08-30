import React, { useState } from 'react';
import { Category } from '../../types/project';
import { projectService } from '../../services/projectService';
import { X, Plus, Trash2, FolderPlus } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  onRefresh: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  categories,
  onClose,
  onRefresh
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  if (!isOpen) return null;

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatName.trim()) {
      await projectService.createCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim()
      });
      setNewCatName('');
      setNewCatDesc('');
      onRefresh();
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      await projectService.deleteCategory(id);
      onRefresh();
    }
  };

  return (
    <div className="modal-overlay animate-fadeIn">
      <div
        className="relative w-full max-w-lg p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col gap-6"
        style={{
          background: '#0C0C10',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 60px rgba(168, 85, 247, 0.15)',
          color: '#F0F0F5'
        }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
              style={{
                background: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                color: '#A855F7'
              }}
            >
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">Manage Showcase Categories</h2>
              <p className="text-xs text-zinc-400 font-mono">Organize project taxonomy</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add Category Form */}
        <form
          onSubmit={handleCreateCategory}
          className="flex flex-col gap-3 p-4 rounded-2xl"
          style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <h3 className="text-xs font-mono font-bold text-purple-400 uppercase">Add New Category</h3>
          <div>
            <input
              type="text"
              required
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="e.g. Autonomous AI"
              className="form-input text-xs"
              style={{ background: '#13131A', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#F0F0F5' }}
            />
          </div>
          <div>
            <input
              type="text"
              value={newCatDesc}
              onChange={e => setNewCatDesc(e.target.value)}
              placeholder="Category description..."
              className="form-input text-xs"
              style={{ background: '#13131A', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#F0F0F5' }}
            />
          </div>
          <button type="submit" className="editorial-btn py-2 text-xs justify-center">
            <Plus className="w-3.5 h-3.5" /> Create Category
          </button>
        </form>

        {/* Category List */}
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase">Existing Categories ({categories.length})</h3>
          {categories.map(cat => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-3 rounded-xl text-xs"
              style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.07)' }}
            >
              <div className="flex flex-col">
                <span className="font-bold text-white">{cat.name}</span>
                <span className="text-zinc-500 font-mono text-[10px]">/{cat.slug}</span>
              </div>
              {cat.slug !== 'all' && (
                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
