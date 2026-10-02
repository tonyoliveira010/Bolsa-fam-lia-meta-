import React from 'react';

export const BannerMoneySvg: React.FC = () => {
  return (
    <div className="relative h-16 mb-4 select-none pointer-events-none" aria-hidden="true">
      {/* Monochrome Note 1 */}
      <svg
        viewBox="0 0 160 80"
        className="w-28 sm:w-32 absolute left-0 top-2"
        style={{ transform: 'rotate(-5deg)' }}
      >
        <rect width="160" height="80" rx="14" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1.5" />
        <rect x="6" y="6" width="148" height="68" rx="10" fill="none" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="80" cy="40" r="22" fill="#f3f3f3" />
        <text x="80" y="47" textAnchor="middle" fontSize="22" fontWeight="700" fill="#141414" fontFamily="Inter, sans-serif">
          50
        </text>
      </svg>

      {/* Monochrome Note 2 */}
      <svg
        viewBox="0 0 160 80"
        className="w-28 sm:w-32 absolute left-14 top-0"
        style={{ transform: 'rotate(4deg)' }}
      >
        <rect width="160" height="80" rx="14" fill="#141414" />
        <rect x="6" y="6" width="148" height="68" rx="10" fill="none" stroke="#262626" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="80" cy="40" r="22" fill="#262626" />
        <text x="80" y="47" textAnchor="middle" fontSize="22" fontWeight="700" fill="#ffffff" fontFamily="Inter, sans-serif">
          20
        </text>
      </svg>

      {/* Squircle Coin / Badge with electric blue commercial callout */}
      <div className="absolute left-36 top-3 bg-[#0066ff] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
        <span>R$</span>
        <span className="text-[10px] opacity-90">Bolsa Família</span>
      </div>
    </div>
  );
};
