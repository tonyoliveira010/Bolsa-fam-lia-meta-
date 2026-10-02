import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Heart, Trash2, ArrowUpRight, Search, Sparkles } from 'lucide-react';
import { UserProfile, BusinessIdea, TabType } from '../types';
import { BUSINESS_IDEAS } from '../data/ideas';

interface SavedIdeasTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenIdea: (idea: BusinessIdea) => void;
  onNavigate: (tab: TabType) => void;
}

export const SavedIdeasTab: React.FC<SavedIdeasTabProps> = ({
  profile,
  onUpdateProfile,
  onOpenIdea,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Get custom suggested ideas from storage if any
  const customIdeas: BusinessIdea[] = (() => {
    try {
      const saved = localStorage.getItem('renda_mais_custom_suggested_ideas');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })();

  const allAvailable = [...customIdeas, ...BUSINESS_IDEAS];
  const savedIdeas = allAvailable.filter((idea) => profile.savedIdeaIds.includes(idea.id));

  const filteredSaved = savedIdeas.filter((idea) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      idea.title.toLowerCase().includes(q) ||
      idea.category.toLowerCase().includes(q) ||
      idea.shoppingList.some((item) => item.toLowerCase().includes(q))
    );
  });

  const handleRemove = (e: React.MouseEvent, ideaId: string) => {
    e.stopPropagation();
    onUpdateProfile({
      ...profile,
      savedIdeaIds: profile.savedIdeaIds.filter((id) => id !== ideaId)
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Header with Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('perfil')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)] hover:text-[#0066ff] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Perfil</span>
        </button>

        <span className="text-[10px] font-bold text-white bg-[#0066ff] px-2.5 py-0.5 rounded-full">
          {savedIdeas.length} {savedIdeas.length === 1 ? 'salva' : 'salvas'}
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight flex items-center gap-2">
          Minhas ideias salvas.
        </h1>
        <p className="text-xs font-light text-[var(--text-muted)] mt-0.5 leading-[1.38]">
          Seus modelos de negócio favoritos reunidos em um só lugar para você tirar do papel no seu tempo.
        </p>
      </div>

      {/* Search among saved ideas if there are 2 or more */}
      {savedIdeas.length > 1 && (
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar suas ideias salvas..."
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-[var(--field)] border-none rounded-full text-[var(--ink)] placeholder-[var(--text-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--ink)] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Saved Ideas List */}
      <div className="space-y-3">
        {filteredSaved.map((idea) => (
          <div
            key={idea.id}
            onClick={() => onOpenIdea(idea)}
            className="bg-[var(--canvas)] border border-[var(--hairline)] hover:border-[var(--ink)] rounded-[22px] p-4.5 space-y-3 transition-colors cursor-pointer group shadow-2xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 bg-[var(--canvas-soft)] squircle flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                  {idea.emoji}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                    {idea.category}
                  </span>
                  <h3 className="font-bold text-sm text-[var(--ink)] leading-snug truncate mt-0.5">
                    {idea.title}.
                  </h3>
                  <span className="text-xs text-[var(--text-muted)] block mt-0.5 font-light">
                    Início: <b className="font-semibold text-[var(--ink)]">R$ {idea.minCost} a R$ {idea.maxCost}</b>
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => handleRemove(e, idea.id)}
                className="p-2 rounded-full text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/60 transition-colors cursor-pointer shrink-0"
                title="Remover das salvas"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Shopping list sample */}
            <div className="bg-[var(--canvas-soft)] p-3 rounded-[16px] text-xs space-y-1">
              <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider block">
                Materiais essenciais:
              </span>
              <p className="text-[11px] text-[var(--ink)] font-light leading-relaxed truncate">
                {idea.shoppingList.slice(0, 3).join(', ')}
                {idea.shoppingList.length > 3 ? ` e mais ${idea.shoppingList.length - 3} itens` : ''}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-[var(--hairline-soft)] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[var(--text-muted)] font-light">
                {idea.workFromHome ? '🏠 100% de casa' : '🚶 Vendas no bairro'}
              </span>

              <div className="font-semibold text-[#0066ff] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Abrir guia completo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {savedIdeas.length === 0 && (
          <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-8 text-center space-y-3.5">
            <div className="w-14 h-14 bg-[var(--canvas-soft)] rounded-full mx-auto flex items-center justify-center text-2xl">
              <Bookmark className="w-6 h-6 text-[var(--text-muted)]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[var(--ink)]">
                Nenhuma ideia salva ainda.
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-light max-w-xs mx-auto leading-relaxed">
                Navegue pelas 50 ideias práticas de renda extra e toque no coração das que mais combinam com a sua rotina para consultá-las aqui.
              </p>
            </div>

            <button
              onClick={() => onNavigate('ideias')}
              className="btn-primary text-xs py-3 px-5 flex items-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explorar Catálogo de Ideias</span>
            </button>
          </div>
        )}

        {savedIdeas.length > 0 && filteredSaved.length === 0 && (
          <div className="bg-[var(--canvas-soft)] rounded-[20px] p-6 text-center space-y-2">
            <p className="text-xs text-[var(--text-muted)] font-light">
              Nenhuma ideia salva corresponde à sua busca.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn-outline text-xs py-1.5 px-3"
            >
              Limpar busca
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
