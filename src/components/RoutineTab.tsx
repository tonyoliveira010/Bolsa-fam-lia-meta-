import React, { useState, useEffect } from 'react';
import {
  CalendarClock,
  CheckSquare,
  Clock,
  Heart,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Check,
  Trash2,
  Baby,
  GraduationCap,
  SunMedium,
  Briefcase,
  Calendar,
  X,
  ArrowRight,
  Bell,
  Package,
  Layers,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';
import { triggerCelebration } from '../utils/celebration';

interface RoutineTabProps {
  profile: UserProfile;
  onToggleRoutineCheck: (key: string) => void;
  isPro?: boolean;
  onOpenCheckout?: () => void;
}

interface RoutineBlockItem {
  id: string;
  period: string;
  title: string;
  description: string;
  focusType: string;
  tag: string;
  emoji: string;
  maternalTip: string;
  avoidDistraction: string;
  durationMinutes: number;
}

interface AppointmentItem {
  id: string;
  clientName: string;
  description: string;
  time: string;
  dayOfWeek: string;
  value?: number;
  done?: boolean;
}

type RoutineTabSection = 'blocos' | 'checklist' | 'negocio' | 'agendamentos';

const WEEKDAYS = [
  { key: 'seg', label: 'Seg', full: 'Segunda-feira' },
  { key: 'ter', label: 'Ter', full: 'Terça-feira' },
  { key: 'qua', label: 'Qua', full: 'Quarta-feira' },
  { key: 'qui', label: 'Qui', full: 'Quinta-feira' },
  { key: 'sex', label: 'Sex', full: 'Sexta-feira' },
  { key: 'sab', label: 'Sáb', full: 'Sábado' },
  { key: 'dom', label: 'Dom', full: 'Domingo' }
];

const DEFAULT_HABITS = [
  { key: 'status_whats', label: 'Postar foto com boa luz no status do WhatsApp' },
  { key: 'atender_whats', label: 'Responder mensagens e dúvidas de clientes' },
  { key: 'cofrinho_dia', label: 'Separar moedas ou R$ 5 para o cofrinho do negócio' },
  { key: 'anotar_venda', label: 'Anotar no caderninho o dinheiro que entrou hoje' },
  { key: 'tempo_filhos', label: '30 minutos de atenção 100% exclusiva aos filhos (sem celular)' }
];

const ROUTINE_MODES: Record<'escola' | 'bebe' | 'geral', { label: string; icon: React.ReactNode; blocks: RoutineBlockItem[] }> = {
  escola: {
    label: 'Filhos na escola',
    icon: <GraduationCap className="w-3.5 h-3.5" />,
    blocks: [
      {
        id: 'manha-escola',
        period: '07:00 - 08:00',
        title: 'Café & Ida para a escola',
        description: 'Organizar uniforme, lancheira e levar os pequenos com calma.',
        focusType: 'Família',
        tag: 'Prioridade',
        emoji: '🎒',
        maternalTip: 'Deixe roupas e lanches adiantados na noite anterior para não correr pela manhã.',
        avoidDistraction: 'Evite olhar WhatsApp comercial antes de sair de casa.',
        durationMinutes: 60
      },
      {
        id: 'foco-manha',
        period: '08:30 - 11:30',
        title: 'Bloco de Ouro: Produção total',
        description: 'Filhos na escola: silêncio em casa. Cozinhe, costure ou faça as artes sem interrupções.',
        focusType: 'Produção',
        tag: 'Mais Importante',
        emoji: '⚡',
        maternalTip: 'Coloque o celular no silencioso em outro cômodo para produzir o dobro.',
        avoidDistraction: 'Não pare para fazer faxina pesada neste horário precioso.',
        durationMinutes: 90
      },
      {
        id: 'retorno-almoco',
        period: '12:00 - 13:30',
        title: 'Almoço & Buscar crianças',
        description: 'Almoço em família e entregas rápidas na vizinhança ou condomínio.',
        focusType: 'Casa & Vendas',
        tag: 'Entregas',
        emoji: '🍱',
        maternalTip: 'Combine entregas no trajeto de volta da escola para economizar tempo.',
        avoidDistraction: 'Não atrase o horário de buscar os filhos na escola.',
        durationMinutes: 45
      },
      {
        id: 'whatsapp-tarde',
        period: '14:30 - 16:00',
        title: 'Atendimento & Redes sociais',
        description: 'Responder encomendas no celular enquanto os filhos fazem o dever de casa.',
        focusType: 'Celular',
        tag: 'Vendas',
        emoji: '💬',
        maternalTip: 'Fique na mesma mesa: você no atendimento e eles no dever escolar.',
        avoidDistraction: 'Evite vídeos curtos e redes sociais que roubam seu foco.',
        durationMinutes: 30
      },
      {
        id: 'fechamento-noite',
        period: '19:00 - 21:00',
        title: 'Jantar, historinha & Descanso',
        description: 'Banho, jantar, colocar os filhos para dormir e registrar o dinheiro do dia no app.',
        focusType: 'Família',
        tag: 'Desconexão',
        emoji: '🌙',
        maternalTip: 'Conexão profunda antes de dormir ajuda as crianças a dormirem a noite toda.',
        avoidDistraction: 'Não fique conferindo mensagens de clientes tarde da noite na cama.',
        durationMinutes: 45
      }
    ]
  },
  bebe: {
    label: 'Com bebê em casa',
    icon: <Baby className="w-3.5 h-3.5" />,
    blocks: [
      {
        id: 'acordar-bebe',
        period: '07:00 - 09:00',
        title: 'Mamada & Cuidados iniciais',
        description: 'Troca de fraldas, banho de sol do bebê e café da manhã nutritivo.',
        focusType: 'Bebê',
        tag: 'Cuidado',
        emoji: '🍼',
        maternalTip: 'Comece com carinho e luz natural no quarto para regular o relógio do bebê.',
        avoidDistraction: 'Não se preocupe com louça na pia antes de nutrir a si e ao bebê.',
        durationMinutes: 60
      },
      {
        id: 'soneca-1',
        period: '09:30 - 11:00',
        title: 'Primeira Soneca: Produção silenciosa',
        description: 'Bebê dormindo: prepare o material, embale produtos e envie orçamentos.',
        focusType: 'Produção',
        tag: 'Modo Soneca',
        emoji: '🤫',
        maternalTip: 'Tenha tudo engatilhado para começar no instante em que o bebê adormecer.',
        avoidDistraction: 'Não deite para mexer no celular sem produzir o que planejou.',
        durationMinutes: 45
      },
      {
        id: 'colo-almoco',
        period: '11:30 - 13:30',
        title: 'Alimentação & Brincadeiras',
        description: 'Almoço da família e estímulos com brinquedos no chão.',
        focusType: 'Família',
        tag: 'Presença',
        emoji: '🧸',
        maternalTip: 'Coloque um tapete no chão e brinque junto. O bebê ganha segurança.',
        avoidDistraction: 'Deixe o celular longe para olhar nos olhos da criança.',
        durationMinutes: 60
      },
      {
        id: 'soneca-2',
        period: '14:00 - 15:30',
        title: 'Segunda Soneca: Vendas no WhatsApp',
        description: 'Poste nos status, responda clientes e envie pedidos para a semana.',
        focusType: 'Celular',
        tag: 'Vendas',
        emoji: '📱',
        maternalTip: 'Use mensagens com áudios curtos e gentis; pessoas compram de quem confiam.',
        avoidDistraction: 'Não misture conversas de grupos de fofoca com atendimento.',
        durationMinutes: 45
      },
      {
        id: 'noite-bebe',
        period: '19:30 - 21:30',
        title: 'Sono noturno & Caderninho',
        description: 'Bebê dormindo: anote as vendas do dia e deixe o material de amanhã separado.',
        focusType: 'Fechamento',
        tag: 'Conclusão',
        emoji: '⭐',
        maternalTip: 'Banho morno e quarto escuro para um sono tranquilo.',
        avoidDistraction: 'Não tome café ou energéticos perto da hora de dormir.',
        durationMinutes: 30
      }
    ]
  },
  geral: {
    label: 'Rotina flexível',
    icon: <SunMedium className="w-3.5 h-3.5" />,
    blocks: [
      {
        id: 'manha-geral',
        period: '08:00 - 10:00',
        title: 'Acolhimento & Café da família',
        description: 'Começar o dia sem pressa, cuidar da casa e organizar as prioridades.',
        focusType: 'Casa',
        tag: 'Acolhimento',
        emoji: '☕',
        maternalTip: 'Defina apenas 3 prioridades essenciais para não se sobrecarregar.',
        avoidDistraction: 'Evite acordar já respondendo cobranças no celular.',
        durationMinutes: 45
      },
      {
        id: 'producao-geral',
        period: '10:00 - 12:00',
        title: 'Bloco de 2 horas de produção',
        description: 'Foco no trabalho manual ou na cozinha enquanto as crianças se divertem.',
        focusType: 'Produção',
        tag: 'Foco Total',
        emoji: '🛠️',
        maternalTip: 'Dê brinquedos ou massinha para eles brincarem perto de você na mesa.',
        avoidDistraction: 'Evite interrupções que não sejam das crianças.',
        durationMinutes: 90
      },
      {
        id: 'tarde-geral',
        period: '14:00 - 16:30',
        title: 'WhatsApp, fotos & Encomendas',
        description: 'Tirar fotos com boa luz e postar para vizinhos e conhecidas.',
        focusType: 'Vendas',
        tag: 'Divulgação',
        emoji: '📸',
        maternalTip: 'Aproveite a luz natural da janela para fotos muito mais apetitosas.',
        avoidDistraction: 'Não poste fotos escuras ou desorganizadas.',
        durationMinutes: 45
      },
      {
        id: 'noite-geral',
        period: '18:30 - 20:30',
        title: 'Tempo com os filhos & Cofrinho',
        description: 'Jantar em família, 30 minutos de brincadeira e guardar moedas no cofrinho.',
        focusType: 'Família',
        tag: 'Família',
        emoji: '❤️',
        maternalTip: 'Conte para seus filhos que você está construindo um futuro melhor por eles.',
        avoidDistraction: 'Deixe o celular em outro cômodo durante o jantar.',
        durationMinutes: 60
      }
    ]
  }
};

export const RoutineTab: React.FC<RoutineTabProps> = ({ profile, onToggleRoutineCheck }) => {
  const [activeSection, setActiveSection] = useState<RoutineTabSection>('blocos');
  const [routineMode, setRoutineMode] = useState<'escola' | 'bebe' | 'geral'>('escola');
  const [selectedDay, setSelectedDay] = useState('seg');

  // Modals
  const [showCreationMenuModal, setShowCreationMenuModal] = useState(false);
  const [creationActionType, setCreationActionType] = useState<string | null>(null);
  const [selectedBlockDetail, setSelectedBlockDetail] = useState<RoutineBlockItem | null>(null);

  // Focus Timer States ("Modo Soneca / Produção")
  const [timerSeconds, setTimerSeconds] = useState(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [initialTimerMinutes, setInitialTimerMinutes] = useState(45);

  // Custom Habits & Weekly Checklists
  const [customHabits, setCustomHabits] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('renda_mais_custom_habits');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Appointments / Agendamentos
  const [appointments, setAppointments] = useState<AppointmentItem[]>(() => {
    try {
      const saved = localStorage.getItem('renda_mais_appointments');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          clientName: 'Dona Maria (Vizinha)',
          description: '3 potes de brigadeiro gourmet',
          time: '12:15',
          dayOfWeek: 'seg',
          value: 21,
          done: true
        },
        {
          id: '2',
          clientName: 'Carla (Mãe da creche)',
          description: 'Ajuste de bainha em 2 calças jeans',
          time: '16:00',
          dayOfWeek: 'qua',
          value: 36,
          done: false
        }
      ];
    } catch {
      return [];
    }
  });

  // Creation form states
  const [newCustomTaskText, setNewCustomTaskText] = useState('');
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockTime, setNewBlockTime] = useState('');
  const [newBlockDesc, setNewBlockDesc] = useState('');
  const [newAppointName, setNewAppointName] = useState('');
  const [newAppointDesc, setNewAppointDesc] = useState('');
  const [newAppointTime, setNewAppointTime] = useState('');
  const [newAppointDay, setNewAppointDay] = useState('seg');
  const [newAppointVal, setNewAppointVal] = useState('');

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      triggerCelebration(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const setTimerPreset = (mins: number) => {
    setIsTimerRunning(false);
    setInitialTimerMinutes(mins);
    setTimerSeconds(mins * 60);
  };

  const startTimerForBlock = (mins: number) => {
    setTimerPreset(mins);
    setIsTimerRunning(true);
    setSelectedBlockDetail(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTaskText.trim()) return;
    const updated = [...customHabits, newCustomTaskText.trim()];
    setCustomHabits(updated);
    try {
      localStorage.setItem('renda_mais_custom_habits', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setNewCustomTaskText('');
    setCreationActionType(null);
    setShowCreationMenuModal(false);
  };

  const handleDeleteCustomHabit = (idx: number) => {
    const updated = customHabits.filter((_, i) => i !== idx);
    setCustomHabits(updated);
    try {
      localStorage.setItem('renda_mais_custom_habits', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppointName.trim()) return;
    const newItem: AppointmentItem = {
      id: Date.now().toString(),
      clientName: newAppointName.trim(),
      description: newAppointDesc.trim(),
      time: newAppointTime.trim() || '14:00',
      dayOfWeek: newAppointDay,
      value: Number(newAppointVal) || 0,
      done: false
    };
    const updated = [newItem, ...appointments];
    setAppointments(updated);
    try {
      localStorage.setItem('renda_mais_appointments', JSON.stringify(updated));
    } catch {
      // ignore
    }
    setNewAppointName('');
    setNewAppointDesc('');
    setNewAppointTime('');
    setNewAppointVal('');
    setCreationActionType(null);
    setShowCreationMenuModal(false);
    setActiveSection('agendamentos');
  };

  const toggleAppointmentDone = (id: string) => {
    const updated = appointments.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    setAppointments(updated);
    try {
      localStorage.setItem('renda_mais_appointments', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter((item) => item.id !== id);
    setAppointments(updated);
    try {
      localStorage.setItem('renda_mais_appointments', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Timer format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate daily habits completed
  const allHabitKeys = [
    ...DEFAULT_HABITS.map((h) => `${selectedDay}_${h.key}`),
    ...customHabits.map((_, i) => `${selectedDay}_custom_${i}`)
  ];
  const completedHabitsCount = allHabitKeys.filter((k) => profile.routineChecks[k]).length;
  const totalHabitsCount = allHabitKeys.length;
  const habitsProgressPercent = totalHabitsCount > 0 ? Math.round((completedHabitsCount / totalHabitsCount) * 100) : 0;

  const currentModeData = ROUTINE_MODES[routineMode];

  return (
    <div className="space-y-6">
      {!isPro && (
        <div className="bg-gradient-to-br from-[#0066ff]/15 via-amber-500/10 to-transparent border-2 border-[#0066ff] rounded-[24px] p-5 text-center space-y-3 shadow-md">
          <div className="w-11 h-11 rounded-full bg-[#0066ff] text-white flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066ff] block">
              Recurso Exclusivo · Kit Mãe Empreendedora
            </span>
            <h3 className="text-base font-extrabold text-[#141414] mt-0.5">
              Desbloqueie a Rotina com os Filhos
            </h3>
            <p className="text-xs text-[#707070] font-light mt-1 max-w-sm mx-auto leading-relaxed">
              Concilie produção, vendas e maternidade real com blocos de tempo flexíveis, temporizador de foco e agendamentos.
            </p>
          </div>
          <button
            onClick={onOpenCheckout}
            className="btn-primary text-xs py-3 px-6 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-lg bg-[#0066ff] hover:bg-blue-600"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Desbloquear Rotina com os Filhos por R$ 6,90</span>
          </button>
        </div>
      )}

      <div className={!isPro ? 'pointer-events-none opacity-85 select-none space-y-6' : 'space-y-6'}>
      {/* 1. Header with Title + "+ Criar" Button at top right */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#141414] tracking-tight flex items-center gap-2">
            Rotina com os filhos.
          </h1>
          <p className="text-xs font-light text-[#707070] mt-0.5 leading-[1.38]">
            Organize o trabalho no ritmo das crianças com blocos flexíveis e sem culpa materna.
          </p>
        </div>

        {/* Botão de criar no canto superior direito */}
        <button
          onClick={() => {
            setCreationActionType(null);
            setShowCreationMenuModal(true);
          }}
          className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Criar</span>
        </button>
      </div>

      {/* 2. Temporizador de Foco Materno ("Modo Soneca / Produção") FICA ACIMA */}
      <div className="bg-[#141414] text-white rounded-[24px] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#adadad]">
              Temporizador de Foco Materno
            </span>
          </div>
          <span className="bg-[#262626] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
            {initialTimerMinutes} min
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
          <div>
            <div className="text-4xl font-bold tracking-tight text-white font-mono">
              {formatTime(timerSeconds)}
            </div>
            <p className="text-xs font-light text-[#adadad] mt-1">
              Produção focada sem distrações no celular enquanto os pequenos descansam.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="w-12 h-12 rounded-full bg-white text-[#141414] flex items-center justify-center font-bold hover:scale-105 transition-transform cursor-pointer shadow-xs"
              title={isTimerRunning ? 'Pausar' : 'Iniciar'}
            >
              {isTimerRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(initialTimerMinutes * 60);
              }}
              className="w-10 h-10 rounded-full bg-[#262626] text-white flex items-center justify-center hover:bg-[#333] transition-colors cursor-pointer"
              title="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex gap-2 pt-1 border-t border-[#262626]">
          {[
            { label: '20 min (Atenção express)', mins: 20 },
            { label: '45 min (Soneca do bebê)', mins: 45 },
            { label: '90 min (Crianças na escola)', mins: 90 }
          ].map((preset) => (
            <button
              key={preset.mins}
              onClick={() => setTimerPreset(preset.mins)}
              className={`flex-1 py-1.5 px-1.5 text-[10px] font-semibold rounded-full transition-colors cursor-pointer text-center truncate ${
                initialTimerMinutes === preset.mins
                  ? 'bg-white text-[#141414]'
                  : 'bg-[#262626] text-[#adadad] hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Navegação por Tabs da Rotina (Estilo Mobbin Stadium Pill) */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
        {[
          { id: 'blocos', label: 'Blocos do Dia', icon: <Clock className="w-3.5 h-3.5" /> },
          { id: 'checklist', label: 'Checklist Semanal', icon: <CheckSquare className="w-3.5 h-3.5" /> },
          { id: 'negocio', label: 'Rotina do Negócio', icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: 'agendamentos', label: 'Agendamentos', icon: <Calendar className="w-3.5 h-3.5" />, badge: appointments.filter(a => !a.done).length }
        ].map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as RoutineTabSection)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#141414] text-white shadow-xs'
                  : 'bg-white text-[#707070] border border-[#e0e0e0] hover:text-[#141414]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="w-4 h-4 bg-[#0066ff] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: BLOCOS SUGERIDOS PARA HOJE                                         */}
      {/* ========================================================================= */}
      {activeSection === 'blocos' && (
        <div className="space-y-4">
          {/* Seletor: Sua fase atual com as crianças */}
          <div>
            <span className="text-[11px] font-semibold text-[#141414] uppercase tracking-wider block mb-2">
              Sua fase atual com as crianças:
            </span>
            <div className="bg-[#f3f3f3] p-1 rounded-full flex gap-1">
              {(Object.keys(ROUTINE_MODES) as Array<'escola' | 'bebe' | 'geral'>).map((key) => {
                const isSelected = routineMode === key;
                const item = ROUTINE_MODES[key];
                return (
                  <button
                    key={key}
                    onClick={() => setRoutineMode(key)}
                    className={`flex-1 py-2 px-2 text-[11px] font-semibold rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#141414] text-white shadow-xs'
                        : 'text-[#707070] hover:text-[#141414]'
                    }`}
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista de Blocos: Ao clicar abre o modal de detalhes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#141414] uppercase tracking-wider block">
                Blocos sugeridos para hoje ({currentModeData.label}):
              </span>
              <span className="text-[10px] text-[#707070] font-light">Toque no card para ver detalhes</span>
            </div>

            <div className="space-y-2.5">
              {currentModeData.blocks.map((block) => (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockDetail(block)}
                  className="bg-[#ffffff] border border-[#f0f0f0] hover:border-[#141414] rounded-[20px] p-4 space-y-2 transition-colors cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-[#f3f3f3] flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                        {block.emoji}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-[#141414] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#707070]" />
                          {block.period}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-[#141414] bg-[#f3f3f3] px-2.5 py-0.5 rounded-full">
                      {block.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#141414]">
                      {block.title}.
                    </h3>
                    <p className="text-xs font-light text-[#707070] leading-[1.43] mt-0.5">
                      {block.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#f0f0f0] flex items-center justify-between text-[11px] font-medium text-[#0066ff]">
                    <span>Ver passo a passo e dicas maternas</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: CHECKLIST DIÁRIO & SEMANAL                                         */}
      {/* ========================================================================= */}
      {activeSection === 'checklist' && (
        <div className="space-y-4">
          {/* Seletor de dia da semana (Seg - Dom) */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-4 space-y-3">
            <span className="text-xs font-bold text-[#141414] uppercase tracking-wider block">
              Selecione o dia da semana:
            </span>

            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((day) => {
                const isSelected = selectedDay === day.key;
                return (
                  <button
                    key={day.key}
                    onClick={() => setSelectedDay(day.key)}
                    className={`py-2 text-center rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#141414] text-white'
                        : 'bg-[#f3f3f3] text-[#707070] hover:text-[#141414]'
                    }`}
                  >
                    <span>{day.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-[#707070]">
              <span className="font-semibold text-[#141414]">
                {WEEKDAYS.find(w => w.key === selectedDay)?.full}
              </span>
              <span>
                {completedHabitsCount} de {totalHabitsCount} hábitos concluídos
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 bg-[#f0f0f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-400 rounded-full transition-all duration-500"
                style={{ width: `${habitsProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Lista de Hábitos do Dia Selecionado */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#141414] uppercase tracking-wider">
                Checklist de {WEEKDAYS.find(w => w.key === selectedDay)?.label}
              </h3>
              <span className="text-[10px] text-[#707070] font-light">Toque para marcar</span>
            </div>

            <div className="space-y-2">
              {DEFAULT_HABITS.map((habit) => {
                const habitKey = `${selectedDay}_${habit.key}`;
                const isChecked = !!profile.routineChecks[habitKey];
                return (
                  <button
                    key={habitKey}
                    onClick={() => onToggleRoutineCheck(habitKey)}
                    className={`w-full p-3 rounded-[16px] border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                      isChecked
                        ? 'bg-[#f3f3f3] border-[#e0e0e0] text-[#141414]'
                        : 'bg-[#ffffff] border-[#f0f0f0] text-[#141414] hover:bg-[#fafafa]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                        isChecked ? 'bg-[#141414] text-white' : 'border border-[#e0e0e0] bg-white'
                      }`}
                    >
                      {isChecked ? '✓' : ''}
                    </div>
                    <span className={`text-xs font-medium leading-tight ${isChecked ? 'line-through text-[#707070]' : ''}`}>
                      {habit.label}
                    </span>
                  </button>
                );
              })}

              {/* Custom Habits for the week */}
              {customHabits.map((item, idx) => {
                const customKey = `${selectedDay}_custom_${idx}`;
                const isChecked = !!profile.routineChecks[customKey];
                return (
                  <div
                    key={customKey}
                    className={`w-full p-3 rounded-[16px] border flex items-center justify-between gap-3 transition-colors ${
                      isChecked
                        ? 'bg-[#f3f3f3] border-[#e0e0e0] text-[#141414]'
                        : 'bg-[#ffffff] border-[#f0f0f0] text-[#141414]'
                    }`}
                  >
                    <button
                      onClick={() => onToggleRoutineCheck(customKey)}
                      className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                          isChecked ? 'bg-[#141414] text-white' : 'border border-[#e0e0e0] bg-white'
                        }`}
                      >
                        {isChecked ? '✓' : ''}
                      </div>
                      <span className={`text-xs font-medium leading-tight ${isChecked ? 'line-through text-[#707070]' : ''}`}>
                        {item}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteCustomHabit(idx)}
                      className="text-[#adadad] hover:text-[#141414] p-1 cursor-pointer"
                      title="Excluir tarefa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setCreationActionType('tarefa');
                setShowCreationMenuModal(true);
              }}
              className="w-full py-2.5 text-xs font-semibold text-[#707070] hover:text-[#141414] bg-[#f3f3f3] hover:bg-[#e0e0e0] rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Adicionar tarefa neste dia
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 3: ROTINA DO MEU NEGÓCIO                                              */}
      {/* ========================================================================= */}
      {activeSection === 'negocio' && (
        <div className="space-y-4">
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-[#141414] flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                Cronograma Semanal do Negócio Materno
              </h2>
              <p className="text-xs font-light text-[#707070] mt-1 leading-[1.38]">
                Estruture suas atividades para não ter que cozinhar, vender e comprar no mesmo dia.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-[#f3f3f3] rounded-[18px] flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-[#141414] shrink-0">
                  Seg
                </div>
                <div>
                  <b className="text-xs font-bold text-[#141414] block">Dia de Compras & Planejamento</b>
                  <p className="text-xs font-light text-[#707070] leading-snug mt-0.5">
                    Compre ingredientes no atacado e defina o cardápio da semana. Você economiza até 30% comparado a comprar picado todo dia.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-[#f3f3f3] rounded-[18px] flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-[#141414] shrink-0">
                  Ter-Qui
                </div>
                <div>
                  <b className="text-xs font-bold text-[#141414] block">Produção Concentrada em Lotes</b>
                  <p className="text-xs font-light text-[#707070] leading-snug mt-0.5">
                    Produza receitas dobradas na soneca ou enquanto as crianças estão na escola. Embale e deixe o estoque pronto.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-[#f3f3f3] rounded-[18px] flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-[#141414] shrink-0">
                  Sex
                </div>
                <div>
                  <b className="text-xs font-bold text-[#141414] block">Entregas & Fechamento de Caixa</b>
                  <p className="text-xs font-light text-[#707070] leading-snug mt-0.5">
                    Faça as entregas combinadas, separe o lucro no cofrinho e abasteça o capital de giro para a próxima semana.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-[#f3f3f3] rounded-[18px] flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-[#141414] shrink-0">
                  Sáb-Dom
                </div>
                <div>
                  <b className="text-xs font-bold text-[#141414] block">Família, Descanso & Filhos</b>
                  <p className="text-xs font-light text-[#707070] leading-snug mt-0.5">
                    Recarregue suas energias. A mãe descansada é mais paciente e tem ideias mais criativas para lucrar na semana seguinte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 4: AGENDAMENTOS & ENCOMENDAS                                          */}
      {/* ========================================================================= */}
      {activeSection === 'agendamentos' && (
        <div className="space-y-4">
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#141414] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Agendamentos & Encomendas
                </h2>
                <span className="text-[11px] text-[#707070] font-light">
                  Não perca prazos nem deixe clientes esperando
                </span>
              </div>

              <button
                onClick={() => {
                  setCreationActionType('agendamento');
                  setShowCreationMenuModal(true);
                }}
                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Novo
              </button>
            </div>

            {/* Appointments List */}
            <div className="space-y-2">
              {appointments.length > 0 ? (
                appointments.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-[18px] border transition-colors flex items-center justify-between gap-3 ${
                      item.done
                        ? 'bg-[#f3f3f3] border-[#e0e0e0] opacity-80'
                        : 'bg-white border-[#f0f0f0] hover:border-[#141414]'
                    }`}
                  >
                    <button
                      onClick={() => toggleAppointmentDone(item.id)}
                      className="flex items-start gap-3 flex-1 text-left cursor-pointer"
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 transition-colors ${
                          item.done ? 'bg-[#141414] text-white' : 'border border-[#e0e0e0] bg-white'
                        }`}
                      >
                        {item.done ? '✓' : ''}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#141414] bg-[#f3f3f3] px-2 py-0.2 rounded-md">
                            {item.dayOfWeek.toUpperCase()} às {item.time}
                          </span>
                          <b className={`text-xs font-bold text-[#141414] truncate ${item.done ? 'line-through text-[#707070]' : ''}`}>
                            {item.clientName}
                          </b>
                        </div>
                        <p className={`text-xs font-light text-[#707070] mt-0.5 truncate ${item.done ? 'line-through' : ''}`}>
                          {item.description}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.value ? (
                        <span className="text-xs font-bold text-[#141414]">
                          R$ {item.value.toFixed(2).replace('.', ',')}
                        </span>
                      ) : null}
                      <button
                        onClick={() => deleteAppointment(item.id)}
                        className="text-[#adadad] hover:text-[#141414] p-1 cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-[#707070] bg-[#f3f3f3] rounded-[18px]">
                  Nenhum agendamento pendente. Toque em "+ Novo" para anotar encomendas e horários de clientes.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. COMPONENTE FIXO NO RODAPÉ INDEPENDENTE DAS TABS                         */}
      {/* ========================================================================= */}
      <div className="bg-[#f3f3f3] rounded-[24px] p-5 space-y-2">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-[#141414]" />
          <h3 className="text-xs font-bold text-[#141414] uppercase tracking-wider">
            A regra de ouro da mãe empreendedora.
          </h3>
        </div>
        <p className="text-xs font-light text-[#707070] leading-[1.43]">
          Você não precisa de 8 horas seguidas. 90 minutos de dedicação focada por dia já geram renda suficiente para transformar a realidade da sua família. Nos dias em que os filhos precisarem mais do seu colo, abrace sem culpa — seu negócio pode esperar, a infância deles não volta!
        </p>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: DETALHES DO BLOCO SELECIONADO                                      */}
      {/* ========================================================================= */}
      {selectedBlockDetail && (
        <div
          className="fixed inset-0 z-50 bg-[#141414]/40 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedBlockDetail(null);
          }}
        >
          <div className="bg-white border border-[#e0e0e0] rounded-[24px] p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-[#f3f3f3] squircle flex items-center justify-center text-2xl">
                {selectedBlockDetail.emoji}
              </div>
              <button
                onClick={() => setSelectedBlockDetail(null)}
                className="text-[#707070] hover:text-[#141414] p-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-[#0066ff] bg-[#f3f3f3] px-2 py-0.5 rounded-full">
                  {selectedBlockDetail.focusType}
                </span>
                <span className="text-xs font-bold text-[#141414] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#707070]" />
                  {selectedBlockDetail.period}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#141414] leading-tight">
                {selectedBlockDetail.title}.
              </h3>
              <p className="text-xs font-light text-[#707070] mt-1 leading-[1.43]">
                {selectedBlockDetail.description}
              </p>
            </div>

            {/* Dicas Maternas Práticas */}
            <div className="bg-[#f3f3f3] p-4 rounded-[18px] space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#141414] shrink-0 mt-0.5" />
                <div>
                  <b className="text-[#141414] block">Dica de conciliação materna:</b>
                  <span className="text-[#707070] font-light leading-snug mt-0.5 block">
                    {selectedBlockDetail.maternalTip}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 border-t border-[#e0e0e0]">
                <span className="text-sm shrink-0">⚠️</span>
                <div>
                  <b className="text-[#141414] block">O que evitar neste bloco:</b>
                  <span className="text-[#707070] font-light leading-snug mt-0.5 block">
                    {selectedBlockDetail.avoidDistraction}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => startTimerForBlock(selectedBlockDetail.durationMinutes)}
                className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Iniciar Temporizador ({selectedBlockDetail.durationMinutes} min)
              </button>
              <button
                onClick={() => setSelectedBlockDetail(null)}
                className="w-full btn-outline text-xs py-2.5"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MENU DE CRIAÇÃO (ABERTO AO CLICAR NO BOTÃO SUPERIOR DIREITO)       */}
      {/* ========================================================================= */}
      {showCreationMenuModal && (
        <div
          className="fixed inset-0 z-50 bg-[#141414]/40 flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreationMenuModal(false);
          }}
        >
          <div className="bg-white border border-[#e0e0e0] rounded-[24px] p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#141414]">
                  O que você deseja criar?
                </h3>
                <span className="text-xs font-light text-[#707070]">
                  Escolha uma ferramenta de rotina
                </span>
              </div>
              <button
                onClick={() => setShowCreationMenuModal(false)}
                className="text-[#707070] hover:text-[#141414] p-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu de Cards de Funções de Criação */}
            {!creationActionType && (
              <div className="space-y-2.5">
                <button
                  onClick={() => setCreationActionType('tarefa')}
                  className="w-full p-3.5 rounded-[18px] bg-[#f3f3f3] hover:bg-[#eaeaea] text-left transition-colors flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg shrink-0">
                    <CheckSquare className="w-5 h-5 text-[#141414]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <b className="text-xs font-bold text-[#141414] block">Nova Tarefa / Hábito</b>
                    <span className="text-[11px] text-[#707070] font-light leading-snug">
                      Adicione uma meta diária no seu checklist
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#707070] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setCreationActionType('agendamento')}
                  className="w-full p-3.5 rounded-[18px] bg-[#f3f3f3] hover:bg-[#eaeaea] text-left transition-colors flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg shrink-0">
                    <Calendar className="w-5 h-5 text-[#141414]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <b className="text-xs font-bold text-[#141414] block">Agendamento de Encomenda</b>
                    <span className="text-[11px] text-[#707070] font-light leading-snug">
                      Marque data e hora de entrega para cliente
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#707070] group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setCreationActionType('temporizador')}
                  className="w-full p-3.5 rounded-[18px] bg-[#f3f3f3] hover:bg-[#eaeaea] text-left transition-colors flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg shrink-0">
                    <Clock className="w-5 h-5 text-[#141414]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <b className="text-xs font-bold text-[#141414] block">Timer de Foco Rápido</b>
                    <span className="text-[11px] text-[#707070] font-light leading-snug">
                      Defina um tempo para produzir sem interrupções
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#707070] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Formulário: Nova Tarefa */}
            {creationActionType === 'tarefa' && (
              <form onSubmit={handleAddCustomHabit} className="space-y-3">
                <span className="text-xs font-bold text-[#141414] block">
                  Qual hábito ou tarefa você quer adicionar?
                </span>
                <input
                  type="text"
                  value={newCustomTaskText}
                  onChange={(e) => setNewCustomTaskText(e.target.value)}
                  placeholder="Ex: Comprar ingredientes no atacado..."
                  className="w-full mobbin-input text-xs"
                  autoFocus
                  required
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCreationActionType(null)}
                    className="flex-1 btn-outline text-xs py-2.5"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-xs py-2.5"
                  >
                    Salvar Tarefa
                  </button>
                </div>
              </form>
            )}

            {/* Formulário: Novo Agendamento */}
            {creationActionType === 'agendamento' && (
              <form onSubmit={handleAddAppointment} className="space-y-3">
                <span className="text-xs font-bold text-[#141414] block">
                  Dados do Agendamento / Encomenda:
                </span>
                <div>
                  <label className="text-[11px] font-semibold text-[#707070] block mb-1">Nome da cliente</label>
                  <input
                    type="text"
                    value={newAppointName}
                    onChange={(e) => setNewAppointName(e.target.value)}
                    placeholder="Ex: Ana Paula (vizinha)"
                    className="w-full mobbin-input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#707070] block mb-1">O que vai entregar / fazer?</label>
                  <input
                    type="text"
                    value={newAppointDesc}
                    onChange={(e) => setNewAppointDesc(e.target.value)}
                    placeholder="Ex: 5 potes de brigadeiro"
                    className="w-full mobbin-input text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-[#707070] block mb-1">Dia da semana</label>
                    <select
                      value={newAppointDay}
                      onChange={(e) => setNewAppointDay(e.target.value)}
                      className="w-full mobbin-input text-xs bg-[#f0f0f0]"
                    >
                      {WEEKDAYS.map((w) => (
                        <option key={w.key} value={w.key}>{w.full}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#707070] block mb-1">Horário</label>
                    <input
                      type="text"
                      value={newAppointTime}
                      onChange={(e) => setNewAppointTime(e.target.value)}
                      placeholder="Ex: 14:30"
                      className="w-full mobbin-input text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#707070] block mb-1">Valor cobrado (R$, opcional)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newAppointVal}
                    onChange={(e) => setNewAppointVal(e.target.value)}
                    placeholder="35,00"
                    className="w-full mobbin-input text-xs font-bold"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCreationActionType(null)}
                    className="flex-1 btn-outline text-xs py-2.5"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-xs py-2.5"
                  >
                    Salvar Encomenda
                  </button>
                </div>
              </form>
            )}

            {/* Ajuste de Timer */}
            {creationActionType === 'temporizador' && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#141414] block">
                  Escolha o tempo de foco que você tem agora:
                </span>
                <div className="space-y-2">
                  {[
                    { label: '15 minutos (Ação rápida / WhatsApp)', mins: 15 },
                    { label: '30 minutos (Produção de 1 receita)', mins: 30 },
                    { label: '60 minutos (Bloco de foco na soneca)', mins: 60 },
                    { label: '90 minutos (Crianças na escola)', mins: 90 }
                  ].map((p) => (
                    <button
                      key={p.mins}
                      onClick={() => {
                        setTimerPreset(p.mins);
                        setIsTimerRunning(true);
                        setShowCreationMenuModal(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full p-3 rounded-[16px] bg-[#f3f3f3] hover:bg-[#141414] hover:text-white text-xs font-semibold text-left transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{p.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setCreationActionType(null)}
                  className="w-full btn-outline text-xs py-2"
                >
                  Voltar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
