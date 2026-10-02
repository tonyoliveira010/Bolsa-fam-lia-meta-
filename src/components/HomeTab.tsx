import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Calculator, CalendarClock, Target, Sparkles, Bookmark, Check, ShieldCheck, Heart, Lock } from 'lucide-react';
import { UserProfile, DepositGoal, TabType, CategoryId, BusinessIdea } from '../types';
import { CATEGORIES, BUSINESS_IDEAS } from '../data/ideas';
import { BannerMoneySvg } from './BannerSvg';

interface HomeTabProps {
  profile: UserProfile;
  goal: DepositGoal;
  onNavigate: (tab: TabType) => void;
  onSelectCategory: (cat: CategoryId) => void;
  onOpenIdea: (idea: BusinessIdea) => void;
  onOpenDiagnosis?: () => void;
  onOpenCheckout?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  profile,
  goal,
  onNavigate,
  onSelectCategory,
  onOpenIdea,
  onOpenDiagnosis,
  onOpenCheckout
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [upsellUnlocked, setUpsellUnlocked] = useState(profile.plan === 'pro');

  const dayIndex = new Date().getDate() % BUSINESS_IDEAS.length;
  const ideaOfTheDay = BUSINESS_IDEAS[dayIndex];

  const totalSaved = goal.deposits.reduce((acc, val, idx) => acc + (goal.done[idx] ? val : 0), 0);
  const completedDeposits = Object.values(goal.done).filter(Boolean).length;
  const progressPercent = goal.targetAmount > 0 ? Math.min(100, Math.round((totalSaved / goal.targetAmount) * 100)) : 0;

  const handleUnlockUpsell = () => {
    setUpsellUnlocked(true);
    setShowUpsellModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Diagnóstico Funnel Banner */}
      {onOpenDiagnosis && (
        <div
          onClick={onOpenDiagnosis}
          className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 text-white rounded-[22px] p-4 flex items-center justify-between gap-3 cursor-pointer shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
              🎯
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 block">
                Novo Começo · 2 minutos
              </span>
              <h3 className="font-bold text-xs text-white leading-snug truncate">
                Descubra sua Trilha de Renda Extra
              </h3>
              <span className="text-[10px] text-emerald-100 block mt-0.5">
                Diagnóstico gratuito baseado nas suas habilidades ➔
              </span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform shadow-xs">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}
      {/* 1. Horizontal Scroll Carousel of Hero Cards: 280px Height and 400px Width */}
      <div>
        <div
          className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 snap-x snap-mandatory"
          onScroll={(e) => {
            const el = e.currentTarget;
            const index = Math.round(el.scrollLeft / 360);
            setActiveSlide(Math.min(3, Math.max(0, index)));
          }}
        >
          {/* Card 1 */}
          <div className="snap-center shrink-0 w-[400px] max-w-[calc(100vw-32px)] h-[280px] bg-[#ffffff] border border-[#e0e0e0] rounded-[24px] p-5 flex flex-col justify-between text-[#141414]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f3f3f3] text-[10px] font-semibold text-[#141414]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066ff]"></span>
                  Empreendedorismo Materno
                </span>
                <span className="text-[10px] text-[#707070] font-light">1/4</span>
              </div>
              <BannerMoneySvg />
              <h1 className="text-xl font-bold tracking-tight leading-tight text-[#141414] mt-1">
                Renda extra no seu ritmo.
              </h1>
              <p className="text-xs font-light text-[#707070] mt-1 leading-[1.38]">
                Transforme pequenas quantias e o Bolsa Família em um negócio próprio, sem abrir mão de acompanhar seus filhos.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onNavigate('ideias')}
                className="btn-primary text-xs py-2 px-3.5 flex-1"
              >
                Ver ideias até R$ 50
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
              <button
                onClick={() => onNavigate('metas')}
                className="btn-outline text-xs py-2 px-3"
              >
                50 depósitos
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="snap-center shrink-0 w-[400px] max-w-[calc(100vw-32px)] h-[280px] bg-[#f3f3f3] rounded-[24px] p-5 flex flex-col justify-between text-[#141414]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#141414] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  Estratégia Financeira
                </span>
                <span className="text-[10px] text-[#707070] font-light">2/4</span>
              </div>
              <div className="w-10 h-10 bg-white squircle flex items-center justify-center text-xl mb-2">
                🌱
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#141414]">
                Multiplique com segurança.
              </h2>
              <p className="text-xs font-light text-[#707070] mt-1.5 leading-[1.38]">
                Nunca comprometa a alimentação das crianças. Reserve apenas pequenas sobras de R$ 20 a R$ 30 ou comece com serviços de custo zero para girar seu primeiro lucro.
              </p>
            </div>
            <button
              onClick={() => onNavigate('ideias')}
              className="btn-primary text-xs py-2 px-4 self-start"
            >
              Ideias com custo zero ↗
            </button>
          </div>

          {/* Card 3 */}
          <div className="snap-center shrink-0 w-[400px] max-w-[calc(100vw-32px)] h-[280px] bg-[#ffffff] border border-[#e0e0e0] rounded-[24px] p-5 flex flex-col justify-between text-[#141414]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#f3f3f3] text-[#141414] text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  Maternidade Real
                </span>
                <span className="text-[10px] text-[#707070] font-light">3/4</span>
              </div>
              <div className="w-10 h-10 bg-[#f3f3f3] squircle flex items-center justify-center text-xl mb-2">
                ⏰
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#141414]">
                Liberdade para os filhos.
              </h2>
              <p className="text-xs font-light text-[#707070] mt-1.5 leading-[1.38]">
                2 horas produtivas enquanto as crianças dormem ou estão na escola já constroem sua independência financeira. Sem culpa de mãe e com presença em cada momento.
              </p>
            </div>
            <button
              onClick={() => onNavigate('rotina')}
              className="btn-outline text-xs py-2 px-4 self-start"
            >
              Ver blocos de rotina ↗
            </button>
          </div>

          {/* Card 4 */}
          <div className="snap-center shrink-0 w-[400px] max-w-[calc(100vw-32px)] h-[280px] bg-[#141414] text-white rounded-[24px] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#0066ff] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                  Roteiros Prontos
                </span>
                <span className="text-[10px] text-[#adadad] font-light">4/4</span>
              </div>
              <div className="w-10 h-10 bg-[#262626] squircle flex items-center justify-center text-xl mb-2">
                💬
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Primeiras vendas no WhatsApp.
              </h2>
              <p className="text-xs font-light text-[#adadad] mt-1.5 leading-[1.38]">
                Cada uma das 50 ideias já vem com texto pronto para enviar no WhatsApp e atrair clientes no bairro sem parecer chata ou inconveniente.
              </p>
            </div>
            <button
              onClick={() => onNavigate('ideias')}
              className="bg-white text-[#141414] hover:bg-[#f3f3f3] font-semibold text-xs py-2 px-4 rounded-full transition-colors self-start cursor-pointer"
            >
              Explorar 50 ideias ↗
            </button>
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="flex justify-center gap-1.5 mt-2.5">
          {[0, 1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={`h-1.5 rounded-full transition-all ${
                activeSlide === dot ? 'w-5 bg-[#141414]' : 'w-1.5 bg-[#e0e0e0]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 2. Abaixo: Categorias de Renda Extra */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#141414]">
            Categorias de renda extra.
          </h2>
          <button
            onClick={() => onNavigate('ideias')}
            className="text-xs font-medium text-[#707070] hover:text-[#141414] underline cursor-pointer"
          >
            Ver todas (50) ↗
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                onNavigate('ideias');
              }}
              className="shrink-0 w-24 bg-[#ffffff] border border-[#f0f0f0] hover:border-[#141414] rounded-[20px] p-3 text-center transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 mx-auto bg-[#f3f3f3] squircle flex items-center justify-center text-2xl mb-2 group-hover:scale-105 transition-transform">
                {cat.emoji}
              </div>
              <span className="text-[11px] font-semibold text-[#141414] leading-tight block truncate">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Abaixo: Ideias em Destaque & Ver Mais Ideias Salvas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#141414] flex items-center gap-1.5">
            Ideia em destaque de hoje.
          </h2>
          <span className="bg-[#0066ff] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            Popular
          </span>
        </div>

        {/* Featured Idea Card */}
        <div
          onClick={() => onOpenIdea(ideaOfTheDay)}
          className="bg-[#f3f3f3] hover:bg-[#eaeaea] rounded-[24px] p-4 flex items-center gap-3.5 transition-colors cursor-pointer group"
        >
          <div className="w-14 h-14 bg-white border border-[#e0e0e0] squircle flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
            {ideaOfTheDay.emoji}
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#707070]">
              {CATEGORIES.find(c => c.id === ideaOfTheDay.category)?.name}
            </span>
            <h3 className="font-bold text-sm text-[#141414] leading-snug truncate">
              {ideaOfTheDay.title}.
            </h3>
            <p className="text-xs font-light text-[#707070] truncate mt-0.5">
              {ideaOfTheDay.workFromHome ? '100% de casa com os filhos' : 'No bairro'}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#707070] block">Início</span>
            <span className="font-bold text-xs text-[#141414]">
              R$ {ideaOfTheDay.minCost}
            </span>
          </div>
        </div>

        {/* Ver mais ideias salvas link card */}
        <button
          onClick={() => onNavigate('salvas')}
          className="w-full bg-[var(--canvas)] border border-[var(--hairline)] hover:border-[var(--ink)] rounded-[20px] p-3.5 flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#f3f3f3] flex items-center justify-center text-[#141414]">
              <Bookmark className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-[#141414] block">
                Ver minhas ideias salvas ({profile.savedIdeaIds.length})
              </span>
              <span className="text-[10px] font-light text-[#707070]">
                Acesse seus modelos de negócios favoritos
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#707070]" />
        </button>
      </div>

      {/* 4. Abaixo: Componente de Progresso de Metas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#141414] flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            Progresso de metas.
          </h2>
          <button
            onClick={() => onNavigate('metas')}
            className="text-xs font-medium text-[#707070] hover:text-[#141414] underline cursor-pointer"
          >
            Abrir desafio ↗
          </button>
        </div>

        {goal.deposits.length > 0 ? (
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#707070] font-light block">Meta ativa:</span>
                <span className="text-base font-bold text-[#141414] flex items-center gap-1.5 mt-0.5">
                  <span>{goal.emoji || '🎯'}</span>
                  <span>{goal.title || 'Meu Negócio Próprio'}</span>
                  <span className="text-xs font-normal text-[#707070]">(R$ {goal.targetAmount.toLocaleString('pt-BR')})</span>
                </span>
              </div>
              <span className="text-xs font-bold text-[#141414] bg-[#f3f3f3] px-3 py-1 rounded-full">
                {progressPercent}%
              </span>
            </div>

            <div className="h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#141414] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-[#707070]">
              <span>
                Guardado: <b className="font-semibold text-[#141414]">R$ {totalSaved.toLocaleString('pt-BR')}</b>
              </span>
              <span>{completedDeposits} de 50 depósitos</span>
            </div>

            <button
              onClick={() => onNavigate('metas')}
              className="w-full mt-2 btn-outline text-xs flex items-center justify-center gap-1.5"
            >
              Continuar marcando depósitos
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="bg-[#f3f3f3] rounded-[24px] p-5 text-center">
            <h3 className="font-bold text-sm text-[#141414]">Nenhuma meta em andamento.</h3>
            <p className="text-xs font-light text-[#707070] mt-1 max-w-xs mx-auto">
              Defina sua meta e sorteie os 50 depósitos para juntar seu capital aos poucos.
            </p>
            <button
              onClick={() => onNavigate('metas')}
              className="mt-3.5 btn-primary text-xs"
            >
              Começar desafio de depósitos
            </button>
          </div>
        )}
      </div>

      {/* 5. Abaixo: Bloco de Upsell de R$ 6,90 com os 3 componentes solicitados */}
      <div className="bg-[#ffffff] border-2 border-[#141414] rounded-[24px] p-5 space-y-4 relative overflow-hidden">
        {/* Upsell Header Pill */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 bg-[#0066ff] text-white text-[11px] font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            Acesso Especial · Apenas R$ 6,90
          </div>
          <span className="text-[10px] text-[#707070] font-medium uppercase tracking-wider">
            Kit Mãe Empreendedora
          </span>
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#141414] leading-tight">
            Estrutura Completa de Crescimento.
          </h2>
          <p className="text-xs font-light text-[#707070] mt-1">
            As três ferramentas indispensáveis para não perder dinheiro e manter a tranquilidade com os filhos:
          </p>
        </div>

        {/* The 3 Required Items */}
        <div className="space-y-3 pt-1">
          {/* Item 1: Calculadora de lucro */}
          <div
            onClick={() => onNavigate('calculadora')}
            className="p-3.5 bg-[#f3f3f3] hover:bg-[#eaeaea] rounded-[18px] flex items-start gap-3 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#141414] shrink-0 mt-0.5">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <b className="text-xs font-bold text-[#141414]">Calculadora de lucro.</b>
                <span className="text-[10px] font-semibold text-[#141414] underline group-hover:translate-x-0.5 transition-transform">
                  Abrir ↗
                </span>
              </div>
              <p className="text-xs font-light text-[#707070] leading-snug mt-0.5">
                Defina preços justos e evite prejuízos.
              </p>
            </div>
          </div>

          {/* Item 2: Rotina com os filhos */}
          <div
            onClick={() => onNavigate('rotina')}
            className="p-3.5 bg-[#f3f3f3] hover:bg-[#eaeaea] rounded-[18px] flex items-start gap-3 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#141414] shrink-0 mt-0.5">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <b className="text-xs font-bold text-[#141414]">Rotina com os filhos.</b>
                <span className="text-[10px] font-semibold text-[#141414] underline group-hover:translate-x-0.5 transition-transform">
                  Abrir ↗
                </span>
              </div>
              <p className="text-xs font-light text-[#707070] leading-snug mt-0.5">
                Concilie produção, vendas e maternidade.
              </p>
            </div>
          </div>

          {/* Item 3: O Pote do Negócio vs. O Pote da Casa */}
          <div className="p-3.5 bg-[#f3f3f3] rounded-[18px] flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-base shrink-0 mt-0.5">
              🏺
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-xs font-bold text-[#141414]">O Pote do Negócio vs. O Pote da Casa.</b>
              <p className="text-xs font-light text-[#707070] leading-snug mt-1">
                Use duas caixinhas de sapatos ou dois potes de maionese limpos: um para o dinheiro da casa e outro para o dinheiro do negócio. NUNCA misture, senão seu capital de giro some!
              </p>
            </div>
          </div>

          {/* Item 4: Caderninho de Vendas Diário com Lucro Limpo */}
          <div
            onClick={() => onNavigate('financeiro')}
            className="p-3.5 bg-[#f3f3f3] hover:bg-[#eaeaea] rounded-[18px] flex items-start gap-3 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#141414] shrink-0 mt-0.5">
              <span className="text-sm">📖</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <b className="text-xs font-bold text-[#141414]">Caderninho de Vendas Diário.</b>
                <span className="text-[10px] font-semibold text-[#141414] underline group-hover:translate-x-0.5 transition-transform">
                  Abrir ↗
                </span>
              </div>
              <p className="text-xs font-light text-[#707070] leading-snug mt-0.5">
                Controle automático de entradas e custos do dia com lucro limpo anotado.
              </p>
            </div>
          </div>

          {/* Item 5: Desafio dos 50 Depósitos */}
          <div
            onClick={() => onNavigate('metas')}
            className="p-3.5 bg-[#f3f3f3] hover:bg-[#eaeaea] rounded-[18px] flex items-start gap-3 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#141414] shrink-0 mt-0.5">
              <span className="text-sm">🎯</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <b className="text-xs font-bold text-[#141414]">Desafio dos 50 Depósitos Sem Complicação.</b>
                <span className="text-[10px] font-semibold text-[#141414] underline group-hover:translate-x-0.5 transition-transform">
                  Abrir ↗
                </span>
              </div>
              <p className="text-xs font-light text-[#707070] leading-snug mt-0.5">
                Acumule de R$ 500 a R$ 1.000 para a paz financeira da sua família no seu próprio ritmo.
              </p>
            </div>
          </div>

          {/* Item 6: Scripts Prontos de WhatsApp & Cobrança de Sinal */}
          <div
            onClick={() => onNavigate('ideias')}
            className="p-3.5 bg-[#f3f3f3] hover:bg-[#eaeaea] rounded-[18px] flex items-start gap-3 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#141414] shrink-0 mt-0.5">
              <span className="text-sm">💬</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <b className="text-xs font-bold text-[#141414]">Scripts Prontos de WhatsApp & Sinal 50%.</b>
                <span className="text-[10px] font-semibold text-[#141414] underline group-hover:translate-x-0.5 transition-transform">
                  Abrir ↗
                </span>
              </div>
              <p className="text-xs font-light text-[#707070] leading-snug mt-0.5">
                Textos de alta conversão para fechar pedidos e cobrar sinal adiantado sem medo.
              </p>
            </div>
          </div>

          {/* Item 7: Checklist Mensal & Simulador de Pró-Labore */}
          <div
            onClick={() => onNavigate('financeiro')}
            className="p-3.5 bg-[#f3f3f3] hover:bg-[#eaeaea] rounded-[18px] flex items-start gap-3 transition-colors cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#141414] shrink-0 mt-0.5">
              <span className="text-sm">🛡️</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <b className="text-xs font-bold text-[#141414]">Checklist Mensal & Simulador de Pró-Labore.</b>
                <span className="text-[10px] font-semibold text-[#141414] underline group-hover:translate-x-0.5 transition-transform">
                  Abrir ↗
                </span>
              </div>
              <p className="text-xs font-light text-[#707070] leading-snug mt-0.5">
                Proteja seu caixa e saiba quanto retirar toda segunda-feira sem sangrar o negócio.
              </p>
            </div>
          </div>
        </div>

        {/* Upsell Call to Action Button */}
        <div className="pt-2">
          {upsellUnlocked || profile.plan === 'pro' ? (
            <div className="p-3 bg-[#141414] text-white rounded-full text-center text-xs font-semibold flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-[#0066ff]" />
              Kit Completo Desbloqueado com Sucesso!
            </div>
          ) : (
            <button
              onClick={() => {
                if (onOpenCheckout) {
                  onOpenCheckout();
                } else {
                  setShowUpsellModal(true);
                }
              }}
              className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Desbloquear Guia & Ferramentas Completas</span>
              <span className="bg-[#0066ff] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                R$ 6,90
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Upsell Modal */}
      {showUpsellModal && (
        <div
          className="fixed inset-0 z-50 bg-[#141414]/50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUpsellModal(false);
          }}
        >
          <div className="bg-white border border-[#e0e0e0] rounded-[24px] p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-[#0066ff] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Acesso Vitalício
              </span>
              <button
                onClick={() => setShowUpsellModal(false)}
                className="text-[#707070] hover:text-[#141414] text-xs font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#141414]">
                Kit Mãe Empreendedora.
              </h3>
              <p className="text-xs font-light text-[#707070] mt-1 leading-relaxed">
                Garanta o método comprovado para precificar, organizar sua rotina com os filhos e proteger o capital de giro por um pagamento único simbólico.
              </p>
            </div>

            <div className="bg-[#f3f3f3] p-3.5 rounded-[16px] space-y-2 text-xs text-[#141414]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>Calculadora de Lucro e Precificação Completa</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>Planejador de Blocos de Rotina com os Filhos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>Regra dos Dois Potes (Blindagem do Capital)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>50 Modelos de Negócio com Scripts de WhatsApp</span>
              </div>
            </div>

            <div className="text-center pt-1">
              <span className="text-[11px] text-[#707070] line-through block">De R$ 29,90</span>
              <span className="text-2xl font-bold text-[#141414]">Por apenas R$ 6,90</span>
              <span className="text-[10px] text-[#707070] block">pagamento único sem mensalidade</span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleUnlockUpsell}
                className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Confirmar e Liberar Acesso (R$ 6,90)
              </button>
              <button
                onClick={() => setShowUpsellModal(false)}
                className="w-full text-xs text-[#707070] font-light hover:underline py-1 cursor-pointer"
              >
                Continuar navegando no plano gratuito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
