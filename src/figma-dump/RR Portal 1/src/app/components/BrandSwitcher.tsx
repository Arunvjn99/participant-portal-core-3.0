/**
 * Brand Switcher Component (Development/Demo Only)
 * 
 * This component allows quick switching between brand presets.
 * Remove this component in production builds.
 */

import { useState } from 'react';
import { Palette, X } from 'lucide-react';
import { brandPresets } from '../../config/brandPresets';

export function BrandSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  
  const presets = [
    { id: 'retirePro', name: 'RetirePro', color: '#0043AA', description: 'Default Blue' },
    { id: 'wealthBuilders', name: 'WealthBuilders', color: '#047857', description: 'Finance Green' },
    { id: 'futureFocus', name: 'FutureFocus', color: '#7C3AED', description: 'Modern Purple' },
    { id: 'secureRetire', name: 'SecureRetire', color: '#0891B2', description: 'Trust Teal' },
    { id: 'prospectWealth', name: 'ProspectWealth', color: '#EA580C', description: 'Energy Orange' },
    { id: 'trustPath', name: 'TrustPath', color: '#1E40AF', description: 'Corporate Navy' },
    { id: 'horizonPlan', name: 'HorizonPlan', color: '#4F46E5', description: 'Professional Indigo' },
    { id: 'verdantRetirement', name: 'Verdant', color: '#15803D', description: 'Stable Forest' },
  ];

  const handlePresetSelect = (presetId: string) => {
    alert(`To switch to ${presetId}, update /src/config/branding.ts to use brandPresets.${presetId}`);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110"
        title="Brand Switcher (Dev Mode)"
      >
        <Palette className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-white" />
          <h3 className="text-white font-bold">Brand Presets</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Preset List */}
      <div className="max-h-96 overflow-y-auto p-3 space-y-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetSelect(preset.id)}
            className="w-full text-left p-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex-shrink-0 shadow-sm"
                style={{ backgroundColor: preset.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {preset.name}
                </div>
                <div className="text-xs text-gray-500">
                  {preset.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-2 text-xs text-gray-600 border-t border-gray-200">
        <p className="mb-1 font-medium">Development Mode Only</p>
        <p>Update <code className="bg-gray-200 px-1 rounded">/src/config/branding.ts</code> to switch brands.</p>
      </div>
    </div>
  );
}
