import React, { useState } from 'react';
import { PRICING_FAQS } from '../data/mobbinData';
import { NavTab } from '../components/NavPill';

interface PricingPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const proPrice = billingCycle === 'annually' ? 12 : 15;
  const teamPrice = billingCycle === 'annually' ? 24 : 30;

  const compareFeatures = [
    { name: 'Access to 300,000+ screenshots', free: 'Last 7 days', pro: 'Full Archive', team: 'Full Archive' },
    { name: 'Interactive user flows & screen sequences', free: 'Limited (3/mo)', pro: 'Unlimited', team: 'Unlimited' },
    { name: 'Filter by UI element & interaction pattern', free: '—', pro: '✓ Included', team: '✓ Included' },
    { name: 'Copy screen text (OCR)', free: '—', pro: '✓ Unlimited', team: '✓ Unlimited' },
    { name: 'Official Mobbin Figma Plugin', free: '—', pro: '✓ Full sync', team: '✓ Full sync' },
    { name: 'Personal saved collections', free: 'Up to 3', pro: 'Unlimited', team: 'Unlimited' },
    { name: 'Shared team workspace & collections', free: '—', freeSub: '', pro: '—', team: '✓ Included' },
    { name: 'Centralized team billing & seat management', free: '—', pro: '—', team: '✓ Included' },
    { name: 'Priority curation requests', free: '—', pro: '—', team: '✓ Dedicated' }
  ];

  return (
    <div className="space-y-20 pt-8 sm:pt-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. Header & Billing Toggle */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight font-display-heavy text-[#141414] leading-[1.0]">
          Design like a Pro.
        </h1>
        <p className="text-lg sm:text-xl text-[#707070] font-subtitle-light leading-[1.38] max-w-xl mx-auto">
          Unlock the complete archive of over 300,000 screens, interactive flows, and advanced search filters.
        </p>

        {/* Segmented Billing Toggle (track: #f3f3f3, active segment: white pill with soft shadow) */}
        <div className="pt-2 flex justify-center">
          <div className="bg-[#f3f3f3] p-1.5 rounded-full flex items-center gap-1 border-0">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#ffffff] text-[#141414] shadow-xs'
                  : 'text-[#707070] hover:text-[#141414]'
              }`}
            >
              Billed monthly
            </button>
            <button
              onClick={() => setBillingCycle('annually')}
              className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                billingCycle === 'annually'
                  ? 'bg-[#ffffff] text-[#141414] shadow-xs'
                  : 'text-[#707070] hover:text-[#141414]'
              }`}
            >
              <span>Billed annually</span>
              {/* Electric blue accent callout for yearly savings */}
              <span className="bg-[#0066ff] text-[#ffffff] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. 2-Up Pricing Card Grid */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Pro Plan: Featured Plan ({colors.canvas-soft} #f3f3f3 fill, borderless, rounded-md 24px) */}
        <div className="bg-[#f3f3f3] rounded-[24px] p-8 flex flex-col justify-between space-y-6 relative border-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading-tight text-2xl font-bold text-[#141414]">Pro</h3>
              {/* badge-popular: compact {colors.accent} #0066ff chip */}
              <span className="bg-[#0066ff] text-[#ffffff] text-xs font-semibold px-3 py-1 rounded-full">
                Popular
              </span>
            </div>

            <p className="text-sm text-[#707070] font-body-regular">
              For independent product designers, freelancers, and design engineers.
            </p>

            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-display-heavy text-[#141414]">
                  ${proPrice}
                </span>
                <span className="text-sm text-[#707070] font-body-regular">/ month</span>
              </div>
              <span className="text-xs text-[#adadad] block mt-1">
                {billingCycle === 'annually' ? 'Billed annually ($144/yr)' : 'Billed monthly'}
              </span>
            </div>

            {/* Feature List */}
            <div className="pt-4 space-y-3 text-sm text-[#141414]">
              <div className="flex items-center gap-2.5">
                <span className="text-[#141414] font-bold">✓</span>
                <span>Full access to 300,000+ screenshots</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#141414] font-bold">✓</span>
                <span>Unlimited interactive user flows & screen sequences</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#141414] font-bold">✓</span>
                <span>Advanced search by UI element and pattern</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#141414] font-bold">✓</span>
                <span>Copy screen text and inspect typography</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#141414] font-bold">✓</span>
                <span>Mobbin Figma plugin sync</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('signup')}
            className="w-full bg-[#141414] hover:bg-[#262626] text-[#ffffff] font-semibold text-sm py-3.5 rounded-full transition-all cursor-pointer shadow-none"
          >
            Get started with Pro
          </button>
        </div>

        {/* Team Plan: Default Tier (white fill, 1px #f0f0f0 outline, 24px corners) */}
        <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading-tight text-2xl font-bold text-[#141414]">Team</h3>
              <span className="text-xs text-[#707070] font-semibold">For squads</span>
            </div>

            <p className="text-sm text-[#707070] font-body-regular">
              For product and design teams collaborating on benchmarks and moodboards.
            </p>

            <div className="pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-display-heavy text-[#141414]">
                  ${teamPrice}
                </span>
                <span className="text-sm text-[#707070] font-body-regular">/ user / month</span>
              </div>
              <span className="text-xs text-[#adadad] block mt-1">
                {billingCycle === 'annually' ? 'Billed annually ($288/user/yr)' : 'Billed monthly'}
              </span>
            </div>

            {/* Feature List */}
            <div className="pt-4 space-y-3 text-sm text-[#141414]">
              <div className="flex items-center gap-2.5">
                <span className="text-[#707070] font-bold">✓</span>
                <span>Everything in Pro for all team members</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#707070] font-bold">✓</span>
                <span>Shared team library & workspace collections</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#707070] font-bold">✓</span>
                <span>Centralized seat management & billing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#707070] font-bold">✓</span>
                <span>Priority support and custom invoice options</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('signup')}
            className="w-full bg-[#ffffff] hover:bg-[#f3f3f3] text-[#141414] font-semibold text-sm py-3.5 rounded-full border border-[#e0e0e0] transition-all cursor-pointer"
          >
            Get started with Team
          </button>
        </div>
      </section>

      {/* 3. Compare Table Section */}
      <section className="max-w-4xl mx-auto space-y-6 pt-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-display-heavy text-[#141414]">
            Compare plan features.
          </h2>
          <p className="text-sm text-[#707070] font-body-regular">
            A granular breakdown of capabilities across all tiers.
          </p>
        </div>

        <div className="overflow-x-auto rounded-[24px] border border-[#f0f0f0] bg-white">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#f0f0f0]">
                <th className="py-4 px-6 font-semibold text-[#141414] w-2/5">Capabilities</th>
                <th className="py-4 px-4 font-semibold text-[#707070] w-1/5 text-center">Free</th>
                <th className="py-4 px-4 font-bold text-[#141414] w-1/5 text-center bg-[#f3f3f3] ring-1 ring-inset ring-[#e0e0e0]">
                  Pro (Popular)
                </th>
                <th className="py-4 px-4 font-semibold text-[#141414] w-1/5 text-center">Team</th>
              </tr>
            </thead>
            <tbody>
              {compareFeatures.map((row, idx) => (
                <tr key={idx} className="border-b border-[#f3f3f3] hover:bg-[#fafafa]">
                  <td className="py-3.5 px-6 font-medium text-[#141414]">{row.name}</td>
                  <td className="py-3.5 px-4 text-center text-[#707070]">{row.free}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#141414] bg-[#f3f3f3] ring-1 ring-inset ring-[#e0e0e0]">
                    {row.pro}
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-[#141414]">{row.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. FAQ Accordion Section (faq-row: full-width #f3f3f3 bars, 16px corners) */}
      <section className="max-w-3xl mx-auto space-y-6 pt-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-display-heavy text-[#141414]">
            Frequently asked questions.
          </h2>
        </div>

        <div className="space-y-3">
          {PRICING_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-[#f3f3f3] rounded-[16px] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-semibold text-sm sm:text-base text-[#141414] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-base text-[#707070] transform transition-transform duration-200 ml-2">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#707070] font-body-regular leading-relaxed border-t border-[#e0e0e0]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
