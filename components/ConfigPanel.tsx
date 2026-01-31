'use client';

import { useState } from 'react';
import { ProductOption, ProductOptions } from '@/lib/mock-data';

interface ConfigPanelProps {
  selection: {
    frame: ProductOption;
    cushion: ProductOption;
    backrest: ProductOption;
  };
  onSelect: (category: 'frame' | 'cushion' | 'backrest', option: ProductOption) => void;
  options: ProductOptions;
}

interface OptionSectionProps {
  title: string;
  description: string;
  options: ProductOption[];
  selectedId: string;
  onSelect: (option: ProductOption) => void;
  category: 'frame' | 'cushion' | 'backrest';
  onPreview: (option: ProductOption) => void;
}

function OptionSection({
  title,
  description,
  options,
  selectedId,
  onSelect,
  category,
  onPreview,
}: OptionSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {options.map((option) => {
          const isSelected = option.id === selectedId;
          const isHovered = option.id === hoveredId;

          return (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option);
                onPreview(option);
              }}
              onMouseEnter={() => setHoveredId(option.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                relative aspect-square rounded-lg overflow-hidden transition-all duration-200
                ${isSelected
                  ? 'ring-2 ring-black ring-offset-2 scale-105 shadow-lg'
                  : 'ring-1 ring-gray-200 hover:ring-gray-400 hover:scale-102'
                }
              `}
              aria-label={`Select ${option.name}`}
              aria-pressed={isSelected}
            >
              <img
                src={option.swatchUrl}
                alt={option.name}
                className="w-full h-full object-cover"
              />

              {/* Tooltip on hover */}
              {isHovered && !isSelected && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs py-1 px-2 text-center">
                  {option.name}
                </div>
              )}

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected option name display */}
      <p className="mt-3 text-sm font-medium text-gray-700">
        Selected: <span className="text-gray-900">{options.find(o => o.id === selectedId)?.name}</span>
      </p>
    </div>
  );
}

export default function ConfigPanel({ selection, onSelect, options }: ConfigPanelProps) {
  const [previewOption, setPreviewOption] = useState<ProductOption | null>(null);

  // Show preview when selection changes
  const handleSelect = (category: 'frame' | 'cushion' | 'backrest', option: ProductOption) => {
    onSelect(category, option);
    setPreviewOption(option);
  };

  return (
    <div className="space-y-6">
      {/* Floating Preview Panel */}
      {previewOption && (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-64 animate-in fade-in zoom-in duration-300">
          <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={previewOption.swatchUrl}
              alt={previewOption.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center font-semibold text-gray-900">{previewOption.name}</p>
          <button
            onClick={() => setPreviewOption(null)}
            className="mt-2 w-full py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      )}

      <OptionSection
        title="Frame"
        description="Choose the frame material and finish"
        options={options.frames}
        selectedId={selection.frame.id}
        onSelect={(option) => handleSelect('frame', option)}
        category="frame"
        onPreview={setPreviewOption}
      />

      <OptionSection
        title="Cushion"
        description="Select your preferred cushion fabric"
        options={options.cushions}
        selectedId={selection.cushion.id}
        onSelect={(option) => handleSelect('cushion', option)}
        category="cushion"
        onPreview={setPreviewOption}
      />

      <OptionSection
        title="Backrest"
        description="Customize the backrest style"
        options={options.backrests}
        selectedId={selection.backrest.id}
        onSelect={(option) => handleSelect('backrest', option)}
        category="backrest"
        onPreview={setPreviewOption}
      />
    </div>
  );
}
