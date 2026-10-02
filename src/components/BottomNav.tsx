import React from 'react';
import { Home, Lightbulb, Target, TrendingUp, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, savedCount }) => {
  // 5 Telas Principais da Navbar: Início, Ideias, Metas, Financeiro e Perfil
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'home', label: 'Início', icon: <Home className="w-4 h-4" /> },
    { id: 'ideias', label: 'Ideias', icon: <Lightbulb className="w-4 h-4" />, badge: savedCount > 0 ? savedCount : undefined },
    { id: 'metas', label: 'Metas', icon: <Target className="w-4 h-4" /> },
    { id: 'financeiro', label: 'Financeiro', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'perfil', label: 'Perfil', icon: <User className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[420px] z-40 pointer-events-none">
      <nav className="pointer-events-auto bg-[var(--canvas)] border border-[var(--hairline)] rounded-full p-1.5 flex items-center justify-between transition-colors shadow-xs">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all relative cursor-pointer ${
                isActive
                  ? 'bg-[var(--ink)] text-[var(--canvas)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas-soft)]'
              }`}
            >
              <div className="flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
              {item.badge !== undefined && (
                <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-[#0066ff] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
