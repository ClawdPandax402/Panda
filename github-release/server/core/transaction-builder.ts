interface TransferParams {
  from: string;
  to: string;
  amount: number;
  token?: string;
  memo?: string;
}
export class TransactionBuilder {
  private instructions: TransferParams[] = [];
  addTransfer(params: TransferParams): this {
    this.instructions.push(params);
    return this;
  }
  build(): { instructions: TransferParams[]; hash: string } {
    const hash = this.computeHash();
    return { instructions: [...this.instructions], hash };
  }
  private computeHash(): string {
    const data = JSON.stringify(this.instructions);
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
    }
    return Math.abs(hash).toString(16);
  }
  clear(): void {
    this.instructions = [];
  }
}
export const transactionBuilder = new TransactionBuilder();
