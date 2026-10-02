import React, { useState } from 'react';
import { X, Heart, Check, Copy, Home, Clock, AlertTriangle, ShoppingCart, MessageCircle, TrendingUp, Calculator } from 'lucide-react';
import { BusinessIdea } from '../types';
import { CATEGORIES } from '../data/ideas';

interface IdeaDetailModalProps {
  idea: BusinessIdea;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
  onOpenCalculator?: () => void;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  isSaved,
  onToggleSave,
  onClose,
  onOpenCalculator
}) => {
  const [copied, setCopied] = useState(false);
  const [dailySales, setDailySales] = useState(5);

  const categoryObj = CATEGORIES.find(c => c.id === idea.category);

  // Approximate margin estimation for simulation
  const avgCostPerUnit = (idea.minCost + idea.maxCost) / 2 / 10;
  const estimatedPriceNum = Math.max(10, Math.round(avgCostPerUnit * 2.2));
  const estimatedProfitPerUnit = Math.max(4, estimatedPriceNum - avgCostPerUnit);
  const monthlyProjection = Math.round(dailySales * estimatedProfitPerUnit * 22);

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(idea.whatsappScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#141414]/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#ffffff] border border-[#e0e0e0] w-full max-w-[440px] max-h-[90vh] overflow-y-auto rounded-t-[24px] sm:rounded-[24px] p-6 pb-10">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0f0f0]">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 bg-[#f3f3f3] squircle flex items-center justify-center text-3xl shrink-0">
              {idea.emoji}
            </span>
            <div>
              <span className="text-[11px] font-semibold text-[#707070] uppercase tracking-wider block">
                {categoryObj?.name || 'Negócio'}
              </span>
              <h2 className="text-lg font-bold text-[#141414] leading-tight mt-0.5">
                {idea.title}.
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleSave(idea.id)}
              className="p-2 rounded-full text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3] transition-colors cursor-pointer"
              title={isSaved ? 'Salvo' : 'Salvar Ideia'}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#141414] text-[#141414]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#707070] hover:text-[#141414] hover:bg-[#f3f3f3] transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Investment & badges in Soft Canvas */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <div className="bg-[#f3f3f3] rounded-[16px] p-3 text-center">
            <span className="text-[11px] font-medium text-[#707070] block">Custo inicial</span>
            <span className="text-base font-bold text-[#141414]">
              R$ {idea.minCost} a R$ {idea.maxCost}
            </span>
          </div>

          <div className="bg-[#f3f3f3] rounded-[16px] p-3 text-center">
            <span className="text-[11px] font-medium text-[#707070] block">Lucro mensal</span>
            <span className="text-xs font-semibold text-[#141414] block mt-0.5">
              {idea.estimatedProfitMonthly}
            </span>
          </div>
        </div>

        {/* Flexibility row unboxed */}
        <div className="flex items-center justify-between text-xs text-[#707070] py-2 border-y border-[#f0f0f0] mb-4 font-light">
          <span className="flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-[#141414]" />
            {idea.workFromHome ? '100% de casa com os filhos' : 'No bairro'}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#141414]" />
            {idea.timeNeededDaily}
          </span>
        </div>

        {/* Shopping list */}
        <div className="mb-4">
          <h3 className="text-xs font-bold text-[#141414] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5 text-[#141414]" />
            O que comprar para começar:
          </h3>
          <ul className="space-y-1.5 bg-[#f3f3f3] rounded-[16px] p-4 text-xs text-[#141414]">
            {idea.shoppingList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#141414] mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested price */}
        <div className="mb-4 p-4 bg-[#ffffff] border border-[#f0f0f0] rounded-[16px]">
          <span className="text-xs font-bold text-[#707070] uppercase tracking-wider block mb-1">
            Preço sugerido de venda
          </span>
          <p className="text-sm font-bold text-[#141414]">{idea.suggestedPrice}</p>
        </div>

        {/* How to get first clients */}
        <div className="mb-4 p-4 bg-[#ffffff] border border-[#f0f0f0] rounded-[16px]">
          <h3 className="text-xs font-bold text-[#141414] uppercase tracking-wider mb-1.5">
            Primeiras 3 clientes hoje:
          </h3>
          <p className="text-xs font-light text-[#707070] leading-[1.43]">
            {idea.firstClientMethod}
          </p>
        </div>

        {/* WhatsApp script */}
        <div className="mb-4 p-4 bg-[#f3f3f3] rounded-[16px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              Mensagem para WhatsApp:
            </h3>
            <button
              onClick={handleCopyWhatsApp}
              className="btn-primary py-1 px-3 text-[11px] font-semibold"
            >
              {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              {copied ? 'Copiado' : 'Copiar ↗'}
            </button>
          </div>
          <p className="text-xs text-[#141414] bg-[#ffffff] p-3 rounded-[12px] border border-[#e0e0e0] italic leading-relaxed select-all">
            "{idea.whatsappScript}"
          </p>
        </div>

        {/* Routine with children */}
        <div className="mb-4 p-4 bg-[#ffffff] border border-[#f0f0f0] rounded-[16px]">
          <h3 className="text-xs font-bold text-[#141414] uppercase tracking-wider mb-1.5">
            Rotina com os filhos:
          </h3>
          <p className="text-xs font-light text-[#707070] leading-[1.43]">
            {idea.motherRoutineTip}
          </p>
        </div>

        {/* Common mistake */}
        <div className="mb-4 p-4 bg-[#f3f3f3] rounded-[16px] flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#141414] shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-[#141414] block">Erro comum para evitar:</span>
            <p className="text-xs font-light text-[#707070] leading-snug mt-0.5">{idea.commonMistake}</p>
          </div>
        </div>

        {/* Profit Simulator */}
        <div className="mb-6 p-4 bg-[#ffffff] border border-[#e0e0e0] rounded-[20px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#141414] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#141414]" />
              Simulador de vendas diárias
            </span>
            <span className="text-xs font-bold text-[#141414] bg-[#f3f3f3] px-2.5 py-0.5 rounded-full">
              {dailySales} vendas/dia
            </span>
          </div>

          {idea.salesSimulator && (
            <div className="p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-[12px] text-xs font-semibold mb-3">
              💡 <b>Cenário de Vendas:</b> {idea.salesSimulator}
            </div>
          )}

          <input
            type="range"
            min={1}
            max={20}
            value={dailySales}
            onChange={(e) => setDailySales(Number(e.target.value))}
            className="w-full accent-[#141414] mb-3 cursor-pointer"
          />

          <div className="flex items-center justify-between text-xs text-[#707070]">
            <span>Vendendo {dailySales}/dia (em 22 dias)</span>
            <span className="font-bold text-sm text-[#141414]">
              ~R$ {monthlyProjection.toLocaleString('pt-BR')} no mês
            </span>
          </div>
        </div>

        {/* Action Buttons in Mobbin Stadium Pills */}
        <div className="space-y-2.5">
          {onOpenCalculator && (
            <button
              onClick={() => {
                onClose();
                onOpenCalculator();
              }}
              className="w-full btn-outline text-xs flex items-center justify-center gap-1.5"
            >
              <Calculator className="w-4 h-4" />
              Precificar na calculadora ↗
            </button>
          )}

          <button
            onClick={() => onToggleSave(idea.id)}
            className="w-full btn-primary text-xs flex items-center justify-center gap-2"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white text-white' : ''}`} />
            {isSaved ? 'Remover das ideias salvas' : 'Salvar no meu perfil'}
          </button>
        </div>

        <p className="text-[10px] text-[#adadad] text-center mt-4">
          Valores baseados em médias de mercado. Ajuste conforme sua região.
        </p>
      </div>
    </div>
  );
};
