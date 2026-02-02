import { moltbookPayment } from './moltbook-payment';
import { moltbookCheckout } from './moltbook-checkout';
import { x402Protocol } from '../core/x402-protocol';
import { privacyShield } from '../core/privacy-shield';
interface GatewayConfig {
  merchantId: string;
  enablePrivacy: boolean;
  defaultCurrency: string;
}
interface GatewayTransaction {
  id: string;
  amount: number;
  status: 'success' | 'failed';
  method: 'direct' | 'checkout' | 'x402';
}
export class MoltbookGateway {
  private config: GatewayConfig;
  constructor(config: GatewayConfig) {
    this.config = config;
  }
  async processDirectPayment(amount: number, recipient: string, signature: string): Promise<GatewayTransaction | null> {
    const intent = await moltbookPayment.createIntent(amount, recipient);
    if (!intent) return null;
    const confirmed = await moltbookPayment.confirmPayment(intent.id, signature);
    return { id: intent.id, amount, status: confirmed ? 'success' : 'failed', method: 'direct' };
  }
  async createCheckoutUrl(amount: number, successUrl: string): Promise<string | null> {
    const session = await moltbookCheckout.createSession([{ name: 'Payment', quantity: 1, price: amount }], successUrl, successUrl);
    return session?.url ?? null;
  }
  async processX402(headers: Record<string, string>, amount: number, recipient: string): Promise<GatewayTransaction | null> {
    const sanitized = this.config.enablePrivacy ? privacyShield.sanitize(headers) : headers;
    const proof = x402Protocol.parseProofHeader(sanitized['x-402-proof'] ?? '');
    if (!proof) return null;
    return this.processDirectPayment(amount, recipient, proof.signature);
  }
}
export const createGateway = (config: GatewayConfig) => new MoltbookGateway(config);
