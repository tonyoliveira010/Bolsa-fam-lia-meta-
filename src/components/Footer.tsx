import React from 'react';
import { NavTab } from './NavPill';

interface FooterProps {
  onNavigate: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#141414] text-[#ffffff] rounded-t-[24px] mt-24 pt-16 pb-12 px-6 sm:px-12 md:px-16 border-0">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top: Wordmark at display scale and tagline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#262626]">
          <div>
            <div className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#ffffff] font-display-heavy">
              Mobbin.
            </div>
            <p className="text-base sm:text-lg text-[#adadad] font-subtitle-light mt-3 max-w-md">
              The world's largest mobile and web app design reference library.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('signup')}
              className="bg-[#ffffff] text-[#141414] hover:bg-[#f3f3f3] text-sm font-semibold px-6 py-3 rounded-full transition-all cursor-pointer"
            >
              Get started for free
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className="bg-[#262626] text-[#ffffff] hover:bg-[#333333] text-sm font-semibold px-6 py-3 rounded-full transition-all cursor-pointer"
            >
              View pricing
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          {/* Column 1 */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#adadad] font-semibold block">Products</span>
            <ul className="space-y-2 text-[#adadad]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#ffffff] transition-colors cursor-pointer text-left">
                  iOS Screens
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#ffffff] transition-colors cursor-pointer text-left">
                  Android Screens
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#ffffff] transition-colors cursor-pointer text-left">
                  Web Interfaces
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#ffffff] transition-colors cursor-pointer text-left">
                  User Flows
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#ffffff] transition-colors cursor-pointer text-left">
                  UI Elements Archive
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#adadad] font-semibold block">Company</span>
            <ul className="space-y-2 text-[#adadad]">
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-[#ffffff] transition-colors cursor-pointer text-left text-white font-medium">
                  Pricing Plans
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('awards')} className="hover:text-[#ffffff] transition-colors cursor-pointer text-left text-white font-medium">
                  Design Awards 2026
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('design-system')} className="hover:text-[#ffffff] transition-colors cursor-pointer text-left text-white font-medium">
                  Design System Specs
                </button>
              </li>
              <li>
                <span className="text-[#707070]">Curator Program</span>
              </li>
              <li>
                <span className="text-[#707070]">Changelog</span>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#adadad] font-semibold block">Resources</span>
            <ul className="space-y-2 text-[#adadad]">
              <li><span className="hover:text-[#ffffff] transition-colors cursor-pointer">Figma Plugin</span></li>
              <li><span className="hover:text-[#ffffff] transition-colors cursor-pointer">Raycast Extension</span></li>
              <li><span className="hover:text-[#ffffff] transition-colors cursor-pointer">Design Glossary</span></li>
              <li><span className="hover:text-[#ffffff] transition-colors cursor-pointer">Newsletter</span></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#adadad] font-semibold block">Legal</span>
            <ul className="space-y-2 text-[#adadad]">
              <li><span className="hover:text-[#ffffff] transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-[#ffffff] transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-[#ffffff] transition-colors cursor-pointer">Security</span></li>
              <li><span className="hover:text-[#ffffff] transition-colors cursor-pointer">Cookie Preferences</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom fineprint */}
        <div className="pt-8 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between text-xs text-[#adadad] gap-4">
          <p>© 2026 Mobbin, Inc. All trademarks, screenshots, and logos are property of their respective owners.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0066ff]" />
            <span>Monochrome Design System 2.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
