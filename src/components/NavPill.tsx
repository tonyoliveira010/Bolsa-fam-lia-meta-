import React, { useState } from 'react';

export type NavTab = 'home' | 'pricing' | 'awards' | 'signup' | 'design-system';

interface NavPillProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
}

export const NavPill: React.FC<NavPillProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-40 px-4 max-w-7xl mx-auto flex justify-center pointer-events-none">
      <nav
        className="pointer-events-auto bg-[#f3f3f3] text-[#141414] rounded-full px-3 py-2 flex items-center justify-between gap-3 sm:gap-6 shadow-none border-0 transition-all w-full max-w-[820px]"
        aria-label="Main Navigation"
      >
        {/* Left: Logomark + Wordmark */}
        <button
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2 pl-2 focus:outline-none cursor-pointer group"
        >
          {/* Mobbin geometric icon */}
          <div className="w-6 h-6 rounded-[30%] bg-[#141414] text-white flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
              <path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5z" />
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight text-[#141414]">Mobbin</span>
        </button>

        {/* Center: Desktop Navigation Links in {typography.link} */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#141414]">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors cursor-pointer hover:text-[#000000] ${
              currentTab === 'home' ? 'text-[#141414] underline decoration-2 underline-offset-4' : 'text-[#707070]'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className={`transition-colors cursor-pointer hover:text-[#000000] ${
              currentTab === 'pricing' ? 'text-[#141414] underline decoration-2 underline-offset-4' : 'text-[#707070]'
            }`}
          >
            Pricing
          </button>
          <button
            onClick={() => onNavigate('awards')}
            className={`transition-colors cursor-pointer hover:text-[#000000] ${
              currentTab === 'awards' ? 'text-[#141414] underline decoration-2 underline-offset-4' : 'text-[#707070]'
            }`}
          >
            Awards
          </button>
          <button
            onClick={() => onNavigate('design-system')}
            className={`transition-colors cursor-pointer hover:text-[#000000] ${
              currentTab === 'design-system' ? 'text-[#141414] underline decoration-2 underline-offset-4' : 'text-[#707070]'
            }`}
          >
            Design System
          </button>
        </div>

        {/* Right: CTA Pill button-primary */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('signup')}
            className="hidden sm:block text-sm font-semibold text-[#141414] px-3 py-1.5 hover:text-black cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="bg-[#141414] text-[#ffffff] text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-full hover:bg-[#262626] active:scale-95 transition-all cursor-pointer shadow-none"
          >
            Join for free
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-[#141414] hover:bg-[#e0e0e0] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden absolute top-14 left-4 right-4 bg-[#f3f3f3] rounded-[24px] p-4 border border-[#e0e0e0] flex flex-col gap-3 font-semibold text-sm shadow-none animate-in fade-in duration-150">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="text-left py-1 text-[#141414]"
          >
            Explore Library
          </button>
          <button
            onClick={() => {
              onNavigate('pricing');
              setMobileMenuOpen(false);
            }}
            className="text-left py-1 text-[#141414]"
          >
            Pricing & Plans
          </button>
          <button
            onClick={() => {
              onNavigate('awards');
              setMobileMenuOpen(false);
            }}
            className="text-left py-1 text-[#141414]"
          >
            Design Awards
          </button>
          <button
            onClick={() => {
              onNavigate('design-system');
              setMobileMenuOpen(false);
            }}
            className="text-left py-1 text-[#141414]"
          >
            Design System Specs
          </button>
          <hr className="border-[#e0e0e0] my-1" />
          <button
            onClick={() => {
              onNavigate('signup');
              setMobileMenuOpen(false);
            }}
            className="w-full bg-[#141414] text-white py-2.5 rounded-full text-center"
          >
            Join for free
          </button>
        </div>
      )}
    </header>
  );
};
