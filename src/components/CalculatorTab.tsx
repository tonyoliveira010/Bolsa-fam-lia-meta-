import React, { useState } from 'react';
import { Calculator, TrendingUp, ArrowLeft } from 'lucide-react';
import { TabType } from '../types';

interface Preset {
  name: string;
  materialCost: number;
  yieldUnits: number;
  packagingUnitCost: number;
  timeHours: number;
  hourlyRate: number;
  marginPercent: number;
}

interface CalculatorTabProps {
  onNavigate?: (tab: TabType) => void;
}

const PRESETS: Preset[] = [
  {
    name: '🍫 Brigadeiro no pote',
    materialCost: 28,
    yieldUnits: 10,
    packagingUnitCost: 0.8,
    timeHours: 1.5,
    hourlyRate: 10,
    marginPercent: 60
  },
  {
    name: '🍱 Marmita caseira',
    materialCost: 45,
    yieldUnits: 6,
    packagingUnitCost: 1.2,
    timeHours: 2,
    hourlyRate: 12,
    marginPercent: 50
  },
  {
    name: '🥮 Bolo caseiro',
    materialCost: 18,
    yieldUnits: 2,
    packagingUnitCost: 2.0,
    timeHours: 1.5,
    hourlyRate: 10,
    marginPercent: 70
  },
  {
    name: '🎀 Laço infantil',
    materialCost: 12,
    yieldUnits: 4,
    packagingUnitCost: 0.5,
    timeHours: 1,
    hourlyRate: 12,
    marginPercent: 80
  },
  {
    name: '🪡 Bainha de calça',
    materialCost: 2,
    yieldUnits: 1,
    packagingUnitCost: 0,
    timeHours: 0.5,
    hourlyRate: 15,
    marginPercent: 100
  }
];

export const CalculatorTab: React.FC<CalculatorTabProps> = ({ onNavigate }) => {
  const [materialCost, setMaterialCost] = useState(28);
  const [yieldUnits, setYieldUnits] = useState(10);
  const [packagingUnitCost, setPackagingUnitCost] = useState(0.8);
  const [timeHours, setTimeHours] = useState(1.5);
  const [hourlyRate, setHourlyRate] = useState(10);
  const [marginPercent, setMarginPercent] = useState(50);
  const [dailySalesEstimate, setDailySalesEstimate] = useState(6);

  const validYield = Math.max(1, yieldUnits);
  const ingredientUnitCost = materialCost / validYield;
  const laborUnitCost = (timeHours * hourlyRate) / validYield;
  const totalCostPerUnit = ingredientUnitCost + packagingUnitCost + laborUnitCost;
  const breakEvenPrice = ingredientUnitCost + packagingUnitCost;
  const suggestedSellingPrice = totalCostPerUnit * (1 + marginPercent / 100);
  const profitPerUnit = suggestedSellingPrice - (ingredientUnitCost + packagingUnitCost);
  const monthlyProjection = Math.round(dailySalesEstimate * profitPerUnit * 22);

  const applyPreset = (preset: Preset) => {
    setMaterialCost(preset.materialCost);
    setYieldUnits(preset.yieldUnits);
    setPackagingUnitCost(preset.packagingUnitCost);
    setTimeHours(preset.timeHours);
    setHourlyRate(preset.hourlyRate);
    setMarginPercent(preset.marginPercent);
  };

  return (
    <div className="space-y-5">
      {onNavigate && (
        <button
          onClick={() => onNavigate('perfil')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)] hover:text-[#0066ff] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Perfil</span>
        </button>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[#141414] tracking-tight flex items-center gap-2">
          Calculadora de preço e lucro.
        </h1>
        <p className="text-xs font-light text-[#707070] mt-1 leading-[1.38]">
          Precifique com precisão incluindo ingredientes, embalagem e o valor da sua hora.
        </p>
      </div>

      {/* Presets in Stadium Pills */}
      <div>
        <span className="text-xs font-semibold text-[#141414] uppercase tracking-wider block mb-2">
          Modelos rápidos:
        </span>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="shrink-0 px-3.5 py-1.5 text-xs font-medium bg-[#ffffff] text-[#141414] border border-[#e0e0e0] hover:bg-[#f3f3f3] rounded-full transition-colors cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Form Fields Card */}
      <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[#141414] block mb-1">
              Custo de materiais (R$)
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={materialCost}
              onChange={(e) => setMaterialCost(Math.max(0, Number(e.target.value)))}
              className="w-full mobbin-input text-xs font-semibold"
            />
            <span className="text-[10px] text-[#707070] font-light block mt-1">Ingredientes e matéria-prima</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#141414] block mb-1">
              Rendimento (unidades)
            </label>
            <input
              type="number"
              min={1}
              value={yieldUnits}
              onChange={(e) => setYieldUnits(Math.max(1, Number(e.target.value)))}
              className="w-full mobbin-input text-xs font-semibold"
            />
            <span className="text-[10px] text-[#707070] font-light block mt-1">Total de peças ou porções</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[#141414] block mb-1">
              Embalagem un. (R$)
            </label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={packagingUnitCost}
              onChange={(e) => setPackagingUnitCost(Math.max(0, Number(e.target.value)))}
              className="w-full mobbin-input text-xs font-semibold"
            />
            <span className="text-[10px] text-[#707070] font-light block mt-1">Pote, fita, sacola</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#141414] block mb-1">
              Tempo gasto (horas)
            </label>
            <input
              type="number"
              min={0.25}
              step={0.25}
              value={timeHours}
              onChange={(e) => setTimeHours(Math.max(0.1, Number(e.target.value)))}
              className="w-full mobbin-input text-xs font-semibold"
            />
            <span className="text-[10px] text-[#707070] font-light block mt-1">Tempo de produção</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-[#141414] mb-1.5">
            <span>Remuneração da sua hora:</span>
            <span className="font-bold">R$ {hourlyRate},00 / h</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full accent-[#141414] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#707070] font-light mt-1">
            <span>R$ 5</span>
            <span>R$ 15 (sugerido)</span>
            <span>R$ 30</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-[#141414] mb-2">
            <span>Margem de lucro:</span>
            <span className="font-bold">{marginPercent}%</span>
          </div>
          <div className="flex gap-2">
            {[30, 50, 70, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => setMarginPercent(pct)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                  marginPercent === pct
                    ? 'bg-[#141414] text-[#ffffff]'
                    : 'bg-[#f3f3f3] text-[#141414] hover:bg-[#e0e0e0]'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Card - Inverted Polarity Surface (#141414 fill with white text) */}
      <div className="bg-[#141414] text-[#ffffff] rounded-[24px] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#adadad] block">
              Preço sugerido
            </span>
            <div className="text-3xl font-bold tracking-tight text-[#ffffff] mt-1">
              R$ {suggestedSellingPrice.toFixed(2).replace('.', ',')}
            </div>
            <span className="text-[11px] text-[#adadad] font-light">por unidade</span>
          </div>

          <div className="text-right bg-[#262626] p-3 rounded-[16px]">
            <span className="text-[10px] uppercase font-semibold text-[#adadad] block">Lucro líquido</span>
            <span className="text-lg font-bold text-[#ffffff]">
              + R$ {profitPerUnit.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-[9px] text-[#adadad] block mt-0.5">por unidade</span>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-1.5 text-xs text-[#adadad] font-light">
          <div className="flex justify-between">
            <span>Custo de material + embalagem:</span>
            <b className="font-semibold text-[#ffffff]">R$ {(ingredientUnitCost + packagingUnitCost).toFixed(2).replace('.', ',')}</b>
          </div>
          <div className="flex justify-between">
            <span>Remuneração da mão de obra:</span>
            <b className="font-semibold text-[#ffffff]">R$ {laborUnitCost.toFixed(2).replace('.', ',')}</b>
          </div>
          <div className="flex justify-between text-[#0066ff]">
            <span>Preço de equilíbrio (mínimo):</span>
            <b className="font-semibold">R$ {breakEvenPrice.toFixed(2).replace('.', ',')}</b>
          </div>
        </div>

        {/* Monthly Projection */}
        <div className="bg-[#262626] rounded-[16px] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#ffffff] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#0066ff]" />
              Projeção mensal
            </span>
            <span className="text-xs font-bold text-[#ffffff] bg-[#141414] px-2.5 py-0.5 rounded-full">
              {dailySalesEstimate} un./dia
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={25}
            value={dailySalesEstimate}
            onChange={(e) => setDailySalesEstimate(Number(e.target.value))}
            className="w-full accent-[#0066ff] cursor-pointer mb-2"
          />

          <p className="text-xs text-[#adadad] font-light leading-relaxed">
            Vendendo <b className="text-white font-medium">{dailySalesEstimate} un./dia</b> por 22 dias, seu ganho líquido estimado é de{' '}
            <b className="text-white font-bold text-sm">
              R$ {monthlyProjection.toLocaleString('pt-BR')}
            </b>.
          </p>
        </div>
      </div>
    </div>
  );
};
