import React, { useState, useId } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Clock,
  Heart,
  DollarSign,
  AlertCircle,
  Copy,
  QrCode,
  Phone,
  User,
  Mail,
  KeyRound
} from 'lucide-react';
import { UserProfile, BusinessIdea } from '../types';
import { triggerCelebration } from '../utils/celebration';
import { syncPayService } from '../services/syncPayService';
import { getAdminStore } from '../services/adminStore';

interface DiagnosisFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onSelectIdea?: (idea: BusinessIdea) => void;
}

interface QuestionOption {
  b: string;
  s?: string;
  e?: string;
  c?: string;
  v?: string;
}

interface FunnelStep {
  k: 'hook' | 'one' | 'multi' | 'story' | 'res';
  id?: string;
  ey?: string;
  h?: string;
  d?: string;
  lay?: 'list' | 'g2';
  max?: number;
  o?: QuestionOption[];
  note?: string;
}

const PROFILES: Record<string, { n: string; e: string; t: string[] }> = {
  cozinha: {
    n: 'Cozinha que rende',
    e: '🍰',
    t: [
      'Escolher 1 produto (doce, marmita ou salgado) e calcular o custo real',
      'Montar um cardápio simples e vender para vizinhos e grupos de WhatsApp',
      'Fixar o preço com margem para você e criar encomendas semanais'
    ]
  },
  beleza: {
    n: 'Beleza que rende',
    e: '💅',
    t: [
      'Definir 2 ou 3 serviços que você faz bem (unha, cabelo, sobrancelha)',
      'Criar um dia fixo de atendimento e um valor de entrada',
      'Pedir indicação para cada cliente e montar sua agenda'
    ]
  },
  arte: {
    n: 'Artesã que rende',
    e: '🧵',
    t: [
      'Escolher uma peça com procura (bolsas, ajustes, lembrancinhas)',
      'Fazer 3 amostras e testar a venda no seu círculo',
      'Pegar encomendas e fixar o preço com o valor da sua hora'
    ]
  },
  cuidado: {
    n: 'Cuidado que rende',
    e: '🧹',
    t: [
      'Definir seus serviços (diarista, cuidadora, passadeira)',
      'Montar uma lista de contatos e oferecer a primeira visita',
      'Criar uma rotina semanal e cobrar com preço combinado'
    ]
  },
  venda: {
    n: 'Vendas que rendem',
    e: '🛍️',
    t: [
      'Escolher um produto com procura (cosméticos, roupas, lanches)',
      'Começar com pouco estoque e vender para quem confia em você',
      'Anotar tudo em um caderno e reinvestir parte do lucro'
    ]
  }
};

const IDEAS_BY_PROFILE: Record<string, [string, string][]> = {
  cozinha: [
    ['Doces e brigadeiros de pote', 'R$ 40 a R$ 70'],
    ['Marmitas por encomenda', 'R$ 50 a R$ 100'],
    ['Salgados congelados', 'R$ 60 a R$ 100']
  ],
  beleza: [
    ['Esmaltação e unhas simples', 'R$ 50 a R$ 100'],
    ['Penteados e tranças em domicílio', 'R$ 30 a R$ 80'],
    ['Design de sobrancelha', 'R$ 40 a R$ 90']
  ],
  arte: [
    ['Ajustes e consertos de roupa', 'R$ 20 a R$ 60'],
    ['Lembrancinhas de festa', 'R$ 40 a R$ 90'],
    ['Necessaires de tecido', 'R$ 50 a R$ 100']
  ],
  cuidado: [
    ['Passadeira de roupas', 'R$ 0 a R$ 40'],
    ['Faxina com kit próprio', 'R$ 60 a R$ 100'],
    ['Cuidado de crianças por hora', 'R$ 0 a R$ 30']
  ],
  venda: [
    ['Cosméticos por catálogo', 'R$ 0 a R$ 60'],
    ['Lanches e geladinhos', 'R$ 40 a R$ 90'],
    ['Revenda de roupas em grupos', 'R$ 60 a R$ 100']
  ]
};

const FUNNEL_STEPS: FunnelStep[] = [
  { k: 'hook' },
  {
    k: 'one',
    id: 'bf',
    ey: 'Para começar',
    h: 'Você recebe o Bolsa Família?',
    d: 'Assim o diagnóstico fica mais próximo da sua realidade.',
    lay: 'list',
    o: [
      { b: 'Sim, eu recebo', s: 'Quero ver como ir além do benefício.' },
      { b: 'Já recebi, quero me reerguer', s: 'Preciso de um novo caminho.' },
      { b: 'Ainda não recebo', s: 'Quero entender como organizar minha renda.' }
    ]
  },
  {
    k: 'one',
    id: 'fase',
    ey: 'Seu momento',
    h: 'Qual dessas frases parece mais com a sua vida hoje?',
    d: 'Escolha a que mais se aproxima. Não existe resposta certa.',
    lay: 'g2',
    o: [
      { e: '🌱', c: '#FFC21A', b: 'Quero organizar', s: 'O dinheiro entra e some, preciso de controle.' },
      { e: '🚀', c: '#F77B1E', b: 'Quero começar algo meu', s: 'Tenho vontade, só falta direção.' }
    ]
  },
  {
    k: 'one',
    id: 'sentir',
    ey: 'Seu objetivo',
    h: 'Se os próximos meses fossem diferentes, o que você gostaria de sentir?',
    lay: 'g2',
    o: [
      { e: '💵', c: '#C6E03B', b: 'Dinheiro sobrando', s: 'Chegar ao fim do mês com folga.' },
      { e: '😌', c: '#9DB8F5', b: 'Tranquilidade', s: 'Dormir sem aperto na cabeça.' },
      { e: '👩‍👧', c: '#FF9EC4', b: 'Mais tempo com meus filhos', s: 'Renda perto de casa.' },
      { e: '💪', c: '#FFC21A', b: 'Independência', s: 'Ter o meu próprio dinheiro.' }
    ]
  },
  {
    k: 'multi',
    id: 'filhos',
    ey: 'Para quem você faz isso',
    h: 'O que você quer proporcionar de melhor para sua família?',
    d: 'Pode escolher mais de uma.',
    lay: 'list',
    o: [
      { b: 'Alimentação melhor', s: 'Mesa mais cheia e variada.' },
      { b: 'Material e roupa para a escola', s: 'Começar o ano sem sufoco.' },
      { b: 'Lazer e momentos juntos', s: 'Um passeio, um aniversário.' },
      { b: 'Uma reserva para emergências', s: 'Para não depender de empréstimo.' }
    ],
    note: 'O quiz ajuda a organizar o dinheiro e a buscar renda extra. Os resultados dependem do seu esforço e da sua realidade.'
  },
  { k: 'story' },
  {
    k: 'one',
    id: 'dinheiro',
    ey: 'Dinheiro',
    h: 'Qual cenário descreve melhor sua vida financeira hoje?',
    lay: 'list',
    o: [
      { b: 'Preciso organizar o que já entra', s: 'Quero entender para onde o dinheiro vai.' },
      { b: 'Quero uma renda extra', s: 'Além do benefício e do que já recebo.' },
      { b: 'Quero guardar uma reserva', s: 'Mesmo que seja aos poucos.' }
    ]
  },
  {
    k: 'multi',
    id: 'hab',
    ey: 'O que você já sabe fazer',
    h: 'Em quais dessas coisas você é boa, ou gostaria de ser?',
    d: 'Escolha até 3. A renda extra começa pelo que você já sabe.',
    lay: 'g2',
    max: 3,
    o: [
      { e: '🍰', c: '#FFC21A', b: 'Cozinhar e fazer doces', v: 'cozinha' },
      { e: '💅', c: '#FF9EC4', b: 'Beleza e cabelo', v: 'beleza' },
      { e: '🧵', c: '#C6E03B', b: 'Costura e artesanato', v: 'arte' },
      { e: '🧹', c: '#9DB8F5', b: 'Limpeza e cuidados', v: 'cuidado' },
      { e: '🛍️', c: '#F77B1E', b: 'Vendas e revenda', v: 'venda' }
    ]
  },
  {
    k: 'one',
    id: 'tempo',
    ey: 'Disponibilidade',
    h: 'Quanto tempo por dia você consegue dedicar?',
    d: 'A ideia é encaixar na sua rotina real.',
    lay: 'list',
    o: [
      { b: '30 minutos', s: 'Começo bem simples.' },
      { b: '1 a 2 horas', s: 'Consigo manter uma rotina curta.' },
      { b: '2 a 4 horas', s: 'Quero me dedicar mais.' }
    ]
  },
  {
    k: 'one',
    id: 'frase',
    ey: 'Seu coração',
    h: 'Qual dessas frases mais parece com o que você sente?',
    lay: 'g2',
    o: [
      { e: '✨', c: '#FFC21A', b: '“Eu sei que posso mais.”' },
      { e: '🧭', c: '#9DB8F5', b: '“Preciso de uma direção.”' },
      { e: '🔄', c: '#C6E03B', b: '“Quero virar o jogo.”' },
      { e: '🧱', c: '#FF9EC4', b: '“Quero ir passo a passo.”' }
    ]
  },
  { k: 'res' }
];

const TOTAL_QUESTIONS = FUNNEL_STEPS.filter((s) => s.id).length;

export const DiagnosisFunnelModal: React.FC<DiagnosisFunnelModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  // Single-selection answers: { [questionId]: optionIndex }
  const [answers, setAnswers] = useState<Record<string, number>>({});
  // Multi-selection answers: { [questionId]: string[] }
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});

  // 50-deposits Challenge Interactive State in Result Screen
  const [meta, setMeta] = useState<number>(1000);
  const [mes, setMes] = useState<number>(100);
  const [deposits, setDeposits] = useState<number[]>([]);
  const [doneDeposits, setDoneDeposits] = useState<Record<number, boolean>>({});

  // SyncPay Automatic Pix Checkout State
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerName, setCustomerName] = useState(profile.name || '');
  const [customerWhatsapp, setCustomerWhatsapp] = useState(profile.whatsapp || '');
  const [customerEmail, setCustomerEmail] = useState(profile.email || '');
  const [customerPassword, setCustomerPassword] = useState(profile.password || '');
  const [checkoutError, setCheckoutError] = useState('');

  const [pixCheckout, setPixCheckout] = useState<{
    identifier: string;
    qrCodeUrl: string;
    copyPaste: string;
    amount: number;
    copied: boolean;
    checking: boolean;
  } | null>(null);

  if (!isOpen) return null;

  const currentStep = FUNNEL_STEPS[stepIndex];
  const questionNumber = FUNNEL_STEPS.slice(0, stepIndex + 1).filter((s) => s.id).length;
  const progressPercent = Math.round((questionNumber / TOTAL_QUESTIONS) * 100);

  const selectedHabitKey = (multiAnswers['hab'] || [])[0] || 'venda';
  const profileData = PROFILES[selectedHabitKey] || PROFILES.venda;
  const ideasList = IDEAS_BY_PROFILE[selectedHabitKey] || IDEAS_BY_PROFILE.venda;

  // Navigation handlers
  const handleNext = () => {
    if (stepIndex < FUNNEL_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handlePickSingle = (id: string, optIndex: number) => {
    setAnswers((prev) => ({ ...prev, [id]: optIndex }));
  };

  const handleToggleMulti = (id: string, value: string, max?: number) => {
    const current = multiAnswers[id] || [];
    if (current.includes(value)) {
      setMultiAnswers((prev) => ({
        ...prev,
        [id]: current.filter((v) => v !== value)
      }));
    } else {
      if (!max || current.length < max) {
        setMultiAnswers((prev) => ({
          ...prev,
          [id]: [...current, value]
        }));
      }
    }
  };

  // Generate 50 deposits dynamically for the challenge
  const handleGenerateDeposits = () => {
    const weights = Array.from({ length: 50 }, () => 0.4 + Math.random() * 1.2);
    const sumW = weights.reduce((a, b) => a + b, 0);
    const deps = weights.map((w) => Math.max(1, Math.floor((w / sumW) * meta)));
    let rem = meta - deps.reduce((a, b) => a + b, 0);
    let k = 0;
    while (rem > 0) {
      deps[k % 50]++;
      rem--;
      k++;
    }
    while (rem < 0) {
      const maxIdx = deps.indexOf(Math.max(...deps));
      deps[maxIdx]--;
      rem++;
    }
    setDeposits(deps);
    setDoneDeposits({});
    triggerCelebration(false);
  };

  // Check if Continue button is disabled
  const isContinueDisabled = () => {
    if (!currentStep.id) return false;
    if (currentStep.k === 'multi') {
      return (multiAnswers[currentStep.id] || []).length === 0;
    }
    return answers[currentStep.id] === undefined;
  };

  const prazoEstimado = () => {
    const pr = Math.ceil(meta / mes);
    if (pr > 12) {
      return `${Math.floor(pr / 12)} ano(s) e ${pr % 12} mês(es)`;
    }
    return `${pr} mês(es)`;
  };

  const totalSavedInChallenge = deposits.reduce(
    (acc, val, idx) => acc + (doneDeposits[idx] ? val : 0),
    0
  );

  const handleTriggerPixOffer = async () => {
    const adminStore = getAdminStore();
    const defaultOffer = adminStore.offers.find((o) => o.isDefault);
    const price = defaultOffer ? defaultOffer.price : 19.90;

    const res = await syncPayService.createPixCashIn({
      amount: price,
      customerName: profile.name || 'Mãe Empreendedora',
      customerEmail: profile.email || 'mae.empreendedora@email.com',
      offerTitle: defaultOffer ? defaultOffer.name : 'Kit Mãe Empreendedora PRO'
    });

    if (res.success) {
      setPixCheckout({
        identifier: res.identifier,
        qrCodeUrl: res.qrCodeUrl,
        copyPaste: res.copyPaste,
        amount: res.amount,
        copied: false,
        checking: false
      });
    }
  };

  const handleConfirmPaidPix = () => {
    if (!pixCheckout) return;
    syncPayService.approveTransaction(pixCheckout.identifier);

    onUpdateProfile({
      ...profile,
      diagnosisCompleted: true,
      profileType: profileData.n,
      plan: 'pro',
      planPurchasedAt: new Date().toLocaleDateString('pt-BR')
    });

    triggerCelebration(true);
    setPixCheckout(null);
    onClose();
  };

  const handleFinishDiagnosis = (upgradePro: boolean) => {
    if (upgradePro) {
      setShowCheckoutForm(true);
      return;
    }

    onUpdateProfile({
      ...profile,
      diagnosisCompleted: true,
      profileType: profileData.n,
      plan: 'free'
    });
    triggerCelebration(false);
    onClose();
  };

  const handleCheckoutFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (!customerName.trim()) {
      setCheckoutError('Por favor, informe seu nome completo.');
      return;
    }
    const rawWa = customerWhatsapp.replace(/\D/g, '');
    if (rawWa.length < 10) {
      setCheckoutError('Por favor, informe um WhatsApp válido com DDD.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setCheckoutError('Por favor, informe um e-mail válido para criar seu acesso.');
      return;
    }
    if (!customerPassword.trim() || customerPassword.length < 4) {
      setCheckoutError('Por favor, defina uma senha de pelo menos 4 caracteres.');
      return;
    }

    // Save profile contact details
    onUpdateProfile({
      ...profile,
      name: customerName.trim(),
      whatsapp: customerWhatsapp.trim(),
      email: customerEmail.trim(),
      password: customerPassword.trim()
    });

    const adminStore = getAdminStore();
    const defaultOffer = adminStore.offers.find((o) => o.isDefault);
    const price = defaultOffer ? defaultOffer.price : 19.90;

    const res = await syncPayService.createPixCashIn({
      amount: price,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      offerTitle: defaultOffer ? defaultOffer.name : 'Kit Mãe Empreendedora PRO'
    });

    if (res.success) {
      setPixCheckout({
        identifier: res.identifier,
        qrCodeUrl: res.qrCodeUrl,
        copyPaste: res.copyPaste,
        amount: res.amount,
        copied: false,
        checking: false
      });
      setShowCheckoutForm(false);
    } else {
      setCheckoutError('Não foi possível gerar a chave Pix. Tente novamente.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0B2B1A]/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[var(--canvas)] text-[var(--ink)] border border-[var(--hairline)] rounded-[28px] max-w-[430px] w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* ========================================================================= */}
        {/* 1. TOP HEADER & PROGRESS BAR                                              */}
        {/* ========================================================================= */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-[var(--hairline-soft)] shrink-0">
          {stepIndex > 0 ? (
            <button
              onClick={handleBack}
              className="text-2xl text-[var(--ink)] hover:text-[#0E7A3E] font-bold p-1 cursor-pointer transition-colors"
              aria-label="Voltar"
            >
              ‹
            </button>
          ) : (
            <div className="flex items-center gap-1 font-black text-sm tracking-tight text-[#0B2B1A] dark:text-emerald-400">
              RENDA<span className="bg-[#FFC21A] text-[#7a5200] px-2 py-0.5 rounded-md text-xs">MAIS</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {currentStep.id ? (
              <span className="text-xs font-bold text-[var(--text-muted)]">
                {questionNumber} de {TOTAL_QUESTIONS}
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E7F6D6] text-[#0B5A2E]">
                Diagnóstico gratuito
              </span>
            )}
            <button
              onClick={onClose}
              className="text-[var(--text-muted)] hover:text-[var(--ink)] p-1 rounded-full cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {currentStep.id && !pixCheckout && !showCheckoutForm && (
          <div className="h-1.5 bg-[#E3EFDF] shrink-0 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0E7A3E] to-[#7BC62D] transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {showCheckoutForm && !pixCheckout ? (
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 animate-in fade-in duration-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Cadastro Seguro de Acesso
              </span>
              <h2 className="text-xl font-black text-[var(--ink)] leading-tight mt-1">
                Quase lá! Crie seu cadastro para acessar
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-light mt-1 leading-snug">
                Informe seus dados para receber o comprovante no WhatsApp e definir sua senha de login:
              </p>
            </div>

            {checkoutError && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-[14px] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            <form onSubmit={handleCheckoutFormSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-[#0066ff]" />
                  <span>Nome Completo</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Maria da Silva"
                  className="w-full mobbin-input text-xs"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp com DDD</span>
                </label>
                <input
                  type="tel"
                  value={customerWhatsapp}
                  onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  placeholder="(11) 99876-5432"
                  className="w-full mobbin-input text-xs font-bold"
                  required
                />
              </div>

              <div className="pt-1 border-t border-[var(--hairline-soft)] space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5 text-[#0066ff]" />
                    <span>E-mail para Acesso</span>
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="maria.mae@email.com"
                    className="w-full mobbin-input text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5 mb-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                    <span>Crie uma Senha</span>
                  </label>
                  <input
                    type="password"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full mobbin-input text-xs"
                    required
                  />
                </div>
              </div>

              <div className="bg-[#F2FAE6] p-3 rounded-[16px] flex items-center justify-between text-xs text-[#0B2B1A]">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] line-through block">De R$ 29,90</span>
                  <span className="font-extrabold text-base text-[#0E7A3E]">
                    R$ 19,90
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#0E7A3E]">
                  Acesso Vitalício PRO
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-[16px] bg-[#FFC21A] hover:bg-[#ffcd38] text-[#0B2B1A] font-black text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Gerar Chave Pix & Liberar</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowCheckoutForm(false)}
                className="w-full text-center text-xs text-[var(--text-muted)] hover:underline cursor-pointer py-1"
              >
                Voltar ao Diagnóstico
              </button>
            </form>
          </div>
        ) : pixCheckout ? (
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 text-center animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto text-xl shadow-xs">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Pagamento Instantâneo via Pix (SyncPay)
              </span>
              <h2 className="text-xl font-black text-[var(--ink)] leading-tight mt-1">
                Quase lá! Pague via Pix para liberar na hora
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-light mt-1">
                Abra o app do seu banco e pague com o Pix para acesso imediato ao Kit PRO
              </p>
            </div>

            <div className="p-4 bg-[var(--canvas-soft)] rounded-[22px] border border-[var(--hairline)] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] font-medium">Valor da Oferta:</span>
                <b className="text-lg font-black text-emerald-600">
                  R$ {pixCheckout.amount.toFixed(2).replace('.', ',')}
                </b>
              </div>

              {/* QR Code Image */}
              <div className="p-3 bg-white rounded-2xl border border-[var(--hairline-soft)] inline-block mx-auto shadow-sm">
                <img
                  src={pixCheckout.qrCodeUrl}
                  alt="QR Code Pix SyncPay"
                  className="w-44 h-44 mx-auto"
                />
              </div>

              <div className="space-y-1 text-left">
                <span className="text-[11px] font-bold text-[var(--ink)] block">
                  Ou copie o código Pix abaixo:
                </span>
                <div className="flex items-center gap-1.5 bg-[var(--canvas)] p-2 rounded-xl border border-[var(--hairline)]">
                  <input
                    type="text"
                    readOnly
                    value={pixCheckout.copyPaste}
                    className="bg-transparent text-[10.5px] font-mono text-[var(--ink)] flex-1 outline-none truncate"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pixCheckout.copyPaste);
                      setPixCheckout({ ...pixCheckout, copied: true });
                      setTimeout(() => {
                        setPixCheckout((prev) => (prev ? { ...prev, copied: false } : null));
                      }, 2500);
                    }}
                    className="btn-primary py-1 px-2.5 text-[10px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {pixCheckout.copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{pixCheckout.copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-muted)] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Aguardando confirmação do banco via SyncPay...</span>
            </div>

            <button
              onClick={handleConfirmPaidPix}
              className="w-full py-4 px-4 rounded-[18px] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>Já fiz o Pix / Confirmar Pagamento</span>
            </button>

            <button
              onClick={() => setPixCheckout(null)}
              className="text-xs text-[var(--text-muted)] hover:underline block mx-auto py-1 cursor-pointer"
            >
              Voltar ao diagnóstico
            </button>
          </div>
        ) : (
        /* ========================================================================= */
        /* 2. SCROLLABLE BODY                                                        */
        /* ========================================================================= */
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* HOOK SCREEN: HERO ESTILO LAFI COM TODAS AS INFORMAÇÕES SOLICITADAS */}
          {currentStep.k === 'hook' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Hero Card Verde Vibrante com Ilustração de Cédulas e Moedas SVG */}
              <div className="rounded-[24px] bg-gradient-to-br from-[#0B5A2E] via-[#12924B] to-[#5DB52F] text-white p-5 relative overflow-hidden shadow-sm">
                <div className="absolute right-[-10px] top-[28px] text-[88px] font-black text-white/10 tracking-tighter select-none pointer-events-none">
                  RENDA
                </div>

                {/* SVG Money Art */}
                <div className="relative h-[95px] w-full flex items-center justify-center mb-1">
                  <svg
                    viewBox="0 0 170 86"
                    className="w-28 absolute left-2 top-1 -rotate-6 drop-shadow-md"
                  >
                    <rect width="170" height="86" rx="10" fill="#E39B00" />
                    <rect x="6" y="6" width="158" height="74" rx="7" fill="none" stroke="#FFE27A" strokeWidth="2" strokeDasharray="4 3" />
                    <circle cx="85" cy="43" r="25" fill="#FFE27A" opacity="0.35" />
                    <text x="85" y="53" textAnchor="middle" fontSize="30" fontWeight="900" fill="#fff" fontFamily="Trebuchet MS,sans-serif">50</text>
                    <text x="16" y="24" fontSize="12" fontWeight="900" fill="#fff">R$</text>
                    <text x="154" y="74" textAnchor="end" fontSize="12" fontWeight="900" fill="#fff">R$</text>
                  </svg>

                  <svg
                    viewBox="0 0 170 86"
                    className="w-28 absolute left-20 top-3 rotate-6 drop-shadow-md"
                  >
                    <rect width="170" height="86" rx="10" fill="#073D1F" />
                    <rect x="6" y="6" width="158" height="74" rx="7" fill="none" stroke="#7BC62D" strokeWidth="2" strokeDasharray="4 3" />
                    <circle cx="85" cy="43" r="25" fill="#7BC62D" opacity="0.35" />
                    <text x="85" y="53" textAnchor="middle" fontSize="30" fontWeight="900" fill="#fff" fontFamily="Trebuchet MS,sans-serif">20</text>
                    <text x="16" y="24" fontSize="12" fontWeight="900" fill="#fff">R$</text>
                    <text x="154" y="74" textAnchor="end" fontSize="12" fontWeight="900" fill="#fff">R$</text>
                  </svg>

                  <svg
                    viewBox="0 0 60 60"
                    className="w-12 absolute right-3 bottom-0 drop-shadow-sm"
                  >
                    <circle cx="30" cy="30" r="28" fill="#FFC21A" stroke="#C98A00" strokeWidth="3" />
                    <circle cx="30" cy="30" r="20" fill="none" stroke="#C98A00" strokeWidth="2" />
                    <text x="30" y="38" textAnchor="middle" fontSize="20" fontWeight="900" fill="#8A5A00">R$</text>
                  </svg>
                </div>

                <h1 className="text-2xl font-black tracking-tight leading-tight mt-1 text-white">
                  Um novo começo pode começar hoje.
                </h1>
                <p className="text-xs text-[#E9FFE0] font-light mt-1.5 leading-relaxed">
                  Seu benefício pode ser o primeiro passo para uma renda maior.
                </p>

                <button
                  onClick={() => setStepIndex(1)}
                  className="w-full mt-4 py-3.5 px-4 rounded-[16px] bg-[#FFC21A] hover:bg-[#ffcd38] text-[#0B2B1A] font-black text-sm transition-transform active:scale-98 cursor-pointer shadow-md"
                >
                  Fazer meu diagnóstico grátis
                </button>

                <div className="flex flex-wrap gap-2 text-[11px] font-bold text-[#E9FFE0] mt-3">
                  <span>⏱ 2 minutos</span>
                  <span>·</span>
                  <span>🔒 Sem CPF ou senha</span>
                  <span>·</span>
                  <span>💡 Ideias com até R$ 100</span>
                </div>
              </div>

              {/* Seção: Como Funciona (Simples, rápido e do seu jeito) */}
              <div className="space-y-3 pt-1">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0E7A3E]">
                    Como funciona
                  </span>
                  <h2 className="text-lg font-bold text-[var(--ink)] leading-snug">
                    Simples, rápido e do seu jeito
                  </h2>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 bg-[var(--canvas-soft)] border border-[var(--hairline-soft)] rounded-[18px] p-3.5">
                    <span className="w-7 h-7 rounded-full bg-[#0E7A3E] text-white font-black text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <b className="text-xs font-bold text-[var(--ink)] block">
                        Responda perguntas rápidas
                      </b>
                      <small className="text-[11px] text-[var(--text-muted)] font-light leading-relaxed block mt-0.5">
                        Sobre sua rotina, o que você sabe fazer e o que quer para sua família.
                      </small>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[var(--canvas-soft)] border border-[var(--hairline-soft)] rounded-[18px] p-3.5">
                    <span className="w-7 h-7 rounded-full bg-[#0E7A3E] text-white font-black text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <b className="text-xs font-bold text-[var(--ink)] block">
                        Receba sua trilha
                      </b>
                      <small className="text-[11px] text-[var(--text-muted)] font-light leading-relaxed block mt-0.5">
                        Um perfil e 3 primeiros passos para buscar renda complementar.
                      </small>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-[var(--canvas-soft)] border border-[var(--hairline-soft)] rounded-[18px] p-3.5">
                    <span className="w-7 h-7 rounded-full bg-[#0E7A3E] text-white font-black text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <b className="text-xs font-bold text-[var(--ink)] block">
                        Comece com um desafio
                      </b>
                      <small className="text-[11px] text-[var(--text-muted)] font-light leading-relaxed block mt-0.5">
                        Uma calculadora de 50 depósitos para você começar a guardar.
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: O Que Você Vai Encontrar (Grid 2 Cards) */}
              <div className="space-y-3 pt-1">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#0E7A3E]">
                    O que você vai encontrar
                  </span>
                  <h2 className="text-lg font-bold text-[var(--ink)] leading-snug">
                    Um caminho prático, sem enrolação
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[18px] p-3.5 space-y-1">
                    <div className="text-2xl">💡</div>
                    <b className="text-xs font-bold text-[var(--ink)] block">Ideias de renda extra</b>
                    <small className="text-[10.5px] text-[var(--text-muted)] font-light leading-snug block">
                      Para fazer em casa ou perto dela, com até R$ 100.
                    </small>
                  </div>

                  <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[18px] p-3.5 space-y-1">
                    <div className="text-2xl">🧾</div>
                    <b className="text-xs font-bold text-[var(--ink)] block">Organização do dinheiro</b>
                    <small className="text-[10.5px] text-[var(--text-muted)] font-light leading-snug block">
                      Entender para onde ele vai todo mês.
                    </small>
                  </div>

                  <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[18px] p-3.5 space-y-1">
                    <div className="text-2xl">🎯</div>
                    <b className="text-xs font-bold text-[var(--ink)] block">Desafio dos 50 depósitos</b>
                    <small className="text-[10.5px] text-[var(--text-muted)] font-light leading-snug block">
                      Guardar aos poucos, no seu ritmo.
                    </small>
                  </div>

                  <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[18px] p-3.5 space-y-1">
                    <div className="text-2xl">👩‍👧</div>
                    <b className="text-xs font-bold text-[var(--ink)] block">Pensado para mães</b>
                    <small className="text-[10.5px] text-[var(--text-muted)] font-light leading-snug block">
                      Mais qualidade de vida para os filhos.
                    </small>
                  </div>
                </div>
              </div>

              {/* Storytelling Card Amarelo */}
              <div className="rounded-[20px] p-4 bg-gradient-to-r from-[#F7C52B] to-[#FFE27A] text-[#0B2B1A] space-y-1.5 shadow-xs">
                <b className="text-base font-black block">“Eu sei que posso mais.”</b>
                <p className="text-xs font-medium leading-relaxed">
                  Se você faz o dinheiro render todo mês e ainda sonha em dar mais conforto aos seus filhos, este diagnóstico é para você. Começar pequeno também é começar.
                </p>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => setStepIndex(1)}
                  className="w-full py-4 px-4 rounded-[16px] bg-[#0E7A3E] hover:bg-[#0b6332] text-white font-black text-sm transition-transform active:scale-98 cursor-pointer shadow-md"
                >
                  Quero começar agora
                </button>
                <p className="text-[10.5px] text-center text-[var(--text-muted)] mt-2">
                  Resultados variam de pessoa para pessoa. Sem ligação com o governo.
                </p>
              </div>
            </div>
          )}

          {/* INTERSTITIAL STORY CARD: "Muita mulher começou pequeno" */}
          {currentStep.k === 'story' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="rounded-[24px] p-6 bg-gradient-to-br from-[#F7C52B] to-[#FFE27A] text-[#0B2B1A] space-y-3 shadow-md">
                <div className="text-5xl">🌱</div>
                <h2 className="text-xl font-black leading-tight text-[#0B2B1A]">
                  Muita mulher começou pequeno.
                </h2>
                <p className="text-sm font-medium leading-relaxed text-[#1c1c1c]">
                  Uma panela, um celular e coragem. Sem sócio, sem loja, sem grande investimento. O que muda tudo é dar o primeiro passo certo, e você já está dando.
                </p>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed px-1">
                Nas próximas perguntas, vamos olhar para o que você já sabe fazer para encontrar o negócio perfeito para a sua rotina.
              </p>

              <button
                onClick={handleNext}
                className="w-full btn-primary py-3.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continuar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* QUESTION CARDS: LIST OR GRID2 (ESTILO LAFI) */}
          {(currentStep.k === 'one' || currentStep.k === 'multi') && currentStep.id && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#0E7A3E]">
                  {currentStep.ey}
                </span>
                <h2 className="text-xl font-black text-[var(--ink)] leading-snug mt-1">
                  {currentStep.h}
                </h2>
                {currentStep.d && (
                  <p className="text-xs font-light text-[var(--text-muted)] mt-1 leading-relaxed">
                    {currentStep.d}
                  </p>
                )}
              </div>

              {/* Options Grid or List */}
              <div
                className={
                  currentStep.lay === 'g2' ? 'grid grid-cols-2 gap-2.5' : 'space-y-2.5'
                }
              >
                {currentStep.o?.map((opt, optIdx) => {
                  const isMulti = currentStep.k === 'multi';
                  const val = opt.v || String(optIdx);
                  const isSelected = isMulti
                    ? (multiAnswers[currentStep.id!] || []).includes(val)
                    : answers[currentStep.id!] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => {
                        if (isMulti) {
                          handleToggleMulti(currentStep.id!, val, currentStep.max);
                        } else {
                          handlePickSingle(currentStep.id!, optIdx);
                        }
                      }}
                      className={`relative border-2 rounded-[20px] overflow-hidden text-left p-0 transition-all cursor-pointer bg-[var(--canvas)] group ${
                        isSelected
                          ? 'border-[#0E7A3E] ring-3 ring-[#FFC21A] bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'border-[var(--hairline)] hover:border-[#0E7A3E]'
                      }`}
                    >
                      {/* Check Bubble */}
                      <div
                        className={`absolute right-2.5 top-2.5 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
                          isSelected
                            ? 'bg-[#FFC21A] border-[#0E7A3E] text-[#0B2B1A] font-bold text-xs'
                            : 'border-[#b9d3b2] bg-white text-transparent'
                        }`}
                      >
                        {isSelected && '✓'}
                      </div>

                      {/* Visual Header Image/Emoji if Grid 2 */}
                      {opt.e && (
                        <div
                          className="h-20 flex items-center justify-center text-4xl"
                          style={{ backgroundColor: opt.c || '#F2FAE6' }}
                        >
                          {opt.e}
                        </div>
                      )}

                      <div className="p-3.5 space-y-0.5">
                        <b className="text-xs font-bold text-[var(--ink)] block leading-snug">
                          {opt.b}
                        </b>
                        {opt.s && (
                          <small className="text-[10.5px] text-[var(--text-muted)] font-light leading-snug block">
                            {opt.s}
                          </small>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {currentStep.note && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 rounded-[16px] text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  ⚠️ <b>Nota:</b> {currentStep.note}
                </div>
              )}

              <button
                onClick={handleNext}
                disabled={isContinueDisabled()}
                className="w-full btn-primary py-3.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Continuar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* RESULT SCREEN: TRILHA + IDEIAS + CALCULADORA 50 DEPÓSITOS + OFERTA */}
          {currentStep.k === 'res' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#0E7A3E]">
                  Seu diagnóstico pronto
                </span>
                <h1 className="text-xl font-black text-[var(--ink)] leading-snug mt-0.5">
                  Você não precisa fazer tudo. Precisa saber o que fazer primeiro.
                </h1>
              </div>

              {/* Perfil Identificado */}
              <div className="rounded-[22px] bg-gradient-to-br from-[#0B5A2E] to-[#12924B] text-white p-5 space-y-3 shadow-md">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#DDF5E3]">
                  Seu Perfil Identificado
                </span>
                <h2 className="text-xl font-black flex items-center gap-2 text-white">
                  <span>{profileData.e}</span>
                  <span>{profileData.n}</span>
                </h2>
                <p className="text-xs text-[#DDF5E3] font-light leading-relaxed">
                  Sua trilha começa com pequenas ações que cabem na sua rotina e usam o que você já sabe fazer.
                </p>

                <div className="h-2 bg-[#2c8a58] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFC21A] w-[75%] rounded-full" />
                </div>

                <div className="space-y-2 pt-1 border-t border-[#2f9560]">
                  {profileData.t.map((stepTxt, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2.5 text-xs text-white">
                      <span className="font-black text-[#FFC21A] text-sm">{sIdx + 1}</span>
                      <span className="leading-snug">{stepTxt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideias para começar com até R$ 100 */}
              <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[22px] p-4.5 space-y-2.5 shadow-2xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0E7A3E]">
                    Para começar com até R$ 100
                  </span>
                  <h3 className="text-sm font-bold text-[var(--ink)]">
                    Ideias para o seu perfil
                  </h3>
                  <small className="text-[10.5px] text-[var(--text-muted)] font-light">
                    Custo inicial estimado, pode variar na sua região.
                  </small>
                </div>

                <div className="divide-y divide-[var(--hairline-soft)]">
                  {ideasList.map((idea, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--ink)]">{idea[0]}</span>
                      <em className="font-black text-[#0E7A3E] not-italic">{idea[1]}</em>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desafio dos 50 Depósitos (Calculadora Interativa) */}
              <div className="bg-[var(--canvas)] border border-[var(--hairline)] rounded-[22px] p-5 space-y-3 shadow-2xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0E7A3E]">
                    Calculadora de Desafio
                  </span>
                  <h3 className="text-base font-bold text-[var(--ink)]">
                    50 depósitos até a sua meta
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-light leading-relaxed">
                    Os valores são sorteados, para você guardar um pouco a cada vez. Toque em cada depósito feito.
                  </p>
                </div>

                {/* Chips de Seleção de Meta */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[500, 1000, 2000, 5000, 10000].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMeta(m);
                        setDeposits([]);
                        setDoneDeposits({});
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-colors cursor-pointer ${
                        meta === m
                          ? 'bg-[#FFC21A] text-[#0B2B1A] border-[#0E7A3E]'
                          : 'bg-[var(--canvas)] border-[var(--hairline)] text-[var(--ink)] hover:border-[var(--ink)]'
                      }`}
                    >
                      R$ {m.toLocaleString('pt-BR')}
                    </button>
                  ))}
                </div>

                {/* Slider de Capacidade Mensal */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold text-[var(--ink)]">
                    <span>Quanto consigo guardar por mês:</span>
                    <span className="text-[#0E7A3E]">R$ {mes},00</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="1000"
                    step="10"
                    value={mes}
                    onChange={(e) => setMes(Number(e.target.value))}
                    className="w-full accent-[#0E7A3E] cursor-pointer"
                  />
                  <div className="p-3 bg-[#F2FAE6] dark:bg-emerald-950/40 rounded-[14px] text-xs text-[#0B2B1A] dark:text-emerald-200 leading-snug">
                    Guardando R$ {mes} por mês, você chega a R$ {meta.toLocaleString('pt-BR')} em cerca de{' '}
                    <b>{prazoEstimado()}</b>.
                  </div>
                </div>

                <button
                  onClick={handleGenerateDeposits}
                  className="w-full py-3 px-4 rounded-[16px] bg-[#FFC21A] hover:bg-[#ffcd38] text-[#0B2B1A] font-black text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Gerar meus 50 depósitos
                </button>

                {/* Grade Interativa dos 50 Depósitos Gerados */}
                {deposits.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[var(--hairline)]">
                    <div className="flex items-center justify-between text-xs">
                      <span>Guardado até agora:</span>
                      <b className="text-[#0E7A3E] font-black text-sm">
                        R$ {totalSavedInChallenge.toLocaleString('pt-BR')} de R$ {meta.toLocaleString('pt-BR')}
                      </b>
                    </div>

                    <div className="h-2 bg-[#E3EFDF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0E7A3E] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (totalSavedInChallenge / meta) * 100)}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 pt-1">
                      {deposits.map((val, dIdx) => (
                        <button
                          key={dIdx}
                          onClick={() =>
                            setDoneDeposits((prev) => ({
                              ...prev,
                              [dIdx]: !prev[dIdx]
                            }))
                          }
                          className={`py-2 rounded-[12px] text-center text-xs font-black transition-colors cursor-pointer border ${
                            doneDeposits[dIdx]
                              ? 'bg-[#0E7A3E] text-white border-[#0E7A3E] line-through'
                              : 'bg-[var(--canvas)] text-[var(--ink)] border-[var(--hairline)] hover:border-[#0E7A3E]'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>

                    <p className="text-[10.5px] text-center text-[var(--text-muted)] font-light mt-1">
                      Toque em cada número após fazer o depósito. Somando os 50, você bate sua meta!
                    </p>
                  </div>
                )}
              </div>

              {/* Oferta Matadora Final */}
              <div className="rounded-[24px] bg-gradient-to-br from-[#0B5A2E] to-[#12924B] text-white p-5 space-y-3.5 shadow-lg">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#FFE27A]">
                  Seu Próximo Passo
                </span>
                <h2 className="text-xl font-black text-white leading-tight">
                  Lista de ideias de renda extra para começar com até R$ 100
                </h2>

                <ul className="text-xs text-[#E9FFE0] space-y-1.5 list-disc pl-4 leading-relaxed font-light">
                  <li>Ideias por categoria: comida, beleza, costura, revenda e serviços</li>
                  <li>Custo inicial de cada ideia e o que comprar primeiro</li>
                  <li>Como conseguir o primeiro cliente, passo a passo</li>
                  <li>Filtro por quanto você pode investir e quanto tempo tem</li>
                </ul>

                <div className="pt-1">
                  <div className="text-3xl font-black text-[#FFC21A] leading-tight">
                    <small className="text-xs text-[#E9FFE0] font-bold block">por apenas</small>
                    R$ 19,90
                  </div>
                  <small className="text-[11px] text-[#E9FFE0] font-light">
                    Pagamento único. Acesso imediato pelo celular.
                  </small>
                </div>

                <div className="p-3 bg-[#F2FAE6] text-[#0B2B1A] rounded-[14px] text-xs font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#0E7A3E] shrink-0" />
                  <span>Garantia de 7 dias: se não gostar, devolvemos seu dinheiro.</span>
                </div>

                <button
                  onClick={() => handleFinishDiagnosis(true)}
                  className="w-full py-4 px-4 rounded-[16px] bg-[#FFC21A] hover:bg-[#ffcd38] text-[#0B2B1A] font-black text-sm transition-transform active:scale-98 cursor-pointer shadow-md"
                >
                  Quero ver as ideias por R$ 19,90
                </button>

                <button
                  onClick={() => handleFinishDiagnosis(false)}
                  className="w-full text-center text-xs text-[#DDF5E3] hover:underline cursor-pointer py-1"
                >
                  Continuar no plano gratuito
                </button>
              </div>

              <p className="text-[10.5px] text-center text-[var(--text-muted)] leading-relaxed">
                Suas respostas são privadas. Os resultados variam de pessoa para pessoa e não há garantia de ganho. Este conteúdo é educativo e não tem ligação com o governo.
              </p>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};
