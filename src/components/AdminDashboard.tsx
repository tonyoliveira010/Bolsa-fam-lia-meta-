import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  CreditCard,
  Tag,
  Split,
  Image as ImageIcon,
  FileText,
  ArrowLeft,
  Check,
  RefreshCw,
  Copy,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Search,
  MessageCircle,
  QrCode,
  ToggleLeft,
  ToggleRight,
  Code
} from 'lucide-react';
import {
  AdminStoreData,
  OfferPlan,
  AbFunnelTest,
  HomeBannerConfig,
  AdminIdeaItem,
  getAdminStore,
  saveAdminStore
} from '../services/adminStore';
import { syncPayService } from '../services/syncPayService';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

type AdminTab = 'vendas' | 'crm' | 'syncpay' | 'ofertas' | 'ab_tests' | 'banners' | 'markdown_ideias';

const AVAILABLE_PLAN_FEATURES = [
  { key: 'financeiro_grafico', label: 'Gestão Financeira com Gráfico de Linha' },
  { key: 'caderninho_vendas', label: 'Caderninho de Vendas Diário' },
  { key: 'regra_dois_potes', label: 'Regra dos 2 Potes de Dinheiro' },
  { key: 'calculadora_custo', label: 'Calculadora de Precificação Avançada' },
  { key: 'todas_ideias', label: 'Acesso a Todas as 60 Ideias de Negócio' },
  { key: 'desafio_50_depositos', label: 'Desafio dos 50 Depósitos (Cofrinho)' },
  { key: 'whatsapp_scripts', label: 'Roteiros de Conversão para WhatsApp' },
  { key: 'rotina_materna', label: 'Painel de Rotina Diária com Filhos' },
  { key: 'suporte_vip', label: 'Suporte & Lista VIP no WhatsApp' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('vendas');
  const [store, setStore] = useState<AdminStoreData>(getAdminStore());
  const [toastMessage, setToastMessage] = useState<string>('');

  // SyncPay form state
  const [syncApiKey, setSyncApiKey] = useState(store.syncPay.apiKey);
  const [syncPartnerId, setSyncPartnerId] = useState(store.syncPay.partnerId);
  const [syncWebhookUrl, setSyncWebhookUrl] = useState(store.syncPay.webhookUrl);
  const [syncSandbox, setSyncSandbox] = useState(store.syncPay.sandboxMode);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);

  // Test Pix Generator State
  const [testAmount, setTestAmount] = useState('19.90');
  const [testName, setTestName] = useState('Mãe Teste da Silva');
  const [testEmail, setTestEmail] = useState('mae.teste@email.com');
  const [generatedPix, setGeneratedPix] = useState<{ qrCode: string; copyPaste: string; identifier: string } | null>(null);

  // A/B Quiz Code Paste State
  const [pastedQuizCode, setPastedQuizCode] = useState('');
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [abBindingResult, setAbBindingResult] = useState<string | null>(null);

  // CRM Search & Filter
  const [crmSearch, setCrmSearch] = useState('');
  const [crmStageFilter, setCrmStageFilter] = useState<string>('todos');

  // Markdown Idea Editor State
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaCategory, setIdeaCategory] = useState('comida');
  const [ideaEmoji, setIdeaEmoji] = useState('🍰');
  const [ideaMinCost, setIdeaMinCost] = useState('30');
  const [ideaMaxCost, setIdeaMaxCost] = useState('70');
  const [ideaSuggestedPrice, setIdeaSuggestedPrice] = useState('R$ 8,00 por unidade');
  const [ideaMarkdown, setIdeaMarkdown] = useState('');
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const reloadData = () => {
    setStore(getAdminStore());
  };

  // Calculate totals
  const totalRevenue = store.transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCompletedCount = store.transactions.filter((t) => t.status === 'completed').length;
  const averageTicket = totalCompletedCount > 0 ? totalRevenue / totalCompletedCount : 0;

  // Handle Save SyncPay
  const handleSaveSyncPay = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...store,
      syncPay: {
        ...store.syncPay,
        apiKey: syncApiKey.trim(),
        partnerId: syncPartnerId.trim(),
        webhookUrl: syncWebhookUrl.trim(),
        sandboxMode: syncSandbox
      }
    };
    saveAdminStore(updated);
    setStore(updated);
    showToast('Configurações da SyncPay salvas com sucesso!');
  };

  // Handle Refresh Balance
  const handleRefreshBalance = async () => {
    setIsRefreshingBalance(true);
    try {
      const newBal = await syncPayService.fetchBalance();
      reloadData();
      showToast(`Saldo SyncPay atualizado: R$ ${newBal.toFixed(2)}`);
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  // Handle Generate Test Pix
  const handleGenerateTestPix = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(testAmount);
    if (isNaN(amt) || amt <= 0) return;

    const res = await syncPayService.createPixCashIn({
      amount: amt,
      customerName: testName,
      customerEmail: testEmail,
      offerTitle: 'Teste Admin Pix'
    });

    if (res.success) {
      setGeneratedPix({
        qrCode: res.qrCodeUrl,
        copyPaste: res.copyPaste,
        identifier: res.identifier
      });
      reloadData();
      showToast('Pix de teste gerado com sucesso via SyncPay!');
    }
  };

  // Handle Approve Test Pix
  const handleApprovePix = (identifier: string) => {
    syncPayService.approveTransaction(identifier);
    reloadData();
    showToast(`Transação ${identifier} aprovada com sucesso!`);
  };

  // Handle Toggle Plan Feature
  const handleTogglePlanFeature = (offerId: string, featureKey: string) => {
    const updatedOffers = store.offers.map((offer) => {
      if (offer.id === offerId) {
        const currentToggles = offer.featureToggles || {};
        return {
          ...offer,
          featureToggles: {
            ...currentToggles,
            [featureKey]: !currentToggles[featureKey]
          }
        };
      }
      return offer;
    });

    const updated = { ...store, offers: updatedOffers };
    saveAdminStore(updated);
    setStore(updated);
    showToast('Recurso do plano atualizado!');
  };

  // Handle Update Offer Price
  const handleUpdateOfferPrice = (offerId: string, newPrice: number, newOrigPrice: number) => {
    const updatedOffers = store.offers.map((o) =>
      o.id === offerId ? { ...o, price: newPrice, originalPrice: newOrigPrice } : o
    );
    const updated = { ...store, offers: updatedOffers };
    saveAdminStore(updated);
    setStore(updated);
    showToast('Preços da oferta atualizados com sucesso!');
  };

  // Handle Automatic Quiz Code Binding
  const handleBindPastedQuizCode = async () => {
    if (!pastedQuizCode.trim()) {
      showToast('Por favor, cole o código do quiz de teste primeiro.');
      return;
    }

    const title = newQuizTitle.trim() || 'Quiz Teste A/B ' + (store.abTests.length + 1);
    const defaultOffer = store.offers.find((o) => o.isDefault);
    const price = defaultOffer ? defaultOffer.price : 19.90;

    // Call SyncPay Pix API automatically to test binding
    const res = await syncPayService.createPixCashIn({
      amount: price,
      customerName: 'Lead Quiz Automático',
      customerEmail: 'lead.quiz@email.com',
      offerTitle: defaultOffer ? defaultOffer.name : 'Kit Mãe Empreendedora PRO'
    });

    const newTest: AbFunnelTest = {
      id: 'ab-quiz-' + Date.now(),
      name: title,
      headline: 'Funil automático vinculado via SyncPay Pix',
      badge: 'Vinculado Pix',
      active: true,
      visitors: 1,
      conversions: 0,
      quizCode: pastedQuizCode,
      linkedOfferId: defaultOffer?.id
    };

    const updated = {
      ...store,
      abTests: [newTest, ...store.abTests]
    };
    saveAdminStore(updated);
    setStore(updated);

    setAbBindingResult(
      `Código vinculado com sucesso! Transação Pix gerada via SyncPay com identificador: ${res.identifier}. O quiz chamará a oferta de R$ ${price.toFixed(2)} automaticamente.`
    );
    setPastedQuizCode('');
    setNewQuizTitle('');
    showToast('Quiz vinculado à oferta Pix com sucesso!');
  };

  // Handle Save Markdown Idea
  const handleSaveMarkdownIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim()) return;

    const minC = parseFloat(ideaMinCost) || 30;
    const maxC = parseFloat(ideaMaxCost) || 70;

    let updatedList = [...store.customIdeas];

    if (editingIdeaId) {
      updatedList = updatedList.map((item) =>
        item.id === editingIdeaId
          ? {
              ...item,
              title: ideaTitle.trim(),
              category: ideaCategory,
              emoji: ideaEmoji.trim() || '💡',
              minCost: minC,
              maxCost: maxC,
              suggestedPrice: ideaSuggestedPrice.trim(),
              markdownContent: ideaMarkdown
            }
          : item
      );
    } else {
      const newItem: AdminIdeaItem = {
        id: 'custom-idea-' + Date.now(),
        title: ideaTitle.trim(),
        category: ideaCategory,
        emoji: ideaEmoji.trim() || '💡',
        minCost: minC,
        maxCost: maxC,
        suggestedPrice: ideaSuggestedPrice.trim(),
        workFromHome: true,
        markdownContent: ideaMarkdown,
        active: true,
        createdAt: new Date().toLocaleDateString('pt-BR')
      };
      updatedList = [newItem, ...updatedList];
    }

    const updated = { ...store, customIdeas: updatedList };
    saveAdminStore(updated);
    setStore(updated);

    // Reset Form
    setEditingIdeaId(null);
    setIdeaTitle('');
    setIdeaMarkdown('');
    showToast('Ideia em Markdown salva com sucesso!');
  };

  const handleEditIdea = (item: AdminIdeaItem) => {
    setEditingIdeaId(item.id);
    setIdeaTitle(item.title);
    setIdeaCategory(item.category);
    setIdeaEmoji(item.emoji);
    setIdeaMinCost(item.minCost.toString());
    setIdeaMaxCost(item.maxCost.toString());
    setIdeaSuggestedPrice(item.suggestedPrice);
    setIdeaMarkdown(item.markdownContent);
    setShowMarkdownPreview(false);
  };

  const handleDeleteIdea = (id: string) => {
    const updated = {
      ...store,
      customIdeas: store.customIdeas.filter((item) => item.id !== id)
    };
    saveAdminStore(updated);
    setStore(updated);
    showToast('Ideia removida do catálogo.');
  };

  // Filtered Leads
  const filteredLeads = store.leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
      lead.email.toLowerCase().includes(crmSearch.toLowerCase()) ||
      (lead.phone && lead.phone.includes(crmSearch));
    const matchesStage = crmStageFilter === 'todos' || lead.stage === crmStageFilter;
    return matchesSearch && matchesStage;
  });

  const navMenuItems = [
    { id: 'vendas' as AdminTab, label: 'Dashboard & Vendas', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'crm' as AdminTab, label: 'CRM Leads & Funil', icon: <Users className="w-4 h-4" /> },
    { id: 'syncpay' as AdminTab, label: 'API Pix SyncPay', icon: <CreditCard className="w-4 h-4 text-emerald-400" /> },
    { id: 'ofertas' as AdminTab, label: 'Preços & Planos', icon: <Tag className="w-4 h-4" /> },
    { id: 'ab_tests' as AdminTab, label: 'Testes A/B Quiz', icon: <Split className="w-4 h-4" /> },
    { id: 'banners' as AdminTab, label: 'Banners da Home', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'markdown_ideias' as AdminTab, label: 'Ideias em Markdown', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#f0f0f0] flex flex-col md:flex-row font-sans selection:bg-[#0066ff] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xl animate-in slide-in-from-top-4 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (TELAS MAIORES md:) COM BACKGROUND PRETO                  */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] p-4 shrink-0 min-h-screen sticky top-0 justify-between">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0066ff] to-[#00cc88] flex items-center justify-center text-white font-black text-sm shadow-md">
              ADM
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white leading-tight">
                Renda Mais
              </h1>
              <span className="text-[10px] text-[#3fb950] font-bold block">
                Painel do Administrador
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navMenuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#0066ff] text-white shadow-sm'
                      : 'text-[#8b949e] hover:text-white hover:bg-[#141414]'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: SyncPay Balance & Back to App */}
        <div className="space-y-3 pt-4 border-t border-[#1a1a1a]">
          <div className="bg-[#121212] border border-[#222222] p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#8b949e]">
              <span className="font-semibold uppercase tracking-wider">Saldo SyncPay:</span>
              <button
                onClick={handleRefreshBalance}
                disabled={isRefreshingBalance}
                className="text-[#3fb950] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshingBalance ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </button>
            </div>
            <div className="text-base font-black text-[#3fb950]">
              R$ {store.syncPay.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[9.5px] text-[#8b949e] block">
              {store.syncPay.sandboxMode ? 'Modo Sandbox' : 'Modo Produção'}
            </span>
          </div>

          <button
            onClick={onBackToApp}
            className="w-full bg-[#1b221d] hover:bg-[#238636] text-[#3fb950] hover:text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#238636]/30 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao App</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. TOP MOBILE NAVBAR (APENAS TELAS PEQUENAS)                              */}
      {/* ========================================================================= */}
      <div className="md:hidden bg-[#0a0a0a] border-b border-[#1a1a1a] p-3 flex flex-col gap-2 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0066ff] flex items-center justify-center text-white font-black text-xs">
              ADM
            </div>
            <span className="font-bold text-xs text-white">Renda Mais ADM</span>
          </div>

          <button
            onClick={onBackToApp}
            className="bg-[#238636] text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>App</span>
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
          {navMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                activeTab === item.id ? 'bg-[#0066ff] text-white' : 'bg-[#141414] text-[#8b949e]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT CONTAINER (BACKGROUND PRETO)                              */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6 overflow-y-auto">
        {/* ========================================================================= */}
        {/* TAB 1: DASHBOARD & VENDAS                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'vendas' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Dashboard de Vendas</h2>
                <p className="text-xs text-[#8b949e]">
                  Métricas em tempo real de faturamento e pagamentos via Pix SyncPay
                </p>
              </div>

              <button
                onClick={reloadData}
                className="bg-[#121212] hover:bg-[#1a1a1a] border border-[#222222] text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Atualizar</span>
              </button>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-2 shadow-sm">
                <span className="text-xs text-[#8b949e] font-semibold uppercase tracking-wider block">
                  Faturamento Total (Pix)
                </span>
                <div className="text-2xl font-black text-white">
                  R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-[#3fb950] font-bold">
                  ↑ +34% comparado à semana anterior
                </span>
              </div>

              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-2 shadow-sm">
                <span className="text-xs text-[#8b949e] font-semibold uppercase tracking-wider block">
                  Vendas Aprovadas
                </span>
                <div className="text-2xl font-black text-white">
                  {totalCompletedCount} pagamentos
                </div>
                <span className="text-[11px] text-[#8b949e]">
                  Taxa de aprovação Pix: 89.2%
                </span>
              </div>

              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-2 shadow-sm">
                <span className="text-xs text-[#8b949e] font-semibold uppercase tracking-wider block">
                  Ticket Médio
                </span>
                <div className="text-2xl font-black text-white">
                  R$ {averageTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-[#8b949e]">
                  Oferta R$ 19,90 + Upsell R$ 6,90
                </span>
              </div>

              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-2 shadow-sm">
                <span className="text-xs text-[#8b949e] font-semibold uppercase tracking-wider block">
                  Total de Leads Cadastrados
                </span>
                <div className="text-2xl font-black text-white">
                  {store.leads.length} mães
                </div>
                <span className="text-[11px] text-[#58a6ff]">
                  {store.leads.filter((l) => l.stage === 'virou_pro').length} clientes ativas PRO
                </span>
              </div>
            </div>

            {/* Transações Recentes SyncPay Pix */}
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                Transações Pix Recentes (SyncPay)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1e1e1e] text-[#8b949e]">
                      <th className="pb-3 font-semibold">Identificador</th>
                      <th className="pb-3 font-semibold">Cliente</th>
                      <th className="pb-3 font-semibold">Produto / Oferta</th>
                      <th className="pb-3 font-semibold">Valor</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Data</th>
                      <th className="pb-3 font-semibold text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e1e]">
                    {store.transactions.map((tx) => (
                      <tr key={tx.identifier} className="hover:bg-[#141414] transition-colors">
                        <td className="py-3 font-mono text-[11px] text-[#58a6ff]">{tx.identifier}</td>
                        <td className="py-3">
                          <b className="text-white block">{tx.customerName}</b>
                          <span className="text-[11px] text-[#8b949e]">{tx.customerEmail}</span>
                        </td>
                        <td className="py-3 text-[#c9d1d9]">{tx.offerTitle}</td>
                        <td className="py-3 font-bold text-white">
                          R$ {tx.amount.toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.status === 'completed'
                                ? 'bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40'
                                : tx.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-red-500/20 text-red-400 border border-red-500/40'
                            }`}
                          >
                            {tx.status === 'completed'
                              ? 'Aprovado'
                              : tx.status === 'pending'
                              ? 'Aguardando Pix'
                              : 'Cancelado'}
                          </span>
                        </td>
                        <td className="py-3 text-[#8b949e]">{tx.paidAt || tx.createdAt}</td>
                        <td className="py-3 text-right">
                          {tx.status === 'pending' ? (
                            <button
                              onClick={() => handleApprovePix(tx.identifier)}
                              className="bg-[#238636] hover:bg-[#2ea043] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                              title="Simular confirmação de pagamento SyncPay Webhook"
                            >
                              Simular Aprovação
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#3fb950] font-bold">✓ Concluído</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CRM LEADS & FUNIL DA JORNADA                                       */}
        {/* ========================================================================= */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Split className="w-4 h-4 text-[#58a6ff]" />
                  Funil da Jornada da Mãe Empreendedora
                </h2>
                <p className="text-xs text-[#8b949e]">
                  Taxa de conversão e retenção desde a visita inicial até a compra do Kit PRO
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
                {[
                  { label: '1. Visitas Home', val: store.funnelMetrics.visits, pct: '100%' },
                  {
                    label: '2. Iniciou Quiz',
                    val: store.funnelMetrics.startedQuiz,
                    pct: `${Math.round((store.funnelMetrics.startedQuiz / store.funnelMetrics.visits) * 100)}%`
                  },
                  {
                    label: '3. Concluiu Diagnóstico',
                    val: store.funnelMetrics.completedQuiz,
                    pct: `${Math.round((store.funnelMetrics.completedQuiz / store.funnelMetrics.visits) * 100)}%`
                  },
                  {
                    label: '4. Viu a Oferta',
                    val: store.funnelMetrics.viewedOffer,
                    pct: `${Math.round((store.funnelMetrics.viewedOffer / store.funnelMetrics.visits) * 100)}%`
                  },
                  {
                    label: '5. Gerou Pix',
                    val: store.funnelMetrics.generatedPix,
                    pct: `${Math.round((store.funnelMetrics.generatedPix / store.funnelMetrics.visits) * 100)}%`
                  },
                  {
                    label: '6. Pagou PRO',
                    val: store.funnelMetrics.convertedPro,
                    pct: `${Math.round((store.funnelMetrics.convertedPro / store.funnelMetrics.visits) * 100)}%`
                  }
                ].map((st, i) => (
                  <div key={i} className="bg-[#141414] border border-[#222222] rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] text-[#8b949e] font-semibold block truncate">{st.label}</span>
                    <div className="text-lg font-black text-white">{st.val}</div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#3fb950] font-bold">{st.pct}</span>
                      <span className="text-[#8b949e]">conversão</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabela CRM */}
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0066ff]" />
                    Leads do Diagnóstico (CRM)
                  </h3>
                  <p className="text-xs text-[#8b949e]">
                    Mães cadastradas com histórico de habilidades e orçamento
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={crmSearch}
                      onChange={(e) => setCrmSearch(e.target.value)}
                      placeholder="Buscar por nome, email ou tel..."
                      className="w-full bg-[#141414] border border-[#222222] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
                    />
                  </div>

                  <select
                    value={crmStageFilter}
                    onChange={(e) => setCrmStageFilter(e.target.value)}
                    className="bg-[#141414] border border-[#222222] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                  >
                    <option value="todos">Todos os Estágios</option>
                    <option value="iniciou_quiz">Iniciou Quiz</option>
                    <option value="concluiu_diagnostico">Concluiu Diagnóstico</option>
                    <option value="gerou_pix">Gerou Pix</option>
                    <option value="virou_pro">Virou PRO</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#1e1e1e] text-[#8b949e]">
                      <th className="pb-3 font-semibold">Nome da Mãe</th>
                      <th className="pb-3 font-semibold">Bolsa Família</th>
                      <th className="pb-3 font-semibold">Habilidades & Perfil</th>
                      <th className="pb-3 font-semibold">Orçamento & Tempo</th>
                      <th className="pb-3 font-semibold">Estágio no Funil</th>
                      <th className="pb-3 font-semibold text-right">Contato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e1e]">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#141414] transition-colors">
                        <td className="py-3">
                          <b className="text-white block">{lead.name}</b>
                          <span className="text-[11px] text-[#8b949e]">{lead.email}</span>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#141414] text-[#c9d1d9] border border-[#222222]">
                            {lead.bfStatus}
                          </span>
                        </td>
                        <td className="py-3">
                          <b className="text-[#58a6ff] block">{lead.profileType}</b>
                          <span className="text-[10.5px] text-[#8b949e]">
                            {lead.skills.join(', ')}
                          </span>
                        </td>
                        <td className="py-3 text-[#c9d1d9]">
                          <span>Até R$ {lead.budget}</span>
                          <span className="block text-[10.5px] text-[#8b949e]">{lead.availableTime}</span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              lead.stage === 'virou_pro'
                                ? 'bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40'
                                : lead.stage === 'gerou_pix'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-[#141414] text-[#8b949e] border border-[#222222]'
                            }`}
                          >
                            {lead.stage === 'virou_pro'
                              ? '⭐ Aluna PRO'
                              : lead.stage === 'gerou_pix'
                              ? '⏳ Pix Pendente'
                              : lead.stage === 'concluiu_diagnostico'
                              ? '📋 Diagnóstico Feito'
                              : 'Quiz Iniciado'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {lead.phone && (
                            <a
                              href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=Oi%20${encodeURIComponent(lead.name)},%20vi%20que%20você%20fez%20o%20diagnóstico%20do%20Renda%20Mais!`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 bg-[#238636]/20 hover:bg-[#238636]/40 text-[#3fb950] px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CONFIGURAÇÃO DE COBRANÇA (SYNCPAY API PIX)                         */}
        {/* ========================================================================= */}
        {activeTab === 'syncpay' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  Configuração SyncPay Pix (api.syncpayments.com.br)
                </h2>
                <p className="text-xs text-[#8b949e]">
                  Credenciais da API SyncPay para geração e baixa automatizada do Pix
                </p>
              </div>

              <form onSubmit={handleSaveSyncPay} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                    API Key / Bearer Token
                  </label>
                  <input
                    type="password"
                    value={syncApiKey}
                    onChange={(e) => setSyncApiKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                  <small className="text-[10.5px] text-[#8b949e] block mt-1">
                    Endpoint: POST /api/v1/auth
                  </small>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                    Partner ID (Opcional)
                  </label>
                  <input
                    type="text"
                    value={syncPartnerId}
                    onChange={(e) => setSyncPartnerId(e.target.value)}
                    placeholder="partner_renda_mais_01"
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                    Webhook Callback URL (CashIn OnCreate / OnUpdate)
                  </label>
                  <input
                    type="url"
                    value={syncWebhookUrl}
                    onChange={(e) => setSyncWebhookUrl(e.target.value)}
                    placeholder="https://suaplataforma.com/api/webhook/syncpay"
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#58a6ff]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-[#141414] border border-[#222222] rounded-xl">
                  <div>
                    <b className="text-xs text-white block">Modo Sandbox (Testes)</b>
                    <small className="text-[10.5px] text-[#8b949e]">
                      Permite testar geração de QR Code e simulação de aprovação sem custos
                    </small>
                  </div>
                  <input
                    type="checkbox"
                    checked={syncSandbox}
                    onChange={(e) => setSyncSandbox(e.target.checked)}
                    className="w-4 h-4 accent-[#0066ff] cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Salvar Configurações SyncPay
                </button>
              </form>
            </div>

            {/* Testador de Emissão Pix */}
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#58a6ff]" />
                  Testador de Emissão Pix SyncPay
                </h2>
                <p className="text-xs text-[#8b949e]">
                  Gere um Pix de teste com QR Code dinâmico e código Copia e Cola
                </p>
              </div>

              <form onSubmit={handleGenerateTestPix} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={testAmount}
                      onChange={(e) => setTestAmount(e.target.value)}
                      className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                      Nome Cliente
                    </label>
                    <input
                      type="text"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0066ff] hover:bg-[#0052cc] text-white py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Gerar Cobrança Pix Agora
                </button>
              </form>

              {generatedPix && (
                <div className="p-4 bg-[#141414] border border-[#222222] rounded-2xl space-y-3 text-center">
                  <span className="text-[10px] font-bold text-[#3fb950] uppercase tracking-wider block">
                    Pix Gerado · ID: {generatedPix.identifier}
                  </span>

                  <img
                    src={generatedPix.qrCode}
                    alt="QR Code Pix"
                    className="w-40 h-40 mx-auto rounded-xl bg-white p-2 shadow-md"
                  />

                  <div className="flex items-center gap-1.5 bg-[#0a0a0a] p-2 rounded-xl border border-[#222222]">
                    <input
                      type="text"
                      readOnly
                      value={generatedPix.copyPaste}
                      className="bg-transparent text-[10.5px] text-[#c9d1d9] font-mono flex-1 outline-none truncate"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPix.copyPaste);
                        showToast('Código Pix copiado!');
                      }}
                      className="text-[#58a6ff] hover:text-white p-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleApprovePix(generatedPix.identifier)}
                    className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Simular Pagamento Aprovado (Webhook)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PREÇOS & PLANOS (COM TOGGLES DE ATIVAR/DESATIVAR FUNÇÕES!)          */}
        {/* ========================================================================= */}
        {activeTab === 'ofertas' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Configuração de Planos & Funções</h2>
              <p className="text-xs text-[#8b949e]">
                Altere valores e ative/desative funções específicas que fazem parte de cada plano
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {store.offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0066ff]/20 text-[#58a6ff] border border-[#0066ff]/40">
                      {offer.badge}
                    </span>
                    {offer.isDefault && (
                      <span className="text-[10px] font-bold text-[#3fb950]">★ Plano Principal</span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{offer.name}</h3>
                    <p className="text-xs text-[#8b949e] mt-0.5">{offer.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-[#141414] rounded-xl border border-[#222222]">
                    <div>
                      <label className="text-[10.5px] text-[#8b949e] block font-semibold mb-0.5">
                        Preço de Venda (R$)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue={offer.price}
                        id={`price-${offer.id}`}
                        className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-2.5 py-1 text-xs font-bold text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10.5px] text-[#8b949e] block font-semibold mb-0.5">
                        Preço "De" (R$)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        defaultValue={offer.originalPrice}
                        id={`orig-price-${offer.id}`}
                        className="w-full bg-[#0a0a0a] border border-[#222222] rounded-lg px-2.5 py-1 text-xs text-[#8b949e]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const p = parseFloat((document.getElementById(`price-${offer.id}`) as HTMLInputElement)?.value);
                      const op = parseFloat((document.getElementById(`orig-price-${offer.id}`) as HTMLInputElement)?.value);
                      if (!isNaN(p) && !isNaN(op)) {
                        handleUpdateOfferPrice(offer.id, p, op);
                      }
                    }}
                    className="w-full bg-[#238636] hover:bg-[#2ea043] text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Salvar Valores do Plano
                  </button>

                  {/* Gerenciador de Funções Ativas/Desativadas do Plano */}
                  <div className="space-y-2 pt-2 border-t border-[#1e1e1e]">
                    <span className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Funções Habilitadas no Plano:</span>
                      <small className="text-[10.5px] text-[#8b949e] font-normal">Toque para alternar</small>
                    </span>

                    <div className="space-y-1.5">
                      {AVAILABLE_PLAN_FEATURES.map((feat) => {
                        const isEnabled = offer.featureToggles ? offer.featureToggles[feat.key] !== false : true;
                        return (
                          <div
                            key={feat.key}
                            onClick={() => handleTogglePlanFeature(offer.id, feat.key)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#141414] border border-[#222222] hover:border-[#333333] cursor-pointer transition-colors"
                          >
                            <span className="text-xs text-[#c9d1d9]">{feat.label}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isEnabled
                                    ? 'bg-[#238636]/20 text-[#3fb950]'
                                    : 'bg-neutral-800 text-[#8b949e]'
                                }`}
                              >
                                {isEnabled ? 'Ativo' : 'Desativado'}
                              </span>
                              {isEnabled ? (
                                <ToggleRight className="w-5 h-5 text-[#3fb950]" />
                              ) : (
                                <ToggleLeft className="w-5 h-5 text-[#8b949e]" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TESTES A/B & VINCULAÇÃO AUTOMÁTICA DE CÓDIGO QUIZ                  */}
        {/* ========================================================================= */}
        {activeTab === 'ab_tests' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Testes A/B & Colagem de Quiz</h2>
              <p className="text-xs text-[#8b949e]">
                Cole o código do novo quiz e faça a vinculação automática com a oferta e API Pix
              </p>
            </div>

            {/* Área de Colagem de Código com Vinculação Automática */}
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Code className="w-4 h-4 text-[#58a6ff]" />
                <span>Colar Código do Novo Quiz / Funil de Teste</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                    Nome da Variação do Quiz
                  </label>
                  <input
                    type="text"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    placeholder="Ex: Funil C: Storyboard com foco em Doces Gourmet"
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                    Cole o código HTML / JS / JSON do Quiz abaixo:
                  </label>
                  <textarea
                    rows={6}
                    value={pastedQuizCode}
                    onChange={(e) => setPastedQuizCode(e.target.value)}
                    placeholder={`<!DOCTYPE html>\n<html>\n<head>...</head>\n<body>\n  <div id="quiz">...</div>\n</body>\n</html>`}
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl p-3 text-xs text-white font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleBindPastedQuizCode}
                  className="w-full bg-[#0066ff] hover:bg-[#0052cc] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar e Vincular Automaticamente à Oferta Pix (SyncPay)</span>
                </button>
              </div>

              {abBindingResult && (
                <div className="p-3.5 bg-emerald-950/40 border border-[#238636]/60 rounded-xl text-xs text-emerald-300 space-y-1">
                  <b>⚡ Vinculação Concluída:</b>
                  <p>{abBindingResult}</p>
                </div>
              )}
            </div>

            {/* Lista de Testes A/B Ativos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {store.abTests.map((test) => {
                const convRate = test.visitors > 0 ? ((test.conversions / test.visitors) * 100).toFixed(1) : '0.0';
                return (
                  <div
                    key={test.id}
                    className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#141414] text-[#58a6ff] border border-[#222222]">
                        {test.badge}
                      </span>
                      <button
                        onClick={() => {
                          const updated = {
                            ...store,
                            abTests: store.abTests.map((t) =>
                              t.id === test.id ? { ...t, active: !t.active } : t
                            )
                          };
                          saveAdminStore(updated);
                          setStore(updated);
                          showToast(`Status da variação alterado!`);
                        }}
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                          test.active
                            ? 'bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40'
                            : 'bg-neutral-800 text-[#8b949e]'
                        }`}
                      >
                        {test.active ? 'Ativo rodando' : 'Pausado'}
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">{test.name}</h3>
                      <span className="text-xs text-[#8b949e] italic block mt-0.5">"{test.headline}"</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 bg-[#141414] rounded-xl border border-[#222222] text-center">
                      <div>
                        <span className="text-[10px] text-[#8b949e] block font-semibold">Visitantes</span>
                        <b className="text-sm text-white">{test.visitors}</b>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8b949e] block font-semibold">Vendas PRO</span>
                        <b className="text-sm text-[#3fb950]">{test.conversions}</b>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8b949e] block font-semibold">Conversão</span>
                        <b className="text-sm text-[#58a6ff]">{convRate}%</b>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: BANNERS DA HOME                                                    */}
        {/* ========================================================================= */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white">Banners da Página de Início</h2>
                <p className="text-xs text-[#8b949e]">
                  Edite textos, títulos e chamadas dos banners exibidos na Home
                </p>
              </div>

              <button
                onClick={() => {
                  const title = prompt('Título do novo banner:');
                  if (title) {
                    const newBanner: HomeBannerConfig = {
                      id: 'b-' + Date.now(),
                      title,
                      subtitle: 'Novo subtítulo descritivo',
                      badge: 'Destaque',
                      buttonText: 'Acessar agora',
                      targetTab: 'ideias',
                      gradient: 'from-purple-600 via-indigo-600 to-blue-500',
                      active: true
                    };
                    const updated = { ...store, banners: [...store.banners, newBanner] };
                    saveAdminStore(updated);
                    setStore(updated);
                    showToast('Banner adicionado com sucesso!');
                  }
                }}
                className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Banner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {store.banners.map((b) => (
                <div key={b.id} className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#141414] text-[#c9d1d9] border border-[#222222]">
                      {b.badge}
                    </span>
                    <button
                      onClick={() => {
                        const updated = {
                          ...store,
                          banners: store.banners.filter((x) => x.id !== b.id)
                        };
                        saveAdminStore(updated);
                        setStore(updated);
                        showToast('Banner removido!');
                      }}
                      className="text-[#8b949e] hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl bg-gradient-to-r ${b.gradient} text-white space-y-1`}>
                    <h3 className="font-bold text-sm">{b.title}</h3>
                    <p className="text-xs text-white/80 font-light">{b.subtitle}</p>
                    <div className="pt-2">
                      <span className="inline-block bg-white text-black px-3 py-1 rounded-full text-[11px] font-bold">
                        {b.buttonText} →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: IDEIAS EM FORMATO MARKDOWN                                         */}
        {/* ========================================================================= */}
        {activeTab === 'markdown_ideias' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Ideias de Negócio em Markdown</h2>
              <p className="text-xs text-[#8b949e]">
                Adicione modelos de negócio com formatação completa em Markdown
              </p>
            </div>

            {/* Markdown Form */}
            <form onSubmit={handleSaveMarkdownIdea} className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  {editingIdeaId ? 'Editar Ideia' : 'Cadastrar Nova Ideia'}
                </span>

                <button
                  type="button"
                  onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                  className="bg-[#141414] hover:bg-[#1f1f1f] text-[#c9d1d9] px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-[#222222]"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showMarkdownPreview ? 'Voltar ao Editor' : 'Pré-visualizar Markdown'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                    Título da Ideia / Negócio
                  </label>
                  <input
                    type="text"
                    value={ideaTitle}
                    onChange={(e) => setIdeaTitle(e.target.value)}
                    placeholder="Ex: Pães Caseiros e Roscas Doces"
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                    Categoria
                  </label>
                  <select
                    value={ideaCategory}
                    onChange={(e) => setIdeaCategory(e.target.value)}
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="comida">Comida & Doces</option>
                    <option value="beleza">Beleza & Cabelo</option>
                    <option value="costura">Costura & Artesanato</option>
                    <option value="revenda">Vendas & Revenda</option>
                    <option value="servicos">Limpeza & Cuidados</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                    Emoji Ícone
                  </label>
                  <input
                    type="text"
                    value={ideaEmoji}
                    onChange={(e) => setIdeaEmoji(e.target.value)}
                    placeholder="🍞"
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                    Custo Mínimo (R$)
                  </label>
                  <input
                    type="number"
                    value={ideaMinCost}
                    onChange={(e) => setIdeaMinCost(e.target.value)}
                    placeholder="30"
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                    Custo Máximo (R$)
                  </label>
                  <input
                    type="number"
                    value={ideaMaxCost}
                    onChange={(e) => setIdeaMaxCost(e.target.value)}
                    placeholder="70"
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#c9d1d9] block mb-1">
                  Conteúdo Detalhado em Markdown
                </label>

                {!showMarkdownPreview ? (
                  <textarea
                    rows={8}
                    value={ideaMarkdown}
                    onChange={(e) => setIdeaMarkdown(e.target.value)}
                    placeholder={`# Título do Modelo de Negócio\n\n## 💡 Sobre a Oportunidade\nExplicação prática de como funciona.\n\n### 🛒 Lista de Materiais e Custo Inicial\n- Item 1 (R$ 10,00)\n- Item 2 (R$ 15,00)\n\n### 🚀 Mensagem de WhatsApp para o Primeiro Cliente\n> "Oi vizinha! Acabei de preparar..."`}
                    className="w-full bg-[#141414] border border-[#222222] rounded-xl p-3 text-xs text-white font-mono leading-relaxed"
                  />
                ) : (
                  <div className="bg-[#141414] border border-[#222222] rounded-xl p-4 text-xs space-y-2 text-[#c9d1d9] whitespace-pre-line font-sans leading-relaxed">
                    {ideaMarkdown || 'Nenhum conteúdo digitado ainda.'}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {editingIdeaId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingIdeaId(null);
                      setIdeaTitle('');
                      setIdeaMarkdown('');
                    }}
                    className="bg-[#141414] text-[#c9d1d9] px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancelar Edição
                  </button>
                )}

                <button
                  type="submit"
                  className="bg-[#238636] hover:bg-[#2ea043] text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {editingIdeaId ? 'Salvar Alterações' : 'Salvar Ideia no App'}
                </button>
              </div>
            </form>

            {/* List of Custom Ideas */}
            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">
                Ideias em Markdown Cadastradas ({store.customIdeas.length})
              </h3>

              <div className="space-y-3">
                {store.customIdeas.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#141414] border border-[#222222] rounded-xl p-4 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <b className="text-white text-sm block">{item.title}</b>
                        <span className="text-[11px] text-[#8b949e]">
                          {item.category.toUpperCase()} · Início: R$ {item.minCost} a R$ {item.maxCost}
                        </span>
                        <div className="mt-1 text-[11px] text-[#8b949e] line-clamp-2 font-mono">
                          {item.markdownContent.slice(0, 140)}...
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleEditIdea(item)}
                        className="bg-[#222222] hover:bg-[#333333] text-white p-1.5 rounded-lg cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteIdea(item.id)}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-1.5 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
