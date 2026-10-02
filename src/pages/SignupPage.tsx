import React, { useState } from 'react';
import { NavTab } from '../components/NavPill';
import { APP_SCREENS } from '../data/mobbinData';
import { DeviceFrame } from '../components/DeviceFrame';

interface SignupPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-4 pb-12 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 rounded-[24px] overflow-hidden border border-[#f0f0f0] bg-white">
        {/* Left Panel: Form Column */}
        <div className="p-8 sm:p-14 flex flex-col justify-between space-y-8">
          <div>
            <button
              onClick={() => onNavigate('home')}
              className="text-xs font-semibold text-[#707070] hover:text-[#141414] flex items-center gap-1.5 mb-8 cursor-pointer"
            >
              ← Back to library
            </button>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold font-display-heavy text-[#141414]">
                Create your account.
              </h2>
              <p className="text-sm text-[#707070] font-body-regular">
                Join 500,000+ designers, product managers, and founders benchmarking product design.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="bg-[#f3f3f3] rounded-[16px] p-6 text-center space-y-3">
              <span className="text-2xl">🎉</span>
              <h3 className="font-heading-tight text-lg font-bold text-[#141414]">Check your inbox!</h3>
              <p className="text-xs text-[#707070] font-body-regular">
                We sent a magic sign-in link to <b className="text-[#141414]">{email}</b>. Click the link to begin exploring.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#0066ff] underline cursor-pointer mt-2"
              >
                Use another email
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Third-party auth: button-outline "Continue with Google" */}
              <button
                type="button"
                onClick={() => {
                  setEmail('designer@example.com');
                  setSubmitted(true);
                }}
                className="w-full bg-[#ffffff] hover:bg-[#f3f3f3] text-[#141414] text-sm font-semibold py-3.5 px-4 rounded-full border border-[#e0e0e0] flex items-center justify-center gap-3 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.25 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.58H1.26C.46 8.18 0 10.02 0 12s.46 3.82 1.26 5.42l4.02-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.26 6.58l4.02 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 text-xs text-[#707070]">
                <div className="h-px bg-[#f0f0f0] flex-1" />
                <span>or</span>
                <div className="h-px bg-[#f0f0f0] flex-1" />
              </div>

              {/* Form with {colors.field} #f0f0f0 inputs, no border, 2px ink ring */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-[#141414] block mb-1">Full name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full bg-[#f0f0f0] text-[#141414] placeholder-[#adadad] text-sm rounded-[16px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#141414] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#141414] block mb-1">Work email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#f0f0f0] text-[#141414] placeholder-[#adadad] text-sm rounded-[16px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#141414] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#141414] block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-[#f0f0f0] text-[#141414] placeholder-[#adadad] text-sm rounded-[16px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#141414] transition-all"
                  />
                </div>

                {/* Primary CTA button-primary */}
                <button
                  type="submit"
                  className="w-full bg-[#141414] hover:bg-[#262626] text-[#ffffff] text-sm font-semibold py-3.5 rounded-full transition-all cursor-pointer shadow-none mt-2"
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {/* Footer fineprint */}
          <p className="text-[11px] text-[#adadad] text-center leading-relaxed">
            By signing up, you agree to Mobbin's{' '}
            <span className="underline text-[#707070] cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline text-[#707070] cursor-pointer">Privacy Policy</span>.
          </p>
        </div>

        {/* Right Panel: Angled Screenshot Marquee (drops on smaller screens) */}
        <div className="hidden lg:flex bg-[#f3f3f3] p-10 flex-col justify-center items-center relative overflow-hidden border-l border-[#f0f0f0]">
          {/* Angled device mockups collage */}
          <div className="relative transform rotate-6 scale-95 space-y-6">
            <div className="flex gap-4">
              <DeviceFrame screen={APP_SCREENS[0]} size="sm" />
              <DeviceFrame screen={APP_SCREENS[1]} size="sm" />
            </div>
            <div className="flex gap-4 -ml-8">
              <DeviceFrame screen={APP_SCREENS[2]} size="sm" />
              <DeviceFrame screen={APP_SCREENS[3]} size="sm" />
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-[16px] p-4 border border-[#e0e0e0] text-center">
            <span className="text-xs font-bold text-[#141414] block">300,000+ Mobile & Web Screens</span>
            <span className="text-[11px] text-[#707070]">Curated daily from verified app store updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};
