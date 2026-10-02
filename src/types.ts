export type CategoryId = 'todas' | 'comida' | 'beleza' | 'costura' | 'revenda' | 'servicos' | 'artesanato' | 'digital';

export interface BusinessIdea {
  id: string;
  title: string;
  emoji: string;
  category: CategoryId;
  minCost: number;
  maxCost: number;
  shoppingList: string[];
  suggestedPrice: string;
  firstClientMethod: string;
  commonMistake: string;
  motherRoutineTip: string;
  whatsappScript: string;
  estimatedProfitMonthly: string;
  workFromHome: boolean;
  requiresCookingOrTool: boolean;
  timeNeededDaily: string;
  salesSimulator?: string;
}

export interface DepositGoal {
  id?: string;
  title?: string;
  emoji?: string;
  targetAmount: number;
  monthlySavings: number;
  deposits: number[];
  done: Record<number, boolean>;
  createdAt?: string;
  completedAt?: string;
}

export interface GoalCardItem {
  id: string;
  title: string;
  targetAmount: number;
  monthlySavings: number;
  emoji: string;
  description: string;
  category: string;
  idealFor: string;
}

export interface SaleRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  cost: number;
}

export type PotType = 'negocio' | 'casa' | 'investimentos' | string;
export type TransactionType = 'receita' | 'despesa' | 'investimento';

export interface CustomPot {
  id: string;
  name: string;
  emoji: string;
  color: 'emerald' | 'amber' | 'purple' | 'blue' | 'rose' | 'teal';
  targetAmount?: number;
  description?: string;
  isDefault?: boolean;
}

export interface PotTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  pot: string;
  category?: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  whatsapp?: string;
  password?: string;
  plan?: 'free' | 'pro';
  planPurchasedAt?: string;
  childrenCount: number;
  childrenNames: string;
  motivation: string;
  savedIdeaIds: string[];
  sales: SaleRecord[];
  potTransactions?: PotTransaction[];
  customPots?: CustomPot[];
  financialChecklist?: Record<string, boolean>;
  routineChecks: Record<string, boolean>;
  theme?: 'light' | 'dark';
  diagnosisCompleted?: boolean;
  bfStatus?: string;
  selectedSkills?: string[];
  initialBudget?: number;
  availableTime?: string;
  profileType?: string;
}

export type TabType = 'home' | 'ideias' | 'metas' | 'calculadora' | 'rotina' | 'perfil' | 'financeiro' | 'salvas';
