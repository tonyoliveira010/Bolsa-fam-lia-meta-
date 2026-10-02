import React, { useState } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  Plus,
  Trash2,
  Check,
  Calendar,
  DollarSign,
  Target,
  Sparkles,
  ArrowUpRight,
  Info,
  Layers,
  BookOpen,
  ArrowRightLeft,
  PiggyBank,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Percent,
  Coins,
  FolderPlus,
  X,
  ChevronDown,
  ChevronUp,
  Sliders,
  Award,
  Lock
} from 'lucide-react';
import {
  UserProfile,
  SaleRecord,
  TabType,
  DepositGoal,
  CustomPot,
  PotTransaction,
  TransactionType
} from '../types';
import { triggerCelebration } from '../utils/celebration';

interface FinanceTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigate: (tab: TabType) => void;
  goal?: DepositGoal;
  onUpdateGoal?: (updated: DepositGoal) => void;
  onOpenCheckout?: () => void;
}

// 5 Subtabs na ordem exata solicitada pelo usuário:
// 1. Faturamento
// 2. Calculadora de Lucro
// 3. Caderninho
// 4. Pote (Pote do Negócio, Pote da Casa + Criar Novo Pote)
// 5. Aulas com Simulador de Renda e Checklist da Saúde Financeira
type FinanceSubTab =
  | 'faturamento'
  | 'calculadora_lucro'
  | 'caderninho'
  | 'potes'
  | 'aulas_saude';

type ChartPeriod = 'dia' | 'semana' | 'mes';

export const FinanceTab: React.FC<FinanceTabProps> = ({
  profile,
  onUpdateProfile,
  onNavigate,
  goal,
  onUpdateGoal,
  onOpenCheckout
}) => {
  const isPro = profile.plan === 'pro';
  // Estado da subtab ativa - inicializa em 'faturamento' ou conforme a ordem
  const [activeSubTab, setActiveSubTab] = useState<FinanceSubTab>('faturamento');
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('semana');

  // =========================================================================
  // GESTÃO DOS POTES (PADRÃO: NEGÓCIO E CASA + NOVOS POTES PERSONALIZADOS)
  // =========================================================================
  const defaultPots: CustomPot[] = [
    {
      id: 'negocio',
      name: 'Pote do Negócio',
      emoji: '💼',
      color: 'emerald',
      description: 'Capital de giro, compra de ingredientes e matéria-prima.',
      isDefault: true
    },
    {
      id: 'casa',
      name: 'Pote da Casa',
      emoji: '🏡',
      color: 'amber',
      description: 'Pró-labore para alimentação, contas do lar e filhos.',
      isDefault: true
    },
    {
      id: 'investimentos',
      name: 'Pote de Investimentos',
      emoji: '📈',
      color: 'purple',
      description: 'Reserva de emergência e cofrinho para o futuro.',
      isDefault: false,
      targetAmount: 500
    }
  ];

  const pots: CustomPot[] = profile.customPots && profile.customPots.length > 0
    ? profile.customPots
    : defaultPots;

  // Transações iniciais contextualizadas
  const initialTransactions: PotTransaction[] = [
    {
      id: 'tx-init-1',
      date: 'Hoje',
      description: 'Venda de 12 Brownies e Brigadeiros',
      amount: 140,
      type: 'receita',
      pot: 'negocio',
      category: 'Vendas'
    },
    {
      id: 'tx-init-2',
      date: 'Hoje',
      description: 'Embalagens e laços para entrega',
      amount: 35,
      type: 'despesa',
      pot: 'negocio',
      category: 'Embalagens'
    },
    {
      id: 'tx-init-3',
      date: 'Ontem',
      description: 'Retirada de Pró-labore da semana',
      amount: 80,
      type: 'receita',
      pot: 'casa',
      category: 'Pró-Labore'
    },
    {
      id: 'tx-init-4',
      date: 'Ontem',
      description: 'Mercado e lanche das crianças',
      amount: 32,
      type: 'despesa',
      pot: 'casa',
      category: 'Alimentação'
    },
    {
      id: 'tx-init-5',
      date: 'Ontem',
      description: 'Aporte de Reserva (Meta 50 Depósitos)',
      amount: 50,
      type: 'investimento',
      pot: 'investimentos',
      category: 'Reserva'
    }
  ];

  const transactions: PotTransaction[] = profile.potTransactions && profile.potTransactions.length > 0
    ? profile.potTransactions
    : initialTransactions;

  // Modal: Novo Pote
  const [showCreatePotModal, setShowCreatePotModal] = useState(false);
  const [newPotName, setNewPotName] = useState('');
  const [newPotEmoji, setNewPotEmoji] = useState('🏺');
  const [newPotColor, setNewPotColor] = useState<CustomPot['color']>('blue');
  const [newPotTarget, setNewPotTarget] = useState('');
  const [newPotDesc, setNewPotDesc] = useState('');

  // Modal: Nova Transação no Pote
  const [showAddPotTx, setShowAddPotTx] = useState(false);
  const [txPotId, setTxPotId] = useState<string>('negocio');
  const [txType, setTxType] = useState<TransactionType>('receita');
  const [txAmount, setTxAmount] = useState('');
  const [txDesc, setTxDesc] = useState('');
  const [txCategory, setTxCategory] = useState('');
  const [isTransferMode, setIsTransferMode] = useState(false);
  const [transferFromPotId, setTransferFromPotId] = useState('negocio');
  const [transferToPotId, setTransferToPotId] = useState('casa');

  // Filtro de histórico nos potes
  const [potHistoryFilter, setPotHistoryFilter] = useState<string>('todos');

  // =========================================================================
  // TAB 2: CALCULADORA DE LUCRO & PRECIFICAÇÃO
  // =========================================================================
  const [pricingCost, setPricingCost] = useState<number>(4.2);
  const [pricingPackaging, setPricingPackaging] = useState<number>(1.2);
  const [pricingMinutes, setPricingMinutes] = useState<number>(25);
  const [pricingHourlyRate, setPricingHourlyRate] = useState<number>(25);
  const [pricingMargin, setPricingMargin] = useState<number>(50);
  const [pricingPresetName, setPricingPresetName] = useState<string>('Brownie no Pote');

  // =========================================================================
  // TAB 3: CADERNINHO DE VENDAS DIÁRIO
  // =========================================================================
  const [showAddCaderninho, setShowAddCaderninho] = useState(false);
  const [cadDesc, setCadDesc] = useState('');
  const [cadAmount, setCadAmount] = useState('');
  const [cadCost, setCadCost] = useState('');

  // =========================================================================
  // TAB 5: AULAS COM SIMULADOR DE RENDA E CHECKLIST DA SAÚDE FINANCEIRA
  // =========================================================================
  const [proLaboreBills, setProLaboreBills] = useState<number>(800);
  const [proLaboreWeeksWorked, setProLaboreWeeksWorked] = useState<number>(4);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(0);

  const defaultChecklist: Record<string, boolean> = {
    check_potes_separados: true,
    check_sem_misturar_pix: true,
    check_anotar_caderninho: true,
    check_custo_embalagem: false,
    check_pro_labore_dia_fixo: true,
    check_reserva_investimento: false
  };

  const financialChecklist = profile.financialChecklist || defaultChecklist;

  const toggleChecklistItem = (key: string) => {
    const updated = {
      ...financialChecklist,
      [key]: !financialChecklist[key]
    };
    onUpdateProfile({
      ...profile,
      financialChecklist: updated
    });
  };

  const checklistCompletedCount = Object.values(financialChecklist).filter(Boolean).length;
  const checklistTotalCount = Object.keys(financialChecklist).length;
  const healthScore = Math.round((checklistCompletedCount / checklistTotalCount) * 100);

  // =========================================================================
  // CÁLCULOS DOS POTES
  // =========================================================================
  const getPotStats = (potId: string) => {
    const potTxList = transactions.filter((t) => t.pot === potId);
    const income = potTxList
      .filter((t) => t.type === 'receita' || t.type === 'investimento')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = potTxList
      .filter((t) => t.type === 'despesa')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = Math.max(0, income - expense);
    return { income, expense, balance };
  };

  // Encontrar o maior saldo para calcular a altura líquida do pote de vidro
  const maxJarBalance = Math.max(
    ...pots.map((p) => getPotStats(p.id).balance),
    400
  );

  // Manipular criação de novo pote
  const handleCreatePot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPotName.trim()) return;

    const potId = 'pot_' + Date.now();
    const newPot: CustomPot = {
      id: potId,
      name: newPotName.trim(),
      emoji: newPotEmoji || '🏺',
      color: newPotColor,
      targetAmount: newPotTarget ? parseFloat(newPotTarget) : undefined,
      description: newPotDesc.trim() || undefined,
      isDefault: false
    };

    const updatedPots = [...pots, newPot];
    onUpdateProfile({
      ...profile,
      customPots: updatedPots
    });

    setNewPotName('');
    setNewPotTarget('');
    setNewPotDesc('');
    setShowCreatePotModal(false);
    triggerCelebration(true);
  };

  // Excluir pote personalizado
  const handleDeleteCustomPot = (potId: string) => {
    const updatedPots = pots.filter((p) => p.id !== potId);
    const updatedTx = transactions.filter((t) => t.pot !== potId);
    onUpdateProfile({
      ...profile,
      customPots: updatedPots,
      potTransactions: updatedTx
    });
  };

  // Adicionar lançamento no pote
  const handleAddPotTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(txAmount.replace(',', '.'));
    if (isNaN(val) || val <= 0 || !txDesc.trim()) return;

    const todayStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    let newTxList = [...transactions];

    if (isTransferMode) {
      const fromPotObj = pots.find((p) => p.id === transferFromPotId);
      const toPotObj = pots.find((p) => p.id === transferToPotId);

      const outTx: PotTransaction = {
        id: 'tx-out-' + Date.now(),
        date: todayStr,
        description: `Saída de Transferência: ${txDesc.trim()}`,
        amount: val,
        type: 'despesa',
        pot: transferFromPotId,
        category: `Para ${toPotObj?.name || 'Pote'}`
      };

      const inTx: PotTransaction = {
        id: 'tx-in-' + Date.now(),
        date: todayStr,
        description: `Entrada de Transferência: ${txDesc.trim()}`,
        amount: val,
        type: 'receita',
        pot: transferToPotId,
        category: `De ${fromPotObj?.name || 'Pote'}`
      };

      newTxList = [inTx, outTx, ...newTxList];
    } else {
      const singleTx: PotTransaction = {
        id: 'tx-' + Date.now(),
        date: todayStr,
        description: txDesc.trim(),
        amount: val,
        type: txType,
        pot: txPotId,
        category: txCategory.trim() || (txType === 'receita' ? 'Entrada' : txType === 'despesa' ? 'Saída' : 'Aporte')
      };
      newTxList = [singleTx, ...newTxList];

      // Se for receita no negócio, vincular automaticamente ao caderninho
      if (txPotId === 'negocio' && txType === 'receita') {
        const newSale: SaleRecord = {
          id: Date.now().toString(),
          date: todayStr,
          description: txDesc.trim(),
          amount: val,
          cost: Math.round(val * 0.35 * 100) / 100
        };
        onUpdateProfile({
          ...profile,
          sales: [newSale, ...profile.sales],
          potTransactions: newTxList,
          customPots: pots
        });
        setTxAmount('');
        setTxDesc('');
        setTxCategory('');
        setShowAddPotTx(false);
        setIsTransferMode(false);
        triggerCelebration(true);
        return;
      }
    }

    onUpdateProfile({
      ...profile,
      potTransactions: newTxList,
      customPots: pots
    });

    setTxAmount('');
    setTxDesc('');
    setTxCategory('');
    setShowAddPotTx(false);
    setIsTransferMode(false);
    triggerCelebration(true);
  };

  const handleDeletePotTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    onUpdateProfile({
      ...profile,
      potTransactions: updated,
      customPots: pots
    });
  };

  // =========================================================================
  // CÁLCULOS CADERNINHO & FATURAMENTO
  // =========================================================================
  const totalRevenue = profile.sales.reduce((acc, s) => acc + s.amount, 0);
  const totalCost = profile.sales.reduce((acc, s) => acc + s.cost, 0);
  const totalProfit = totalRevenue - totalCost;

  const handleAddCaderninho = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(cadAmount);
    if (!cadDesc.trim() || isNaN(amt) || amt <= 0) return;
    const cst = parseFloat(cadCost) || 0;
    const todayStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    const newRecord: SaleRecord = {
      id: Date.now().toString(),
      date: todayStr,
      description: cadDesc.trim(),
      amount: amt,
      cost: cst
    };

    // Alimenta o Pote do Negócio como receita
    const potSaleTx: PotTransaction = {
      id: 'tx-cad-rev-' + Date.now(),
      date: todayStr,
      description: cadDesc.trim(),
      amount: amt,
      type: 'receita',
      pot: 'negocio',
      category: 'Vendas Caderninho'
    };

    // Se houve custo de insumos, lança a despesa correspondente no Pote do Negócio
    const potCostTx: PotTransaction | null =
      cst > 0
        ? {
            id: 'tx-cad-cost-' + Date.now(),
            date: todayStr,
            description: `Insumos: ${cadDesc.trim()}`,
            amount: cst,
            type: 'despesa',
            pot: 'negocio',
            category: 'Matéria-prima'
          }
        : null;

    const updatedPots = potCostTx
      ? [potSaleTx, potCostTx, ...transactions]
      : [potSaleTx, ...transactions];

    onUpdateProfile({
      ...profile,
      sales: [newRecord, ...profile.sales],
      potTransactions: updatedPots,
      customPots: pots
    });

    setCadDesc('');
    setCadAmount('');
    setCadCost('');
    setShowAddCaderninho(false);
    triggerCelebration(true);
  };

  const handleDeleteSale = (id: string) => {
    onUpdateProfile({
      ...profile,
      sales: profile.sales.filter((s) => s.id !== id)
    });
  };

  // =========================================================================
  // CÁLCULOS DA CALCULADORA DE LUCRO
  // =========================================================================
  const directCost = pricingCost + pricingPackaging;
  const laborCost = (pricingMinutes / 60) * pricingHourlyRate;
  const suggestedSalePrice =
    pricingMargin < 100
      ? directCost / (1 - pricingMargin / 100) + laborCost
      : directCost * 2 + laborCost;
  const realProfit = Math.max(0, suggestedSalePrice - directCost);
  const realMarginPercent =
    suggestedSalePrice > 0 ? Math.round((realProfit / suggestedSalePrice) * 100) : 0;

  const applyPricingPreset = (
    name: string,
    cost: number,
    pack: number,
    min: number,
    hour: number,
    margin: number
  ) => {
    setPricingPresetName(name);
    setPricingCost(cost);
    setPricingPackaging(pack);
    setPricingMinutes(min);
    setPricingHourlyRate(hour);
    setPricingMargin(margin);
  };

  // =========================================================================
  // GRÁFICO DE FATURAMENTO
  // =========================================================================
  const chartConfigs: Record<
    ChartPeriod,
    { labels: string[]; values: number[]; total: number; profit: number }
  > = {
    dia: {
      labels: ['08h', '10h', '12h', '14h', '16h', '18h', '20h'],
      values: [0, 25, 50, 35, 75, 95, 45],
      total: 325,
      profit: 195
    },
    semana: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      values: [60, 110, 85, 140, 220, 280, 95],
      total: 990,
      profit: 594
    },
    mes: {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      values: [650, 820, 950, 1120],
      total: 3540,
      profit: 2124
    }
  };

  const currentChart = chartConfigs[chartPeriod];
  const maxVal = Math.max(...currentChart.values, 100);
  const chartWidth = 320;
  const chartHeight = 110;
  const paddingX = 20;
  const points = currentChart.values.map((v, i) => {
    const x = paddingX + (i / (currentChart.values.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - (v / maxVal) * (chartHeight - 25) - 10;
    return { x, y, value: v, label: currentChart.labels[i] };
  });

  const pathData = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaData = `${pathData} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  // Retirada semanal calculada
  const recommendedWeeklyWithdrawal = Math.round(proLaboreBills / proLaboreWeeksWorked);

  // Estilos de cores para potes
  const getPotColorClasses = (color: CustomPot['color']) => {
    switch (color) {
      case 'emerald':
        return {
          border: 'border-emerald-500/30',
          bgHeader: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
          liquidGrad: 'from-emerald-600 via-emerald-500 to-teal-400',
          accentText: 'text-emerald-600 dark:text-emerald-400',
          rim: 'bg-emerald-600/30'
        };
      case 'amber':
        return {
          border: 'border-amber-500/30',
          bgHeader: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
          liquidGrad: 'from-amber-600 via-amber-500 to-yellow-400',
          accentText: 'text-amber-600 dark:text-amber-400',
          rim: 'bg-amber-600/30'
        };
      case 'purple':
        return {
          border: 'border-purple-500/30',
          bgHeader: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
          liquidGrad: 'from-purple-700 via-purple-500 to-indigo-400',
          accentText: 'text-purple-600 dark:text-purple-400',
          rim: 'bg-purple-600/30'
        };
      case 'rose':
        return {
          border: 'border-rose-500/30',
          bgHeader: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
          liquidGrad: 'from-rose-600 via-rose-500 to-pink-400',
          accentText: 'text-rose-600 dark:text-rose-400',
          rim: 'bg-rose-600/30'
        };
      case 'teal':
        return {
          border: 'border-teal-500/30',
          bgHeader: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
          liquidGrad: 'from-teal-700 via-teal-500 to-cyan-400',
          accentText: 'text-teal-600 dark:text-teal-400',
          rim: 'bg-teal-600/30'
        };
      case 'blue':
      default:
        return {
          border: 'border-blue-500/30',
          bgHeader: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
          liquidGrad: 'from-blue-600 via-blue-500 to-sky-400',
          accentText: 'text-blue-600 dark:text-blue-400',
          rim: 'bg-blue-600/30'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header com Voltar ao Perfil */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('perfil')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)] hover:text-[#0066ff] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Perfil</span>
        </button>

        <span className="text-[10px] font-bold text-white bg-[#0066ff] px-2.5 py-0.5 rounded-full shadow-xs">
          Gestão Financeira PRO
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">
          Gestão Financeira Completa.
        </h1>
        <p className="text-xs font-light text-[var(--text-muted)] mt-0.5 leading-[1.38]">
          Faturamento, calculadora de lucro, caderninho de vendas, regra dos potes vivos e aulas com simulador.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 5 SUBTABS NA ORDEM EXATA SOLICITADA PELO USUÁRIO:                         */}
      {/* 1. Faturamento | 2. Calculadora de Lucro | 3. Caderninho | 4. Pote | 5. Aulas com Simulador e Checklist */}
      {/* ========================================================================= */}
      <div className="bg-[var(--field)] p-1 rounded-full flex gap-1 overflow-x-auto no-scrollbar">
        {/* Tab 1: Faturamento */}
        <button
          onClick={() => setActiveSubTab('faturamento')}
          className={`flex-1 min-w-[76px] py-2 px-1 text-[11px] font-bold rounded-full flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'faturamento'
              ? 'bg-[var(--ink)] text-[var(--canvas)] shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Faturamento</span>
        </button>

        {/* Tab 2: Calculadora de Lucro */}
        <button
          onClick={() => setActiveSubTab('calculadora_lucro')}
          className={`flex-1 min-w-[94px] py-2 px-1 text-[11px] font-bold rounded-full flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'calculadora_lucro'
              ? 'bg-[var(--ink)] text-[var(--canvas)] shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Calculadora de Lucro</span>
        </button>

        {/* Tab 3: Caderninho */}
        <button
          onClick={() => setActiveSubTab('caderninho')}
          className={`flex-1 min-w-[76px] py-2 px-1 text-[11px] font-bold rounded-full flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'caderninho'
              ? 'bg-[var(--ink)] text-[var(--canvas)] shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Caderninho</span>
        </button>

        {/* Tab 4: Pote */}
        <button
          onClick={() => setActiveSubTab('potes')}
          className={`flex-1 min-w-[65px] py-2 px-1 text-[11px] font-bold rounded-full flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'potes'
              ? 'bg-[var(--ink)] text-[var(--canvas)] shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
          }`}
        >
          <PiggyBank className="w-3.5 h-3.5" />
          <span>Potes</span>
        </button>

        {/* Tab 5: Aulas com Simulador de Renda e Checklist */}
        <button
          onClick={() => setActiveSubTab('aulas_saude')}
          className={`flex-1 min-w-[96px] py-2 px-1 text-[11px] font-bold rounded-full flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'aulas_saude'
              ? 'bg-[var(--ink)] text-[var(--canvas)] shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Aulas & Saúde</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: FATURAMENTO (GRÁFICO LINHA + FILTROS + COMO FUNCIONA)             */}
      {/* ========================================================================= */}
      {activeSubTab === 'faturamento' && (
        <div className="space-y-4">
          {!isPro && (
            <div className="bg-gradient-to-br from-[#0066ff]/15 via-emerald-500/10 to-transparent border-2 border-[#0066ff] rounded-[24px] p-5 text-center space-y-3 shadow-md">
              <div className="w-11 h-11 rounded-full bg-[#0066ff] text-white flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066ff] block">
                  Recurso Exclusivo · Kit Mãe Empreendedora
                </span>
                <h3 className="text-base font-extrabold text-[var(--ink)] mt-0.5">
                  Desbloqueie os Gráficos de Faturamento
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm mx-auto leading-relaxed">
                  Acompanhe a curva de evolução diária, semanal e mensal de vendas com análise de lucro limpo em tempo real.
                </p>
              </div>
              <button
                onClick={onOpenCheckout}
                className="btn-primary text-xs py-3 px-6 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-lg bg-[#0066ff] hover:bg-blue-600"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Desbloquear Acesso Completo por R$ 6,90</span>
              </button>
            </div>
          )}

          <div
            onClick={!isPro ? onOpenCheckout : undefined}
            className={!isPro ? 'cursor-pointer select-none space-y-4 relative' : 'space-y-4'}
          >
            {!isPro && (
              <div className="absolute inset-0 z-20 bg-transparent cursor-pointer" />
            )}
            <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-4 shadow-2xs">
              {/* Header com Filtros de Período */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-[var(--ink)] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#0066ff]" />
                    Curva de Faturamento
                  </h2>
                  <span className="text-[11px] text-[var(--text-muted)] font-light">
                    Acompanhe a evolução das entradas e lucros
                  </span>
                </div>

                {/* Filtros: Dia | Semana | Mês */}
                <div className="bg-[var(--field)] p-0.5 rounded-full flex gap-1">
                  {(['dia', 'semana', 'mes'] as ChartPeriod[]).map((period) => (
                    <button
                      key={period}
                      onClick={() => setChartPeriod(period)}
                      className={`py-1 px-3 text-[11px] font-bold rounded-full transition-colors cursor-pointer ${
                        chartPeriod === period
                          ? 'bg-[var(--canvas)] text-[var(--ink)] shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {period === 'dia' ? 'Dia' : period === 'semana' ? 'Semana' : 'Mês'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick KPI stats */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="bg-[var(--canvas-soft)] p-3 rounded-[16px]">
                  <span className="text-[10px] font-medium text-[var(--text-muted)] block uppercase tracking-wider">
                    Faturamento Estimado
                  </span>
                  <span className="text-lg font-bold text-[var(--ink)]">
                    R$ {currentChart.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="bg-[var(--canvas-soft)] p-3 rounded-[16px]">
                  <span className="text-[10px] font-medium text-[#0066ff] block uppercase tracking-wider">
                    Lucro Líquido
                  </span>
                  <span className="text-lg font-bold text-[var(--ink)]">
                    + R$ {currentChart.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* SVG Line Chart */}
              <div className="pt-2">
                <div className="w-full overflow-hidden">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-36 overflow-visible"
                  >
                    <defs>
                      <linearGradient id="faturamentoGradPote" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0066ff" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0066ff" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <line x1="10" y1="20" x2={chartWidth - 10} y2="20" stroke="var(--hairline-soft)" strokeDasharray="3 3" />
                    <line x1="10" y1="60" x2={chartWidth - 10} y2="60" stroke="var(--hairline-soft)" strokeDasharray="3 3" />
                    <line x1="10" y1="100" x2={chartWidth - 10} y2="100" stroke="var(--hairline-soft)" />

                    <path d={areaData} fill="url(#faturamentoGradPote)" />

                    <path
                      d={pathData}
                      fill="none"
                      stroke="#0066ff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {points.map((p, idx) => (
                      <g key={idx}>
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="4"
                          fill="var(--canvas)"
                          stroke="#0066ff"
                          strokeWidth="2.5"
                        />
                      </g>
                    ))}
                  </svg>

                  <div className="flex justify-between px-2 pt-1 text-[10px] font-semibold text-[var(--text-muted)]">
                    {currentChart.labels.map((lbl, i) => (
                      <span key={i} className="text-center">{lbl}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Como Funciona o Faturamento na Prática */}
            <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0066ff]" />
                <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                  Como Funciona o Faturamento na Prática
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-[var(--canvas-soft)] rounded-[16px] space-y-1">
                  <b className="text-[var(--ink)] block font-semibold">1. Faturamento não é salário da mãe</b>
                  <p className="text-[var(--text-muted)] font-light leading-relaxed">
                    Faturamento é todo o dinheiro bruto que entra no caixa das vendas. Antes de gastar para a casa, separe os custos de matéria-prima e guarde no Pote do Negócio.
                  </p>
                </div>

                <div className="p-3 bg-[var(--canvas-soft)] rounded-[16px] space-y-1">
                  <b className="text-[var(--ink)] block font-semibold">2. A margem saudável de 40% a 60%</b>
                  <p className="text-[var(--text-muted)] font-light leading-relaxed">
                    Se você vende um produto por R$ 14,00, o custo de produção deve ser de R$ 5,00 a R$ 7,00 para garantir pró-labore justo e capital de giro.
                  </p>
                </div>

                <div className="p-3 bg-[var(--canvas-soft)] rounded-[16px] space-y-1">
                  <b className="text-[var(--ink)] block font-semibold">3. O pico de vendas da semana</b>
                  <p className="text-[var(--text-muted)] font-light leading-relaxed">
                    Sexta e sábado concentram 60% das vendas. Planeje a produção na quinta-feira para atender a demanda e maximizar o faturamento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: CALCULADORA DE LUCRO (PRECIFICAÇÃO INTELIGENTE & PRESETS)          */}
      {/* ========================================================================= */}
      {activeSubTab === 'calculadora_lucro' && (
        <div className="space-y-4">
          <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  Calculadora de Precificação & Lucro Limpo
                </h3>
                <span className="text-[11px] text-[var(--text-muted)] font-light">
                  Descubra exatamente por quanto vender cada produto ou serviço
                </span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-500/15 px-2.5 py-0.5 rounded-full">
                Preset: {pricingPresetName}
              </span>
            </div>

            {/* Presets Rápidos de 1 Clique */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)]">
                Exemplos de produtos para carregar:
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => applyPricingPreset('Brownie no Pote', 4.2, 1.5, 25, 20, 50)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-[var(--canvas-soft)] hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                >
                  🍫 Brownie Pote
                </button>
                <button
                  onClick={() => applyPricingPreset('Cento de Brigadeiros', 18, 5, 45, 25, 55)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-[var(--canvas-soft)] hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                >
                  🍬 Cento Brigadeiro
                </button>
                <button
                  onClick={() => applyPricingPreset('Marmita Fit Congelada', 6.8, 1.8, 30, 20, 45)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-[var(--canvas-soft)] hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                >
                  🥗 Marmita Fit
                </button>
                <button
                  onClick={() => applyPricingPreset('Laços Infantis', 3.5, 0.8, 20, 25, 60)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-[var(--canvas-soft)] hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                >
                  🎀 Laços Infantis
                </button>
                <button
                  onClick={() => applyPricingPreset('Unhas & Manicure', 6.0, 1.0, 50, 30, 60)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-[var(--canvas-soft)] hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors shrink-0 cursor-pointer"
                >
                  💅 Unhas / Manicure
                </button>
              </div>
            </div>

            {/* Inputs de Custo */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-[var(--ink)] block mb-1">
                  Insumos / Ingredientes
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-muted)] font-bold">R$</span>
                  <input
                    type="number"
                    step="0.5"
                    value={pricingCost}
                    onChange={(e) => {
                      setPricingCost(parseFloat(e.target.value) || 0);
                      setPricingPresetName('Personalizado');
                    }}
                    className="w-full mobbin-input text-xs pl-7 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--ink)] block mb-1">
                  Embalagem / Sacola
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-muted)] font-bold">R$</span>
                  <input
                    type="number"
                    step="0.2"
                    value={pricingPackaging}
                    onChange={(e) => {
                      setPricingPackaging(parseFloat(e.target.value) || 0);
                      setPricingPresetName('Personalizado');
                    }}
                    className="w-full mobbin-input text-xs pl-7 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--ink)] block mb-1">
                  Tempo Gasto (minutos)
                </label>
                <input
                  type="number"
                  step="5"
                  value={pricingMinutes}
                  onChange={(e) => {
                    setPricingMinutes(parseFloat(e.target.value) || 0);
                    setPricingPresetName('Personalizado');
                  }}
                  className="w-full mobbin-input text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--ink)] block mb-1">
                  Sua Hora Desejada
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-muted)] font-bold">R$</span>
                  <input
                    type="number"
                    step="5"
                    value={pricingHourlyRate}
                    onChange={(e) => {
                      setPricingHourlyRate(parseFloat(e.target.value) || 0);
                      setPricingPresetName('Personalizado');
                    }}
                    className="w-full mobbin-input text-xs pl-7 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Margem Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[var(--ink)]">
                  Margem de Lucro Limpo Desejada:
                </span>
                <span className="font-extrabold text-emerald-600">{pricingMargin}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={pricingMargin}
                onChange={(e) => {
                  setPricingMargin(Number(e.target.value));
                  setPricingPresetName('Personalizado');
                }}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                <span>20% (mínimo)</span>
                <span>50% (equilibrado e saudável)</span>
                <span>80% (alta rentabilidade)</span>
              </div>
            </div>

            {/* Resultado da Precificação */}
            <div className="bg-gradient-to-br from-emerald-600/10 via-[var(--canvas-soft)] to-[var(--canvas-soft)] p-4 rounded-[20px] border border-emerald-500/25 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 block">
                    Preço de Venda Recomendado
                  </span>
                  <span className="text-2xl font-black text-[var(--ink)] tracking-tight">
                    R$ {suggestedSalePrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="bg-[var(--canvas)] px-3 py-2 rounded-[14px] border border-[var(--hairline)]">
                    <span className="text-[9px] text-[var(--text-muted)] block uppercase">Lucro Limpo / Peça</span>
                    <span className="text-xs font-bold text-emerald-600">
                      + R$ {realProfit.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="bg-[var(--canvas)] px-3 py-2 rounded-[14px] border border-[var(--hairline)]">
                    <span className="text-[9px] text-[var(--text-muted)] block uppercase">Custo Unitário</span>
                    <span className="text-xs font-bold text-[var(--ink)]">
                      R$ {directCost.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Como esse dinheiro se divide nos potes */}
              <div className="pt-2 border-t border-[var(--hairline-soft)] flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>💼 Para o <b>Pote do Negócio</b>: <b>R$ {directCost.toFixed(2)}</b> (insumos)</span>
                <span>🏡 Para o <b>Pote da Casa</b>: <b className="text-emerald-600">+ R$ {realProfit.toFixed(2)}</b> (lucro)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: CADERNINHO (ENTRADAS DIÁRIAS & VENDAS)                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'caderninho' && (
        <div className="space-y-4">
          {!isPro && (
            <div className="bg-gradient-to-br from-[#0066ff]/15 via-emerald-500/10 to-transparent border-2 border-[#0066ff] rounded-[24px] p-5 text-center space-y-3 shadow-md">
              <div className="w-11 h-11 rounded-full bg-[#0066ff] text-white flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066ff] block">
                  Recurso Exclusivo · Kit Mãe Empreendedora
                </span>
                <h3 className="text-base font-extrabold text-[var(--ink)] mt-0.5">
                  Desbloqueie o Caderninho de Vendas Diário
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm mx-auto leading-relaxed">
                  Registre suas vendas diárias com cálculo de custo de insumos e lucro limpo no bolso, alimentando automaticamente o Pote do Negócio.
                </p>
              </div>
              <button
                onClick={onOpenCheckout}
                className="btn-primary text-xs py-3 px-6 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-lg bg-[#0066ff] hover:bg-blue-600"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Desbloquear Caderninho por R$ 6,90</span>
              </button>
            </div>
          )}

          <div
            onClick={!isPro ? onOpenCheckout : undefined}
            className={!isPro ? 'cursor-pointer select-none space-y-4 relative' : 'space-y-4'}
          >
            {!isPro && (
              <div className="absolute inset-0 z-20 bg-transparent cursor-pointer" />
            )}
            <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                    Caderninho de Vendas Diário
                  </h3>
                  <span className="text-[11px] text-[var(--text-muted)] font-light">
                    Entradas do dia e controle de caixa (alimenta o Pote do Negócio)
                  </span>
                </div>

                <button
                  onClick={() => setShowAddCaderninho(true)}
                  className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nova venda
                </button>
              </div>

              {/* Resumo financeiro */}
              <div className="grid grid-cols-2 gap-2.5 bg-[var(--canvas-soft)] p-3.5 rounded-[18px]">
                <div>
                  <span className="text-[10px] font-medium text-[var(--text-muted)] block">Vendas anotadas</span>
                  <span className="text-base font-bold text-[var(--ink)]">
                    R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-[var(--text-muted)] block">Lucro limpo</span>
                  <span className="text-base font-bold text-[var(--ink)]">
                    + R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Modal de Lançamento no Caderninho */}
              {showAddCaderninho && (
                <form onSubmit={handleAddCaderninho} className="bg-[var(--canvas-soft)] p-4 rounded-[18px] space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                      Descrição da venda / produto
                    </label>
                    <input
                      type="text"
                      value={cadDesc}
                      onChange={(e) => setCadDesc(e.target.value)}
                      placeholder="Ex: 3 potes de brigadeiro"
                      className="w-full mobbin-input text-xs"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                        Valor recebido (R$)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={cadAmount}
                        onChange={(e) => setCadAmount(e.target.value)}
                        placeholder="21,00"
                        className="w-full mobbin-input text-xs font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                        Custo de material (R$)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={cadCost}
                        onChange={(e) => setCadCost(e.target.value)}
                        placeholder="7,50"
                        className="w-full mobbin-input text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddCaderninho(false)}
                      className="flex-1 btn-outline text-xs py-2"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary text-xs py-2"
                    >
                      Registrar no Caixa & Negócio
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de Registros */}
              <div className="space-y-2">
                {profile.sales.length > 0 ? (
                  profile.sales.map((item) => {
                    const profit = item.amount - item.cost;
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-[16px] border border-[var(--hairline-soft)] flex items-center justify-between gap-3 text-xs bg-[var(--canvas)] hover:border-[var(--ink)] transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--canvas-soft)] px-1.5 py-0.5 rounded">
                              {item.date}
                            </span>
                            <b className="font-semibold text-[var(--ink)] truncate">
                              {item.description}
                            </b>
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] mt-0.5 flex gap-2">
                            <span className="text-[#0066ff] font-semibold">
                              Lucro: + R$ {profit.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="font-bold text-sm text-[var(--ink)]">
                            R$ {item.amount.toFixed(2).replace('.', ',')}
                          </span>
                          <button
                            onClick={() => handleDeleteSale(item.id)}
                            className="text-[var(--text-faint)] hover:text-[var(--ink)] p-1 cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-[var(--text-muted)] bg-[var(--canvas-soft)] rounded-[18px]">
                    Nenhuma venda lançada ainda. Clique em "+ Nova venda" para registrar suas primeiras entradas.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: POTES (POTE DO NEGÓCIO, POTE DA CASA + CRIAR NOVO POTE)           */}
      {/* ========================================================================= */}
      {activeSubTab === 'potes' && (
        <div className="space-y-4">
          {!isPro && (
            <div className="bg-gradient-to-br from-[#0066ff]/15 via-emerald-500/10 to-transparent border-2 border-[#0066ff] rounded-[24px] p-5 text-center space-y-3 shadow-md">
              <div className="w-11 h-11 rounded-full bg-[#0066ff] text-white flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066ff] block">
                  Recurso Exclusivo · Kit Mãe Empreendedora
                </span>
                <h3 className="text-base font-extrabold text-[var(--ink)] mt-0.5">
                  Desbloqueie a Regra dos Potes de Dinheiro
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm mx-auto leading-relaxed">
                  Separe o dinheiro da casa do dinheiro do negócio, crie potes personalizados e transfira seu pró-labore em 1 clique.
                </p>
              </div>
              <button
                onClick={onOpenCheckout}
                className="btn-primary text-xs py-3 px-6 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-lg bg-[#0066ff] hover:bg-blue-600"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Desbloquear Potes por R$ 6,90</span>
              </button>
            </div>
          )}

          <div
            onClick={!isPro ? onOpenCheckout : undefined}
            className={!isPro ? 'cursor-pointer select-none space-y-4 relative' : 'space-y-4'}
          >
            {!isPro && (
              <div className="absolute inset-0 z-20 bg-transparent cursor-pointer" />
            )}
            {/* Header com Ações: Lançar no Pote, Transferir Pró-labore e Criar Novo Pote */}
            <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">🏺</span>
                <div>
                  <h2 className="text-sm font-bold text-[var(--ink)]">
                    Regra dos Potes de Dinheiro
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)] font-light">
                    Pote do Negócio e Pote da Casa separados, mais seus potes personalizados que enchem em tempo real.
                  </p>
                </div>
              </div>

              {/* Botões de Ação do Topo */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowCreatePotModal(true)}
                  className="flex-1 sm:flex-none btn-outline py-1.5 px-3 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-[#0066ff]" />
                  <span>+ Criar Pote</span>
                </button>

                <button
                  onClick={() => {
                    setIsTransferMode(false);
                    setTxPotId('negocio');
                    setTxType('receita');
                    setShowAddPotTx(true);
                  }}
                  className="flex-1 sm:flex-none btn-primary py-1.5 px-3.5 text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Lançar</span>
                </button>
              </div>
            </div>

            {/* Quick Action: Transferir Pró-Labore */}
            <div className="pt-1 flex items-center justify-between p-3 bg-[var(--canvas-soft)] rounded-[18px]">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-[var(--ink)]">
                  Transferir Pró-Labore semanal (Negócio ➔ Casa)
                </span>
              </div>
              <button
                onClick={() => {
                  setIsTransferMode(true);
                  setTransferFromPotId('negocio');
                  setTransferToPotId('casa');
                  setTxAmount(recommendedWeeklyWithdrawal.toString());
                  setTxDesc('Transferência de Pró-labore para a Casa');
                  setShowAddPotTx(true);
                }}
                className="py-1 px-3 rounded-full bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 text-[11px] font-bold transition-colors cursor-pointer"
              >
                Transferir R$ {recommendedWeeklyWithdrawal}
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* UI/UX REFINADA DOS POTES DE VIDRO (CARD GRID)                              */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {pots.map((pot) => {
              const stats = getPotStats(pot.id);
              const colorClasses = getPotColorClasses(pot.color);
              const target = pot.targetAmount || 0;
              const fillPercent = target > 0
                ? Math.min(100, Math.max(15, Math.round((stats.balance / target) * 100)))
                : Math.min(100, Math.max(18, Math.round((stats.balance / maxJarBalance) * 100)));

              return (
                <div
                  key={pot.id}
                  className={`bg-[var(--canvas)] border ${colorClasses.border} rounded-[24px] p-4.5 space-y-3.5 relative overflow-hidden shadow-2xs flex flex-col justify-between`}
                >
                  {/* Topo do Pote */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{pot.emoji}</span>
                        <div>
                          <b className="text-xs font-bold text-[var(--ink)] block">
                            {pot.name}
                          </b>
                          {pot.description && (
                            <span className="text-[10px] text-[var(--text-muted)] font-light block leading-tight">
                              {pot.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {!pot.isDefault && (
                        <button
                          onClick={() => handleDeleteCustomPot(pot.id)}
                          className="text-[var(--text-faint)] hover:text-rose-500 p-1 cursor-pointer"
                          title="Excluir este pote"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* UI/UX: JARRA DE VIDRO REALISTA COM LÍQUIDO DINÂMICO */}
                  <div className="relative w-full h-40 bg-[var(--canvas-soft)] rounded-[22px] border-2 border-dashed border-[var(--hairline)] overflow-hidden flex flex-col justify-end p-3 shadow-inner">
                    {/* Tampa de Vidro / Rolha do Pote */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-28 h-2.5 ${colorClasses.rim} rounded-b-lg border-b border-white/20`} />

                    {/* Reflexo de Vidro Transparente */}
                    <div className="absolute top-3 left-3 w-1.5 h-16 bg-white/30 rounded-full blur-[0.5px]" />

                    {/* Líquido Preenchido com Gradiente e Animação */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${colorClasses.liquidGrad} transition-all duration-700 opacity-85`}
                      style={{ height: `${fillPercent}%` }}
                    >
                      {/* Borda superior da onda líquida */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/40 shadow-xs" />
                    </div>

                    {/* Badge Flutuante de Saldo Centralizado */}
                    <div className="relative z-10 text-center bg-[var(--canvas)]/90 backdrop-blur-md p-2 rounded-[16px] border border-[var(--hairline)] shadow-sm">
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--text-muted)] block">
                        Saldo Atual no Pote
                      </span>
                      <span className="text-base font-extrabold text-[var(--ink)] block">
                        R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      {target > 0 && (
                        <span className="text-[9px] text-[var(--text-muted)] block font-medium">
                          Meta: R$ {target.toLocaleString('pt-BR')} ({Math.round((stats.balance / target) * 100)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Micro KPIs: Entradas e Saídas */}
                  <div className="space-y-1 text-[11px] pt-0.5">
                    <div className="flex justify-between text-[var(--text-muted)]">
                      <span>Total que entrou:</span>
                      <span className={`font-semibold ${colorClasses.accentText}`}>
                        + R$ {stats.income.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="flex justify-between text-[var(--text-muted)]">
                      <span>Total que saiu:</span>
                      <span className="font-semibold text-rose-500">
                        - R$ {stats.expense.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  {/* Ações Rápidas do Pote */}
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setIsTransferMode(false);
                        setTxPotId(pot.id);
                        setTxType('receita');
                        setShowAddPotTx(true);
                      }}
                      className={`flex-1 py-1.5 text-[11px] font-bold rounded-[12px] ${colorClasses.bgHeader} transition-colors cursor-pointer text-center`}
                    >
                      + Receita
                    </button>
                    <button
                      onClick={() => {
                        setIsTransferMode(false);
                        setTxPotId(pot.id);
                        setTxType('despesa');
                        setShowAddPotTx(true);
                      }}
                      className="flex-1 py-1.5 text-[11px] font-bold rounded-[12px] bg-[var(--field)] hover:bg-[var(--canvas-soft)] text-[var(--ink)] transition-colors cursor-pointer text-center"
                    >
                      - Despesa
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Card para Criar Novo Pote Rápido */}
            <div
              onClick={() => setShowCreatePotModal(true)}
              className="border-2 border-dashed border-[var(--hairline)] hover:border-[#0066ff] rounded-[24px] p-6 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all hover:bg-[var(--canvas-soft)] min-h-[260px]"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--field)] flex items-center justify-center text-[#0066ff]">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <b className="text-xs font-bold text-[var(--ink)] block">
                  Criar Novo Pote
                </b>
                <span className="text-[11px] text-[var(--text-muted)] font-light mt-0.5 block max-w-[200px]">
                  Ex: Pote da Reforma, Natal dos Filhos, Viagem ou Reserva
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MODAL: CRIAR NOVO POTE                                                    */}
          {/* ========================================================================= */}
          {showCreatePotModal && (
            <div className="bg-[var(--canvas)] border-2 border-[#0066ff] rounded-[24px] p-5 space-y-4 shadow-md animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <h3 className="text-sm font-bold text-[var(--ink)]">
                    Criar Novo Pote Personalizado
                  </h3>
                </div>
                <button
                  onClick={() => setShowCreatePotModal(false)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--ink)] p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePot} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                      Nome do Pote
                    </label>
                    <input
                      type="text"
                      value={newPotName}
                      onChange={(e) => setNewPotName(e.target.value)}
                      placeholder="Ex: Cofrinho dos Filhos, Natal, Viagem"
                      className="w-full mobbin-input text-xs"
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                      Meta Financeira (Opcional R$)
                    </label>
                    <input
                      type="number"
                      step="10"
                      value={newPotTarget}
                      onChange={(e) => setNewPotTarget(e.target.value)}
                      placeholder="Ex: 500,00"
                      className="w-full mobbin-input text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Escolha do Emoji */}
                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                    Escolha um Emoji para o Pote
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {['🏺', '📈', '🎁', '👶', '✈️', '🛡️', '🏡', '🎂', '🎓', '🏖️'].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setNewPotEmoji(em)}
                        className={`w-9 h-9 rounded-[12px] flex items-center justify-center text-lg border transition-all cursor-pointer ${
                          newPotEmoji === em
                            ? 'border-[#0066ff] bg-[#0066ff]/10 scale-105'
                            : 'border-[var(--hairline)] hover:bg-[var(--canvas-soft)]'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Escolha da Cor do Líquido */}
                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                    Cor do Líquido do Pote
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: 'emerald', label: 'Verde', bg: 'bg-emerald-500' },
                      { id: 'amber', label: 'Dourado', bg: 'bg-amber-500' },
                      { id: 'purple', label: 'Roxo', bg: 'bg-purple-500' },
                      { id: 'blue', label: 'Azul', bg: 'bg-blue-500' },
                      { id: 'rose', label: 'Rosa', bg: 'bg-rose-500' },
                      { id: 'teal', label: 'Ciano', bg: 'bg-teal-500' }
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setNewPotColor(c.id as CustomPot['color'])}
                        className={`flex-1 py-1.5 rounded-[12px] border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          newPotColor === c.id
                            ? 'border-[#0066ff] shadow-xs'
                            : 'border-[var(--hairline)] opacity-70'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${c.bg}`} />
                        <span className="hidden sm:inline">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Objetivo / Descrição curta
                  </label>
                  <input
                    type="text"
                    value={newPotDesc}
                    onChange={(e) => setNewPotDesc(e.target.value)}
                    placeholder="Ex: Para comprar presentes das crianças no fim do ano"
                    className="w-full mobbin-input text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCreatePotModal(false)}
                    className="flex-1 btn-outline text-xs py-2 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-xs py-2 cursor-pointer"
                  >
                    Criar Pote
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODAL: LANÇAMENTO / TRANSFERÊNCIA NOS POTES                               */}
          {/* ========================================================================= */}
          {showAddPotTx && (
            <div className="bg-[var(--canvas)] border-2 border-[#0066ff] rounded-[24px] p-5 space-y-4 shadow-md animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{isTransferMode ? '🔄' : '💰'}</span>
                  <h3 className="text-sm font-bold text-[var(--ink)]">
                    {isTransferMode ? 'Transferência Entre Potes' : 'Novo Lançamento no Pote'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddPotTx(false)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--ink)] p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddPotTransaction} className="space-y-3">
                {isTransferMode ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                        Sair do Pote:
                      </label>
                      <select
                        value={transferFromPotId}
                        onChange={(e) => setTransferFromPotId(e.target.value)}
                        className="w-full mobbin-input text-xs font-semibold"
                      >
                        {pots.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.emoji} {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                        Entrar no Pote:
                      </label>
                      <select
                        value={transferToPotId}
                        onChange={(e) => setTransferToPotId(e.target.value)}
                        className="w-full mobbin-input text-xs font-semibold"
                      >
                        {pots.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.emoji} {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Seleção do Pote Destino */}
                    <div>
                      <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                        Escolha o Pote:
                      </label>
                      <select
                        value={txPotId}
                        onChange={(e) => setTxPotId(e.target.value)}
                        className="w-full mobbin-input text-xs font-semibold"
                      >
                        {pots.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.emoji} {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tipo de Movimentação */}
                    <div>
                      <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                        Tipo de Operação
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setTxType('receita')}
                          className={`py-1.5 rounded-[12px] text-xs font-bold border transition-colors cursor-pointer ${
                            txType === 'receita'
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'border-[var(--hairline)] text-[var(--ink)]'
                          }`}
                        >
                          + Receita / Entrada
                        </button>
                        <button
                          type="button"
                          onClick={() => setTxType('despesa')}
                          className={`py-1.5 rounded-[12px] text-xs font-bold border transition-colors cursor-pointer ${
                            txType === 'despesa'
                              ? 'bg-rose-500 text-white border-rose-500'
                              : 'border-[var(--hairline)] text-[var(--ink)]'
                          }`}
                        >
                          - Despesa / Saída
                        </button>
                        <button
                          type="button"
                          onClick={() => setTxType('investimento')}
                          className={`py-1.5 rounded-[12px] text-xs font-bold border transition-colors cursor-pointer ${
                            txType === 'investimento'
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'border-[var(--hairline)] text-[var(--ink)]'
                          }`}
                        >
                          🟣 Aporte / Reserva
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      placeholder="Ex: 50,00"
                      className="w-full mobbin-input text-xs font-bold"
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                      Categoria / Tag
                    </label>
                    <input
                      type="text"
                      value={txCategory}
                      onChange={(e) => setTxCategory(e.target.value)}
                      placeholder="Ex: Insumos, Venda, Pró-Labore"
                      className="w-full mobbin-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                    Descrição da Movimentação
                  </label>
                  <input
                    type="text"
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    placeholder="Ex: Compra de matéria-prima, Venda de brigadeiros..."
                    className="w-full mobbin-input text-xs"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddPotTx(false)}
                    className="flex-1 btn-outline text-xs py-2 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-xs py-2 cursor-pointer"
                  >
                    Confirmar Lançamento
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Histórico das Movimentações */}
          <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-3.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div>
                <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                  Histórico de Movimentações dos Potes
                </h3>
                <span className="text-[11px] text-[var(--text-muted)] font-light">
                  Transparência total em cada pote
                </span>
              </div>

              {/* Filtro por Pote */}
              <div className="bg-[var(--field)] p-0.5 rounded-full flex gap-1 overflow-x-auto no-scrollbar max-w-full">
                <button
                  onClick={() => setPotHistoryFilter('todos')}
                  className={`py-1 px-2.5 text-[10px] font-bold rounded-full transition-colors cursor-pointer shrink-0 ${
                    potHistoryFilter === 'todos'
                      ? 'bg-[var(--canvas)] text-[var(--ink)] shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
                  }`}
                >
                  Todos
                </button>
                {pots.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPotHistoryFilter(p.id)}
                    className={`py-1 px-2.5 text-[10px] font-bold rounded-full transition-colors cursor-pointer shrink-0 ${
                      potHistoryFilter === p.id
                        ? 'bg-[var(--canvas)] text-[var(--ink)] shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {p.emoji} {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {transactions
                .filter((t) => potHistoryFilter === 'todos' || t.pot === potHistoryFilter)
                .slice(0, 10)
                .map((item) => {
                  const isPositive = item.type === 'receita' || item.type === 'investimento';
                  const targetPot = pots.find((p) => p.id === item.pot);

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-[16px] border border-[var(--hairline-soft)] flex items-center justify-between gap-3 text-xs bg-[var(--canvas)] hover:border-[var(--ink)] transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[var(--canvas-soft)] text-[var(--ink)]">
                            {targetPot?.emoji || '🏺'} {targetPot?.name || 'Pote'}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)] bg-[var(--canvas-soft)] px-1.5 py-0.5 rounded">
                            {item.date}
                          </span>
                          {item.category && (
                            <span className="text-[10px] text-[var(--text-muted)] font-medium">
                              • {item.category}
                            </span>
                          )}
                        </div>
                        <div className="font-semibold text-[var(--ink)] truncate mt-1">
                          {item.description}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={`font-bold text-sm ${
                            isPositive
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-500'
                          }`}
                        >
                          {isPositive ? '+' : '-'} R$ {item.amount.toFixed(2).replace('.', ',')}
                        </span>
                        <button
                          onClick={() => handleDeletePotTransaction(item.id)}
                          className="text-[var(--text-faint)] hover:text-[var(--ink)] p-1 cursor-pointer"
                          title="Remover"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: AULAS COM SIMULADOR DE RENDA E CHECKLIST DA SAÚDE FINANCEIRA       */}
      {/* ========================================================================= */}
      {activeSubTab === 'aulas_saude' && (
        <div className="space-y-4">
          {!isPro && (
            <div className="bg-gradient-to-br from-[#0066ff]/15 via-emerald-500/10 to-transparent border-2 border-[#0066ff] rounded-[24px] p-5 text-center space-y-3 shadow-md">
              <div className="w-11 h-11 rounded-full bg-[#0066ff] text-white flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066ff] block">
                  Recurso Exclusivo · Kit Mãe Empreendedora
                </span>
                <h3 className="text-base font-extrabold text-[var(--ink)] mt-0.5">
                  Desbloqueie o Simulador de Renda & Checklist
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-light mt-1 max-w-sm mx-auto leading-relaxed">
                  Calcule seu pró-labore semanal exato, avalie os hábitos financeiros e acesse aulas práticas sem complicação.
                </p>
              </div>
              <button
                onClick={onOpenCheckout}
                className="btn-primary text-xs py-3 px-6 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-lg bg-[#0066ff] hover:bg-blue-600"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Desbloquear Acesso Completo por R$ 6,90</span>
              </button>
            </div>
          )}

          <div
            onClick={!isPro ? onOpenCheckout : undefined}
            className={!isPro ? 'cursor-pointer select-none space-y-4 relative' : 'space-y-4'}
          >
            {!isPro && (
              <div className="absolute inset-0 z-20 bg-transparent cursor-pointer" />
            )}
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-emerald-600/15 via-teal-600/10 to-transparent border border-emerald-500/30 rounded-[24px] p-5 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-[var(--ink)]">
                Aulas Práticas, Simulador de Renda & Saúde Financeira
              </h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed">
              Descubra seu pró-labore ideal, avalie seus hábitos financeiros e aprenda a blindar o dinheiro da sua casa.
            </p>
          </div>

          {/* SIMULADOR DE RENDA & PRÓ-LABORE DA FAMÍLIA */}
          <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏡</span>
              <div>
                <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                  Simulador de Renda & Pró-Labore Semanal
                </h3>
                <span className="text-[11px] text-[var(--text-muted)] font-light">
                  Quanto você pode retirar por semana sem sangrar o caixa do negócio
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Gastos essenciais da casa que a renda extra deve pagar (R$/mês)
                </label>
                <input
                  type="number"
                  step="50"
                  value={proLaboreBills}
                  onChange={(e) => setProLaboreBills(parseFloat(e.target.value) || 0)}
                  className="w-full mobbin-input text-xs font-bold"
                />
                <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
                  Ex: Mercado básico, conta de água, remédios, material dos filhos.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Semanas de trabalho no mês
                </label>
                <select
                  value={proLaboreWeeksWorked}
                  onChange={(e) => setProLaboreWeeksWorked(Number(e.target.value))}
                  className="w-full mobbin-input text-xs font-semibold"
                >
                  <option value={4}>4 semanas (produção contínua)</option>
                  <option value={3}>3 semanas (conciliando com folgas/férias)</option>
                  <option value={2}>2 semanas (produção em quinzenas)</option>
                </select>
              </div>
            </div>

            <div className="bg-[var(--canvas-soft)] p-4 rounded-[18px] flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] block">
                  Retirada semanal recomendada (Toda segunda-feira)
                </span>
                <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                  R$ {recommendedWeeklyWithdrawal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / semana
                </span>
              </div>
              <button
                onClick={() => {
                  setIsTransferMode(true);
                  setTransferFromPotId('negocio');
                  setTransferToPotId('casa');
                  setTxAmount(recommendedWeeklyWithdrawal.toString());
                  setTxDesc('Retirada semanal de pró-labore');
                  setActiveSubTab('potes');
                  setShowAddPotTx(true);
                }}
                className="btn-primary py-2 px-3 text-xs shrink-0 cursor-pointer"
              >
                Transferir para Casa
              </button>
            </div>
          </div>

          {/* CHECKLIST DE SAÚDE FINANCEIRA */}
          <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                    Checklist de Saúde Financeira
                  </h3>
                  <span className="text-[11px] text-[var(--text-muted)] font-light">
                    Mantenha seus hábitos blindados para prosperar
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-extrabold text-emerald-600">{healthScore}%</span>
                <span className="text-[10px] text-[var(--text-muted)] block">Saúde do Mês</span>
              </div>
            </div>

            {/* Health Score Bar */}
            <div className="h-2 bg-[var(--field)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${healthScore}%` }}
              />
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 pt-1">
              {[
                {
                  key: 'check_potes_separados',
                  label: 'Separei duas contas ou caixas físicas para Negócio e Casa'
                },
                {
                  key: 'check_sem_misturar_pix',
                  label: 'Nunca paguei compras do supermercado pessoal diretamente com o Pix do cliente'
                },
                {
                  key: 'check_anotar_caderninho',
                  label: 'Anoto 100% das vendas no caderninho no mesmo dia em que recebo'
                },
                {
                  key: 'check_custo_embalagem',
                  label: 'Incluí embalagem, gás e transporte no preço final dos meus produtos'
                },
                {
                  key: 'check_pro_labore_dia_fixo',
                  label: 'Retiro meu Pró-labore em dia fixo da semana sem antecipar'
                },
                {
                  key: 'check_reserva_investimento',
                  label: 'Guardei pelo menos R$ 10 esta semana no Pote de Investimentos'
                }
              ].map((item) => {
                const isChecked = !!financialChecklist[item.key];
                return (
                  <div
                    key={item.key}
                    onClick={() => toggleChecklistItem(item.key)}
                    className={`p-3 rounded-[16px] border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs ${
                      isChecked
                        ? 'border-emerald-500/30 bg-emerald-500/5'
                        : 'border-[var(--hairline-soft)] bg-[var(--canvas)] hover:border-[var(--hairline)]'
                    }`}
                  >
                    <span className={`font-medium ${isChecked ? 'text-[var(--ink)]' : 'text-[var(--text-muted)]'}`}>
                      {item.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isChecked
                          ? 'bg-emerald-600 text-white'
                          : 'border border-[var(--hairline)]'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AULAS PRÁTICAS SEM ECONOMÊS */}
          <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0066ff]" />
              <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                Aulas Práticas Sem Economês (Mãe Empreendedora)
              </h3>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 0,
                  title: '1. A Armadilha do Dinheiro Invisível: Para onde vai o lucro?',
                  content:
                    'Quando o cliente paga R$ 50 no Pix e você gasta R$ 15 na padaria voltando para casa, você não gastou R$ 15 de lucro — você gastou o dinheiro da matéria-prima do dia seguinte! A solução é concentrar todos os Pix numa conta exclusiva do negócio.'
                },
                {
                  id: 1,
                  title: '2. Onde guardar o Pote de Investimentos para render?',
                  content:
                    'A poupança rende menos da metade da inflação. Para o Pote de Investimentos, abra uma conta digital gratuita com liquidez diária (como Caixinha Nubank, Sofisa ou C6) que pague 100% do CDI. O dinheiro rende todo dia útil e pode ser resgatado a qualquer momento em caso de emergência.'
                },
                {
                  id: 2,
                  title: '3. Como cobrar sinal de 50% no WhatsApp sem perder vendas',
                  content:
                    'Nunca comece a fazer doces, salgados ou artesanatos encomendados sem receber sinal. Diga educadamente: "Para garantir o seu pedido na minha agenda da semana e comprar os ingredientes frescos, solicito 50% de sinal no Pix e os outros 50% na entrega!". Clientes sérios respeitam quem se posiciona como profissional.'
                },
                {
                  id: 3,
                  title: '4. O Fundo de Paz Familiar: 3 meses de despesas',
                  content:
                    'Antes de sonhar com investimentos complexos, seu primeiro objetivo financeiro é acumular 3 vezes o valor básico das contas da sua casa. Ter R$ 1.500 a R$ 2.500 guardados no Pote de Investimentos elimina 95% do desespero de quando um filho adoece.'
                }
              ].map((lesson) => {
                const isOpen = expandedLesson === lesson.id;
                return (
                  <div
                    key={lesson.id}
                    className="border border-[var(--hairline-soft)] rounded-[18px] overflow-hidden bg-[var(--canvas-soft)]"
                  >
                    <button
                      onClick={() => setExpandedLesson(isOpen ? null : lesson.id)}
                      className="w-full p-3.5 text-left flex items-center justify-between gap-2 text-xs font-bold text-[var(--ink)] hover:text-[#0066ff] transition-colors cursor-pointer"
                    >
                      <span>{lesson.title}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 pt-0 text-xs font-light text-[var(--text-muted)] leading-relaxed border-t border-[var(--hairline-soft)]">
                        {lesson.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};
