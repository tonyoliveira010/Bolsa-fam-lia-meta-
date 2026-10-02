import React from 'react';
import { AppScreen } from '../data/mobbinData';

interface DeviceFrameProps {
  screen: AppScreen;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ screen, size = 'md' }) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-[180px] h-[370px] rounded-[24px] p-2',
    md: 'w-[240px] h-[490px] rounded-[28px] p-2.5',
    lg: 'w-[290px] h-[590px] rounded-[34px] p-3'
  }[size];

  return (
    <div
      className={`relative mx-auto bg-[#141414] text-[#ffffff] shadow-none flex flex-col justify-between overflow-hidden select-none border border-[#e0e0e0] ${sizeClasses}`}
    >
      {/* Dynamic Island / Notch */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#000000] rounded-full z-20 flex items-center justify-between px-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#1c1c1e]" />
        <div className="w-2 h-2 rounded-full bg-[#0a1829] ring-1 ring-[#152e4d]" />
      </div>

      {/* Screen Content based on app */}
      <div className="w-full h-full rounded-[20px] overflow-hidden bg-[#0c0c0e] flex flex-col pt-7 pb-3 px-3 relative">
        {/* Status Bar */}
        <div className="flex justify-between items-center text-[10px] text-white/70 px-1 mb-2 font-medium">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span className="text-[8px]">5G</span>
            <div className="w-3.5 h-2 rounded-xs border border-white/60 p-0.2">
              <div className="h-full bg-white rounded-2xs w-full" />
            </div>
          </div>
        </div>

        {/* Dynamic UI Content based on appName */}
        {screen.appName === 'Linear' && (
          <div className="flex-1 flex flex-col justify-between text-left text-xs text-white">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] text-[#5E6AD2] font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#5E6AD2]" />
                  ENG-842
                </span>
                <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-white/80">In Progress</span>
              </div>
              <h4 className="font-semibold text-sm leading-tight text-white">Refactor variable weight font tokens on layout engine</h4>
              <p className="text-[11px] text-white/60 leading-normal">Ensure 652 headings map directly to native font engine with zero tracking adjustments.</p>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[9px] bg-[#5E6AD2]/20 text-[#5E6AD2] px-2 py-0.5 rounded-md font-medium">Core Engine</span>
                <span className="text-[9px] bg-white/10 text-white/70 px-2 py-0.5 rounded-md">P1 Urgent</span>
                <span className="text-[9px] bg-white/10 text-white/70 px-2 py-0.5 rounded-md">Cycle 42</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-2 space-y-1.5">
              <div className="flex justify-between text-[10px] text-white/60">
                <span>Sub-issues (2/3)</span>
                <span>66%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#5E6AD2] w-2/3" />
              </div>
            </div>

            <div className="bg-[#5E6AD2] text-white rounded-full py-2 text-center text-xs font-semibold shadow-none">
              Save Changes (⌘S)
            </div>
          </div>
        )}

        {screen.appName === 'Duolingo' && (
          <div className="flex-1 flex flex-col justify-between text-center text-white">
            <div className="space-y-2 pt-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#58CC02] flex items-center justify-center text-2xl shadow-none">
                🦉
              </div>
              <h3 className="font-bold text-base leading-tight text-[#58CC02]">Super Duolingo</h3>
              <p className="text-[11px] text-white/70 px-2">Learn without interruptions with unlimited hearts & offline access.</p>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="p-2.5 rounded-xl bg-white/10 border-2 border-[#58CC02] flex items-center justify-between text-xs">
                <div>
                  <b className="block text-white">12 Months (Best Value)</b>
                  <span className="text-[10px] text-white/60">R$ 14,99 / month</span>
                </div>
                <span className="bg-[#58CC02] text-black text-[9px] font-bold px-2 py-0.5 rounded-full">Save 60%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <b className="block text-white">Monthly Plan</b>
                  <span className="text-[10px] text-white/60">R$ 29,99 / month</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#58CC02] text-[#000000] font-bold py-2.5 rounded-full text-xs cursor-pointer">
              Start 14-Day Free Trial
            </button>
          </div>
        )}

        {screen.appName === 'Airbnb' && (
          <div className="flex-1 flex flex-col justify-between text-left text-white text-xs">
            <div className="space-y-2">
              <div className="h-28 rounded-xl bg-gradient-to-tr from-rose-900 via-rose-700 to-amber-600 flex items-end p-2 relative overflow-hidden">
                <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-full">★ 4.98 (124 reviews)</span>
              </div>
              <h4 className="font-semibold text-sm leading-tight">Modern Lakefront Villa with Heated Infinity Pool</h4>
              <p className="text-[10px] text-white/60">Entire cabin in Queenstown · 3 beds · 2 baths</p>
            </div>

            <div className="border-t border-white/10 pt-2 space-y-1 text-[11px] text-white/70">
              <div className="flex justify-between">
                <span>$280 x 4 nights</span>
                <span>$1,120</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>$85</span>
              </div>
              <div className="flex justify-between font-bold text-white pt-1 border-t border-white/10">
                <span>Total (USD)</span>
                <span>$1,205</span>
              </div>
            </div>

            <button className="w-full bg-[#FF385C] text-white font-bold py-2.5 rounded-full text-xs">
              Confirm & Pay
            </button>
          </div>
        )}

        {screen.appName === 'Spotify' && (
          <div className="flex-1 flex flex-col justify-between text-center text-white">
            <div className="w-28 h-28 mx-auto rounded-xl bg-gradient-to-br from-emerald-600 to-teal-950 p-3 flex items-center justify-center shadow-none mt-2">
              <span className="text-3xl">🎵</span>
            </div>

            <div className="text-left px-1">
              <h4 className="font-bold text-sm text-white truncate">Starboy (Deluxe Edition)</h4>
              <p className="text-[11px] text-white/60">The Weeknd, Daft Punk</p>
            </div>

            {/* Scrubber */}
            <div className="space-y-1">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-3/5" />
              </div>
              <div className="flex justify-between text-[9px] text-white/50">
                <span>2:14</span>
                <span>-1:36</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-5 text-lg py-1">
              <span className="text-white/60 text-xs">⏮</span>
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm">
                ❚❚
              </div>
              <span className="text-white/60 text-xs">⏭</span>
            </div>
          </div>
        )}

        {screen.appName === 'Raycast' && (
          <div className="flex-1 flex flex-col justify-between text-left text-xs">
            <div className="space-y-2">
              <div className="bg-white/10 p-2 rounded-xl flex items-center gap-2 border border-white/15">
                <span className="text-white/50">🔍</span>
                <span className="text-white font-mono text-[11px]">search design tokens...</span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="p-1.5 rounded-lg bg-white/15 text-white flex items-center justify-between font-medium">
                  <span>🎨 Color Tokens (Inter 650)</span>
                  <span className="text-[9px] bg-white/20 px-1 rounded">↵ Enter</span>
                </div>
                <div className="p-1.5 rounded-lg text-white/60 hover:bg-white/5 flex items-center justify-between">
                  <span>📐 Spacing Scale (8px rhythm)</span>
                  <span className="text-[9px] text-white/30">Tab</span>
                </div>
                <div className="p-1.5 rounded-lg text-white/60 hover:bg-white/5 flex items-center justify-between">
                  <span>📱 Squircles 30% border radius</span>
                </div>
              </div>
            </div>

            <div className="text-[9px] text-white/40 border-t border-white/10 pt-2 flex justify-between">
              <span>Raycast Core v2.4</span>
              <span>⌘K Actions</span>
            </div>
          </div>
        )}

        {/* Fallback generic high-craft screen */}
        {!['Linear', 'Duolingo', 'Airbnb', 'Spotify', 'Raycast'].includes(screen.appName) && (
          <div className="flex-1 flex flex-col justify-between text-left text-white text-xs">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[30%] squircle flex items-center justify-center font-bold text-xs" style={{ backgroundColor: screen.appIconBg }}>
                  {screen.iconLetter}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">{screen.appName}</h4>
                  <span className="text-[9px] text-white/50">{screen.appCategory}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 space-y-1.5">
                <span className="text-[9px] text-white/50 uppercase tracking-wider font-semibold">{screen.flowType}</span>
                <p className="font-semibold text-xs leading-snug">{screen.screenName}</p>
              </div>

              <div className="space-y-1.5">
                {screen.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff]" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-white text-black font-semibold py-2 rounded-full text-xs">
              Inspect UI Element
            </button>
          </div>
        )}

        {/* Home Indicator Bar */}
        <div className="w-24 h-1 bg-white/40 rounded-full mx-auto mt-2 shrink-0" />
      </div>
    </div>
  );
};
