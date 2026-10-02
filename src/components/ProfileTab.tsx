import React, { useState } from 'react';
import {
  Bookmark,
  Calculator,
  Lock,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Sun,
  Moon,
  Check,
  AlertCircle,
  X,
  ArrowUpRight,
  LogOut,
  CalendarClock
} from 'lucide-react';
import { UserProfile, BusinessIdea, TabType } from '../types';
import { BUSINESS_IDEAS } from '../data/ideas';

interface ProfileTabProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenIdea: (idea: BusinessIdea) => void;
  onNavigate: (tab: TabType) => void;
  onResetAllData: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onOpenDiagnosis?: () => void;
  onOpenAdmin?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  onUpdateProfile,
  onNavigate,
  onResetAllData,
  isDarkMode,
  onToggleTheme,
  onOpenDiagnosis,
  onOpenAdmin
}) => {
  // Modals
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [vipCatalogJoined, setVipCatalogJoined] = useState(false);

  // Credentials form
  const [newEmail, setNewEmail] = useState(profile.email || 'mae.empreendedora@email.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credentialsSuccess, setCredentialsSuccess] = useState(false);
  const [credentialsError, setCredentialsError] = useState('');

  const savedIdeasCount = profile.savedIdeaIds.length;
  const isPro = profile.plan === 'pro';

  const handleOpenFinanceManagement = () => {
    if (isPro) {
      onNavigate('financeiro');
    } else {
      setShowUpsellModal(true);
    }
  };

  const handleUnlockPro = () => {
    onUpdateProfile({
      ...profile,
      plan: 'pro',
      planPurchasedAt: new Date().toLocaleDateString('pt-BR')
    });
    setShowUpsellModal(false);
    onNavigate('financeiro');
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialsError('');

    if (newPassword && newPassword !== confirmPassword) {
      setCredentialsError('A nova senha e a confirmação não coincidem.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setCredentialsError('A nova senha deve ter no mínimo 6 dígitos.');
      return;
    }

    onUpdateProfile({
      ...profile,
      email: newEmail.trim()
    });

    setCredentialsSuccess(true);
    setTimeout(() => {
      setCredentialsSuccess(false);
      setShowCredentialsModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Title */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight flex items-center gap-2">
          Perfil e Configurações.
        </h1>
        <p className="text-xs font-light text-[var(--text-muted)] mt-0.5 leading-[1.38]">
          Gerencie seu plano, suas ideias salvas, segurança da conta e ferramentas financeiras.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. COMPONENTE DE PLANO ATUAL NO TOPO (CARD COM BACKGROUND EM DEGRADÊ)     */}
      {/* ========================================================================= */}
      {isPro ? (
        <div className="bg-gradient-to-br from-[#0a2540] via-[#0052cc] to-[#0066ff] text-white rounded-[26px] p-6 space-y-3.5 shadow-sm border border-blue-400/20 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 border border-white/20">
                ⭐
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block">
                  Seu Plano Atual
                </span>
                <h2 className="text-base font-bold text-white">
                  Kit Mãe Empreendedora PRO
                </h2>
              </div>
            </div>

            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white text-[#0052cc] shadow-xs">
              Ativo Vitalício
            </span>
          </div>

          <p className="text-xs font-light text-blue-100 leading-relaxed relative z-10">
            Acesso vitalício ativo a todas as ferramentas PRO, incluindo Gestão Financeira Completa, Calculadora de Precificação e Desafios. Ativado em {profile.planPurchasedAt || '2026'}.
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#1c1c1c] via-[#242424] to-[#121212] text-white rounded-[26px] p-6 space-y-3.5 shadow-sm border border-neutral-700/60 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#0066ff]/25 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 border border-white/10">
                🌱
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#adadad] block">
                  Seu Plano Atual
                </span>
                <h2 className="text-base font-bold text-white">
                  Plano Básico Gratuito
                </h2>
              </div>
            </div>

            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-white border border-white/15">
              Gratuito
            </span>
          </div>

          <p className="text-xs font-light text-[#cccccc] leading-relaxed relative z-10">
            Você está no plano gratuito com acesso ao catálogo de 50 ideias e ao Desafio dos 50 Depósitos. Desbloqueie a gestão financeira completa e calculadoras.
          </p>

          <div className="pt-1 relative z-10">
            <button
              onClick={() => setShowUpsellModal(true)}
              className="w-full py-3 px-4 rounded-full text-xs font-bold text-[#141414] bg-white hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-[#0066ff]" />
              <span>Fazer Upgrade para o Kit PRO por R$ 6,90</span>
            </button>
          </div>
        </div>
      )}

      {/* Diagnóstico Card */}
      {onOpenDiagnosis && (
        <div
          onClick={onOpenDiagnosis}
          className="bg-gradient-to-r from-emerald-600/10 via-emerald-600/5 to-[var(--canvas-soft)] border border-emerald-500/30 hover:border-emerald-500/60 rounded-[24px] p-4 flex items-center justify-between cursor-pointer transition-colors shadow-2xs group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg shrink-0">
              🎯
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-[var(--ink)] leading-snug">
                Diagnóstico de Renda Materna
              </h3>
              <span className="text-[10px] text-[var(--text-muted)] font-light block">
                {profile.profileType ? `Seu perfil atual: ${profile.profileType}` : 'Descubra as ideias que cabem na sua rotina em 2 min'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 shrink-0">
            <span>{profile.diagnosisCompleted ? 'Refazer' : 'Fazer'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CARD QUE LEVA PARA A PÁGINA DEDICADA: MINHAS IDEIAS SALVAS             */}
      {/* ========================================================================= */}
      <div
        onClick={() => onNavigate('salvas')}
        className="bg-[var(--canvas)] border border-[var(--hairline)] hover:border-[var(--ink)] rounded-[24px] p-5 space-y-3 cursor-pointer transition-colors shadow-2xs group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[var(--canvas-soft)] flex items-center justify-center text-[var(--ink)] shrink-0 group-hover:scale-105 transition-transform">
              <Bookmark className="w-5 h-5 fill-current text-[#0066ff]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[var(--ink)] truncate">
                  Minhas Ideias Salvas
                </h3>
                <span className="text-[10px] font-bold bg-[#f3f3f3] dark:bg-[#282828] text-[var(--ink)] px-2.5 py-0.5 rounded-full shrink-0">
                  {savedIdeasCount} {savedIdeasCount === 1 ? 'salva' : 'salvas'}
                </span>
              </div>
              <p className="text-xs font-light text-[var(--text-muted)] mt-0.5 leading-snug">
                Página dedicada para ver seus modelos favoritos e materiais necessários.
              </p>
            </div>
          </div>

          <ArrowUpRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-1" />
        </div>

        <div className="pt-2 border-t border-[var(--hairline-soft)] flex items-center justify-between text-xs font-semibold text-[#0066ff]">
          <span>Abrir página de ideias salvas</span>
          <span>→</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CARD DE GESTÃO FINANCEIRA E CADERNINHO DE VENDAS                       */}
      {/* ========================================================================= */}
      <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-3.5 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--canvas-soft)] flex items-center justify-center text-[#0066ff] shrink-0 mt-0.5">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[var(--ink)]">
                Gestão Financeira & Caderninho.
              </h3>
              {!isPro && (
                <span className="text-[9px] bg-[#0066ff] text-white px-2 py-0.2 rounded-full font-bold">
                  PRO
                </span>
              )}
            </div>
            <p className="text-xs font-light text-[var(--text-muted)] leading-relaxed mt-1">
              Acesse a página de Gestão Financeira para anotar vendas, calcular lucro limpo, separar o dinheiro do negócio do dinheiro da casa e ver seu ticket médio.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenFinanceManagement}
          className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Abrir Caderninho & Gestão Financeira</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. COMPONENTE QUE LEVA PARA A PÁGINA DE CALCULADORA DE CUSTO              */}
      {/* ========================================================================= */}
      <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-3 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--canvas-soft)] flex items-center justify-center text-[var(--ink)] shrink-0 mt-0.5">
            <Calculator className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[var(--ink)]">
              Calculadora de Custo e Lucro.
            </h3>
            <p className="text-xs font-light text-[var(--text-muted)] leading-relaxed mt-0.5">
              Defina preços justos e evite prejuízos. Calcule com precisão ingredientes, embalagem e o valor da sua hora trabalhada.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('calculadora')}
          className="w-full btn-outline text-xs py-2.5 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Abrir Calculadora de Precificação</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card da Rotina Diária das Mães */}
      <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-3 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--canvas-soft)] flex items-center justify-center text-[var(--ink)] shrink-0 mt-0.5">
            <CalendarClock className="w-5 h-5 text-[#0066ff]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[var(--ink)]">
              Rotina & Hábitos com os Filhos.
            </h3>
            <p className="text-xs font-light text-[var(--text-muted)] leading-relaxed mt-0.5">
              Organize os horários de produção, tarefas da casa e o tempo de qualidade com as crianças sem sobrecarga.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('rotina')}
          className="w-full btn-outline text-xs py-2.5 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Abrir Minha Rotina Diária</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 5. CATÁLOGO DE PRODUTOS COM BOTÃO DE WHATSAPP (EM BREVE)                  */}
      {/* ========================================================================= */}
      <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-5 space-y-3 relative overflow-hidden shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-white bg-[#0066ff] px-2.5 py-0.5 rounded-full">
            Em breve
          </span>
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
            Novidade
          </span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-[var(--ink)] flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            Catálogo de Produtos com Pedido no WhatsApp.
          </h3>
          <p className="text-xs font-light text-[var(--text-muted)] leading-relaxed mt-1">
            Crie sua própria vitrine digital dos seus produtos (bolos, doces, costura ou serviços) com link direto para sua cliente escolher e fazer o pedido pronto no seu WhatsApp com 1 toque.
          </p>
        </div>

        <button
          onClick={() => setVipCatalogJoined(true)}
          className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            vipCatalogJoined
              ? 'bg-emerald-600 text-white'
              : 'btn-outline'
          }`}
        >
          {vipCatalogJoined ? (
            <>
              <Check className="w-4 h-4" />
              <span>Você está na Lista VIP de Lançamento!</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
              <span>Entrar na Lista VIP / Ser avisada no WhatsApp ↗</span>
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 6. APARÊNCIA DO APLICATIVO (MODO CLARO / ESCURO)                           */}
      {/* ========================================================================= */}
      {onToggleTheme && (
        <div className="bg-[var(--canvas)] border border-[var(--hairline-soft)] rounded-[24px] p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              Aparência do Aplicativo
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-light mt-0.5 block">
              Alterne entre modo claro e escuro
            </span>
          </div>

          <button
            onClick={onToggleTheme}
            className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer"
          >
            <span>{isDarkMode ? 'Escuro' : 'Claro'}</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. ACESSO & SEGURANÇA DA CONTA (ABAIXO DA APARÊNCIA DO APP)               */}
      {/* ========================================================================= */}
      <div className="bg-[var(--canvas)] border border-[var(--hairline-soft)] rounded-[24px] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Acesso & Segurança da Conta
            </h3>
            <span className="text-[11px] text-[var(--text-muted)] font-light mt-0.5 block truncate max-w-[200px]">
              {profile.email || 'mae.empreendedora@email.com'}
            </span>
          </div>

          <button
            onClick={() => setShowCredentialsModal(true)}
            className="btn-outline text-xs py-1.5 px-3 cursor-pointer"
          >
            Alterar dados
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. BOTÃO DE SAIR DA CONTA (ABAIXO DE ACESSO & SEGURANÇA)                  */}
      {/* ========================================================================= */}
      <div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full bg-[var(--canvas)] border border-[var(--hairline)] hover:border-red-400 hover:text-red-600 rounded-[22px] py-3.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer text-[var(--ink)] shadow-2xs group"
        >
          <LogOut className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
          <span>Sair da conta</span>
        </button>
      </div>

      {/* Botão de Acesso ao Painel ADM */}
      {onOpenAdmin && (
        <div>
          <button
            onClick={onOpenAdmin}
            className="w-full bg-[#161b22] hover:bg-[#21262d] text-[#3fb950] border border-[#238636]/40 hover:border-[#3fb950] rounded-[22px] py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <span>Painel Administrativo (/adm)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reset Data */}
      <div className="pt-2 text-center">
        <button
          onClick={() => {
            if (window.confirm('Tem certeza que deseja reiniciar seus dados do aplicativo?')) {
              onResetAllData();
            }
          }}
          className="text-xs font-normal text-[var(--text-faint)] hover:text-[var(--ink)] underline cursor-pointer"
        >
          Limpar dados e recomeçar
        </button>
      </div>

      {/* Mobbin Signature Inverse Polarity Footer */}
      <footer className="-mx-4 sm:-mx-6 mt-8 p-6 bg-[#141414] text-[#ffffff] rounded-t-[24px] space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-base tracking-tight flex items-center gap-1">
            Renda Mais<span className="text-[#0066ff]">.</span>
          </div>
          <span className="text-[11px] text-[#adadad] font-light">
            Empreendedorismo Materno
          </span>
        </div>

        <p className="text-[11px] text-[#adadad] font-light leading-relaxed">
          Conteúdo educativo e independente. Os valores exibidos são referências de mercado e variam por região. Não possui vínculo com órgãos governamentais ou com a gestão do Bolsa Família.
        </p>

        <div className="pt-2 border-t border-[#262626] text-[10px] text-[#707070] flex items-center justify-between">
          <span>Feito para mães empreendedoras</span>
          <span>© 2026 Renda Mais</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL: TROCAR EMAIL E SENHA                                               */}
      {/* ========================================================================= */}
      {showCredentialsModal && (
        <div
          className="fixed inset-0 z-50 bg-[#141414]/50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCredentialsModal(false);
          }}
        >
          <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--ink)]">
                Acesso e Segurança.
              </h3>
              <button
                onClick={() => setShowCredentialsModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--ink)] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  E-mail de acesso
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full mobbin-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Nova senha
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 dígitos"
                  className="w-full mobbin-input text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                  Confirmar nova senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full mobbin-input text-xs"
                />
              </div>

              {credentialsError && (
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{credentialsError}</span>
                </div>
              )}

              {credentialsSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Dados atualizados com sucesso!</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCredentialsModal(false)}
                  className="flex-1 btn-outline text-xs py-2.5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary text-xs py-2.5"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: UPSELL DO KIT PRO / GESTÃO FINANCEIRA                             */}
      {/* ========================================================================= */}
      {showUpsellModal && (
        <div
          className="fixed inset-0 z-50 bg-[#141414]/50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowUpsellModal(false);
          }}
        >
          <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-[#0066ff] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Upgrade Especial
              </span>
              <button
                onClick={() => setShowUpsellModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--ink)] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[var(--ink)]">
                Desbloqueie a Gestão Financeira.
              </h3>
              <p className="text-xs font-light text-[var(--text-muted)] mt-1 leading-relaxed">
                Tenha o painel financeiro completo para controlar lucros, separar o pote da casa e saber exatamente quanto sobra todo mês.
              </p>
            </div>

            <div className="bg-[var(--canvas-soft)] p-3.5 rounded-[18px] space-y-2 text-xs text-[var(--ink)]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>Dashboard de Faturamento, Custos e Margem</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>Regra dos Dois Potes: Pote da Casa vs Pote do Negócio</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>Calculadora de Custo e Precificação Completa</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#0066ff]" />
                <span>Acesso vitalício sem mensalidades</span>
              </div>
            </div>

            <div className="text-center pt-1">
              <span className="text-[11px] text-[var(--text-muted)] line-through block">De R$ 29,90</span>
              <span className="text-2xl font-bold text-[var(--ink)]">Por apenas R$ 6,90</span>
              <span className="text-[10px] text-[var(--text-muted)] block">pagamento único</span>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleUnlockPro}
                className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Desbloquear Acesso Completo (R$ 6,90)
              </button>
              <button
                onClick={() => setShowUpsellModal(false)}
                className="w-full text-xs text-[var(--text-muted)] hover:underline py-1 cursor-pointer"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* MODAL: CONFIRMAÇÃO DE SAIR DA CONTA                                       */}
      {/* ========================================================================= */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-50 bg-[#141414]/50 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutModal(false);
          }}
        >
          <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[24px] p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center text-lg">
                <LogOut className="w-5 h-5" />
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--ink)] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--ink)]">
                Deseja sair da sua conta?
              </h3>
              <p className="text-xs font-light text-[var(--text-muted)] mt-1 leading-relaxed">
                Suas ideias salvas e configurações continuam salvas com segurança neste dispositivo para quando você voltar.
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 btn-outline text-xs py-2.5"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutModal(false);
                  onNavigate('home');
                }}
                className="flex-1 py-2.5 px-3 rounded-full text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
              >
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
