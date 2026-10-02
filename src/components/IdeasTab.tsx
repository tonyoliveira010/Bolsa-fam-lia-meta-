import React, { useState } from 'react';
import { Search, Heart, Home, SlidersHorizontal, ArrowUpRight, Plus, X, Sparkles, Check } from 'lucide-react';
import { BusinessIdea, CategoryId } from '../types';
import { CATEGORIES, BUSINESS_IDEAS } from '../data/ideas';
import { triggerCelebration } from '../utils/celebration';

interface IdeasTabProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  onOpenIdea: (idea: BusinessIdea) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const IdeasTab: React.FC<IdeasTabProps> = ({
  selectedCategory,
  onSelectCategory,
  onOpenIdea,
  savedIds,
  onToggleSave
}) => {
  const [maxBudget, setMaxBudget] = useState<number | null>(null);
  const [onlyHome, setOnlyHome] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sugerir Ideias Modal state
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [customIdeas, setCustomIdeas] = useState<BusinessIdea[]>(() => {
    try {
      const saved = localStorage.getItem('renda_mais_custom_suggested_ideas');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Suggest Form states
  const [sugTitle, setSugTitle] = useState('');
  const [sugCategory, setSugCategory] = useState<CategoryId>('comida');
  const [sugMinCost, setSugMinCost] = useState('30');
  const [sugMaterials, setSugMaterials] = useState('');
  const [sugPrice, setSugPrice] = useState('');
  const [sugMotherTip, setSugMotherTip] = useState('');
  const [sugScript, setSugScript] = useState('');
  const [sugSuccess, setSugSuccess] = useState(false);

  const allAvailableIdeas = [...customIdeas, ...BUSINESS_IDEAS];

  const filteredIdeas = allAvailableIdeas.filter((idea) => {
    if (selectedCategory !== 'todas' && idea.category !== selectedCategory) {
      return false;
    }
    if (maxBudget !== null && idea.minCost > maxBudget) {
      return false;
    }
    if (onlyHome && !idea.workFromHome) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = idea.title.toLowerCase().includes(q);
      const matchList = idea.shoppingList.some(item => item.toLowerCase().includes(q));
      if (!matchTitle && !matchList) return false;
    }
    return true;
  });

  const handleAddCustomIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sugTitle.trim()) return;

    const costNum = Number(sugMinCost) || 30;
    const materialsArray = sugMaterials.split('\n').filter(line => line.trim().length > 0);

    const categoryEmojis: Record<string, string> = {
      comida: '🍰',
      beleza: '💅',
      costura: '🧵',
      artesanato: '🎀',
      revenda: '🛍️',
      servicos: '🧹',
      digital: '📱'
    };

    const newIdea: BusinessIdea = {
      id: `sug_${Date.now()}`,
      title: sugTitle.trim(),
      emoji: categoryEmojis[sugCategory] || '💡',
      category: sugCategory,
      minCost: costNum,
      maxCost: costNum * 2,
      shoppingList: materialsArray.length > 0 ? materialsArray : ['Ingredientes ou materiais básicos da sua escolha'],
      suggestedPrice: sugPrice.trim() || 'A definir de acordo com o custo',
      firstClientMethod: 'Ofereça para 3 vizinhas ou amigas próximas para aprovarem a qualidade.',
      commonMistake: 'Esquecer de embutir os custos extras no valor de venda.',
      motherRoutineTip: sugMotherTip.trim() || 'Aproveite o horário da soneca ou escola para produzir.',
      whatsappScript: sugScript.trim() || 'Olá! Estou com novidades fresquinhas feitas com muito amor. Quer conhecer?',
      estimatedProfitMonthly: 'R$ 400 a R$ 1.200',
      workFromHome: true,
      requiresCookingOrTool: false,
      timeNeededDaily: '1h a 2h'
    };

    const updated = [newIdea, ...customIdeas];
    setCustomIdeas(updated);
    try {
      localStorage.setItem('renda_mais_custom_suggested_ideas', JSON.stringify(updated));
    } catch {
      // ignore
    }

    triggerCelebration(true);
    setSugSuccess(true);
    setTimeout(() => {
      setSugSuccess(false);
      setShowSuggestModal(false);
      setSugTitle('');
      setSugMaterials('');
      setSugPrice('');
      setSugMotherTip('');
      setSugScript('');
    }, 1800);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">
          Ideias de renda extra.
        </h1>
        <p className="text-xs font-light text-[var(--text-muted)] mt-0.5 leading-[1.38]">
          50 modelos de negócio práticos com baixo investimento e retorno rápido.
        </p>
      </div>

      {/* Banner 80px por 400px de largura acima do placeholder */}
      <div
        onClick={() => setShowSuggestModal(true)}
        className="w-full max-w-[400px] h-[80px] mx-auto bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-[var(--canvas-soft)] border border-amber-500/30 hover:border-amber-500/60 rounded-[20px] px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-2xs group"
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform">
            💡
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs text-[var(--ink)] leading-snug line-clamp-2">
              Você também pode sugerir ideias para ajudar outras pessoas.
            </h3>
            <span className="text-[10px] text-[var(--text-muted)] font-light block mt-0.5">
              Toque aqui para enviar seu modelo de renda ↗
            </span>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-[var(--canvas)] border border-[var(--hairline)] flex items-center justify-center text-[var(--ink)] shrink-0 group-hover:translate-x-0.5 transition-transform">
          <Plus className="w-4 h-4" />
        </div>
      </div>

      {/* Mobbin Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar negócio (bolo, unhas, costura, doces, celular)..."
          className="w-full pl-10 pr-9 py-3 text-xs bg-[var(--field)] border-none rounded-full text-[var(--ink)] placeholder-[var(--text-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--ink)] transition-all"
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

      {/* Category Stadium Pill Track */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
        <button
          onClick={() => onSelectCategory('todas')}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            selectedCategory === 'todas'
              ? 'bg-[var(--ink)] text-[var(--canvas)]'
              : 'bg-[var(--canvas)] border border-[var(--hairline)] text-[var(--text-muted)] hover:text-[var(--ink)]'
          }`}
        >
          Todas (50+)
        </button>

        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[var(--ink)] text-[var(--canvas)]'
                : 'bg-[var(--canvas)] border border-[var(--hairline)] text-[var(--text-muted)] hover:text-[var(--ink)]'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setMaxBudget(maxBudget === 35 ? null : 35)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            maxBudget === 35
              ? 'bg-[#141414] text-white'
              : 'bg-[var(--canvas-soft)] text-[var(--text-muted)] hover:text-[var(--ink)]'
          }`}
        >
          Até R$ 35
        </button>

        <button
          onClick={() => setMaxBudget(maxBudget === 50 ? null : 50)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            maxBudget === 50
              ? 'bg-[#141414] text-white'
              : 'bg-[var(--canvas-soft)] text-[var(--text-muted)] hover:text-[var(--ink)]'
          }`}
        >
          Até R$ 50
        </button>

        <button
          onClick={() => setOnlyHome(!onlyHome)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
            onlyHome
              ? 'bg-[#141414] text-white'
              : 'bg-[var(--canvas-soft)] text-[var(--text-muted)] hover:text-[var(--ink)]'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          100% de casa
        </button>

        {(maxBudget !== null || onlyHome) && (
          <button
            onClick={() => {
              setMaxBudget(null);
              setOnlyHome(false);
            }}
            className="text-xs text-[var(--text-muted)] hover:underline ml-1 cursor-pointer shrink-0"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Ideas Counter */}
      <div className="text-xs text-[var(--text-muted)] font-light px-0.5 pt-1">
        Mostrando <b className="font-semibold text-[var(--ink)]">{filteredIdeas.length}</b> ideias para começar:
      </div>

      {/* Ideas Cards List */}
      <div className="space-y-3">
        {filteredIdeas.map((idea) => {
          const isSaved = savedIds.includes(idea.id);
          const isCustom = idea.id.startsWith('sug_');
          return (
            <div
              key={idea.id}
              onClick={() => onOpenIdea(idea)}
              className="bg-[var(--canvas)] border border-[var(--hairline-soft)] hover:border-[var(--ink)] rounded-[20px] p-4 transition-colors cursor-pointer group space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 bg-[var(--canvas-soft)] squircle flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                    {idea.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                        {CATEGORIES.find((c) => c.id === idea.category)?.name || 'Negócio'}
                      </span>
                      {isCustom && (
                        <span className="text-[9px] bg-[#0066ff] text-white px-2 py-0.2 rounded-full font-bold">
                          Sua Ideia
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-[var(--ink)] leading-snug truncate">
                      {idea.title}.
                    </h3>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(idea.id);
                  }}
                  className={`p-2 rounded-full transition-colors cursor-pointer shrink-0 ${
                    isSaved
                      ? 'text-red-500 bg-red-50'
                      : 'text-[var(--text-faint)] hover:text-red-500 hover:bg-[var(--canvas-soft)]'
                  }`}
                  aria-label={isSaved ? 'Remover dos favoritos' : 'Favoritar ideia'}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1 border-t border-[var(--hairline-soft)]">
                <div>
                  Investimento: <b className="font-semibold text-[var(--ink)]">R$ {idea.minCost} a R$ {idea.maxCost}</b>
                </div>
                <div className="font-semibold text-[var(--ink)] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Passo a passo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}

        {filteredIdeas.length === 0 && (
          <div className="bg-[var(--canvas-soft)] rounded-[20px] p-6 text-center space-y-2">
            <p className="text-xs text-[var(--text-muted)] font-light">
              Nenhuma ideia encontrada para os filtros selecionados.
            </p>
            <button
              onClick={() => {
                onSelectCategory('todas');
                setMaxBudget(null);
                setOnlyHome(false);
                setSearchQuery('');
              }}
              className="btn-outline text-xs"
            >
              Ver todas as ideias
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: SUGERIR UMA NOVA IDEIA DE NEGÓCIO                                  */}
      {/* ========================================================================= */}
      {showSuggestModal && (
        <div
          className="fixed inset-0 z-50 bg-[#141414]/50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSuggestModal(false);
          }}
        >
          <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--ink)]">
                  Sugerir Ideia de Negócio.
                </h3>
                <span className="text-xs font-light text-[var(--text-muted)]">
                  Compartilhe um modelo de renda para mães
                </span>
              </div>

              <button
                onClick={() => setShowSuggestModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--ink)] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomIdea} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Nome da ideia / negócio
                </label>
                <input
                  type="text"
                  value={sugTitle}
                  onChange={(e) => setSugTitle(e.target.value)}
                  placeholder="Ex: Pão de mel trufado para festas"
                  className="w-full mobbin-input text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Categoria
                  </label>
                  <select
                    value={sugCategory}
                    onChange={(e) => setSugCategory(e.target.value as CategoryId)}
                    className="w-full mobbin-input text-xs bg-[var(--field)]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Custo inicial (R$)
                  </label>
                  <input
                    type="number"
                    value={sugMinCost}
                    onChange={(e) => setSugMinCost(e.target.value)}
                    placeholder="35"
                    className="w-full mobbin-input text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Lista de materiais básicos (1 por linha)
                </label>
                <textarea
                  value={sugMaterials}
                  onChange={(e) => setSugMaterials(e.target.value)}
                  placeholder="Ex: Farinha de trigo&#10;Mel puro&#10;Chocolate fracionado&#10;Embalagens plásticas"
                  className="w-full mobbin-input text-xs h-20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Preço sugerido de venda
                </label>
                <input
                  type="text"
                  value={sugPrice}
                  onChange={(e) => setSugPrice(e.target.value)}
                  placeholder="Ex: R$ 5,00 a R$ 8,00 por unidade"
                  className="w-full mobbin-input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Dica de conciliação com os filhos
                </label>
                <input
                  type="text"
                  value={sugMotherTip}
                  onChange={(e) => setSugMotherTip(e.target.value)}
                  placeholder="Ex: Asse a massa à noite enquanto as crianças dormem."
                  className="w-full mobbin-input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Mensagem pronta para WhatsApp
                </label>
                <textarea
                  value={sugScript}
                  onChange={(e) => setSugScript(e.target.value)}
                  placeholder="Ex: Oi amiga! Fiz pães de mel fresquinhos hoje..."
                  className="w-full mobbin-input text-xs h-16 resize-none"
                />
              </div>

              {sugSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Ideia adicionada ao catálogo com sucesso!</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSuggestModal(false)}
                  className="flex-1 btn-outline text-xs py-2.5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Salvar Ideia</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
