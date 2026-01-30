import { x402Protocol } from './x402-protocol';
import { paymentVerifier } from './payment-verifier';
import { accessController } from './access-controller';
interface MiddlewareConfig {
  price: number;
  recipient: string;
  network: 'mainnet' | 'devnet';
}
export function createX402Middleware(config: MiddlewareConfig) {
  return async (req: any, res: any, next: any) => {
    const proof = req.headers['x-402-proof'];
    if (!proof) {
      const request = x402Protocol.generatePaymentRequest(config);
      res.status(402).set(x402Protocol.buildResponseHeaders(request)).json({ error: 'Payment required' });
      return;
    }
    const parsed = x402Protocol.parseProofHeader(proof);
    if (!parsed) {
      res.status(400).json({ error: 'Invalid proof format' });
      return;
    }
    const result = await paymentVerifier.verify(parsed.signature, config.recipient, config.price);
    if (!result.success) {
      res.status(402).json({ error: result.error });
      return;
    }
    next();
  };
}
