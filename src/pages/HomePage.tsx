import React, { useState } from 'react';
import { APP_SCREENS, BRAND_PARTNERS, TESTIMONIALS, AppScreen } from '../data/mobbinData';
import { DeviceFrame } from '../components/DeviceFrame';
import { NavTab } from '../components/NavPill';

interface HomePageProps {
  onSelectScreen: (screen: AppScreen) => void;
  onNavigate: (tab: NavTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectScreen, onNavigate }) => {
  const [platformFilter, setPlatformFilter] = useState<'All' | 'iOS' | 'Android' | 'Web'>('All');
  const [flowFilter, setFlowFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered screens
  const filteredScreens = APP_SCREENS.filter((screen) => {
    if (platformFilter !== 'All' && screen.platform !== platformFilter) return false;
    if (flowFilter !== 'All' && screen.flowType !== flowFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = screen.appName.toLowerCase().includes(q);
      const matchScreen = screen.screenName.toLowerCase().includes(q);
      const matchCat = screen.appCategory.toLowerCase().includes(q);
      if (!matchName && !matchScreen && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="space-y-24 pt-6">
      {/* 1. Hero Section */}
      <section className="text-center px-4 max-w-4xl mx-auto space-y-6 pt-8 sm:pt-16">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#141414] font-display-heavy leading-[1.0] max-w-3xl mx-auto">
          Discover real-world design inspiration.
        </h1>
        <p className="text-lg sm:text-xl text-[#707070] font-subtitle-light max-w-2xl mx-auto leading-[1.38]">
          Save hours of UI & UX research with our searchable library of over 300,000 real-world screenshots from the best designed apps.
        </p>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('signup')}
            className="bg-[#141414] hover:bg-[#262626] text-[#ffffff] font-semibold text-sm sm:text-base px-7 py-3 rounded-full transition-all cursor-pointer shadow-none"
          >
            Join for free
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('explore-library');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-[#ffffff] hover:bg-[#f3f3f3] text-[#141414] font-semibold text-sm sm:text-base px-7 py-3 rounded-full border border-[#e0e0e0] transition-all cursor-pointer"
          >
            Explore the library
          </button>
        </div>

        {/* Library Counters with floating 30% squircles */}
        <div className="pt-8 relative max-w-xl mx-auto">
          {/* Floating Squircles Left & Right */}
          <div className="hidden sm:flex absolute -left-12 top-2 w-10 h-10 rounded-[30%] squircle bg-[#5E6AD2] text-white items-center justify-center font-bold text-sm select-none animate-bounce duration-1000">
            L
          </div>
          <div className="hidden sm:flex absolute -right-12 top-6 w-10 h-10 rounded-[30%] squircle bg-[#FF385C] text-white items-center justify-center font-bold text-sm select-none animate-pulse">
            A
          </div>
          <div className="hidden sm:flex absolute -left-6 bottom-0 w-8 h-8 rounded-[30%] squircle bg-[#58CC02] text-white items-center justify-center font-bold text-xs select-none">
            D
          </div>
          <div className="hidden sm:flex absolute -right-6 bottom-1 w-8 h-8 rounded-[30%] squircle bg-[#FF6363] text-white items-center justify-center font-bold text-xs select-none">
            R
          </div>

          <div className="grid grid-cols-3 gap-4 border-y border-[#f0f0f0] py-6 text-center">
            <div>
              <b className="block text-xl sm:text-3xl font-display-heavy text-[#141414]">300,000+</b>
              <span className="text-xs sm:text-sm text-[#707070] font-body-regular">Screens archived</span>
            </div>
            <div>
              <b className="block text-xl sm:text-3xl font-display-heavy text-[#141414]">1,000+</b>
              <span className="text-xs sm:text-sm text-[#707070] font-body-regular">Shipped iOS & Web apps</span>
            </div>
            <div>
              <b className="block text-xl sm:text-3xl font-display-heavy text-[#141414]">Weekly</b>
              <span className="text-xs sm:text-sm text-[#707070] font-body-regular">Curation drops</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Full-Bleed Marquee of Brand Chips */}
      <section className="overflow-hidden border-y border-[#f0f0f0] py-4 bg-[#ffffff]">
        <div className="animate-marquee flex items-center gap-6">
          {[...BRAND_PARTNERS, ...BRAND_PARTNERS].map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 shrink-0 px-4 py-2 rounded-full hover:bg-[#f3f3f3] transition-colors cursor-pointer select-none"
            >
              <div
                className="w-9 h-9 rounded-[30%] squircle flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: brand.iconBg, color: brand.iconTextColor }}
              >
                {brand.letter}
              </div>
              <span className="text-base font-semibold text-[#141414] tracking-tight">{brand.name}</span>
              <span className="text-xs text-[#adadad] font-normal">{brand.screensCount} screens</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Main Library Explorer Section */}
      <section id="explore-library" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#f0f0f0]">
          <div>
            <span className="text-xs text-[#707070] font-semibold uppercase tracking-wider block">
              Reference Archive
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display-heavy text-[#141414] mt-1">
              Browse real product flows.
            </h2>
          </div>
          <span className="text-sm text-[#707070] font-body-regular">
            Showing {filteredScreens.length} curated screens from production releases
          </span>
        </div>

        {/* Search Bar ({colors.field} fill, 16px radius, no border, 2px ink focus ring) */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps, screens, UI elements (e.g. Duolingo paywall, Linear issue, Airbnb checkout)..."
            className="w-full bg-[#f0f0f0] text-[#141414] placeholder-[#adadad] text-sm sm:text-base rounded-[16px] px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#141414] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#707070] hover:text-[#141414]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Controls: Platforms & Flows */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* Segmented Platform Toggle */}
          <div className="bg-[#f3f3f3] p-1 rounded-full flex items-center w-max">
            {(['All', 'iOS', 'Android', 'Web'] as const).map((plat) => (
              <button
                key={plat}
                onClick={() => setPlatformFilter(plat)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  platformFilter === plat
                    ? 'bg-[#ffffff] text-[#141414] shadow-xs'
                    : 'text-[#707070] hover:text-[#141414]'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>

          {/* Flow Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {['All', 'Onboarding', 'Paywall', 'Checkout', 'Home', 'AI & Search'].map((flow) => (
              <button
                key={flow}
                onClick={() => setFlowFilter(flow)}
                className={`shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  flowFilter === flow
                    ? 'bg-[#141414] text-[#ffffff]'
                    : 'bg-[#f3f3f3] text-[#707070] hover:text-[#141414]'
                }`}
              >
                {flow}
              </button>
            ))}
          </div>
        </div>

        {/* Screen Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {filteredScreens.map((screen) => (
            <div
              key={screen.id}
              onClick={() => onSelectScreen(screen)}
              className="group bg-[#ffffff] border border-[#f0f0f0] rounded-[24px] p-4 flex flex-col justify-between hover:border-[#e0e0e0] transition-all cursor-pointer"
            >
              {/* Device Frame View */}
              <div className="bg-[#f3f3f3] rounded-[16px] p-3 flex items-center justify-center overflow-hidden group-hover:scale-[1.01] transition-transform">
                <DeviceFrame screen={screen} size="sm" />
              </div>

              {/* Card Meta */}
              <div className="pt-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-[30%] squircle text-white flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: screen.appIconBg }}
                    >
                      {screen.iconLetter}
                    </div>
                    <span className="text-xs font-semibold text-[#141414]">{screen.appName}</span>
                  </div>
                  <span className="text-[11px] text-[#707070] font-medium">{screen.platform}</span>
                </div>

                <h3 className="font-heading-tight text-sm font-semibold text-[#141414] truncate">
                  {screen.screenName}
                </h3>
                <span className="text-xs text-[#707070] block">{screen.flowType} Flow · {screen.views} views</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Testimonials Masonry Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs text-[#707070] font-semibold uppercase tracking-wider block">
            Endorsements
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-display-heavy text-[#141414]">
            Loved by product teams.
          </h2>
          <p className="text-base text-[#707070] font-subtitle-light">
            Design leaders at Apple, Airbnb, and Figma rely on Mobbin every week.
          </p>
        </div>

        {/* 4-Column Masonry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#ffffff] border border-[#f0f0f0] rounded-[16px] p-5 flex flex-col justify-between space-y-4"
            >
              <p className="text-sm text-[#141414] font-body-regular leading-relaxed italic">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-[#f0f0f0]">
                <div className="relative">
                  <img
                    src={t.avatarUrl}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover grayscale"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#141414] text-white flex items-center justify-center text-[8px] font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#141414]">{t.name}</h4>
                  <span className="text-[11px] text-[#707070] block">{t.role}, {t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Pre-Footer Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight font-display-heavy text-[#141414]">
          Ready to design like a Pro?
        </h2>
        <p className="text-base sm:text-lg text-[#707070] font-subtitle-light max-w-lg mx-auto">
          Join over 500,000 product designers and gain unrestricted access to the complete reference library.
        </p>
        <button
          onClick={() => onNavigate('signup')}
          className="bg-[#141414] hover:bg-[#262626] text-[#ffffff] font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all cursor-pointer shadow-none"
        >
          Get started for free
        </button>
      </section>
    </div>
  );
};
