import React, { useState } from 'react';
import { NavTab } from '../components/NavPill';

interface DesignSystemPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const DesignSystemPage: React.FC<DesignSystemPageProps> = ({ onNavigate }) => {
  const [activeSurfaceTab, setActiveSurfaceTab] = useState<string>('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToken = (token: string, value: string) => {
    navigator.clipboard.writeText(`${token}: ${value}`);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 1500);
  };

  const tokens = [
    { name: '{colors.primary}', value: '#141414', label: 'Ink Black (Brand fill & text)', role: 'brand' },
    { name: '{colors.accent}', value: '#0066ff', label: 'Electric Blue (Commercial only)', role: 'accent' },
    { name: '{colors.canvas}', value: '#ffffff', label: 'Canvas (Page default)', role: 'surface' },
    { name: '{colors.canvas-soft}', value: '#f3f3f3', label: 'Soft Canvas (6% tint)', role: 'surface' },
    { name: '{colors.field}', value: '#f0f0f0', label: 'Field (8% tint for inputs)', role: 'surface' },
    { name: '{colors.hairline}', value: '#e0e0e0', label: 'Hairline (16% control border)', role: 'border' },
    { name: '{colors.text-muted}', value: '#707070', label: 'Muted Text (Secondary copy)', role: 'text' },
    { name: '{colors.text-faint}', value: '#adadad', label: 'Faint Text (Fine print)', role: 'text' }
  ];

  return (
    <div className="space-y-20 max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14">
      {/* 1. Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs text-[#707070] font-semibold uppercase tracking-wider block">
          Engineering & Design Specification
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight font-display-heavy text-[#141414] leading-[1.0]">
          Mobbin Design System.
        </h1>
        <p className="text-lg text-[#707070] font-subtitle-light leading-[1.38]">
          Monochrome discipline: near-black ink on pure white canvas, zero shadows, stadium-pill interaction language, and a single electric blue accent.
        </p>
      </section>

      {/* 2. Color Palette & Tint Ladder */}
      <section className="space-y-6">
        <div className="border-b border-[#f0f0f0] pb-2">
          <h2 className="text-2xl font-bold font-display-heavy text-[#141414]">Color tokens & tint ladder.</h2>
          <span className="text-xs text-[#707070]">Click any token pill to copy its raw hex code.</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {tokens.map((tok) => (
            <button
              key={tok.name}
              onClick={() => copyToken(tok.name, tok.value)}
              className="bg-white border border-[#f0f0f0] hover:border-[#e0e0e0] rounded-[20px] p-4 text-left transition-all cursor-pointer group"
            >
              <div
                className="w-full h-16 rounded-[12px] border border-[#e0e0e0]/40 mb-3 flex items-center justify-center font-bold text-xs"
                style={{
                  backgroundColor: tok.value,
                  color: ['#141414', '#0066ff'].includes(tok.value) ? '#ffffff' : '#141414'
                }}
              >
                {tok.value}
              </div>
              <b className="block text-xs font-mono text-[#141414] truncate">{tok.name}</b>
              <span className="text-[11px] text-[#707070] block mt-0.5">{tok.label}</span>
              <span className="text-[10px] text-[#0066ff] font-semibold block mt-1">
                {copiedToken === tok.name ? '✓ Copied' : 'Copy'}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. The 10 Kit-Mirror Demonstration Surfaces */}
      <section className="space-y-8">
        <div className="border-b border-[#f0f0f0] pb-2 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold font-display-heavy text-[#141414]">
              The 10 kit-mirror demonstration surfaces.
            </h2>
            <span className="text-xs text-[#707070]">
              Exact implementations of the reference surfaces from the Mobbin specification.
            </span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {['all', 'pricing', 'forms', 'data', 'feedback'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveSurfaceTab(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-full capitalize cursor-pointer ${
                  activeSurfaceTab === cat ? 'bg-[#141414] text-white' : 'bg-[#f3f3f3] text-[#707070]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Surface 1: ex-pricing-tier */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-6 space-y-4">
            <span className="text-[10px] font-mono text-[#707070] bg-[#f3f3f3] px-2 py-0.5 rounded-full">
              ex-pricing-tier (default tier)
            </span>
            <div className="flex justify-between items-baseline">
              <h3 className="text-xl font-bold text-[#141414]">Starter Team</h3>
              <span className="text-2xl font-display-heavy text-[#141414]">$24/mo</span>
            </div>
            <p className="text-xs text-[#707070]">Standard card chrome with 1px hairline-soft edge and white canvas fill.</p>
            <button className="w-full bg-[#ffffff] hover:bg-[#f3f3f3] text-[#141414] text-xs font-semibold py-2.5 rounded-full border border-[#e0e0e0]">
              Get started with Team
            </button>
          </div>

          {/* Surface 2: ex-pricing-tier-featured */}
          <div className="bg-[#f3f3f3] rounded-[24px] p-6 space-y-4 border-0">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-[#707070] bg-white px-2 py-0.5 rounded-full">
                ex-pricing-tier-featured
              </span>
              <span className="bg-[#0066ff] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Popular
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <h3 className="text-xl font-bold text-[#141414]">Pro Individual</h3>
              <span className="text-2xl font-display-heavy text-[#141414]">$12/mo</span>
            </div>
            <p className="text-xs text-[#707070]">Canvas-soft fill, borderless elevation, carrying the singular electric blue badge.</p>
            <button className="w-full bg-[#141414] hover:bg-[#262626] text-white text-xs font-semibold py-2.5 rounded-full">
              Get started with Pro
            </button>
          </div>

          {/* Surface 3: ex-product-selector */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-6 space-y-3">
            <span className="text-[10px] font-mono text-[#707070] bg-[#f3f3f3] px-2 py-0.5 rounded-full">
              ex-product-selector (What's included)
            </span>
            <h4 className="text-base font-bold text-[#141414]">Platform Access Summary</h4>
            <div className="space-y-2 text-xs text-[#141414]">
              <div className="flex justify-between p-2 rounded-xl bg-[#f3f3f3]">
                <span>iOS Screen Sequences</span>
                <b className="font-semibold">300,000+</b>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-[#f3f3f3]">
                <span>Android & Web Apps</span>
                <b className="font-semibold">1,000+ apps</b>
              </div>
            </div>
          </div>

          {/* Surface 4: ex-cart-drawer */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-6 space-y-3">
            <span className="text-[10px] font-mono text-[#707070] bg-[#f3f3f3] px-2 py-0.5 rounded-full">
              ex-cart-drawer (Subscription summary)
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#f0f0f0]">
                <span>Mobbin Pro Annual (1 seat)</span>
                <b>$144.00</b>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f0f0f0]">
                <span className="text-[#0066ff]">Annual billing discount (20%)</span>
                <b className="text-[#0066ff]">-$36.00</b>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold text-[#141414]">
                <span>Total due today</span>
                <span>$108.00</span>
              </div>
            </div>
          </div>

          {/* Surface 5: ex-app-shell-row */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-6 space-y-3">
            <span className="text-[10px] font-mono text-[#707070] bg-[#f3f3f3] px-2 py-0.5 rounded-full">
              ex-app-shell-row (Sidebar navigation indicator)
            </span>
            <div className="space-y-1 text-xs font-semibold">
              <div className="p-2.5 rounded-full bg-[#f3f3f3] text-[#141414] flex items-center justify-between">
                <span>📱 iOS Library (Active)</span>
                <span className="w-2 h-2 rounded-full bg-[#141414]" />
              </div>
              <div className="p-2.5 rounded-full text-[#707070] hover:bg-[#fafafa] flex items-center justify-between">
                <span>🤖 Android Archive</span>
              </div>
              <div className="p-2.5 rounded-full text-[#707070] hover:bg-[#fafafa] flex items-center justify-between">
                <span>🌐 Web Product Flows</span>
              </div>
            </div>
          </div>

          {/* Surface 6: ex-data-table-cell */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-6 space-y-3">
            <span className="text-[10px] font-mono text-[#707070] bg-[#f3f3f3] px-2 py-0.5 rounded-full">
              ex-data-table-cell (Table headers & cells)
            </span>
            <div className="border border-[#f0f0f0] rounded-xl overflow-hidden text-xs">
              <div className="bg-[#f3f3f3] p-2.5 font-bold uppercase tracking-wider text-[10px] text-[#707070] flex justify-between">
                <span>Metric</span>
                <span>Value</span>
              </div>
              <div className="p-2.5 flex justify-between border-t border-[#f0f0f0]">
                <span>Heading weight</span>
                <b className="font-mono">652 / 650 tight</b>
              </div>
              <div className="p-2.5 flex justify-between border-t border-[#f0f0f0]">
                <span>Subtitle weight</span>
                <b className="font-mono">300 light</b>
              </div>
            </div>
          </div>

          {/* Surface 7: ex-auth-form-card */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-6 space-y-3">
            <span className="text-[10px] font-mono text-[#707070] bg-[#f3f3f3] px-2 py-0.5 rounded-full">
              ex-auth-form-card
            </span>
            <input
              type="text"
              readOnly
              value="name@company.com"
              className="w-full bg-[#f0f0f0] text-xs p-3 rounded-[16px] text-[#141414] focus:ring-2 focus:ring-[#141414] outline-none"
            />
            <button className="w-full bg-[#141414] text-white text-xs font-semibold py-2.5 rounded-full">
              Continue with Email
            </button>
          </div>

          {/* Surface 8: ex-modal-card */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-6 space-y-2">
            <span className="text-[10px] font-mono text-[#707070] bg-[#f3f3f3] px-2 py-0.5 rounded-full">
              ex-modal-card (Dialog frame)
            </span>
            <h4 className="font-bold text-sm text-[#141414]">Export Screen to Figma</h4>
            <p className="text-xs text-[#707070]">Copies auto-layout vector components directly to your clipboard.</p>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 bg-[#f3f3f3] text-xs font-semibold py-2 rounded-full text-[#141414]">
                Cancel
              </button>
              <button className="flex-1 bg-[#141414] text-xs font-semibold py-2 rounded-full text-white">
                Export Now
              </button>
            </div>
          </div>

          {/* Surface 9: ex-empty-state-card */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-6 text-center space-y-2">
            <span className="text-[10px] font-mono text-[#707070] bg-[#f3f3f3] px-2 py-0.5 rounded-full">
              ex-empty-state-card
            </span>
            <div className="w-10 h-10 rounded-[30%] squircle bg-[#f3f3f3] mx-auto flex items-center justify-center text-sm font-bold text-[#707070]">
              ∅
            </div>
            <h4 className="text-xs font-bold text-[#141414]">No matching screens found.</h4>
            <p className="text-[11px] text-[#707070]">Try adjusting your search filters or browse popular categories.</p>
          </div>

          {/* Surface 10: ex-toast */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-6 space-y-3">
            <span className="text-[10px] font-mono text-[#707070] bg-[#f3f3f3] px-2 py-0.5 rounded-full">
              ex-toast (Notification surface)
            </span>
            <div className="bg-[#141414] text-white p-3 rounded-full flex items-center justify-between text-xs px-4">
              <span>✓ Screen copied to Figma clipboard</span>
              <span className="text-[#adadad] text-[10px]">Undo</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Do's and Don'ts Constitution */}
      <section className="space-y-6 pt-6 pb-12">
        <h2 className="text-2xl font-bold font-display-heavy text-[#141414]">
          Do's and don'ts constitution.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Do's */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-6 space-y-3">
            <h3 className="font-bold text-sm text-[#141414] flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#141414] text-white text-[10px] flex items-center justify-center">✓</span>
              Design System Do's
            </h3>
            <ul className="space-y-2 text-xs text-[#707070] leading-relaxed">
              <li>• Keep the canvas white and let screenshots supply all saturation.</li>
              <li>• Use rounded-full for every interactive element — a rectangular button does not exist in this system.</li>
              <li>• Build emphasis with the tint ladder: #f3f3f3 fill for featured surfaces, #f0f0f0 outlines for resting cards.</li>
              <li>• Reserve #0066ff electric blue exclusively for commercial signals (Popular badge, savings callout).</li>
              <li>• Set every heading in Saans/Inter 652 with line-height 1.0–1.13 and end headline sentences with a period.</li>
              <li>• Render app icons as 30% squircles and curator portraits strictly in black-and-white.</li>
            </ul>
          </div>

          {/* Don'ts */}
          <div className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-6 space-y-3">
            <h3 className="font-bold text-sm text-[#141414] flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#707070] text-white text-[10px] flex items-center justify-center">✕</span>
              Design System Don'ts
            </h3>
            <ul className="space-y-2 text-xs text-[#707070] leading-relaxed">
              <li>• Don't add drop shadows — elevation is strictly fill differences and hairlines.</li>
              <li>• Don't use electric blue for CTAs; primary actions are always #141414 ink pills.</li>
              <li>• Don't introduce additional accent hues, gradients on UI chrome, or colored bands.</li>
              <li>• Don't outline the featured pricing tier — feature it with the #f3f3f3 fill instead.</li>
              <li>• Don't put borders on form fields at rest — fields are #f0f0f0 tint fills with 2px ink focus rings.</li>
              <li>• Don't square off pill geometry at small sizes — badges, chips, and toggles stay stadium-shaped.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
