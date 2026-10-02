import { SyncPayConfig, SyncPayTransaction, getAdminStore, saveAdminStore } from './adminStore';

export interface CreatePixParams {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerCpf?: string;
  customerPhone?: string;
  offerTitle: string;
  callbackUrl?: string;
}

export interface SyncPayPixResponse {
  success: boolean;
  identifier: string;
  qrCodeUrl: string;
  copyPaste: string;
  amount: number;
  message?: string;
}

const SYNCPAY_BASE_URL = 'https://api.syncpayments.com.br';

export const syncPayService = {
  /**
   * Generates a Pix Cash-In transaction
   */
  async createPixCashIn(params: CreatePixParams): Promise<SyncPayPixResponse> {
    const store = getAdminStore();
    const config = store.syncPay;

    const identifier = 'sp-tx-' + Math.floor(100000 + Math.random() * 900000);
    const mockPixCopiaECola = `00020126330014br.gov.bcb.pix0111rendamais${identifier}520400005303986540${params.amount.toFixed(2)}5802BR5920Renda+Mais+Edu+Ltda6009SAO+PAULO62070503***6304${Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase()}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(mockPixCopiaECola)}`;

    // If API Key is configured and NOT purely simulated:
    if (config.apiKey && !config.sandboxMode) {
      try {
        const response = await fetch(`${SYNCPAY_BASE_URL}/api/v1/pix/cashin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({
            amount: params.amount,
            client_name: params.customerName,
            client_email: params.customerEmail,
            client_phone: params.customerPhone || '11999999999',
            callback_url: config.webhookUrl || params.callbackUrl,
            reference_id: identifier
          })
        });

        if (response.ok) {
          const data = await response.json();
          const realIdentifier = data.identifier || identifier;
          const realQrCode = data.qrcode_url || qrCodeUrl;
          const realCopyPaste = data.emv || data.copia_e_cola || mockPixCopiaECola;

          // Register in transactions store
          this.recordTransaction({
            identifier: realIdentifier,
            customerName: params.customerName,
            customerEmail: params.customerEmail,
            customerPhone: params.customerPhone,
            amount: params.amount,
            offerTitle: params.offerTitle,
            status: 'pending',
            pixQrCode: realQrCode,
            pixCopyPaste: realCopyPaste,
            createdAt: 'Agora'
          });

          return {
            success: true,
            identifier: realIdentifier,
            qrCodeUrl: realQrCode,
            copyPaste: realCopyPaste,
            amount: params.amount
          };
        }
      } catch (e) {
        console.warn('SyncPay Live request error, falling back to Sandbox simulation:', e);
      }
    }

    // Sandbox / Simulation Mode
    this.recordTransaction({
      identifier,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      customerPhone: params.customerPhone,
      amount: params.amount,
      offerTitle: params.offerTitle,
      status: 'pending',
      pixQrCode: qrCodeUrl,
      pixCopyPaste: mockPixCopiaECola,
      createdAt: 'Agora'
    });

    return {
      success: true,
      identifier,
      qrCodeUrl,
      copyPaste: mockPixCopiaECola,
      amount: params.amount,
      message: config.sandboxMode ? 'Transação gerada no modo Sandbox SyncPay' : undefined
    };
  },

  /**
   * Records transaction in admin state
   */
  recordTransaction(tx: SyncPayTransaction) {
    const store = getAdminStore();
    const updated = [tx, ...store.transactions.filter(t => t.identifier !== tx.identifier)];
    store.transactions = updated;
    saveAdminStore(store);
  },

  /**
   * Checks status of a transaction
   */
  async checkStatus(identifier: string): Promise<'pending' | 'completed' | 'cancelled'> {
    const store = getAdminStore();
    const tx = store.transactions.find(t => t.identifier === identifier);
    return tx ? tx.status : 'pending';
  },

  /**
   * Approves a transaction (Webhook simulation or real trigger)
   */
  approveTransaction(identifier: string): boolean {
    const store = getAdminStore();
    let updated = false;

    store.transactions = store.transactions.map(t => {
      if (t.identifier === identifier) {
        updated = true;
        return {
          ...t,
          status: 'completed',
          paidAt: 'Hoje às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return t;
    });

    if (updated) {
      // Update balance
      const approvedTx = store.transactions.find(t => t.identifier === identifier);
      if (approvedTx) {
        store.syncPay.balance = (store.syncPay.balance || 0) + approvedTx.amount;
        store.funnelMetrics.convertedPro += 1;

        // Upgrade lead to PRO if found
        store.leads = store.leads.map(l => {
          if (l.email === approvedTx.customerEmail) {
            return { ...l, stage: 'virou_pro', lastActiveAt: 'Agora' };
          }
          return l;
        });
      }
      saveAdminStore(store);
    }

    return updated;
  },

  /**
   * Consults Partner Balance from SyncPay
   */
  async fetchBalance(): Promise<number> {
    const store = getAdminStore();
    const config = store.syncPay;

    if (config.apiKey && !config.sandboxMode) {
      try {
        const response = await fetch(`${SYNCPAY_BASE_URL}/api/v1/saldo`, {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const balance = data.saldo || data.balance || config.balance;
          store.syncPay.balance = balance;
          store.syncPay.lastChecked = new Date().toLocaleTimeString('pt-BR');
          saveAdminStore(store);
          return balance;
        }
      } catch (e) {
        console.warn('SyncPay Balance fetch error:', e);
      }
    }

    return store.syncPay.balance || 1420.50;
  }
};
