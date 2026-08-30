import React from 'react';
import { Category } from '../../types/project';
import { Layers } from 'lucide-react';

interface ProjectFilterProps {
  categories: Category[];
  selectedCategory: string;
  selectedType: string;
  onSelectCategory: (catSlug: string) => void;
  onSelectType: (type: string) => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  categories,
  selectedCategory,
  selectedType,
  onSelectCategory,
  onSelectType
}) => {
  const projectTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'product', label: 'Completed Software' },
    { id: 'concept', label: 'R&D Concepts' },
    { id: 'experimental', label: 'Playground' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm'
          }`}
        >
          ALL CATEGORIES
        </button>

        {categories.filter(c => c.slug !== 'all').map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider whitespace-nowrap transition-all ${
              selectedCategory.toLowerCase() === cat.slug.toLowerCase()
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm'
            }`}
          >
            {cat.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Sub-filter by Project Type */}
      <div className="flex items-center gap-2 border-t border-slate-200 pt-4 text-xs">
        <span className="text-slate-500 font-mono font-semibold flex items-center gap-1 mr-2">
          <Layers className="w-3.5 h-3.5 text-indigo-600" /> Filter Type:
        </span>
        {projectTypes.map(t => (
          <button
            key={t.id}
            onClick={() => onSelectType(t.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedType === t.id
                ? 'bg-indigo-100 text-indigo-800 font-bold border border-indigo-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};
