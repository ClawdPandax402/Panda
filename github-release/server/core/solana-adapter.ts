import { Connection, PublicKey, Transaction } from '@solana/web3.js';
interface SolanaConfig {
  rpcUrl: string;
  commitment: 'processed' | 'confirmed' | 'finalized';
}
export class SolanaAdapter {
  private connection: Connection;
  constructor(config: SolanaConfig) {
    this.connection = new Connection(config.rpcUrl, config.commitment);
  }
  async getBalance(wallet: string): Promise<number> {
    const pubkey = new PublicKey(wallet);
    return this.connection.getBalance(pubkey);
  }
  async confirmTransaction(signature: string): Promise<boolean> {
    const result = await this.connection.confirmTransaction(signature);
    return !result.value.err;
  }
  async getLatestBlockhash(): Promise<string> {
    const { blockhash } = await this.connection.getLatestBlockhash();
    return blockhash;
  }
}
