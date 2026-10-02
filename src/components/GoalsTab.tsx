import React, { useState } from 'react';
import { Target, ShieldAlert, Sparkles, Plus, ArrowUpRight, Check, X, ArrowLeft, ChevronRight, RefreshCw, Lock } from 'lucide-react';
import { DepositGoal, GoalCardItem } from '../types';
import { PRESET_GOAL_CARDS } from '../data/ideas';
import { triggerCelebration } from '../utils/celebration';

interface GoalsTabProps {
  goal: DepositGoal;
  onUpdateGoal: (updated: DepositGoal) => void;
  isPro?: boolean;
  onOpenCheckout?: () => void;
}

export const GoalsTab: React.FC<GoalsTabProps> = ({ goal, onUpdateGoal, isPro = false, onOpenCheckout }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'done'>('all');
  const [selectedGoalDetail, setSelectedGoalDetail] = useState<GoalCardItem | null>(null);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [activatedFeedback, setActivatedFeedback] = useState<string | null>(null);

  // 2-Step Create Goal Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('1000');
  const [newMonthly, setNewMonthly] = useState('490');
  const [newDescription, setNewDescription] = useState('');
  const [showCustomTargetInput, setShowCustomTargetInput] = useState(false);
  const [customTargetVal, setCustomTargetVal] = useState('');

  const targets = [300, 500, 1000, 2000, 5000];

  const totalSaved = goal.deposits.reduce((acc, val, idx) => acc + (goal.done[idx] ? val : 0), 0);
  const completedCount = Object.values(goal.done).filter(Boolean).length;
  const progressPercent = goal.targetAmount > 0 ? Math.min(100, Math.round((totalSaved / goal.targetAmount) * 100)) : 0;

  // Timeline calculation for Step 2
  const step2TargetNum = Number(newAmount) || goal.targetAmount || 1000;
  const step2MonthlyNum = Number(newMonthly) || 490;
  const step2MonthsToReach = Math.ceil(step2TargetNum / Math.max(10, step2MonthlyNum));

  const step2TimelineText = () => {
    if (step2MonthsToReach <= 1) return 'cerca de 1 mês';
    if (step2MonthsToReach > 12) {
      const years = Math.floor(step2MonthsToReach / 12);
      const rem = step2MonthsToReach % 12;
      return `cerca de ${years} ano(s) e ${rem} mês(es)`;
    }
    return `cerca de ${step2MonthsToReach} meses`;
  };

  const generate50Deposits = (
    target: number,
    monthly = Number(newMonthly) || 490,
    title = goal.title || 'Meu Negócio Próprio',
    emoji = goal.emoji || '🎯',
    id?: string
  ) => {
    const weights = Array.from({ length: 50 }, () => 0.4 + Math.random() * 1.3);
    const sumWeights = weights.reduce((a, b) => a + b, 0);
    const deposits = weights.map((w) => Math.max(1, Math.floor((w / sumWeights) * target)));

    let diff = target - deposits.reduce((a, b) => a + b, 0);
    let k = 0;
    while (diff > 0) {
      deposits[k % 50]++;
      diff--;
      k++;
    }
    while (diff < 0) {
      const maxIdx = deposits.indexOf(Math.max(...deposits));
      deposits[maxIdx]--;
      diff++;
    }

    onUpdateGoal({
      ...goal,
      id: id || goal.id || 'meta-ativa',
      title,
      emoji,
      targetAmount: target,
      monthlySavings: monthly,
      deposits,
      done: {}
    });
    triggerCelebration(false);
  };

  const toggleDeposit = (idx: number) => {
    const isNowDone = !goal.done[idx];
    const newDone = { ...goal.done, [idx]: isNowDone };
    const newCompletedCount = Object.values(newDone).filter(Boolean).length;

    onUpdateGoal({
      ...goal,
      done: newDone
    });

    if (isNowDone) {
      const isFinish = newCompletedCount === 50;
      triggerCelebration(isFinish);
    }
  };

  // Ao ativar uma meta do modelo planejado, cria o card de progresso daquela meta
  const handleSelectPreset = (card: GoalCardItem) => {
    generate50Deposits(card.targetAmount, card.monthlySavings, card.title, card.emoji, card.id);
    setSelectedGoalDetail(null);
    setActivatedFeedback(`Card de progresso criado para: "${card.title}"!`);
    setTimeout(() => setActivatedFeedback(null), 3500);
  };

  const handleFinishStep2 = () => {
    const targetVal = Number(newAmount) || 1000;
    const monthlyVal = Number(newMonthly) || 490;
    const titleVal = newTitle.trim() || 'Minha Meta Própria';
    generate50Deposits(targetVal, monthlyVal, titleVal, '🎯', 'meta-customizada');
    setShowCreateModal(false);
    setCreateStep(1);
    setActivatedFeedback(`Card de progresso criado para: "${titleVal}"!`);
    setTimeout(() => setActivatedFeedback(null), 3500);
  };

  return (
    <div className="space-y-6">
      {!isPro && (
        <div className="bg-gradient-to-br from-[#0066ff]/15 via-purple-500/10 to-transparent border-2 border-[#0066ff] rounded-[24px] p-5 text-center space-y-3 shadow-md">
          <div className="w-11 h-11 rounded-full bg-[#0066ff] text-white flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066ff] block">
              Recurso Exclusivo · Kit Mãe Empreendedora
            </span>
            <h3 className="text-base font-extrabold text-[#141414] mt-0.5">
              Desbloqueie o Desafio dos 50 Depósitos
            </h3>
            <p className="text-xs text-[#707070] font-light mt-1 max-w-sm mx-auto leading-relaxed">
              Junte de R$ 500 a R$ 5.000 no seu próprio ritmo, com sorteio de depósitos, cofrinho dinâmico e metas personalizadas.
            </p>
          </div>
          <button
            onClick={onOpenCheckout}
            className="btn-primary text-xs py-3 px-6 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-lg bg-[#0066ff] hover:bg-blue-600"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Desbloquear Desafio dos 50 Depósitos por R$ 6,90</span>
          </button>
        </div>
      )}

      <div className={!isPro ? 'pointer-events-none opacity-85 select-none space-y-6' : 'space-y-6'}>
      {/* Top Header with Create Goal Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#141414] tracking-tight">
            Metas do meu negócio.
          </h1>
          <p className="text-xs font-light text-[#707070] mt-0.5 leading-[1.38]">
            Defina sua meta e sorteie os 50 depósitos para juntar sem pesar no bolso.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateStep(1);
            setShowCreateModal(true);
          }}
          className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Criar minha meta
        </button>
      </div>

      {/* Feedback banner when a goal is activated */}
      {activatedFeedback && (
        <div className="p-3 bg-[#141414] text-white rounded-full text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-[#0066ff]" />
          <span>{activatedFeedback}</span>
        </div>
      )}

      {/* 1. Card de Progresso da Meta Ativa (Ao clicar abre o modal com os 50 depósitos e interação) */}
      <div
        onClick={() => setShowBoardModal(true)}
        className="bg-[#ffffff] border-2 border-[#141414] hover:bg-[#fafafa] rounded-[24px] p-5 space-y-4 cursor-pointer transition-colors shadow-2xs group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#f3f3f3] text-2xl flex items-center justify-center shrink-0">
              {goal.emoji || '🎯'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0066ff] bg-[#f3f3f3] px-2.5 py-0.5 rounded-full">
                  Meta em Andamento
                </span>
                <span className="text-[10px] text-[#707070] font-light">
                  R$ {goal.monthlySavings}/mês
                </span>
              </div>
              <h2 className="text-base font-bold text-[#141414] leading-tight mt-1 truncate">
                {goal.title || 'Meu Negócio Próprio'}
              </h2>
            </div>
          </div>

          <span className="text-xs font-bold text-white bg-[#141414] px-3 py-1 rounded-full shrink-0 ml-2">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 bg-[#f0f0f0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#141414] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#707070]">
          <div>
            <span>Guardado até agora: </span>
            <b className="font-bold text-[#141414] text-sm">
              R$ {totalSaved.toLocaleString('pt-BR')}
            </b>
            <span className="text-[11px] text-[#707070] ml-1">
              de R$ {goal.targetAmount.toLocaleString('pt-BR')}
            </span>
          </div>
          <span className="font-semibold text-[#141414] bg-[#f3f3f3] px-2.5 py-0.5 rounded-full text-[11px]">
            {completedCount} / 50 depósitos
          </span>
        </div>

        {/* Action Button inside Card */}
        <div className="pt-2 flex items-center justify-between border-t border-[#f0f0f0] text-xs font-semibold text-[#141414]">
          <span className="flex items-center gap-1.5 text-[#0066ff]">
            <Sparkles className="w-3.5 h-3.5" />
            Toque para abrir tabuleiro e marcar depósitos
          </span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 2. Cards de Metas Planejadas (Ao clicar abre o modal com detalhes) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-[#141414] uppercase tracking-wider">
            Modelos de metas planejadas:
          </span>
          <span className="text-[10px] text-[#707070] font-light">Toque para ativar</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {PRESET_GOAL_CARDS.map((card) => {
            const isCurrentActive = goal.title === card.title || goal.targetAmount === card.targetAmount;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedGoalDetail(card)}
                className={`shrink-0 w-52 p-4 rounded-[20px] border transition-colors cursor-pointer flex flex-col justify-between ${
                  isCurrentActive
                    ? 'bg-[#141414] text-white border-[#141414]'
                    : 'bg-[#ffffff] text-[#141414] border-[#f0f0f0] hover:border-[#141414]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{card.emoji}</span>
                    {isCurrentActive && (
                      <span className="bg-[#0066ff] text-white text-[9px] font-semibold px-2 py-0.2 rounded-full">
                        Ativa
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] uppercase font-semibold block ${isCurrentActive ? 'text-[#adadad]' : 'text-[#707070]'}`}>
                    {card.category}
                  </span>
                  <h3 className="font-bold text-xs leading-snug mt-0.5">
                    {card.title}.
                  </h3>
                  <div className="text-base font-bold mt-1">
                    R$ {card.targetAmount.toLocaleString('pt-BR')}
                  </div>
                </div>

                <div className={`pt-2 mt-2 border-t flex items-center justify-between text-[10px] ${
                  isCurrentActive ? 'border-[#262626] text-[#adadad]' : 'border-[#f0f0f0] text-[#707070]'
                }`}>
                  <span>{card.monthlySavings}/mês</span>
                  <span className="font-medium underline flex items-center">
                    Ver e ativar <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Maternal Security Note */}
      <div className="bg-[#f3f3f3] rounded-[24px] p-4 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-[#141414] shrink-0 mt-0.5" />
        <div className="text-xs font-light text-[#707070] leading-[1.43]">
          <b className="font-semibold text-[#141414] block">Lembrete de segurança:</b>
          O ritmo é você quem faz. Se o mês apertar, pule depósitos sem culpa. O sustento e conforto dos seus filhos sempre vêm primeiro.
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: TABULEIRO DOS 50 DEPÓSITOS (Aberto ao clicar no Card de Progresso) */}
      {/* ========================================================================= */}
      {showBoardModal && (
        <div
          className="fixed inset-0 z-50 bg-[#141414]/50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowBoardModal(false);
          }}
        >
          <div className="bg-white border border-[#e0e0e0] w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px] p-5 pb-8 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f0f0]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#f3f3f3] text-xl flex items-center justify-center shrink-0">
                  {goal.emoji || '🎯'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#141414] leading-tight">
                    {goal.title || 'Meu Desafio dos 50 Depósitos'}
                  </h3>
                  <span className="text-[10px] text-[#707070] font-light">
                    Toque em cada valor quando você guardar
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowBoardModal(false)}
                className="p-1.5 text-[#707070] hover:text-[#141414] rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guardado até agora & progresso */}
            <div className="p-4 bg-[#f3f3f3] rounded-[18px] space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-[#707070] font-light block">Guardado até agora:</span>
                  <span className="text-2xl font-bold text-[#141414]">
                    R$ {totalSaved.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-[#707070] font-normal ml-1">
                    de R$ {goal.targetAmount.toLocaleString('pt-BR')}
                  </span>
                </div>

                <span className="text-xs font-semibold text-[#141414] bg-white px-3 py-1 rounded-full">
                  {completedCount} / 50 depósitos
                </span>
              </div>

              <div className="h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#141414] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Filter Segmented Control: Todos (50), Faltam (X), Feitos (Y) */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-[#141414]">Toque para marcar:</span>
              <div className="bg-[#f3f3f3] p-1 rounded-full flex gap-1">
                <button
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-colors cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-white text-[#141414] shadow-xs'
                      : 'text-[#707070] hover:text-[#141414]'
                  }`}
                >
                  Todos (50)
                </button>
                <button
                  onClick={() => setFilterMode('pending')}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-colors cursor-pointer ${
                    filterMode === 'pending'
                      ? 'bg-white text-[#141414] shadow-xs'
                      : 'text-[#707070] hover:text-[#141414]'
                  }`}
                >
                  Faltam ({50 - completedCount})
                </button>
                <button
                  onClick={() => setFilterMode('done')}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-full transition-colors cursor-pointer ${
                    filterMode === 'done'
                      ? 'bg-white text-[#141414] shadow-xs'
                      : 'text-[#707070] hover:text-[#141414]'
                  }`}
                >
                  Feitos ({completedCount})
                </button>
              </div>
            </div>

            {/* The 50 Interactive Deposits Grid */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {goal.deposits.map((val, idx) => {
                const isDone = !!goal.done[idx];
                if (filterMode === 'pending' && isDone) return null;
                if (filterMode === 'done' && !isDone) return null;

                return (
                  <button
                    key={idx}
                    onClick={() => toggleDeposit(idx)}
                    className={`py-2 px-1 text-center rounded-[12px] text-xs font-semibold transition-all cursor-pointer active:scale-95 flex flex-col items-center justify-center ${
                      isDone
                        ? 'bg-[#141414] text-white line-through opacity-90'
                        : 'bg-[#f3f3f3] hover:bg-[#eaeaea] text-[#141414] border border-[#f0f0f0]'
                    }`}
                    title={isDone ? `R$ ${val} guardado!` : `Tocar para marcar R$ ${val}`}
                  >
                    <span className="text-[9px] opacity-60 font-light mb-0.5">#{idx + 1}</span>
                    <span>R$ {val}</span>
                  </button>
                );
              })}
            </div>

            {completedCount === 50 && (
              <div className="p-4 bg-[#141414] text-white rounded-[20px] text-center space-y-1">
                <Sparkles className="w-6 h-6 mx-auto text-[#0066ff] mb-1" />
                <h4 className="text-sm font-bold">Meta 100% Completa! 🎉</h4>
                <p className="text-xs font-light text-[#adadad]">
                  Você completou todos os 50 depósitos e somou R$ {goal.targetAmount.toLocaleString('pt-BR')} para {goal.title || 'seu negócio'}!
                </p>
              </div>
            )}

            {/* Botão de Fechar e Concluir (sem o botão redundante de sortear novos valores) */}
            <div className="pt-2">
              <button
                onClick={() => setShowBoardModal(false)}
                className="w-full btn-primary text-xs py-3"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: FLUXO DE CRIAÇÃO DA META EM 2 ETAPAS                            */}
      {/* Etapa 1: Dados do Objetivo -> Etapa 2: Componente Solicitado de Simulação */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-[#141414]/50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div className="bg-white border border-[#e0e0e0] rounded-[24px] p-6 max-w-sm w-full space-y-4">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {createStep === 2 && (
                  <button
                    onClick={() => setCreateStep(1)}
                    className="p-1 text-[#707070] hover:text-[#141414] cursor-pointer"
                    title="Voltar à etapa 1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <span className="text-[10px] font-semibold text-[#0066ff] uppercase tracking-wider bg-[#f3f3f3] px-2.5 py-0.5 rounded-full">
                  Etapa {createStep} de 2
                </span>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#707070] hover:text-[#141414] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ETAPA 1: Dados do Objetivo */}
            {createStep === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setCreateStep(2);
                }}
                className="space-y-3.5"
              >
                <div>
                  <h3 className="text-base font-bold text-[#141414]">
                    Criar minha meta própria.
                  </h3>
                  <p className="text-xs font-light text-[#707070] mt-0.5">
                    Preencha seu objetivo para calcularmos o melhor plano para você.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#141414] block mb-1">
                    Nome do objetivo
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Comprar forno elétrico, Estoque de tecidos..."
                    className="w-full mobbin-input text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-semibold text-[#141414] block mb-1">
                      Valor total (R$)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="50000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="1000"
                      className="w-full mobbin-input text-xs font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#141414] block mb-1">
                      Guardar/mês (R$)
                    </label>
                    <input
                      type="number"
                      min="20"
                      max="5000"
                      value={newMonthly}
                      onChange={(e) => setNewMonthly(e.target.value)}
                      placeholder="420"
                      className="w-full mobbin-input text-xs font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#141414] block mb-1">
                    Motivo / Inspiração (opcional)
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Ex: Para conseguir produzir o dobro de bolos e pagar a natação dos meus filhos."
                    className="w-full mobbin-input text-xs h-18 resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 btn-outline text-xs py-2.5"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-xs py-2.5 flex items-center justify-center gap-1"
                  >
                    <span>Avançar</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* ETAPA 2: O Componente Solicitado Especificamente com Todas as Funções */}
            {createStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#141414]">
                    Simulação e Sorteio.
                  </h3>
                  <p className="text-xs font-light text-[#707070] mt-0.5">
                    {newTitle ? `Objetivo: "${newTitle}"` : 'Ajuste os valores da sua meta:'}
                  </p>
                </div>

                {/* Meta total */}
                <div>
                  <label className="text-xs font-semibold text-[#141414] uppercase tracking-wider block mb-2">
                    Meta total
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {targets.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setNewAmount(String(amt))}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                          Number(newAmount) === amt
                            ? 'bg-[#141414] text-white'
                            : 'bg-[#ffffff] text-[#141414] border border-[#e0e0e0] hover:bg-[#f3f3f3]'
                        }`}
                      >
                        R$ {amt.toLocaleString('pt-BR')}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowCustomTargetInput(true)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-[#707070] bg-[#f3f3f3] hover:text-[#141414] cursor-pointer"
                    >
                      Outro valor ↗
                    </button>
                  </div>

                  {showCustomTargetInput && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="number"
                        value={customTargetVal}
                        onChange={(e) => setCustomTargetVal(e.target.value)}
                        placeholder="Ex: 800"
                        className="flex-1 mobbin-input text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const v = Number(customTargetVal);
                          if (v >= 50 && v <= 50000) {
                            setNewAmount(String(v));
                            setShowCustomTargetInput(false);
                            setCustomTargetVal('');
                          }
                        }}
                        className="btn-primary text-xs px-3"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}
                </div>

                {/* Planejamento mensal: R$ 490 / mês */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#141414] mb-1.5">
                    <span>Planejamento mensal:</span>
                    <span className="font-bold text-sm">
                      R$ {newMonthly} / mês
                    </span>
                  </div>

                  <input
                    type="range"
                    min={20}
                    max={500}
                    step={10}
                    value={newMonthly}
                    onChange={(e) => setNewMonthly(e.target.value)}
                    className="w-full accent-[#141414] cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] text-[#707070] font-light mt-1">
                    <span>R$ 20</span>
                    <span>R$ 100</span>
                    <span>R$ 250</span>
                    <span>R$ 500</span>
                  </div>
                </div>

                {/* Guardando R$ 490 por mês, você atinge sua meta de R$ 1.000 em cerca de 3 meses. */}
                <div className="p-3.5 bg-[#f3f3f3] rounded-[16px] text-xs text-[#141414] leading-relaxed">
                  Guardando <b>R$ {newMonthly} por mês</b>, você atinge sua meta de <b>R$ {Number(newAmount).toLocaleString('pt-BR')}</b> em <b>{step2TimelineText()}</b>.
                </div>

                {/* Botão: Sortear novos depósitos */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleFinishStep2}
                    className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Sortear novos depósitos e começar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DETALHES DE UMA META PLANEJADA (Ao clicar nos cards pré-definidos) */}
      {/* ========================================================================= */}
      {selectedGoalDetail && (
        <div
          className="fixed inset-0 z-50 bg-[#141414]/40 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedGoalDetail(null);
          }}
        >
          <div className="bg-white border border-[#e0e0e0] rounded-[24px] p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-[#f3f3f3] squircle flex items-center justify-center text-3xl">
                {selectedGoalDetail.emoji}
              </div>
              <button
                onClick={() => setSelectedGoalDetail(null)}
                className="text-[#707070] hover:text-[#141414] p-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#707070]">
                {selectedGoalDetail.category}
              </span>
              <h3 className="text-lg font-bold text-[#141414] leading-tight mt-0.5">
                {selectedGoalDetail.title}.
              </h3>
              <p className="text-xs font-light text-[#707070] mt-1.5 leading-[1.43]">
                {selectedGoalDetail.description}
              </p>
            </div>

            <div className="bg-[#f3f3f3] p-4 rounded-[16px] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#707070]">Valor da meta:</span>
                <b className="text-[#141414] text-sm">R$ {selectedGoalDetail.targetAmount.toLocaleString('pt-BR')}</b>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#707070]">Economia mensal sugerida:</span>
                <b className="text-[#141414]">R$ {selectedGoalDetail.monthlySavings} / mês</b>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#707070]">Prazo estimado:</span>
                <b className="text-[#141414]">
                  {Math.ceil(selectedGoalDetail.targetAmount / selectedGoalDetail.monthlySavings)} meses
                </b>
              </div>
            </div>

            <div className="p-3 bg-white border border-[#f0f0f0] rounded-[16px] text-xs text-[#707070] font-light">
              <b className="text-[#141414] font-semibold block mb-0.5">Para quem é recomendado:</b>
              {selectedGoalDetail.idealFor}
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleSelectPreset(selectedGoalDetail)}
                className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Criar card de progresso e ativar meta
              </button>
              <button
                onClick={() => setSelectedGoalDetail(null)}
                className="w-full btn-outline text-xs py-2.5"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
