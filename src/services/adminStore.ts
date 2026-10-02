export interface SyncPayConfig {
  apiKey: string;
  partnerId: string;
  webhookUrl: string;
  sandboxMode: boolean;
  balance: number;
  lastChecked?: string;
  autoApproveInSandbox: boolean;
}

export interface SyncPayTransaction {
  identifier: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  offerTitle: string;
  status: 'pending' | 'completed' | 'cancelled';
  pixQrCode: string;
  pixCopyPaste: string;
  createdAt: string;
  paidAt?: string;
}

export interface CrmLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bfStatus: string;
  skills: string[];
  budget: number;
  availableTime: string;
  profileType: string;
  stage: 'iniciou_quiz' | 'concluiu_diagnostico' | 'gerou_pix' | 'virou_pro';
  createdAt: string;
  lastActiveAt: string;
}

export interface FunnelMetrics {
  visits: number;
  startedQuiz: number;
  completedQuiz: number;
  viewedOffer: number;
  generatedPix: number;
  convertedPro: number;
}

export interface OfferPlan {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  badge: string;
  description: string;
  features: string[];
  isDefault: boolean;
  featureToggles: Record<string, boolean>;
}

export interface AbFunnelTest {
  id: string;
  name: string;
  headline: string;
  badge: string;
  active: boolean;
  visitors: number;
  conversions: number;
  quizCode?: string;
  linkedOfferId?: string;
}

export interface HomeBannerConfig {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  buttonText: string;
  targetTab: string;
  gradient: string;
  active: boolean;
}

export interface AdminIdeaItem {
  id: string;
  title: string;
  category: string;
  emoji: string;
  minCost: number;
  maxCost: number;
  suggestedPrice: string;
  workFromHome: boolean;
  markdownContent: string;
  active: boolean;
  createdAt: string;
}

const ADMIN_STORAGE_KEY = 'renda_mais_admin_data_v1';

export interface AdminStoreData {
  syncPay: SyncPayConfig;
  transactions: SyncPayTransaction[];
  leads: CrmLead[];
  funnelMetrics: FunnelMetrics;
  offers: OfferPlan[];
  abTests: AbFunnelTest[];
  banners: HomeBannerConfig[];
  customIdeas: AdminIdeaItem[];
}

const DEFAULT_ADMIN_DATA: AdminStoreData = {
  syncPay: {
    apiKey: '',
    partnerId: '',
    webhookUrl: 'https://api.syncpayments.com.br/api/v1/webhooks',
    sandboxMode: true,
    balance: 1420.50,
    lastChecked: new Date().toLocaleTimeString('pt-BR'),
    autoApproveInSandbox: true
  },
  transactions: [
    {
      identifier: 'sp-tx-982141',
      customerName: 'Maria Silva Oliveira',
      customerEmail: 'maria.silva@email.com',
      customerPhone: '(11) 98412-3341',
      amount: 19.90,
      offerTitle: 'Kit Mãe Empreendedora PRO',
      status: 'completed',
      pixQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126330014br.gov.bcb.pix0111rendamais982141520400005303986540519.905802BR5920Renda+Mais+Edu+Ltda6009SAO+PAULO62070503***6304E8A2',
      pixCopyPaste: '00020126330014br.gov.bcb.pix0111rendamais982141520400005303986540519.905802BR5920Renda+Mais+Edu+Ltda6009SAO+PAULO62070503***6304E8A2',
      createdAt: 'Hoje às 14:22',
      paidAt: 'Hoje às 14:23'
    },
    {
      identifier: 'sp-tx-982140',
      customerName: 'Ana Cláudia Mendes',
      customerEmail: 'ana.mendes@gmail.com',
      customerPhone: '(21) 99182-4521',
      amount: 19.90,
      offerTitle: 'Kit Mãe Empreendedora PRO',
      status: 'completed',
      pixQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126330014br.gov.bcb.pix0111rendamais982140520400005303986540519.905802BR5920Renda+Mais+Edu+Ltda6009SAO+PAULO62070503***6304D1A9',
      pixCopyPaste: '00020126330014br.gov.bcb.pix0111rendamais982140520400005303986540519.905802BR5920Renda+Mais+Edu+Ltda6009SAO+PAULO62070503***6304D1A9',
      createdAt: 'Hoje às 11:05',
      paidAt: 'Hoje às 11:07'
    },
    {
      identifier: 'sp-tx-982139',
      customerName: 'Juliana Ferreira Santos',
      customerEmail: 'ju.ferreira@hotmail.com',
      customerPhone: '(31) 98772-9012',
      amount: 19.90,
      offerTitle: 'Kit Mãe Empreendedora PRO',
      status: 'pending',
      pixQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126330014br.gov.bcb.pix0111rendamais982139520400005303986540519.905802BR5920Renda+Mais+Edu+Ltda6009SAO+PAULO62070503***6304B72C',
      pixCopyPaste: '00020126330014br.gov.bcb.pix0111rendamais982139520400005303986540519.905802BR5920Renda+Mais+Edu+Ltda6009SAO+PAULO62070503***6304B72C',
      createdAt: 'Hoje às 10:14'
    },
    {
      identifier: 'sp-tx-982138',
      customerName: 'Carla Beatriz Souza',
      customerEmail: 'carla.bsouza@gmail.com',
      customerPhone: '(41) 99823-1189',
      amount: 6.90,
      offerTitle: 'Upgrade Gestão Financeira PRO',
      status: 'completed',
      pixQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126330014br.gov.bcb.pix0111rendamais982138520400005303986540506.905802BR5920Renda+Mais+Edu+Ltda6009SAO+PAULO62070503***6304A1F3',
      pixCopyPaste: '00020126330014br.gov.bcb.pix0111rendamais982138520400005303986540506.905802BR5920Renda+Mais+Edu+Ltda6009SAO+PAULO62070503***6304A1F3',
      createdAt: 'Ontem às 19:40',
      paidAt: 'Ontem às 19:41'
    }
  ],
  leads: [
    {
      id: 'lead-1',
      name: 'Maria Silva Oliveira',
      email: 'maria.silva@email.com',
      phone: '(11) 98412-3341',
      bfStatus: 'Sim, eu recebo',
      skills: ['Cozinhar e fazer doces', 'Vendas e revenda'],
      budget: 50,
      availableTime: '1 a 2 horas',
      profileType: 'Cozinha que rende',
      stage: 'virou_pro',
      createdAt: 'Hoje às 14:18',
      lastActiveAt: 'Hoje às 14:23'
    },
    {
      id: 'lead-2',
      name: 'Ana Cláudia Mendes',
      email: 'ana.mendes@gmail.com',
      phone: '(21) 99182-4521',
      bfStatus: 'Sim, eu recebo',
      skills: ['Beleza e cabelo'],
      budget: 100,
      availableTime: '2 a 4 horas',
      profileType: 'Beleza que rende',
      stage: 'virou_pro',
      createdAt: 'Hoje às 11:00',
      lastActiveAt: 'Hoje às 11:07'
    },
    {
      id: 'lead-3',
      name: 'Juliana Ferreira Santos',
      email: 'ju.ferreira@hotmail.com',
      phone: '(31) 98772-9012',
      bfStatus: 'Já recebi, quero me reerguer',
      skills: ['Costura e artesanato'],
      budget: 30,
      availableTime: '30 minutos',
      profileType: 'Artesã que rende',
      stage: 'gerou_pix',
      createdAt: 'Hoje às 10:10',
      lastActiveAt: 'Hoje às 10:14'
    },
    {
      id: 'lead-4',
      name: 'Camila Rodrigues Lima',
      email: 'camila.lima89@gmail.com',
      phone: '(85) 99234-8812',
      bfStatus: 'Sim, eu recebo',
      skills: ['Limpeza e cuidados'],
      budget: 30,
      availableTime: '1 a 2 horas',
      profileType: 'Cuidado que rende',
      stage: 'concluiu_diagnostico',
      createdAt: 'Hoje às 09:42',
      lastActiveAt: 'Hoje às 09:45'
    },
    {
      id: 'lead-5',
      name: 'Fernanda Martins',
      email: 'fmartins.contato@outlook.com',
      phone: '(71) 98112-7090',
      bfStatus: 'Ainda não recebo',
      skills: ['Vendas e revenda'],
      budget: 100,
      availableTime: '1 a 2 horas',
      profileType: 'Vendas que rendem',
      stage: 'iniciou_quiz',
      createdAt: 'Hoje às 08:30',
      lastActiveAt: 'Hoje às 08:31'
    }
  ],
  funnelMetrics: {
    visits: 1240,
    startedQuiz: 860,
    completedQuiz: 540,
    viewedOffer: 420,
    generatedPix: 184,
    convertedPro: 128
  },
  offers: [
    {
      id: 'offer-kit-pro',
      name: 'Kit Mãe Empreendedora PRO (Principal)',
      price: 19.90,
      originalPrice: 47.00,
      badge: 'Mais Vendido',
      description: 'Acesso vitalício completo às 50 ideias de renda, caderninho de vendas, gestão financeira e calculadora.',
      features: [
        '50 Ideias de Negócio Passo a Passo',
        'Lista de Compras e Fornecedores',
        'Caderninho de Vendas Diário',
        'Gestão Financeira com Gráfico de Linha',
        'Regra dos 2 Potes de Dinheiro',
        'Desafio dos 50 Depósitos',
        'Garantia Incondicional de 7 Dias'
      ],
      isDefault: true,
      featureToggles: {
        financeiro_grafico: true,
        caderninho_vendas: true,
        regra_dois_potes: true,
        calculadora_custo: true,
        todas_ideias: true,
        desafio_50_depositos: true,
        whatsapp_scripts: true,
        rotina_materna: true,
        suporte_vip: true
      }
    },
    {
      id: 'offer-upsell-fin',
      name: 'Upgrade Gestão Financeira PRO (Upsell)',
      price: 6.90,
      originalPrice: 29.90,
      badge: 'Oferta Especial',
      description: 'Desbloqueio focado no painel financeiro completo, caderninho de vendas diário e separação dos 2 potes.',
      features: [
        'Painel Financeiro Completo',
        'Caderninho de Entradas do Dia',
        'Gráficos de Lucro por Período',
        'Calculadora dos 2 Potes'
      ],
      isDefault: false,
      featureToggles: {
        financeiro_grafico: true,
        caderninho_vendas: true,
        regra_dois_potes: true,
        calculadora_custo: true,
        todas_ideias: false,
        desafio_50_depositos: false,
        whatsapp_scripts: false,
        rotina_materna: false,
        suporte_vip: false
      }
    }
  ],
  abTests: [
    {
      id: 'ab-1',
      name: 'Funil A: Lafi Storyboard Quiz (Atual)',
      headline: 'Um novo começo pode começar hoje.',
      badge: 'Ativo (Controle)',
      active: true,
      visitors: 620,
      conversions: 78
    },
    {
      id: 'ab-2',
      name: 'Funil B: Direto para a Dor da Mãe Solo',
      headline: 'Como sair do aperto com o Bolsa Família e R$ 50.',
      badge: 'Desafiante B',
      active: true,
      visitors: 620,
      conversions: 50
    }
  ],
  banners: [
    {
      id: 'b-1',
      title: 'Descubra sua Trilha de Renda Extra',
      subtitle: 'Diagnóstico gratuito em 2 minutos baseado nas suas habilidades ➔',
      badge: 'Novo Começo · 2 minutos',
      buttonText: 'Fazer Diagnóstico',
      targetTab: 'diagnostico',
      gradient: 'from-emerald-600 via-emerald-500 to-green-500',
      active: true
    },
    {
      id: 'b-2',
      title: 'Renda extra no seu ritmo.',
      subtitle: 'Transforme pequenas quantias e o Bolsa Família em um negócio próprio.',
      badge: 'Empreendedorismo Materno',
      buttonText: 'Ver ideias até R$ 50',
      targetTab: 'ideias',
      gradient: 'from-blue-600 via-indigo-600 to-blue-500',
      active: true
    }
  ],
  customIdeas: [
    {
      id: 'custom-idea-1',
      title: 'Pães Caseiros e Roscas Doces em Lote',
      category: 'comida',
      emoji: '🍞',
      minCost: 35,
      maxCost: 75,
      suggestedPrice: 'R$ 15,00 por rosca média',
      workFromHome: true,
      markdownContent: `# Pães Caseiros e Roscas Doces em Lote

## 💡 Sobre o Negócio
Produção artesanal na cozinha de casa aproveitando o forno comum. Pães quentinhos têm venda diária e clientes fiéis no bairro todo final de tarde.

### 🛒 Lista de Materiais Iniciais
- 5 kg de farinha de trigo de boa qualidade (R$ 22,00)
- Fermento biológico seco em sachês (R$ 8,00)
- Leite condensado e coco ralado para roscas doces (R$ 14,00)
- Sacos plásticos transparentes e laços de arame (R$ 12,00)
- **Investimento Total:** R$ 56,00

### 🚀 Como conseguir o 1º Cliente
Faça 1 fornada de teste na quinta-feira à tarde. Tire fotos apetitosas com o pão cortado e o vapor saindo. Mande no WhatsApp das vizinhas:
> *"Oi vizinha! Acabei de tirar rosca doce quentinha do forno, fofinha e cheirosa para o café da tarde. Tenho só 4 unidades disponíveis. Quer que eu separe uma para você?"*

### 👶 Dica de Conciliação Materna
Amasse a massa e deixe crescer enquanto as crianças almoçam ou fazem a lição. Asse enquanto elas dormem a soneca da tarde.`,
      active: true,
      createdAt: '02/10/2026'
    }
  ]
};

export const getAdminStore = (): AdminStoreData => {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_ADMIN_DATA, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error loading admin store:', e);
  }
  return DEFAULT_ADMIN_DATA;
};

export const saveAdminStore = (data: AdminStoreData): void => {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving admin store:', e);
  }
};
