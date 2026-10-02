import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  Copy,
  QrCode,
  Sparkles,
  Lock,
  ArrowRight,
  Phone,
  User,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';
import { syncPayService } from '../services/syncPayService';
import { triggerCelebration } from '../utils/celebration';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  offerTitle?: string;
  offerPrice?: number;
  initialStep?: 'form' | 'pix';
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  offerTitle = 'Kit Mãe Empreendedora PRO',
  offerPrice = 6.90
}) => {
  // Step 1: Form (Nome, WhatsApp, Email, Senha)
  // Step 2: Pix QR Code & Payment
  // Step 3: Success Confirmation
  const [step, setStep] = useState<'form' | 'pix' | 'success'>('form');

  // Input states
  const [name, setName] = useState(profile.name || '');
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp || '');
  const [email, setEmail] = useState(profile.email || '');
  const [password, setPassword] = useState(profile.password || '');
  const [errorMsg, setErrorMsg] = useState('');

  // Pix states
  const [pixData, setPixData] = useState<{
    identifier: string;
    qrCodeUrl: string;
    copyPaste: string;
    amount: number;
    copied: boolean;
    checking: boolean;
  } | null>(null);

  if (!isOpen) return null;

  // Format WhatsApp as (99) 99999-9999
  const handleWhatsappChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    }
    setWhatsapp(formatted);
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }
    const rawWa = whatsapp.replace(/\D/g, '');
    if (rawWa.length < 10) {
      setErrorMsg('Por favor, informe um WhatsApp válido com DDD.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Por favor, informe um e-mail válido para seu cadastro.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMsg('Por favor, defina uma senha de pelo menos 4 dígitos para seu login.');
      return;
    }

    // Save profile contact & login info right away
    onUpdateProfile({
      ...profile,
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      password: password.trim()
    });

    // Request PIX CashIn from SyncPayments API
    const res = await syncPayService.createPixCashIn({
      amount: offerPrice,
      customerName: name.trim(),
      customerEmail: email.trim(),
      offerTitle: offerTitle
    });

    if (res.success) {
      setPixData({
        identifier: res.identifier,
        qrCodeUrl: res.qrCodeUrl,
        copyPaste: res.copyPaste,
        amount: res.amount,
        copied: false,
        checking: false
      });
      setStep('pix');
    } else {
      setErrorMsg('Não foi possível gerar a chave Pix no momento. Tente novamente.');
    }
  };

  const handleCopyPix = () => {
    if (!pixData) return;
    navigator.clipboard.writeText(pixData.copyPaste);
    setPixData((prev) => (prev ? { ...prev, copied: true } : null));
    setTimeout(() => {
      setPixData((prev) => (prev ? { ...prev, copied: false } : null));
    }, 2500);
  };

  const handleConfirmPaid = () => {
    if (pixData) {
      syncPayService.approveTransaction(pixData.identifier);
    }

    // Grant PRO access
    onUpdateProfile({
      ...profile,
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      password: password.trim(),
      plan: 'pro',
      planPurchasedAt: new Date().toLocaleDateString('pt-BR')
    });

    setStep('success');
    triggerCelebration(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#141414]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 'success') onClose();
      }}
    >
      <div className="bg-[var(--canvas)] text-[var(--ink)] border border-[var(--hairline)] rounded-[28px] max-w-sm w-full p-5 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 bg-[#0066ff] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>Acesso Vitalício PRO</span>
          </div>

          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--ink)] p-1 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: CADASTRO COM NOME, WHATSAPP, EMAIL E SENHA */}
        {step === 'form' && (
          <form onSubmit={handleProceedToPayment} className="space-y-3.5">
            <div>
              <h2 className="text-lg font-bold text-[var(--ink)] leading-tight">
                {offerTitle}
              </h2>
              <p className="text-xs font-light text-[var(--text-muted)] mt-1 leading-snug">
                Informe seus dados para receber o comprovante no WhatsApp e criar seu cadastro seguro de acesso:
              </p>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-[14px] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Inputs de Pagamento: Nome & WhatsApp */}
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-[var(--ink)] flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-[#0066ff]" />
                  <span>Seu Nome Completo (para o pagamento)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Maria da Silva"
                  className="w-full mobbin-input text-xs"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--ink)] flex items-center gap-1.5 mb-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Seu WhatsApp (para suporte & comprovante)</span>
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => handleWhatsappChange(e.target.value)}
                  placeholder="(11) 99876-5432"
                  className="w-full mobbin-input text-xs font-bold"
                  required
                />
              </div>
            </div>

            {/* Inputs de Upgrade / Cadastro: Email & Senha */}
            <div className="space-y-2.5 pt-1 border-t border-[var(--hairline-soft)]">
              <div>
                <label className="text-[11px] font-semibold text-[var(--ink)] flex items-center gap-1.5 mb-1">
                  <Mail className="w-3.5 h-3.5 text-[#0066ff]" />
                  <span>E-mail para seu Login</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: maria.mae@email.com"
                  className="w-full mobbin-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--ink)] flex items-center gap-1.5 mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span>Crie uma Senha para sua Conta</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full mobbin-input text-xs"
                  required
                />
              </div>
            </div>

            {/* Value Badge */}
            <div className="bg-[var(--canvas-soft)] p-3 rounded-[16px] flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] line-through block">De R$ 29,90</span>
                <span className="font-extrabold text-base text-[var(--ink)]">
                  R$ {offerPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Pagamento Único via Pix
              </span>
            </div>

            <button
              type="submit"
              className="w-full btn-primary text-xs py-3.5 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Ir para o Pagamento Pix</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted)] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ambiente 100% Criptografado & Garantia de 7 dias</span>
            </div>
          </form>
        )}

        {/* STEP 2: PIX QR CODE & COPIA E COLA */}
        {step === 'pix' && pixData && (
          <div className="space-y-4 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <QrCode className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                Pix Gerado com Sucesso
              </span>
              <h3 className="text-base font-extrabold text-[var(--ink)] mt-0.5">
                R$ {pixData.amount.toFixed(2).replace('.', ',')}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] font-light mt-0.5">
                Abra seu banco e pague com o QR Code ou copie o código abaixo:
              </p>
            </div>

            {/* QR Code Frame */}
            <div className="bg-white p-3.5 rounded-[20px] inline-block border border-[var(--hairline)] shadow-xs mx-auto">
              <img
                src={pixData.qrCodeUrl}
                alt="QR Code Pix"
                className="w-44 h-44 object-contain mx-auto"
              />
            </div>

            {/* Pix Copia e Cola */}
            <div className="space-y-2">
              <div className="p-2.5 bg-[var(--canvas-soft)] rounded-[14px] text-[11px] font-mono text-[var(--text-muted)] truncate select-all border border-[var(--hairline-soft)]">
                {pixData.copyPaste}
              </div>

              <button
                type="button"
                onClick={handleCopyPix}
                className="w-full py-2.5 px-4 rounded-[14px] bg-[var(--ink)] text-[var(--canvas)] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer hover:opacity-90"
              >
                {pixData.copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Código Pix Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Código Pix</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-1 space-y-2">
              <button
                type="button"
                onClick={handleConfirmPaid}
                className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-2 cursor-pointer shadow-md bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Já fiz o Pix (Liberar Meu Acesso)</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-[11px] text-[var(--text-muted)] hover:underline block mx-auto cursor-pointer"
              >
                Alterar dados de cadastro
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="space-y-4 text-center py-2 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              🎉
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                Conta Ativada com Sucesso
              </span>
              <h3 className="text-lg font-black text-[var(--ink)] mt-0.5">
                Bem-vinda ao Kit Mãe Empreendedora PRO!
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-light mt-1.5 leading-relaxed">
                Seu cadastro foi salvo com sucesso. Todas as ferramentas da plataforma estão 100% liberadas para você.
              </p>
            </div>

            <div className="p-3 bg-[var(--canvas-soft)] rounded-[18px] text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Nome:</span>
                <span className="font-semibold text-[var(--ink)]">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">WhatsApp:</span>
                <span className="font-semibold text-[var(--ink)]">{whatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Login:</span>
                <span className="font-semibold text-[var(--ink)]">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Plano:</span>
                <span className="font-bold text-emerald-600">Vitalício PRO</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full btn-primary text-xs py-3 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Acessar Todas as Ferramentas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
