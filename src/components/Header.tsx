import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { UserProfile, TabType } from '../types';

interface HeaderProps {
  profile: UserProfile;
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onNavigate,
  isDarkMode,
  onToggleTheme,
  onOpenAdmin
}) => {
  const initial = (profile.name.trim() || 'M')[0].toUpperCase();

  return (
    <header className="sticky top-2 z-40 mb-5">
      {/* Floating stadium nav pill */}
      <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-full px-4 py-2 flex items-center justify-between transition-colors shadow-2xs">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left cursor-pointer focus:outline-none"
        >
          <div className="w-7 h-7 bg-[var(--ink)] text-[var(--canvas)] rounded-full flex items-center justify-center font-bold text-xs tracking-tight">
            R
          </div>
          <div>
            <div className="font-bold text-[15px] tracking-tight text-[var(--ink)] leading-none flex items-center gap-1">
              Renda Mais<span className="text-[#0066ff]">.</span>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-normal leading-none mt-0.5 truncate max-w-[120px] sm:max-w-[180px]">
              {profile.childrenNames ? `Por ${profile.childrenNames}` : 'Para Mães Empreendedoras'}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1.5">
          {/* Dark / Light Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="w-8 h-8 rounded-full bg-[var(--canvas-soft)] hover:border-[var(--ink)] text-[var(--ink)] flex items-center justify-center border border-[var(--hairline)] transition-colors cursor-pointer"
              title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              aria-label="Alternar tema"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[var(--ink)]" />}
            </button>
          )}

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-1 rounded-full bg-[#161b22] text-[#3fb950] font-black text-[10px] border border-[#238636]/40 hover:border-[#3fb950] transition-colors cursor-pointer shadow-xs"
              title="Acessar Painel /adm"
            >
              /adm
            </button>
          )}

          <button
            onClick={() => onNavigate('perfil')}
            className="w-8 h-8 rounded-full bg-[var(--canvas-soft)] text-[var(--ink)] font-semibold text-xs flex items-center justify-center border border-[var(--hairline)] transition-colors cursor-pointer"
            aria-label="Perfil"
          >
            {initial}
          </button>
        </div>
      </div>
    </header>
  );
};
