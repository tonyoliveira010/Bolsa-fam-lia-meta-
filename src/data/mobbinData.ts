export interface AppScreen {
  id: string;
  appName: string;
  appCategory: string;
  platform: 'iOS' | 'Android' | 'Web';
  screenName: string;
  flowType: 'Onboarding' | 'Paywall' | 'Checkout' | 'Home' | 'Settings' | 'AI & Search';
  dominantColor: string;
  appIconBg: string;
  iconLetter: string;
  rating: number;
  dateAdded: string;
  views: string;
  previewUrl: string;
  description: string;
  highlights: string[];
}

export interface BrandPartner {
  name: string;
  category: string;
  iconBg: string;
  iconTextColor: string;
  letter: string;
  screensCount: number;
}

export interface AwardWinner {
  id: string;
  categoryEyebrow: string;
  winnerName: string;
  platform: string;
  description: string;
  voteShare: string;
  iconBg: string;
  iconLetter: string;
  nominees: { name: string; iconBg: string; letter: string }[];
  accentColor: string;
  previewType: 'app' | 'flow' | 'visual';
}

export interface Juror {
  name: string;
  role: string;
  company: string;
  imageUrl: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl: string;
}

export const BRAND_PARTNERS: BrandPartner[] = [
  { name: 'Linear', category: 'Productivity', iconBg: '#5E6AD2', iconTextColor: '#ffffff', letter: 'L', screensCount: 420 },
  { name: 'Airbnb', category: 'Travel', iconBg: '#FF385C', iconTextColor: '#ffffff', letter: 'A', screensCount: 940 },
  { name: 'Duolingo', category: 'Education', iconBg: '#58CC02', iconTextColor: '#ffffff', letter: 'D', screensCount: 680 },
  { name: 'Spotify', category: 'Music & Audio', iconBg: '#1DB954', iconTextColor: '#000000', letter: 'S', screensCount: 1120 },
  { name: 'Raycast', category: 'Utilities', iconBg: '#FF6363', iconTextColor: '#ffffff', letter: 'R', screensCount: 310 },
  { name: 'Cash App', category: 'Finance', iconBg: '#00D632', iconTextColor: '#ffffff', letter: '$', screensCount: 530 },
  { name: 'Notion', category: 'Workspace', iconBg: '#000000', iconTextColor: '#ffffff', letter: 'N', screensCount: 860 },
  { name: 'Headspace', category: 'Health & Fitness', iconBg: '#F47D31', iconTextColor: '#ffffff', letter: 'H', screensCount: 490 },
  { name: 'Revolut', category: 'Banking', iconBg: '#0075FF', iconTextColor: '#ffffff', letter: 'R', screensCount: 780 },
  { name: 'Figma', category: 'Design', iconBg: '#F24E1E', iconTextColor: '#ffffff', letter: 'F', screensCount: 610 }
];

export const APP_SCREENS: AppScreen[] = [
  {
    id: 'linear-issue-flow',
    appName: 'Linear',
    appCategory: 'Productivity',
    platform: 'iOS',
    screenName: 'Quick Issue Creator with Sub-issues',
    flowType: 'Home',
    dominantColor: '#5E6AD2',
    appIconBg: '#5E6AD2',
    iconLetter: 'L',
    rating: 4.9,
    dateAdded: '2 days ago',
    views: '14.2k',
    previewUrl: 'linear',
    description: 'Ultra-fast modal with markdown shortcuts, inline assignees, priority pills, and project cycles.',
    highlights: ['Keyboard navigation', 'Zero-latency optimistic UI', 'Sub-issue nesting']
  },
  {
    id: 'duolingo-super-paywall',
    appName: 'Duolingo',
    appCategory: 'Education',
    platform: 'iOS',
    screenName: 'Super Duolingo Annual Paywall',
    flowType: 'Paywall',
    dominantColor: '#58CC02',
    appIconBg: '#58CC02',
    iconLetter: 'D',
    rating: 4.8,
    dateAdded: 'Yesterday',
    views: '28.5k',
    previewUrl: 'duolingo',
    description: 'High-conversion gamified paywall emphasizing unlimited hearts, mistake reviews, and a 14-day free trial guarantee.',
    highlights: ['Floating mascot emotion', 'Yearly savings badge', 'Sticky bottom CTA pill']
  },
  {
    id: 'airbnb-booking-flow',
    appName: 'Airbnb',
    appCategory: 'Travel',
    platform: 'iOS',
    screenName: 'Guest Checkout & Price Breakdown',
    flowType: 'Checkout',
    dominantColor: '#FF385C',
    appIconBg: '#FF385C',
    iconLetter: 'A',
    rating: 4.9,
    dateAdded: '3 days ago',
    views: '19.8k',
    previewUrl: 'airbnb',
    description: 'Clean breakdown sheet explaining cleaning fees, Airbnb service charges, and split-payment installment toggles.',
    highlights: ['Transparent fee architecture', 'Klarna/Apple Pay integration', 'Host message note']
  },
  {
    id: 'spotify-now-playing',
    appName: 'Spotify',
    appCategory: 'Music & Audio',
    platform: 'iOS',
    screenName: 'Canvas Now Playing with Real-time Lyrics',
    flowType: 'Home',
    dominantColor: '#1DB954',
    appIconBg: '#1DB954',
    iconLetter: 'S',
    rating: 4.9,
    dateAdded: '4 days ago',
    views: '32.1k',
    previewUrl: 'spotify',
    description: 'Dynamic background gradient extracting album art pigments with synchronized sing-along typography.',
    highlights: ['Micro-vibrations on scrub', 'Seamless Bluetooth handover', 'Social share clip tool']
  },
  {
    id: 'raycast-command-palette',
    appName: 'Raycast',
    appCategory: 'Utilities',
    platform: 'Web',
    screenName: 'AI Extensions Store & Quick Commands',
    flowType: 'AI & Search',
    dominantColor: '#FF6363',
    appIconBg: '#FF6363',
    iconLetter: 'R',
    rating: 5.0,
    dateAdded: '1 week ago',
    views: '24.7k',
    previewUrl: 'raycast',
    description: 'Monochrome keyboard-first interface indexing local scripts, prompt presets, and system automations.',
    highlights: ['Fuzzy search matching', 'Inline shortcut badges', 'Metadata sidebar']
  },
  {
    id: 'headspace-sleep-cast',
    appName: 'Headspace',
    appCategory: 'Health & Fitness',
    platform: 'iOS',
    screenName: 'Wind Down Soundscapes Onboarding',
    flowType: 'Onboarding',
    dominantColor: '#F47D31',
    appIconBg: '#F47D31',
    iconLetter: 'H',
    rating: 4.7,
    dateAdded: '5 days ago',
    views: '11.3k',
    previewUrl: 'headspace',
    description: 'Gentle nighttime step survey assessing bedtime anxiety, sound preferences, and wake-up gentle alarms.',
    highlights: ['Dark-mode warm palette', 'Soft illustration motion', 'Progressive personalization']
  },
  {
    id: 'revolut-crypto-invest',
    appName: 'Revolut',
    appCategory: 'Banking',
    platform: 'Android',
    screenName: 'Multi-Currency Vaults & Spending Analytics',
    flowType: 'Home',
    dominantColor: '#0075FF',
    appIconBg: '#0075FF',
    iconLetter: 'R',
    rating: 4.8,
    dateAdded: '2 weeks ago',
    views: '16.9k',
    previewUrl: 'revolut',
    description: 'Visual cash-flow graph with category budgeting rings and instant peer-to-peer split payment options.',
    highlights: ['Interactive line charts', 'Spare-change rounding vault', 'Biometric confirmation']
  },
  {
    id: 'notion-workspace-setup',
    appName: 'Notion',
    appCategory: 'Workspace',
    platform: 'Web',
    screenName: 'Team Wiki & Template Gallery Onboarding',
    flowType: 'Onboarding',
    dominantColor: '#000000',
    appIconBg: '#000000',
    iconLetter: 'N',
    rating: 4.9,
    dateAdded: '1 week ago',
    views: '21.0k',
    previewUrl: 'notion',
    description: 'Role-based setup determining whether the workspace is for engineering docs, personal journal, or sales pipeline.',
    highlights: ['Immediate live canvas preview', 'Team invite bulk paste', 'Custom icon squircle picker']
  }
];

export const AWARDS_DATA: AwardWinner[] = [
  {
    id: 'app-of-the-year',
    categoryEyebrow: 'App of the Year 2026',
    winnerName: 'Linear Mobile',
    platform: 'iOS & Android',
    description: 'Redefining issue tracking with bespoke gestures, sub-second latency, and ruthless typographic clarity.',
    voteShare: '46.8% of jury & community votes',
    iconBg: '#5E6AD2',
    iconLetter: 'L',
    nominees: [
      { name: 'Cron Calendar', iconBg: '#000000', letter: 'C' },
      { name: 'Raycast', iconBg: '#FF6363', letter: 'R' },
      { name: 'Family', iconBg: '#6B46C1', letter: 'F' }
    ],
    accentColor: '#5E6AD2',
    previewType: 'app'
  },
  {
    id: 'best-onboarding',
    categoryEyebrow: 'Best Onboarding Flow',
    winnerName: 'Duolingo',
    platform: 'iOS',
    description: 'Masterclass in gradual engagement: zero-barrier lesson first, profile and account creation second.',
    voteShare: '52.1% of community votes',
    iconBg: '#58CC02',
    iconLetter: 'D',
    nominees: [
      { name: 'Headspace', iconBg: '#F47D31', letter: 'H' },
      { name: 'Babbel', iconBg: '#FF8800', letter: 'B' },
      { name: 'Brilliant', iconBg: '#1A1A1A', letter: 'B' }
    ],
    accentColor: '#58CC02',
    previewType: 'flow'
  },
  {
    id: 'best-visual-craft',
    categoryEyebrow: 'Best Visual Craft & Micro-Interactions',
    winnerName: 'Arc Search',
    platform: 'iOS & macOS',
    description: 'Pinch-to-summarize gestures, haptic feedback, and delightful AI browsing animations.',
    voteShare: '39.4% of community votes',
    iconBg: '#5347FF',
    iconLetter: 'A',
    nominees: [
      { name: 'Things 3', iconBg: '#2E75D3', letter: 'T' },
      { name: 'Amie', iconBg: '#FF6B6B', letter: 'A' },
      { name: 'Flighty', iconBg: '#0055FF', letter: 'F' }
    ],
    accentColor: '#5347FF',
    previewType: 'visual'
  }
];

export const JURORS: Juror[] = [
  {
    name: 'Karri Saarinen',
    role: 'Co-founder & CEO',
    company: 'Linear',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Rasmus Andersson',
    role: 'Creator of Inter font',
    company: 'Ex-Figma / Spotify',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'Jenny Arden',
    role: 'Chief Design Officer',
    company: 'Zillow',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80'
  },
  {
    name: 'May-Li Khoe',
    role: 'VP of Design',
    company: 'Ex-Apple & Khan Academy',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Brian Chesky',
    role: 'Co-founder & CEO',
    company: 'Airbnb',
    quote: 'Mobbin is our design team’s secret weapon. Whenever we kick off a new flow, our designers start here.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Dylan Field',
    role: 'Co-founder & CEO',
    company: 'Figma',
    quote: 'The breadth and precision of Mobbin’s archive is unmatched. It has permanently changed how product designers benchmark.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Linda Dong',
    role: 'Design Director',
    company: 'Apple',
    quote: 'The cleanest reference library in existence. No clutter, no distractions — just pure interface craft.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  },
  {
    name: 'Guillermo Rauch',
    role: 'CEO',
    company: 'Vercel',
    quote: 'Speed and taste. Mobbin sets the gold standard for design reference tools.',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'
  }
];

export const PRICING_FAQS = [
  {
    q: 'What is included in the Pro plan?',
    a: 'Pro unlocks full access to our entire archive of over 300,000 screens, complete interactive user flows, screen text copying, advanced filters (by UI element, pattern, and color), unlimited personal collections, and the official Mobbin Figma plugin.'
  },
  {
    q: 'How frequently is the library updated?',
    a: 'We publish updates every single week. Our curation team monitors hundreds of iOS, Android, and web apps, capturing new releases, redesigns, and onboarding experiments within hours of launch.'
  },
  {
    q: 'Can I cancel my subscription at any time?',
    a: 'Yes. You can cancel your subscription at any time directly from your account settings. You will retain access until the end of your current billing period.'
  },
  {
    q: 'Do you offer team and enterprise pricing?',
    a: 'Yes. Our Team plan offers shared team collections, centralized billing, and seats for your whole squad. For larger design organizations with custom invoice requirements or SSO, contact our sales team.'
  },
  {
    q: 'What makes Mobbin different from Dribbble or Pinterest?',
    a: 'Mobbin features only real, shipped, production apps — never conceptual mockups or unvetted redesigns. Every screen in Mobbin was captured directly from live apps in the wild.'
  }
];
