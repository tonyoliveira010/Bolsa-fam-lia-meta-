import React from 'react';
import { AWARDS_DATA, JURORS } from '../data/mobbinData';
import { NavTab } from '../components/NavPill';

interface AwardsPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const AwardsPage: React.FC<AwardsPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-24 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {/* Sub-nav: Minimal corner marks */}
      <div className="flex items-center justify-between py-2 border-b border-[#f0f0f0]">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-[30%] bg-[#141414] text-white flex items-center justify-center text-[10px] font-bold">
            M
          </div>
          <span className="text-xs font-semibold text-[#141414] uppercase tracking-wider">
            Mobbin Design Awards 2026
          </span>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="bg-[#f3f3f3] hover:bg-[#e0e0e0] text-[#141414] text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          Mobbin ↗
        </button>
      </div>

      {/* 1. Hero with Glass Monoliths */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-8 pb-12 overflow-hidden">
        {/* Atmospheric Glass Monoliths (frosted glass vertical gradient pillars) */}
        <div className="absolute inset-0 flex justify-center items-center gap-6 opacity-40 pointer-events-none -z-10" aria-hidden="true">
          <div className="w-24 h-72 rounded-t-[24px] bg-gradient-to-b from-white via-[#f3f3f3] to-transparent border-t border-x border-[#e0e0e0]/60 transform -rotate-6" />
          <div className="w-32 h-88 rounded-t-[24px] bg-gradient-to-b from-white via-[#e8e8e8] to-transparent border-t border-x border-[#e0e0e0] shadow-xs" />
          <div className="w-24 h-64 rounded-t-[24px] bg-gradient-to-b from-white via-[#f3f3f3] to-transparent border-t border-x border-[#e0e0e0]/60 transform rotate-6" />
        </div>

        <div className="space-y-4">
          <span className="text-xs text-[#707070] font-semibold uppercase tracking-wider block">
            Annual Community & Jury Celebration
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight font-display-heavy text-[#141414] leading-[1.0]">
            The votes are in.
          </h1>
          <p className="text-lg sm:text-xl text-[#707070] font-subtitle-light max-w-xl mx-auto leading-[1.38]">
            Celebrating exceptional craftsmanship, groundbreaking micro-interactions, and flawless product execution.
          </p>
        </div>
      </section>

      {/* 2. Award Winners Lockup Section */}
      <section className="space-y-16 max-w-5xl mx-auto">
        {AWARDS_DATA.map((award, idx) => (
          <div
            key={award.id}
            className="bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-6 sm:p-10 space-y-8"
          >
            {/* award-lockup centered presentation */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              {/* Laurel-flanked category eyebrow in {colors.text-muted} */}
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#707070] uppercase tracking-wider">
                <span>🌿</span>
                <span>{award.categoryEyebrow}</span>
                <span>🌿</span>
              </div>

              {/* Winner name in {typography.heading-3} (32px, 652 weight) */}
              <h2 className="text-3xl sm:text-4xl font-bold font-display-heavy text-[#141414]">
                {award.winnerName}
              </h2>

              <p className="text-sm sm:text-base text-[#707070] font-body-regular leading-relaxed">
                {award.description}
              </p>

              <span className="inline-block text-xs font-semibold text-[#141414] bg-[#f3f3f3] px-3.5 py-1 rounded-full">
                {award.voteShare}
              </span>
            </div>

            {/* Winner Visual Showcase */}
            <div className="bg-[#f3f3f3] rounded-[20px] p-8 text-center flex flex-col items-center justify-center space-y-4">
              <div
                className="w-16 h-16 rounded-[30%] squircle text-white flex items-center justify-center font-bold text-2xl shadow-none"
                style={{ backgroundColor: award.iconBg }}
              >
                {award.iconLetter}
              </div>
              <div>
                <b className="block text-lg font-bold text-[#141414]">{award.winnerName} for {award.platform}</b>
                <span className="text-xs text-[#707070]">Verified Production Archive Entry</span>
              </div>

              {/* button-pill-soft: "Explore ↗" */}
              <button
                onClick={() => onNavigate('home')}
                className="bg-[#ffffff] hover:bg-[#e0e0e0] text-[#141414] text-xs font-semibold px-5 py-2.5 rounded-full transition-colors cursor-pointer border border-[#e0e0e0]"
              >
                Explore {award.winnerName} on Mobbin ↗
              </button>
            </div>

            {/* Other Nominees Row */}
            <div className="pt-4 border-t border-[#f0f0f0] space-y-3">
              <span className="text-xs font-semibold text-[#707070] uppercase tracking-wider block">
                Nominees in this category:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {award.nominees.map((nom, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 bg-[#f3f3f3] px-3.5 py-2 rounded-full text-xs font-semibold text-[#141414]"
                  >
                    <div
                      className="w-5 h-5 rounded-[30%] squircle text-white flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: nom.iconBg }}
                    >
                      {nom.letter}
                    </div>
                    <span>{nom.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Curator / Juror Grid Section (portrait-tile: grayscale, rounded-md 24px) */}
      <section className="max-w-5xl mx-auto space-y-8 pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs text-[#707070] font-semibold uppercase tracking-wider block">
            Jury Panel
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display-heavy text-[#141414]">
            Curated by design leaders.
          </h2>
          <p className="text-sm text-[#707070] font-subtitle-light">
            Our jury evaluates real-world accessibility, typographic fidelity, and emotional durability.
          </p>
        </div>

        {/* 4-Up Portrait Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {JURORS.map((juror, idx) => (
            <div
              key={idx}
              className="group relative rounded-[24px] overflow-hidden aspect-4/5 bg-[#141414] border border-[#f0f0f0]"
            >
              <img
                src={juror.imageUrl}
                alt={juror.name}
                className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-300"
              />

              {/* badge-overlay scrim (rgba(115, 115, 115, 0.56)) with white label */}
              <div className="absolute bottom-3 left-3 right-3 bg-[rgba(115,115,115,0.7)] backdrop-blur-md text-white p-3 rounded-[16px] text-center">
                <b className="block text-xs font-bold text-white">{juror.name}</b>
                <span className="text-[10px] text-white/80 block mt-0.5">{juror.role}</span>
                <span className="text-[9px] text-white/60 block">{juror.company}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
