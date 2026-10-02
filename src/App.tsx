/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, CategoryId, BusinessIdea, UserProfile, DepositGoal } from './types';
import { BUSINESS_IDEAS } from './data/ideas';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { IdeasTab } from './components/IdeasTab';
import { GoalsTab } from './components/GoalsTab';
import { CalculatorTab } from './components/CalculatorTab';
import { RoutineTab } from './components/RoutineTab';
import { ProfileTab } from './components/ProfileTab';
import { FinanceTab } from './components/FinanceTab';
import { SavedIdeasTab } from './components/SavedIdeasTab';
import { IdeaDetailModal } from './components/IdeaDetailModal';
import { DiagnosisFunnelModal } from './components/DiagnosisFunnelModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';

const STORAGE_KEY = 'renda_mais_app_data';

// Helper to generate default 50 deposits for R$ 1.000
function createInitialDeposits(target: number): number[] {
  const weights = Array.from({ length: 50 }, () => 0.5 + Math.random() * 1.0);
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
  return deposits;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todas');
  const [activeModalIdea, setActiveModalIdea] = useState<BusinessIdea | null>(null);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return (
      window.location.pathname.startsWith('/adm') ||
      window.location.hash.includes('adm') ||
      window.location.search.includes('adm')
    );
  });

  useEffect(() => {
    const handleLocationCheck = () => {
      setIsAdminRoute(
        window.location.pathname.startsWith('/adm') ||
        window.location.hash.includes('adm') ||
        window.location.search.includes('adm')
      );
    };
    window.addEventListener('popstate', handleLocationCheck);
    window.addEventListener('hashchange', handleLocationCheck);
    return () => {
      window.removeEventListener('popstate', handleLocationCheck);
      window.removeEventListener('hashchange', handleLocationCheck);
    };
  }, []);

  // Profile State
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      // Check for existing data
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved).profile;
      }
      // Migrate from old prototype key if present
      const old = localStorage.getItem('rm');
      if (old) {
        const parsed = JSON.parse(old);
        return {
          name: parsed.name || '',
          childrenCount: 1,
          childrenNames: 'Meus Filhos',
          motivation: 'Ter mais tempo para meus filhos e liberdade financeira',
          savedIdeaIds: parsed.saved ? parsed.saved.map((idx: number) => BUSINESS_IDEAS[idx]?.id).filter(Boolean) : [],
          sales: [],
          routineChecks: {}
        };
      }
    } catch {
      // fallback
    }
    return {
      name: '',
      childrenCount: 2,
      childrenNames: 'Meus Filhos',
      motivation: 'Ter tempo de qualidade para meus filhos e minha renda própria',
      savedIdeaIds: ['brigadeiros-pote', 'geladinho-gourmet'],
      sales: [
        { id: '1', date: 'Hoje', description: '3 potes de brigadeiro', amount: 21, cost: 7.5 }
      ],
      routineChecks: { status_whats: true }
    };
  });

  // Goal State
  const [goal, setGoal] = useState<DepositGoal>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved).goal;
      }
      const old = localStorage.getItem('rm');
      if (old) {
        const parsed = JSON.parse(old);
        if (parsed.goal && parsed.goal.deps?.length) {
          return {
            targetAmount: parsed.goal.v || 1000,
            monthlySavings: parsed.goal.mes || 100,
            deposits: parsed.goal.deps,
            done: parsed.goal.done || {}
          };
        }
      }
    } catch {
      // fallback
    }
    const defaultTarget = 1000;
    const initialDeps = createInitialDeposits(defaultTarget);
    return {
      targetAmount: defaultTarget,
      monthlySavings: 100,
      deposits: initialDeps,
      done: { 0: true, 1: true, 2: true } // starter progress
    };
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, goal }));
    } catch {
      // ignore quota errors
    }
  }, [profile, goal]);

  const handleToggleSave = (ideaId: string) => {
    setProfile((prev) => {
      const exists = prev.savedIdeaIds.includes(ideaId);
      return {
        ...prev,
        savedIdeaIds: exists
          ? prev.savedIdeaIds.filter((id) => id !== ideaId)
          : [...prev.savedIdeaIds, ideaId]
      };
    });
  };

  const handleToggleRoutineCheck = (key: string) => {
    setProfile((prev) => ({
      ...prev,
      routineChecks: {
        ...prev.routineChecks,
        [key]: !prev.routineChecks[key]
      }
    }));
  };

  const handleResetAllData = () => {
    const defaultTarget = 1000;
    const newDeposits = createInitialDeposits(defaultTarget);
    setProfile({
      name: '',
      childrenCount: 1,
      childrenNames: '',
      motivation: '',
      savedIdeaIds: [],
      sales: [],
      routineChecks: {}
    });
    setGoal({
      targetAmount: defaultTarget,
      monthlySavings: 100,
      deposits: newDeposits,
      done: {}
    });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('rm');
    setCurrentTab('home');
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('renda_mais_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try {
      localStorage.setItem('renda_mais_theme', next);
    } catch {
      // ignore
    }
  };

  const handleNavigate = (tab: TabType) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setIsAdminRoute(true);
    window.history.pushState({}, '', '/adm');
  };

  if (isAdminRoute) {
    return (
      <AdminDashboard
        onBackToApp={() => {
          setIsAdminRoute(false);
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#121212]' : 'bg-[#f3f3f3]'} text-[var(--ink)] flex justify-center selection:bg-[var(--ink)] selection:text-[var(--canvas)] transition-colors duration-200`}>
      {/* Mobile-first App Container */}
      <div className="w-full max-w-[440px] min-h-screen bg-[var(--canvas)] border-x border-[var(--hairline)] flex flex-col relative px-4 pt-3 pb-24 transition-colors">
        <Header
          profile={profile}
          currentTab={currentTab}
          onNavigate={handleNavigate}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onOpenAdmin={handleOpenAdmin}
        />

        <main className="flex-1">
          {currentTab === 'home' && (
            <HomeTab
              profile={profile}
              goal={goal}
              onNavigate={handleNavigate}
              onSelectCategory={setSelectedCategory}
              onOpenIdea={(idea) => setActiveModalIdea(idea)}
              onOpenDiagnosis={() => setShowDiagnosisModal(true)}
              onOpenCheckout={() => setShowCheckoutModal(true)}
            />
          )}

          {currentTab === 'ideias' && (
            <IdeasTab
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onOpenIdea={(idea) => setActiveModalIdea(idea)}
              savedIds={profile.savedIdeaIds}
              onToggleSave={handleToggleSave}
            />
          )}

          {currentTab === 'metas' && (
            <GoalsTab
              goal={goal}
              onUpdateGoal={setGoal}
              isPro={profile.plan === 'pro'}
              onOpenCheckout={() => setShowCheckoutModal(true)}
            />
          )}

          {currentTab === 'calculadora' && (
            <CalculatorTab onNavigate={handleNavigate} />
          )}

          {currentTab === 'rotina' && (
            <RoutineTab
              profile={profile}
              onToggleRoutineCheck={handleToggleRoutineCheck}
              isPro={profile.plan === 'pro'}
              onOpenCheckout={() => setShowCheckoutModal(true)}
            />
          )}

          {currentTab === 'perfil' && (
            <ProfileTab
              profile={profile}
              onUpdateProfile={setProfile}
              onOpenIdea={(idea) => setActiveModalIdea(idea)}
              onNavigate={handleNavigate}
              onResetAllData={handleResetAllData}
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
              onOpenDiagnosis={() => setShowDiagnosisModal(true)}
              onOpenAdmin={handleOpenAdmin}
            />
          )}

          {currentTab === 'financeiro' && (
            <FinanceTab
              profile={profile}
              onUpdateProfile={setProfile}
              onNavigate={handleNavigate}
              goal={goal}
              onUpdateGoal={setGoal}
              onOpenCheckout={() => setShowCheckoutModal(true)}
            />
          )}

          {currentTab === 'salvas' && (
            <SavedIdeasTab
              profile={profile}
              onUpdateProfile={setProfile}
              onOpenIdea={(idea) => setActiveModalIdea(idea)}
              onNavigate={handleNavigate}
            />
          )}
        </main>

        <BottomNav
          currentTab={currentTab}
          onSelectTab={handleNavigate}
          savedCount={profile.savedIdeaIds.length}
        />

        {/* Detailed Idea Modal */}
        {activeModalIdea && (
          <IdeaDetailModal
            idea={activeModalIdea}
            isSaved={profile.savedIdeaIds.includes(activeModalIdea.id)}
            onToggleSave={handleToggleSave}
            onClose={() => setActiveModalIdea(null)}
            onOpenCalculator={() => {
              setActiveModalIdea(null);
              handleNavigate('calculadora');
            }}
          />
        )}

        {/* Diagnosis & High-Converting SPIN Sales Funnel Modal */}
        <DiagnosisFunnelModal
          isOpen={showDiagnosisModal}
          onClose={() => setShowDiagnosisModal(false)}
          profile={profile}
          onUpdateProfile={setProfile}
          onSelectIdea={(idea) => {
            setShowDiagnosisModal(false);
            setActiveModalIdea(idea);
          }}
        />

        {/* Global Checkout / Paywall Modal */}
        <CheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          profile={profile}
          onUpdateProfile={setProfile}
          offerTitle="Kit Mãe Empreendedora PRO"
          offerPrice={6.90}
        />
      </div>
    </div>
  );
}
