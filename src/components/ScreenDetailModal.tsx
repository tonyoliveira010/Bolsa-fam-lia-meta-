import React, { useState } from 'react';
import { AppScreen } from '../data/mobbinData';
import { DeviceFrame } from './DeviceFrame';

interface ScreenDetailModalProps {
  screen: AppScreen;
  onClose: () => void;
  onSelectScreen: (screen: AppScreen) => void;
}

export const ScreenDetailModal: React.FC<ScreenDetailModalProps> = ({ screen, onClose }) => {
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyText = () => {
    navigator.clipboard.writeText(`${screen.appName} - ${screen.screenName}: ${screen.description}`);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#141414]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#ffffff] text-[#141414] w-full max-w-4xl rounded-[24px] overflow-hidden shadow-none border border-[#e0e0e0] flex flex-col md:flex-row max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Left: Device Canvas */}
        <div className="md:w-1/2 bg-[#f3f3f3] p-6 sm:p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#e0e0e0] relative">
          <DeviceFrame screen={screen} size="lg" />
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-xs text-[#141414] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#e0e0e0]">
            {screen.platform} Native Interface
          </div>
        </div>

        {/* Right: Inspection Sidebar */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[30%] squircle text-white flex items-center justify-center font-bold text-base"
                  style={{ backgroundColor: screen.appIconBg }}
                >
                  {screen.iconLetter}
                </div>
                <div>
                  <h3 className="font-heading-tight text-xl font-bold text-[#141414]">{screen.appName}</h3>
                  <span className="text-xs text-[#707070] font-medium">{screen.appCategory} · Added {screen.dateAdded}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#f3f3f3] hover:bg-[#e0e0e0] flex items-center justify-center text-sm font-bold text-[#141414] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Screen Name & Description */}
            <div>
              <span className="text-xs text-[#707070] uppercase tracking-wider font-semibold block mb-1">
                {screen.flowType} Flow
              </span>
              <h2 className="font-heading-tight text-xl sm:text-2xl font-bold text-[#141414]">
                {screen.screenName}
              </h2>
              <p className="text-sm text-[#707070] font-body-regular mt-2 leading-relaxed">
                {screen.description}
              </p>
            </div>

            {/* Micro-Interaction Highlights */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#141414] uppercase tracking-wider block">
                Pattern Highlights
              </span>
              <div className="space-y-1.5">
                {screen.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#141414] bg-[#f3f3f3] px-3 py-2 rounded-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#141414]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata Table */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f0f0f0] text-xs">
              <div className="bg-[#f0f0f0] p-2.5 rounded-xl">
                <span className="text-[#707070] block text-[10px]">Community Rating</span>
                <b className="text-sm text-[#141414]">★ {screen.rating} / 5.0</b>
              </div>
              <div className="bg-[#f0f0f0] p-2.5 rounded-xl">
                <span className="text-[#707070] block text-[10px]">Reference Views</span>
                <b className="text-sm text-[#141414]">{screen.views} designers</b>
              </div>
            </div>
          </div>

          {/* Action pills */}
          <div className="space-y-2 pt-4 border-t border-[#f0f0f0]">
            <button
              onClick={handleCopyText}
              className="w-full py-2.5 px-4 bg-[#f3f3f3] hover:bg-[#e0e0e0] text-[#141414] text-xs font-semibold rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{copiedText ? '✓ Text Copied to Clipboard' : '📋 Copy Screen Text'}</span>
            </button>
            <button
              onClick={() => alert(`Opening ${screen.appName} in the Mobbin Figma Plugin...`)}
              className="w-full py-2.5 px-4 bg-[#141414] hover:bg-[#262626] text-[#ffffff] text-xs font-semibold rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Export to Figma Plugin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
