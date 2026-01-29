interface X402PaymentRequest {
  version: '1.0';
  price: number;
  recipient: string;
  network: 'mainnet' | 'devnet';
}
interface X402PaymentProof {
  signature: string;
  payer?: string;
  timestamp: number;
}
export class X402Protocol {
  private readonly VERSION = '1.0';
  generatePaymentRequest(config: Omit<X402PaymentRequest, 'version'>): X402PaymentRequest {
    return { version: this.VERSION, ...config };
  }
  parseProofHeader(header: string): X402PaymentProof | null {
    try {
      return JSON.parse(Buffer.from(header, 'base64').toString('utf-8'));
    } catch { return null; }
  }
  encodeProofHeader(proof: X402PaymentProof): string {
    return Buffer.from(JSON.stringify(proof)).toString('base64');
  }
}
export const x402Protocol = new X402Protocol();
