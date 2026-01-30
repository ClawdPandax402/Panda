interface TokenInfo {
  mint: string;
  symbol: string;
  decimals: number;
  name: string;
}
export class TokenRegistry {
  private tokens: Map<string, TokenInfo> = new Map([
    ['SOL', { mint: 'So11111111111111111111111111111111111111112', symbol: 'SOL', decimals: 9, name: 'Solana' }],
    ['USDC', { mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', symbol: 'USDC', decimals: 6, name: 'USD Coin' }],
  ]);
  getToken(symbol: string): TokenInfo | undefined {
    return this.tokens.get(symbol.toUpperCase());
  }
  registerToken(token: TokenInfo): void {
    this.tokens.set(token.symbol.toUpperCase(), token);
  }
  listTokens(): TokenInfo[] {
    return Array.from(this.tokens.values());
  }
}
export const tokenRegistry = new TokenRegistry();
