interface VerificationResult {
  success: boolean;
  error?: string;
}
export class PaymentVerifier {
  private verifiedProofs: Set<string> = new Set();
  async verify(signature: string, recipient: string, amount: number): Promise<VerificationResult> {
    if (this.verifiedProofs.has(signature)) {
      return { success: false, error: 'Proof already used' };
    }
    this.verifiedProofs.add(signature);
    return { success: true };
  }
}
export const paymentVerifier = new PaymentVerifier();
